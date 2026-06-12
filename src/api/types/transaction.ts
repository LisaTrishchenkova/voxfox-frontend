export type TransactionType = "TopUp" | "Purchase" | "Earning" | "Refund";

export interface TransactionDto {
    id: string;
    userId: string;
    userName: string;
    type: TransactionType;
    amount: number;
    courseId?: string | null;
    courseTitle?: string | null;
    totalAmount?: number | null;
    teacherAmount?: number | null;
    platformAmount?: number | null;
    isRefunded: boolean;
    originalTransactionId?: string | null;
    createdAt: string;
}

export interface BalanceDto {
    userId: string;
    balance: number;
}

export interface PlatformStatsDto {
    totalRevenue: number;
    totalRefunded: number;
    netRevenue: number;
    totalPurchases: number;
    totalRefunds: number;
}

export interface PaginatedTransactionsResponse {
    items: TransactionDto[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}