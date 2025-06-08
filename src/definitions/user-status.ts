import { User } from '../models/user';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  DELETED = 'DELETED',
}

export function getUserStatus(user: User): UserStatus {
  if (user.disabled) {
    if (user.createdAt?.toISOString() === user.modifiedAt?.toISOString()) {
      return UserStatus.PENDING;
    } else {
      return UserStatus.DELETED;
    }
  } else {
    return UserStatus.ACTIVE;
  }
}
