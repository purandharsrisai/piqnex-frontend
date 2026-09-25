import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" size="sm">
        Log out
      </Button>
    </form>
  );
}
