import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod/v3";
import api from "../axios";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import type { ProductType } from "./ProductsList";

const productSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .trim(), // remove extra spaces

    price: z
        .number()
        .min(0.01, "Price must be greater than 0"),

    description: z
        .string()
        .min(1, "Description is required")
        .trim(),

    category: z
        .string()
        .min(1, "Category is required")
        .trim(),

    image: z
        .string()
        .min(1, "Image URL is required")
        .url("Invalid image URL")
});

interface FormValues {
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

type Props = {
    editProduct: {
        open: string;
        data: ProductType | null
    },
    setEditProduct: ({ open, data }: { open: string, data: null | ProductType }) => void
}

export const EditProductModal = ({ editProduct, setEditProduct }: Props) => {
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const product = editProduct.data;

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: '',
            price: 0,
            description: '',
            category: '',
            image: ''
        }
    })

    useEffect(() => {
        if (product) {
            form.setValue('title', product.title)
            form.setValue('price', Number(product.price))
            form.setValue('description', product.description)
            form.setValue('category', product.category)
            form.setValue('image', product.image)
        }
    }, [product, form])

    const mutation = useMutation({
        mutationFn: async (newProduct: FormValues) => {
            if (!product) return;
            const { data } = await api.put(`/products/${product.id}`, newProduct);
            return data; // this is the created product from backend
        },
        onError: (error: any) => {
            setErrorMessage(error?.response?.data?.message || error.message || "Something went wrong");
        },
        onSuccess: (data) => {
            console.log("DATA", data);
            queryClient.setQueryData<ProductType[]>(['products'], (old = []) => old?.map(item => {
                if (item.id === data.id) {
                    return data
                }
                return item;
            }));
            handleClose();
        },
    })

    const onSubmit = (values: FormValues) => {
        // Make sure price is a number
        setErrorMessage(null);
        mutation.mutate({ ...values, price: Number(values.price) });
    };


    const handleClose = () => {
        form.reset();
        setErrorMessage(null);
        setEditProduct({ open: '', data: null });
    };

    const isSubmitting = mutation.isPending;
    const isModalOpen = editProduct.open === 'edit'
    if (!isModalOpen) return;

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="mb-4">
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                name="title"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="title..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="price"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type='number'
                                                inputMode="numeric"
                                                onKeyDown={(e) => {
                                                    if (['e', 'E', "-"].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                placeholder="99"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="description..." {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='category'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="shoes..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="image"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image Url</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="http://www.example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                            <div className="w-full flex items-center justify-end mt-8">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                   {isSubmitting ? "Rewriting history…" : "Update Product"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}