import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle("NFT marketplace API")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        description: "Enter JWT token",
        bearerFormat: "Token",
        name: "access-token",
      },
      "access-token"
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get<string>("CORS_ALLOW_ORIGIN");

  const corsOptions: CorsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
  };
  app.enableCors(corsOptions);

  await app.listen(3001);
}
bootstrap();
