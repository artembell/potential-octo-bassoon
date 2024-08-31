import { setAuthorized, setEmail } from "./store/features/user.slice";
import { store } from "./store/store";

class Fetcher {
    private handle = async (response: Response) => {
        if (response.status === 401) {
            store.dispatch(setAuthorized(false));
            throw new Error('Unathorized');
        }
        return response.json();
    };

    async handleCancelSubscription(subscriptionId: string) {
        return fetch(`/api/subscription/cancel/${subscriptionId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(this.handle)
            .catch((e) => console.error(e));
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
            .then(this.handle)
            .catch((e) => console.error(e));
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
            .then(this.handle)
            .catch((e) => console.error(e));
    }

    async getSubscriptions() {
        return fetch('/api/subscriptions')
            .then(this.handle)
            .catch((e) => console.error(e));
    }

    async getAllProducts() {
        return fetch("/api/products/all")
            .then(this.handle)
            .catch((e) => console.error(e));
    }

    async getMyProducts() {
        return fetch("/api/products/my")
            .then(this.handle)
            .catch((e) => console.error(e));
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
                // localStorage.setItem('app-authorized', 'true');

                store.dispatch(setEmail(''));
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
