import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { IResponse } from "src/app.types";
import { NftService } from "./nft.service";
import { MintNftDto } from "./dto/mint-nft.dto";
import { NotAuthorizedDto } from "src/users/dto/unauthorized-error.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("nft")
@ApiTags("NFT")
export class NftController {
  constructor(private nftService: NftService) {}

  @UseGuards(AuthGuard())
  @Post("/mint")
  @ApiOkResponse({
    description: "Mint success",
    isArray: false,
    //  type: UserDto,
  })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: MintNftDto })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: NotAuthorizedDto,
  })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  async mint(
    @UploadedFile() file,
    @Query("chain") chain: string,
    @Body() body: MintNftDto
  ): Promise<IResponse> {
    const { price, metadata } = body;
    return this.nftService.mintNft(file, Number(price), metadata, chain);
  }

  @UseGuards(AuthGuard())
  @Get("/contract")
  @ApiOkResponse({
    description: "Get contract",
    isArray: false,
    //  type: UserDto,
  })
  @ApiBearerAuth("access-token")
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: NotAuthorizedDto,
  })
  async getContract(@Query("chain") chain: string): Promise<IResponse> {
    return this.nftService.getContract(chain);
  }

  @UseGuards(AuthGuard())
  @Get("/all")
  @ApiOkResponse({
    description: "Get Nfts",
    isArray: false,
    //  type: UserDto,
  })
  @ApiBearerAuth("access-token")
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: NotAuthorizedDto,
  })
  async getNfts(@Query("chain") chain: string): Promise<IResponse> {
    return this.nftService.getNfts(chain);
  }
}
