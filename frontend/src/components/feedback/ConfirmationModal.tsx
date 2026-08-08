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
import { Spinner } from "@/components/ui/spinner";
import { buttonVariants } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { TriangleAlert } from "lucide-react";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  onConfirm: () => void;
}

/** Accessible confirmation dialog (AlertDialog wrapper). */
export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  loading,
  icon: Icon = TriangleAlert,
  onConfirm,
}: ConfirmationModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={
                destructive
                  ? "flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                  : "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              }
            >
              <Icon className="size-5" />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            className={buttonVariants({ variant: destructive ? "destructive" : "default" })}
          >
            {loading && <Spinner className="size-4" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
