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
}
