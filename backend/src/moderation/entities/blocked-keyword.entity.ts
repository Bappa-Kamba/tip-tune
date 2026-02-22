import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum KeywordSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

@Entity("blocked_keywords")
export class BlockedKeyword {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index()
  keyword: string;

  @Column({
    type: "enum",
    enum: KeywordSeverity,
    default: KeywordSeverity.MEDIUM,
  })
  severity: KeywordSeverity;

  @Column({ type: "uuid", nullable: true })
  artistId: string | null; // Null if global (admin-added)

  @Column({ type: "uuid" })
  addedById: string;

  @ManyToOne(() => User)
  addedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
