// // account balance
// // should this store the updated account balance or be a one time process

// // store updated account balance as csv, date.now() to know which file is latest

export class Account {
    private balanceDollars: number;

    constructor(public readonly accountNumber: string, balanceDollars: number) {
        if (balanceDollars < 0) {
            // Unexpected error
            throw new Error('Balance cannot be negative');
        }
        this.balanceDollars = balanceDollars;
    }

    get balance(): number {
        return this.balanceDollars;
    }


    debit(amount: number): boolean {
        if (amount <= 0) {
            // Unexpected error
            throw new Error('Amount cannot be zero or negative');
        }

        if (amount > this.balanceDollars) {
            console.log(`Amount is greater than balance for account ${this.accountNumber}`);
            return false;
        }

        this.balanceDollars -= amount;
        return true;
    }

    credit(amount: number): boolean {
        if (amount <= 0) {
            // Unexpected error
            throw new Error('Amount cannot be zero or negative');
        }

        this.balanceDollars += amount;
        return true;
    }
}