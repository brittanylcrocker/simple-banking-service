import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { describe, expect, it } from 'vitest';
import { BankApp } from '../BankApp';

function writeTempCsv(filename: string, content: string): string {
    const filePath = path.join(os.tmpdir(), filename);
    fs.writeFileSync(filePath, content);
    return filePath;
}

describe('BankApp integration', () => {
    it('processes the sample data correctly', () => {
        const balancesPath = writeTempCsv('balances.csv', [
            '1111234522226789,5000.00',
            '1111234522221234,10000.00',
            '2222123433331212,550.00',
            '1212343433335665,1200.00',
            '3212343433335755,50000.00',
        ].join('\n'));

        const transfersPath = writeTempCsv('transfers.csv', [
            '1111234522226789,1212343433335665,500.00',
            '3212343433335755,2222123433331212,1000.00',
            '3212343433335755,1111234522226789,320.50',
            '1111234522221234,1212343433335665,25.60',
        ].join('\n'));

        const app = new BankApp();
        app.loadBalances(balancesPath);
        const result = app.processTransfers(transfersPath);

        expect(result.successful).toHaveLength(4);
        expect(result.skipped).toHaveLength(0);
        expect(app.getAccount('1111234522226789')!.balance.toFixed(2)).toBe('4820.50');
        expect(app.getAccount('1111234522221234')!.balance.toFixed(2)).toBe('9974.40');
        expect(app.getAccount('2222123433331212')!.balance.toFixed(2)).toBe('1550.00');
        expect(app.getAccount('1212343433335665')!.balance.toFixed(2)).toBe('1725.60');
        expect(app.getAccount('3212343433335755')!.balance.toFixed(2)).toBe('48679.50');
    });

    it('skips transfers that would overdraw an account', () => {
        const balancesPath = writeTempCsv('small_balances.csv', [
            '1111111111111111,100.00',
            '2222222222222222,50.00',
        ].join('\n'));
        const transfersPath = writeTempCsv('overdraw.csv', [
            '1111111111111111,2222222222222222,150.00',
        ].join('\n'));

        const app = new BankApp();
        app.loadBalances(balancesPath);
        const result = app.processTransfers(transfersPath);

        expect(result.successful).toHaveLength(0);
        expect(result.skipped).toHaveLength(1);
        expect(app.getAccount('1111111111111111')!.balance.toFixed(2)).toBe('100.00');
        expect(app.getAccount('2222222222222222')!.balance.toFixed(2)).toBe('50.00');
    });
});
