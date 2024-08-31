import { StripePaymentInfo } from "@/components/my/StripePaymentInfo";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51PnyLPRpn18ZzZBouuSOaJ5d8OF3ZAZGCftLcb6nxipU83qeZ5pF5wkZ59ydxXiC2Xk2wmeuprgENzhNa7Me93Js00I0Ohj3TQ");

export const PaymentInfoPage = () => {
    const [clientSecret, setClientSecret] = useState("");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const clientSecret = searchParams.get('payment_intent_client_secret');
        setClientSecret(clientSecret!);
    }, [searchParams]);

    const options = {
        clientSecret,
        theme: 'flat',
        variables: { colorPrimaryText: '#262626' }
    };

    return (
        <>
            {clientSecret && (
                <Elements options={options as any} stripe={stripePromise}>
                    <StripePaymentInfo />
                </Elements>
            )}
        </>
    );
};