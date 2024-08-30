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

export const getGMT3Date = (date: Date | string, gmt: number = 0) => {
    if (typeof date === 'string') {
        const d = new Date(date);
        const time = d.getTime() + 3600 * gmt * 1000;
        const newDate = new Date(time);
        return newDate;
    } else {
        const time = date.getTime() + 3600 * gmt * 1000;
        const newDate = new Date(time);
        return newDate;
    }
};