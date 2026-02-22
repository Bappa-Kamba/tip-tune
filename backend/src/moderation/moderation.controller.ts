import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from "@nestjs/common";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";
import { ModerationService } from "./moderation.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AddKeywordDto, ReviewActionDto } from "./dtos/keyword.dto";

@Controller("moderation")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  // Admin: Manage Global Keywords
  @Post("keywords")
  @Roles(UserRole.ADMIN)
  async addGlobalKeyword(
    @Body() data: { keyword: string; severity: string },
    @Request() req,
  ) {
    return this.moderationService.addKeyword(
      data.keyword,
      data.severity,
      req.user.id,
    );
  }

  // Artist: Manage Personal Keywords
  @Post("artist/keywords")
  @Roles(UserRole.ARTIST)
  async addArtistKeyword(@Body() data: AddKeywordDto, @Request() req) {
    return this.moderationService.addKeyword(
      data.keyword,
      data.severity,
      req.user.id,
      req.user.id,
    );
  }

  // Admin: Review Queue
  @Get("queue")
  @Roles(UserRole.ADMIN)
  async getQueue() {
    return this.moderationService.getPendingQueue();
  }

  @Put("queue/:logId/review")
  @Roles(UserRole.ADMIN)
  async reviewMessage(
    @Param("logId", ParseUUIDPipe) logId: string,
    @Body() data: ReviewActionDto,
    @Request() req,
  ) {
    return this.moderationService.resolveFlaggedMessage(
      logId,
      data.action,
      req.user.id,
    );
  }

  @Get("stats")
  @Roles(UserRole.ADMIN)
  async getStats() {
    return this.moderationService.getModerationStats();
  }
}
