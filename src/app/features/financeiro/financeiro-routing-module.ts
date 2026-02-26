import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Donation } from './donation/donation';
import { Expense } from './expense/expense';
import { History } from './history/history'

const routes: Routes = [
  {
    path: 'doacao', component: Donation
  },
  {
    path: 'despesa', component: Expense
  },
  {
    path: 'movimentacoes', component: History
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceiroRoutingModule { }
