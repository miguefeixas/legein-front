import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'textLimit',
})
export class TextLimitPipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (value.length > limit) {
      const trimmedValue = value.slice(0, limit);
      const lastSpaceIndex = trimmedValue.lastIndexOf(' ');

      return lastSpaceIndex > 0 ? trimmedValue.slice(0, lastSpaceIndex) + '...' : trimmedValue + '...';
    }

    return value;
  }
}