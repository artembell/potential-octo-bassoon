import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ButtonDemo() {
    return;
}


export const LoginPage = () => {
    const [email, setEmail] = useState('web.zoom.dev@gmail.com');
    const navigate = useNavigate();

    async function authorize() {
        fetch(`/api/authenticate`, {
            method: 'POST',
            body: JSON.stringify({
                email
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((response) => {
                console.log(response);

                navigate('/');
            });
    }

    return (
        <div className="flex flex-row">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
            <Button onClick={authorize}>Authorize</Button>
        </div>
    );
};