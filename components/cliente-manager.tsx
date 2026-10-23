"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Cliente } from "@/lib/types"

export function ClienteManager() {
  const { clientes, produtos, adicionarCliente, atualizarCliente, removerCliente } = useStore()
  const [busca, setBusca] = useState("")
  const [dialogAberto, setDialogAberto] = useState(false)
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
  })

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.telefone.includes(busca) ||
      cliente.email.toLowerCase().includes(busca.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (clienteEditando) {
      atualizarCliente(clienteEditando.id, formData)
    } else {
      adicionarCliente(formData)
    }

    setFormData({ nome: "", telefone: "", email: "" })
    setClienteEditando(null)
    setDialogAberto(false)
  }

  const handleEdit = (cliente: Cliente) => {
    setClienteEditando(cliente)
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email,
    })
    setDialogAberto(true)
  }

  const handleDelete = (clienteId: string) => {
    const produtosDoCliente = produtos.filter((p) => p.clienteId === clienteId)
    if (produtosDoCliente.length > 0) {
      alert("Não é possível excluir cliente com produtos cadastrados!")
      return
    }

    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      removerCliente(clienteId)
    }
  }

  const resetForm = () => {
    setFormData({ nome: "", telefone: "", email: "" })
    setClienteEditando(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Clientes</h2>
          <p className="text-muted-foreground">Cadastre e gerencie os clientes do brechó</p>
        </div>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{clienteEditando ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
              <DialogDescription>Preencha os dados do cliente</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{clienteEditando ? "Atualizar" : "Cadastrar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>{clientes.length} cliente(s) cadastrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou email..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.map((cliente) => {
                const produtosCount = produtos.filter((p) => p.clienteId === cliente.id).length
                return (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-mono text-sm">{cliente.id.slice(0, 8)}...</TableCell>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{produtosCount} produto(s)</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(cliente)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(cliente.id)}
                          disabled={produtosCount > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
