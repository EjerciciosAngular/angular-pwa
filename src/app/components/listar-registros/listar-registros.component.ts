import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SeguroService } from '../../services/seguro.service';
import { Registro } from '../../models/registro.model';

@Component({
  selector: 'app-listar-registros',
  templateUrl: './listar-registros.component.html',
  styleUrls: ['./listar-registros.component.scss']
})
export class ListarRegistrosComponent implements OnInit {

  public seguros$!: Observable<Registro[]>;

  constructor(
    private seguroService: SeguroService
  ) { }

  ngOnInit(): void {
    this.seguros$ = this.seguroService.listar();
  }
}
