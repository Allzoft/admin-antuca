import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import ImagenPipe from './profile-image.pipe';
import ItemImagePipe from './default-item.pipe';

@NgModule({
  declarations: [ImagenPipe, ItemImagePipe],
  imports: [CommonModule],
  exports: [ImagenPipe, ItemImagePipe],
})
export class PipesModule {}
