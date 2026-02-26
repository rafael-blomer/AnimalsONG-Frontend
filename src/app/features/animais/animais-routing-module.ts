import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Create } from './create/create';
import { List } from './list/list';
import { Edit } from './edit/edit';

const routes: Routes = [
  {
    path: 'cadastrar', component: Create
  },
  {
    path: 'listar', component: List
  },
  {
    path: 'editar/:id', component: Edit
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimaisRoutingModule { }
