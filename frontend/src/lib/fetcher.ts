import { setAuthorized, setEmail } from "./store/features/user.slice";
import { store } from "./store/store";

class Fetcher {
    async handleCancelSubscription(subscriptionId: string) {
        return fetch(`/api/subscription/cancel/${subscriptionId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then((response) => response.json());
    }

    async handlePause(subscriptionId: string) {
        return fetch(`/api/subscription/pause/${subscriptionId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then((response) => response.json());
    }

    async handleUnpause(subscriptionId: string) {
        return fetch(`/api/subscription/unpause/${subscriptionId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then((response) => response.json());
    }

    async getSubscriptions() {
        return fetch('/api/subscriptions')
            .then((response) => response.json());
    }

    async getAllProducts() {
        return fetch("/api/products/all")
            .then((response) => response.json());
    }

    async getMyProducts() {
        return fetch("/api/products/my")
            .then((response) => {
                if (response.status === 401) {
                    // store.dispatch(setAuthorized(false));
                }
                console.log(response);
                return response.json();
            });
    }

    async login(email: string) {
        return fetch(`/api/authenticate`, {
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
                store.dispatch(setEmail(''))
                store.dispatch(setAuthorized(true));
                return response.json();
            });
    }

    async logout() {
        return fetch(`/api/logout`, {
            method: 'POST'
        })
            .then((response) => {
                store.dispatch(setAuthorized(false));
                return response.json();
            });
    }
}

export const fetcher = new Fetcher();
