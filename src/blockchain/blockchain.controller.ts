import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { IResponse } from "src/app.types";
import { NotAuthorizedDto } from "src/users/dto/unauthorized-error.dto";
import { BlockchainDto } from "./dto/blockchain.dto";
import { ChainNotFoundDto } from "./dto/blockchain-notFound.dto";
import { DeletedChainDto } from "./dto/chain-deleted.dto";
import { BlockchainService } from "./blockchain.service";

@Controller("blockchain")
@ApiTags("Blockchains")
export class BlockchainController {
  constructor(private blockchainService: BlockchainService) {}

  @Get()
  @ApiOkResponse({
    description: "Get blockchains",
    isArray: false,
  })
  async getAll(): Promise<IResponse> {
    return this.blockchainService.getAll();
  }

  @Get("/:id")
  @ApiResponse({
    status: 200,
    description: "Get chain by id",
    isArray: false,
    type: BlockchainDto,
  })
  @ApiNotFoundResponse({
    description: "User does not exist",
    type: ChainNotFoundDto,
  })
  getById(@Param("id") id: string): Promise<IResponse> {
    return this.blockchainService.getById(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  @ApiResponse({
    status: 201,
    description: "Add Blockchain",
    isArray: false,
    type: BlockchainDto,
  })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: BlockchainDto })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: NotAuthorizedDto,
  })
  async addChain(@Body() body: BlockchainDto): Promise<IResponse> {
    return this.blockchainService.addChain(body);
  }

  @UseGuards(AuthGuard())
  @Patch("/:id")
  @ApiOkResponse({
    description: "Blockchain updated successfully",
    isArray: false,
    type: BlockchainDto,
  })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: BlockchainDto })
  @ApiNotFoundResponse({
    description: "Chain does not exist",
    type: ChainNotFoundDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentails",
    type: NotAuthorizedDto,
  })
  update(
    @Body() body: BlockchainDto,
    @Param("id") id: string
  ): Promise<IResponse> {
    return this.blockchainService.update(id, body);
  }

  @UseGuards(AuthGuard())
  @Delete("/:id")
  @ApiBearerAuth("access-token")
  @ApiResponse({
    status: 200,
    description: "Chain Deleted",
    isArray: false,
    type: DeletedChainDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentails",
    type: NotAuthorizedDto,
  })
  @ApiNotFoundResponse({
    description: "Chain does not exist",
    type: ChainNotFoundDto,
  })
  remove(@Param("id") id: string): Promise<IResponse> {
    return this.blockchainService.remove(id);
  }
}
