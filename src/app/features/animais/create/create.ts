import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimaisService } from '../../../core/services/animais-service';

@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  form: FormGroup;
  fotoSelecionada: File | null = null;
  fotoPreview: string | null = null;

  carregando = false;
  erro = '';
  sucesso = '';

  especies = [
    { valor: 'CACHORRO', label: 'Cachorro' },
    { valor: 'GATO', label: 'Gato' },
    { valor: 'OUTRO', label: 'Outro' },
  ];

  portes = [
    { valor: 'PEQUENO', label: 'Pequeno' },
    { valor: 'MEDIO', label: 'Médio' },
    { valor: 'GRANDE', label: 'Grande' },
  ];

  sexos = [
    { valor: 'MACHO', label: 'Macho' },
    { valor: 'FEMEA', label: 'Fêmea' },
    { valor: 'INDEFINIDO', label: 'Indefinido' },
  ];

  constructor(
    private fb: FormBuilder,
    private animaisService: AnimaisService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      raca: ['', Validators.required],
      idadeAproximada: ['', [Validators.required, Validators.min(0)]],
      especie: ['', Validators.required],
      porte: ['', Validators.required],
      sexo: ['', Validators.required],
      castrado: [false],
    });

    this.form.valueChanges.subscribe(() => {
      if (this.erro) this.erro = '';
    });
  }

  get f() {
    return this.form.controls;
  }

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      this.erro = 'Formato de imagem inválido. Use JPG, PNG ou WEBP.';
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

  cadastrar(): void {
    this.sucesso = '';
    this.erro = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.fotoSelecionada) {
      this.erro = 'Selecione uma foto do animal.';
      return;
    }

    this.carregando = true;

    const v = this.form.value;

    const payload = {
      nome: v.nome,
      raca: v.raca,
      idadeAproximada: Number(v.idadeAproximada),
      especie: v.especie,
      porte: v.porte,
      sexo: v.sexo,
      castrado: v.castrado,
    };

    this.animaisService.cadastrarAnimal(payload, this.fotoSelecionada).subscribe({
      next: () => {
        this.sucesso = 'Animal cadastrado com sucesso!';
        this.form.reset({ castrado: false });
        this.fotoSelecionada = null;
        this.fotoPreview = null;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const status = err?.status;
        if (status === 0 || status >= 500)
          this.erro = 'Não foi possível conectar ao servidor. Tente novamente.';
        else
          this.erro = err?.error?.mensagem || err?.error?.message || 'Erro ao cadastrar o animal. Tente novamente.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
