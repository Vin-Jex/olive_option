import {
  Column,
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
} from "sequelize-typescript";
import { AffiliateUser } from "../Affiliate/AffiliateUser.Model";

@Table({ tableName: "Affiliate", paranoid: true })
export class Affiliate extends Model {
  @ForeignKey(() => AffiliateUser)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public userId!: number;

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public mainLink!: string;

  @Column({ type: DataType.DECIMAL, defaultValue: 0.0 })
  public earnings!: number;

  @Column({ type: DataType.DECIMAL, defaultValue: 0.0 })
  public totalDeposits!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "nextPaymentDate",
    defaultValue: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  })
  public nextPaymentDate!: Date;

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
