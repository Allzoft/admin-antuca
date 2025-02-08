import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@environment/environment';
@Pipe({
    name: 'item',
    standalone: false
})
export default class ItemImagePipe implements PipeTransform {
  transform(img: any): any {
    let url = environment.url_public + '/uploads/';

    if (img === '') {
      return 'assets/dish.svg';
    }

    return url + img;
  }
}
