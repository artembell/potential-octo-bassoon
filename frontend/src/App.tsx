import './App.css';

import {
    Link,
    Route,
    Routes,
    useNavigate
} from "react-router-dom";
import { AllProductsPage } from './pages/all-products.page';
import { CheckoutPage } from './pages/checkout.page';
import { InspectProductPage } from './pages/InspectProductPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { LoginPage } from './pages/LoginPage';
import { LogoutPage } from './pages/LogoutPage';
import { PaymentInfoPage } from './pages/PaymentInfoPage';
import { SubscriptionsPage } from './pages/subscriptions.page';
import { SubscriptionPaymentsPage } from './pages/SubscriptionPaymentsPage';
import { MyProductsPage } from './pages/my-products.page';
import { useAppSelector, useAppDispatch } from './lib/store/hooks';
import { useEffect } from 'react';
import { AuthGuard, auth } from './components/my/auth.hoc';

function App() {

    const { authorized } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!authorized) {
    //         navigate('/login');
    //     }
    // }, [authorized]);

    return (
        <div className="max-w-sm md:max-w-2xl m-auto py-[40px]">
            <div>
                <div className="flex flex-row justify-between gap-x-[10px] mb-[20px]">
                    <div><Link to="/">All</Link></div>
                    <div><Link to="/my">My</Link></div>
                    <div><Link to="/subscriptions">Subscriptions</Link></div>
                    {/* <div><Link to="/invoices">Invoices</Link></div> */}
                    <div><Link to="/login">Login</Link></div>
                    <div><Link to="/logout">Logout</Link></div>
                </div>

                <Routes>
                    {/* <Route path='/' element={<Navigate replace to="/products" />}></Route> */}
                    <Route path="/" element={<AllProductsPage />}></Route>
                    <Route path="/my" element={<AuthGuard><MyProductsPage /></AuthGuard>}></Route>

                    {/* <Route path="/checkout" element={<CheckoutPage />}></Route> */}

                    <Route path="/inspect/:priceId" element={<InspectProductPage />}></Route>
                    <Route path="/checkout/:priceId" element={<AuthGuard><CheckoutPage /></AuthGuard>}></Route>
                    <Route path="/subscriptions" element={<AuthGuard><SubscriptionsPage /></AuthGuard>}></Route>
                    <Route path="/subscription/:subscriptionId" element={<AuthGuard><SubscriptionPaymentsPage /></AuthGuard>}></Route>
                    <Route path="/invoices" element={<AuthGuard><InvoicesPage /></AuthGuard>}></Route>
                    <Route path="/payment-info" element={<PaymentInfoPage />}></Route>
                    <Route path="/login" element={<LoginPage />}></Route>
                    <Route path="/logout" element={<LogoutPage />}></Route>
                </Routes>
            </div>
        </div >
    );
}

export default App;
