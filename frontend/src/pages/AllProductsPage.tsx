import { useEffect, useState } from "react";
import { Product } from "../components/my/Product";

export function AllProductsPage() {
    const [products, setProducts] = useState<any[] | null>(null);

    useEffect(() => {
        (async () => {
            fetch("/api/products/all")
                .then((response) => response.json())
                .then((products) => {
                    setProducts(products.data);
                });
        })();
    }, []);


    let productsList;
    let productsCounter;
    if (products !== null) {
        productsList = (
            products.map((product) => {
                return (
                    <Product key={product.id} product={product} />
                );
            })
        );
        productsCounter = <div>{productsList.length} items</div>;
    }

    return (
        <div>
            <h1 className="text-5xl font-bold">All content</h1>
            {productsCounter}
            <div className="flex flex-col">{productsList}</div>
        </div>
    );
}