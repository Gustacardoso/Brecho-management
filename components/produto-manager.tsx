"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Search, Edit, Trash2, QrCode } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Produto, StatusProduto } from "@/lib/types"

export function ProdutoManager() {
  const { clientes, produtos, adicionarProduto, atualizarProduto, removerProduto } = useStore()
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<StatusProduto | "todos">("todos")
  const [dialogAberto, setDialogAberto] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    tamanho: "",
    marca: "",
    precoSugerido: "",
    clienteId: "",
  })

  const produtosFiltrados = produtos.filter((produto) => {
    const cliente = clientes.find((c) => c.id === produto.clienteId)
    const matchBusca =
      produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      cliente?.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.id.includes(busca)

    const matchStatus = filtroStatus === "todos" || produto.status === filtroStatus

    return matchBusca && matchStatus
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const produtoData = {
      ...formData,
      precoSugerido: Number.parseFloat(formData.precoSugerido),
    }

    if (produtoEditando) {
      atualizarProduto(produtoEditando.id, produtoData)
    } else {
      adicionarProduto(produtoData)
    }

    setFormData({ nome: "", tamanho: "", marca: "", precoSugerido: "", clienteId: "" })
    setProdutoEditando(null)
    setDialogAberto(false)
  }

  const handleEdit = (produto: Produto) => {
    setProdutoEditando(produto)
    setFormData({
      nome: produto.nome,
      tamanho: produto.tamanho,
      marca: produto.marca,
      precoSugerido: produto.precoSugerido.toString(),
      clienteId: produto.clienteId,
    })
    setDialogAberto(true)
  }

  const handleDelete = (produtoId: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      removerProduto(produtoId)
    }
  }

  const handleStatusChange = (produtoId: string, novoStatus: StatusProduto) => {
    atualizarProduto(produtoId, { status: novoStatus })
  }

  const resetForm = () => {
    setFormData({ nome: "", tamanho: "", marca: "", precoSugerido: "", clienteId: "" })
    setProdutoEditando(null)
  }

  const getStatusBadgeVariant = (status: StatusProduto) => {
    switch (status) {
      case "Disponível":
        return "default"
      case "Vendido":
        return "secondary"
      case "Retirado":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
          <p className="text-muted-foreground">Cadastre e gerencie os produtos do brechó</p>
        </div>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{produtoEditando ? "Editar Produto" : "Novo Produto"}</DialogTitle>
              <DialogDescription>Preencha os dados do produto</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="clienteId">Cliente</Label>
                  <Select
                    value={formData.clienteId}
                    onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome/Descrição</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tamanho">Tamanho</Label>
                  <Input
                    id="tamanho"
                    value={formData.tamanho}
                    onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="precoSugerido">Preço Sugerido</Label>
                  <Input
                    id="precoSugerido"
                    type="number"
                    step="0.01"
                    value={formData.precoSugerido}
                    onChange={(e) => setFormData({ ...formData, precoSugerido: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{produtoEditando ? "Atualizar" : "Cadastrar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>{produtos.length} produto(s) cadastrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, código, cliente..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filtroStatus} onValueChange={(value: StatusProduto | "todos") => setFiltroStatus(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Disponível">Disponível</SelectItem>
                <SelectItem value="Vendido">Vendido</SelectItem>
                <SelectItem value="Retirado">Retirado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtosFiltrados.map((produto) => {
                const cliente = clientes.find((c) => c.id === produto.clienteId)
                return (
                  <TableRow key={produto.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        {produto.codigo}
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>{cliente?.nome}</TableCell>
                    <TableCell>{produto.tamanho}</TableCell>
                    <TableCell>{produto.marca}</TableCell>
                    <TableCell>R$ {produto.precoSugerido.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select
                        value={produto.status}
                        onValueChange={(value: StatusProduto) => handleStatusChange(produto.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <Badge variant={getStatusBadgeVariant(produto.status)}>{produto.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Disponível">Disponível</SelectItem>
                          <SelectItem value="Vendido">Vendido</SelectItem>
                          <SelectItem value="Retirado">Retirado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(produto)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(produto.id)}>
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
