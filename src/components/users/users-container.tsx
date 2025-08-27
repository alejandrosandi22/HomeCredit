'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { UserFormSchema } from '@/lib/validations/user';
import type { User, UsersFilters, UsersState } from '@/types/user';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import DeleteUserDialog from './delete-user-dialog';
import UserFilters from './user-filters';
import UserModal from './user-modal';
import UserTable from './user-table';
import UserTableSkeleton from './user-table-skeleton';

export default function UsersContainer() {
  const { toast } = useToast();
  const [state, setState] = useState<UsersState>({
    users: [],
    isLoading: true,
    error: null,
    selectedUser: null,
    isModalOpen: false,
    modalMode: 'create',
  });

  const [filters, setFilters] = useState<UsersFilters>({
    search: '',
    role: '',
    status: '',
    page: 1,
    limit: 10,
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/users?${params}`);
      if (!response.ok) throw new Error('Error al cargar usuarios');

      const data = await response.json();
      setState((prev) => ({
        ...prev,
        users: data.data || [],
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      }));
    }
  };

  const handleFiltersChange = (newFilters: Partial<UsersFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      role: '',
      status: '',
      page: 1,
      limit: 10,
    });
  };

  const handleCreateUser = () => {
    setState((prev) => ({
      ...prev,
      selectedUser: null,
      isModalOpen: true,
      modalMode: 'create',
    }));
  };

  const handleViewUser = (user: User) => {
    setState((prev) => ({
      ...prev,
      selectedUser: user,
      isModalOpen: true,
      modalMode: 'view',
    }));
  };

  const handleEditUser = (user: User) => {
    setState((prev) => ({
      ...prev,
      selectedUser: user,
      isModalOpen: true,
      modalMode: 'edit',
    }));
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleModalClose = () => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      selectedUser: null,
    }));
    setIsSubmitting(false);
  };

  const handleFormSubmit = async (data: UserFormSchema) => {
    setIsSubmitting(true);

    try {
      const isEdit = state.modalMode === 'edit';
      const url = isEdit
        ? `/api/users/${state.selectedUser?.id}`
        : '/api/users';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error al guardar usuario');

      toast({
        title: isEdit ? 'Usuario actualizado' : 'Usuario creado',
        description: `El usuario ${data.name} ha sido ${isEdit ? 'actualizado' : 'creado'} correctamente.`,
      });

      handleModalClose();
      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar usuario');

      toast({
        title: 'Usuario eliminado',
        description: `El usuario ${userToDelete.name} ha sido eliminado correctamente.`,
      });

      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (state.isLoading) {
    return <UserTableSkeleton />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <Button onClick={handleCreateUser}>
              <Plus className='mr-2 h-4 w-4' />
              Nuevo Usuario
            </Button>
          </div>
          <UserFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </CardHeader>
        <CardContent>
          <UserTable
            users={state.users}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>

      <UserModal
        isOpen={state.isModalOpen}
        onClose={handleModalClose}
        mode={state.modalMode}
        user={state.selectedUser ?? undefined}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        error={state.error ?? undefined}
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        user={userToDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
