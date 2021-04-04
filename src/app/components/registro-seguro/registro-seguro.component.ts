import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Registro } from '../../models/registro.model';
import { MarcaCarro } from '../../models/marcaCarro.model';
import { MarcaCarroService } from '../../services/marca-carro.service';
import { SeguroService } from '../../services/seguro.service';

@Component({
  selector: 'app-registro-seguro',
  templateUrl: './registro-seguro.component.html',
  styleUrls: ['./registro-seguro.component.scss']
})
export class RegistroSeguroComponent implements OnInit {

  public seguro = new Registro();
  public marcasCarro$!: Observable<MarcaCarro[]>;

  constructor(
    private marcaCarroService: MarcaCarroService,
    private seguroService: SeguroService
  ) { }

  ngOnInit(): void {
    this.marcasCarro$ = this.marcaCarroService.getMarcas();
    console.log(this.marcasCarro$);
  }

  createSecure() {
    console.log(this.seguro);
    this.seguro.id = this.seguro.placaCarro;
    this.seguroService.crateSecure(this.seguro);
  }

}
