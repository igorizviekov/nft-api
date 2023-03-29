"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    const options = new swagger_1.DocumentBuilder()
        .setTitle("NFT marketplace API")
        .setVersion("1.0")
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        description: "Enter JWT token",
        bearerFormat: "Token",
        name: "access-token",
    }, "access-token")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup("api", app, document);
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map