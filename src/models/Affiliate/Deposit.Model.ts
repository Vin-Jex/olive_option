import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";
import { Affiliate } from "./Affiliate.Model";

@Table({ tableName: "Deposit" })
export class Deposit extends Model {
  @ForeignKey(() => Affiliate)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public affiliateId!: number;

  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  public id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public totalDeposits!: number;

  @Column({
    type: DataType.DECIMAL(65, 2),
    defaultValue: 0.0,
    allowNull: false,
  })
  public depositAmount!: number;

  @Column({
    type: DataType.DECIMAL(65, 2),
    defaultValue: 0.0,
    allowNull: false,
  })
  public ftdAmount!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  public createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  public updatedAt!: Date;

  @DeletedAt
  @Column({ type: DataType.DATE, field: "deleted_at" })
  public deletedAt!: Date;
}
