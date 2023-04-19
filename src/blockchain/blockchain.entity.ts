import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Blockchain {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: false,
  })
  name: string;

  @Column({
    unique: true,
  })
  network_id: string;
}
