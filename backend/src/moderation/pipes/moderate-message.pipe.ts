import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class ModerateMessagePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // We only care about the 'message' field in the incoming DTO
    if (value && typeof value === "object" && value.message) {
      let msg = value.message as string;

      // 1. Basic Sanitization
      msg = msg.trim();

      // 2. Prevent HTML Injection (Simple escape)
      msg = msg.replace(/<[^>]*>?/gm, "");

      // 3. Length constraint (Safety check)
      if (msg.length > 500) {
        throw new BadRequestException(
          "Tip message is too long (max 500 characters)",
        );
      }

      value.message = msg;
    }
    return value;
  }
}
