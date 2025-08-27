'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Client, PaymentStatus } from '@/types/client';
import { LoanDetails, LoanStatus, LoanType } from '@/types/loan';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Hash,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoanDetailsProps {
  loanId: string;
  onBack: () => void;
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

const paymentStatusLabels = {
  [PaymentStatus.PENDING]: 'Pendiente',
  [PaymentStatus.COMPLETED]: 'Completado',
  [PaymentStatus.FAILED]: 'Fallido',
  [PaymentStatus.CANCELLED]: 'Cancelado',
};

const paymentStatusColors = {
  [PaymentStatus.PENDING]:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [PaymentStatus.COMPLETED]:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [PaymentStatus.FAILED]:
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [PaymentStatus.CANCELLED]:
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const paymentStatusIcons = {
  current: CheckCircle,
  late: Clock,
  defaulted: AlertCircle,
};

export default function LoanDetailsComponent({
  loanId,
  onBack,
}: LoanDetailsProps) {
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadLoanDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/loans/${loanId}`);

        if (!response.ok) {
          throw new Error('Error al cargar detalles del préstamo');
        }

        const data = await response.json();
        setLoanDetails(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    loadLoanDetails();
  }, [loanId]);

  const getClientFullName = (client: Client) => {
    if (!client) return 'Cliente no disponible';
    return `${client.firstName} ${client.lastName}`;
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-24' />
          <Skeleton className='h-6 w-48' />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <Skeleton className='mb-2 h-4 w-16' />
                <Skeleton className='h-8 w-24' />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-4'>
        <Button
          variant='ghost'
          onClick={onBack}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Volver
        </Button>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!loanDetails) {
    return null;
  }

  const progressPercentage =
    ((loanDetails.amount - loanDetails.remainingBalance) / loanDetails.amount) *
    100;
  const PaymentStatusIcon = paymentStatusIcons[loanDetails.paymentStatus];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' onClick={onBack} size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver
          </Button>
          <div>
            <h1 className='text-2xl font-bold'>Préstamo #{loanDetails.id}</h1>
            <p className='text-muted-foreground'>
              {getClientFullName(loanDetails.client)} -{' '}
              {loanTypeLabels[loanDetails.loanType]}
            </p>
          </div>
        </div>
        <Badge className={statusColors[loanDetails.status]}>
          {statusLabels[loanDetails.status]}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-2'>
              <DollarSign className='text-muted-foreground h-4 w-4' />
              <p className='text-muted-foreground text-sm font-medium'>
                Monto Original
              </p>
            </div>
            <p className='text-2xl font-bold'>
              ${loanDetails.amount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-2'>
              <TrendingUp className='text-muted-foreground h-4 w-4' />
              <p className='text-muted-foreground text-sm font-medium'>
                Saldo Pendiente
              </p>
            </div>
            <p className='text-2xl font-bold'>
              ${loanDetails.remainingBalance.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-2'>
              <CreditCard className='text-muted-foreground h-4 w-4' />
              <p className='text-muted-foreground text-sm font-medium'>
                Pago Mensual
              </p>
            </div>
            <p className='text-2xl font-bold'>
              ${loanDetails.monthlyPayment.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-2'>
              <PaymentStatusIcon className='text-muted-foreground h-4 w-4' />
              <p className='text-muted-foreground text-sm font-medium'>
                Estado de Pagos
              </p>
            </div>
            <p className='text-2xl font-bold capitalize'>
              {loanDetails.paymentStatus}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Information */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              <div className='flex items-center gap-3'>
                <User className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Nombre Completo
                  </p>
                  <p className='font-medium'>
                    {getClientFullName(loanDetails.client)}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Hash className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Identificación
                  </p>
                  <p className='font-medium'>
                    {loanDetails.client?.identification}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Mail className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-sm'>Email</p>
                  <p className='font-medium'>{loanDetails.client?.email}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Phone className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-sm'>Teléfono</p>
                  <p className='font-medium'>{loanDetails.client?.phone}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <MapPin className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-sm'>Dirección</p>
                  <p className='font-medium'>{loanDetails.client?.address}</p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <TrendingUp className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Score de Crédito
                  </p>
                  <p className='text-lg font-medium'>
                    {loanDetails.client?.creditScore}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Detalles del Préstamo
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-muted-foreground text-sm'>Plazo</p>
                <p className='font-medium'>{loanDetails.term} meses</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Tasa de Interés</p>
                <p className='font-medium'>{loanDetails.interestRate}%</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>
                  Fecha de Aprobación
                </p>
                <p className='font-medium'>
                  {new Date(loanDetails.approvedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>
                  Fecha de Vencimiento
                </p>
                <p className='font-medium'>
                  {new Date(loanDetails.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className='col-span-2'>
                <p className='text-muted-foreground text-sm'>Próximo Pago</p>
                <p className='font-medium'>
                  {loanDetails.nextPaymentDue
                    ? new Date(loanDetails.nextPaymentDue).toLocaleDateString()
                    : 'No hay pagos pendientes'}
                </p>
              </div>
              <div className='col-span-2'>
                <p className='text-muted-foreground text-sm'>Total a Pagar</p>
                <p className='text-lg font-medium'>
                  ${loanDetails.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso del Préstamo</CardTitle>
          <CardDescription>
            Progreso de pagos: ${loanDetails.totalPaid.toLocaleString()} de $
            {loanDetails.amount.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className='h-2 w-full' />
          <p className='text-muted-foreground mt-2 text-sm'>
            {Math.round(progressPercentage)}% completado
          </p>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            Registro completo de todos los pagos realizados y pendientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha Pago</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanDetails.payments.length > 0 ? (
                  loanDetails.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className='font-medium'>
                        ${payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {payment.paymentMethod.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <Badge className={paymentStatusColors[payment.status]}>
                          {paymentStatusLabels[payment.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className='h-24 text-center'>
                      No hay pagos registrados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='h-4 w-4 text-green-600' />
              <p className='text-muted-foreground text-sm font-medium'>
                Total Pagado
              </p>
            </div>
            <p className='text-2xl font-bold text-green-600'>
              ${loanDetails.totalPaid.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-yellow-600' />
              <p className='text-muted-foreground text-sm font-medium'>
                Pagos Pendientes
              </p>
            </div>
            <p className='text-2xl font-bold text-yellow-600'>
              {
                loanDetails.payments.filter(
                  (p) => p.status === PaymentStatus.PENDING,
                ).length
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='h-4 w-4 text-red-600' />
              <p className='text-muted-foreground text-sm font-medium'>
                Pagos Fallidos
              </p>
            </div>
            <p className='text-2xl font-bold text-red-600'>
              {
                loanDetails.payments.filter(
                  (p) => p.status === PaymentStatus.FAILED,
                ).length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      {loanDetails.paymentStatus !== 'current' && (
        <Alert
          variant={
            loanDetails.paymentStatus === 'defaulted'
              ? 'destructive'
              : 'default'
          }
        >
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            {loanDetails.paymentStatus === 'late'
              ? 'Este préstamo tiene pagos atrasados. Se recomienda contactar al cliente.'
              : 'Este préstamo está en estado de incumplimiento. Se requiere acción inmediata.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
