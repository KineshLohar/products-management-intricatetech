import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import type { ProductType } from "./ProductsList";
import api from "../axios";
import { useState } from "react";

type Props = {
    product: {
        open: string;
        data: ProductType | null
    },
    setProduct: ({ open, data }: { open: string, data: null | ProductType }) => void
}

export const DeleteProductModal = ({ product, setProduct }: Props) => {
    const queryClient = useQueryClient();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const mutation = useMutation<ProductType, unknown, number>({
        mutationFn: async (id: number) => {
            const { data } = await api.delete(`/products/${id}`);
            return data;
        },
        onError: (error: any) => {
            setErrorMessage(error?.response?.data?.message || error.message || "Something went wrong");
        },
        onSuccess: (data) => {
            console.log("DELETE ", data);
            queryClient.setQueryData<ProductType[]>(['products'], (old = []) => old.filter(item => item.id !== data.id));
            handleClose();
        }
    })

    const handleClose = () => {
        setProduct({ open: "", data: null })
    }

    const isModalOpen = product.open === 'delete';

    if (!isModalOpen || !product.data) return null;

    const loading = mutation.isPending;

    const { data } = product;
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <span className="font-semibold">{data?.title}</span>?
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    </DialogDescription>
                    <DialogFooter className="mt-4">
                        <Button type="button" variant='ghost' onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="button" disabled={loading} variant='destructive' onClick={() => mutation.mutate(data.id)}>
                            {loading ? "Poof! Almost gone…" : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}