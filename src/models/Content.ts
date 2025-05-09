import { Column, Table, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';
import { content_categories, content_user_categories } from "../utils/consts";

@Table({ tableName : 'contents' })
export class Content extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true })
    public id!: number

    @Column({ type : DataType.STRING, allowNull : false })
    public user_category!: content_user_categories

    @Column({ type : DataType.STRING, allowNull : false })
    public category!: content_categories

    @Column({ type : DataType.TEXT('long'), allowNull : false })
    public content!: string

    @Column({ type : DataType.TEXT, allowNull : true })
    public document_url!: string

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