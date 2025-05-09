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
import { AffiliateLink } from "./Link.Model";
import { User } from "../User";

@Table({ tableName: "Postbacks", paranoid: true })
export class Postback extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  public id!: number;

  // Foreign Key to the AffiliateUser
  @ForeignKey(() => AffiliateUser)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public affiliateId!: number;

  // Foreign Key to the AffiliateLink
  @ForeignKey(() => AffiliateLink)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public linkId!: number;

  // Event unique ID (eid)
  @Column({ type: DataType.STRING, allowNull: false })
  public event_id!: string;

  // Status field for the postback (e.g., "reg", "conf", "ftd", "dep")
  @Column({
    type: DataType.ENUM("reg", "conf", "ftd", "dep"),
    allowNull: false,
  })
  public status!: "reg" | "conf" | "ftd" | "dep";

  // Click ID (cid)
  @Column({ type: DataType.STRING, allowNull: false })
  public click_id!: string;

  // Site ID (sid)
  @Column({ type: DataType.STRING, allowNull: true })
  public site_id!: string;

  // Trader ID / User ID (uid)
  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: true })
  public trader_id!: string;

  // Deposit / Payout amount
  @Column({ type: DataType.FLOAT, allowNull: true })
  public sumdep!: number;

  // HTTP Method (GET or POST)
  @Column({
    type: DataType.ENUM("GET", "POST"),
    allowNull: false,
  })
  public method!: "GET" | "POST";

  // URL template for the postback
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  })
  public url!: string;

  // Timestamp for the event
  @Column({ type: DataType.DATE, allowNull: false })
  public timestamp!: Date;

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
