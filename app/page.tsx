"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClienteManager } from "@/components/cliente-manager"
import { ProdutoManager } from "@/components/produto-manager"
import { Dashboard } from "@/components/dashboard"
import { Package, Users, BarChart3 } from "lucide-react"

export default function BrechoSystem() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Gerenciamento - Brechó</h1>
          <p className="text-gray-600">Gerencie clientes e produtos de forma eficiente</p>
        </header>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="produtos" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="clientes">
            <ClienteManager />
          </TabsContent>

          <TabsContent value="produtos">
            <ProdutoManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
