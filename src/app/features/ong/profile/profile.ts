import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { OngService } from '../../../core/services/ong-service';
import { OngResponse } from '../../../core/models/ong-response';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  ong!: OngResponse;
  form!: FormGroup;

  carregando = true;
  modoEdicao = false;
  salvando = false;
  desativando = false;
  confirmarDesativacao = false;

  erro = '';
  sucesso = '';

  constructor(
    private fb: FormBuilder,
    private ongService: OngService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.ongService.buscarOngPorToken().subscribe({
      next: (ong) => {
        this.ong = ong;
        this.buildForm(ong);
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Não foi possível carregar os dados da sua ONG.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private buildForm(ong: OngResponse): void {
    this.form = this.fb.group({
      nome: [ong.nome, Validators.required],
      cnpj: [ong.cnpj ?? ''],
      email: [{ value: ong.email, disabled: true }],
      telefones: this.fb.array(
        (ong.telefone ?? ['']).map(t => this.fb.control(t, Validators.required))
      ),
      cep: [ong.cep, Validators.required],
      cidade: [ong.cidade, Validators.required],
      estado: [ong.estado, Validators.required],
      rua: [ong.rua, Validators.required],
      bairro: [ong.bairro, Validators.required],
      numero: [ong.numero, Validators.required],
      complemento: [ong.complemento ?? ''],
    });

    this.form.disable();
  }

  get telefones(): FormArray {
    return this.form.get('telefones') as FormArray;
  }

  adicionarTelefone(): void {
    this.telefones.push(this.fb.control('', Validators.required));
  }

  removerTelefone(i: number): void {
    if (this.telefones.length > 1) this.telefones.removeAt(i);
  }

  editar(): void {
    this.modoEdicao = true;
    this.erro = '';
    this.sucesso = '';
    this.form.enable();
    this.form.get('email')?.disable();
  }

  cancelar(): void {
    this.modoEdicao = false;
    this.erro = '';
    this.buildForm(this.ong);
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
      nome: v.nome,
      cnpj: v.cnpj ? v.cnpj.replace(/\D/g, '') : null,
      telefone: v.telefones.map((t: string) => t.replace(/\D/g, '')),
      cep: v.cep.replace(/\D/g, ''),
      cidade: v.cidade,
      estado: v.estado,
      rua: v.rua,
      bairro: v.bairro,
      numero: Number(v.numero),
      complemento: v.complemento ?? '',
    };

    this.ongService.atualizarDados(payload)
      .pipe(finalize(() => {
        this.salvando = false;
        this.cdr.detectChanges(); 
      }))
      .subscribe({
        next: (ong) => {
          this.ong = ong;
          this.modoEdicao = false;
          this.sucesso = 'Dados atualizados com sucesso!';
          this.buildForm(ong);
          this.cdr.detectChanges(); // 👈
        },
        error: (err) => {
          const status = err?.status;
          if (status === 409)
            this.erro = 'Este CNPJ já está em uso por outra ONG.';
          else if (status === 0 || status >= 500)
            this.erro = 'Não foi possível conectar ao servidor. Tente novamente.';
          else
            this.erro = err?.error?.mensagem || err?.error?.message || 'Erro ao salvar os dados.';
          this.cdr.detectChanges(); // 👈
        }
      });
  }

  buscarCep(valor: string): void {
    const cep = valor?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) return;

    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (res) => {
        if (res.erro) { this.erro = 'CEP não encontrado.'; return; }
        this.form.patchValue({
          cidade: res.localidade,
          estado: res.uf,
          rua: res.logradouro,
          bairro: res.bairro,
        });
      },
      error: () => this.erro = 'Erro ao buscar o CEP.'
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

    this.ongService.desativar()
      .pipe(finalize(() => {
        this.desativando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          localStorage.clear();
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.erro = err?.error?.mensagem || 'Erro ao desativar a conta. Tente novamente.';
          this.confirmarDesativacao = false;
          this.cdr.detectChanges();
        }
      });
  }
}
