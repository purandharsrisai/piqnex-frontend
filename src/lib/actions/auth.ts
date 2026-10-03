"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch, ApiError, getCurrentUser } from "@/lib/api-client";
import { AUTH_COOKIE_NAME, decodeJwtPayload } from "@/lib/auth-cookie";
import {
  authSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "./types";

interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string; displayName: string; isAdmin: boolean };
}

/**
 * Stores the backend's JWT in an httpOnly cookie. The backend itself is
 * stateless (no session table) - this cookie is the ONLY place the token
 * lives, read back by api-client.ts's apiFetch() on every subsequent
 * request and sent as `Authorization: Bearer <token>`.
 */
async function setAuthCookie(accessToken: string) {
  const cookieStore = await cookies();
  const payload = decodeJwtPayload(accessToken);
  const maxAge = payload?.exp ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000)) : undefined;

  cookieStore.set(AUTH_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function signUpAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    const response = await apiFetch<AuthResponse>("/auth/signup", {
      method: "POST",
      authenticated: false,
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
        displayName: parsed.data.displayName,
        phone: parsed.data.phone,
      },
    });
    await setAuthCookie(response.accessToken);
  } catch (error) {
    return { status: "error", message: humanizeAuthError(error) };
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function signInAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    const response = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      authenticated: false,
      body: parsed.data,
    });
    await setAuthCookie(response.accessToken);
  } catch (error) {
    return { status: "error", message: humanizeAuthError(error) };
  }

  const redirectTo = String(formData.get("redirectTo") ?? "/profile");
  revalidatePath("/", "layout");
  redirect(redirectTo || "/profile");
}

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    await apiFetch("/auth/change-password", {
      method: "PATCH",
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const lower = error.message.toLowerCase();
      if (error.status === 401 || lower.includes("current password is incorrect")) {
        return {
          status: "error",
          fieldErrors: { currentPassword: "That's not your current password" },
        };
      }
      if (error.status === 409 || lower.includes("different from your current")) {
        return {
          status: "error",
          fieldErrors: { newPassword: "Choose a password you haven't used before" },
        };
      }
      if (lower.includes("new password")) {
        return { status: "error", fieldErrors: { newPassword: error.message } };
      }
    }
    return { status: "error", message: "We couldn't update your password. Please try again." };
  }

  return { status: "success", message: "Password updated." };
}

interface ForgotPasswordResponse {
  message: string;
  /**
   * TEMPORARY: only present because there's no email sending set up yet
   * (see AuthService.forgotPassword on the backend) - the raw reset token
   * is hand carried straight into the next page instead of being emailed.
   * Once email sending is added, the backend stops returning this field
   * and this action's "no token" branch below becomes the only path.
   */
  resetToken?: string;
}

export async function forgotPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  let response: ForgotPasswordResponse;
  try {
    response = await apiFetch<ForgotPasswordResponse>("/auth/forgot-password", {
      method: "POST",
      authenticated: false,
      body: { email: parsed.data.email },
    });
  } catch {
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  if (response.resetToken) {
    redirect(`/reset-password?token=${encodeURIComponent(response.resetToken)}`);
  }

  return { status: "success", message: response.message };
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    await apiFetch("/auth/reset-password", {
      method: "POST",
      authenticated: false,
      body: { token: parsed.data.token, newPassword: parsed.data.newPassword },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        status: "error",
        message: error.message || "This reset link is invalid or has expired.",
      };
    }
    return { status: "error", message: "We couldn't reset your password. Please try again." };
  }

  redirect("/login?reset=success");
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (token) {
    // Stateless JWT - there's nothing server-side to revoke yet, but call
    // the endpoint anyway so logout has one consistent code path if a
    // token blacklist/refresh store is added later (see AuthController).
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Even if the backend call fails (e.g. it's offline), still clear the
      // local cookie below - the user should never get stuck "logged in"
      // on the frontend just because the API didn't respond.
    }
  }

  cookieStore.delete(AUTH_COOKIE_NAME);
  revalidatePath("/", "layout");
  redirect("/");
}

/** Converts a raw backend error into something a normal user understands. */
function humanizeAuthError(error: unknown): string {
  if (error instanceof ApiError) {
    const lower = error.message.toLowerCase();
    if (error.status === 409 || lower.includes("already exists")) {
      return "That email is already registered. Try logging in instead.";
    }
    if (error.status === 401 || lower.includes("invalid email or password")) {
      return "That email or password doesn't match our records.";
    }
    if (lower.includes("password")) {
      return "Password must be at least 8 characters.";
    }
    if (lower.includes("email")) {
      return "Please enter a valid email address.";
    }
  }
  return "Something went wrong. Please try again.";
}
