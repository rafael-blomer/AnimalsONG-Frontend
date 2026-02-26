export interface OngCadastro {
  nome: string;
  cnpj: string | null;
  telefone: string[];
  email: string;
  senha: string;
  cep: string;
  cidade: string;
  estado: string;
  rua: string;
  bairro: string
  complemento: string | null;
  numero: number;
}
