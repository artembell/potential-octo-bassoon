import { useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const StripePaymentInfo = () => {
    const stripe = useStripe();
    const [pi, setPi] = useState<any>(null);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            setPi(paymentIntent!);
        });
    }, [stripe]);


    return (
        <>
            <h1>Payment Info:</h1>
            <Navigate to="/" replace={true} />
            {/* <pre>

                {
                    pi ? JSON.stringify(pi, null, 4) : null
                }
            </pre> */}
        </>
    );
};