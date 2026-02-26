import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceiroService } from '../../../core/services/financeiro-service';

@Component({
  selector: 'app-donation',
  standalone: false,
  templateUrl: './donation.html',
  styleUrl: './donation.scss',
})
export class Donation {

  form: FormGroup;
  carregando = false;
  erro = '';
  sucesso = '';

  constructor(
    private fb: FormBuilder,
    private financeiroService: FinanceiroService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nomeDoador: ['', Validators.required],
      valor:      ['', [Validators.required, Validators.min(0.01)]],
      descricao:  ['', Validators.required],
    });

    this.form.valueChanges.subscribe(() => {
      if (this.erro) this.erro = '';
    });
  }

  get f() {
    return this.form.controls;
  }

  cadastrar(): void {
    this.sucesso = '';
    this.erro = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;

    const payload = {
      nomeDoador: this.form.value.nomeDoador,
      valor:      Number(this.form.value.valor),
      descricao:  this.form.value.descricao,
    };

    this.financeiroService.cadastrarDoacao(payload).subscribe({
      next: () => {
        this.sucesso = 'Doação cadastrada com sucesso!';
        this.form.reset();
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const status = err?.status;
        if (status === 0 || status >= 500)
          this.erro = 'Não foi possível conectar ao servidor. Tente novamente em instantes.';
        else
          this.erro = err?.error?.mensagem || err?.error?.message || 'Erro ao cadastrar a doação. Tente novamente.';

        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
