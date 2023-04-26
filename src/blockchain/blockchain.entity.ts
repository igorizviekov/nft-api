import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Blockchain {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: true,
  })
  chain_id: number;

  @Column()
  currency_symbol: string;

  @Column()
  rpc_url: string;
}
