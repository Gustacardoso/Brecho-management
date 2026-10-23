export interface Cliente {
  id: string
  nome: string
  telefone: string
  email: string
  dataCadastro: string
}

export type StatusProduto = "Disponível" | "Vendido" | "Retirado"

export interface Produto {
  id: string
  codigo: string
  nome: string
  tamanho: string
  marca: string
  precoSugerido: number
  clienteId: string
  status: StatusProduto
  dataCadastro: string
}

export interface LogExclusao {
  id: string
  tipo: "cliente" | "produto"
  itemId: string
  itemNome: string
  dataExclusao: string
  usuario: string
}
