import {
    Button, Empty, Input, Pagination, Popconfirm, Row, Col,
    Spin, Table, Tag, Typography, message,
} from "antd";
import { RollbackOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { balanceApi } from "../../api/balanceApi";
import type { PlatformStatsDto, TransactionDto } from "../../api/types/transaction";
import {
    amountColor, formatAmount, transactionTypeColor, transactionTypeLabel,
} from "../../utils/transactionUtils";

const { Text } = Typography;

const AdminTransactionsTab = () => {
    const [transactions, setTransactions] = useState<TransactionDto[]>([]);
    const [stats, setStats] = useState<PlatformStatsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const pageSize = 20;

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [txData, statsData] = await Promise.all([
                balanceApi.getAllTransactions(page, pageSize),
                balanceApi.getPlatformStats(),
            ]);
            if (txData) { setTransactions(txData.items); setTotal(txData.totalCount); }
            if (statsData) setStats(statsData);
            setLoading(false);
        };
        void load();
    }, [page]);

    const handleRefund = async (t: TransactionDto) => {
        setActionLoading(t.id);
        const { ok, error } = await balanceApi.refund(t.id);
        if (ok) {
            message.success("Возврат выполнен");
            setTransactions(prev => prev.map(tx => tx.id === t.id ? { ...tx, isRefunded: true } : tx));
            const statsData = await balanceApi.getPlatformStats();
            if (statsData) setStats(statsData);
        } else {
            message.error(error ?? "Ошибка при возврате");
        }
        setActionLoading(null);
    };

    // Фильтрация по поиску на клиенте (по имени пользователя и названию курса)
    const filtered = search
        ? transactions.filter(t =>
            t.userName.toLowerCase().includes(search.toLowerCase()) ||
            (t.courseTitle ?? "").toLowerCase().includes(search.toLowerCase())
        )
        : transactions;

    const columns = [
        {
            title: "Дата",
            key: "createdAt",
            width: 130,
            render: (_: unknown, t: TransactionDto) => (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(t.createdAt).toLocaleString("ru-RU", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                    })}
                </Text>
            ),
        },
        {
            title: "Пользователь",
            key: "user",
            render: (_: unknown, t: TransactionDto) => (
                <Text style={{ fontSize: 13 }}>{t.userName}</Text>
            ),
        },
        {
            title: "Тип",
            key: "type",
            width: 130,
            render: (_: unknown, t: TransactionDto) => (
                <Tag color={transactionTypeColor[t.type]}>{transactionTypeLabel[t.type]}</Tag>
            ),
        },
        {
            title: "Курс",
            key: "course",
            render: (_: unknown, t: TransactionDto) => (
                <Text type="secondary" style={{ fontSize: 13 }}>{t.courseTitle ?? "—"}</Text>
            ),
        },
        {
            title: "Сумма",
            key: "amount",
            width: 120,
            align: "right" as const,
            render: (_: unknown, t: TransactionDto) => (
                <Text strong style={{ fontSize: 13, color: amountColor(t.amount) }}>
                    {formatAmount(t.amount)}
                </Text>
            ),
        },
        {
            title: "Комиссия",
            key: "platform",
            width: 110,
            align: "right" as const,
            render: (_: unknown, t: TransactionDto) =>
                t.platformAmount != null ? (
                    <Text style={{ fontSize: 13, color: "#faad14" }}>
                        {formatAmount(t.platformAmount)}
                    </Text>
                ) : <Text type="secondary">—</Text>,
        },
        {
            title: "Статус",
            key: "status",
            width: 100,
            render: (_: unknown, t: TransactionDto) =>
                t.isRefunded
                    ? <Tag color="warning">Возвращён</Tag>
                    : <Tag color="success">Активна</Tag>,
        },
        {
            title: "",
            key: "action",
            width: 100,
            render: (_: unknown, t: TransactionDto) =>
                t.type === "Purchase" && !t.isRefunded ? (
                    <Popconfirm
                        title="Оформить возврат?"
                        description={`Студенту вернётся ${formatAmount(t.totalAmount ?? 0)}`}
                        onConfirm={() => handleRefund(t)}
                        okText="Вернуть"
                        cancelText="Отмена"
                        okButtonProps={{ danger: true }}
                    >
                        <Button size="small" icon={<RollbackOutlined />} loading={actionLoading === t.id} danger>
                            Возврат
                        </Button>
                    </Popconfirm>
                ) : null,
        },
    ];

    return (
        <div>
            {/* Статистика — просто строка цифр */}
            {stats && (
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    {[
                        { label: "Покупок", value: stats.totalPurchases, color: undefined },
                        { label: "Выручка платформы", value: `${stats.totalRevenue.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽`, color: "#52c41a" },
                        { label: "Возвращено", value: `${stats.totalRefunded.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽`, color: "#ff4d4f" },
                        { label: "Чистый доход", value: `${stats.netRevenue.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽`, color: stats.netRevenue >= 0 ? "#52c41a" : "#ff4d4f" },
                        { label: "Возвратов", value: stats.totalRefunds, color: undefined },
                    ].map((item) => (
                        <Col key={item.label} xs={12} sm={8} md={4}>
                            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #f0f0f0", padding: "14px 16px" }}>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                                    {item.label}
                                </Text>
                                <Text strong style={{ fontSize: 18, color: item.color }}>
                                    {item.value}
                                </Text>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Поиск */}
            <Row style={{ marginBottom: 16 }}>
                <Col flex="auto">
                    <Input.Search
                        placeholder="Поиск по пользователю или курсу..."
                        enterButton={<Button icon={<SearchOutlined />}>Найти</Button>}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onSearch={(v) => setSearch(v.trim())}
                        allowClear
                        onClear={() => setSearch("")}
                    />
                </Col>
            </Row>

            {/* Таблица */}
            {loading ? (
                <div style={{ textAlign: "center", paddingTop: 60 }}><Spin size="large" /></div>
            ) : filtered.length === 0 ? (
                <Empty description="Транзакций не найдено" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <>
                    <Table
                        dataSource={filtered}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        style={{ background: "#fff", borderRadius: 8 }}
                        scroll={{ x: 900 }}
                        locale={{ emptyText: <Empty description="Нет транзакций" /> }}
                    />
                    {!search && total > pageSize && (
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

export default AdminTransactionsTab;