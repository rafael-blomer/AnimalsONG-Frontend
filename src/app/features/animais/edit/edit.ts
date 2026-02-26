import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimaisService } from '../../../core/services/animais-service';
import { AnimalResponse } from '../../../core/models/animal-response';

@Component({
  selector: 'app-edit',
  standalone: false,
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class Edit implements OnInit {

  animal!: AnimalResponse;
  form!: FormGroup;
  id!: string;

  carregando = true;
  salvando = false;
  desativando = false;
  confirmarDesativacao = false;

  fotoSelecionada: File | null = null;
  fotoPreview: string | null = null;

  erro = '';
  sucesso = '';

  portes = [
    { valor: 'PEQUENO', label: 'Pequeno' },
    { valor: 'MEDIO', label: 'Médio' },
    { valor: 'GRANDE', label: 'Grande' },
  ];

  listaStatus = [
    { valor: 'ATIVO', label: 'Ativo' },
    { valor: 'ADOTADO', label: 'Adotado' },
    { valor: 'OBITO', label: 'Óbito' },
  ];

  constructor(
    private fb: FormBuilder,
    private animaisService: AnimaisService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.carregarAnimal();
  }

  carregarAnimal(): void {
    this.animaisService.buscarAnimal(this.id).subscribe({
      next: (animal) => {
        this.animal = animal;
        this.buildForm(animal);
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const httpStatus = err?.status;
        if (httpStatus === 404)
          this.erro = 'Animal não encontrado.';
        else if (httpStatus === 0 || httpStatus >= 500)
          this.erro = 'Não foi possível conectar ao servidor. Tente novamente.';
        else
          this.erro = err?.error?.mensagem || err?.error?.message || 'Erro ao carregar os dados do animal.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private buildForm(animal: AnimalResponse): void {
    this.form = this.fb.group({
      // Editáveis
      castrado: [animal.castrado],
      statusAnimal: [animal.status, Validators.required],
      porte: [animal.porte, Validators.required],
      idadeAproximada: [animal.idadeAproximada, [Validators.required, Validators.min(0)]],
      // Somente leitura
      nome: [{ value: animal.nome, disabled: true }],
      raca: [{ value: animal.raca, disabled: true }],
      especie: [{ value: animal.especie, disabled: true }],
      sexo: [{ value: animal.sexo, disabled: true }],
    });
  }

  get f() { return this.form.controls; }

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

    if (!tiposPermitidos.includes(file.type)) {
      this.erro = 'Formato inválido. Use JPG, PNG ou WEBP.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.erro = 'A imagem deve ter no máximo 5MB.';
      return;
    }

    this.fotoSelecionada = file;
    this.erro = '';

    const reader = new FileReader();
    reader.onload = () => {
      this.fotoPreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removerFoto(): void {
    this.fotoSelecionada = null;
    this.fotoPreview = null;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.sucesso = '';

    const v = this.form.getRawValue();

    const payload = {
      castrado: v.castrado,
      status: v.statusAnimal,
      porte: v.porte,
      idadeAproximada: Number(v.idadeAproximada),
    };

    this.animaisService.atualizarAnimal(this.id, payload, this.fotoSelecionada ?? undefined).subscribe({
      next: (animal) => {
        this.animal = animal;
        this.buildForm(animal);
        this.fotoSelecionada = null;
        this.fotoPreview = null;
        this.sucesso = 'Dados atualizados com sucesso!';
        this.salvando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const httpStatus = err?.status;
        if (httpStatus === 0 || httpStatus >= 500)
          this.erro = 'Não foi possível conectar ao servidor. Tente novamente.';
        else
          this.erro = err?.error?.mensagem || err?.error?.message || 'Erro ao atualizar o animal.';
        this.salvando = false;
        this.cdr.detectChanges();
      }
    });
  }

  solicitarDesativacao(): void {
    this.confirmarDesativacao = true;
    this.erro = '';
    this.sucesso = '';
  }

  cancelarDesativacao(): void {
    this.confirmarDesativacao = false;
  }

  confirmarEDesativar(): void {
    this.desativando = true;

    this.animaisService.desativarAnimal(this.id).subscribe({
      next: () => {
        this.router.navigate(['/home/animais/listar']);
      },
      error: (err) => {
        this.erro = err?.error?.mensagem || 'Erro ao desativar o animal. Tente novamente.';
        this.confirmarDesativacao = false;
        this.desativando = false;
        this.cdr.detectChanges();
      }
    });
  }

  especieLabel(e: string): string {
    return ({ CACHORRO: 'Cachorro', GATO: 'Gato', OUTRO: 'Outro' } as any)[e] ?? e;
  }

  sexoLabel(s: string): string {
    return ({ MACHO: 'Macho', FEMEA: 'Fêmea', INDEFINIDO: 'Indefinido' } as any)[s] ?? s;
  }
}
