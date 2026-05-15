import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onStay: () => void;
  onLogout: () => void;
  countdown: number;
}

export function SessionTimeoutModal({
  isOpen,
  onStay,
  onLogout,
  countdown,
}: SessionTimeoutModalProps) {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you still there?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out in {countdown} seconds due to inactivity.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <button onClick={onLogout}>Log Out</button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button onClick={onStay}>Stay Logged In</button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
