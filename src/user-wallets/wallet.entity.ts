import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: false,
  })
  user_id: string;

  @Column({
    unique: false,
  })
  blockchain_id: string;

  @Column({
    unique: true,
  })
  wallet_address: string;
}
