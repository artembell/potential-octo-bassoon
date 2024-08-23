import { useEffect, useState } from "react";
import { Product } from "../components/my/Product";

export function AllProductsPage() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            fetch("/api/products/all")
                .then((response) => response.json())
                .then((products) => {
                    setProducts(products.data);
                });
        })();
    }, []);

    return (
        <div>
            <h1 className="text-5xl font-bold">All content</h1>
            <div className="flex flex-col">
                {
                    products.map((product) => {
                        return (
                            <Product key={product.id} product={product} />
                        );
                    })
                }
            </div>
        </div>
    );
}