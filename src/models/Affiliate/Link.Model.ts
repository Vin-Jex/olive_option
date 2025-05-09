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
import { LinkType } from "./LinkType.Model";
import { AffiliateProgram } from "./AffiliateProgram.Model";
import { AffiliateUser } from "./AffiliateUser.Model";

@Table({ tableName: "AffiliateLinks" })
export class AffiliateLink extends Model {
  @ForeignKey(() => AffiliateUser)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public userId!: number;

  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  public id!: number;

  @ForeignKey(() => LinkType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public linkTypeId!: number;

  @ForeignKey(() => AffiliateProgram)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public affiliateProgramId!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public link!: string;

  @Column({ type: DataType.STRING })
  public comment?: string;

  @Column({ type: DataType.STRING })
  public promoCode?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public referralCode?: string

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
