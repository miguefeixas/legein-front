import { autoserializeAs } from 'dcerialize';
import { StoredUserData } from './user';

export class AuthCredentials {
  /**
   * Email
   */
  @autoserializeAs(() => String) username: string;

  /**
   * Password
   */
  @autoserializeAs(() => String) password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export class UserLogged {
  /**
   * Token
   */
  @autoserializeAs(() => String, 'access_token') accessToken: string;

  /**
   * User data
   */
  @autoserializeAs(() => StoredUserData) user: StoredUserData;

  constructor(accessToken: string, user: StoredUserData) {
    this.accessToken = accessToken;
    this.user = user;
  }
}

export class UserSignup {
  /**
   * Name
   */
  @autoserializeAs(() => String) name: string;

  /**
   * First last name
   */
  @autoserializeAs(() => String, 'first_last_name') firstLastName: string;

  /**
   * Username
   */
  @autoserializeAs(() => String) username: string;

  /**
   * Date of birth
   */
  @autoserializeAs(() => Date, 'date_of_birth') dateOfBirth: Date;

  /**
   * Email
   */
  @autoserializeAs(() => String) email: string;

  /**
   * Password
   */
  @autoserializeAs(() => String) password: string;

  /**
   * Emerging author
   */
  @autoserializeAs(() => Boolean, 'emerging_author') emergingAuthor: boolean;

  constructor(
    name: string,
    firstLastName: string,
    username: string,
    dateOfBirth: Date,
    email: string,
    password: string,
    emergingAuthor: boolean
  ) {
    this.name = name;
    this.firstLastName = firstLastName;
    this.username = username;
    this.dateOfBirth = dateOfBirth;
    this.email = email;
    this.password = password;
    this.emergingAuthor = emergingAuthor;
  }
}
