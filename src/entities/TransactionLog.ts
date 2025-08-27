import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK__Transact__A17F23B84B5067A9", ["auditId"], { unique: true })
@Entity("TransactionLog", { schema: "Audit" })
export class TransactionLog {
  @PrimaryGeneratedColumn({ type: "int", name: "AuditID" })
  auditId: number;

  @Column("nvarchar", { name: "TableName", length: 128 })
  tableName: string;

  @Column("nvarchar", { name: "Operation", length: 10 })
  operation: string;

  @Column("nvarchar", { name: "RecordID", length: 50 })
  recordId: string;

  @Column("nvarchar", { name: "OldValues", nullable: true })
  oldValues: string | null;

  @Column("nvarchar", { name: "NewValues", nullable: true })
  newValues: string | null;

  @Column("nvarchar", {
    name: "UserName",
    length: 128,
    default: () => "suser_sname()",
  })
  userName: string;

  @Column("datetime2", { name: "AuditDate", default: () => "getdate()" })
  auditDate: Date;

  @Column("nvarchar", {
    name: "ApplicationName",
    nullable: true,
    length: 128,
    default: () => "app_name()",
  })
  applicationName: string | null;

  @Column("nvarchar", {
    name: "HostName",
    nullable: true,
    length: 128,
    default: () => "host_name()",
  })
  hostName: string | null;
}
