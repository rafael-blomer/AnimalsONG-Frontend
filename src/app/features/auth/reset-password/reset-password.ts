import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OngService } from '../../../core/services/ong-service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {

  form: FormGroup;
  carregando = false;
  erro = '';
  sucesso = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private ongService: OngService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
    }, { validators: this.senhasIguais });

    this.form.valueChanges.subscribe(() => {
      if (this.erro) this.erro = '';
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {
      this.erro = 'Token inválido ou expirado. Solicite uma nova redefinição de senha.';
    }
  }

  senhasIguais(group: FormGroup) {
    const nova = group.get('novaSenha')?.value;
    const confirmar = group.get('confirmarSenha')?.value;
    return nova === confirmar ? null : { senhasDivergentes: true };
  }

  get senhasDivergentes(): boolean {
    return this.form.hasError('senhasDivergentes') && this.form.get('confirmarSenha')!.touched;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.token) return;

    this.carregando = true;
    this.erro = '';
    this.sucesso = '';

    const payload = {
      token: this.token,
      novaSenha: this.form.get('novaSenha')!.value,
    };

    this.ongService.alterarSenha(payload).subscribe({
      next: () => {
        this.carregando = false;
        this.sucesso = 'Senha alterada com sucesso! Você já pode fazer login.';
        this.form.reset();
        this.cdr.detectChanges();

        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (err) => {
        const status = err?.status;

        if (status === 404) {
          this.erro = 'Token inválido ou expirado. Solicite uma nova redefinição de senha.';
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
