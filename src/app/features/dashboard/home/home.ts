import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AnimaisService } from '../../../core/services/animais-service';
import { FinanceiroService } from '../../../core/services/financeiro-service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  totalAnimais = 0;
  totalAdotados = 0;
  totalDoacoes = 0;
  totalDespesas = 0;

  carregando = true;
  erro = '';

  constructor(
    private animaisService: AnimaisService,
    private financeiroService: FinanceiroService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    const hoje = new Date().toISOString().split('T')[0];
    let pendentes = 4;

    const concluir = () => {
      pendentes--;
      if (pendentes === 0) {
        this.carregando = false;
        this.cdr.detectChanges();
      }
    };

    // Total de animais
    this.animaisService.listarAnimais(0, 1, 'dataEntrada,desc').subscribe({
      next: (res) => {
        this.totalAnimais = res.totalElements;
        concluir();
      },
      error: () => concluir()
    });

    // Total de adotados
    this.animaisService.listarAnimais(0, 9999, 'dataEntrada,desc').subscribe({
      next: (res) => {
        this.totalAdotados = res.content.filter(a => a.status === 'ADOTADO').length;
        concluir();
      },
      error: () => concluir()
    });

    // Total de doações hoje
    this.financeiroService.listarDoacoesPorDia(hoje).subscribe({
      next: (doacoes) => {
        this.totalDoacoes = doacoes.reduce((acc, d) => acc + d.valor, 0);
        concluir();
      },
      error: () => concluir()
    });

    // Total de despesas hoje
    this.financeiroService.listarDespesasPorDia(hoje).subscribe({
      next: (despesas) => {
        this.totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
        concluir();
      },
      error: () => concluir()
    });
  }
}
