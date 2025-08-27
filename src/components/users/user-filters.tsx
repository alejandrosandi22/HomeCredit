'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { UsersFilters } from '@/types/user';
import { Search, X } from 'lucide-react';

interface UserFiltersProps {
  filters: UsersFilters;
  onFiltersChange: (filters: Partial<UsersFilters>) => void;
  onClearFilters: () => void;
}

export default function UserFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: UserFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.role !== 'all' || filters.status !== 'all';

  return (
    <div className='flex flex-col gap-4 sm:flex-row'>
      <div className='relative flex-1'>
        <Search className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
        <Input
          placeholder='Buscar usuarios...'
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className='pl-9'
        />
      </div>

      <Select
        value={filters.role ?? 'all'}
        onValueChange={(value) => onFiltersChange({ role: value })}
      >
        <SelectTrigger className='w-full sm:w-48'>
          <SelectValue placeholder='Todos los roles' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Todos los roles</SelectItem>
          <SelectItem value='admin'>Administrador</SelectItem>
          <SelectItem value='user'>Usuario</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status ?? 'all'}
        onValueChange={(value) => onFiltersChange({ status: value })}
      >
        <SelectTrigger className='w-full sm:w-48'>
          <SelectValue placeholder='Todos los estados' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Todos los estados</SelectItem>
          <SelectItem value='active'>Activo</SelectItem>
          <SelectItem value='inactive'>Inactivo</SelectItem>
        </SelectContent>
      </Select>

      {/* Botón para limpiar filtros */}
      {hasActiveFilters && (
        <Button
          variant='outline'
          size='icon'
          onClick={onClearFilters}
          className='shrink-0'
        >
          <X className='h-4 w-4' />
        </Button>
      )}
    </div>
  );
}
