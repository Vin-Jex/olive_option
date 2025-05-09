import { Column, Table, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript';

@Table({ tableName : 'pinned_options' })
export class PinnedOption extends Model{
    @Column({ type : DataType.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true })
    public id!: number

    @Column({ type : DataType.STRING, allowNull : false })
    public symbol!: string

    @Column({ type : DataType.TEXT, allowNull : false })
    public full_data!: string

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