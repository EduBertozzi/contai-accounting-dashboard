import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Entidade que representa um lançamento contábil
@Entity()
export class AccountingEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  entryDate!: string; // Data no formato YYYY-MM-DD

  @Column()
  description!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  amount!: number;

  @Column()
  entryType!: 'CREDIT' | 'DEBIT'; // Tipo do lançamento
}
