import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true,
    unique: false,
  })
  email: string;

  @Column({
    nullable: true,
    unique: false,
  })
  location: string;

  @Column({
    nullable: true,
    unique: false,
  })
  name: string;

  @Column({
    nullable: true,
    unique: false,
  })
  discord: string;

  @Column({
    nullable: true,
    unique: false,
  })
  website: string;

  @Column({
    nullable: true,
    unique: false,
  })
  image: string;

  @Column({
    nullable: true,
    unique: false,
  })
  twitter: string;

  @Column({
    nullable: true,
    unique: false,
  })
  instagram: string;

  @Column({
    nullable: true,
    unique: false,
  })
  description: string;
}
