/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/clients/page.tsx
'use client';

import ClientDetailView from '@/components/clients/client-detail-view';
import ClientForm from '@/components/clients/client-form';
import ClientsTable from '@/components/clients/clients-table';
import Pagination from '@/components/clients/pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useClientMutations, useClients } from '@/hooks/use-clients';
import { useDebounce } from '@/lib/utils';
import { CreateClientData, UpdateClientData } from '@/lib/validations/client';
import { ApplicationsFinal } from '@/types';
import { AlertCircle, Plus, Users } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export default function ClientsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] =
    useState<ApplicationsFinal | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { clients, pagination, loading, error, refetch } = useClients({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm,
  });

  const {
    createClient,
    updateClient,
    deleteClient,
    loading: mutationLoading,
    error: mutationError,
  } = useClientMutations();

  // Memoized handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleCreateClient = useCallback(
    async (data: CreateClientData) => {
      try {
        await createClient(data);
        setCreateDialogOpen(false);
        refetch();
      } catch (error) {
        // Error is handled by the mutation hook
      }
    },
    [createClient, refetch],
  );

  const handleEditClient = useCallback(
    async (data: UpdateClientData) => {
      if (!selectedClient) return;

      try {
        await updateClient(selectedClient.skIdCurr, data);
        setEditDialogOpen(false);
        setSelectedClient(null);
        refetch();
      } catch (error) {
        // Error is handled by the mutation hook
      }
    },
    [selectedClient, updateClient, refetch],
  );

  const handleDeleteClient = useCallback(
    async (id: number) => {
      try {
        await deleteClient(id);
        refetch();
      } catch (error) {
        // Error is handled by the mutation hook
      }
    },
    [deleteClient, refetch],
  );

  const handleViewClient = useCallback((client: ApplicationsFinal) => {
    setSelectedClient(client);
    setViewDialogOpen(true);
  }, []);

  const handleEditClick = useCallback((client: ApplicationsFinal) => {
    setSelectedClient(client);
    setEditDialogOpen(true);
  }, []);

  // Memoized stats
  const stats = useMemo(() => {
    if (!clients.length) return null;

    const totalRisk = clients.filter((c) => c.target === 1).length;
    const avgIncome =
      clients.reduce((sum, c) => sum + (c.amtIncomeTotal || 0), 0) /
      clients.length;
    const avgCredit =
      clients.reduce((sum, c) => sum + (c.amtCredit || 0), 0) / clients.length;

    return {
      totalClients: pagination?.total || 0,
      riskClients: totalRisk,
      riskPercentage:
        clients.length > 0
          ? ((totalRisk / clients.length) * 100).toFixed(1)
          : '0',
      avgIncome: avgIncome.toLocaleString(),
      avgCredit: avgCredit.toLocaleString(),
    };
  }, [clients, pagination?.total]);

  return (
    <div className='container mx-auto space-y-6 py-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Client Management</h1>
          <p className='text-muted-foreground'>
            Manage your credit application clients and their information
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Add New Client
        </Button>
      </div>

      {/* Error Alert */}
      {(error || mutationError) && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error || mutationError}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Clients
              </CardTitle>
              <Users className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stats.totalClients.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Risk Clients
              </CardTitle>
              <AlertCircle className='text-destructive h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-destructive text-2xl font-bold'>
                {stats.riskClients}
              </div>
              <p className='text-muted-foreground text-xs'>
                {stats.riskPercentage}% of current page
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Avg Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>${stats.avgIncome}</div>
              <p className='text-muted-foreground text-xs'>
                Current page average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Avg Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>${stats.avgCredit}</div>
              <p className='text-muted-foreground text-xs'>
                Current page average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Risk Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.riskPercentage}%</div>
              <p className='text-muted-foreground text-xs'>
                Default probability
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>
            View and manage all client applications and their details
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <ClientsTable
            clients={clients}
            loading={loading}
            onEdit={handleEditClick}
            onView={handleViewClient}
            onDelete={handleDeleteClient}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />

          {pagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              pageSize={pageSize}
              totalItems={pagination.total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Client Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
            <DialogDescription>
              Add a new client to the system with their application details.
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            mode='create'
            onSubmit={handleCreateClient}
            isLoading={mutationLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information and application details.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <ClientForm
              mode='edit'
              client={selectedClient}
              onSubmit={handleEditClient}
              isLoading={mutationLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Client Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>
              View complete client information and application details.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && <ClientDetailView client={selectedClient} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
