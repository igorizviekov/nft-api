import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Response } from "express";
import { CollectionDto } from "./dto/collection.dto";
import { IResponse } from "src/app.types";
import { CollectionRepository } from "./collection.repository";
import { CollectionCategory } from "./collection.enum";
import * as path from "path";
import * as fs from "fs";
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

  async ipfs(
    file: Express.Multer.File,
    collectionId: string
  ): Promise<IResponse> {
    // Check if the file is a zip file
    if (file.mimetype !== "application/zip") {
      throw new HttpException(
        "Invalid file format. Please upload a zip file.",
        HttpStatus.BAD_REQUEST
      );
    }
    const collectionFolderPath = path.join("collections", collectionId);
    try {
      const match = await this.collectionRepo.findOne(collectionId);
      if (!match) {
        throw new NotFoundException(
          `Collection with id ${collectionId} not found.`
        );
      }
      // Create the folder structure if it doesn't exist
      if (!fs.existsSync(collectionFolderPath)) {
        fs.mkdirSync(collectionFolderPath, { recursive: true });
      }

      // Save the zip file to the server
      const zipFilePath = path.join(collectionFolderPath, file.originalname);
      fs.writeFileSync(zipFilePath, file.buffer);
      return { status: "success" };
    } catch (error) {
      console.error("Error processing zip file:", error);
      throw new HttpException(
        "An error occurred while processing the zip file.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getById(id: string, res: Response): Promise<IResponse> {
    try {
      const match = await this.collectionRepo.findOne(id);
      if (!match) {
        throw new NotFoundException(`Collection with id ${id} not found.`);
      }
      // TODO: attach collection contract ABI instead of a file
      const collectionFolderPath = path.join("collections", id);
      const files = fs.readdirSync(collectionFolderPath);
      if (files.length > 0) {
        const filePath = path.join(collectionFolderPath, files[0]);
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${files[0]}`
        );
        res.setHeader("Content-Type", "application/zip");
        fs.createReadStream(filePath).pipe(res);
      }
      return { status: "success", data: match };
    } catch (e) {
      throw new NotFoundException(`Collection with id ${id} not found.`);
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
