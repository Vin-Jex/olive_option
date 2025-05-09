import { Column, Table, Model, DataType, UpdatedAt, CreatedAt, DeletedAt } from 'sequelize-typescript';
import { trade_pair_categories } from '../utils/consts';

@Table({ tableName : 'trade_pairs', paranoid : true })
export class TradePair extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true })
    public id!: number
    
    @Column({ type : DataType.STRING, allowNull : false })
    public name!: string

    @Column({ type : DataType.STRING, allowNull : false })
    public category!: trade_pair_categories

    @Column({ type : DataType.STRING, allowNull : false })
    public base_asset!: string

    @Column({ type : DataType.STRING, allowNull : false })
    public quote_asset!: string

    @Column({ type : DataType.BOOLEAN, allowNull : false, defaultValue : true })
    public is_active!: boolean

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