import { Account } from "../models/Account";
import { Transfer } from "../models/Transfer";

export interface TransferResult {
    successful: Transfer[];
    skipped: Transfer[];
}

export class TransferService {
    private accounts: Map<string, Account> = new Map();

    constructor(accounts: Map<string, Account>) {
        this.accounts = accounts;
    }

    process(transfers: Transfer[]): TransferResult {
        const result: TransferResult = { successful: [], skipped: [] } as TransferResult;

        for (const transfer of transfers) {
            if (this.executeTransfer(transfer)) {
                result.successful.push(transfer);
            } else {
                result.skipped.push(transfer);
            }
        }

        return result;
    }

    private executeTransfer(transfer: Transfer): boolean {
        const fromAccount = this.accounts.get(transfer.from);
        const toAccount = this.accounts.get(transfer.to);
        if (!fromAccount || !toAccount) {
            return false;
        }

        const debitResult = fromAccount.debit(transfer.amount);
        if (!debitResult) {
            return false;
        }

        try {
            toAccount.credit(transfer.amount);
        } catch {
            // refund the debit
            fromAccount.credit(transfer.amount);
            return false;
        }
        return true;
    }
}