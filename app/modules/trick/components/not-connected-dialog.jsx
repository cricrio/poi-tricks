import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/modules/ui";

export function NotConnectedDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Save</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>You are not connected.</DialogTitle>
          <DialogDescription>
            You need to be connected to save tricks.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
