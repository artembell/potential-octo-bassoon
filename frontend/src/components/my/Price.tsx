import {
    fromDecimalToAmount,
    getCharForCurrency
} from "@/lib/money";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "../ui/card";

export const Price = ({ price }: { price: any; }) => {
    let navigate = useNavigate();

    const currencyChar = getCharForCurrency(price.currency);
    const amount = fromDecimalToAmount(price.amount);

    return (
        <Card className="my-[10px] cursor-pointer"
            onClick={() => {
                return navigate(`/inspect/${price.id}`);
            }}
        >
            <CardHeader>
                <CardTitle>{price.title}</CardTitle>
                <CardDescription>{amount}{currencyChar} / {price.period}</CardDescription>
            </CardHeader>
        </Card>
    );
};