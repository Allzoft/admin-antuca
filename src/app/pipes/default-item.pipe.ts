import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@environment/environment';
@Pipe({
    name: 'item',
    standalone: false
})
export default class ItemImagePipe implements PipeTransform {
  transform(img: any): any {

    if (img === '') {
      return 'assets/dish.svg';
    }

    return img;
  }
}
