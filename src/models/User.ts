import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";

@Table({ paranoid: true, tableName: "users" })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  public id!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public first_name!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public last_name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public email!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public phone!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  public pfp_url!: string;

  @Column({ type: DataType.DATE, allowNull: true })
  public date_of_birth!: Date;

  @Column({ type: DataType.CHAR(2), allowNull: true })
  public country!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  public livemode!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  public is_disabled!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  public is_email_verified!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  public is_phone_verified!: boolean;

  @Column({ type: DataType.TEXT, allowNull: false })
  public password_hash!: string;

  @Column({ type: DataType.DATE, allowNull: true })
  public last_login_at!: Date;

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

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: "deleted_at",
  })
  public deleted_at!: Date;
}
