"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Users, DollarSign, TrendingUp } from "lucide-react"
import { useStore } from "@/lib/store"

export function Dashboard() {
  const { clientes, produtos } = useStore()

  const produtosDisponiveis = produtos.filter((p) => p.status === "Disponível").length
  const produtosVendidos = produtos.filter((p) => p.status === "Vendido").length
  const valorTotalEstoque = produtos
    .filter((p) => p.status === "Disponível")
    .reduce((total, p) => total + p.precoSugerido, 0)

  const estatisticas = [
    {
      title: "Total de Clientes",
      value: clientes.length,
      icon: Users,
      description: "Clientes cadastrados",
    },
    {
      title: "Produtos Disponíveis",
      value: produtosDisponiveis,
      icon: Package,
      description: "Produtos em estoque",
    },
    {
      title: "Produtos Vendidos",
      value: produtosVendidos,
      icon: TrendingUp,
      description: "Vendas realizadas",
    },
    {
      title: "Valor do Estoque",
      value: `R$ ${valorTotalEstoque.toFixed(2)}`,
      icon: DollarSign,
      description: "Valor total disponível",
    },
  ]

  const produtosRecentes = produtos
    .sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {estatisticas.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produtos Recentes</CardTitle>
            <CardDescription>Últimos produtos cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {produtosRecentes.map((produto) => {
                const cliente = clientes.find((c) => c.id === produto.clienteId)
                return (
                  <div key={produto.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{produto.nome}</p>
                      <p className="text-sm text-muted-foreground">Cliente: {cliente?.nome}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          produto.status === "Disponível"
                            ? "default"
                            : produto.status === "Vendido"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {produto.status}
                      </Badge>
                      <p className="text-sm font-medium">R$ {produto.precoSugerido.toFixed(2)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Produtos</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Disponível</span>
                </div>
                <span className="font-medium">{produtosDisponiveis}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Vendido</span>
                </div>
                <span className="font-medium">{produtosVendidos}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Retirado</span>
                </div>
                <span className="font-medium">{produtos.filter((p) => p.status === "Retirado").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
