import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
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

export const AddProductModal = () => {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    const mutation = useMutation({
        mutationFn: async (newProduct: FormValues) => {
            const { data } = await api.post("/products", newProduct);
            return data; // this is the created product from backend
        },
        onError: (error: any) => {
            setErrorMessage(error?.response?.data?.message || error.message || "Something went wrong");
        },
        onSuccess: (data) => {
            console.log("DATA", data);
            queryClient.setQueryData<ProductType[]>(['products'], (old = []) => [data, ...old]);
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
        setOpen(false);
        setErrorMessage(null);
    };

    const isSubmitting = mutation.isPending

    return (
        <>
            <Button
                type='button'
                onClick={() => setOpen(true)}
            >
                <Plus /> Add Product
            </Button>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="max-h-[90vh]">
                    <DialogHeader className="mb-4">
                        <DialogTitle>Add Product</DialogTitle>
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
                                    {isSubmitting ? "Giving birth to data…" : "Create Product"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}