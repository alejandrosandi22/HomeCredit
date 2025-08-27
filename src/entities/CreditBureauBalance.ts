import { Column, Entity } from "typeorm";

@Entity("CreditBureauBalance", { schema: "CreditBureau" })
export class CreditBureauBalance {
  @Column("nvarchar", { name: "SK_ID_BUREAU", nullable: true, length: 50 })
  skIdBureau: string | null;

  @Column("nvarchar", { name: "MONTHS_BALANCE", nullable: true, length: 50 })
  monthsBalance: string | null;

  @Column("nvarchar", { name: "STATUS", nullable: true, length: 50 })
  status: string | null;
}
