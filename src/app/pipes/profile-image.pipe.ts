import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@environment/environment';
@Pipe({
  name: 'image',
})
export default class ImagenPipe implements PipeTransform {
  transform(img: any): any {
    let url = environment.url_public + '/uploads/';

    if (img === '') {
      return 'assets/profile-image2.png';
    }

    return url + img;
  }
}
