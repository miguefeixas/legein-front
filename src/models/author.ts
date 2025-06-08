import { autoserializeAs } from 'dcerialize';

export class Author {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Name of the author
   */
  @autoserializeAs(() => String) name: string;

  /**
   * First last name of the author
   */
  @autoserializeAs(() => String, 'first_last_name') firstLastName: string;

  /**
   * Second last name of the author
   */
  @autoserializeAs(() => String, 'second_last_name') secondLastName?: string;

  /**
   * Full name
   */
  @autoserializeAs(() => String, 'full_name') fullName?: string;

  constructor(
    id: number,
    name: string,
    firstLastName: string,
    secondLastName?: string,
    fullName?: string
  ) {
    this.id = id;
    this.name = name;
    this.firstLastName = firstLastName;
    this.secondLastName = secondLastName;
    this.fullName = fullName;
  }
}
