import {
  Column,
  Table,
  Model,
  DataType,
  UpdatedAt,
  CreatedAt,
  DeletedAt,
  BeforeDestroy,
  BeforeCreate,
  AfterUpdate,
} from "sequelize-typescript";
import {
  updateAffiliateDashboard,
  updateAffiliateRevenueShare,
  updateAffiliateSubAffiliate,
  updateAffiliateTurnoverShare,
} from "../../services/Affiliate/AffiliateDashboardOverview.Service";
import { updateTopAffiliates } from "../../services/Affiliate/TopAffiliate.Service";
import { log } from "../../utils/logger";

@Table({ tableName: "AffiliateUsers", paranoid: true })
export class AffiliateUser extends Model {
  // Increment referral count before user is created
  @BeforeCreate
  static async incrementReferrerCount(instance: AffiliateUser) {
    if (instance.referred_by) {
      const referrer = await AffiliateUser.findOne({
        where: { referral_code: instance.referred_by },
      });
      if (referrer && referrer.id) {
        referrer.total_referrals += 1;
        await referrer.save();

        const referrerId = referrer.id;
        log("info", `ReferrerId: ${referrerId}`);
        await updateAffiliateDashboard(referrerId);
        await updateAffiliateSubAffiliate(referrerId);
      }
    }
  }

  // Decrement referral count before user is deleted
  @BeforeDestroy
  static async decrementReferrerCount(instance: AffiliateUser) {
    if (instance.referred_by) {
      const referrer = await AffiliateUser.findOne({
        where: { referral_code: instance.referred_by },
      });
      if (referrer && referrer.id && referrer.total_referrals > 0) {
        referrer.total_referrals -= 1;
        await referrer.save();

        const referrerId = referrer.id;
        log("info", `ReferrerId: ${referrerId}`);
        await updateAffiliateDashboard(referrerId);
        await updateAffiliateSubAffiliate(referrerId);
      }
    }
  }

  @AfterUpdate
  static async onTierLevelChange(instance: AffiliateUser) {
    if (instance.changed("tier_level")) {
      log(
        "info",
        `Tier level changed to ${instance.tier_level} for affiliate ${instance.id}`
      );

      await updateAffiliateDashboard(instance.id);
      await updateAffiliateRevenueShare(instance.id);
      await updateAffiliateTurnoverShare(instance.id);
      await updateAffiliateSubAffiliate(instance.id);
      await updateTopAffiliates(instance.id);
    }
  }

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  public id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public full_name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  public email!: string;

  @Column({
    type: DataType.STRING(6),
    allowNull: false,
    unique: true,
  })
  public referral_code!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public referred_by!: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  public is_active!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  public is_verified!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, Infinity],
        msg: "Password must be at least 6 characters long.",
      },
    },
  })
  public password!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public verification_code!: string | null;

  @Column({
    type: DataType.ENUM("email_verification", "password_reset"),
    allowNull: true,
  })
  public verification_type!: "email_verification" | "password_reset" | null;

  @Column({ type: DataType.DATE, allowNull: true })
  public last_login!: Date;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  public tier_level!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  public total_referrals!: number;

  @Column({ type: DataType.STRING, allowNull: true })
  public country!: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  public date_of_birth!: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  public phone_number!: string;

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
