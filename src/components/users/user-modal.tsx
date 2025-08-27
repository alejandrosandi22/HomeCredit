'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { UserFormSchema } from '@/lib/validations/user';
import type { User } from '@/types/user';
import { AlertTriangle } from 'lucide-react';
import UserDetails from './user-details';
import UserForm from './user-form';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  user?: User;
  onSubmit: (data: UserFormSchema) => Promise<void>;
  isSubmitting: boolean;
  error?: string;
}

export default function UserModal({
  isOpen,
  onClose,
  mode,
  user,
  onSubmit,
  isSubmitting,
  error,
}: UserModalProps) {
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Crear Usuario';
      case 'edit':
        return 'Editar Usuario';
      case 'view':
        return 'Detalles del Usuario';
      default:
        return 'Usuario';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mode === 'view' && user ? (
          <UserDetails user={user} onClose={onClose} />
        ) : (
          <UserForm
            user={user}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
