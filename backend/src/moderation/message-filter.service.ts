import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  BlockedKeyword,
  KeywordSeverity,
} from "./entities/blocked-keyword.entity";
import {
  MessageModerationLog,
  ModerationResult,
} from "./entities/moderation-log.entity";
import { Tip } from "../tips/entities/tip.entity";

@Injectable()
export class MessageFilterService {
  constructor(
    @InjectRepository(BlockedKeyword)
    private readonly keywordRepo: Repository<BlockedKeyword>,
    @InjectRepository(MessageModerationLog)
    private readonly logRepo: Repository<MessageModerationLog>,
  ) {}

  async processMessage(
    tip: Tip,
    message: string,
  ): Promise<{ result: ModerationResult; filteredMessage: string }> {
    if (!message)
      return { result: ModerationResult.APPROVED, filteredMessage: message };

    const artistId = tip.artistId;
    let currentResult = ModerationResult.APPROVED;
    let reason = "";
    let filteredMessage = message;

    // 1. Regex Pass: Spam & URL Detection
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const repetitiveRegex = /(.)\1{4,}/g; // Matches "aaaaa"

    if (urlRegex.test(message) || repetitiveRegex.test(message)) {
      currentResult = ModerationResult.FLAGGED;
      reason = "Spam/URL pattern detected";
    }

    // 2. Keyword Pass: Global & Artist-specific
    const keywords = await this.keywordRepo.find({
      where: [
        { artistId: null }, // Global
        { artistId: artistId }, // Specific to artist
      ],
    });

    for (const kw of keywords) {
      const regex = new RegExp(`\\b${this.escapeRegex(kw.keyword)}\\b`, "gi");
      if (regex.test(message)) {
        if (kw.severity === KeywordSeverity.HIGH) {
          currentResult = ModerationResult.BLOCKED;
          reason = `High-severity keyword: ${kw.keyword}`;
          break; // Stop immediately for high severity
        } else {
          if (currentResult !== ModerationResult.FLAGGED) {
            currentResult = ModerationResult.FILTERED;
          }
          filteredMessage = filteredMessage.replace(regex, "***");
          reason = reason || "Keyword filtering applied";
        }
      }
    }

    // 3. Log the result
    await this.logRepo.save({
      tipId: tip.id,
      originalMessage: message,
      moderationResult: currentResult,
      filterReason: reason,
      confidenceScore: currentResult === ModerationResult.APPROVED ? 1.0 : 0.5,
    });

    return { result: currentResult, filteredMessage };
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
