import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiQuery,
  ApiOkResponse,
} from "@nestjs/swagger";
import { CollectionDto } from "./dto/collection.dto";
import { IResponse } from "src/app.types";
import { CollectionCategory } from "./collection.enum";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/users/get-user.decorator";
import { CollectionService } from "./collection.service";
import { User } from "src/users/users.entity";
import { NotAuthorizedDto } from "src/users/dto/unauthorized-error.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";
import { Collection } from "./collection.entity";

@ApiTags("Collections")
@Controller("collection")
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  @ApiOkResponse({
    description: "All Collections",
    isArray: true,
    type: Collection,
  })
  @ApiQuery({
    name: "category",
    enum: CollectionCategory,
    required: false,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "offset",
    type: Number,
    required: false,
  })
  async getAll(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
    @Query("category") category?: CollectionCategory
  ): Promise<IResponse> {
    return this.collectionService.getAll(
      Number(limit),
      Number(offset),
      category
    );
  }

  @Get("/:id")
  @ApiOkResponse({
    description: "Collection details",
    type: Collection,
  })
  @ApiNotFoundResponse({
    description: "Collection does not exist",
  })
  async getById(@Param("id") id: string): Promise<IResponse> {
    return this.collectionService.getById(id);
  }

  @Get("user/:userId")
  @ApiOkResponse({
    description: "Users Collections",
    isArray: true,
    type: Collection,
  })
  async getByUserId(@Param("userId") userId: string): Promise<IResponse> {
    return this.collectionService.getByUserId(userId);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth("access-token")
  @Post()
  @ApiOkResponse({
    description: "Add a Collection",
    type: Collection,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: NotAuthorizedDto,
  })
  @ApiBody({ type: CollectionDto })
  async add(
    @GetUser() user: User,
    @Body() collection: CollectionDto
  ): Promise<IResponse> {
    return this.collectionService.add(collection, user["user_id"]);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth("access-token")
  @Patch("/:id")
  @ApiOkResponse({
    description: "Collection update",
    type: Collection,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: NotAuthorizedDto,
  })
  @ApiNotFoundResponse({
    description: "Collection does not exist",
  })
  async update(
    @Body() collection: UpdateCollectionDto,
    @Param("id") id: string
  ): Promise<IResponse> {
    return this.collectionService.update(id, collection);
  }
}
