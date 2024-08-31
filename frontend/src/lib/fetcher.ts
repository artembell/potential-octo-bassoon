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
            .then((response) => response.json())
    }
}

export const fetcher = new Fetcher();
