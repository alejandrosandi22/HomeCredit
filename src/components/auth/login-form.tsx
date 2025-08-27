'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginFormSchema } from '@/lib/validations/auth';
import type { LoginState } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface LoginFormProps {
  onSubmit: (data: LoginFormSchema) => Promise<void>;
  state: LoginState;
}

export default function LoginForm({ onSubmit, state }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='space-y-2'>
        <div className='relative'>
          <Mail className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
          <Input
            {...register('email')}
            type='email'
            placeholder='tu@email.com'
            className='pl-10'
            disabled={state.isSubmitting}
          />
        </div>
        {errors.email && (
          <p className='text-destructive text-sm'>{errors.email.message}</p>
        )}
      </div>

      {state.error && (
        <Alert variant='destructive'>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type='submit' className='w-full' disabled={state.isSubmitting}>
        {state.isSubmitting ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Enviando...
          </>
        ) : (
          'Continuar con Email'
        )}
      </Button>
    </form>
  );
}
