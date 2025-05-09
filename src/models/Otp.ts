import { Column, Table, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';
import { otp_types, otp_destination } from '../utils/consts';

@Table({ tableName : 'otps' })
export class Otp extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true })
    public id!: number

    @Column({ type : DataType.STRING, allowNull : false })
    public type!: otp_types

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