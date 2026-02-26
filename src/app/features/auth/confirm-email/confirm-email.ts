import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OngService } from '../../../core/services/ong-service';

@Component({
  selector: 'app-confirm-email',
  standalone: false,
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.scss',
})
export class ConfirmEmail implements OnInit {

  carregando = true;
  sucesso = false;
  erro = false;
  mensagem = '';

  constructor(
    private route: ActivatedRoute,
    private ongService: OngService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    this.cdr.detectChanges();

    if (!token) {
      this.setErro('Token inválido.');
      return;
    }

    this.ongService.confirmarEmail(token).subscribe({
      next: (res) => {
        this.sucesso = true;
        this.mensagem = res.mensagem || 'E-mail confirmado com sucesso!';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro confirmação email:', err);

        const msg =
          err?.error?.mensagem ||
          err?.error?.message ||
          'Link inválido ou expirado.';

        this.setErro(msg);
        this.cdr.detectChanges();
      },
      complete: () => {
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
    this.cdr.detectChanges();
  }

  private setErro(msg: string): void {
    this.carregando = false;
    this.sucesso = false;
    this.erro = true;
    this.mensagem = msg;
  }
}
