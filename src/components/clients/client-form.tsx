'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  createClientSchema,
  updateClientSchema,
  type CreateClientFormData,
  type UpdateClientFormData,
} from '@/lib/validations/client';
import { ClientStatus, type Client } from '@/types/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ClientFormProps {
  client?: Client;
  onSubmit: (
    data: CreateClientFormData | UpdateClientFormData,
  ) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ClientForm({
  client,
  onSubmit,
  onCancel,
  isLoading = false,
}: ClientFormProps) {
  const isEditing = Boolean(client);
  const schema = isEditing ? updateClientSchema : createClientSchema;

  const form = useForm<CreateClientFormData | UpdateClientFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: client?.firstName || '',
      lastName: client?.lastName || '',
      identification: client?.identification || '',
      email: client?.email || '',
      phone: client?.phone || '',
      address: client?.address || '',
      dateOfBirth: client?.dateOfBirth || undefined,
      ...(isEditing && { status: client?.status }),
    },
  });

  const handleSubmit = async (
    data: CreateClientFormData | UpdateClientFormData,
  ) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* First Name */}
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre *</FormLabel>
                <FormControl>
                  <Input placeholder='Juan' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos *</FormLabel>
                <FormControl>
                  <Input placeholder='Pérez González' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Identification */}
          <FormField
            control={form.control}
            name='identification'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificación *</FormLabel>
                <FormControl>
                  <Input placeholder='123456789' {...field} />
                </FormControl>
                <FormDescription>Número de cédula o pasaporte</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='juan.perez@email.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono *</FormLabel>
                <FormControl>
                  <Input placeholder='+506 8888-8888' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth */}
          <FormField
            control={form.control}
            name='dateOfBirth'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Fecha de Nacimiento *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  El cliente debe ser mayor de 18 años
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status (only for editing) */}
          {isEditing && (
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccionar estado' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ClientStatus.ACTIVE}>
                        Activo
                      </SelectItem>
                      <SelectItem value={ClientStatus.INACTIVE}>
                        Inactivo
                      </SelectItem>
                      <SelectItem value={ClientStatus.SUSPENDED}>
                        Suspendido
                      </SelectItem>
                      <SelectItem value={ClientStatus.PENDING}>
                        Pendiente
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Address */}
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Dirección completa del cliente'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Incluya provincia, cantón, distrito y señas específicas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className='flex justify-end space-x-2 border-t pt-6'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isEditing ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
