import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import * as bodyParser from "body-parser";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip unknown properties
            forbidNonWhitelisted: true, // Throw an error if unknown properties are present
            transform: true, // Automatically transform payloads to DTO instances
        })
    );
    await app.listen(3000);
}
bootstrap();
