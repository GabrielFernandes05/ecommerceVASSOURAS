"use client";
import { SidebarProvider, SidebarHeader, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Header from "@/components/ui/header"
export default function Home() {

  const formCadastrarProduto = () => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-gray-200 text-black hover:bg-white hover:shadow-black hover:shadow-md">
            Cadastrar Produto <PlusCircle className="ml-2" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Cadastrar Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Preencha os detalhes do produto para cadastrá-lo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              Salvar
            </AlertDialogAction>
            <AlertDialogCancel>
              Cancelar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <>
      <div className="p-4 bg-gray-50 min-h-screen w-full flex flex-col">
        <div className="flex justify-between mb-4 p-4">
          <h1 className="text-4xl font-bold text-black">Produtos</h1>
          {formCadastrarProduto()}
        </div>
        <div className="flex gap-4 p-4 bg-gray-100 border rounded-md">
          <div className="bg-gray-200 h-full rounded-md p-4">
            <SidebarProvider className="flex flex-col">
              <SidebarHeader>
                <h2 className="text-lg font-bold">Categorias</h2>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <span>Todos os Produtos</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <span>Eletrônicos</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <span>Roupas</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <span>Calçados</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </SidebarProvider>
          </div>
          <div className="bg-gray-200 w-full h-full rounded-md p-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Produtos em Destaque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(225px,1fr))] gap-8">
                  <p>Produto 1</p>
                  <p>Produto 2</p>
                  <p>Produto 3</p>
                  <p>Produto 4</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )

}