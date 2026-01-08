import { useQuery } from "@tanstack/react-query";
import api from "../axios";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";
import { AddProductModal } from "./AddProductModal";
import { useMemo, useState } from "react";
import { EditProductModal } from "./EditProductModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export type ProductType = {
    id: number,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    rating: {
        rate: number;
        count: number;
    }
}


export default function ProductsList() {

    const [product, setProduct] = useState<{ open: string, data: null | ProductType }>({
        open: '',
        data: null
    })

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

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



    const categories: string[] = useMemo(() => {
        const unique = new Set<string>(products?.map((p: ProductType) => p.category));
        return ["all", ...Array.from(unique)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products?.filter((product: ProductType) => {
            const matchesCategory =
                category === "all" || product.category === category;

            const matchesSearch =
                product.title.toLowerCase().includes(search.toLowerCase()) ||
                product.category.toLowerCase().includes(search.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [products, search, category]);

    if (isError) {
        return (
            <div className="text-center text-red-500 mt-10">
                {error.message}
            </div>
        );
    }

    return (
        <section className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Products
                </h1>
                <AddProductModal />
            </div>
            <div className="flex flex-col gap-4 md:flex-row mb-4">
                <input
                    type="text"
                    placeholder="Search by title or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/2 rounded-md border px-4 py-2 focus:outline-none focus:ring"
                />

                <Select
                    value={category}
                    onValueChange={(e) => setCategory(e)}
                >
                    <SelectTrigger className=" ml-auto">
                        <SelectValue placeholder="Select a Category..." />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            categories.map(cat => (
                                <SelectItem key={cat} value={cat} className="capitalize">{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                {/* <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-28 ml-auto rounded-md border px-4 py-2 focus:outline-none focus:ring"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select> */}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))
                    : filteredProducts.map((product: ProductType) => (
                        <ProductCard key={product.id} product={product} setEditProduct={setProduct} />
                    ))}
            </div>
            <EditProductModal editProduct={product} setEditProduct={setProduct} />
            <DeleteProductModal product={product} setProduct={setProduct} />
        </section>
    );
}
