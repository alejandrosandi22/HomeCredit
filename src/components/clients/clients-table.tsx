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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { ApplicationsFinal } from '@/types';
import { Edit, Eye, MoreHorizontal, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ClientsTableProps {
  clients: ApplicationsFinal[];
  loading: boolean;
  onEdit: (client: ApplicationsFinal) => void;
  onView: (client: ApplicationsFinal) => void;
  onDelete: (id: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function ClientsTable({
  clients,
  loading,
  onEdit,
  onView,
  onDelete,
  searchTerm,
  onSearchChange,
}: ClientsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] =
    useState<ApplicationsFinal | null>(null);

  const handleDeleteClick = (client: ApplicationsFinal) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      onDelete(clientToDelete.skIdCurr);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const getTargetBadge = (target: number | null) => {
    if (target === null) return <Badge variant='secondary'>Unknown</Badge>;
    return target === 1 ? (
      <Badge variant='destructive'>Default Risk</Badge>
    ) : (
      <Badge variant='default'>No Risk</Badge>
    );
  };

  const getGenderDisplay = (gender: string | null) => {
    switch (gender) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      case 'XNA':
        return 'Not Available';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Search className='text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Search clients...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='max-w-sm'
            disabled
          />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client ID</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Contract Type</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Credit Amount</TableHead>
                <TableHead>Risk Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className='bg-muted h-4 animate-pulse rounded' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted h-4 animate-pulse rounded' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted h-4 animate-pulse rounded' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted h-4 animate-pulse rounded' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted h-4 animate-pulse rounded' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted h-4 animate-pulse rounded' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted h-4 animate-pulse rounded' />
                  </TableCell>
                  <TableCell>
                    <div className='bg-muted h-4 animate-pulse rounded' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Search className='text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Search clients by ID, occupation, organization, or gender...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='max-w-md'
          />
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client ID</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Contract Type</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Credit Amount</TableHead>
                <TableHead>Risk Status</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className='py-8 text-center'>
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.skIdCurr} className='hover:bg-muted/50'>
                    <TableCell className='font-medium'>
                      {client.skIdCurr}
                    </TableCell>
                    <TableCell>{getGenderDisplay(client.codeGender)}</TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {client.nameContractType || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client.amtIncomeTotal ? client.amtIncomeTotal : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {client.amtCredit ? client.amtCredit : 'N/A'}
                    </TableCell>
                    <TableCell>{getTargetBadge(client.target)}</TableCell>
                    <TableCell className='max-w-[150px] truncate'>
                      {client.occupationType || 'Not specified'}
                    </TableCell>
                    <TableCell>{formatDate(client.createdDate)}</TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => onView(client)}>
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(client)}>
                            <Edit className='mr-2 h-4 w-4' />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(client)}
                            className='text-destructive'
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete client{' '}
              <strong>{clientToDelete?.skIdCurr}</strong> and remove all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete Client
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
