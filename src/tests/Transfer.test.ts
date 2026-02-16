import { describe, expect, it } from "vitest";
import Decimal from "decimal.js";
import { Account } from "../models/Account";
import { TransferService } from "../services/TransferService";

function buildAccounts(...entries: [string, number | Decimal][]): Map<string, Account> {
    const accounts = new Map<string, Account>();
    for (const [id, balance] of entries) {
        accounts.set(id, new Account(id, balance));
    }

    return accounts;
}

describe('Transfer', () => {
    it("should execute a transfer", () => {
        const accounts = buildAccounts(
            ['1234567890123456', 2000],
            ['1234567890123457', 1000]
        );
        const transferService = new TransferService(accounts);
        const transfer = { from: '1234567890123456', to: '1234567890123457', amount: new Decimal(1000) };
        const result = transferService.process([transfer]);

        expect(result.successful).toHaveLength(1);
        expect(result.skipped).toHaveLength(0);
        expect(accounts.get('1234567890123456')?.balance.toNumber()).toBe(1000);
        expect(accounts.get('1234567890123457')?.balance.toNumber()).toBe(2000);
    });

    it("should return false and not process the transfer if from account does not have enough balance", () => {
        const accounts = buildAccounts(
            ['1234567890123456', 500],
            ['1234567890123457', 1000]
        );

        const transferService = new TransferService(accounts);
        const transfer = { from: '1234567890123456', to: '1234567890123457', amount: new Decimal(1000) };
        const result = transferService.process([transfer]);
        expect(result.successful).toHaveLength(0);
        expect(result.skipped).toHaveLength(1);

        expect(accounts.get('1234567890123456')?.balance.toNumber()).toBe(500);
        expect(accounts.get('1234567890123457')?.balance.toNumber()).toBe(1000);

    });

    it("should return false and not process the transfer if to account is not found", () => {
        const accounts = buildAccounts(
            ['1234567890123456', 500],
            ['1234567890123457', 1000]
        );
        const transferService = new TransferService(accounts);
        const transfer = { from: '1234567890123456', to: '1234567890123458', amount: new Decimal(1000) };
        const result = transferService.process([transfer]);
        expect(result.successful).toHaveLength(0);
        expect(result.skipped).toHaveLength(1);

        expect(accounts.get('1234567890123456')?.balance.toNumber()).toBe(500);
        expect(accounts.get('1234567890123457')?.balance.toNumber()).toBe(1000);
    });

    it("should process multiple transfers even if one fails", () => {
        const accounts = buildAccounts(
            ['1234567890123456', 2500],
            ['1234567890123457', 1000],
            ['1234567890123458', 1000]
        );
        const transferService = new TransferService(accounts);
        const transfers = [
            { from: '1234567890123456', to: '1234567890123457', amount: new Decimal(1000) },
            { from: '1234567890123457', to: '1234567890123458', amount: new Decimal(2500) }
        ];
        const result = transferService.process(transfers);
        expect(result.successful).toHaveLength(1);
        expect(result.skipped).toHaveLength(1);

        expect(accounts.get('1234567890123456')?.balance.toNumber()).toBe(1500);
        expect(accounts.get('1234567890123457')?.balance.toNumber()).toBe(2000);
        expect(accounts.get('1234567890123458')?.balance.toNumber()).toBe(1000);
    });

    it('should handle empty transfers', () => {
        const accounts = buildAccounts(
            ['1234567890123456', 2500],
            ['1234567890123457', 1000],
        );
        const transferService = new TransferService(accounts);
        const result = transferService.process([]);
        expect(result.successful).toHaveLength(0);
        expect(result.skipped).toHaveLength(0);

        expect(accounts.get('1234567890123456')?.balance.toNumber()).toBe(2500);
        expect(accounts.get('1234567890123457')?.balance.toNumber()).toBe(1000);
    });
});
