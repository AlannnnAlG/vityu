
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const CheckoutProtectionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl">Authentication Required</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Anda harus login terlebih dahulu untuk melanjutkan proses checkout pesanan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button variant="outline" className="w-full sm:w-1/3" onClick={onClose}>
            Batal
          </Button>
          <div className="flex w-full sm:w-2/3 gap-3">
            <Button 
              className="w-full bg-secondary hover:bg-secondary/90 text-white" 
              onClick={() => { onClose(); navigate('/register'); }}
            >
              Daftar
            </Button>
            <Button 
              className="w-full btn-primary" 
              onClick={() => { onClose(); navigate('/login'); }}
            >
              Login
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutProtectionModal;
