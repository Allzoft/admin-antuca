import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@environment/environment';
@Pipe({
    name: 'image',
    standalone: false
})
export default class ImagenPipe implements PipeTransform {
  transform(img: any): any {
    let url = environment.url_public + '/uploads/';

    if (img === '') {
      return 'assets/profile-image2.svg';
    }

    return url + img;
  }
}
