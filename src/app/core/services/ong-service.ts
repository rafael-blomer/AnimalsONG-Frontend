import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OngCadastro } from '../models/ong-cadastro';
import { Observable } from 'rxjs';
import { MensagemResponse } from '../models/mensagem-response';
import { LoginResquest } from '../models/login-resquest';
import { OngResponse } from '../models/ong-response';
import { OngAlterarSenhaRequest } from '../models/ong-alterar-senha-request';
import { OngAtualizacaoDadosRequest } from '../models/ong-atualizacao-dados-request';
import { environment } from '../../environments/environment.prod';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class OngService {

  private readonly API = `${environment.apiUrl}/ongs`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private get headers() {
    return { headers: { Authorization: this.authService.getToken() ?? '' } };
  }

  cadastro(data: OngCadastro): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(
      `${this.API}/cadastro`, data,
      {
        responseType: 'text' as 'json'
      }
    );
  }

  confirmarEmail(token: string): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(
      `${this.API}/confirmacao-email/${token}`,
      {}
    );
  }

  login(data: LoginResquest): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(
      `${this.API}/login`,
      data
    );
  }

  buscarOngPorToken(): Observable<OngResponse> {
    return this.http.get<OngResponse>(
      `${this.API}/buscar-por-token`, this.headers
    )
  }

  desativar(): Observable<void> {
    return this.http.patch<void>(
      `${this.API}/desativar`, {}, this.headers
    );
  }

  solicitarAlteracaoSenha(email: string): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(
      `${this.API}/solicitar-alteracao-senha/${email}`,
      {}
    );
  }

  alterarSenha(data: OngAlterarSenhaRequest): Observable<MensagemResponse> {
    return this.http.patch<MensagemResponse>(
      `${this.API}/alterar-senha`,
      data
    );
  }

  atualizarDados(data: OngAtualizacaoDadosRequest): Observable<OngResponse> {
    return this.http.patch<OngResponse>(
      `${this.API}/atualizar`, data, this.headers
    );
  }
}
