import { Column, Table, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';

@Table({ tableName : 'staff_permissions' })
export class StaffPermission extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, primaryKey : true, autoIncrement : true })
    public id!: number
    
    @Column({ type : DataType.BOOLEAN, defaultValue : false })
    public user!: boolean
    
    @Column({ type : DataType.BOOLEAN, defaultValue : false })
    public financial!: boolean
    
    @Column({ type : DataType.BOOLEAN, defaultValue : false })
    public affiliate!: boolean
    
    @Column({ type : DataType.BOOLEAN, defaultValue : false })
    public trade!: boolean
    
    @Column({ type : DataType.BOOLEAN, defaultValue : false })
    public promotional!: boolean
    
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