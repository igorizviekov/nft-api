import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NftEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  external_url?: string;

  @Column()
  token_uri: string;

  @Column()
  token_id: string;

  @Column()
  contract_address: string;

  @Column()
  owner_address: string;

  @Column()
  creator_address: string;

  @Column()
  collection_id: string;

  @Column()
  price: string;

  @Column()
  mint_date: string;

  @Column()
  is_for_sale: boolean;
}
