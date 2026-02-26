import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoacaoResponse } from '../../../core/models/doacao-response';
import { DespesaResponse } from '../../../core/models/despesa-response';
import { FinanceiroService } from '../../../core/services/financeiro-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History {

  form: FormGroup;

  doacoes: DoacaoResponse[] = [];
  despesas: DespesaResponse[] = [];

  buscando = false;
  deletando: string | null = null;
  buscaRealizada = false;
  confirmandoDelete: string | null = null;

  erro = '';
  sucesso = '';

  constructor(
    private fb: FormBuilder,
    private financeiroService: FinanceiroService,
    private cdr: ChangeDetectorRef
  ) {
    const hoje = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      tipo: ['doacao', Validators.required],
      data: [hoje, Validators.required],
    });
  }

  get tipo() {
    return this.form.get('tipo')?.value;
  }

  get itens(): (DoacaoResponse | DespesaResponse)[] {
    return this.tipo === 'doacao' ? this.doacoes : this.despesas;
  }

  buscar(): void {
    if (this.form.invalid) return;

    this.erro = '';
    this.sucesso = '';
    this.buscando = true;
    this.doacoes = [];
    this.despesas = [];

    const data = this.form.get('data')?.value;

    if (this.tipo === 'doacao') {
      this.financeiroService.listarDoacoesPorDia(data).subscribe({
        next: (res) => {
          this.doacoes = res;
          this.buscaRealizada = true;
          this.buscando = false;
          this.cdr.detectChanges();
        },
        error: (err) => this.tratarErro(err)
      });
    } else {
      this.financeiroService.listarDespesasPorDia(data).subscribe({
        next: (res) => {
          this.despesas = res;
          this.buscaRealizada = true;
          this.buscando = false;
          this.cdr.detectChanges();
        },
        error: (err) => this.tratarErro(err)
      });
    }
  }

  private tratarErro(err: any): void {
    const status = err?.status;
    if (status === 0 || status >= 500)
      this.erro = 'Não foi possível conectar ao servidor. Tente novamente.';
    else
      this.erro = err?.error?.mensagem || err?.error?.message || 'Erro ao buscar os registros.';
    this.buscando = false;
    this.cdr.detectChanges();
  }

  confirmarDelete(id: string): void {
    this.confirmandoDelete = id;
  }

  cancelarDelete(): void {
    this.confirmandoDelete = null;
  }

  deletar(id: string): void {
    this.erro = '';
    this.sucesso = '';
    this.deletando = id;
    this.confirmandoDelete = null;

    const req$ = this.tipo === 'doacao'
      ? this.financeiroService.deletarDoacao(id)
      : this.financeiroService.deletarDespesa(id);

    req$.subscribe({
      next: () => {
        if (this.tipo === 'doacao')
          this.doacoes = this.doacoes.filter(d => d.id !== id);
        else
          this.despesas = this.despesas.filter(d => d.id !== id);

        this.sucesso = `${this.tipo === 'doacao' ? 'Doação' : 'Despesa'} excluída com sucesso!`;
        this.deletando = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const status = err?.status;
        if (status === 0 || status >= 500)
          this.erro = 'Não foi possível conectar ao servidor. Tente novamente.';
        else
          this.erro = err?.error?.mensagem || err?.error?.message || 'Erro ao excluir o registro.';
        this.deletando = null;
        this.cdr.detectChanges();
      }
    });
  }

  tipoDespesaLabel(tipo: string): string {
    const map: Record<string, string> = {
      MANTIMENTOS: 'Mantimentos',
      INFRAESTRUTURA: 'Infraestrutura',
      EVENTOS: 'Eventos',
      OUTRO: 'Outro',
    };
    return map[tipo] ?? tipo;
  }

  isDoacao(item: DoacaoResponse | DespesaResponse): item is DoacaoResponse {
    return 'nomeDoador' in item;
  }
}
