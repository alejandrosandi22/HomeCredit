import { Column, Entity, Index } from "typeorm";

@Index("PK__Applicat__06BCFAE01BAAA25D", ["skIdCurr"], { unique: true })
@Entity("Applications_Final", { schema: "Core" })
export class ApplicationsFinal {
  @Column("int", { primary: true, name: "SK_ID_CURR" })
  skIdCurr: number;

  @Column("int", { name: "TARGET", nullable: true })
  target: number | null;

  @Column("nvarchar", {
    name: "NAME_CONTRACT_TYPE",
    nullable: true,
    length: 50,
  })
  nameContractType: string | null;

  @Column("nvarchar", { name: "CODE_GENDER", nullable: true, length: 10 })
  codeGender: string | null;

  @Column("int", { name: "FLAG_OWN_CAR", nullable: true })
  flagOwnCar: number | null;

  @Column("int", { name: "FLAG_OWN_REALTY", nullable: true })
  flagOwnRealty: number | null;

  @Column("int", { name: "CNT_CHILDREN", nullable: true })
  cntChildren: number | null;

  @Column("decimal", {
    name: "AMT_INCOME_TOTAL",
    nullable: true,
    precision: 15,
    scale: 2,
  })
  amtIncomeTotal: number | null;

  @Column("decimal", {
    name: "AMT_CREDIT",
    nullable: true,
    precision: 15,
    scale: 2,
  })
  amtCredit: number | null;

  @Column("decimal", {
    name: "AMT_ANNUITY",
    nullable: true,
    precision: 15,
    scale: 2,
  })
  amtAnnuity: number | null;

  @Column("decimal", {
    name: "AMT_GOODS_PRICE",
    nullable: true,
    precision: 15,
    scale: 2,
  })
  amtGoodsPrice: number | null;

  @Column("int", { name: "DAYS_BIRTH", nullable: true })
  daysBirth: number | null;

  @Column("int", { name: "DAYS_EMPLOYED", nullable: true })
  daysEmployed: number | null;

  @Column("nvarchar", { name: "OCCUPATION_TYPE", nullable: true, length: 100 })
  occupationType: string | null;

  @Column("nvarchar", {
    name: "ORGANIZATION_TYPE",
    nullable: true,
    length: 100,
  })
  organizationType: string | null;

  @Column("decimal", {
    name: "EXT_SOURCE_1",
    nullable: true,
    precision: 10,
    scale: 6,
  })
  extSource_1: number | null;

  @Column("decimal", {
    name: "EXT_SOURCE_2",
    nullable: true,
    precision: 10,
    scale: 6,
  })
  extSource_2: number | null;

  @Column("decimal", {
    name: "EXT_SOURCE_3",
    nullable: true,
    precision: 10,
    scale: 6,
  })
  extSource_3: number | null;

  @Column("nvarchar", {
    name: "WEEKDAY_APPR_PROCESS_START",
    nullable: true,
    length: 20,
  })
  weekdayApprProcessStart: string | null;

  @Column("int", { name: "HOUR_APPR_PROCESS_START", nullable: true })
  hourApprProcessStart: number | null;

  @Column("datetime2", {
    name: "CreatedDate",
    nullable: true,
    default: () => "getdate()",
  })
  createdDate: Date | null;
}
