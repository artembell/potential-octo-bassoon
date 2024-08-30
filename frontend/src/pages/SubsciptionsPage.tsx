import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Price } from "../components/my/Price";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export const SubscriptionsPage = () => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/subscriptions')
            .then((response) => response.json())
            .then(response => {

                console.log(response);
                setSubscriptions(response.other);
            });
    }, []);

    function handleCancelSubscription(subscriptionId: string) {
        fetch(`/api/subscription/cancel/${subscriptionId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then((response) => response.json())
            .then((response) => {
                setSubscriptions(response.data);
            });
    }

    function handlePause(subscriptionId: string) {
        fetch(`/api/subscription/pause/${subscriptionId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then((response) => response.json())
            .then((response) => {
                setSubscriptions(response.data);
            });
    }

    function handleUnpause(subscriptionId: string) {
        fetch(`/api/subscription/unpause/${subscriptionId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then((response) => response.json())
            .then((response) => {
                setSubscriptions(response.data);
            });
    }

    return (
        <div>
            <h1 className="text-5xl font-bold">Subscriptions</h1>
            {
                subscriptions.map((sub) => {
                    const part = sub.subscriptionParts[0];
                    console.log(part);
                    let statusText = 'NOT ACTIVE';
                    let color = 'white';
                    if (sub.status === 'active') {
                        statusText = 'ACTIVE';
                        color = '#33cc33';
                    } else if (sub.status === 'cancelled') {
                        statusText = 'CANCELLED';
                        color = 'red';
                    } else if (sub.status === 'suspended') {
                        statusText = 'PAUSED';
                        color = 'orange';
                    }

                    const showPauseButton = sub.status !== 'cancelled' && sub.status === 'active';
                    const showUnpauseButton = sub.status !== 'cancelled' && sub.status === 'suspended';
                    const showCancelButton = sub.status !== 'cancelled';

                    const date = new Date(part.startDate).toUTCString();
                    const endDate = part.endDate === null ? '-' : new Date(part.endDate).toUTCString();

                    return (
                        <Card key={sub.id} className="my-[10px]"
                            onClick={() => { }}
                        >
                            <CardHeader>
                                <CardTitle className="flex flex-row gap-3">
                                    
                                    <div>
                                        {sub.price.product.title} subscription
                                    </div>
                                    <Badge style={{
                                        backgroundColor: color
                                    }} variant="outline">{statusText}</Badge>
                                </CardTitle>
                                {/* <CardDescription></CardDescription> */}
                                <CardContent>
                                    <div>
                                        <Link to={`/subscription/${sub.id}`}>{'Payments ---->'}</Link>
                                    </div>
                                    <div>
                                        <div>Start: {date}</div>
                                        <div>End: {endDate}</div>
                                    </div>
                                    <div>
                                        <Price key={sub.price.id} price={sub.price} />
                                    </div>


                                    {/* <div>Charged: {`${sub.charge !== null}`}</div>
                                    <div>Total: ${sub.total / 100}</div> */}

                                    {

                                    }
                                    <div className="flex flex-row gap-[10px]">
                                        {
                                            showCancelButton && (
                                                <Button onClick={() => {
                                                    handleCancelSubscription(sub.id);
                                                }}>Cancel</Button>
                                            )
                                        }

                                        {
                                            showPauseButton && (
                                                <Button onClick={() => {
                                                    handlePause(sub.id);
                                                }}>Pause</Button>
                                            )
                                        }

                                        {
                                            showUnpauseButton && (
                                                <Button onClick={() => {
                                                    handleUnpause(sub.id);
                                                }}>Unpause</Button>
                                            )
                                        }
                                    </div>
                                </CardContent>
                            </CardHeader>
                        </Card>
                    );
                })
            }
            {/* <pre>
                {
                    JSON.stringify(subscriptions, null, 4)
                }
            </pre> */}
        </div>
    );
};