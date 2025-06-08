import { autoserializeAs } from 'dcerialize';

export class Genre {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Name of the genre
   */
  @autoserializeAs(() => String) name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
