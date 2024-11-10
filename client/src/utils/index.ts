import { ERROR_MESSAGES, PROTOCOL_CONFIG } from "@/constants";

export const formatAmount = (
    amount: string | number | bigint,
    decimals: number = 4
): number => {
    const num =
        typeof amount === "bigint"
            ? Number(amount) / 1e9
            : Number(amount) / 1e9;

    return num;
};

export const calculateRewards = (amount: string, apr: number): string => {
    const yearly = (parseFloat(amount) * apr) / 100;
    const daily = yearly / 365;
    return daily.toFixed(4);
};

export const validateStakeAmount = (
    amount: string,
    balance: string
): string | null => {
    const numAmount = parseFloat(amount);

    if (!amount || numAmount <= 0) {
        return ERROR_MESSAGES.INVALID_AMOUNT;
    }

    if (numAmount < PROTOCOL_CONFIG.MIN_STAKE) {
        return ERROR_MESSAGES.MIN_STAKE;
    }

    if (numAmount > PROTOCOL_CONFIG.MAX_STAKE) {
        return ERROR_MESSAGES.MAX_STAKE;
    }

    if (numAmount > parseFloat(balance)) {
        return ERROR_MESSAGES.INSUFFICIENT_BALANCE;
    }

    return null;
};

export const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const truncateDecimals = (value: number): string => {
    const valStr = value.toString();
    const decimalIdx = valStr.indexOf(".");

    if (decimalIdx === -1) {
        return valStr;
    }

    return valStr.slice(0, decimalIdx + 3);
};
