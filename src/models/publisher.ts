import { autoserializeAs } from 'dcerialize';

export class Publisher {
  /**
   * ID
   */
  @autoserializeAs(() => Number) id: number;

  /**
   * Name of the publisher
   */
  @autoserializeAs(() => String) name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
