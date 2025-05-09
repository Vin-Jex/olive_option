import {
  Column,
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from "sequelize-typescript";
import { AffiliateUser } from "./AffiliateUser.Model";

@Table({ tableName: "AffiliateUserTokens" })
export class AffiliateUserToken extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  public id!: number;

  @ForeignKey(() => AffiliateUser)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public userId!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  public token!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  public is_active!: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  public createdAt!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  public updatedAt!: Date;
}
