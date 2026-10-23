"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Cliente, Produto, LogExclusao } from "./types"

interface Store {
  clientes: Cliente[]
  produtos: Produto[]
  logsExclusao: LogExclusao[]

  // Ações para clientes
  adicionarCliente: (dados: Omit<Cliente, "id" | "dataCadastro">) => void
  atualizarCliente: (id: string, dados: Partial<Omit<Cliente, "id" | "dataCadastro">>) => void
  removerCliente: (id: string) => void

  // Ações para produtos
  adicionarProduto: (dados: Omit<Produto, "id" | "codigo" | "status" | "dataCadastro">) => void
  atualizarProduto: (id: string, dados: Partial<Omit<Produto, "id" | "codigo" | "dataCadastro">>) => void
  removerProduto: (id: string) => void
}

const gerarId = () => crypto.randomUUID()

const gerarCodigoProduto = () => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `BR${timestamp}${random}`
}

// Dados iniciais para demonstração
const clientesIniciais: Cliente[] = [
  {
    id: "1",
    nome: "Maria Silva",
    telefone: "(11) 99999-1111",
    email: "maria@email.com",
    dataCadastro: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    nome: "Ana Santos",
    telefone: "(11) 99999-2222",
    email: "ana@email.com",
    dataCadastro: "2024-01-20T14:30:00Z",
  },
]

const produtosIniciais: Produto[] = [
  {
    id: "1",
    codigo: "BR240001ABC",
    nome: "Vestido Floral Vintage",
    tamanho: "M",
    marca: "Zara",
    precoSugerido: 45.0,
    clienteId: "1",
    status: "Disponível",
    dataCadastro: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    codigo: "BR240002DEF",
    nome: "Jaqueta Jeans",
    tamanho: "G",
    marca: "Levi's",
    precoSugerido: 80.0,
    clienteId: "1",
    status: "Vendido",
    dataCadastro: "2024-01-16T09:15:00Z",
  },
  {
    id: "3",
    codigo: "BR240003GHI",
    nome: "Blusa de Seda",
    tamanho: "P",
    marca: "H&M",
    precoSugerido: 35.0,
    clienteId: "2",
    status: "Disponível",
    dataCadastro: "2024-01-20T15:00:00Z",
  },
]

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      clientes: clientesIniciais,
      produtos: produtosIniciais,
      logsExclusao: [],

      adicionarCliente: (dados) => {
        const novoCliente: Cliente = {
          ...dados,
          id: gerarId(),
          dataCadastro: new Date().toISOString(),
        }
        set((state) => ({
          clientes: [...state.clientes, novoCliente],
        }))
      },

      atualizarCliente: (id, dados) => {
        set((state) => ({
          clientes: state.clientes.map((cliente) => (cliente.id === id ? { ...cliente, ...dados } : cliente)),
        }))
      },

      removerCliente: (id) => {
        const cliente = get().clientes.find((c) => c.id === id)
        if (cliente) {
          const log: LogExclusao = {
            id: gerarId(),
            tipo: "cliente",
            itemId: id,
            itemNome: cliente.nome,
            dataExclusao: new Date().toISOString(),
            usuario: "Sistema", // Em um sistema real, seria o usuário logado
          }

          set((state) => ({
            clientes: state.clientes.filter((c) => c.id !== id),
            logsExclusao: [...state.logsExclusao, log],
          }))
        }
      },

      adicionarProduto: (dados) => {
        const novoProduto: Produto = {
          ...dados,
          id: gerarId(),
          codigo: gerarCodigoProduto(),
          status: "Disponível",
          dataCadastro: new Date().toISOString(),
        }
        set((state) => ({
          produtos: [...state.produtos, novoProduto],
        }))
      },

      atualizarProduto: (id, dados) => {
        set((state) => ({
          produtos: state.produtos.map((produto) => (produto.id === id ? { ...produto, ...dados } : produto)),
        }))
      },

      removerProduto: (id) => {
        const produto = get().produtos.find((p) => p.id === id)
        if (produto) {
          const log: LogExclusao = {
            id: gerarId(),
            tipo: "produto",
            itemId: id,
            itemNome: produto.nome,
            dataExclusao: new Date().toISOString(),
            usuario: "Sistema", // Em um sistema real, seria o usuário logado
          }

          set((state) => ({
            produtos: state.produtos.filter((p) => p.id !== id),
            logsExclusao: [...state.logsExclusao, log],
          }))
        }
      },
    }),
    {
      name: "brecho-storage",
    },
  ),
)
