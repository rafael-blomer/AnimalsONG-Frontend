import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth-service'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/home/dashboard']);
    return false;
  }
}
