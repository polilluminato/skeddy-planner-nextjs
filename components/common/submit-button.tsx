import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SubmitButton({
  pending,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { pending: boolean }) {
  return (
    <Button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn("h-11 w-full text-base", className)}
      {...props}
    >
      {pending && <Loader2Icon className="animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}
