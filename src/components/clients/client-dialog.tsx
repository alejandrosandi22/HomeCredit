// src/components/clients/client-dialog.tsx
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from '@/types/client';
import ClientDetails from './client-details';
import ClientForm from './client-form';

interface ClientDialogProps {
  mode: 'create' | 'edit' | 'view' | 'delete' | null;
  client?: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CreateClientRequest | UpdateClientRequest) => Promise<void>;
  onConfirmDelete?: () => Promise<void>;
  isLoading?: boolean;
}

export default function ClientDialog({
  mode,
  client,
  open,
  onOpenChange,
  onSubmit,
  onConfirmDelete,
  isLoading = false,
}: ClientDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleEditMode = () => {
    // This would be handled by the parent component
    // by changing the mode to "edit"
  };

  // Create/Edit Dialog
  if (mode === 'create' || mode === 'edit') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Crear Nuevo Cliente' : 'Editar Cliente'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Complete la información para registrar un nuevo cliente en el sistema.'
                : 'Modifique los datos del cliente. Los cambios se guardarán inmediatamente.'}
            </DialogDescription>
          </DialogHeader>

          {onSubmit && (
            <ClientForm
              client={mode === 'edit' ? client : undefined}
              onSubmit={onSubmit}
              onCancel={handleClose}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // View Details Sheet (larger screen real estate for details)
  if (mode === 'view' && client) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side='right'
          className='w-[800px] overflow-y-auto sm:w-[900px] sm:max-w-[90vw]'
        >
          <SheetHeader>
            <SheetTitle>Detalles del Cliente</SheetTitle>
            <SheetDescription>
              Información completa y historial del cliente seleccionado.
            </SheetDescription>
          </SheetHeader>

          <div className='mt-6'>
            <ClientDetails
              client={client}
              onEdit={handleEditMode}
              onClose={handleClose}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Delete Confirmation Dialog
  if (mode === 'delete' && client) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className='space-y-2'>
              <p>
                Esta acción eliminará permanentemente al cliente{' '}
                <span className='font-semibold'>
                  {client.firstName} {client.lastName}
                </span>{' '}
                y todos sus datos asociados.
              </p>
              <p className='text-muted-foreground text-sm'>
                <strong>Nota:</strong> Si el cliente tiene préstamos activos o
                historial de pagos, considere suspender la cuenta en lugar de
                eliminarla para mantener la integridad de los registros
                financieros.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              disabled={isLoading}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isLoading ? 'Eliminando...' : 'Eliminar Cliente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return null;
}
