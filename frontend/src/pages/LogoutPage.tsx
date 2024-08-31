import { fetcher } from "@/lib/fetcher";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        fetcher.logout()
            .then(() => navigate('/'));
    }, []);

    return (
        <></>
    );
};