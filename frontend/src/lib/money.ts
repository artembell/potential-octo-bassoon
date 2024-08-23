export const getCharForCurrency = (currencyCode: string) => {
    switch (currencyCode.toLowerCase()) {
        case 'usd': {
            return '$';
        }
        default: {
            return '???';
        }
    }
};

export const fromDecimalToAmount = (amountDecimal: number) => {
    const amount = (amountDecimal / 100).toFixed(2);
    return amount;
};