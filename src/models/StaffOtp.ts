import { Column, Table, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';
import { otp_destination, staff_otp_types } from '../utils/consts';

@Table({ tableName : 'staff_otps' })
export class StaffOtp extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true })
    public id!: number

    @Column({ type : DataType.STRING, allowNull : false })
    public type!: staff_otp_types

    @Column({ type : DataType.STRING, allowNull : false })
    public destination!: otp_destination

    @Column({ type : DataType.TEXT, allowNull : false })
    public token!: string

    @Column({ type : DataType.STRING, allowNull : false })
    public receiver!: string
    
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
}