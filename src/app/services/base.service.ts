import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import Dexie from 'dexie';
import { Observable } from 'rxjs';
import { OnlineOfflineService } from './online-offline.service';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T extends {id: string}> {

  private db!: Dexie;
  private table!: Dexie.Table<T, any>;

  protected http!: HttpClient;
  protected onlineOfflineService!: OnlineOfflineService;

  constructor(
    protected injector: Injector,
    protected nameTable: string,
    protected urlApi: string
  ) { 
    this.http = this.injector.get(HttpClient);
    this.onlineOfflineService = this.injector.get(OnlineOfflineService);
    this.listenStatusConnection();
    this.startIndexDb();
  }

  private startIndexDb() {
    this.db = new Dexie('db-seguros');
    this.db.version(1).stores({
      [this.nameTable]: 'id'
    });
    this.table = this.db.table(this.nameTable);
  }

  private async createIndexDb(table: T) {
    try {
      await this.table.add(table);
      const todosSeguros: T[] =  await this.table.toArray();
      console.log('Seguros', todosSeguros);
    } catch (error) {
      console.log(error);
    }
  
  }

  private async sendIndexDbByApi() {
    const todosSeguros: T[] =  await this.table.toArray();
    for (const table of todosSeguros) {
      this.createSecureAPI(table);
      await this.table.delete(table.id);
      console.log('Seguro con id' + ' ' + table.id + ' ' + 'eliminado');
    }
  }

  private createSecureAPI(table: T) {
    this.http.post(this.urlApi, table)
    .subscribe( () => alert('Creado exitosamente'),
    (err) => console.log('Error')
    );
  }

  crateSecure(table: T) {
    if (this.onlineOfflineService.isOnline) {
      this.createSecureAPI(table);
    } else {
      this.createIndexDb(table);
    }
  }

  listar(): Observable<T[]> {
    return this.http.get<T[]>(this.urlApi);
  }

  listenStatusConnection() {
    this.onlineOfflineService.statusConnection.subscribe(online => {
      if (online) {
        this.sendIndexDbByApi();
      } else {
        console.log('Modo offline');
      }
    })
  }
}
