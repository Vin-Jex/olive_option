import { Column, Table, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';
import { setting_keys } from "../utils/consts";

@Table({ tableName : 'settings' })
export class Setting extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true })
    public id!: number

    @Column({ type : DataType.STRING, allowNull : false })
    public key!: setting_keys

    @Column({ type : DataType.TEXT, allowNull : false })
    public value!: string

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