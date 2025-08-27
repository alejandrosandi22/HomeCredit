import { Column, Entity, Index } from "typeorm";

@Index("PK__Previous__115B52C5189A1C2C", ["skIdPrev"], { unique: true })
@Entity("PreviousApplications_Final", { schema: "Core" })
export class PreviousApplicationsFinal {
  @Column("int", { primary: true, name: "SK_ID_PREV" })
  skIdPrev: number;

  @Column("int", { name: "SK_ID_CURR", nullable: true })
  skIdCurr: number | null;

  @Column("nvarchar", {
    name: "NAME_CONTRACT_TYPE",
    nullable: true,
    length: 50,
  })
  nameContractType: string | null;

  @Column("decimal", {
    name: "AMT_APPLICATION",
    nullable: true,
    precision: 15,
    scale: 2,
  })
  amtApplication: number | null;

  @Column("decimal", {
    name: "AMT_CREDIT",
    nullable: true,
    precision: 15,
    scale: 2,
  })
  amtCredit: number | null;

  @Column("nvarchar", {
    name: "NAME_CONTRACT_STATUS",
    nullable: true,
    length: 50,
  })
  nameContractStatus: string | null;

  @Column("nvarchar", { name: "NAME_CLIENT_TYPE", nullable: true, length: 50 })
  nameClientType: string | null;

  @Column("int", { name: "CNT_PAYMENT", nullable: true })
  cntPayment: number | null;

  @Column("int", { name: "DAYS_DECISION", nullable: true })
  daysDecision: number | null;

  @Column("datetime2", {
    name: "CreatedDate",
    nullable: true,
    default: () => "getdate()",
  })
  createdDate: Date | null;
}
