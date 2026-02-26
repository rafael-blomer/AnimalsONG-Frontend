import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimaisRoutingModule } from './animais-routing-module';
import { List } from './list/list';
import { Create } from './create/create';
import { Edit } from './edit/edit';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    List,
    Create,
    Edit
  ],
  imports: [
    CommonModule,
    AnimaisRoutingModule,
    ReactiveFormsModule
  ]
})
export class AnimaisModule { }
