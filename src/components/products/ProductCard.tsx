import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

export const ProductCard = ({ product }) => {
    return (
        <Card className="group overflow-hidden border-muted/60 pt-0">
            {/* Image */}
            <div className="relative aspect-square bg-muted h-60">
                <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <CardContent className="pt-4 space-y-2">
                <h3 className="text-sm font-medium leading-tight line-clamp-2">
                    {product.title}
                </h3>

                <p className="text-lg font-semibold">
                    ${product.price}
                </p>
            </CardContent>

            <CardFooter className="pt-0">
                <Button
                    variant="outline"
                    className="w-full transition-colors cursor-pointer"
                >
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
}
