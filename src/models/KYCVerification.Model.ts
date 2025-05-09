import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";
import { User } from "./User";
import { DocumentTypes } from "../types/user.types";

@Table({ tableName: "kyc_verifications", paranoid: true })
export class KYCVerification extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  user_id!: string;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.ENUM(...Object.values(DocumentTypes)),
    allowNull: false,
  })
  document_type!: DocumentTypes;

  @Column({ type: DataType.TEXT, allowNull: false })
  document_front_url!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  document_back_url!: string;

  @Column({
    type: DataType.ENUM("pending", "verified", "rejected"),
    defaultValue: "pending",
  })
  status!: "pending" | "verified" | "rejected";

  @Column({ type: DataType.TEXT, allowNull: true })
  rejection_reason?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  submitted_at?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  verified_at?: Date;

  @CreatedAt
  @Column({ field: "created_at" })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  updated_at!: Date;

  @DeletedAt
  @Column({ field: "deleted_at" })
  deleted_at!: Date;
}
