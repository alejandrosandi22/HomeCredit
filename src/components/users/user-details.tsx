'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { User } from '@/types/user';
import { Activity, Calendar, Mail, Shield } from 'lucide-react';

interface UserDetailsProps {
  user: User;
  onClose: () => void;
}

export default function UserDetails({ user, onClose }: UserDetailsProps) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-4'>
        <Avatar className='h-16 w-16'>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className='text-lg'>
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className='text-lg font-semibold'>{user.name}</h3>
          <p className='text-muted-foreground'>{user.email}</p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <Shield className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground text-sm'>Rol</span>
            </div>
            <Badge
              variant={user.role === 'admin' ? 'default' : 'secondary'}
              className='mt-2'
            >
              {user.role === 'admin' ? 'Administrador' : 'Usuario'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <Activity className='text-muted-foreground h-4 w-4' />
              <span className='text-muted-foreground text-sm'>Estado</span>
            </div>
            <Badge
              variant={user.status === 'active' ? 'default' : 'destructive'}
              className='mt-2'
            >
              {user.status === 'active' ? 'Activo' : 'Inactivo'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center space-x-2'>
          <Mail className='text-muted-foreground h-4 w-4' />
          <span className='text-muted-foreground text-sm'>Email:</span>
          <span className='text-sm'>{user.email}</span>
        </div>

        <div className='flex items-center space-x-2'>
          <Calendar className='text-muted-foreground h-4 w-4' />
          <span className='text-muted-foreground text-sm'>
            Fecha de creación:
          </span>
          <span className='text-sm'>
            {new Date(user.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className='flex items-center space-x-2'>
          <Calendar className='text-muted-foreground h-4 w-4' />
          <span className='text-muted-foreground text-sm'>
            Última actualización:
          </span>
          <span className='text-sm'>
            {new Date(user.updatedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className='flex justify-end pt-4'>
        <Button onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  );
}
