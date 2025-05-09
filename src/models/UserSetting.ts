import { Table, Model, Column, DataType, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript'

@Table({ paranoid : true, tableName : 'user_settings' })
export class UserSetting extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, primaryKey : true, unique : true, autoIncrement : true })
    public id!: number

    @Column({ type : DataType.STRING, allowNull : true })
    public language!: string

    @Column({ type : DataType.BOOLEAN, defaultValue : false })
    public enable_sound!: boolean

    @Column({ type : DataType.BOOLEAN, defaultValue : false })
    public email_notification!: boolean

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