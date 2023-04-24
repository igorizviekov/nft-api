import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";

import { WalletRepository } from "src/user-wallets/wallet.repository";
import { Wallet } from "src/user-wallets/wallet.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(WalletRepository)
    private walletRepo: WalletRepository,
    private configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get("JWT_SECRET"),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<Wallet> {
    const { wallet } = payload;
    const userWallet: Wallet = await this.walletRepo.findOne({
      wallet_address: wallet,
    });
    if (!userWallet) {
      throw new UnauthorizedException();
    }
    return userWallet;
  }
}
