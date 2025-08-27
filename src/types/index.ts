export interface ApplicationsFinal {
  skIdCurr: number;
  target: number | null;
  nameContractType: string | null;
  codeGender: string | null;
  flagOwnCar: number | null;
  flagOwnRealty: number | null;
  cntChildren: number | null;
  amtIncomeTotal: number | null;
  amtCredit: number | null;
  amtAnnuity: number | null;
  amtGoodsPrice: number | null;
  daysBirth: number | null;
  daysEmployed: number | null;
  occupationType: string | null;
  organizationType: string | null;
  extSource1: number | null;
  extSource2: number | null;
  extSource3: number | null;
  weekdayApprProcessStart: string | null;
  hourApprProcessStart: number | null;
  createdDate: Date | null;
}

export interface PreviousApplicationsFinal {
  skIdPrev: number;
  skIdCurr: number | null;
  nameContractType: string | null;
  amtApplication: number | null;
  amtCredit: number | null;
  nameContractStatus: string | null;
  nameClientType: string | null;
  cntPayment: number | null;
  daysDecision: number | null;
  createdDate: Date | null;
}

export interface CreditHistoryFinal {
  skIdBureau: number;
  skIdCurr: number | null;
  creditActive: string | null;
  creditType: string | null;
  amtCreditSum: number | null;
  amtCreditSumDebt: number | null;
  amtCreditSumLimit: number | null;
  daysCredit: number | null;
  creditDayOverdue: number | null;
  createdDate: Date | null;
}

export interface InstallmentsPayments {
  skIdPrev: string | null;
  skIdCurr: string | null;
  numInstalmentVersion: string | null;
  numInstalmentNumber: string | null;
  daysInstalment: string | null;
  daysEntryPayment: string | null;
  amtInstalment: string | null;
  amtPayment: string | null;
}

export interface CreditCardBalance {
  skIdPrev: string | null;
  skIdCurr: string | null;
  monthsBalance: string | null;
  amtBalance: string | null;
  amtCreditLimitActual: string | null;
  amtDrawingsAtmCurrent: string | null;
  amtDrawingsCurrent: string | null;
  amtDrawingsOtherCurrent: string | null;
  amtDrawingsPosCurrent: string | null;
  amtInstMinRegularity: string | null;
  amtPaymentCurrent: string | null;
  amtPaymentTotalCurrent: string | null;
  amtReceivablePrincipal: string | null;
  amtRecivable: string | null;
  amtTotalReceivable: string | null;
  cntDrawingsAtmCurrent: string | null;
  cntDrawingsCurrent: string | null;
  cntDrawingsOtherCurrent: string | null;
  cntDrawingsPosCurrent: string | null;
  cntInstalmentMatureCum: string | null;
  nameContractStatus: string | null;
  skDpd: string | null;
  skDpdDef: string | null;
}

export interface POSCashBalance {
  skIdPrev: string | null;
  skIdCurr: string | null;
  monthsBalance: string | null;
  cntInstalment: string | null;
  cntInstalmentFuture: string | null;
  nameContractStatus: string | null;
  skDpd: string | null;
  skDpdDef: string | null;
}

export interface CreditBureauBalance {
  skIdBureau: string | null;
  monthsBalance: string | null;
  status: string | null;
}

export interface TransactionLog {
  auditId: number;
  tableName: string;
  operation: string;
  recordId: string;
  oldValues: string | null;
  newValues: string | null;
  userName: string;
  auditDate: Date;
  applicationName: string | null;
  hostName: string | null;
}
