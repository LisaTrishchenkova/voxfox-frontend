import { authStorage } from "../services/auth-storage.service";
import { API_URL } from "../config";
import type {
    BalanceDto,
    PaginatedTransactionsResponse,
    PlatformStatsDto,
    TransactionDto,
} from "./types/transaction";

export const balanceApi = {
    getBalance: async (): Promise<BalanceDto | null> => {
        try {
            const res = await fetch(`${API_URL}/Balance`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    topUp: async (amount: number): Promise<BalanceDto | null> => {
        try {
            const res = await fetch(`${API_URL}/Balance/topup`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify({ amount }),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    purchaseCourse: async (courseId: string): Promise<{ data: TransactionDto | null; error: string | null }> => {
        try {
            const res = await fetch(`${API_URL}/Balance/purchase/${courseId}`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                return { data, error: null };
            }
            try {
                const body = await res.json();
                return { data: null, error: body?.error ?? "Ошибка при покупке" };
            } catch {
                return { data: null, error: "Ошибка при покупке" };
            }
        } catch {
            return { data: null, error: "Ошибка сети" };
        }
    },

    getMyTransactions: async (
        page = 1,
        pageSize = 20
    ): Promise<PaginatedTransactionsResponse | null> => {
        try {
            const res = await fetch(
                `${API_URL}/Balance/transactions?page=${page}&pageSize=${pageSize}`,
                { headers: authStorage.getAuthHeaders() }
            );
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    // Admin only
    getAllTransactions: async (
        page = 1,
        pageSize = 20
    ): Promise<PaginatedTransactionsResponse | null> => {
        try {
            const res = await fetch(
                `${API_URL}/Balance/admin/transactions?page=${page}&pageSize=${pageSize}`,
                { headers: authStorage.getAuthHeaders() }
            );
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    getPlatformStats: async (): Promise<PlatformStatsDto | null> => {
        try {
            const res = await fetch(`${API_URL}/Balance/admin/stats`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    },

    refund: async (transactionId: string): Promise<{ ok: boolean; error: string | null }> => {
        try {
            const res = await fetch(`${API_URL}/Balance/admin/refund/${transactionId}`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
            });
            if (res.ok) return { ok: true, error: null };
            try {
                const body = await res.json();
                return { ok: false, error: body?.error ?? "Ошибка при возврате" };
            } catch {
                return { ok: false, error: "Ошибка при возврате" };
            }
        } catch {
            return { ok: false, error: "Ошибка сети" };
        }
    },
};