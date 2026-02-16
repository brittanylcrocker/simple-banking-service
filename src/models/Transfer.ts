import Decimal from "decimal.js";

export interface Transfer {
    to: string;
    from: string;
    amount: Decimal;
}
