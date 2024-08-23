import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/logout`, {
            method: 'POST'
        })
            .then((response) => response.json())
            .then(() => navigate('/'));
    }, []);

    return (
        <></>
    );
};