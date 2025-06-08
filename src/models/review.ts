import { autoserializeAs, autoserializeAsArray } from 'dcerialize';
import { Book } from './book';
import { User } from './user';

export class ReviewBase {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Title of the review
   */
  @autoserializeAs(() => String) title: string;

  /**
   * Content of the review
   */
  @autoserializeAs(() => String) content: string;

  constructor(id: number, title: string, content: string) {
    this.id = id;
    this.title = title;
    this.content = content;
  }
}

export class KpiReviewsData {
  /**
   * Number of reviews created in the last week
   */
  @autoserializeAs(() => Number, 'total_past_week') totalPastWeek: number;

  /**
   * Reviews created this week
   */
  @autoserializeAsArray(() => ReviewBase, undefined, 'this_week')
  thisWeek: ReviewBase[];

  constructor(totalPastWeek: number, thisWeek: ReviewBase[]) {
    this.totalPastWeek = totalPastWeek;
    this.thisWeek = thisWeek;
  }
}

export class Review {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Title of the review
   */
  @autoserializeAs(() => String) title: string;

  /**
   * Content of the review
   */
  @autoserializeAs(() => String) content: string;

  /**
   * Rating
   */
  @autoserializeAs(() => Number) rating: number;

  /**
   * User ID
   */
  @autoserializeAs(() => Number, 'user_id') userId: number;

  /**
   * User
   */
  @autoserializeAs(() => User, 'user') user: User;

  /**
   * Book ID
   */
  @autoserializeAs(() => Number, 'book_id') bookId: number;

  /**
   * Book
   */
  @autoserializeAs(() => Book, 'book') book: Book;

  /**
   * Created at
   */
  @autoserializeAs(() => Date, 'created_at') createdAt: Date;

  /**
   * Disabled
   */
  @autoserializeAs(() => Boolean) disabled: boolean;

  constructor(
    id: number,
    title: string,
    content: string,
    rating: number,
    userId: number,
    user: User,
    bookId: number,
    book: Book,
    createdAt: Date,
    disabled: boolean
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.rating = rating;
    this.userId = userId;
    this.user = user;
    this.bookId = bookId;
    this.book = book;
    this.createdAt = createdAt;
    this.disabled = disabled;
  }
}
