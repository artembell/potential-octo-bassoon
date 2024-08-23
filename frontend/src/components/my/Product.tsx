import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Price } from "./Price";

export const Product = ({ product }: { product: any; }) => {
    const [prices, setPrices] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const prices = await fetch(`/api/prices/${product.id}`)
                .then((response) => response.json());
            setPrices(prices.data);
        })();
    }, []);

    return (
        <Card key={product.id} className="my-[10px]">
            <CardHeader>
                <CardTitle>{product.title}</CardTitle>
                {/* <CardDescription>Access to .</CardDescription> */}
            </CardHeader>
            <CardContent className="flex flex-row gap-3">
                {
                    prices.map((price) => {
                        return (
                            <Price key={price.id} price={price} />
                        );
                    })
                }
            </CardContent>
        </Card>
    );
};