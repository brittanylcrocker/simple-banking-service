import * as fs from 'fs';
import { Account } from '../models/Account';
import { Transfer } from '../models/Transfer';

export class CsvLoader {
    loadAccounts(filePath: string): Account[] {
        const lines = this.readLines(filePath);

        return lines.map((line) => {
            const [accountNumber, balance] = line.split(',').map((s) => s.trim());
            return new Account(accountNumber, Number(balance));
        });
    }

    loadTransfers(filePath: string): Transfer[] {
        const lines = this.readLines(filePath);

        return lines.map((line) => {
            const [from, to, amount] = line.split(',').map((s) => s.trim());
            return { from, to, amount: Number(amount) };
        });
    }

    private readLines(filePath: string): string[] {
        return fs.readFileSync(filePath, 'utf-8').trim().split('\n').filter((line) => line.trim() !== '');
    }
}