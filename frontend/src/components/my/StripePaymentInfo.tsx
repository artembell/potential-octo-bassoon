import { useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

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


    console.log(pi);
    return (
        <>
            <h1>Payment Info:</h1>
            {/* <pre>

                {
                    pi ? JSON.stringify(pi, null, 4) : null
                }
            </pre> */}
        </>
    );
};