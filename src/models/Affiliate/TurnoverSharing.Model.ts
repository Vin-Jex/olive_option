import { Table, Column, Model, DataType, ForeignKey, CreatedAt, UpdatedAt, DeletedAt } from "sequelize-typescript";
import { Affiliate } from "./Affiliate.Model";

@Table({ tableName: "TurnoverSharing" })
export class TurnoverSharing extends Model {
  @ForeignKey(() => Affiliate)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public affiliateId!: number;

  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  public id!: number;

  @Column({ type: DataType.DECIMAL, defaultValue: 0.0, allowNull: false })
  public currentRate!: number;

  @Column({ type: DataType.STRING, defaultValue: "Level 1", allowNull: false })
  public currentLevel!: string;

  @Column({ type: DataType.STRING, defaultValue: "Level 2", allowNull: false })
  public nextLevel!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  public numberOfDepositsUntilNextLevel!: number;

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
