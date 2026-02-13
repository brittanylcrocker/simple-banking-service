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

        const creditResult = toAccount.credit(transfer.amount);
        if (!creditResult) {
            // if crediting account fails, refund the debit
            const refundResult = fromAccount.credit(transfer.amount);
            if (!refundResult) {
                console.log(`Handle exception: Failed to refund debit for account ${fromAccount.accountNumber}`);
            }
            return false;
        }

        return true;
    }
}