export interface DashboardData {
  loanDistribution: LoanDistributionItem[];
  defaultRiskAnalysis: DefaultRiskItem[];
  creditAmountTrends: CreditTrendItem[];
  applicantDemographics: DemographicsItem[];
  paymentBehavior: PaymentBehaviorItem[];
}

export interface LoanDistributionItem {
  contractType: string;
  count: number;
  percentage: number;
  avgAmount: number;
}

export interface DefaultRiskItem {
  riskCategory: string;
  totalApplications: number;
  defaulted: number;
  defaultRate: number;
  avgCreditAmount: number;
}

export interface CreditTrendItem {
  month: string;
  totalApplications: number;
  avgCreditAmount: number;
  totalCreditAmount: number;
}

export interface DemographicsItem {
  category: string;
  subcategory: string;
  count: number;
  avgIncome: number;
  defaultRate: number;
}

export interface PaymentBehaviorItem {
  paymentStatus: string;
  count: number;
  avgDaysOverdue: number;
  totalDebtAmount: number;
}

export interface DashboardResponse {
  success: boolean;
  data?: DashboardData;
  error?: string;
  message?: string;
  executionTime?: string;
  timestamp: string;
}

export interface DashboardFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  contractType?: string;
  riskCategory?: string;
  incomeRange?: {
    min: number;
    max: number;
  };
}

export interface ComponentDataRequest {
  component:
    | 'loanDistribution'
    | 'defaultRisk'
    | 'creditTrends'
    | 'demographics'
    | 'paymentBehavior';
  filters?: DashboardFilters;
}
