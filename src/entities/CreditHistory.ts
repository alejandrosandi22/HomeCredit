import { Column, Entity, Index } from "typeorm";

@Index(
  "IX_CreditHistory_Client_Active",
  [
    "amtCreditSum",
    "amtCreditSumDebt",
    "creditDayOverdue",
    "skIdCurr",
    "creditActive",
    "creditType",
  ],
  {}
)
@Entity("CreditHistory", { schema: "CreditBureau" })
export class CreditHistory {
  @Column("nvarchar", { name: "SK_ID_CURR", nullable: true, length: 50 })
  skIdCurr: string | null;

  @Column("nvarchar", { name: "SK_ID_BUREAU", nullable: true, length: 50 })
  skIdBureau: string | null;

  @Column("nvarchar", { name: "CREDIT_ACTIVE", nullable: true, length: 50 })
  creditActive: string | null;

  @Column("nvarchar", { name: "CREDIT_CURRENCY", nullable: true, length: 50 })
  creditCurrency: string | null;

  @Column("nvarchar", { name: "DAYS_CREDIT", nullable: true, length: 50 })
  daysCredit: string | null;

  @Column("nvarchar", {
    name: "CREDIT_DAY_OVERDUE",
    nullable: true,
    length: 50,
  })
  creditDayOverdue: string | null;

  @Column("nvarchar", {
    name: "DAYS_CREDIT_ENDDATE",
    nullable: true,
    length: 50,
  })
  daysCreditEnddate: string | null;

  @Column("nvarchar", { name: "DAYS_ENDDATE_FACT", nullable: true, length: 50 })
  daysEnddateFact: string | null;

  @Column("nvarchar", {
    name: "AMT_CREDIT_MAX_OVERDUE",
    nullable: true,
    length: 50,
  })
  amtCreditMaxOverdue: string | null;

  @Column("nvarchar", {
    name: "CNT_CREDIT_PROLONG",
    nullable: true,
    length: 50,
  })
  cntCreditProlong: string | null;

  @Column("nvarchar", { name: "AMT_CREDIT_SUM", nullable: true, length: 50 })
  amtCreditSum: string | null;

  @Column("nvarchar", {
    name: "AMT_CREDIT_SUM_DEBT",
    nullable: true,
    length: 50,
  })
  amtCreditSumDebt: string | null;

  @Column("nvarchar", {
    name: "AMT_CREDIT_SUM_LIMIT",
    nullable: true,
    length: 50,
  })
  amtCreditSumLimit: string | null;

  @Column("nvarchar", {
    name: "AMT_CREDIT_SUM_OVERDUE",
    nullable: true,
    length: 50,
  })
  amtCreditSumOverdue: string | null;

  @Column("nvarchar", { name: "CREDIT_TYPE", nullable: true, length: 50 })
  creditType: string | null;

  @Column("nvarchar", {
    name: "DAYS_CREDIT_UPDATE",
    nullable: true,
    length: 50,
  })
  daysCreditUpdate: string | null;

  @Column("nvarchar", { name: "AMT_ANNUITY", nullable: true, length: 50 })
  amtAnnuity: string | null;
}
