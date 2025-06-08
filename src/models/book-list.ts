import { autoserializeAs, autoserializeAsArray } from 'dcerialize';
import { User } from './user';
import { Book } from './book';

export class BookList {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Name of the list
   */
  @autoserializeAs(() => String) name: string;

  /**
   * User ID that owns the list
   */
  @autoserializeAs(() => Number, 'user_id') userId: number;

  /**
   * Owner of the list
   */
  @autoserializeAs(() => User) user?: User;

  /**
   * Books contained in the list
   */
  @autoserializeAsArray(() => Book) books?: Book[];

  constructor(
    id: number,
    name: string,
    userId: number,
    user?: User,
    books?: Book[]
  ) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.user = user;
    this.books = books;
  }
}
