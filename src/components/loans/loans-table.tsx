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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Client } from '@/types/client';
import { Loan, LoanStatus, LoanType } from '@/types/loan';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Edit, Eye, MoreHorizontal, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface LoanWithClient extends Loan {
  client: Client;
}

interface LoansTableProps {
  loans: LoanWithClient[];
  isLoading: boolean;
  onEdit: (loan: Loan) => void;
  onView: (loan: Loan) => void;
  onDelete: (loan: Loan) => Promise<void>;
}

const statusLabels = {
  [LoanStatus.PENDING]: 'Pendiente',
  [LoanStatus.APPROVED]: 'Aprobado',
  [LoanStatus.ACTIVE]: 'Activo',
  [LoanStatus.COMPLETED]: 'Completado',
  [LoanStatus.DEFAULTED]: 'Incumplido',
  [LoanStatus.REJECTED]: 'Rechazado',
};

const statusColors = {
  [LoanStatus.PENDING]:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [LoanStatus.APPROVED]:
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [LoanStatus.ACTIVE]:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [LoanStatus.COMPLETED]:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [LoanStatus.DEFAULTED]:
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [LoanStatus.REJECTED]:
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const loanTypeLabels = {
  [LoanType.PERSONAL]: 'Personal',
  [LoanType.MORTGAGE]: 'Hipotecario',
  [LoanType.BUSINESS]: 'Empresarial',
  [LoanType.AUTO]: 'Automotriz',
  [LoanType.EDUCATION]: 'Educativo',
};

export default function LoansTable({
  loans,
  isLoading,
  onEdit,
  onView,
  onDelete,
}: LoansTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null);

  const getClientFullName = (client?: Client) => {
    if (!client) return 'Sin cliente';
    return `${client.firstName} ${client.lastName}`;
  };

  const calculateMonthlyPayment = (
    amount: number,
    term: number,
    interestRate: number,
  ) => {
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, term))) /
      (Math.pow(1 + monthlyRate, term) - 1);
    return Math.round(monthlyPayment * 100) / 100;
  };

  const columns: ColumnDef<LoanWithClient>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div className='font-mono text-sm'>#{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'client',
      header: 'Cliente',
      cell: ({ row }) => {
        const client = row.original.client;
        return (
          <div>
            <div className='font-medium'>{getClientFullName(client)}</div>
            <div className='text-muted-foreground text-sm'>
              Score: {client?.creditScore || 'N/A'}
            </div>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const client = row.original.client;
        if (!client) return false;
        const fullName = getClientFullName(client).toLowerCase();
        return fullName.includes(value.toLowerCase());
      },
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => (
        <div className='font-medium'>
          ${row.getValue<number>('amount').toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'loanType',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge variant='secondary'>
          {loanTypeLabels[row.getValue<LoanType>('loanType')]}
        </Badge>
      ),
    },
    {
      accessorKey: 'term',
      header: 'Plazo',
      cell: ({ row }) => <div>{row.getValue('term')} meses</div>,
    },
    {
      accessorKey: 'interestRate',
      header: 'Tasa',
      cell: ({ row }) => <div>{row.getValue('interestRate')}%</div>,
    },
    {
      id: 'monthlyPayment',
      header: 'Pago Mensual',
      cell: ({ row }) => {
        const loan = row.original;
        const monthlyPayment = calculateMonthlyPayment(
          loan.amount,
          loan.term,
          loan.interestRate,
        );
        return (
          <div className='font-medium'>${monthlyPayment.toLocaleString()}</div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue<LoanStatus>('status');
        return (
          <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
        );
      },
    },
    {
      accessorKey: 'approvedAt',
      header: 'Fecha Aprobación',
      cell: ({ row }) => {
        const date = new Date(row.getValue('approvedAt'));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const loan = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Abrir menú</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onView(loan)}>
                <Eye className='mr-2 h-4 w-4' />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(loan)}>
                <Edit className='mr-2 h-4 w-4' />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setLoanToDelete(loan);
                  setDeleteDialogOpen(true);
                }}
                className='text-red-600 dark:text-red-400'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: loans,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleDelete = async () => {
    if (!loanToDelete) return;

    try {
      await onDelete(loanToDelete);
      setDeleteDialogOpen(false);
      setLoanToDelete(null);
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-4 w-72' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full max-w-sm' />
            <div className='space-y-2'>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Préstamos</CardTitle>
          <CardDescription>
            Gestione todos los préstamos y su información
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Search */}
            <div className='flex items-center space-x-2'>
              <Search className='text-muted-foreground h-4 w-4' />
              <Input
                placeholder='Buscar por cliente...'
                value={
                  (table.getColumn('client')?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table.getColumn('client')?.setFilterValue(event.target.value)
                }
                className='max-w-sm'
              />
            </div>

            {/* Table */}
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='h-24 text-center'
                      >
                        No se encontraron préstamos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className='flex items-center justify-end space-x-2'>
              <div className='text-muted-foreground flex-1 text-sm'>
                Mostrando {table.getRowModel().rows.length} de{' '}
                {table.getFilteredRowModel().rows.length} préstamo(s).
              </div>
              <div className='space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Anterior
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              préstamo
              {loanToDelete &&
                ` #${loanToDelete.id} por $${loanToDelete.amount.toLocaleString()}`}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
