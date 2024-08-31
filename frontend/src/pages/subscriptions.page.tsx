import { Badge } from "@/components/ui/badge";
import { fetcher } from "@/lib/fetcher";
import { getGMT3Date } from "@/lib/money";
import { setSubscriptions } from "@/lib/store/features/subscriptions.slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Price } from "../components/my/Price";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export const SubscriptionsPage = () => {
    const { value: subscriptions } = useAppSelector((state) => state.subscriptions);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        fetcher.getSubscriptions()
            .then(response => {
                console.log(response);
                dispatch(setSubscriptions(response.other));
            });
    }, []);

    function handleCancelSubscription(subscriptionId: string) {
        fetcher.handleCancelSubscription(subscriptionId)
            .then((response) => {
                setSubscriptions(response.data);
            });
    }

    function handlePause(subscriptionId: string) {
        fetcher.handlePause(subscriptionId)
            .then((response) => {
                setSubscriptions(response.data);
            });
    }

    function handleUnpause(subscriptionId: string) {
        fetcher.handleUnpause(subscriptionId)
            .then((response) => {
                setSubscriptions(response.data);
            });
    }

    let subsCounter;
    let subs;
    if (subscriptions !== null) {
        subs = subscriptions.map((sub) => {
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

            const startDate = getGMT3Date(part.startDate).toString();
            const endDate = part.endDate === null ? '-' : getGMT3Date(part.endDate).toString();

            const buttonsSection = (
                <div className="flex flex-row gap-[10px]">
                    {showCancelButton && <Button onClick={() => handleCancelSubscription(sub.id)}>Cancel</Button>}
                    {showPauseButton && <Button onClick={() => handlePause(sub.id)}>Pause</Button>}
                    {showUnpauseButton && <Button onClick={() => handleUnpause(sub.id)}>Unpause</Button>}
                </div>
            );

            return (
                <Card key={sub.id} className="my-[10px]"
                    onClick={() => { }}
                >
                    <CardHeader>
                        <CardTitle className="flex flex-row gap-3 justify-between">
                            <div>
                                {sub.price.product.title} subscription
                            </div>
                            <Badge style={{
                                backgroundColor: color
                            }} variant="outline">{statusText}</Badge>
                        </CardTitle>
                        <CardContent>
                            <div>
                                <div>Start: {startDate}</div>
                                {
                                    endDate !== '-' && <div>End: {endDate}</div> 
                                }
                            </div>
                            <div><Price key={sub.price.id} price={sub.price} /></div>
                            <div className="flex flex-row justify-between">
                                {buttonsSection}
                                <div>
                                    <Button variant={'link'} onClick={() => {
                                        navigate(`/subscription/${sub.id}`);
                                    }}>Payments</Button>
                                </div>
                            </div>
                        </CardContent>
                    </CardHeader>
                </Card>
            );
        });
    }

    return (
        <div>
            <h1 className="text-5xl font-bold">Subscriptions</h1>
            {subsCounter}
            <div className="flex flex-col">{subs}</div>
            {/* <pre>
                {
                    JSON.stringify(subscriptions, null, 4)
                }
            </pre> */}
        </div>
    );
};