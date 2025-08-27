import { Column, Entity } from "typeorm";

@Entity("CreditCardBalance", { schema: "Payments" })
export class CreditCardBalance {
  @Column("nvarchar", { name: "SK_ID_PREV", nullable: true, length: 50 })
  skIdPrev: string | null;

  @Column("nvarchar", { name: "SK_ID_CURR", nullable: true, length: 50 })
  skIdCurr: string | null;

  @Column("nvarchar", { name: "MONTHS_BALANCE", nullable: true, length: 50 })
  monthsBalance: string | null;

  @Column("nvarchar", { name: "AMT_BALANCE", nullable: true, length: 50 })
  amtBalance: string | null;

  @Column("nvarchar", {
    name: "AMT_CREDIT_LIMIT_ACTUAL",
    nullable: true,
    length: 50,
  })
  amtCreditLimitActual: string | null;

  @Column("nvarchar", {
    name: "AMT_DRAWINGS_ATM_CURRENT",
    nullable: true,
    length: 50,
  })
  amtDrawingsAtmCurrent: string | null;

  @Column("nvarchar", {
    name: "AMT_DRAWINGS_CURRENT",
    nullable: true,
    length: 50,
  })
  amtDrawingsCurrent: string | null;

  @Column("nvarchar", {
    name: "AMT_DRAWINGS_OTHER_CURRENT",
    nullable: true,
    length: 50,
  })
  amtDrawingsOtherCurrent: string | null;

  @Column("nvarchar", {
    name: "AMT_DRAWINGS_POS_CURRENT",
    nullable: true,
    length: 50,
  })
  amtDrawingsPosCurrent: string | null;

  @Column("nvarchar", {
    name: "AMT_INST_MIN_REGULARITY",
    nullable: true,
    length: 50,
  })
  amtInstMinRegularity: string | null;

  @Column("nvarchar", {
    name: "AMT_PAYMENT_CURRENT",
    nullable: true,
    length: 50,
  })
  amtPaymentCurrent: string | null;

  @Column("nvarchar", {
    name: "AMT_PAYMENT_TOTAL_CURRENT",
    nullable: true,
    length: 50,
  })
  amtPaymentTotalCurrent: string | null;

  @Column("nvarchar", {
    name: "AMT_RECEIVABLE_PRINCIPAL",
    nullable: true,
    length: 50,
  })
  amtReceivablePrincipal: string | null;

  @Column("nvarchar", { name: "AMT_RECIVABLE", nullable: true, length: 50 })
  amtRecivable: string | null;

  @Column("nvarchar", {
    name: "AMT_TOTAL_RECEIVABLE",
    nullable: true,
    length: 50,
  })
  amtTotalReceivable: string | null;

  @Column("nvarchar", {
    name: "CNT_DRAWINGS_ATM_CURRENT",
    nullable: true,
    length: 50,
  })
  cntDrawingsAtmCurrent: string | null;

  @Column("nvarchar", {
    name: "CNT_DRAWINGS_CURRENT",
    nullable: true,
    length: 50,
  })
  cntDrawingsCurrent: string | null;

  @Column("nvarchar", {
    name: "CNT_DRAWINGS_OTHER_CURRENT",
    nullable: true,
    length: 50,
  })
  cntDrawingsOtherCurrent: string | null;

  @Column("nvarchar", {
    name: "CNT_DRAWINGS_POS_CURRENT",
    nullable: true,
    length: 50,
  })
  cntDrawingsPosCurrent: string | null;

  @Column("nvarchar", {
    name: "CNT_INSTALMENT_MATURE_CUM",
    nullable: true,
    length: 50,
  })
  cntInstalmentMatureCum: string | null;

  @Column("nvarchar", {
    name: "NAME_CONTRACT_STATUS",
    nullable: true,
    length: 50,
  })
  nameContractStatus: string | null;

  @Column("nvarchar", { name: "SK_DPD", nullable: true, length: 50 })
  skDpd: string | null;

  @Column("nvarchar", { name: "SK_DPD_DEF", nullable: true, length: 50 })
  skDpdDef: string | null;
}
