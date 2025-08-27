'use client';

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
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  Client,
  ClientStatus,
  LoanStatus,
  PaymentStatus,
} from '@/types/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  User,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface ClientDetailsProps {
  client: Client;
  onEdit: () => void;
  onClose: () => void;
}

export default function ClientDetails({
  client,
  onEdit,
  onClose,
}: ClientDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: ClientStatus) => {
    const statusConfig = {
      ACTIVE: {
        label: 'Activo',
        variant: 'default' as const,
        icon: CheckCircle,
      },
      COMPLETED: {
        label: 'Completado',
        variant: 'secondary' as const,
        icon: CheckCircle,
      },
      INACTIVE: {
        label: 'Inactivo',
        variant: 'secondary' as const,
        icon: Clock,
      },
      SUSPENDED: {
        label: 'Suspendido',
        variant: 'destructive' as const,
        icon: XCircle,
      },
      PENDING: {
        label: 'Pendiente',
        variant: 'outline' as const,
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className='flex items-center gap-1'>
        <Icon className='h-3 w-3' />
        {config.label}
      </Badge>
    );
  };

  const getLoanStatusBadge = (status: LoanStatus) => {
    const statusConfig = {
      PENDING: { label: 'Pendiente', variant: 'outline' as const },
      APPROVED: { label: 'Aprobado', variant: 'secondary' as const },
      ACTIVE: { label: 'Activo', variant: 'default' as const },
      COMPLETED: { label: 'Completado', variant: 'secondary' as const },
      DEFAULTED: { label: 'En mora', variant: 'destructive' as const },
      REJECTED: { label: 'Rechazado', variant: 'destructive' as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      PENDING: { label: 'Pendiente', variant: 'outline' as const },
      COMPLETED: { label: 'Completado', variant: 'default' as const },
      FAILED: { label: 'Fallido', variant: 'destructive' as const },
      CANCELLED: { label: 'Cancelado', variant: 'secondary' as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-blue-600';
    if (score >= 550) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCreditScoreProgress = (score: number) => {
    return ((score - 300) / (850 - 300)) * 100;
  };

  const totalLoaned = client.loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPaid = client.payments
    .filter((payment) => payment.status === 'COMPLETED')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const activeLoans = client.loans.filter(
    (loan) => loan.status === 'ACTIVE',
  ).length;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-bold tracking-tight'>
            {client.firstName} {client.lastName}
          </h2>
          <p className='text-muted-foreground'>
            Cliente desde{' '}
            {format(new Date(client.createdAt), 'MMMM yyyy', { locale: es })}
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          {getStatusBadge(client.status)}
          <Button onClick={onEdit} variant='outline'>
            Editar Cliente
          </Button>
          <Button onClick={onClose} variant='ghost'>
            Cerrar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <CreditCard className='text-muted-foreground h-4 w-4' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Score Crediticio</p>
                <p
                  className={`text-2xl font-bold ${getCreditScoreColor(client.creditScore)}`}
                >
                  {client.creditScore}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <DollarSign className='text-muted-foreground h-4 w-4' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Total Prestado</p>
                <p className='text-2xl font-bold'>
                  ₡{totalLoaned.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <TrendingUp className='text-muted-foreground h-4 w-4' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Total Pagado</p>
                <p className='text-2xl font-bold text-green-600'>
                  ₡{totalPaid.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-2'>
              <AlertCircle className='text-muted-foreground h-4 w-4' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Préstamos Activos</p>
                <p className='text-2xl font-bold'>{activeLoans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-4'
      >
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='overview'>Información Personal</TabsTrigger>
          <TabsTrigger value='loans'>Historial de Préstamos</TabsTrigger>
          <TabsTrigger value='payments'>Historial de Pagos</TabsTrigger>
          <TabsTrigger value='analysis'>Análisis Crediticio</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value='overview' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <User className='h-5 w-5' />
                <span>Información Personal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <User className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>Nombre completo:</span>
                  </div>
                  <p>
                    {client.firstName} {client.lastName}
                  </p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <CreditCard className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>Identificación:</span>
                  </div>
                  <p className='font-mono'>{client.identification}</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <Mail className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>Email:</span>
                  </div>
                  <p>{client.email}</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <Phone className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>Teléfono:</span>
                  </div>
                  <p>{client.phone}</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <Calendar className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>Fecha de nacimiento:</span>
                  </div>
                  <p>
                    {format(new Date(client.dateOfBirth), 'PPP', {
                      locale: es,
                    })}
                  </p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <MapPin className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>Dirección:</span>
                  </div>
                  <p>{client.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loans History Tab */}
        <TabsContent value='loans' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Historial de Préstamos</CardTitle>
              <CardDescription>Todos los préstamos del cliente</CardDescription>
            </CardHeader>
            <CardContent>
              {client.loans.length === 0 ? (
                <div className='text-muted-foreground py-8 text-center'>
                  No hay préstamos registrados para este cliente.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Tasa</TableHead>
                      <TableHead>Plazo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Vencimiento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.loans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className='font-medium'>
                          {loan.loanType === 'PERSONAL'
                            ? 'Personal'
                            : loan.loanType === 'MORTGAGE'
                              ? 'Hipotecario'
                              : loan.loanType === 'BUSINESS'
                                ? 'Empresarial'
                                : loan.loanType === 'AUTO'
                                  ? 'Vehículo'
                                  : 'Educación'}
                        </TableCell>
                        <TableCell>₡{loan.amount.toLocaleString()}</TableCell>
                        <TableCell>{loan.interestRate}%</TableCell>
                        <TableCell>{loan.term} meses</TableCell>
                        <TableCell>{getLoanStatusBadge(loan.status)}</TableCell>
                        <TableCell>
                          {format(new Date(loan.dueDate), 'PP', { locale: es })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments History Tab */}
        <TabsContent value='payments' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos</CardTitle>
              <CardDescription>
                Todos los pagos realizados por el cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {client.payments.length === 0 ? (
                <div className='text-muted-foreground py-8 text-center'>
                  No hay pagos registrados para este cliente.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Préstamo ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {format(new Date(payment.paymentDate), 'PPp', {
                            locale: es,
                          })}
                        </TableCell>
                        <TableCell className='font-medium'>
                          ₡{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {payment.paymentMethod === 'CASH'
                            ? 'Efectivo'
                            : payment.paymentMethod === 'BANK_TRANSFER'
                              ? 'Transferencia'
                              : payment.paymentMethod === 'CREDIT_CARD'
                                ? 'Tarjeta de Crédito'
                                : payment.paymentMethod === 'DEBIT_CARD'
                                  ? 'Tarjeta de Débito'
                                  : 'Cheque'}
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(payment.status)}
                        </TableCell>
                        <TableCell className='font-mono'>
                          {payment.loanId}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credit Analysis Tab */}
        <TabsContent value='analysis' className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Score Crediticio</CardTitle>
                <CardDescription>
                  Análisis del puntaje crediticio del cliente
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Puntaje actual</span>
                    <span
                      className={`font-bold ${getCreditScoreColor(client.creditScore)}`}
                    >
                      {client.creditScore}
                    </span>
                  </div>
                  <Progress
                    value={getCreditScoreProgress(client.creditScore)}
                    className='h-2'
                  />
                  <div className='text-muted-foreground flex justify-between text-sm'>
                    <span>300</span>
                    <span>850</span>
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <h4 className='font-medium'>Clasificación</h4>
                  <div className='text-sm'>
                    {client.creditScore >= 750 ? (
                      <div className='flex items-center space-x-2 text-green-600'>
                        <CheckCircle className='h-4 w-4' />
                        <span>Excelente - Riesgo muy bajo</span>
                      </div>
                    ) : client.creditScore >= 650 ? (
                      <div className='flex items-center space-x-2 text-blue-600'>
                        <CheckCircle className='h-4 w-4' />
                        <span>Bueno - Riesgo bajo</span>
                      </div>
                    ) : client.creditScore >= 550 ? (
                      <div className='flex items-center space-x-2 text-yellow-600'>
                        <AlertCircle className='h-4 w-4' />
                        <span>Regular - Riesgo moderado</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-2 text-red-600'>
                        <XCircle className='h-4 w-4' />
                        <span>Malo - Riesgo alto</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
                <CardDescription>
                  Estado financiero general del cliente
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span>Total prestado:</span>
                    <span className='font-bold'>
                      ₡{totalLoaned.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Total pagado:</span>
                    <span className='font-bold text-green-600'>
                      ₡{totalPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Préstamos activos:</span>
                    <span className='font-bold'>{activeLoans}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Total préstamos:</span>
                    <span className='font-bold'>{client.loans.length}</span>
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <h4 className='font-medium'>Estado General</h4>
                  <div className='text-sm'>
                    {client.loans.some(
                      (loan) => loan.status === 'DEFAULTED',
                    ) ? (
                      <div className='flex items-center space-x-2 text-red-600'>
                        <XCircle className='h-4 w-4' />
                        <span>Cliente con préstamos en mora</span>
                      </div>
                    ) : activeLoans > 0 ? (
                      <div className='flex items-center space-x-2 text-blue-600'>
                        <Clock className='h-4 w-4' />
                        <span>Cliente con préstamos activos</span>
                      </div>
                    ) : client.loans.length > 0 ? (
                      <div className='flex items-center space-x-2 text-green-600'>
                        <CheckCircle className='h-4 w-4' />
                        <span>Historial crediticio limpio</span>
                      </div>
                    ) : (
                      <div className='text-muted-foreground flex items-center space-x-2'>
                        <AlertCircle className='h-4 w-4' />
                        <span>Sin historial crediticio</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
