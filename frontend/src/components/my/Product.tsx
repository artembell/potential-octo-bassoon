import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const Product = ({
    product,
    renderPrice,
}: {
    product: any;
    renderPrice?: (price: any) => React.ReactNode;
}) => {
    const prices: any[] = product.prices;

    return (
        <Card className="my-[10px]">
            <CardHeader>
                <CardTitle>{product.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row gap-3">
                {
                    prices?.map((price) => {
                        return renderPrice?.(price);
                    })
                }
                {product?.content?.data}
            </CardContent>
        </Card>
    );
};