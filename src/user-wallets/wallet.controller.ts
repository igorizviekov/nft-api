import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { WalletNotFoundDto } from "./dto/wallet-notFound.dto";
import { WalletService } from "./wallet.service";
import { WalletDto } from "./dto/wallet.dto";
import { WalletDeletedDto } from "./dto/wallet-deleted.dto";

@Controller("wallets")
@ApiTags("UserWallets")
export class WalletsController {
  constructor(private walletService: WalletService) {}

  @UseGuards(AuthGuard())
  @ApiBearerAuth("access-token")
  @Get()
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: NotAuthorizedDto,
  })
  @ApiOkResponse({
    description: "Get all wallets",
    isArray: false,
  })
  async getAll(): Promise<IResponse> {
    return this.walletService.getAll();
  }

  @UseGuards(AuthGuard())
  @Get("/:id")
  @ApiResponse({
    status: 200,
    description: "Get wallet by id",
    isArray: false,
    type: WalletDto,
  })
  @ApiNotFoundResponse({
    description: "Wallet does not exist",
    type: WalletNotFoundDto,
  })
  @ApiBearerAuth("access-token")
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: NotAuthorizedDto,
  })
  getById(@Param("id") id: string): Promise<IResponse> {
    return this.walletService.getById(id);
  }

  @UseGuards(AuthGuard())
  @Get("user/:id")
  @ApiOkResponse({
    description: "Get all wallets for a user",
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: "Wallet does not exist",
    type: WalletNotFoundDto,
  })
  @ApiBearerAuth("access-token")
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: NotAuthorizedDto,
  })
  async getUserWallets(@Param("id") id: string): Promise<IResponse> {
    return this.walletService.getUserWallets(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  @ApiResponse({
    status: 201,
    description: "Add Wallet",
    isArray: false,
    type: WalletDto,
  })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: WalletDto })
  @ApiUnauthorizedResponse({
    description: "Invalid credentials",
    type: NotAuthorizedDto,
  })
  async addWallet(@Body() body: WalletDto): Promise<IResponse> {
    return this.walletService.addWallet(body);
  }

  @UseGuards(AuthGuard())
  @Delete("/:id")
  @ApiBearerAuth("access-token")
  @ApiResponse({
    status: 200,
    description: "Wallet Deleted",
    isArray: false,
    type: WalletDeletedDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid credentails",
    type: NotAuthorizedDto,
  })
  @ApiNotFoundResponse({
    description: "Wallet does not exist",
    type: WalletNotFoundDto,
  })
  remove(@Param("id") id: string): Promise<IResponse> {
    return this.walletService.remove(id);
  }
}
