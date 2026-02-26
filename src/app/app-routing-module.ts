import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingLayout } from './layouts/landing-layout/landing-layout';
import { HomeLayout } from './layouts/home-layout/home-layout';
import { Home } from './features/dashboard/home/home';
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    component: LandingLayout,
    children: [
      {
        path: '', loadChildren: () => import('./features/landing-page/landing-page-module')
          .then(m => m.LandingPageModule)
      },
      {
        path: 'auth', canActivate: [GuestGuard], loadChildren: () => import('./features/auth/auth-module')
          .then(m => m.AuthModule)
      }
    ]
  },
  {
    path: 'home',
    component: HomeLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard', component: Home
      },
      {
        path: 'animais',
        loadChildren: () =>
          import('./features/animais/animais-module')
            .then(m => m.AnimaisModule)
      },
      {
        path: 'financeiro',
        loadChildren: () => import('./features/financeiro/financeiro-module')
          .then(m => m.FinanceiroModule)
      },
      {
        path: 'ong',
        loadChildren: () => import('./features/ong/ong-module')
          .then(m => m.OngModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
