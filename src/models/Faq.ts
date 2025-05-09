import { Column, Table, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';

@Table({ tableName : 'faqs' })
export class Faq extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true })
    public id!: number

    @Column({ type : DataType.TEXT, allowNull : false })
    public question!: string

    @Column({ type : DataType.TEXT, allowNull : false })
    public answer!: string

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