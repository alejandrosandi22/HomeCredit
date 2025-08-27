// src/components/clients/clients-page-content.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ClientFiltersFormData } from '@/lib/validations/client';
import type {
  Client,
  ClientListResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from '@/types/client';
import {
  AlertTriangle,
  CheckCircle,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import ClientDialog from './client-dialog';
import ClientFilters from './client-filters';
import ClientTable from './client-table';

interface ClientStats {
  totalClients: number;
  activeClients: number;
  clientsWithActiveLoans: number;
  averageCreditScore: number;
}

export default function ClientsPageContent() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Removed unused pageSize state variable
  const [filters, setFilters] = useState<ClientFiltersFormData>({
    search: '',
    page: 1,
    limit: 10,
  });
  const [stats, setStats] = useState<ClientStats>({
    totalClients: 0,
    activeClients: 0,
    clientsWithActiveLoans: 0,
    averageCreditScore: 0,
  });

  // Dialog states
  const [dialogMode, setDialogMode] = useState<
    'create' | 'edit' | 'view' | 'delete' | null
  >(null);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();

  // Fetch clients data
  const fetchClients = useCallback(
    async (currentFilters: ClientFiltersFormData) => {
      try {
        setIsLoading(true);

        const searchParams = new URLSearchParams();
        if (currentFilters.search)
          searchParams.set('search', currentFilters.search);
        if (currentFilters.status)
          searchParams.set('status', currentFilters.status);
        if (currentFilters.loanType)
          searchParams.set('loanType', currentFilters.loanType);
        if (currentFilters.loanStatus)
          searchParams.set('loanStatus', currentFilters.loanStatus);
        if (currentFilters.creditScore?.min) {
          searchParams.set(
            'creditScoreMin',
            currentFilters.creditScore.min.toString(),
          );
        }
        if (currentFilters.creditScore?.max) {
          searchParams.set(
            'creditScoreMax',
            currentFilters.creditScore.max.toString(),
          );
        }
        searchParams.set('page', currentFilters.page?.toString() || '1');
        searchParams.set('limit', currentFilters.limit?.toString() || '10');

        const response = await fetch(`/api/clients?${searchParams.toString()}`);

        if (!response.ok) {
          throw new Error('Error al cargar los clientes');
        }

        const data: ClientListResponse = await response.json();

        setClients(data.clients);
        setTotalCount(data.totalCount);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);

        // Calculate stats
        const activeClients = data.clients.filter(
          (client) => client.status === 'ACTIVE',
        ).length;
        const clientsWithActiveLoans = data.clients.filter((client) =>
          client.loans.some((loan) => loan.status === 'ACTIVE'),
        ).length;
        const averageCreditScore =
          data.clients.length > 0
            ? Math.round(
                data.clients.reduce(
                  (sum, client) => sum + client.creditScore,
                  0,
                ) / data.clients.length,
              )
            : 0;

        setStats({
          totalClients: data.totalCount,
          activeClients,
          clientsWithActiveLoans,
          averageCreditScore,
        });
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Error al cargar los clientes');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Initial load
  useEffect(() => {
    fetchClients(filters);
  }, []);

  // Handle filters change
  const handleFiltersChange = useCallback(
    (newFilters: ClientFiltersFormData) => {
      const updatedFilters = { ...newFilters, page: 1 }; // Reset to first page when filters change
      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchClients(updatedFilters);
    },
    [fetchClients],
  );

  // Handle pagination
  const handlePageChange = useCallback(
    (page: number) => {
      const updatedFilters = { ...filters, page };
      setFilters(updatedFilters);
      setCurrentPage(page);
      fetchClients(updatedFilters);
    },
    [filters, fetchClients],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      const updatedFilters = { ...filters, limit: newPageSize, page: 1 };
      setFilters(updatedFilters);
      // Removed setPageSize since it's not used
      setCurrentPage(1);
      fetchClients(updatedFilters);
    },
    [filters, fetchClients],
  );

  // Handle search
  const handleSearch = useCallback(
    (search: string) => {
      const updatedFilters = { ...filters, search, page: 1 };
      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchClients(updatedFilters);
    },
    [filters, fetchClients],
  );

  // Dialog handlers
  const openCreateDialog = () => {
    setSelectedClient(undefined);
    setDialogMode('create');
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setDialogMode('edit');
  };

  const openViewDialog = (client: Client) => {
    setSelectedClient(client);
    setDialogMode('view');
  };

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setDialogMode('delete');
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedClient(undefined);
  };

  // CRUD operations
  const handleCreateClient = async (data: CreateClientRequest) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al crear el cliente');
      }

      toast.success('Cliente creado exitosamente');
      closeDialog();
      await fetchClients(filters); // Refresh the list
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Error al crear el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateClient = async (data: UpdateClientRequest) => {
    if (!selectedClient) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el cliente');
      }

      toast.success('Cliente actualizado exitosamente');
      closeDialog();
      await fetchClients(filters); // Refresh the list
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Error al actualizar el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el cliente');
      }

      toast.success('Cliente eliminado exitosamente');
      closeDialog();
      await fetchClients(filters); // Refresh the list
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Error al eliminar el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (
    data: CreateClientRequest | UpdateClientRequest,
  ) => {
    if (dialogMode === 'create') {
      await handleCreateClient(data as CreateClientRequest);
    } else if (dialogMode === 'edit') {
      await handleUpdateClient(data as UpdateClientRequest);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Gestión de Clientes
        </h1>
        <p className='text-muted-foreground'>
          Administra y consulta la información de los clientes del sistema
          financiero.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Clientes
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats.totalClients.toLocaleString()}
            </div>
            <p className='text-muted-foreground text-xs'>
              Clientes registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Clientes Activos
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats.activeClients.toLocaleString()}
            </div>
            <p className='text-muted-foreground text-xs'>Con estado activo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Con Préstamos Activos
            </CardTitle>
            <AlertTriangle className='h-4 w-4 text-yellow-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats.clientsWithActiveLoans.toLocaleString()}
            </div>
            <p className='text-muted-foreground text-xs'>
              Clientes con préstamos vigentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Score Promedio
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.averageCreditScore}</div>
            <p className='text-muted-foreground text-xs'>
              Puntaje crediticio promedio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-xl font-semibold'>Lista de Clientes</h2>
          <p className='text-muted-foreground text-sm'>
            Gestiona la información de todos los clientes registrados
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className='mr-2 h-4 w-4' />
          Nuevo Cliente
        </Button>
      </div>

      {/* Filters */}
      <ClientFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />

      {/* Table */}
      <Card>
        <CardContent className='p-0'>
          <ClientTable
            data={clients}
            isLoading={isLoading}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={handleSearch}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ClientDialog
        mode={dialogMode}
        client={selectedClient}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={handleSubmit}
        onConfirmDelete={handleDeleteClient}
        isLoading={isSubmitting}
      />
    </div>
  );
}
