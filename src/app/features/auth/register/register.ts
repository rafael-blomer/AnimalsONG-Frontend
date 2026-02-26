import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormArray,
  NonNullableFormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

import { OngService } from '../../../core/services/ong-service';
import { OngCadastro } from '../../../core/models/ong-cadastro';

interface RegisterForm {
  nome: FormControl<string>;
  cnpj: FormControl<string>;
  email: FormControl<string>;
  senha: FormControl<string>;
  confirmarSenha: FormControl<string>;
  telefones: FormArray<FormControl<string>>;
  cep: FormControl<string>;
  cidade: FormControl<string>;
  estado: FormControl<string>;
  rua: FormControl<string>;
  bairro: FormControl<string>;
  numero: FormControl<string>;
  complemento: FormControl<string>;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: false
})
export class Register implements OnInit {

  form!: FormGroup<RegisterForm>;

  loading = false;
  loadingCep = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: NonNullableFormBuilder,
    private http: HttpClient,
    private ongService: OngService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group<RegisterForm>({
      nome: this.fb.control('', Validators.required),
      cnpj: this.fb.control(''),
      email: this.fb.control('', [Validators.required, Validators.email]),
      senha: this.fb.control('', Validators.required),
      confirmarSenha: this.fb.control('', Validators.required),

      telefones: this.fb.array([
        this.fb.control('', Validators.required)
      ]),

      cep: this.fb.control('', Validators.required),

      cidade: this.fb.control('', Validators.required),
      estado: this.fb.control('', Validators.required),
      rua: this.fb.control('', Validators.required),
      bairro: this.fb.control('', Validators.required),

      numero: this.fb.control('', Validators.required),
      complemento: this.fb.control('')
    }, {
      validators: this.senhasIguaisValidator
    });
  }

  get telefones(): FormArray<FormControl<string>> {
    return this.form.controls.telefones;
  }

  adicionarTelefone(): void {
    this.telefones.push(this.fb.control('', Validators.required));
  }

  removerTelefone(index: number): void {
    if (this.telefones.length > 1) {
      this.telefones.removeAt(index);
    }
  }

  senhasIguaisValidator(group: AbstractControl): ValidationErrors | null {
    const senha = group.get('senha')?.value;
    const confirmar = group.get('confirmarSenha')?.value;
    return senha === confirmar ? null : { senhasDiferentes: true };
  }

  buscarCep(valor: string): void {
    const cep = valor?.replace(/\D/g, '');

    if (!cep || cep.length !== 8) {
      return;
    }

    this.loadingCep = true;
    this.errorMessage = '';

    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`)
      .pipe(finalize(() => this.loadingCep = false))
      .subscribe({
        next: res => {
          if (res.erro) {
            this.errorMessage = 'CEP não encontrado.';
            return;
          }

          this.form.patchValue({
            cidade: res.localidade,
            estado: res.uf,
            rua: res.logradouro,
            bairro: res.bairro
          });
        },
        error: () => {
          this.errorMessage = 'Erro ao buscar o CEP.';
        }
      });
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const raw = this.form.getRawValue();
    const cnpjLimpo = this.limparMascara(raw.cnpj);

    const payload: OngCadastro = {
      nome: raw.nome,
      email: raw.email,
      senha: raw.senha,
      cnpj: cnpjLimpo.length > 0 ? cnpjLimpo : null,
      telefone: raw.telefones.map(t => this.limparMascara(t)),
      cep: this.limparMascara(raw.cep),
      cidade: raw.cidade,
      estado: raw.estado,
      rua: raw.rua,
      bairro: raw.bairro,
      numero: Number(raw.numero),
      complemento: raw.complemento
    };

    this.ongService.cadastro(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.successMessage =
            'Cadastro realizado com sucesso! Verifique seu e-mail.';
          this.form.reset();
        },
        error: err => {
          this.tratarErro(err);
        }
      });
  }

  private tratarErro(err: any): void {
    const status = err?.status;

    if (status === 409) {
      this.errorMessage = err?.error?.mensagem || err?.error?.message
        || 'Já existe uma conta com este e-mail ou CNPJ.';
    } else if (status === 422) {
      this.errorMessage = 'Verifique os dados informados e tente novamente.';
    } else if (status === 0 || status >= 500) {
      this.errorMessage = 'Não foi possível conectar ao servidor. Tente novamente em instantes.';
    } else {
      this.errorMessage = err?.error?.mensagem || err?.error?.message
        || 'Ocorreu um erro inesperado. Tente novamente.';
    }

    this.cdr.detectChanges();
  }


  limparMascara(valor: string): string {
    return valor?.replace(/\D/g, '') ?? '';
  }
}
