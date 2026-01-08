import { Edit, Star, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import type { ProductType } from "./ProductsList";
import { cn } from "../../lib/utils";

export const ProductCard = ({ product, setEditProduct }: { product: ProductType; setEditProduct: ({ open, data }: { open: string, data: null | ProductType }) => void }) => {
    return (
        <Card className="relative group overflow-hidden border-muted/60 pt-0 pb-2 gap-0">
            {/* Image */}
            <div className="absolute hidden group-hover:flex z-10 right-3 top-3 cursor-pointer transition items-center">
                <Button type='button' className="bg-transparent hover:bg-black/15 text-black p-0"
                    onClick={() => setEditProduct({ open: 'edit', data: product })}
                >
                    <Edit className=" min-h-5 min-w-5" />
                </Button>
                <Button type='button'
                    onClick={() => setEditProduct({ open: 'delete', data: product })}
                    className="bg-transparent hover:bg-black/15 text-black opacity-70 hover:opacity-100 p-0"
                >
                    <Trash className="min-h-5 min-w-5 text-red-500" />
                </Button>
            </div>
            <span className="absolute left-3 top-3 z-10 py-1.5 px-3 text-xs bg-teal-300/10 font-medium rounded-full border border-teal-400/20 capitalize">{product.category}</span>
            <div className="relative aspect-square bg-muted h-60 m-1.5 rounded-xl">
                <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
                {product && product.rating && product.rating.rate && <span className={cn("absolute left-3 bottom-3 z-10 py-1.5 px-3 text-xs bg-yellow-400/30 font-medium rounded-full border border-teal-400/20 capitalize flex items-center",
                    product.rating.rate >= 3 && product.rating.rate < 4 && 'bg-amber-500/30',
                    product.rating.rate < 3 && 'bg-red-400/30'
                )}>
                    {product.rating.rate} <Star fill="#" className="max-h-4 max-w-4 ml-1 fill-amber-400 text-yellow-300" />
                </span>}
            </div>

            <CardContent className="space-y-2 p-2 pt-4">

                <h3 className="text-sm font-medium leading-tight line-clamp-2">
                    {product.title}
                </h3>


            </CardContent>

            <CardFooter className="px-2 flex items-center justify-between">
                <p className="text-lg font-semibold">
                    ${product.price}
                </p>
                {/* <Button
                    variant="outline"
                    className=" bg-black text-white rounded-full ml-auto transition-colors cursor-pointer"
                >
                    View
                </Button> */}
            </CardFooter>
        </Card>
    );
}
