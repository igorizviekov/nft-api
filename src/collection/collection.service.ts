import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Response } from "express";
import { CollectionDto } from "./dto/collection.dto";
import { IResponse } from "src/app.types";
import { CollectionRepository } from "./collection.repository";
import { CollectionCategory } from "./collection.enum";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionRepository)
    private collectionRepo: CollectionRepository
  ) {}

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

  async ipfs(file: any, collectionId: string): Promise<IResponse> {
    if (!file || file.mimetype !== "application/zip") {
      throw new HttpException(
        "Invalid file format. Please upload a zip file.",
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      await this.getById(collectionId);
      const collectionFolderPath = path.join(
        "tmp",
        "collections",
        collectionId
      );
      console.log({ collectionFolderPath });

      if (!fs.existsSync(collectionFolderPath)) {
        fs.mkdirSync(collectionFolderPath, { recursive: true });
      }
      // Save the zip file to the server
      const zipFilePath = path.join(collectionFolderPath, file.originalname);
      console.log({ zipFilePath });

      // Copy the file to the desired location
      await fs.promises.copyFile(file.path, zipFilePath);
      console.log(1);

      // Optional: Delete the temporary file in the 'uploads' folder after saving it to the new location
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting temporary file ${file.path}:`, err);
        } else {
          console.log(`Temporary file ${file.path} deleted successfully`);
        }
      });
      return { status: "success" };
    } catch (e) {
      console.log({ e });
      throw new NotFoundException(
        `Collection with id ${collectionId} not found.`
      );
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
      console.log(e);
      throw new NotFoundException(`Collection with id ${id} not found.`);
    }
  }

  async getABI(collectionId: string, res: Response) {
    try {
      const match = await this.collectionRepo.findOne(collectionId);
      if (!match) {
        throw new NotFoundException(
          `Collection with id ${collectionId} not found.`
        );
      }
      // TODO: attach collection contract ABI instead of a file
      const collectionFolderPath = path.join("collections", collectionId);
      if (!fs.existsSync(collectionFolderPath)) {
        throw new NotFoundException(
          `A not found for collection with id ${collectionId}.`
        );
      }
      const files = fs
        .readdirSync(collectionFolderPath)
        .filter((file) => file !== ".DS_Store");
      const filePath = path.join(collectionFolderPath, files[0]);
      res.setHeader("Content-Disposition", `attachment; filename=${files[0]}`);
      res.setHeader("Content-Type", "application/zip");
      fs.createReadStream(filePath).pipe(res);
    } catch (e) {
      console.log(e);
      throw new NotFoundException(
        `ABI for collection  ${collectionId} not found.`
      );
    }
  }

  async update(id: string, collectionData: CollectionDto): Promise<IResponse> {
    const collection = await this.collectionRepo.findOne(id);
    if (!collection) {
      throw new NotFoundException(`Collection with id ${id} not found.`);
    }
    Object.keys(collectionData).forEach((key) => {
      collection[key] = collectionData[key];
    });
    await this.collectionRepo.update(id, collection);
    return { status: "success", data: collection };
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
