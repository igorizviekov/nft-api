"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const config_schema_1 = require("./config.schema");
const users_module_1 = require("./users/users.module");
const nft_module_1 = require("./nft/nft.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: [`.env.stage.${process.env.STAGE}`],
                validationSchema: config_schema_1.ConfigValidationSchema,
            }),
            users_module_1.UsersModule,
            nft_module_1.NftModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    return {
                        type: "postgres",
                        host: configService.get("DB_HOST"),
                        port: configService.get("DB_PORT"),
                        username: configService.get("DB_USERNAME"),
                        password: configService.get("DB_PASSWORD"),
                        database: configService.get("DB_DATABASE"),
                        autoLoadEntities: true,
                        synchronize: true,
                    };
                },
            }),
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map