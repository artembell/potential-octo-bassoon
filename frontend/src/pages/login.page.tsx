import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/fetcher";
import { setEmail } from "@/lib/store/features/user.slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ButtonDemo() {
    return;
}


export const LoginPage = () => {
    const navigate = useNavigate();
    const { email } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    async function authorize() {
        fetcher.login(email)
            .then((response) => {
                navigate('/');
            });
    }

    useEffect(() => {
        authorize()
    }, [])
  

    return (
        <div className="flex flex-row">
            <Input autoFocus value={email} onChange={(e) => dispatch(setEmail(e.target.value))} type="email" placeholder="Email" />
            <Button onClick={authorize}>Authorize</Button>
        </div>
    );
};