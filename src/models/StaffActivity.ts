import { Column, Table, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';
import { staff_actions } from '../utils/consts';

@Table({ tableName : 'staff_activities' })
export class StaffActivity extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, primaryKey : true, autoIncrement : true })
    public id!: number

    @Column({ type : DataType.STRING, allowNull : false })
    public action!: staff_actions

    @Column({ type : DataType.TEXT, allowNull : true })
    public note!: string
    
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