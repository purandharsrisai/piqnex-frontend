import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

export function LogoutButton({ className, size = "sm" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" size={size} className={className}>
        Log out
      </Button>
    </form>
  );
}
