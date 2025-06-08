import { autoserializeAs, autoserializeAsArray } from 'dcerialize';
import { Publisher } from './publisher';
import { Author } from './author';
import { Genre } from './genre';

/**
 * Enum for book status
 */
export enum BookStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
}

export class BookBase {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Title of the book
   */
  @autoserializeAs(() => String) title: string;

  /**
   * Overview of the book
   */
  @autoserializeAs(() => String) overview: string;

  constructor(id: number, title: string, overview: string) {
    this.id = id;
    this.title = title;
    this.overview = overview;
  }
}

export class KpiBooksData {
  /**
   * Number of books created in the last week
   */
  @autoserializeAs(() => Number, 'total_past_week') totalPastWeek: number;

  /**
   * Books created this week
   */
  @autoserializeAsArray(() => BookBase, undefined, 'this_week')
  thisWeek: BookBase[];

  constructor(totalPastWeek: number, thisWeek: BookBase[]) {
    this.totalPastWeek = totalPastWeek;
    this.thisWeek = thisWeek;
  }
}

export class Book {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Title of the book
   */
  @autoserializeAs(() => String) title: string;

  /**
   * Overview of the book
   */
  @autoserializeAs(() => String) overview: string;

  /**
   * ISBN of the book
   */
  @autoserializeAs(() => String) isbn: string;

  /**
   * Publication date of the book
   */
  @autoserializeAs(() => Number, 'publication_year') publicationYear?: number;

  /**
   * Pages of the book
   */
  @autoserializeAs(() => Number) pages?: number;

  /**
   * Cover of the book
   */
  @autoserializeAs(() => String) cover?: string;

  /**
   * Language of the book
   */
  @autoserializeAs(() => String) language?: string;

  /**
   * Publisher of the book
   */
  @autoserializeAs(() => Number, 'publisher_id') publisherId?: number;

  /**
   * Status of the book
   */
  @autoserializeAs(() => String) status?: BookStatus;

  /**
   * Main genre Id
   */
  @autoserializeAs(() => Number, 'main_genre_id') mainGenreId?: number;

  /**
   * Secondary genre Id
   */
  @autoserializeAs(() => Number, 'secondary_genre_id')
  secondaryGenreId?: number;

  /**
   * Publisher of the book
   */
  @autoserializeAs(() => Publisher) publisher?: Publisher;

  /**
   * Authors of the book
   */
  @autoserializeAsArray(() => Author) authors?: Author[];

  /**
   * Genres of the book
   */
  @autoserializeAsArray(() => Genre) genres?: Genre[];

  /**
   * IDs of the author
   */
  @autoserializeAsArray(() => Number, undefined, 'author_ids')
  authorIds?: number[];

  constructor(
    id: number,
    title: string,
    overview: string,
    isbn: string,
    publicationYear: number,
    pages: number,
    cover: string,
    language: string,
    status: BookStatus,
    publisherId: number,
    authorIds: number[],
    mainGenreId: number,
    secondaryGenreId: number,
    publisher: Publisher,
    authors: Author[],
    genres: Genre[]
  ) {
    this.id = id;
    this.title = title;
    this.overview = overview;
    this.isbn = isbn;
    this.publicationYear = publicationYear;
    this.pages = pages;
    this.cover = cover;
    this.language = language;
    this.status = status;
    this.publisherId = publisherId;
    this.authorIds = authorIds;
    this.mainGenreId = mainGenreId;
    this.secondaryGenreId = secondaryGenreId;
    this.publisher = publisher;
    this.authors = authors;
    this.genres = genres;
  }
}
