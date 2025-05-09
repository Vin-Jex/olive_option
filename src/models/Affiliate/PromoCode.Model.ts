import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";

@Table({ tableName: "PromoCodes" })
export class PromoCode extends Model {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  public code!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  public expiryDate!: Date;

  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  public usageLimit!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  public usedCount!: number;

  @Column({ type: DataType.DECIMAL, defaultValue: 0.0, allowNull: false })
  public discountAmount!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true, allowNull: false })
  public is_active!: boolean;

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
