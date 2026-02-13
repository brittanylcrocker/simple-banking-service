import { CsvLoader } from "./services/CsvLoader";
import { TransferResult, TransferService } from "./services/TransferService";
import { Account } from "./models/Account";

export class BankApp {
    private accounts: Map<string, Account> = new Map();
    private csvLoader: CsvLoader;

    constructor(csvLoader: CsvLoader = new CsvLoader()) {
        this.csvLoader = csvLoader;
    }

    loadBalances(filePath: string): void {
        const accounts = this.csvLoader.loadAccounts(filePath);
        for (const account of accounts) {
            this.accounts.set(account.accountNumber, account);
        }
    }

    processTransfers(filePath: string): TransferResult {
        const transfers = this.csvLoader.loadTransfers(filePath);
        const transferService = new TransferService(this.accounts);
        return transferService.process(transfers);
    }

    getAccount(accountNumber: string): Account | undefined {
        return this.accounts.get(accountNumber);
    }

    printBalances(): void {
        for (const [id, account] of this.accounts) {
            console.log(`${id}: $${account.balance.toFixed(2)}`);
        }
    }
}

// add ability to run this

if (require.main === module) {
    const [balancesPath, transfersPath] = process.argv.slice(2);

    if (!balancesPath || !transfersPath) {
        console.error('Usage: ts-node src/BankApp.ts <balances.csv> <transfers.csv>');
        process.exit(1);
    }

    const app = new BankApp();
    app.loadBalances(balancesPath);

    console.log('Starting balances:');
    app.printBalances();

    const result = app.processTransfers(transfersPath);

    console.log('\nFinal balances:');
    app.printBalances();

    console.log(`\nTransfers processed: ${result.successful.length}`);
    console.log(`Transfers skipped: ${result.skipped.length}`);
}