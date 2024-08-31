import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Navigate, useNavigate } from "react-router-dom";

export function auth(Component: any) {
    /** Return anonymous FC */
    return (props: any) => {
        const { authorized } = useAppSelector((state) => state.user);
        console.log('ffff');

        return (
            <>
                {
                    authorized ? <Component /> : <Navigate to="/dashboard" replace={true} />
                }
            </>
        );
    };
};

export const AuthGuard = ({ children }: React.PropsWithChildren) => {
    const { authorized } = useAppSelector((state) => state.user);

    console.log({ authorized });
    console.log(window.location.href);
    return (
        <>
            {
                authorized ? children : <Navigate to="/login" replace={true} />
            }
        </>
    );
};