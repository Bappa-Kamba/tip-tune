import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Tip } from "../../tips/entities/tip.entity";
import { User } from "../../users/entities/user.entity";

export enum ModerationResult {
  APPROVED = "approved",
  FILTERED = "filtered", // Words replaced with asterisks
  FLAGGED = "flagged", // Sent to review queue
  BLOCKED = "blocked", // Message completely hidden
}

@Entity("message_moderation_logs")
export class MessageModerationLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  tipId: string;

  @ManyToOne(() => Tip)
  @JoinColumn({ name: "tipId" })
  tip: Tip;

  @Column({ type: "text" })
  originalMessage: string;

  @Column({ type: "enum", enum: ModerationResult })
  moderationResult: ModerationResult;

  @Column({ nullable: true })
  filterReason: string;

  @Column({ type: "decimal", precision: 3, scale: 2, default: 1.0 })
  confidenceScore: number;

  @Column({ default: false })
  wasManuallyReviewed: boolean;

  @Column({ type: "uuid", nullable: true })
  reviewedById: string;

  @ManyToOne(() => User)
  reviewedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
