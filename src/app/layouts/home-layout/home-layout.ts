import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';
import { OngService } from '../../core/services/ong-service';
import { OngResponse } from '../../core/models/ong-response';

@Component({
  selector: 'app-home-layout',
  standalone: false,
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.scss',
})
export class HomeLayout implements OnInit {

  nomeEmpresa = 'Nome da Empresa';
  ong!: OngResponse;

  constructor(
    private authService: AuthService,
    private ongService: OngService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
        this.ongService.buscarOngPorToken().subscribe({
      next: (ong) => {
        this.ong = ong;
        this.nomeEmpresa = ong.nome;
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this.authService.logout()
    this.router.navigate([''])
  }
}
