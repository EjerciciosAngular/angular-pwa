import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MarcaCarro } from '../models/marcaCarro.model';

interface CarResponse {
  Makes: Array<any>;
}

@Injectable({
  providedIn: 'root'
})
export class MarcaCarroService {

  private API_CARROS = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes';

  constructor(
    private http: HttpClient
  ) { }

  private mapMarcas(marcas: any): any[] {
    return marcas.map((marca: any) => ({
      codigo: marca.make_id,
      nombre: marca.make_display
    }));
  }

  public getMarcas(): Observable<MarcaCarro[]> {
    return this.http.jsonp(this.API_CARROS, 'callback').pipe(
      map((res: any) => this.mapMarcas(res.Makes))
    )
  }
}
