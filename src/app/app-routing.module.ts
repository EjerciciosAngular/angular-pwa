import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarRegistrosComponent } from './components/listar-registros/listar-registros.component';
import { RegistroSeguroComponent } from './components/registro-seguro/registro-seguro.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'registro' },
  { path: 'registro', component: RegistroSeguroComponent },
  { path: 'listar', component: ListarRegistrosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
