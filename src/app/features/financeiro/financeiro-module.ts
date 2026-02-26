import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceiroRoutingModule } from './financeiro-routing-module';
import { Donation } from './donation/donation';
import { Expense } from './expense/expense';
import { History } from './history/history';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Donation,
    Expense,
    History
  ],
  imports: [
    CommonModule,
    FinanceiroRoutingModule,
    ReactiveFormsModule
  ]
})
export class FinanceiroModule { }
