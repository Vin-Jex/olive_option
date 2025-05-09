import { Column, Table, Model, DataType, UpdatedAt, CreatedAt, DeletedAt } from 'sequelize-typescript';

@Table({ tableName : 'faq_categories', paranoid : true })
export class FaqCategory extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true })
    public id!: number
    
    @Column({ type : DataType.TEXT, allowNull : false })
    public name!: string

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