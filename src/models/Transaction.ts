import {
  Model,
  Table,
  DataType,
  Column,
  CreatedAt,
  UpdatedAt,
  AfterCreate,
  AfterDestroy,
} from "sequelize-typescript";
import {
  transaction_statuses,
  transaction_type,
  user_roles,
} from "../utils/consts";
import {
  updateAffiliateDashboard,
  updateAffiliateRevenueShare,
} from "../services/Affiliate/AffiliateDashboardOverview.Service";
import { updateTopAffiliates } from "../services/Affiliate/TopAffiliate.Service";

@Table({ tableName: "transactions" })
export class Transaction extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public ref!: string;

  @Column({ type: DataType.UUID, allowNull: true })
  public user_id!: string;

  @Column({ type: DataType.DECIMAL(65, 2), allowNull: false })
  public amount!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public type!: transaction_type;

  @Column({ type: DataType.STRING, allowNull: false })
  public status!: transaction_statuses;

  @Column({ type: DataType.TEXT("long"), allowNull: true })
  public metadata!: string;

  @Column({ type: DataType.BOOLEAN })
  public livemode!: boolean;

  @Column({ type: DataType.TEXT, allowNull: true })
  public desc!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  public payment_methods!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: user_roles.user,
  })
  public user_type!: user_roles;

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

  @AfterCreate
  static async onCreate(instance: Transaction) {
    if (
      instance.user_type === user_roles.affiliate &&
      instance.type === "credit" &&
      instance.status === "completed"
    ) {
      await updateAffiliateDashboard(instance.user_id);
      await updateAffiliateRevenueShare(instance.user_id);
      await updateTopAffiliates(instance.user_id);
    }
  }

  @AfterDestroy
  static async onDelete(instance: Transaction) {
    if (
      instance.user_type === user_roles.affiliate &&
      instance.type === "credit" &&
      instance.status === "completed"
    ) {
      await updateAffiliateDashboard(instance.user_id);
      await updateAffiliateRevenueShare(instance.user_id);
      await updateTopAffiliates(instance.user_id);
    }
  }
}
