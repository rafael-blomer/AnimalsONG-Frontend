import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { AnimalAtualizacaoRequest } from '../models/animal-atualizacao-request';
import { AnimalCadastroRequest } from '../models/animal-cadastro-request';
import { AnimalResponse } from '../models/animal-response';
import { PageResponse } from '../models/page-response';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class AnimaisService {
  private readonly API = `${environment.apiUrl}/animais`;


  constructor(private http: HttpClient, private authService: AuthService) { }

  private get headers() {
    return { headers: { Authorization: this.authService.getToken() ?? '' } };
  }

  cadastrarAnimal(
    animal: AnimalCadastroRequest,
    foto: File
  ): Observable<AnimalResponse> {

    const formData = new FormData();
    formData.append(
      'animal',
      new Blob([JSON.stringify(animal)], { type: 'application/json' })
    );
    formData.append('foto', foto);

    return this.http.post<AnimalResponse>(
      `${this.API}/cadastro`,
      formData, this.headers
    );
  }

  listarAnimais(
    page = 0,
    size = 10,
    sort = 'dataEntrada,desc'
  ): Observable<PageResponse<AnimalResponse>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http.get<PageResponse<AnimalResponse>>(
      `${this.API}/listar`,
      {
        headers: { Authorization: this.authService.getToken() ?? '' },
        params
      }
    );
  }

  desativarAnimal(id: string): Observable<void> {
    return this.http.patch<void>(
      `${this.API}/desativar/${id}`,
      {}, this.headers
    );
  }

  buscarAnimal(id: string): Observable<AnimalResponse> {
    return this.http.get<AnimalResponse>(`${this.API}/buscar/${id}`, this.headers);
  }

  atualizarAnimal(
    id: string,
    animal: AnimalAtualizacaoRequest,
    foto?: File
  ): Observable<AnimalResponse> {

    const formData = new FormData();
    formData.append(
      'animal',
      new Blob([JSON.stringify(animal)], { type: 'application/json' })
    );

    if (foto) {
      formData.append('foto', foto);
    }

    return this.http.patch<AnimalResponse>(
      `${this.API}/atualizar/${id}`,
      formData, this.headers
    );
  }
}
