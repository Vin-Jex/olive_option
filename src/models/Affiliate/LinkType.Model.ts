import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  UpdatedAt,
  Table,
  ForeignKey,
  Unique,
} from "sequelize-typescript";
import { AffiliateUser } from "./AffiliateUser.Model";

@Table({ tableName: "LinkTypes" })
export class LinkType extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  public id!: number;

  @ForeignKey(() => AffiliateUser)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public userId!: number;

  @Unique("user_linktype_unique")
  @Column({ type: DataType.STRING, allowNull: false })
  public name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public url!: string;

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
