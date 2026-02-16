import { describe, it, expect } from "vitest";
import { Account } from "../models/Account";

describe('Account', () => {
    it("should get balance of an account", () => {
        const account = new Account('1234567890123456', 1000);
        expect(account.balance.toNumber()).toBe(1000);
    });

    it("should throw an error if balance is negative", () => {
        expect(() => new Account('1234567890123456', -1000)).toThrow('Balance cannot be negative');
    });

    it("should return false if debit is greater than balance", () => {
        const account = new Account('1234567890123456', 1000);

        expect(account.debit(1001)).toBe(false);
        expect(account.balance.toNumber()).toBe(1000);
    });

    it("should return true if debit is less than balance", () => {
        const account = new Account('1234567890123456', 1000);

        expect(account.debit(500)).toBe(true);
        expect(account.balance.toNumber()).toBe(500);
    });

    it("should return true and set balance to 0 if debit is equal to balance", () => {
        const account = new Account('1234567890123456', 1000);

        expect(account.debit(1000)).toBe(true);
        expect(account.balance.toNumber()).toBe(0);
    });

    it("should credit an amount to the account", () => {
        const account = new Account('1234567890123456', 1000);

        account.credit(500);
        expect(account.balance.toNumber()).toBe(1500);
    });
});
