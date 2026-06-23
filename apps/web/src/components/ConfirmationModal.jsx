
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  title = 'Konfirmasi', 
  message = 'Apakah Anda yakin ingin melanjutkan aksi ini?', 
  confirmText = 'Ya, Lanjutkan', 
  cancelText = 'Batal', 
  onConfirm, 
  isLoading = false,
  variant = 'destructive'
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button variant="outline" className="w-full sm:w-1/2" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'destructive' ? 'destructive' : 'default'} 
            className={`w-full sm:w-1/2 ${variant !== 'destructive' ? 'btn-primary' : ''}`}
            onClick={onConfirm} 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
