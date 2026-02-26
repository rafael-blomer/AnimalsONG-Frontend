import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OngService } from '../../../core/services/ong-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  form: FormGroup;
  carregando = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private ongService: OngService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
    this.form.valueChanges.subscribe(() => {
      if (this.erro) this.erro = '';
    });
  }

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.ongService.login(this.form.value).subscribe({
      next: (response) => {
        this.authService.setToken(response.mensagem)
        this.router.navigate(['/home/dashboard']);
      },
      error: (err) => {
        const status = err?.status;

        if (status === 401 || status === 403) {
          this.erro = 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.';
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
      },
      complete: () => {
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
