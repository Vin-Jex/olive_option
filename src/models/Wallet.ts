import {
  Model,
  Table,
  DataType,
  Column,
  CreatedAt,
  UpdatedAt,
  AfterCreate,
} from "sequelize-typescript";
import { user_roles } from "../utils/consts";
import {
  updateAffiliateDashboard,
  updateAffiliateTurnoverShare,
} from "../services/Affiliate/AffiliateDashboardOverview.Service";

@Table({ tableName: "wallets" })
export class Wallet extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({ type: DataType.DECIMAL(65, 2), allowNull: true, defaultValue: 0 })
  public balance!: number;

  @Column({ type: DataType.DECIMAL(65, 2), allowNull: true, defaultValue: 0 })
  public bonus!: number;

  @Column({ type: DataType.BOOLEAN })
  public livemode!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: user_roles.user,
  })
  public user_type!: user_roles;

  @Column({ type: DataType.STRING, allowNull: true })
  public user_id!: string;

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
  static async onCreate(instance: Wallet) {
    if (instance.user_type === user_roles.affiliate) {
      await updateAffiliateDashboard(instance.user_id);
    }
  }

  static async onUpdate(instance: Wallet) {
    if (
      instance.user_type === user_roles.affiliate &&
      instance.changed("bonus")
    ) {
      await updateAffiliateDashboard(instance.user_id);
      await updateAffiliateTurnoverShare(instance.user_id);
    }
  }
}
