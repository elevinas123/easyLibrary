import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SettingsService } from "./settings.service";
import { SettingsSchema } from "./settings.schema";
import { SettingsController } from "./settings.controller";

@Module({
    controllers: [SettingsController],
    providers: [SettingsService],
    imports: [
        MongooseModule.forFeature([
            { name: "Settings", schema: SettingsSchema },
        ]),
    ],
    exports: [SettingsService],
})
export class SettingsModule {}
