import {
  Column,
  Table,
  Model,
  DataType,
  UpdatedAt,
  CreatedAt,
  DeletedAt,
} from "sequelize-typescript";

@Table({ tableName: "SupportMessages", paranoid: true })
export class SupportMessage extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public email!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  public message!: string;

  @Column({
    type: DataType.ENUM("received", "in_progress", "resolved"),
    defaultValue: "received",
  })
  public status!: "received" | "in_progress" | "resolved";

  @Column({ type: DataType.DATE, allowNull: true })
  public resolved_at!: Date | null;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  public created_at!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  public updated_at!: Date;

  @DeletedAt
  @Column({ type: DataType.DATE, field: "deleted_at" })
  public deleted_at!: Date;
}
