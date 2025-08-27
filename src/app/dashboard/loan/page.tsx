'use client';

import LoanDetailsComponent from '@/components/loans/loan-details';
import LoanForm from '@/components/loans/loan-form';
import LoansTable from '@/components/loans/loans-table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loan, LoanStatus } from '@/types/loan';
import { AlertCircle, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

type ViewMode = 'list' | 'create' | 'edit' | 'details';

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const loadLoans = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/loans');

      if (!response.ok) {
        throw new Error('Error al cargar préstamos');
      }

      const data = await response.json();
      setLoans(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleCreateSuccess = (newLoan: Loan) => {
    setLoans((prev) => [newLoan, ...prev]);
    setViewMode('list');
    setError('');
  };

  const handleEditSuccess = (updatedLoan: Loan) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === updatedLoan.id ? updatedLoan : loan)),
    );
    setViewMode('list');
    setSelectedLoan(null);
    setError('');
  };

  const handleEdit = (loan: Loan) => {
    setSelectedLoan(loan);
    setViewMode('edit');
  };

  const handleView = (loan: Loan) => {
    setSelectedLoan(loan);
    setViewMode('details');
  };

  const handleDelete = async (loan: Loan) => {
    try {
      const response = await fetch(`/api/loans/${loan.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar préstamo');
      }

      setLoans((prev) => prev.filter((l) => l.id !== loan.id));
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      throw error; // Re-throw to let the table component handle the error state
    }
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedLoan(null);
    setError('');
  };

  const calculateMonthlyPayment = (
    amount: number,
    term: number,
    interestRate: number,
  ) => {
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, term))) /
      (Math.pow(1 + monthlyRate, term) - 1);
    return Math.round(monthlyPayment * 100) / 100;
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'create':
        return (
          <LoanForm onSuccess={handleCreateSuccess} onCancel={handleBack} />
        );

      case 'edit':
        return selectedLoan ? (
          <LoanForm
            editLoan={selectedLoan}
            onSuccess={handleEditSuccess}
            onCancel={handleBack}
          />
        ) : null;

      case 'details':
        return selectedLoan ? (
          <LoanDetailsComponent loanId={selectedLoan.id} onBack={handleBack} />
        ) : null;

      default:
        return (
          <div className='space-y-6'>
            {/* Header */}
            <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
              <div>
                <h1 className='text-3xl font-bold tracking-tight'>Préstamos</h1>
                <p className='text-muted-foreground'>
                  Gestiona todos los préstamos de tu cartera
                </p>
              </div>
              <Button
                onClick={() => setViewMode('create')}
                className='flex items-center gap-2'
              >
                <Plus className='h-4 w-4' />
                Nuevo Préstamo
              </Button>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Summary Cards */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div className='bg-card text-card-foreground rounded-lg border p-6 shadow-sm'>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 rounded-full bg-blue-600'></div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Total Préstamos
                  </p>
                </div>
                <p className='text-2xl font-bold'>{loans.length}</p>
              </div>

              <div className='bg-card text-card-foreground rounded-lg border p-6 shadow-sm'>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 rounded-full bg-green-600'></div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Préstamos Activos
                  </p>
                </div>
                <p className='text-2xl font-bold'>
                  {
                    loans.filter((loan) => loan.status === LoanStatus.ACTIVE)
                      .length
                  }
                </p>
              </div>

              <div className='bg-card text-card-foreground rounded-lg border p-6 shadow-sm'>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 rounded-full bg-yellow-600'></div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Monto Total
                  </p>
                </div>
                <p className='text-2xl font-bold'>
                  $
                  {loans
                    .reduce((sum, loan) => sum + loan.amount, 0)
                    .toLocaleString()}
                </p>
              </div>

              <div className='bg-card text-card-foreground rounded-lg border p-6 shadow-sm'>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 rounded-full bg-purple-600'></div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Ingresos Mensuales
                  </p>
                </div>
                <p className='text-2xl font-bold'>
                  $
                  {loans
                    .filter((loan) => loan.status === LoanStatus.ACTIVE)
                    .reduce((sum, loan) => {
                      const monthlyPayment = calculateMonthlyPayment(
                        loan.amount,
                        loan.term,
                        loan.interestRate,
                      );
                      return sum + monthlyPayment;
                    }, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='bg-card text-card-foreground rounded-lg border p-4 shadow-sm'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground text-sm'>
                      Préstamos Aprobados
                    </p>
                    <p className='text-xl font-bold text-blue-600'>
                      {
                        loans.filter(
                          (loan) => loan.status === LoanStatus.APPROVED,
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-card text-card-foreground rounded-lg border p-4 shadow-sm'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground text-sm'>
                      Préstamos Completados
                    </p>
                    <p className='text-xl font-bold text-green-600'>
                      {
                        loans.filter(
                          (loan) => loan.status === LoanStatus.COMPLETED,
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-card text-card-foreground rounded-lg border p-4 shadow-sm'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground text-sm'>
                      Préstamos en Incumplimiento
                    </p>
                    <p className='text-xl font-bold text-red-600'>
                      {
                        loans.filter(
                          (loan) => loan.status === LoanStatus.DEFAULTED,
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loans Table */}
            <LoansTable
              loans={loans}
              isLoading={isLoading}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          </div>
        );
    }
  };

  return <div className='container mx-auto px-4 py-6'>{renderContent()}</div>;
}
