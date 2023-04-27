import {
  Body,
  Controller,
  Delete,
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
} from "@nestjs/swagger";
import { CollectionDto } from "./dto/collection.dto";
import { IResponse } from "src/app.types";
import { CollectionCategory } from "./collection.enum";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/users/get-user.decorator";
import { CollectionService } from "./collection.service";
import { User } from "src/users/users.entity";
import { NotAuthorizedDto } from "src/users/dto/unauthorized-error.dto";

@ApiTags("Collections")
@Controller("collection")
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
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
  @ApiNotFoundResponse({
    description: "Collection does not exist",
  })
  async getById(@Param("id") id: string): Promise<IResponse> {
    return this.collectionService.getById(id);
  }

  @Get("users/:userId")
  async getByUserId(@Param("userId") userId: string): Promise<IResponse> {
    return this.collectionService.getByUserId(userId);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth("access-token")
  @Post()
  @ApiBody({ type: CollectionDto })
  @ApiUnauthorizedResponse({
    description: "Invalid credentails",
    type: NotAuthorizedDto,
  })
  async add(
    @GetUser() user: User,
    @Body() collection: CollectionDto
  ): Promise<IResponse> {
    console.log({ user });
    return this.collectionService.add(collection, user.id);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth("access-token")
  @Patch("/:id")
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: NotAuthorizedDto,
  })
  @ApiNotFoundResponse({
    description: "Collection does not exist",
  })
  async update(
    @Body() collection: CollectionDto,
    @Param("id") id: string
  ): Promise<IResponse> {
    return this.collectionService.update(id, collection);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth("access-token")
  @ApiUnauthorizedResponse({
    description: "Invalid credentails",
    type: NotAuthorizedDto,
  })
  @Delete("/:id")
  async remove(@Param("id") id: string): Promise<IResponse> {
    return this.collectionService.remove(id);
  }
}
