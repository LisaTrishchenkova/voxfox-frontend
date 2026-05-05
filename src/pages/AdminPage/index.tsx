import {
    Button,
    Col,
    Divider,
    Empty,
    Form,
    Input,
    Layout,
    Modal,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Switch,
    Table,
    Tag,
    Typography,
    message,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import { useUserStore } from "../../stores/userStore.ts";
import { API_URL } from "../../config.ts";
import { authStorage } from "../../services/auth-storage.service.ts";

const { Content } = Layout;
const { Title, Text } = Typography;

type AdminTab = "users" | "categories";

interface UserDto {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    isDeleted: boolean;
}

interface CategoryDto {
    id: string;
    name: string;
}

const roleColor: Record<string, string> = {
    Student: "default",
    Teacher: "green",
    Moderator: "blue",
    Admin: "red",
};

const roleLabel: Record<string, string> = {
    Student: "Студент",
    Teacher: "Преподаватель",
    Moderator: "Модератор",
    Admin: "Администратор",
};

const usersApi = {
    getUsers: async (params: {
        search?: string;
        role?: string;
        includeDeleted?: boolean;
        page?: number;
        pageSize?: number;
    }) => {
        const p = new URLSearchParams();
        if (params.search) p.append("search", params.search);
        if (params.role) p.append("role", params.role);
        if (params.includeDeleted) p.append("includeDeleted", "true");
        if (params.page) p.append("page", String(params.page));
        if (params.pageSize) p.append("pageSize", String(params.pageSize));
        const res = await fetch(`${API_URL}/Users?${p}`, { headers: authStorage.getAuthHeaders() });
        if (!res.ok) return null;
        return res.json();
    },
    setRole: async (id: string, role: string) => {
        const res = await fetch(`${API_URL}/Users/${id}/role?role=${role}`, {
            method: "PUT", headers: authStorage.getAuthHeaders(),
        });
        return res.ok;
    },
    deleteUser: async (id: string) => {
        const res = await fetch(`${API_URL}/Users/${id}`, {
            method: "DELETE", headers: authStorage.getAuthHeaders(),
        });
        return res.ok;
    },
    restoreUser: async (id: string) => {
        const res = await fetch(`${API_URL}/Users/${id}/restore`, {
            method: "PUT", headers: authStorage.getAuthHeaders(),
        });
        return res.ok;
    },
};

const categoriesApi = {
    getAll: async (): Promise<CategoryDto[]> => {
        const res = await fetch(`${API_URL}/Categories`, { headers: authStorage.getAuthHeaders() });
        if (!res.ok) return [];
        return res.json();
    },
    create: async (name: string): Promise<CategoryDto | null> => {
        const res = await fetch(`${API_URL}/Categories`, {
            method: "POST", headers: authStorage.getAuthHeaders(),
            body: JSON.stringify({ name }),
        });
        if (!res.ok) return null;
        return res.json();
    },
    update: async (id: string, name: string): Promise<boolean> => {
        const res = await fetch(`${API_URL}/Categories/${id}`, {
            method: "PUT", headers: authStorage.getAuthHeaders(),
            body: JSON.stringify({ name }),
        });
        return res.ok;
    },
    delete: async (id: string): Promise<boolean> => {
        const res = await fetch(`${API_URL}/Categories/${id}`, {
            method: "DELETE", headers: authStorage.getAuthHeaders(),
        });
        return res.ok;
    },
};

// ─── UsersTab ──────────────────────────────────────────────
const UsersTab = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const pageSize = 20;

    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserDto | null>(null);
    const [newRole, setNewRole] = useState<string>("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Единый эффект загрузки — зависит от всех фильтров и страницы
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await usersApi.getUsers({
                search: search || undefined,
                role: roleFilter,
                includeDeleted,
                page,
                pageSize,
            });
            if (data) {
                if (Array.isArray(data)) {
                    setUsers(data);
                    setTotal(data.length);
                } else {
                    setUsers(data.items ?? data);
                    setTotal(data.totalCount ?? (data.items ?? data).length);
                }
            }
            setLoading(false);
        };
        void load();
    }, [search, roleFilter, includeDeleted, page]);

    const handleSearch = () => {
        setSearch(searchInput.trim());
        setPage(1);
    };

    const handleFilterChange = (role: string | undefined) => {
        setRoleFilter(role);
        setPage(1);
    };

    const handleIncludeDeletedChange = (v: boolean) => {
        setIncludeDeleted(v);
        setPage(1);
    };

    const handleSetRole = async () => {
        if (!editingUser || !newRole) return;
        setActionLoading(editingUser.id);
        const ok = await usersApi.setRole(editingUser.id, newRole);
        if (ok) {
            message.success("Роль обновлена");
            setUsers((p) => p.map((u) => u.id === editingUser.id ? { ...u, role: newRole } : u));
            setRoleModalOpen(false);
        } else {
            message.error("Ошибка при смене роли");
        }
        setActionLoading(null);
    };

    const handleDelete = async (user: UserDto) => {
        setActionLoading(user.id);
        const ok = await usersApi.deleteUser(user.id);
        if (ok) {
            message.success("Пользователь удалён");
            setUsers((p) => p.map((u) => u.id === user.id ? { ...u, isDeleted: true } : u));
        } else {
            message.error("Ошибка при удалении");
        }
        setActionLoading(null);
    };

    const handleRestore = async (user: UserDto) => {
        setActionLoading(user.id);
        const ok = await usersApi.restoreUser(user.id);
        if (ok) {
            message.success("Пользователь восстановлен");
            setUsers((p) => p.map((u) => u.id === user.id ? { ...u, isDeleted: false } : u));
        } else {
            message.error("Ошибка при восстановлении");
        }
        setActionLoading(null);
    };

    const columns = [
        {
            title: "Пользователь",
            key: "user",
            render: (_: unknown, u: UserDto) => (
                <div>
                    <Text strong style={{ display: "block" }}>{u.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{u.email}</Text>
                </div>
            ),
        },
        {
            title: "Роль",
            key: "role",
            render: (_: unknown, u: UserDto) => (
                <Tag color={roleColor[u.role] ?? "default"}>{roleLabel[u.role] ?? u.role}</Tag>
            ),
        },
        {
            title: "Статус",
            key: "status",
            render: (_: unknown, u: UserDto) => (
                u.isDeleted
                    ? <Tag color="error">Удалён</Tag>
                    : <Tag color="success">Активен</Tag>
            ),
        },
        {
            title: "Дата регистрации",
            key: "createdAt",
            render: (_: unknown, u: UserDto) => (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(u.createdAt).toLocaleDateString("ru-RU")}
                </Text>
            ),
        },
        {
            title: "Действия",
            key: "actions",
            render: (_: unknown, u: UserDto) => (
                <Space size="small">
                    <Button size="small" icon={<EditOutlined />}
                            onClick={() => { setEditingUser(u); setNewRole(u.role); setRoleModalOpen(true); }}>
                        Роль
                    </Button>
                    {u.isDeleted ? (
                        <Popconfirm title="Восстановить пользователя?"
                                    onConfirm={() => handleRestore(u)}
                                    okText="Восстановить" cancelText="Отмена">
                            <Button size="small" icon={<ReloadOutlined />} loading={actionLoading === u.id}>
                                Восстановить
                            </Button>
                        </Popconfirm>
                    ) : (
                        <Popconfirm title="Удалить пользователя?"
                                    description="Пользователь будет деактивирован"
                                    onConfirm={() => handleDelete(u)}
                                    okText="Удалить" cancelText="Отмена"
                                    okButtonProps={{ danger: true }}>
                            <Button size="small" danger icon={<DeleteOutlined />} loading={actionLoading === u.id}>
                                Удалить
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col flex="auto">
                    <Input
                        placeholder="Поиск по имени или email..."
                        prefix={<SearchOutlined />}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onPressEnter={handleSearch}
                        allowClear
                        onClear={() => { setSearchInput(""); setSearch(""); }}
                    />
                </Col>
                <Col>
                    <Button icon={<SearchOutlined />} onClick={handleSearch}>Найти</Button>
                </Col>
                <Col>
                    <Select placeholder="Роль" allowClear style={{ width: 160 }}
                            value={roleFilter} onChange={handleFilterChange}>
                        <Select.Option value="Student">Студент</Select.Option>
                        <Select.Option value="Teacher">Преподаватель</Select.Option>
                        <Select.Option value="Moderator">Модератор</Select.Option>
                        <Select.Option value="Admin">Администратор</Select.Option>
                    </Select>
                </Col>
                <Col style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Switch checked={includeDeleted} onChange={handleIncludeDeletedChange} size="small" />
                    <Text style={{ fontSize: 13 }}>Показать удалённых</Text>
                </Col>
            </Row>

            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false}
                rowClassName={(u) => u.isDeleted ? "deleted-row" : ""}
                style={{ background: "#fff", borderRadius: 8 }}
                locale={{ emptyText: <Empty description="Пользователи не найдены" /> }}
            />

            {total > pageSize && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Pagination current={page} pageSize={pageSize} total={total}
                                onChange={setPage} showSizeChanger={false}
                                showTotal={(t) => `Всего: ${t}`} />
                </div>
            )}

            <Modal open={roleModalOpen} title={`Сменить роль: ${editingUser?.name}`}
                   onCancel={() => setRoleModalOpen(false)}
                   onOk={handleSetRole} okText="Сохранить" cancelText="Отмена"
                   okButtonProps={{ loading: actionLoading === editingUser?.id, style: { background: "rgba(0,100,0,0.8)" } }}
                   centered>
                <div style={{ marginTop: 8 }}>
                    <Text style={{ display: "block", marginBottom: 8 }}>
                        Текущая роль:{" "}
                        <Tag color={roleColor[editingUser?.role ?? ""]}>
                            {roleLabel[editingUser?.role ?? ""] ?? editingUser?.role}
                        </Tag>
                    </Text>
                    <Select value={newRole} onChange={setNewRole} style={{ width: "100%" }} size="large">
                        <Select.Option value="Student">Студент</Select.Option>
                        <Select.Option value="Teacher">Преподаватель</Select.Option>
                        <Select.Option value="Moderator">Модератор</Select.Option>
                        <Select.Option value="Admin">Администратор</Select.Option>
                    </Select>
                </div>
            </Modal>
        </div>
    );
};

// ─── CategoriesTab ─────────────────────────────────────────
const CategoriesTab = () => {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<CategoryDto | null>(null);
    const [form] = Form.useForm<{ name: string }>();
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await categoriesApi.getAll();
            setCategories(data);
            setLoading(false);
        };
        void load();
    }, []);

    const openCreate = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (cat: CategoryDto) => {
        setEditing(cat);
        form.setFieldsValue({ name: cat.name });
        setModalOpen(true);
    };

    const handleSave = async (values: { name: string }) => {
        setSaving(true);
        if (editing) {
            const ok = await categoriesApi.update(editing.id, values.name);
            if (ok) {
                setCategories((p) => p.map((c) => c.id === editing.id ? { ...c, name: values.name } : c));
                message.success("Категория обновлена");
                setModalOpen(false);
            } else { message.error("Ошибка"); }
        } else {
            const created = await categoriesApi.create(values.name);
            if (created) {
                setCategories((p) => [...p, created]);
                message.success("Категория создана");
                setModalOpen(false);
            } else { message.error("Ошибка"); }
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        const ok = await categoriesApi.delete(id);
        if (ok) {
            setCategories((p) => p.filter((c) => c.id !== id));
            message.success("Категория удалена");
        } else { message.error("Ошибка"); }
        setDeletingId(null);
    };

    if (loading) return <Spin />;

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />}
                        style={{ background: "rgba(0,100,0,0.8)" }} onClick={openCreate}>
                    Добавить категорию
                </Button>
            </div>

            {categories.length === 0 ? (
                <Empty description="Категорий пока нет" />
            ) : (
                <Row gutter={[16, 16]}>
                    {categories.map((cat) => (
                        <Col key={cat.id} xs={24} sm={12} md={8} lg={6}>
                            <div style={{
                                background: "#fff", borderRadius: 8,
                                border: "1px solid #f0f0f0", padding: "14px 16px",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                            }}>
                                <Text strong>{cat.name}</Text>
                                <Space>
                                    <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(cat)} />
                                    <Popconfirm title="Удалить категорию?"
                                                description="Курсы в этой категории останутся без категории"
                                                onConfirm={() => handleDelete(cat.id)}
                                                okText="Удалить" cancelText="Отмена"
                                                okButtonProps={{ danger: true }}>
                                        <Button size="small" danger icon={<DeleteOutlined />}
                                                loading={deletingId === cat.id} />
                                    </Popconfirm>
                                </Space>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal open={modalOpen}
                   title={editing ? "Редактировать категорию" : "Новая категория"}
                   onCancel={() => setModalOpen(false)} footer={null} centered>
                <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 8 }}>
                    <Form.Item label="Название" name="name"
                               rules={[{ required: true, message: "Введите название" }, { min: 2, message: "Минимум 2 символа" }]}>
                        <Input placeholder="Название категории" size="large" />
                    </Form.Item>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button onClick={() => setModalOpen(false)}>Отмена</Button>
                        <Button type="primary" htmlType="submit" loading={saving}
                                style={{ background: "rgba(0,100,0,0.8)" }}>
                            {editing ? "Сохранить" : "Создать"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

// ─── AdminPage ─────────────────────────────────────────────
const AdminPage = () => {
    const navigate = useNavigate();
    const { userData } = useUserStore();
    const [activeTab, setActiveTab] = useState<AdminTab>("users");

    useEffect(() => {
        if (userData && userData.role !== "Admin") {
            navigate("/");
        }
    }, [userData, navigate]);

    if (!userData) {
        return (
            <>
                <Header />
                <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
                    <Spin size="large" />
                </div>
            </>
        );
    }

    if (userData.role !== "Admin") return null;

    const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
        { key: "users", label: "Пользователи", icon: <UserOutlined /> },
        { key: "categories", label: "Категории", icon: <EditOutlined /> },
    ];

    return (
        <>
            <Header />
            <Layout style={{ minHeight: "calc(100vh - 64px)", background: "#fafafa" }}>
                <Content style={{ padding: "40px 60px" }}>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={2} style={{ margin: 0 }}>Панель администратора</Title>
                        <Text type="secondary">Управление пользователями и настройками платформы</Text>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                        {tabs.map((tab) => (
                            <Button
                                key={tab.key}
                                type={activeTab === tab.key ? "primary" : "default"}
                                icon={tab.icon}
                                onClick={() => setActiveTab(tab.key)}
                                style={activeTab === tab.key ? { background: "rgba(0,100,0,0.8)" } : {}}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    <Divider style={{ margin: "0 0 24px" }} />

                    {activeTab === "users" && <UsersTab />}
                    {activeTab === "categories" && <CategoriesTab />}
                </Content>
            </Layout>

            <style>{`
                .deleted-row td {
                    opacity: 0.5;
                }
            `}</style>

            <Footer />
        </>
    );
};

export default AdminPage;