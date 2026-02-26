import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { DoacaoCadastroRequest } from '../models/doacao-cadastro-request';
import { MensagemResponse } from '../models/mensagem-response';
import { Observable } from 'rxjs';
import { DoacaoResponse } from '../models/doacao-response';
import { DespesaCadastroRequest } from '../models/despesa-cadastro-request';
import { DespesaResponse } from '../models/despesa-response';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class FinanceiroService {

  private readonly API = `${environment.apiUrl}/financeiro`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  private get headers() {
    return { headers: { Authorization: this.authService.getToken() ?? '' } };
  }

  cadastrarDoacao(data: DoacaoCadastroRequest): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(
      `${this.API}/doacao/cadastro`, data, this.headers
    );
  }

  listarDoacoesPorDia(dia: string): Observable<DoacaoResponse[]> {
    return this.http.get<DoacaoResponse[]>(
      `${this.API}/doacao/${dia}`, this.headers
    );
  }

  deletarDoacao(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API}/doacao/${id}`, this.headers
    );
  }

  cadastrarDespesa(data: DespesaCadastroRequest): Observable<MensagemResponse> {
    return this.http.post<MensagemResponse>(
      `${this.API}/despesa/cadastro`,
      data, this.headers
    );
  }

  listarDespesasPorDia(dia: string): Observable<DespesaResponse[]> {
    return this.http.get<DespesaResponse[]>(
      `${this.API}/despesa/${dia}`, this.headers
    );
  }

  deletarDespesa(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API}/despesa/${id}`, this.headers
    );
  }
}

