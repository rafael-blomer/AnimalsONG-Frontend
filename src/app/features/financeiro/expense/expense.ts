import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FinanceiroService } from '../../../core/services/financeiro-service';

@Component({
  selector: 'app-expense',
  standalone: false,
  templateUrl: './expense.html',
  styleUrl: './expense.scss',
})
export class Expense {

  form: FormGroup;
  carregando = false;
  erro = '';
  sucesso = '';

  tiposDespesa = [
    { valor: 'MANTIMENTOS', label: 'Mantimentos' },
    { valor: 'INFRAESTRUTURA', label: 'Infraestrutura' },
    { valor: 'EVENTOS', label: 'Eventos' },
    { valor: 'OUTRO', label: 'Outro' },
  ];

  constructor(
    private fb: FormBuilder,
    private financeiroService: FinanceiroService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      tipoDespesa: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      descricao: ['', Validators.required],
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
      tipoDespesa: this.form.value.tipoDespesa,
      valor: Number(this.form.value.valor),
      descricao: this.form.value.descricao,
    };

    this.financeiroService.cadastrarDespesa(payload).subscribe({
      next: () => {
        this.sucesso = 'Despesa cadastrada com sucesso!';
        this.form.reset();
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const status = err?.status;
        if (status === 0 || status >= 500)
          this.erro = 'Não foi possível conectar ao servidor. Tente novamente em instantes.';
        else
          this.erro = err?.error?.mensagem || err?.error?.message || 'Erro ao cadastrar a despesa. Tente novamente.';

        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
