import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OngService } from '../../../core/services/ong-service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  form: FormGroup;
  carregando = false;
  erro = '';
  sucesso = '';

  constructor(
    private fb: FormBuilder,
    private ongService: OngService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.form.valueChanges.subscribe(() => {
      if (this.erro) this.erro = '';
      if (this.sucesso) this.sucesso = '';
    });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.sucesso = '';

    const email = this.form.get('email')!.value;

    this.ongService.solicitarAlteracaoSenha(email).subscribe({
      next: () => {
        this.carregando = false;
        this.form.reset();
        this.sucesso = 'Instruções enviadas! Verifique sua caixa de entrada.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        const status = err?.status;

        if (status === 404) {
          this.erro = 'Não encontramos nenhuma conta com esse e-mail.';
        } else if (status === 0 || status >= 500) {
          this.erro = 'Não foi possível conectar ao servidor. Tente novamente em instantes.';
        } else {
          this.erro =
            err?.error?.mensagem ||
            err?.error?.message ||
            'Ocorreu um erro inesperado. Tente novamente.';
        }

        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
