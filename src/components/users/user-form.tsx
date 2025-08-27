'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { userSchema, type UserFormSchema } from '@/lib/validations/user';
import type { User } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormSchema) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function UserForm({
  user,
  onSubmit,
  onCancel,
  isSubmitting,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: user || {
      email: '',
      name: '',
      role: 'user',
      status: 'active',
    },
  });

  const roleValue = watch('role');
  const statusValue = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Nombre</Label>
          <Input
            id='name'
            {...register('name')}
            placeholder='Juan Pérez'
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className='text-destructive text-sm'>{errors.name.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            {...register('email')}
            placeholder='juan@ejemplo.com'
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className='text-destructive text-sm'>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='role'>Rol</Label>
          <Select
            value={roleValue}
            onValueChange={(value) =>
              setValue('role', value as 'admin' | 'user')
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder='Seleccionar rol' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='user'>Usuario</SelectItem>
              <SelectItem value='admin'>Administrador</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className='text-destructive text-sm'>{errors.role.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='status'>Estado</Label>
          <Select
            value={statusValue}
            onValueChange={(value) =>
              setValue('status', value as 'active' | 'inactive')
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder='Seleccionar estado' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='active'>Activo</SelectItem>
              <SelectItem value='inactive'>Inactivo</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className='text-destructive text-sm'>{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className='flex justify-end space-x-2 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Guardando...
            </>
          ) : user ? (
            'Actualizar'
          ) : (
            'Crear Usuario'
          )}
        </Button>
      </div>
    </form>
  );
}
