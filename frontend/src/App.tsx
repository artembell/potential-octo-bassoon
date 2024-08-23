import './App.css';

import {
    Link,
    Route,
    Routes
} from "react-router-dom";
import { AllProductsPage } from './pages/AllProductsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { InspectProductPage } from './pages/InspectProductPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { LoginPage } from './pages/LoginPage';
import { LogoutPage } from './pages/LogoutPage';
import { PaymentInfoPage } from './pages/PaymentInfoPage';
import { SubscriptionsPage } from './pages/SubsciptionsPage';

function App() {
    return (
        <div className="max-w-sm md:max-w-2xl m-auto py-[40px]">
            <div>
                <div className="flex flex-row justify-between gap-x-[10px] mb-[20px]">
                    <div><Link to="/">All products</Link></div>
                    <div><Link to="/subscriptions">Subscriptions</Link></div>
                    <div><Link to="/invoices">Invoices</Link></div>
                    <div><Link to="/login">Login</Link></div>
                    <div><Link to="/logout">Logout</Link></div>
                </div>



                <Routes>
                    {/* <Route path='/' element={<Navigate replace to="/products" />}></Route> */}
                    <Route path="/" element={<AllProductsPage />}></Route>

                    {/* <Route path="/checkout" element={<CheckoutPage />}></Route> */}

                    <Route path="/inspect/:priceId" element={<InspectProductPage />}></Route>
                    <Route path="/checkout/:priceId" element={<CheckoutPage />}></Route>
                    <Route path="/subscriptions" element={<SubscriptionsPage />}></Route>
                    <Route path="/invoices" element={<InvoicesPage />}></Route>

                    <Route path="/payment-info" element={<PaymentInfoPage />}></Route>
                    <Route path="/login" element={<LoginPage />}></Route>
                    <Route path="/logout" element={<LogoutPage />}></Route>
                </Routes>
            </div>
        </div>
    );
}

export default App;
