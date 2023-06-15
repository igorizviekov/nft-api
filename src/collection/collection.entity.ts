import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CollectionCategory, CollectionRoyalties } from "./collection.enum";

@Entity()
export class Collection extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  networkSymbol: string;

  @Column()
  creator_id: string;

  @Column({ type: "enum", enum: CollectionCategory })
  categoryPrimary: CollectionCategory;

  @Column({ type: "enum", enum: CollectionCategory, nullable: true })
  categorySecondary?: CollectionCategory;

  @Column()
  blockchain_id: string;

  @Column()
  contract_address: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  royalties?: CollectionRoyalties;
}
