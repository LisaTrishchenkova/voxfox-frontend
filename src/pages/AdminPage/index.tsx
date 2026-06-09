import {
    Button,
    Card,
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
    Statistic,
    Switch,
    Table,
    Tag,
    Typography,
    message,
} from "antd";
import {
    BarChartOutlined,
    BookOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    LockOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    StopOutlined,
    TeamOutlined,
    UnlockOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import { useUserStore } from "../../stores/userStore.ts";
import { adminApi } from "../../api/moderationApi.ts";
import { courseApi } from "../../api/courseApi.ts";
import { API_URL } from "../../config.ts";
import { authStorage } from "../../services/auth-storage.service.ts";
import type { AdminStatsDto, ModeratorStatsDto } from "../../api/moderationApi.ts";
import type { CourseDto, CourseStatus } from "../../api/types/course.ts";

const { Content } = Layout;
const { Title, Text } = Typography;

type AdminTab = "stats" | "users" | "courses" | "moderators" | "categories";

interface UserDto {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    isDeleted: boolean;
    isBlocked?: boolean;
    blockReason?: string | null;
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

const statusColor: Record<string, string> = {
    Draft: "default",
    UnderReview: "processing",
    RejectedByModerator: "error",
    Published: "success",
};

const statusLabel: Record<string, string> = {
    Draft: "Черновик",
    UnderReview: "На проверке",
    RejectedByModerator: "Отклонён",
    Published: "Опубликован",
};

const usersApi = {
    getUsers: async (params: {
        search?: string; role?: string; includeDeleted?: boolean; page?: number; pageSize?: number;
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
    // возвращаем data + error чтобы показывать понятное сообщение
    create: async (name: string): Promise<{ data: CategoryDto | null; error: string | null }> => {
        const res = await fetch(`${API_URL}/Categories`, {
            method: "POST",
            headers: authStorage.getAuthHeaders(),
            body: JSON.stringify({ name }),
        });
        if (res.ok) {
            const data = await res.json();
            return { data, error: null };
        }
        try {
            const errBody = await res.json();
            const errMsg = errBody?.detail ?? errBody?.title ?? null;
            return { data: null, error: errMsg };
        } catch {
            return { data: null, error: null };
        }
    },
    update: async (id: string, name: string): Promise<boolean> => {
        const res = await fetch(`${API_URL}/Categories/${id}`, {
            method: "PUT", headers: authStorage.getAuthHeaders(), body: JSON.stringify({ name }),
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

// ─── StatsTab ──────────────────────────────────────────────
const StatsTab = () => {
    const [stats, setStats] = useState<AdminStatsDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await adminApi.getStats();
            setStats(data);
            setLoading(false);
        };
        void load();
    }, []);

    if (loading) return <div style={{ textAlign: "center", paddingTop: 60 }}><Spin size="large" /></div>;
    if (!stats) return <Empty description="Не удалось загрузить статистику" />;

    const completionRate = stats.totalEnrollments > 0
        ? Math.round(stats.completedEnrollments / stats.totalEnrollments * 100)
        : 0;

    const sections = [
        {
            title: "Пользователи",
            rows: [
                { label: "Всего пользователей", value: stats.totalUsers },
                { label: "Новых за месяц", value: stats.newUsersThisMonth, highlight: "green" },
                { label: "Активных преподавателей", value: stats.activeTeachers },
                { label: "Заблокированных", value: stats.blockedUsers, highlight: stats.blockedUsers > 0 ? "red" : undefined },
            ],
        },
        {
            title: "Курсы",
            rows: [
                { label: "Всего курсов", value: stats.totalCourses },
                { label: "Опубликованных", value: stats.publishedCourses, highlight: "green" },
                { label: "На проверке", value: stats.pendingCourses, highlight: stats.pendingCourses > 0 ? "orange" : undefined },
                { label: "Черновики", value: stats.draftCourses },
            ],
        },
        {
            title: "Обучение",
            rows: [
                { label: "Записей на курсы", value: stats.totalEnrollments },
                { label: "Завершено курсов", value: stats.completedEnrollments, highlight: "green" },
                { label: "Выдано сертификатов", value: stats.totalCertificates },
                { label: "Процент завершения", value: `${completionRate}%` },
            ],
        },
    ];

    return (
        <div>
            <Row gutter={[32, 32]}>
                {sections.map((section) => (
                    <Col key={section.title} xs={24} md={8}>
                        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #f0f0f0", overflow: "hidden" }}>
                            <div style={{ padding: "12px 18px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
                                <Text strong style={{ fontSize: 14 }}>{section.title}</Text>
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <tbody>
                                {section.rows.map((row, i) => (
                                    <tr key={row.label} style={{ borderBottom: i < section.rows.length - 1 ? "1px solid #f5f5f5" : undefined }}>
                                        <td style={{ padding: "10px 18px" }}>
                                            <Text type="secondary" style={{ fontSize: 13 }}>{row.label}</Text>
                                        </td>
                                        <td style={{ padding: "10px 18px", textAlign: "right" }}>
                                            <Text strong style={{
                                                fontSize: 15,
                                                color: row.highlight === "green" ? "#52c41a"
                                                    : row.highlight === "red" ? "#ff4d4f"
                                                        : row.highlight === "orange" ? "#faad14"
                                                            : undefined,
                                            }}>
                                                {row.value}
                                            </Text>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                ))}
            </Row>

            {stats.topCoursesByEnrollments.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <Text strong style={{ fontSize: 14, display: "block", marginBottom: 12 }}>Топ курсов по записям</Text>
                    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #f0f0f0", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                            <tr style={{ background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                                <th style={{ padding: "10px 18px", textAlign: "left", fontWeight: 500, fontSize: 13, color: "#888" }}>#</th>
                                <th style={{ padding: "10px 18px", textAlign: "left", fontWeight: 500, fontSize: 13, color: "#888" }}>Курс</th>
                                <th style={{ padding: "10px 18px", textAlign: "left", fontWeight: 500, fontSize: 13, color: "#888" }}>Автор</th>
                                <th style={{ padding: "10px 18px", textAlign: "right", fontWeight: 500, fontSize: 13, color: "#888" }}>Студентов</th>
                                <th style={{ padding: "10px 18px", textAlign: "right", fontWeight: 500, fontSize: 13, color: "#888" }}>Рейтинг</th>
                            </tr>
                            </thead>
                            <tbody>
                            {stats.topCoursesByEnrollments.map((course, i) => (
                                <tr key={course.id} style={{ borderBottom: i < stats.topCoursesByEnrollments.length - 1 ? "1px solid #f5f5f5" : undefined }}>
                                    <td style={{ padding: "10px 18px" }}><Text type="secondary" style={{ fontSize: 13 }}>{i + 1}</Text></td>
                                    <td style={{ padding: "10px 18px" }}><Text style={{ fontSize: 13 }}>{course.title}</Text></td>
                                    <td style={{ padding: "10px 18px" }}><Text type="secondary" style={{ fontSize: 13 }}>{course.authorName}</Text></td>
                                    <td style={{ padding: "10px 18px", textAlign: "right" }}><Text strong style={{ fontSize: 13 }}>{course.enrollmentCount}</Text></td>
                                    <td style={{ padding: "10px 18px", textAlign: "right" }}>
                                        <Text style={{ fontSize: 13, color: course.rating > 0 ? "#faad14" : "#ccc" }}>
                                            {course.rating > 0 ? `★ ${Number(course.rating).toFixed(1)}` : "—"}
                                        </Text>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── CoursesTab ────────────────────────────────────────────
const CoursesTab = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<CourseStatus | undefined>(undefined);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const pageSize = 12;

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const p = new URLSearchParams();
            if (search) p.append("searchTerm", search);
            if (statusFilter) p.append("status", statusFilter);
            p.append("page", String(page));
            p.append("pageSize", String(pageSize));
            const res = await fetch(`${API_URL}/Courses?${p}`, { headers: authStorage.getAuthHeaders() });
            if (res.ok) {
                const result = await res.json();
                setCourses(result.items ?? []);
                setTotal(result.totalCount ?? 0);
            }
            setLoading(false);
        };
        void load();
    }, [search, statusFilter, page]);

    const handleDelete = async (course: CourseDto, e: React.MouseEvent) => {
        e.stopPropagation();
        setActionLoading(course.id);
        const ok = await courseApi.deleteCourse(course.id);
        if (ok) {
            message.success(`Курс «${course.title}» удалён`);
            setCourses((p) => p.filter((c) => c.id !== course.id));
            setTotal((t) => t - 1);
        } else {
            message.error("Ошибка при удалении");
        }
        setActionLoading(null);
    };

    const handleUnpublish = async (course: CourseDto, e: React.MouseEvent) => {
        e.stopPropagation();
        setActionLoading(course.id);
        const ok = await adminApi.unpublishCourse(course.id);
        if (ok) {
            message.success(`Курс «${course.title}» снят с публикации`);
            setCourses((p) => p.map((c) => c.id === course.id ? { ...c, status: "Draft" as CourseStatus } : c));
        } else {
            message.error("Ошибка при снятии с публикации");
        }
        setActionLoading(null);
    };

    const handleForceRelease = async (course: CourseDto, e: React.MouseEvent) => {
        e.stopPropagation();
        setActionLoading(course.id);
        const ok = await adminApi.forceReleaseCourse(course.id);
        if (ok) {
            message.success(`Захват курса «${course.title}» снят`);
        } else {
            message.error("Ошибка при снятии захвата");
        }
        setActionLoading(null);
    };

    const handleSearch = () => { setSearch(searchInput.trim()); setPage(1); };

    return (
        <div>
            <Row gutter={8} style={{ marginBottom: 16 }}>
                <Col flex="auto">
                    <Input
                        placeholder="Поиск по названию..."
                        prefix={<SearchOutlined />}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onPressEnter={handleSearch}
                        allowClear
                        onClear={() => { setSearchInput(""); setSearch(""); setPage(1); }}
                    />
                </Col>
                <Col>
                    <Button icon={<SearchOutlined />} onClick={handleSearch}>Найти</Button>
                </Col>
                <Col>
                    <Select
                        placeholder="Статус" allowClear style={{ width: 180 }}
                        value={statusFilter}
                        onChange={(v) => { setStatusFilter(v); setPage(1); }}
                    >
                        <Select.Option value="Draft">Черновик</Select.Option>
                        <Select.Option value="UnderReview">На проверке</Select.Option>
                        <Select.Option value="RejectedByModerator">Отклонён</Select.Option>
                        <Select.Option value="Published">Опубликован</Select.Option>
                    </Select>
                </Col>
            </Row>

            {loading ? (
                <div style={{ textAlign: "center", paddingTop: 60 }}><Spin size="large" /></div>
            ) : courses.length === 0 ? (
                <Empty description="Курсы не найдены" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <>
                    <Row gutter={[20, 20]}>
                        {courses.map((course) => (
                            <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
                                <div
                                    onClick={() => navigate(`/course/${course.id}`)}
                                    style={{
                                        background: "#fff", borderRadius: 10,
                                        border: "1px solid #f0f0f0", padding: 16,
                                        cursor: "pointer", transition: "box-shadow 0.2s",
                                        display: "flex", flexDirection: "column", height: "100%",
                                    }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                                >
                                    {course.coverImageUrl && (
                                        <img
                                            src={course.coverImageUrl}
                                            alt={course.title}
                                            style={{
                                                width: "100%", aspectRatio: "16/9",
                                                objectFit: "cover", borderRadius: 6,
                                                marginBottom: 12, display: "block",
                                            }}
                                        />
                                    )}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                                        <Tag color={statusColor[course.status]} style={{ fontSize: 11 }}>
                                            {statusLabel[course.status] ?? course.status}
                                        </Tag>
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            {course.price === 0 ? "Бесплатно" : `${course.price} ₽`}
                                        </Text>
                                    </div>
                                    <Text strong style={{ fontSize: 13, display: "block", marginBottom: 4, lineHeight: 1.4 }}>
                                        {course.title}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, flex: 1 }}>
                                        {course.author?.name ?? "—"}
                                    </Text>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            {course.enrollmentCount} студентов
                                        </Text>
                                        {course.rating > 0 && (
                                            <Text style={{ fontSize: 11, color: "#faad14" }}>
                                                ★ {Number(course.rating).toFixed(1)}
                                            </Text>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            size="small" icon={<EyeOutlined />}
                                            onClick={(e) => { e.stopPropagation(); navigate(`/course/${course.id}`); }}
                                        >
                                            Открыть
                                        </Button>
                                        {course.status === "UnderReview" && (
                                            <Popconfirm
                                                title="Снять захват?"
                                                description="Курс будет освобождён от модератора"
                                                onConfirm={(e) => handleForceRelease(course, e as React.MouseEvent)}
                                                okText="Снять" cancelText="Отмена"
                                            >
                                                <Button size="small" icon={<UnlockOutlined />} loading={actionLoading === course.id}>
                                                    Release
                                                </Button>
                                            </Popconfirm>
                                        )}
                                        {course.status === "Published" && (
                                            <Popconfirm
                                                title="Снять с публикации?"
                                                description="Курс будет переведён в черновик"
                                                onConfirm={(e) => handleUnpublish(course, e as React.MouseEvent)}
                                                okText="Снять" cancelText="Отмена"
                                                okButtonProps={{ danger: true }}
                                            >
                                                <Button size="small" icon={<StopOutlined />} loading={actionLoading === course.id}>
                                                    Снять
                                                </Button>
                                            </Popconfirm>
                                        )}
                                        <Popconfirm
                                            title="Удалить курс?"
                                            description="Это действие необратимо."
                                            onConfirm={(e) => handleDelete(course, e as React.MouseEvent)}
                                            okText="Удалить" cancelText="Отмена"
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Button size="small" danger icon={<DeleteOutlined />} loading={actionLoading === course.id} />
                                        </Popconfirm>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    {total > pageSize && (
                        <div style={{ textAlign: "center", marginTop: 32 }}>
                            <Pagination
                                current={page} pageSize={pageSize} total={total}
                                onChange={setPage} showSizeChanger={false}
                                showTotal={(t) => `Всего: ${t}`}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// ─── ModeratorsTab ─────────────────────────────────────────
const ModeratorsTab = () => {
    const [moderators, setModerators] = useState<ModeratorStatsDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await adminApi.getModeratorsStats();
            setModerators(data);
            setLoading(false);
        };
        void load();
    }, []);

    if (loading) return <div style={{ textAlign: "center", paddingTop: 40 }}><Spin /></div>;
    if (moderators.length === 0) return <Empty description="Нет модераторов на платформе" image={Empty.PRESENTED_IMAGE_SIMPLE} />;

    return (
        <Row gutter={[16, 16]}>
            {moderators.map((mod) => (
                <Col key={mod.moderatorId} xs={24} sm={12} lg={8}>
                    <Card style={{ borderRadius: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: "50%",
                                background: "linear-gradient(135deg, #1890ff, #096dd9)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <UserOutlined style={{ color: "#fff", fontSize: 18 }} />
                            </div>
                            <div>
                                <Text strong style={{ display: "block" }}>{mod.moderatorName}</Text>
                                <Tag color="blue" style={{ fontSize: 11 }}>Модератор</Tag>
                            </div>
                        </div>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Statistic title="Проверяет сейчас" value={mod.currentlyReviewing}
                                           valueStyle={{ fontSize: 20, color: mod.currentlyReviewing > 0 ? "#faad14" : "#666" }} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="Всего проверено" value={mod.totalReviewed} valueStyle={{ fontSize: 20 }} />
                            </Col>
                            <Col span={12} style={{ marginTop: 8 }}>
                                <Statistic title="Одобрено" value={mod.totalApproved} valueStyle={{ fontSize: 20, color: "#52c41a" }} />
                            </Col>
                            <Col span={12} style={{ marginTop: 8 }}>
                                <Statistic title="Отклонено" value={mod.totalRejected} valueStyle={{ fontSize: 20, color: "#ff4d4f" }} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            ))}
        </Row>
    );
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
    const [blockModalOpen, setBlockModalOpen] = useState(false);
    const [blockingUser, setBlockingUser] = useState<UserDto | null>(null);
    const [blockReason, setBlockReason] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await usersApi.getUsers({ search: search || undefined, role: roleFilter, includeDeleted, page, pageSize });
            if (data) {
                if (Array.isArray(data)) { setUsers(data); setTotal(data.length); }
                else { setUsers(data.items ?? data); setTotal(data.totalCount ?? (data.items ?? data).length); }
            }
            setLoading(false);
        };
        void load();
    }, [search, roleFilter, includeDeleted, page]);

    const handleSearch = () => { setSearch(searchInput.trim()); setPage(1); };

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

    const handleBlock = async () => {
        if (!blockingUser) return;
        setActionLoading(blockingUser.id);
        const ok = await adminApi.blockUser(blockingUser.id, blockReason || undefined);
        if (ok) {
            message.success("Пользователь заблокирован");
            setUsers((p) => p.map((u) => u.id === blockingUser.id ? { ...u, isBlocked: true, blockReason } : u));
            setBlockModalOpen(false);
        } else {
            message.error("Ошибка при блокировке");
        }
        setActionLoading(null);
    };

    const handleUnblock = async (user: UserDto) => {
        setActionLoading(user.id);
        const ok = await adminApi.unblockUser(user.id);
        if (ok) {
            message.success("Пользователь разблокирован");
            setUsers((p) => p.map((u) => u.id === user.id ? { ...u, isBlocked: false, blockReason: null } : u));
        } else {
            message.error("Ошибка при разблокировке");
        }
        setActionLoading(null);
    };

    const columns = [
        {
            title: "Пользователь", key: "user",
            render: (_: unknown, u: UserDto) => (
                <div>
                    <Text strong style={{ display: "block" }}>{u.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{u.email}</Text>
                </div>
            ),
        },
        {
            title: "Роль", key: "role",
            render: (_: unknown, u: UserDto) => <Tag color={roleColor[u.role] ?? "default"}>{roleLabel[u.role] ?? u.role}</Tag>,
        },
        {
            title: "Статус", key: "status",
            render: (_: unknown, u: UserDto) => (
                <Space size={4} direction="vertical">
                    {u.isDeleted ? <Tag color="error">Удалён</Tag> : <Tag color="success">Активен</Tag>}
                    {u.isBlocked && <Tag color="warning">Заблокирован</Tag>}
                </Space>
            ),
        },
        {
            title: "Регистрация", key: "createdAt",
            render: (_: unknown, u: UserDto) => (
                <Text type="secondary" style={{ fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString("ru-RU")}</Text>
            ),
        },
        {
            title: "Действия", key: "actions",
            render: (_: unknown, u: UserDto) => (
                <Space size="small" wrap>
                    <Button size="small" icon={<EditOutlined />}
                            onClick={() => { setEditingUser(u); setNewRole(u.role); setRoleModalOpen(true); }}>
                        Роль
                    </Button>
                    {u.isBlocked ? (
                        <Popconfirm title="Разблокировать?" onConfirm={() => handleUnblock(u)} okText="Да" cancelText="Нет">
                            <Button size="small" icon={<UnlockOutlined />} loading={actionLoading === u.id}>
                                Разблокировать
                            </Button>
                        </Popconfirm>
                    ) : !u.isDeleted ? (
                        <Button size="small" icon={<LockOutlined />}
                                onClick={() => { setBlockingUser(u); setBlockReason(""); setBlockModalOpen(true); }}>
                            Заблокировать
                        </Button>
                    ) : null}
                    {u.isDeleted ? (
                        <Popconfirm title="Восстановить?" onConfirm={() => handleRestore(u)} okText="Да" cancelText="Нет">
                            <Button size="small" icon={<ReloadOutlined />} loading={actionLoading === u.id}>
                                Восстановить
                            </Button>
                        </Popconfirm>
                    ) : (
                        <Popconfirm title="Удалить пользователя?" description="Пользователь будет деактивирован"
                                    onConfirm={() => handleDelete(u)} okText="Удалить" cancelText="Отмена"
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
                    <Input placeholder="Поиск по имени или email..." prefix={<SearchOutlined />} value={searchInput}
                           onChange={(e) => setSearchInput(e.target.value)} onPressEnter={handleSearch} allowClear
                           onClear={() => { setSearchInput(""); setSearch(""); }} />
                </Col>
                <Col><Button icon={<SearchOutlined />} onClick={handleSearch}>Найти</Button></Col>
                <Col>
                    <Select placeholder="Роль" allowClear style={{ width: 160 }} value={roleFilter}
                            onChange={(v) => { setRoleFilter(v); setPage(1); }}>
                        <Select.Option value="Student">Студент</Select.Option>
                        <Select.Option value="Teacher">Преподаватель</Select.Option>
                        <Select.Option value="Moderator">Модератор</Select.Option>
                        <Select.Option value="Admin">Администратор</Select.Option>
                    </Select>
                </Col>
                <Col style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Switch checked={includeDeleted} onChange={(v) => { setIncludeDeleted(v); setPage(1); }} size="small" />
                    <Text style={{ fontSize: 13 }}>Показать удалённых</Text>
                </Col>
            </Row>

            <Table dataSource={users} columns={columns} rowKey="id" loading={loading} pagination={false}
                   rowClassName={(u) => u.isDeleted ? "deleted-row" : ""}
                   style={{ background: "#fff", borderRadius: 8 }}
                   locale={{ emptyText: <Empty description="Пользователи не найдены" /> }} />

            {total > pageSize && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Pagination current={page} pageSize={pageSize} total={total} onChange={setPage}
                                showSizeChanger={false} showTotal={(t) => `Всего: ${t}`} />
                </div>
            )}

            <Modal open={roleModalOpen} title={`Сменить роль: ${editingUser?.name}`}
                   onCancel={() => setRoleModalOpen(false)} onOk={handleSetRole}
                   okText="Сохранить" cancelText="Отмена"
                   okButtonProps={{ loading: actionLoading === editingUser?.id, style: { background: "rgba(0,100,0,0.8)" } }}
                   centered>
                <div style={{ marginTop: 8 }}>
                    <Text style={{ display: "block", marginBottom: 8 }}>
                        Текущая роль:{" "}
                        <Tag color={roleColor[editingUser?.role ?? ""]}>{roleLabel[editingUser?.role ?? ""] ?? editingUser?.role}</Tag>
                    </Text>
                    <Select value={newRole} onChange={setNewRole} style={{ width: "100%" }} size="large">
                        <Select.Option value="Student">Студент</Select.Option>
                        <Select.Option value="Teacher">Преподаватель</Select.Option>
                        <Select.Option value="Moderator">Модератор</Select.Option>
                        <Select.Option value="Admin">Администратор</Select.Option>
                    </Select>
                </div>
            </Modal>

            <Modal open={blockModalOpen} title={`Заблокировать: ${blockingUser?.name}`}
                   onCancel={() => setBlockModalOpen(false)} onOk={handleBlock}
                   okText="Заблокировать" cancelText="Отмена"
                   okButtonProps={{ danger: true, loading: actionLoading === blockingUser?.id }}
                   centered>
                <div style={{ marginTop: 8 }}>
                    <Text style={{ display: "block", marginBottom: 8 }}>Причина блокировки (необязательно):</Text>
                    <Input.TextArea rows={3} value={blockReason} onChange={(e) => setBlockReason(e.target.value)}
                                    placeholder="Нарушение правил, спам и т.д." />
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

    const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
    const openEdit = (cat: CategoryDto) => { setEditing(cat); form.setFieldsValue({ name: cat.name }); setModalOpen(true); };

    const handleSave = async (values: { name: string }) => {
        setSaving(true);
        if (editing) {
            const ok = await categoriesApi.update(editing.id, values.name);
            if (ok) {
                setCategories((p) => p.map((c) => c.id === editing.id ? { ...c, name: values.name } : c));
                message.success("Категория обновлена");
                setModalOpen(false);
            } else {
                message.error("Ошибка при обновлении категории");
            }
        } else {
            const { data: created, error } = await categoriesApi.create(values.name);
            if (created) {
                setCategories((p) => [...p, created]);
                message.success("Категория создана");
                setModalOpen(false);
            } else {
                // сначала проверяем локально — самый надёжный способ
                const duplicate = categories.some(
                    (c) => c.name.toLowerCase() === values.name.trim().toLowerCase()
                );
                if (duplicate) {
                    message.error(`Категория «${values.name}» уже существует`);
                } else if (error) {
                    message.error(error);
                } else {
                    message.error("Не удалось создать категорию. Попробуйте ещё раз");
                }
            }
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        const ok = await categoriesApi.delete(id);
        if (ok) {
            setCategories((p) => p.filter((c) => c.id !== id));
            message.success("Категория удалена");
        } else {
            message.error("Ошибка при удалении категории");
        }
        setDeletingId(null);
    };

    if (loading) return <Spin />;

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} style={{ background: "rgba(0,100,0,0.8)" }}
                        onClick={openCreate}>
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
                                background: "#fff", borderRadius: 8, border: "1px solid #f0f0f0",
                                padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
                            }}>
                                <Text strong>{cat.name}</Text>
                                <Space>
                                    <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(cat)} />
                                    <Popconfirm title="Удалить категорию?"
                                                description="Курсы в этой категории останутся без категории"
                                                onConfirm={() => handleDelete(cat.id)}
                                                okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}>
                                        <Button size="small" danger icon={<DeleteOutlined />} loading={deletingId === cat.id} />
                                    </Popconfirm>
                                </Space>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal open={modalOpen} title={editing ? "Редактировать категорию" : "Новая категория"}
                   onCancel={() => setModalOpen(false)} footer={null} centered>
                <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 8 }}>
                    <Form.Item label="Название" name="name"
                               rules={[{ required: true, message: "Введите название" }, { min: 2 }]}>
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
    const [activeTab, setActiveTab] = useState<AdminTab>("stats");

    useEffect(() => {
        if (userData && userData.role !== "Admin") navigate("/");
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
        { key: "stats", label: "Статистика", icon: <BarChartOutlined /> },
        { key: "users", label: "Пользователи", icon: <UserOutlined /> },
        { key: "courses", label: "Курсы", icon: <BookOutlined /> },
        { key: "moderators", label: "Модераторы", icon: <TeamOutlined /> },
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
                    <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                        {tabs.map((tab) => (
                            <Button key={tab.key} type={activeTab === tab.key ? "primary" : "default"} icon={tab.icon}
                                    onClick={() => setActiveTab(tab.key)}
                                    style={activeTab === tab.key ? { background: "rgba(0,100,0,0.8)" } : {}}>
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                    <Divider style={{ margin: "0 0 24px" }} />
                    {activeTab === "stats" && <StatsTab />}
                    {activeTab === "users" && <UsersTab />}
                    {activeTab === "courses" && <CoursesTab />}
                    {activeTab === "moderators" && <ModeratorsTab />}
                    {activeTab === "categories" && <CategoriesTab />}
                </Content>
            </Layout>
            <style>{`.deleted-row td { opacity: 0.5; }`}</style>
            <Footer />
        </>
    );
};

export default AdminPage;