import { autoserializeAs, autoserializeAsArray } from 'dcerialize';

export class DynamicUserData {
  /**
   * ID
   */
  @autoserializeAs(() => Number, 'total_past_week') totalPastWeek: number;

  /**
   * Campo dinámico
   */
  @autoserializeAsArray(() => String, undefined, 'this_week') thisWeek: any[];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(totalPastWeek: number, dynamicField: any) {
    this.totalPastWeek = totalPastWeek;
    this.thisWeek = dynamicField;
  }
}
