import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { ConfirmEmail } from './confirm-email/confirm-email';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';

const routes: Routes = [
  { path: 'registrar', component: Register },
  { path: 'confirmar-email', component: ConfirmEmail },
  { path: 'login', component: Login },
  { path: 'esqueci-senha', component: ForgotPassword },
  { path: 'resetar-senha', component: ResetPassword }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
