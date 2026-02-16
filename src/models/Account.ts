import Decimal from "decimal.js";

export class Account {
    private balanceDollars: Decimal;

    constructor(public readonly accountNumber: string, balanceDollars: Decimal | number) {
        const balance = new Decimal(balanceDollars);
        if (balance.lt(0)) {
            throw new Error('Balance cannot be negative');
        }
        this.balanceDollars = balance;
    }

    get balance(): Decimal {
        return this.balanceDollars;
    }

    debit(_amount: Decimal | number): boolean {
        const amount = new Decimal(_amount);
        if (amount.lte(0)) {
            throw new Error('Amount cannot be zero or negative');
        }

        if (amount.gt(this.balanceDollars)) {
            return false;
        }

        this.balanceDollars = this.balanceDollars.minus(amount);
        return true;
    }

    credit(_amount: Decimal | number): boolean {
        const amount = new Decimal(_amount);
        if (amount.lte(0)) {
            throw new Error('Amount cannot be zero or negative');
        }

        this.balanceDollars = this.balanceDollars.plus(amount);
        return true;
    }
}
