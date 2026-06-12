import type { TransactionType } from "../api/types/transaction";

export const transactionTypeLabel: Record<TransactionType, string> = {
    TopUp: "Пополнение",
    Purchase: "Покупка курса",
    Earning: "Поступление",
    Refund: "Возврат",
};

export const transactionTypeColor: Record<TransactionType, string> = {
    TopUp: "green",
    Purchase: "red",
    Earning: "green",
    Refund: "blue",
};

export const formatAmount = (amount: number): string => {
    const sign = amount > 0 ? "+" : "";
    return `${sign}${amount.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`;
};

export const amountColor = (amount: number): string =>
    amount > 0 ? "#52c41a" : amount < 0 ? "#ff4d4f" : "#666";