import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimalResponse } from '../../../core/models/animal-response';
import { PageResponse } from '../../../core/models/page-response';
import { AnimaisService } from '../../../core/services/animais-service';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit {

  animais: AnimalResponse[] = [];
  page = 0;
  totalPages = 0;
  totalElements = 0;
  carregando = false;
  erro = '';

  form: FormGroup;

  especies = [
    { valor: '', label: 'Todas' },
    { valor: 'CACHORRO', label: 'Cachorro' },
    { valor: 'GATO', label: 'Gato' },
    { valor: 'OUTRO', label: 'Outro' },
  ];

  listaStatus = [
    { valor: '', label: 'Todos' },
    { valor: 'ATIVO', label: 'Ativo' },
    { valor: 'ADOTADO', label: 'Adotado' },
    { valor: 'OBITO', label: 'Óbito' },
  ];

  constructor(
    private fb: FormBuilder,
    private animaisService: AnimaisService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      especie:      [''],
      statusFiltro: [''],
      ordem:        ['dataEntrada,desc'],
    });
  }

  ngOnInit(): void {
    this.buscar();
  }

  buscar(pagina = 0): void {
    this.erro = '';
    this.carregando = true;
    this.page = pagina;

    const { especie, statusFiltro, ordem } = this.form.value;

    this.animaisService.listarAnimais(pagina, 10, ordem).subscribe({
      next: (res: PageResponse<AnimalResponse>) => {
        let conteudo = res.content;

        if (especie)      conteudo = conteudo.filter(a => a.especie === especie);
        if (statusFiltro) conteudo = conteudo.filter(a => a.status === statusFiltro);

        this.animais = conteudo;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const httpStatus = err?.status;
        if (httpStatus === 0 || httpStatus >= 500)
          this.erro = 'Não foi possível conectar ao servidor. Tente novamente.';
        else
          this.erro = err?.error?.mensagem || err?.error?.message || 'Erro ao carregar os animais.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  paginaAnterior(): void {
    if (this.page > 0) this.buscar(this.page - 1);
  }

  proximaPagina(): void {
    if (this.page < this.totalPages - 1) this.buscar(this.page + 1);
  }

  editar(id: string): void {
    this.router.navigate(['/home/animais/editar', id]);
  }

  especieLabel(especie: string): string {
    const map: Record<string, string> = {
      CACHORRO: 'Cachorro',
      GATO: 'Gato',
      OUTRO: 'Outro',
    };
    return map[especie] ?? especie;
  }

  statusLabel(s: string): string {
    const map: Record<string, string> = {
      ATIVO:   'Ativo',
      ADOTADO: 'Adotado',
      OBITO:   'Óbito',
    };
    return map[s] ?? s;
  }

  porteLabel(porte: string): string {
    const map: Record<string, string> = {
      PEQUENO: 'Pequeno',
      MEDIO:   'Médio',
      GRANDE:  'Grande',
    };
    return map[porte] ?? porte;
  }

  sexoLabel(sexo: string): string {
    const map: Record<string, string> = {
      MACHO:      'Macho',
      FEMEA:      'Fêmea',
      INDEFINIDO: 'Indefinido',
    };
    return map[sexo] ?? sexo;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
