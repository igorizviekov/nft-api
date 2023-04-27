// collection.repository.ts
import { EntityRepository, Repository } from "typeorm";
import { CollectionDto } from "./dto/collection.dto";
import { Collection } from "./collection.entity";
import { InternalServerErrorException } from "@nestjs/common";
import { CollectionCategory } from "./collection.enum";

@EntityRepository(Collection)
export class CollectionRepository extends Repository<Collection> {
  async createCollection(
    collectionData: CollectionDto,
    userId: string,
    contractAddress: string
  ): Promise<Collection> {
    const collection = this.create({
      ...collectionData,
      creator_id: userId,
      contract_address: contractAddress,
    });

    try {
      await this.save(collection);
    } catch (error) {
      console.error({ error });
      throw new InternalServerErrorException();
    }
    return collection;
  }

  async getByUserId(userId: string): Promise<Collection[]> {
    return this.createQueryBuilder("collection")
      .where("collection.creator_id = :userId", { userId })
      .getMany();
  }

  async getAll(
    limit: number,
    offset: number,
    category?: CollectionCategory
  ): Promise<Collection[]> {
    let query = this.createQueryBuilder("collection");

    if (limit) {
      limit = (limit || 30) && limit > 100 ? 100 : limit;
      query.limit(limit);
    }
    if (offset) {
      offset = offset ? offset : 0;
      query.offset(offset);
    }

    if (category) {
      query = query.where(
        "collection.categoryPrimary = :category OR collection.categorySecondary = :category",
        { category }
      );
    }

    return query.getMany();
  }
}
