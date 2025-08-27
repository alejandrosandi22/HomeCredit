'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Client, ClientStatus } from '@/types/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';

interface ClientTableActionsProps {
  client: Client;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

function ClientTableActions({
  client,
  onView,
  onEdit,
  onDelete,
}: ClientTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Abrir menú</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onView(client)}>
          <Eye className='mr-2 h-4 w-4' />
          Ver detalles
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(client)}>
          <Edit className='mr-2 h-4 w-4' />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(client)}
          className='text-destructive focus:text-destructive'
        >
          <Trash className='mr-2 h-4 w-4' />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getStatusBadge(status: ClientStatus) {
  const statusConfig = {
    ACTIVE: { label: 'Activo', variant: 'default' as const },
    COMPLETED: { label: 'Completado', variant: 'secondary' as const },
    INACTIVE: { label: 'Inactivo', variant: 'secondary' as const },
    SUSPENDED: { label: 'Suspendido', variant: 'destructive' as const },
    PENDING: { label: 'Pendiente', variant: 'outline' as const },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function getLoanStatusBadge(loans: Client['loans']) {
  if (loans.length === 0) {
    return <Badge variant='outline'>Sin préstamos</Badge>;
  }

  const activeLoans = loans.filter((loan) => loan.status === 'ACTIVE').length;
  const completedLoans = loans.filter(
    (loan) => loan.status === 'COMPLETED',
  ).length;
  const defaultedLoans = loans.filter(
    (loan) => loan.status === 'DEFAULTED',
  ).length;

  if (defaultedLoans > 0) {
    return <Badge variant='destructive'>En mora</Badge>;
  } else if (activeLoans > 0) {
    return <Badge variant='default'>Activo</Badge>;
  } else if (completedLoans > 0) {
    return <Badge variant='secondary'>Completado</Badge>;
  }

  return <Badge variant='outline'>Pendiente</Badge>;
}

function getCreditScoreBadge(score: number) {
  if (score >= 750) {
    return <Badge className='bg-green-100 text-green-800'>Excelente</Badge>;
  } else if (score >= 650) {
    return <Badge className='bg-blue-100 text-blue-800'>Bueno</Badge>;
  } else if (score >= 550) {
    return <Badge className='bg-yellow-100 text-yellow-800'>Regular</Badge>;
  } else {
    return <Badge className='bg-red-100 text-red-800'>Malo</Badge>;
  }
}

interface CreateColumnsOptions {
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function createClientColumns({
  onView,
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<Client>[] {
  return [
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='p-0 font-semibold hover:bg-transparent'
        >
          Nombre
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className='font-medium'>
            {client.firstName} {client.lastName}
          </div>
        );
      },
    },
    {
      accessorKey: 'identification',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='p-0 font-semibold hover:bg-transparent'
        >
          Identificación
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className='font-mono'>{row.getValue('identification')}</div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        return (
          <div className='text-muted-foreground text-sm'>
            {row.getValue('email')}
          </div>
        );
      },
    },
    {
      accessorKey: 'creditScore',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='p-0 font-semibold hover:bg-transparent'
        >
          Score Crediticio
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const score = row.getValue('creditScore') as number;
        return (
          <div className='flex items-center space-x-2'>
            <span className='font-semibold'>{score}</span>
            {getCreditScoreBadge(score)}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as ClientStatus;
        return getStatusBadge(status);
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: 'loanStatus',
      header: 'Estado del Préstamo',
      cell: ({ row }) => {
        const loans = row.original.loans;
        return getLoanStatusBadge(loans);
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='p-0 font-semibold hover:bg-transparent'
        >
          Fecha de Registro
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as Date;
        return (
          <div className='text-sm'>
            {new Date(date).toLocaleDateString('es-CR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const client = row.original;
        return (
          <ClientTableActions
            client={client}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      },
    },
  ];
}
