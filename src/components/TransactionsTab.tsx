import { Empty, Pagination, Spin, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";

import {
    amountColor,
    formatAmount,
    transactionTypeColor,
    transactionTypeLabel,
} from "../utils/transactionUtils.ts";
import type {TransactionDto} from "../api/types/transaction.ts";
import {balanceApi} from "../api/balanceApi.ts";

const { Text } = Typography;

const TransactionsTab = () => {
    const [transactions, setTransactions] = useState<TransactionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await balanceApi.getMyTransactions(page, pageSize);
            if (data) {
                setTransactions(data.items);
                setTotal(data.totalCount);
            }
            setLoading(false);
        };
        void load();
    }, [page]);

    const columns = [
        {
            title: "Дата",
            key: "createdAt",
            width: 140,
            render: (_: unknown, t: TransactionDto) => (
                <Text type="secondary" style={{ fontSize: 13 }}>
                    {new Date(t.createdAt).toLocaleString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
            ),
        },
        {
            title: "Тип",
            key: "type",
            width: 140,
            render: (_: unknown, t: TransactionDto) => (
                <Tag color={transactionTypeColor[t.type]}>{transactionTypeLabel[t.type]}</Tag>
            ),
        },
        {
            title: "Описание",
            key: "description",
            render: (_: unknown, t: TransactionDto) => (
                <div>
                    {t.courseTitle ? (
                        <Text style={{ fontSize: 13 }}>{t.courseTitle}</Text>
                    ) : (
                        <Text type="secondary" style={{ fontSize: 13 }}>—</Text>
                    )}
                    {t.isRefunded && (
                        <Tag color="warning" style={{ marginLeft: 8, fontSize: 11 }}>Возвращён</Tag>
                    )}
                </div>
            ),
        },
        {
            title: "Сумма",
            key: "amount",
            width: 130,
            align: "right" as const,
            render: (_: unknown, t: TransactionDto) => (
                <Text strong style={{ fontSize: 14, color: amountColor(t.amount) }}>
                    {formatAmount(t.amount)}
                </Text>
            ),
        },
    ];

    if (loading)
        return (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
                <Spin size="large" />
            </div>
        );

    return (
        <div>
            {transactions.length === 0 ? (
                <Empty description="История операций пуста" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <>
                    <Table
                        dataSource={transactions}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        style={{ background: "#fff", borderRadius: 8 }}
                        locale={{ emptyText: <Empty description="Нет транзакций" /> }}
                    />
                    {total > pageSize && (
                        <div style={{ textAlign: "center", marginTop: 16 }}>
                            <Pagination
                                current={page}
                                pageSize={pageSize}
                                total={total}
                                onChange={setPage}
                                showSizeChanger={false}
                                showTotal={(t) => `Всего: ${t}`}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TransactionsTab;