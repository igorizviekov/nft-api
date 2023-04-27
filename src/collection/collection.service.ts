import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CollectionDto } from "./dto/collection.dto";
import { IResponse } from "src/app.types";
import { CollectionRepository } from "./collection.repository";
import { CollectionCategory } from "./collection.enum";

@Injectable()
export class CollectionService {
  constructor(private readonly collectionRepo: CollectionRepository) {}

  async add(collection: CollectionDto, userId: string): Promise<IResponse> {
    try {
      // TODO: upload to blockchain
      const newCollection = await this.collectionRepo.createCollection(
        collection,
        userId,
        "placeholder_contract_address"
      );
      return { status: "success", data: newCollection };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getById(id: string): Promise<IResponse> {
    try {
      const match = await this.collectionRepo.findOne(id);
      if (!match) {
        throw new NotFoundException(`Collection with id ${id} not found.`);
      }
      return { status: "success", data: match };
    } catch (e) {
      throw new NotFoundException(`Collection with id ${id} not found.`);
    }
  }

  async update(id: string, collectionData: CollectionDto): Promise<IResponse> {
    const { data } = await this.getById(id);
    Object.keys(collectionData).forEach((key) => {
      data[key] = collectionData[key];
    });
    await this.collectionRepo.update(id, data);
    return { status: "success", data };
  }

  async remove(id: string): Promise<IResponse> {
    try {
      const res = await this.collectionRepo.delete(id);
      if (res.affected === 0) {
        throw new NotFoundException(`Collection with ${id} not found.`);
      }
      return {
        status: "delete success",
      };
    } catch (e) {
      throw new NotFoundException(`Collection with ${id} not found.`);
    }
  }

  async getByUserId(userId: string): Promise<IResponse> {
    try {
      const userCollections = await this.collectionRepo.getByUserId(userId);
      return { status: "success", data: userCollections };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAll(
    limit: number,
    offset: number,
    category?: CollectionCategory
  ): Promise<IResponse> {
    const collections = await this.collectionRepo.getAll(
      limit,
      offset,
      category
    );
    return { status: "success", data: collections };
  }
}
