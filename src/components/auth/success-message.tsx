'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';

interface SuccessMessageProps {
  email: string;
  onBack: () => void;
}

export default function SuccessMessage({ email, onBack }: SuccessMessageProps) {
  return (
    <Card className='border-0 shadow-none'>
      <CardContent className='space-y-6 pt-6 text-center'>
        <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
          <CheckCircle className='h-6 w-6 text-green-600' />
        </div>

        <div className='space-y-3'>
          <h2 className='text-xl font-semibold'>¡Revisa tu email!</h2>
          <p className='text-muted-foreground'>
            Hemos enviado un enlace de acceso a
          </p>
          <div className='bg-muted flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium'>
            <Mail className='h-4 w-4' />
            {email}
          </div>
        </div>

        <div className='space-y-4'>
          <p className='text-muted-foreground text-xs'>
            El enlace expirará en 15 minutos. Si no ves el email, revisa tu
            carpeta de spam.
          </p>

          <Button variant='outline' onClick={onBack} className='w-full'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver atrás
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
