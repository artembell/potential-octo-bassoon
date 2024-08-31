import { Button } from "@/components/ui/button";
import { fromDecimalToAmount, getCharForCurrency } from "@/lib/money";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const InspectProductPage = () => {
    let { priceId } = useParams();
    const navigate = useNavigate();

    const [price, setPrice] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/price/${priceId}`, {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((data) => {
                setPrice(data.data);
            });
    }, []);

    function handleSubscribe() {
        navigate(`/checkout/${price.id}`);
    }

    let priceData = null;
    if (price !== null) {
        const currencyChar = getCharForCurrency(price.currency);
        const amount = fromDecimalToAmount(price.amount);

        priceData = (
            <>
                <div className="text-xl">
                    <h2 className="text-2xl font-bold">Content</h2>
                    <div>{price.product.title} / {price.title}</div>
                    <h2 className="text-2xl font-bold">Price</h2>
                    <div>{currencyChar}{amount} / {price.period}</div>
                </div>
                <div className="flex flex-col text-lg">
                    <Button
                        className="text-lg"
                        onClick={handleSubscribe}
                    >Subscribe for {currencyChar}{amount} / {price.period}</Button>
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-col gap-[20px]">
            <div>
                <h1 className="text-5xl font-bold">Inspect product</h1>
            </div>
            {priceData}
        </div>
    );
};