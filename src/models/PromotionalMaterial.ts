import { Column, Table, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';
import { promotional_material_types } from '../utils/consts';

@Table({ tableName : 'promotional_materials' })
export class PromotionalMaterial extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true })
    public id!: number
    
    @Column({ type : DataType.STRING, allowNull : false })
    public language!: string

    @Column({ type : DataType.STRING, allowNull : true })
    public size!: string

    @Column({ type : DataType.TEXT, allowNull : false })
    public media_url!: string

    @Column({ type : DataType.STRING, allowNull : false })
    public type!: promotional_material_types

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