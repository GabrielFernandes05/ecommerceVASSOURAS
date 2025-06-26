import Item from "@/components/ui/Item";
import Header from "@/components/ui/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  return (
    // <div className="w-full h-screen flex justify-center items-center bg-red-900">
    //   <div className="fixed top-0 left-0 w-full h-16 bg-white flex items-center justify-between px-8">
    //     <NavigationMenu>
    //       <NavigationMenuList className="flex w-full">
    //         <NavigationMenuItem>
    //           <NavigationMenuLink href="/" className="text-black">
    //             Menu
    //           </NavigationMenuLink>
    //         </NavigationMenuItem>
    //         <NavigationMenuItem>
    //           <NavigationMenuLink href="/products" className="text-black">
    //             Produtos
    //           </NavigationMenuLink>
    //         </NavigationMenuItem>
    //         <NavigationMenuItem>
    //           <NavigationMenuLink href="/about" className="text-black">
    //             Meu Carrinho
    //           </NavigationMenuLink>
    //         </NavigationMenuItem>
    //         <NavigationMenuItem className="ml-auto">
    //           <NavigationMenuLink href="/contact" className="text-black">
    //             Login
    //           </NavigationMenuLink>
    //         </NavigationMenuItem>
    //       </NavigationMenuList>
    //     </NavigationMenu>
    //   </div>
    // </div>
    <>
      <Header user={null} />
      <Card className="mt-20 p-4">
        <CardHeader>
          <CardTitle>Produto em destaque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-7x1 mx-auto grid grid-cols-[repeat(auto-fit,minmax(225px,1fr))] gap-8 p-10">
            <Item />
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
