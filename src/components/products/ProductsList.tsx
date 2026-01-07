import { useQuery } from "@tanstack/react-query";
import api from "../axios";
import { ProductSkeleton } from "./ProductSkeleton";
import { ProductCard } from "./ProductCard";


export default function ProductsList() {
    const fetchProducts = async () => {
        const { data } = await api.get("/products");
        return data;
    };

    const {
        data: products,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    if (isError) {
        return (
            <div className="text-center text-red-500 mt-10">
                {error.message}
            </div>
        );
    }

    return (
        <section className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-semibold tracking-tight mb-8">
                Products
            </h1>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))
                    : products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
            </div>
        </section>
    );
}
