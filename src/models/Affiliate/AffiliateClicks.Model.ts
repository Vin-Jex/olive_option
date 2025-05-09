import {
  Column,
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BeforeCreate,
  BeforeDestroy,
} from "sequelize-typescript";
import { AffiliateUser } from "./AffiliateUser.Model";
import { AffiliateLink } from "./Link.Model";
import { TMetaData } from "../../types/Affiliate/Affiliate.types";
import { updateAffiliateDashboard } from "../../services/Affiliate/AffiliateDashboardOverview.Service";

@Table({ tableName: "AffiliateClicks" })
export class AffiliateClick extends Model {
  @BeforeCreate
  static async recordClicks(instance: AffiliateClick) {
    const userId = instance.userId;
    await updateAffiliateDashboard(userId);
  }

  @BeforeDestroy
  static async updateClicksOnDelete(instance: AffiliateClick) {
    const userId = instance.userId;
    await updateAffiliateDashboard(userId);
  }

  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  public id!: number;

  @ForeignKey(() => AffiliateUser)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  public userId!: string;

  @ForeignKey(() => AffiliateLink)
  @Column({ type: DataType.INTEGER, allowNull: true })
  public linkId!: number | null;

  @Column({ type: DataType.DATE, allowNull: false })
  public clickedAt!: Date;

  @Column({ type: DataType.JSON, allowNull: true })
  public metadata!: TMetaData | null;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  public created_at!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  public updated_at!: Date;

  @DeletedAt
  @Column({ type: DataType.DATE, field: "deleted_at" })
  public deleted_at!: Date | null;
}
