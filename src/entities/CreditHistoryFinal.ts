import { Column, Entity, Index } from "typeorm";

@Index("PK__CreditHi__A6C7BDEADABD67E4", ["skIdBureau"], { unique: true })
@Entity("CreditHistory_Final", { schema: "CreditBureau" })
export class CreditHistoryFinal {
  @Column("int", { primary: true, name: "SK_ID_BUREAU" })
  skIdBureau: number;

  @Column("int", { name: "SK_ID_CURR", nullable: true })
  skIdCurr: number | null;

  @Column("nvarchar", { name: "CREDIT_ACTIVE", nullable: true, length: 50 })
  creditActive: string | null;

  @Column("nvarchar", { name: "CREDIT_TYPE", nullable: true, length: 50 })
  creditType: string | null;

  @Column("decimal", {
    name: "AMT_CREDIT_SUM",
    nullable: true,
    precision: 15,
    scale: 2,
  })
  amtCreditSum: number | null;

  @Column("decimal", {
    name: "AMT_CREDIT_SUM_DEBT",
    nullable: true,
    precision: 15,
    scale: 2,
  })
  amtCreditSumDebt: number | null;

  @Column("decimal", {
    name: "AMT_CREDIT_SUM_LIMIT",
    nullable: true,
    precision: 15,
    scale: 2,
  })
  amtCreditSumLimit: number | null;

  @Column("int", { name: "DAYS_CREDIT", nullable: true })
  daysCredit: number | null;

  @Column("int", { name: "CREDIT_DAY_OVERDUE", nullable: true })
  creditDayOverdue: number | null;

  @Column("datetime2", {
    name: "CreatedDate",
    nullable: true,
    default: () => "getdate()",
  })
  createdDate: Date | null;
}
