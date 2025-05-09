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
import { Staff } from "../../models/Staff";
import { User } from "../../models/User";

@Table({ tableName: "AffiliateTelegramLinks" })
export class AffiliateTelegramLink extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  public id!: number;

  @ForeignKey(() => AffiliateUser)
  @ForeignKey(() => Staff)
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public userId!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public userType!: "AffiliateUser" | "Staff" | "User";

  @Column({ type: DataType.STRING, allowNull: true })
  public telegramChatId!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public telegramUsername!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  public state!: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: "pending" })
  public status!: "pending" | "completed";

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  public created_at!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  public updated_at!: Date;
}
