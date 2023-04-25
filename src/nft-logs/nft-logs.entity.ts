import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TransactionType } from "./nft-logs.enum";

@Entity()
export class NftLogsEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  image_uri: string;

  @Column()
  nft_id: string;

  @Column({ type: "enum", enum: TransactionType })
  transaction_type: TransactionType;

  @Column({ nullable: true })
  seller_address?: string;

  @Column({ nullable: true })
  buyer_address?: string;

  @Column()
  token_value: string;

  @Column()
  date: string;
}
