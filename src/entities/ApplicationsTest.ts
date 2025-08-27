import { Column, Entity } from "typeorm";

@Entity("ApplicationsTest", { schema: "Core" })
export class ApplicationsTest {
  @Column("nvarchar", { name: "SK_ID_CURR", nullable: true, length: 50 })
  skIdCurr: string | null;

  @Column("nvarchar", {
    name: "NAME_CONTRACT_TYPE",
    nullable: true,
    length: 50,
  })
  nameContractType: string | null;

  @Column("nvarchar", { name: "CODE_GENDER", nullable: true, length: 50 })
  codeGender: string | null;

  @Column("nvarchar", { name: "FLAG_OWN_CAR", nullable: true, length: 50 })
  flagOwnCar: string | null;

  @Column("nvarchar", { name: "FLAG_OWN_REALTY", nullable: true, length: 50 })
  flagOwnRealty: string | null;

  @Column("nvarchar", { name: "CNT_CHILDREN", nullable: true, length: 50 })
  cntChildren: string | null;

  @Column("nvarchar", { name: "AMT_INCOME_TOTAL", nullable: true, length: 50 })
  amtIncomeTotal: string | null;

  @Column("nvarchar", { name: "AMT_CREDIT", nullable: true, length: 50 })
  amtCredit: string | null;

  @Column("nvarchar", { name: "AMT_ANNUITY", nullable: true, length: 50 })
  amtAnnuity: string | null;

  @Column("nvarchar", { name: "AMT_GOODS_PRICE", nullable: true, length: 50 })
  amtGoodsPrice: string | null;

  @Column("nvarchar", { name: "DAYS_BIRTH", nullable: true, length: 50 })
  daysBirth: string | null;

  @Column("nvarchar", { name: "DAYS_EMPLOYED", nullable: true, length: 50 })
  daysEmployed: string | null;

  @Column("nvarchar", { name: "OCCUPATION_TYPE", nullable: true, length: 100 })
  occupationType: string | null;

  @Column("nvarchar", {
    name: "ORGANIZATION_TYPE",
    nullable: true,
    length: 100,
  })
  organizationType: string | null;

  @Column("nvarchar", { name: "EXT_SOURCE_1", nullable: true, length: 50 })
  extSource_1: string | null;

  @Column("nvarchar", { name: "EXT_SOURCE_2", nullable: true, length: 50 })
  extSource_2: string | null;

  @Column("nvarchar", { name: "EXT_SOURCE_3", nullable: true, length: 50 })
  extSource_3: string | null;

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
}
