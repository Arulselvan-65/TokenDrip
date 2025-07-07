
export interface MintTokenProps {
    to: string;
    amount: BigInt;
}

export interface TransferTokenProps {
    to: string;
    value: BigInt;
}

export interface CreateScheduleProps {
    address: string;
    totalDays: number;
    totalTokens: number;
}
