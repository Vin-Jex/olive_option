import {
  Column,
  Table,
  Model,
  DataType,
  UpdatedAt,
  CreatedAt,
} from "sequelize-typescript";

@Table({ tableName: "comission_exceptions" })
export class ComissionException extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public ticker!: string;

  @Column({ type: DataType.DECIMAL, allowNull: false })
  public buy_commission!: string;

  @Column({ type: DataType.DECIMAL, allowNull: false })
  public sell_commission!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: "created_at",
  })
  public created_at!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: "updated_at",
  })
  public updated_at!: Date;
}
