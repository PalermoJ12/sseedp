import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  variant?: 'default' | 'destructive';
};

export default function modal({
  isOpen,
  onClose,
  title,
  children,
  confirmText = 'Confirm',
  onConfirm,
  variant = 'default',
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-2">{children}</div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className='hover:cursor-pointer'>
            Cancel
          </Button>
          {onConfirm && (
            <Button variant={variant} onClick={onConfirm} className='hover:cursor-pointer'>
              {confirmText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
