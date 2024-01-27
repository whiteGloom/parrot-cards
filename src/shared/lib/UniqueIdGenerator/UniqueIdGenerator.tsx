import {v4 as UUIDGenerator} from 'uuid';

export class UniqueIdGenerator {
  public static generateSimpleUniqueId(): string {
    return UUIDGenerator();
  }
}
