import { Column, Entity } from "typeorm";

@Entity("InstallmentsPayments", { schema: "Payments" })
export class InstallmentsPayments {
  @Column("nvarchar", { name: "SK_ID_PREV", nullable: true, length: 50 })
  skIdPrev: string | null;

  @Column("nvarchar", { name: "SK_ID_CURR", nullable: true, length: 50 })
  skIdCurr: string | null;

  @Column("nvarchar", {
    name: "NUM_INSTALMENT_VERSION",
    nullable: true,
    length: 50,
  })
  numInstalmentVersion: string | null;

  @Column("nvarchar", {
    name: "NUM_INSTALMENT_NUMBER",
    nullable: true,
    length: 50,
  })
  numInstalmentNumber: string | null;

  @Column("nvarchar", { name: "DAYS_INSTALMENT", nullable: true, length: 50 })
  daysInstalment: string | null;

  @Column("nvarchar", {
    name: "DAYS_ENTRY_PAYMENT",
    nullable: true,
    length: 50,
  })
  daysEntryPayment: string | null;

  @Column("nvarchar", { name: "AMT_INSTALMENT", nullable: true, length: 50 })
  amtInstalment: string | null;

  @Column("nvarchar", { name: "AMT_PAYMENT", nullable: true, length: 50 })
  amtPayment: string | null;
}
