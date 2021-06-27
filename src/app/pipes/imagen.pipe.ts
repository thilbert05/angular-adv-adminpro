import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales'): unknown {
    const baseUrl = environment.base_url;

    if(img && img.includes('https://')) {
      return img;
    } else if (img && !img.includes('https://')) {
      return `${baseUrl}/upload/${tipo}/${img}`
    } else {
      return `${baseUrl}/upload/${tipo}/no-img.jpg`
    }
  }

}
