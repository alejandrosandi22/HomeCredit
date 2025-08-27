import { Column, Entity } from "typeorm";

@Entity("POSCashBalance", { schema: "Payments" })
export class PosCashBalance {
  @Column("nvarchar", { name: "SK_ID_PREV", nullable: true, length: 50 })
  skIdPrev: string | null;

  @Column("nvarchar", { name: "SK_ID_CURR", nullable: true, length: 50 })
  skIdCurr: string | null;

  @Column("nvarchar", { name: "MONTHS_BALANCE", nullable: true, length: 50 })
  monthsBalance: string | null;

  @Column("nvarchar", { name: "CNT_INSTALMENT", nullable: true, length: 50 })
  cntInstalment: string | null;

  @Column("nvarchar", {
    name: "CNT_INSTALMENT_FUTURE",
    nullable: true,
    length: 50,
  })
  cntInstalmentFuture: string | null;

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
