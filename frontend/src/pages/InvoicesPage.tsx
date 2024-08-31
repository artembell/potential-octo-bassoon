import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export const InvoicesPage = () => {
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/invoices:')
            .then((response) => response.json())
            .then(invoices => {
                setInvoices(invoices.data);
            });
    }, []);

    return (
        <>
            <h1>All invoices</h1>
            {
                invoices.map((inv) => {
                    return (
                        <Card key={inv.id} className="my-[10px]"
                            onClick={() => {}}
                        >
                            <CardHeader>
                                <CardTitle>{inv.id}</CardTitle>
                                {/* <CardDescription></CardDescription> */}
                                <CardContent>
                                    <div>
                                        <a href={inv.invoice_pdf}>Download PDF</a>
                                        <div>
                                            <div>Start: {new Date(inv.period_start).toString()}</div>
                                            <div>End: {new Date(inv.period_end).toString()}</div>
                                        </div>
                                    </div>
                                    <div>Charged: {`${inv.charge !== null}`}</div>
                                    <div>Total: ${inv.total / 100}</div>
                                </CardContent>
                            </CardHeader>
                        </Card>
                    );
                })
            }
        </>
    );
};