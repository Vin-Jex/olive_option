import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  UpdatedAt,
  Table,
} from "sequelize-typescript";

@Table({ tableName: "AffiliatePrograms" })
export class AffiliateProgram extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public name!: string;

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
