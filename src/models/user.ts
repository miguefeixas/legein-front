import { autoserializeAs, autoserializeAsArray } from 'dcerialize';

import { UserRole } from 'src/definitions/user-role.enum';

export class StoredUserData {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Email of the user
   */
  @autoserializeAs(() => String) email: string;

  /**
   * Username
   */
  @autoserializeAs(() => String) username?: string;

  /**
   * Role of the user
   */
  @autoserializeAs(() => String, 'user_role') userRole: UserRole;

  constructor(id: number, email: string, username: string, userRole: UserRole) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.userRole = userRole;
  }
}

export class SessionUserData {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Email of the user
   */
  @autoserializeAs(() => String) email: string;

  /**
   * Username
   */
  @autoserializeAs(() => String) username?: string;

  /**
   * Role of the user
   */
  @autoserializeAs(() => String) userRole: UserRole;

  constructor(id: number, email: string, username: string, userRole: UserRole) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.userRole = userRole;
  }
}

export class KpiUserData {
  /**
   * Number of users created in the last week
   */
  @autoserializeAs(() => Number, 'total_past_week') totalPastWeek: number;

  /**
   * Users created this week
   */
  @autoserializeAsArray(() => StoredUserData, undefined, 'this_week')
  thisWeek: StoredUserData[];

  constructor(totalPastWeek: number, thisWeek: StoredUserData[]) {
    this.totalPastWeek = totalPastWeek;
    this.thisWeek = thisWeek;
  }
}

export class KpiEmergingAuthorsData {
  /**
   * Number of emerging authors created in the last week
   */
  @autoserializeAs(() => Number, 'total_past_week') totalPastWeek: number;

  /**
   * Emerging authors created this week
   */
  @autoserializeAsArray(() => StoredUserData, undefined, 'this_week')
  thisWeek: StoredUserData[];

  constructor(totalPastWeek: number, thisWeek: StoredUserData[]) {
    this.totalPastWeek = totalPastWeek;
    this.thisWeek = thisWeek;
  }
}

export class User {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Email of the user
   */
  @autoserializeAs(() => String) email: string;

  /**
   * Username
   */
  @autoserializeAs(() => String) username: string;

  /**
   * Role of the user
   */
  @autoserializeAs(() => String, 'user_role') userRole: UserRole;

  /**
   * Name of the user
   */
  @autoserializeAs(() => String) name: string;

  /**
   * First last name of the user
   */
  @autoserializeAs(() => String, 'first_last_name') firstLastName: string;

  /**
   * Second last name of the user
   */
  @autoserializeAs(() => String, 'second_last_name') secondLastName?: string;

  /**
   * Date of birth
   */
  @autoserializeAs(() => Date, 'date_of_birth') dateOfBirth?: Date;

  /**
   * Full name
   */
  @autoserializeAs(() => String, 'full_name') fullName?: string;

  /**
   * Created at
   */
  @autoserializeAs(() => Date, 'created_at') createdAt?: Date;

  /**
   * Modified at
   */
  @autoserializeAs(() => Date, 'modified_at') modifiedAt?: Date;

  /**
   * Disabled
   */
  @autoserializeAs(() => Boolean) disabled?: boolean;

  /**
   * Phone number of the user
   */
  @autoserializeAs(() => String, 'phone_number') phoneNumber?: string;

  /**
   * Profile picture
   */
  @autoserializeAs(() => String, 'profile_picture') profilePicture?: string;

  constructor(
    id: number,
    email: string,
    username: string,
    userRole: UserRole,
    name: string,
    firstLastName: string,
    secondLastName?: string,
    phoneNumber?: string,
    dateOfBirth?: Date,
    fullName?: string,
    createdAt?: Date,
    modifiedAt?: Date,
    disabled?: boolean,
    profilePicture?: string
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.userRole = userRole;
    this.name = name;
    this.firstLastName = firstLastName;
    this.secondLastName = secondLastName;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth;
    this.fullName = fullName;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
    this.disabled = disabled;
    this.profilePicture = profilePicture;
  }
}

export class UserPassword {
  /**
   * Current password
   */
  @autoserializeAs(() => String, 'current_password') currentPassword: string;

  /**
   * New password
   */
  @autoserializeAs(() => String) password: string;

  /**
   * Confirm new password
   */
  @autoserializeAs(() => String, 'password_confirmation')
  passwordConfirmation: string;

  constructor(
    currentPassword: string,
    password: string,
    passwordConfirmation: string
  ) {
    this.currentPassword = currentPassword;
    this.password = password;
    this.passwordConfirmation = passwordConfirmation;
  }
}

export class CompleteUser {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Email of the user
   */
  @autoserializeAs(() => String) email: string;

  /**
   * Username
   */
  @autoserializeAs(() => String) username: string;

  /**
   * Role of the user
   */
  @autoserializeAs(() => String, 'user_role') userRole: UserRole;

  /**
   * Name of the user
   */
  @autoserializeAs(() => String) name: string;

  /**
   * First last name of the user
   */
  @autoserializeAs(() => String, 'first_last_name') firstLastName: string;

  /**
   * Second last name of the user
   */
  @autoserializeAs(() => String, 'second_last_name') secondLastName?: string;

  /**
   * Date of birth
   */
  @autoserializeAs(() => Date, 'date_of_birth') dateOfBirth?: Date;

  /**
   * Full name
   */
  @autoserializeAs(() => String, 'full_name') fullName?: string;

  /**
   * Created at
   */
  @autoserializeAs(() => Date, 'created_at') createdAt?: Date;

  /**
   * Modified at
   */
  @autoserializeAs(() => Date, 'modified_at') modifiedAt?: Date;

  /**
   * Disabled
   */
  @autoserializeAs(() => Boolean) disabled?: boolean;

  /**
   * Profile picture
   */
  @autoserializeAs(() => String, 'profile_picture') profilePicture?: string;

  /**
   * Phone number of the user
   */
  @autoserializeAs(() => String, 'phone_number') phoneNumber?: string;

  constructor(
    id: number,
    email: string,
    username: string,
    userRole: UserRole,
    name: string,
    firstLastName: string,
    secondLastName?: string,
    phoneNumber?: string,
    dateOfBirth?: Date,
    fullName?: string,
    createdAt?: Date,
    modifiedAt?: Date,
    disabled?: boolean,
    profilePicture?: string
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.userRole = userRole;
    this.name = name;
    this.firstLastName = firstLastName;
    this.secondLastName = secondLastName;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth;
    this.fullName = fullName;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
    this.disabled = disabled;
    this.profilePicture = profilePicture;
  }
}
