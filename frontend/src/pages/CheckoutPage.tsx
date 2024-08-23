import CheckoutForm from "@/components/my/StripeCheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51PnyLPRpn18ZzZBouuSOaJ5d8OF3ZAZGCftLcb6nxipU83qeZ5pF5wkZ59ydxXiC2Xk2wmeuprgENzhNa7Me93Js00I0Ohj3TQ");

export function CheckoutPage() {
    let { priceId } = useParams();
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/create-subscription', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                priceId: parseFloat(priceId!)
            })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setClientSecret(data.clientSecret);
            });
    }, [clientSecret]);

    const options = {
        clientSecret,
        theme: 'flat',
        variables: { colorPrimaryText: '#262626' }
    };

    console.log({ clientSecret });

    return (
        <div>
            <h1 className="text-5xl font-bold">Checkout</h1>
            <div className="items-start justify-center py-[20px]">
                <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
                    {/* <div className="w-[500px] rounded-xl border bg-card text-card-foreground shadow"> */}
                    {/* <DemoContainer> */}
                    {clientSecret && (
                        <Elements options={options as any} stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    )}
                    {/* </DemoContainer> */}
                </div>
            </div>
        </div>
    );
};