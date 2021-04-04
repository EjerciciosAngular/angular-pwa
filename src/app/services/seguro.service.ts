import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Observable } from 'rxjs';
import { Registro } from '../models/registro.model';
import { OnlineOfflineService } from './online-offline.service';

@Injectable({
  providedIn: 'root'
})
export class SeguroService {

  private API_SEGUROS = 'http://localhost:9000';
  private db!: Dexie;
  private table!: Dexie.Table<Registro, any>;

  constructor(
    private http: HttpClient,
    private onlineOfflineService: OnlineOfflineService
  ) { 
    this.listenStatusConnection();
    this.startIndexDb();
  }

  private startIndexDb() {
    this.db = new Dexie('db-seguros');
    this.db.version(1).stores({
      seguro: 'id'
    });
    this.table = this.db.table('seguro');
  }

  private async createIndexDb(seguro: Registro) {
    try {
      await this.table.add(seguro);
      const todosSeguros: Registro[] =  await this.table.toArray();
      console.log('Seguros', todosSeguros);
    } catch (error) {
      console.log(error);
    }
  
  }

  private async sendIndexDbByApi() {
    const todosSeguros: Registro[] =  await this.table.toArray();
    for (const seguro of todosSeguros) {
      this.createSecureAPI(seguro);
      await this.table.delete(seguro.id);
      console.log('Seguro con id' + ' ' + seguro.id + ' ' + 'eliminado');
    }
  }

  private createSecureAPI(seguro: Registro) {
    this.http.post(this.API_SEGUROS + '/api/seguros', seguro)
    .subscribe( () => alert('Creado exitosamente'),
    (err) => console.log('Error')
    );
  }

  crateSecure(seguro: Registro) {
    if (this.onlineOfflineService.isOnline) {
      this.createSecureAPI(seguro);
    } else {
      this.createIndexDb(seguro);
    }
  }

  listar(): Observable<Registro[]> {
    return this.http.get<Registro[]>(this.API_SEGUROS + '/api/seguros' );
  }

  listenStatusConnection() {
    this.onlineOfflineService.statusConnection.subscribe(online => {
      if (online) {
        console.log('Modo online');
        this.sendIndexDbByApi();
      } else {
        console.log('Modo offline');
      }
    })
  }
}
