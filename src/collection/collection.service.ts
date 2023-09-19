import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CollectionDto } from "./dto/collection.dto";
import { IResponse } from "src/app.types";
import { CollectionRepository } from "./collection.repository";
import { CollectionCategory } from "./collection.enum";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import { create as ipfsClient } from "ipfs-http-client";
import { ConfigService } from "@nestjs/config";
import rimraf from "rimraf";
import yauzl from "yauzl";
import mkdirp from "mkdirp";
import { pipeline } from "stream";
import { promisify } from "util";
import { promises as fsPromises } from "fs";

const readFile = util.promisify(fs.readFile);
const streamPipeline = promisify(pipeline);
async function unzip(
  file: Express.Multer.File,
  extractionPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    yauzl.open(file.path, { lazyEntries: true }, (err, zipfile) => {
      if (err) throw err;

      zipfile.readEntry();

      zipfile.on("entry", async function (entry) {
        if (
          /__MACOSX/.test(entry.fileName) ||
          entry.fileName.indexOf(".DS_Store") !== -1
        ) {
          zipfile.readEntry();
          return;
        }
        if (/\/$/.test(entry.fileName)) {
          await mkdirp(`${extractionPath}/${entry.fileName}`);
          zipfile.readEntry();
        } else {
          zipfile.openReadStream(entry, async (err, readStream) => {
            if (err) throw err;
            await mkdirp(`${extractionPath}/${path.dirname(entry.fileName)}`);
            await streamPipeline(
              readStream,
              fs.createWriteStream(`${extractionPath}/${entry.fileName}`)
            );
            zipfile.readEntry();
          });
        }
      });

      zipfile.on("end", resolve);
      zipfile.on("error", reject);
    });
  });
}

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionRepository)
    private collectionRepo: CollectionRepository,
    private configService: ConfigService
  ) {}

  async add(collection: CollectionDto, userId: string): Promise<IResponse> {
    try {
      const newCollection = await this.collectionRepo.createCollection(
        collection,
        userId
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
    if (!file || file.mimetype !== "application/zip") {
      throw new HttpException(
        "Invalid file format. Please upload a zip file.",
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const collection = await this.collectionRepo.findOne(collectionId);
      if (!collection) {
        throw new NotFoundException(
          `Collection with id ${collectionId} not found.`
        );
      }
      const auth =
        "Basic " +
        Buffer.from(
          `${this.configService.get<string>(
            "INFURA_PROJECT_ID"
          )}:${this.configService.get<string>("INFURA_SECRET")}`
        ).toString("base64");

      const client = ipfsClient({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
          authorization: auth,
        },
      });
      // Extract zip contents to a directory
      const extractionPath = `./collections/${collectionId}`;
      await unzip(file, extractionPath);
      const fileName = path.parse(file.originalname).name;

      // Get list of files in art and metadata directories
      const artFiles = await fsPromises.readdir(
        path.join(extractionPath, fileName, "art")
      );
      const metadataFiles = await fsPromises.readdir(
        path.join(extractionPath, fileName, "metadata")
      );

      // Group images and their json files together
      const groupedFiles = artFiles.map((artFile) => {
        const metadataFile = metadataFiles.find(
          (file) => file.replace(".json", "") === artFile.replace(".png", "")
        );
        return { artFile, metadataFile };
      });

      // Upload images to IPFS and update json files with the URI
      const uploadedFiles = []; // This will store the information about the uploaded files.
      for (const { artFile, metadataFile } of groupedFiles) {
        const imageContent = await readFile(
          path.join(extractionPath, fileName, "art", artFile)
        );
        const addedImage = await client.add(imageContent);
        const imageUri = `https://${this.configService.get<string>(
          "INFURA_PROJECT_NAME"
        )}.infura-ipfs.io/ipfs/${addedImage.path}`;

        // Update the json file with the URI
        const metadataContent = JSON.parse(
          (
            await readFile(
              path.join(extractionPath, fileName, "metadata", metadataFile)
            )
          ).toString()
        );
        metadataContent.image = imageUri;
        // Upload updated JSON file to IPFS
        const updatedJsonBuffer = Buffer.from(JSON.stringify(metadataContent));
        const addedNFT = await client.add(updatedJsonBuffer);
        const nftUri = `https://${this.configService.get<string>(
          "INFURA_PROJECT_NAME"
        )}.infura-ipfs.io/ipfs/${addedNFT.path}`;

        uploadedFiles.push(nftUri);
      }
      // Remove the temporary extraction directory
      rimraf.sync(extractionPath);
      fs.unlinkSync(file.path);

      collection.nfts = uploadedFiles;
      await this.collectionRepo.update(collectionId, collection);

      return { status: "success", data: uploadedFiles };
    } catch (e) {
      console.log({ e });
      throw new NotFoundException(`Error with uploading a file to IPFS`);
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

  async update(id: string, collectionData: CollectionDto): Promise<IResponse> {
    const collection = await this.collectionRepo.findOne(id);
    if (!collection) {
      throw new NotFoundException(`Collection with id ${id} not found.`);
    }
    Object.keys(collectionData).forEach((key) => {
      if (key === "tokenId" || key === "nfts") {
        return;
      }
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
