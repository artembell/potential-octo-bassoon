import { useEffect, useState } from "react";
import { Product } from "../components/my/Product";
import { Price } from "@/components/my/Price";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function MyProductsPage() {
    const [content, setProducts] = useState<any[] | null>(null);

    useEffect(() => {
        (async () => {
            fetch("/api/products/my")
                .then((response) => response.json())
                .then(({ data }) => {
                    console.log(data);
                    setProducts(data);
                });
        })();
    }, []);

    let productsList;
    let productsCounter;
    if (content !== null) {
        productsList = (
            content.map((cnt) => {
                return (
                    <Card key={cnt.id} className="my-[10px]">
                        <CardHeader>
                            <CardTitle>{cnt.data}</CardTitle>
                            {/* <CardDescription>Access to .</CardDescription> */}
                        </CardHeader>
                        {/* <CardContent className="flex flex-row gap-3">
                            <div>{cnt.data}</div>
                        </CardContent> */}
                    </Card>
                );
            })
        );
        productsCounter = <div>{productsList.length} items</div>;
    }

    return (
        <div>
            <h1 className="text-5xl font-bold">My</h1>
            {productsCounter}
            <div className="flex flex-col">
                {productsList}
            </div>
        </div>
    );
}