export interface DashboardFilters {
  dateRange: {
    from: string;
    to: string;
  };
  region: string;
  loanAmount: {
    min: number;
    max: number;
  };
}

export interface ClientDemographics {
  ageRange: string;
  gender: 'male' | 'female';
  count: number;
}

export interface DefaultRateData {
  loanAmount: number;
  defaultRate: number;
}

export interface LoanStatus {
  status: 'approved' | 'rejected' | 'pending';
  count: number;
  percentage: number;
}

export interface PaymentHistory {
  month: string;
  onTime: number;
  late: number;
}

export interface RegionRisk {
  region: string;
  riskIndex: number;
  loanCount: number;
}

export interface CreditScoreByOccupation {
  occupation: string;
  averageScore: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  median: number;
}

export interface KPIMetrics {
  totalLoans: number;
  approvedLoans: number;
  globalDefaultRate: number;
  averageLoanAmount: number;
  totalRevenue: number;
}

export interface DashboardData {
  kpiMetrics: KPIMetrics;
  clientDemographics: ClientDemographics[];
  defaultRateData: DefaultRateData[];
  loanStatus: LoanStatus[];
  paymentHistory: PaymentHistory[];
  regionRisk: RegionRisk[];
  creditScoreByOccupation: CreditScoreByOccupation[];
}

export interface DashboardResponse {
  success: boolean;
  data?: DashboardData;
  message?: string;
}
