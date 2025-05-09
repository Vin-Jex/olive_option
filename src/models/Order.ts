import { Column, Table, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';
import { order_prediction_types, order_statuses } from "../utils/consts";

@Table({ tableName : 'trades' })
export class Order extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true })
    public id!: number

    @Column({ type : DataType.STRING, allowNull : false })
    public symbol!: string
    
    @Column({ type : DataType.DATE, allowNull : false })
    public start_time!: Date

    @Column({ type : DataType.DATE, allowNull : false })
    public expiry_time!: Date

    @Column({ type : DataType.DECIMAL(65, 2), allowNull : false })
    public amount!: number

    @Column({ type : DataType.STRING, allowNull : false })
    public prediction!: order_prediction_types

    @Column({ type : DataType.BOOLEAN, allowNull : true })
    public prediction_correct!: boolean

    @Column({ type : DataType.DECIMAL(65, 2), defaultValue : 0 })
    public profit!: number

    @Column({ type : DataType.STRING, allowNull : false })
    public status!: order_statuses

    @Column({ type : DataType.DECIMAL(65, 2), allowNull : false })
    public initial_value!: number

    @Column({ type : DataType.DECIMAL(65, 2), allowNull : true })
    public completed_value!: number
    
    @Column({ type : DataType.BOOLEAN })
    public livemode!: boolean

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