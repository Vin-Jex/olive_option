import {
  Column,
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
} from "sequelize-typescript";
import { AffiliateUser } from "./AffiliateUser.Model";
import { EActivityType } from "../../types/Affiliate/Affiliate.types";

@Table({ tableName: "AffiliateUserActivities" })
export class AffiliateUserActivity extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  public id!: number;

  @ForeignKey(() => AffiliateUser)
  @Column({ type: DataType.UUID, allowNull: false })
  public userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [
        [
          EActivityType.SIGN_IN,
          EActivityType.SIGN_UP,
          EActivityType.PASSWORD_CHANGE,
          EActivityType.ACCOUNT_VERIFICATION,
          EActivityType.REFERRAL_SIGNUP,
          EActivityType.LOGOUT,
        ],
      ],
    },
  })
  public activityType!: EActivityType;


  @Column({ type: DataType.DATE, allowNull: false })
  public performedAt!: Date;

  @Column({ type: DataType.JSON, allowNull: true })
  public metadata!: object | null;

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
