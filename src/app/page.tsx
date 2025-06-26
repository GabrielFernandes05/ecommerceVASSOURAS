import Item from "@/components/ui/Item";
import Header from "@/components/ui/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <Header user={null} />
      <Card className="mx-auto mt-20 p-15 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Produtos em Destaque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-7x1 mx-auto grid grid-cols-[repeat(auto-fit,minmax(225px,1fr))] gap-8">
            <Item />
            <Item />
            <Item />
            <Item />
          </div>
        </CardContent>
      </Card>
      <Card className="mx-auto p-15 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Produtos Recomendados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-7x1 mx-auto grid grid-cols-[repeat(auto-fit,minmax(225px,1fr))] gap-8">
            <Item />
            <Item />
            <Item />
            <Item />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
