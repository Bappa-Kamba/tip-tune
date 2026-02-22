import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModerationController } from "./moderation.controller";
import { ModerationService } from "./moderation.service";
import { MessageFilterService } from "./message-filter.service";
import { BlockedKeyword } from "./entities/blocked-keyword.entity";
import { MessageModerationLog } from "./entities/moderation-log.entity";
import { Tip } from "../tips/entities/tip.entity";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BlockedKeyword, MessageModerationLog, Tip]),
    NotificationsModule,
  ],
  controllers: [ModerationController],
  providers: [ModerationService, MessageFilterService],
  exports: [MessageFilterService],
})
export class ModerationModule {}
