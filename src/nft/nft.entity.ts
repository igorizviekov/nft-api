import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Nft {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  metadata: string;

  @Column()
  contractAddress: string;
}
