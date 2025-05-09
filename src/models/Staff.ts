import { Column, Table, Model, DataType, UpdatedAt, CreatedAt, DeletedAt } from 'sequelize-typescript';

@Table({ tableName : 'staffs', paranoid : true })
export class Staff extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, primaryKey : true, autoIncrement : true })
    public id!: number

    @Column({ type : DataType.STRING, allowNull : false })
    public full_name!: string

    @Column({ type : DataType.STRING, allowNull : false })
    public email!: string

    @Column({ type : DataType.TEXT, allowNull : true })
    public pfp_url!: string

    @Column({ type : DataType.BOOLEAN, defaultValue : false })
    public is_admin!: boolean

    @Column({ type : DataType.BOOLEAN, defaultValue : true })
    public is_active!: boolean

    @Column({ type : DataType.TEXT, allowNull : false })
    public password_hash!: string

    @Column({ type : DataType.DATE, allowNull : true })
    public last_login!: Date

    @Column({ type : DataType.BOOLEAN, defaultValue : true })
    enable_email_notifications!: boolean

    @Column({ type : DataType.BOOLEAN, defaultValue : true })
    enable_inapp_notifications!: boolean

    @Column({ type : DataType.BOOLEAN, defaultValue : true })
    two_factor_for_signin!: boolean

    @Column({ type : DataType.BOOLEAN, defaultValue : true })
    two_factor_for_activities!: boolean

    @Column({ type : DataType.TEXT, allowNull : true })
    language!: boolean
    
    @CreatedAt
    @Column({
      type: DataType.DATE,
      field: 'created_at',
    })
    public created_at!: Date;
  
    @UpdatedAt
    @Column({
      type: DataType.DATE,
      field: 'updated_at',
    })
    public updated_at!: Date;
  
    @DeletedAt
    @Column({
      type: DataType.DATE,
      field: 'deleted_at',
    })
    public deleted_at!: Date;
}