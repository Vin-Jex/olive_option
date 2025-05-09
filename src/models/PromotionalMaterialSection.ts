import { Column, Table, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';
import { promotional_material_section_types } from "../utils/consts";

@Table({ tableName : 'promotional_material_sections' })
export class PromotionalMaterialSection extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true })
    public id!: number

    @Column({ type : DataType.STRING, allowNull : false })
    public type!: promotional_material_section_types

    @Column({ type : DataType.STRING, allowNull : false })
    public name!: string
    
    @Column({ type : DataType.TEXT, allowNull : false })
    public thumbnail_url!: string

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