import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fromDecimalToAmount, getCharForCurrency, getGMT3Date } from "@/lib/money";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const SubscriptionPaymentsPage = () => {
    let { subscriptionId } = useParams();
    const [invoices, setInvoices] = useState<any[]>([]);

    const [price, setPrice] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/invoices/${subscriptionId}`)
            .then((response) => response.json())
            .then(response => {
                setInvoices(response.data.invoices);

                setPrice(response.data.price);
            });
    }, []);

    let product;
    if (price !== null) {

        const currencyChar = getCharForCurrency(price.currency);
        const amount = fromDecimalToAmount(price.amount);

        product = (
            <Card key={price.product.id} className="my-[10px]">
                <CardHeader>
                    <CardTitle>{price.product.title}</CardTitle>
                    {/* <CardDescription>Access to .</CardDescription> */}
                </CardHeader>
                <CardContent className="flex flex-row gap-3">
                    {/* {
                        prices.map((price) => {
                            return (
                                <Price key={price.id} price={price} />
                            );
                        })
                    } */}
                    <Card className="my-[10px] cursor-pointer"
                        onClick={() => {
                            // return navigate(`/inspect/${price.id}`);
                        }}
                    >
                        <CardHeader>
                            <CardTitle>{price.title}</CardTitle>
                            <CardDescription>{amount}{currencyChar} / {price.period}</CardDescription>
                        </CardHeader>
                    </Card>
                </CardContent>
            </Card>
        );
    }


    return (
        <>
            <h1 className="text-5xl font-bold">Subscription payments</h1>
            {product}
            {
                invoices.map((inv, index) => {
                    const currencyChar = getCharForCurrency(price.currency);
                    const amount = fromDecimalToAmount(inv.amount);
                    const date = getGMT3Date(inv.createdDate);

                    return (
                        <Card key={inv.id} className="my-[10px]"
                            onClick={() => { }}
                        >
                            <CardHeader>
                                <CardTitle>Payment #{index + 1}</CardTitle>
                                {/* <CardDescription></CardDescription> */}
                                <CardContent>
                                    {/* <div>Charged: {`${inv.charge !== null}`}</div> */}
                                    <div>
                                        <a target="_blank" href={inv.invoicePdf}>Download PDF</a>
                                    </div>
                                    <div>Created: {date.toString()}</div>
                                    <div>Total: {currencyChar}{amount}</div>
                                    <div>Status: {inv.paidStatus}</div>
                                </CardContent>
                            </CardHeader>
                        </Card>
                    );
                })
            }
        </>
    );
};