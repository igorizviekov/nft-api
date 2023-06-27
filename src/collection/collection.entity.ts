import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CollectionCategory } from "./collection.enum";

@Entity()
export class Collection extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tokenId: number;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  creator_id: string;

  @Column({ type: "enum", enum: CollectionCategory })
  categoryPrimary: CollectionCategory;

  @Column({ type: "enum", enum: CollectionCategory, nullable: true })
  categorySecondary?: CollectionCategory;

  @Column()
  blockchain_id: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  website?: string;

  @Column("text", { array: true, nullable: true })
  nfts?: string[];

  @Column("integer", { array: true, nullable: true })
  mintRequests?: number[];
}
