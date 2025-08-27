import { Column, Entity, Index } from "typeorm";

@Index(
  "IX_PreviousApplications_Client_Status",
  [
    "skIdPrev",
    "amtApplication",
    "amtCredit",
    "cntPayment",
    "skIdCurr",
    "nameContractStatus",
  ],
  {}
)
@Entity("PreviousApplications", { schema: "Core" })
export class PreviousApplications {
  @Column("nvarchar", { name: "SK_ID_PREV", nullable: true, length: 50 })
  skIdPrev: string | null;

  @Column("nvarchar", { name: "SK_ID_CURR", nullable: true, length: 50 })
  skIdCurr: string | null;

  @Column("nvarchar", {
    name: "NAME_CONTRACT_TYPE",
    nullable: true,
    length: 50,
  })
  nameContractType: string | null;

  @Column("nvarchar", { name: "AMT_ANNUITY", nullable: true, length: 50 })
  amtAnnuity: string | null;

  @Column("nvarchar", { name: "AMT_APPLICATION", nullable: true, length: 50 })
  amtApplication: string | null;

  @Column("nvarchar", { name: "AMT_CREDIT", nullable: true, length: 50 })
  amtCredit: string | null;

  @Column("nvarchar", { name: "AMT_DOWN_PAYMENT", nullable: true, length: 50 })
  amtDownPayment: string | null;

  @Column("nvarchar", { name: "AMT_GOODS_PRICE", nullable: true, length: 50 })
  amtGoodsPrice: string | null;

  @Column("nvarchar", {
    name: "WEEKDAY_APPR_PROCESS_START",
    nullable: true,
    length: 50,
  })
  weekdayApprProcessStart: string | null;

  @Column("nvarchar", {
    name: "HOUR_APPR_PROCESS_START",
    nullable: true,
    length: 50,
  })
  hourApprProcessStart: string | null;

  @Column("nvarchar", {
    name: "FLAG_LAST_APPL_PER_CONTRACT",
    nullable: true,
    length: 50,
  })
  flagLastApplPerContract: string | null;

  @Column("nvarchar", {
    name: "NFLAG_LAST_APPL_IN_DAY",
    nullable: true,
    length: 50,
  })
  nflagLastApplInDay: string | null;

  @Column("nvarchar", {
    name: "NAME_CASH_LOAN_PURPOSE",
    nullable: true,
    length: 100,
  })
  nameCashLoanPurpose: string | null;

  @Column("nvarchar", {
    name: "NAME_CONTRACT_STATUS",
    nullable: true,
    length: 50,
  })
  nameContractStatus: string | null;

  @Column("nvarchar", { name: "DAYS_DECISION", nullable: true, length: 50 })
  daysDecision: string | null;

  @Column("nvarchar", { name: "NAME_PAYMENT_TYPE", nullable: true, length: 50 })
  namePaymentType: string | null;

  @Column("nvarchar", {
    name: "CODE_REJECT_REASON",
    nullable: true,
    length: 50,
  })
  codeRejectReason: string | null;

  @Column("nvarchar", { name: "NAME_CLIENT_TYPE", nullable: true, length: 50 })
  nameClientType: string | null;

  @Column("nvarchar", {
    name: "NAME_GOODS_CATEGORY",
    nullable: true,
    length: 50,
  })
  nameGoodsCategory: string | null;

  @Column("nvarchar", { name: "NAME_PORTFOLIO", nullable: true, length: 50 })
  namePortfolio: string | null;

  @Column("nvarchar", { name: "CHANNEL_TYPE", nullable: true, length: 50 })
  channelType: string | null;

  @Column("nvarchar", { name: "CNT_PAYMENT", nullable: true, length: 50 })
  cntPayment: string | null;
}
