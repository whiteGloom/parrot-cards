import {v4 as UUIDGenerator} from 'uuid';
import {uid} from 'uid';

export class UniqueIdGenerator {
  public static generateUUID(): string {
    return UUIDGenerator();
  }

  public static generateUID(length = 16): string {
    return uid(length);
  }
}
