import { EntityRepository, Repository } from "typeorm";
import { NftEntity } from "./nft.entity";

@EntityRepository(NftEntity)
export class NftRepository extends Repository<NftEntity> {
  // Define your custom repository methods here
}
