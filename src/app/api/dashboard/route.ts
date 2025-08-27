import type { DashboardData, DashboardResponse } from '@/types/dashboard';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<DashboardResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const region = searchParams.get('region');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');

    // Simular delay para mostrar skeletons
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Datos simulados - en producción vendrían de la base de datos
    const mockData: DashboardData = {
      kpiMetrics: {
        totalLoans: 2456,
        approvedLoans: 1834,
        globalDefaultRate: 5.2,
        averageLoanAmount: 125000,
        totalRevenue: 45600000,
      },
      clientDemographics: [
        { ageRange: '18-25', gender: 'male', count: 234 },
        { ageRange: '18-25', gender: 'female', count: 189 },
        { ageRange: '26-35', gender: 'male', count: 456 },
        { ageRange: '26-35', gender: 'female', count: 398 },
        { ageRange: '36-45', gender: 'male', count: 345 },
        { ageRange: '36-45', gender: 'female', count: 298 },
        { ageRange: '46-55', gender: 'male', count: 234 },
        { ageRange: '46-55', gender: 'female', count: 201 },
        { ageRange: '56+', gender: 'male', count: 123 },
        { ageRange: '56+', gender: 'female', count: 98 },
      ],
      defaultRateData: [
        { loanAmount: 25000, defaultRate: 2.1 },
        { loanAmount: 50000, defaultRate: 3.4 },
        { loanAmount: 75000, defaultRate: 4.2 },
        { loanAmount: 100000, defaultRate: 5.8 },
        { loanAmount: 125000, defaultRate: 6.9 },
        { loanAmount: 150000, defaultRate: 8.1 },
        { loanAmount: 175000, defaultRate: 9.5 },
        { loanAmount: 200000, defaultRate: 11.2 },
        { loanAmount: 225000, defaultRate: 13.8 },
        { loanAmount: 250000, defaultRate: 16.4 },
      ],
      loanStatus: [
        { status: 'approved', count: 1834, percentage: 74.7 },
        { status: 'rejected', count: 445, percentage: 18.1 },
        { status: 'pending', count: 177, percentage: 7.2 },
      ],
      paymentHistory: [
        { month: 'Ene', onTime: 1245, late: 89 },
        { month: 'Feb', onTime: 1298, late: 76 },
        { month: 'Mar', onTime: 1356, late: 94 },
        { month: 'Abr', onTime: 1289, late: 102 },
        { month: 'May', onTime: 1412, late: 67 },
        { month: 'Jun', onTime: 1378, late: 89 },
        { month: 'Jul', onTime: 1456, late: 78 },
        { month: 'Ago', onTime: 1389, late: 91 },
        { month: 'Sep', onTime: 1467, late: 85 },
        { month: 'Oct', onTime: 1523, late: 72 },
        { month: 'Nov', onTime: 1498, late: 88 },
        { month: 'Dic', onTime: 1589, late: 95 },
      ],
      regionRisk: [
        { region: 'San José', riskIndex: 4.2, loanCount: 856 },
        { region: 'Alajuela', riskIndex: 5.8, loanCount: 634 },
        { region: 'Cartago', riskIndex: 3.9, loanCount: 298 },
        { region: 'Heredia', riskIndex: 4.1, loanCount: 445 },
        { region: 'Guanacaste', riskIndex: 6.7, loanCount: 234 },
        { region: 'Puntarenas', riskIndex: 7.2, loanCount: 189 },
        { region: 'Limón', riskIndex: 8.1, loanCount: 156 },
      ],
      creditScoreByOccupation: [
        {
          occupation: 'Profesional',
          averageScore: 745,
          min: 620,
          max: 850,
          q1: 690,
          q3: 800,
          median: 750,
        },
        {
          occupation: 'Técnico',
          averageScore: 698,
          min: 580,
          max: 820,
          q1: 650,
          q3: 740,
          median: 700,
        },
        {
          occupation: 'Empleado',
          averageScore: 652,
          min: 520,
          max: 780,
          q1: 600,
          q3: 700,
          median: 650,
        },
        {
          occupation: 'Comerciante',
          averageScore: 634,
          min: 480,
          max: 750,
          q1: 580,
          q3: 680,
          median: 630,
        },
        {
          occupation: 'Estudiante',
          averageScore: 612,
          min: 450,
          max: 720,
          q1: 560,
          q3: 660,
          median: 610,
        },
        {
          occupation: 'Jubilado',
          averageScore: 687,
          min: 550,
          max: 790,
          q1: 630,
          q3: 740,
          median: 690,
        },
        {
          occupation: 'Otro',
          averageScore: 598,
          min: 420,
          max: 720,
          q1: 540,
          q3: 650,
          median: 600,
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: mockData,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener datos del dashboard',
      },
      { status: 500 },
    );
  }
}
