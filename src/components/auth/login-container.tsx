'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { LoginFormSchema } from '@/lib/validations/auth';
import type { LoginState } from '@/types/auth';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import LoginForm from './login-form';
import SuccessMessage from './success-message';

export default function LoginContainer() {
  const [state, setState] = useState<LoginState>({
    isSubmitting: false,
    isEmailSent: false,
    email: '',
    error: null,
  });

  const handleSubmit = async (data: LoginFormSchema) => {
    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el email');
      }

      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        isEmailSent: true,
        email: data.email,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
    }
  };

  const handleBack = () => {
    setState({
      isSubmitting: false,
      isEmailSent: false,
      email: '',
      error: null,
    });
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-2 text-center'>
        <div className='bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full'>
          <LogIn className='text-primary h-6 w-6' />
        </div>
        <h1 className='text-2xl font-bold'>Iniciar Sesión</h1>
        <p className='text-muted-foreground'>
          Te enviaremos un enlace mágico para acceder
        </p>
      </CardHeader>

      <CardContent>
        {state.isEmailSent ? (
          <SuccessMessage email={state.email} onBack={handleBack} />
        ) : (
          <LoginForm onSubmit={handleSubmit} state={state} />
        )}
      </CardContent>
    </Card>
  );
}
