import {
    Button,
    Card,
    Col,
    Divider,
    Empty,
    Input,
    Layout,
    Modal,
    Pagination,
    Row,
    Spin,
    Tag,
    Typography,
    message,
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import { courseApi } from "../../api/courseApi.ts";
import { moderationApi } from "../../api/moderationApi.ts";
import { useUserStore } from "../../stores/userStore.ts";
import { API_URL } from "../../config.ts";
import { authStorage } from "../../services/auth-storage.service.ts";
import type { CourseDto } from "../../api/types/course.ts";
import type { ModeratorStatsDto } from "../../api/moderationApi.ts";
import type { CourseDraftDto } from "../../api/courseDraftApi.ts";

const { Content } = Layout;
const { Title, Text } = Typography;

type ModTab = "free" | "inReview" | "my" | "drafts";

const levelLabel: Record<string, string> = {
    Beginner: "Начинающий",
    Intermediate: "Средний",
    Advanced: "Продвинутый",
};

// ─── API для черновиков (модератор) ─────────────────────────
const draftModerationApi = {
    getPendingDrafts: async (): Promise<CourseDraftDto[]> => {
        try {
            const res = await fetch(`${API_URL}/moderation/drafts/pending`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    },
    approveDraft: async (draftId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/moderation/drafts/${draftId}/approve`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch {
            return false;
        }
    },
    rejectDraft: async (draftId: string, reason?: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/moderation/drafts/${draftId}/reject`, {
                method: "PUT",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify({ reason }),
            });
            return res.ok;
        } catch {
            return false;
        }
    },
};

// ─── DraftCard ───────────────────────────────────────────────
const DraftCard = ({ draft, actionLoading, onApprove, onReject }: {
    draft: CourseDraftDto;
    actionLoading: string | null;
    onApprove: (draft: CourseDraftDto) => void;
    onReject: (draft: CourseDraftDto) => void;
}) => (
    <Card style={{ borderRadius: 12, height: "100%" }} styles={{ body: { padding: 20 } }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <Tag color="processing" icon={<EditOutlined />}>Изменения курса</Tag>
            <Tag>{levelLabel[draft.level] ?? draft.level}</Tag>
        </div>

        <Title level={5} style={{ margin: "0 0 6px" }}>{draft.title}</Title>
        <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
            {draft.description?.length > 100 ? draft.description.slice(0, 100) + "..." : draft.description}
        </Text>

        <Divider style={{ margin: "12px 0" }} />

        <div style={{ marginBottom: 10 }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                Разделов: {draft.sections?.length ?? 0}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
                Цена: {draft.price === 0 ? "Бесплатно" : `${draft.price} ₽`}
            </Text>
        </div>

        <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 12, color: "#faad14" }}>
            ⚠️ Это изменения опубликованного курса — текущая версия доступна студентам
        </Text>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button
                size="small" type="primary" icon={<CheckOutlined />}
                loading={actionLoading === draft.id}
                style={{ background: "rgba(0,100,0,0.8)" }}
                onClick={() => onApprove(draft)}
            >
                Одобрить изменения
            </Button>
            <Button
                size="small" danger icon={<CloseOutlined />}
                loading={actionLoading === draft.id}
                onClick={() => onReject(draft)}
            >
                Отклонить
            </Button>
        </div>
    </Card>
);

// ─── CourseCard ─────────────────────────────────────────────
const CourseCard = ({
                        course, currentUserId, actionLoading, onApprove, onReject,
                    }: {
    course: CourseDto;
    currentUserId: string;
    actionLoading: string | null;
    onApprove: (course: CourseDto) => void;
    onReject: (course: CourseDto) => void;
}) => {
    const navigate = useNavigate();
    const isClaimedByMe = !!course.reviewerId && course.reviewerId === currentUserId;
    const isClaimedByOther = !!course.reviewerId && course.reviewerId !== currentUserId;

    return (
        <Card
            style={{
                borderRadius: 12, height: "100%",
                borderColor: isClaimedByMe ? "#52c41a" : isClaimedByOther ? "#faad14" : undefined,
            }}
            styles={{ body: { padding: 20 } }}
            cover={course.coverImageUrl ? (
                <img src={course.coverImageUrl} alt={course.title}
                     style={{ height: 140, objectFit: "cover", borderRadius: "12px 12px 0 0" }} />
            ) : undefined}
        >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Tag color="processing">На проверке</Tag>
                <Tag>{levelLabel[course.level] ?? course.level}</Tag>
            </div>

            <Title level={5} style={{ margin: "0 0 6px" }}>{course.title}</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
                {course.description.length > 100 ? course.description.slice(0, 100) + "..." : course.description}
            </Text>

            <Divider style={{ margin: "12px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Автор: {course.author?.name ?? "—"}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {course.price === 0 ? "Бесплатно" : `${course.price} ₽`}
                </Text>
            </div>

            {isClaimedByOther && (
                <div style={{ marginBottom: 10 }}>
                    <Tag color="warning" style={{ fontSize: 11 }}>🔒 Проверяет: {course.reviewerName}</Tag>
                </div>
            )}
            {isClaimedByMe && (
                <div style={{ marginBottom: 10 }}>
                    <Tag color="success" style={{ fontSize: 11 }}>✓ Вы проверяете</Tag>
                </div>
            )}
            {!course.reviewerId && (
                <div style={{ marginBottom: 10 }}>
                    <Tag style={{ fontSize: 11, color: "#888" }}>Свободен</Tag>
                </div>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Button size="small" icon={<EyeOutlined />}
                        onClick={() => navigate(`/moderator/review/${course.id}`)}>
                    Проверить
                </Button>
                {!isClaimedByOther && (
                    <>
                        <Button size="small" type="primary" icon={<CheckOutlined />}
                                loading={actionLoading === course.id}
                                style={{ background: "rgba(0,100,0,0.8)" }}
                                onClick={() => onApprove(course)}>
                            Одобрить
                        </Button>
                        <Button size="small" danger icon={<CloseOutlined />}
                                loading={actionLoading === course.id}
                                onClick={() => onReject(course)}>
                            Отклонить
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
};

// ─── ModeratorPage ──────────────────────────────────────────
const ModeratorPage = () => {
    const navigate = useNavigate();
    const { userData } = useUserStore();

    const [activeTab, setActiveTab] = useState<ModTab>("free");
    const [allCourses, setAllCourses] = useState<CourseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 12;

    // Черновики
    const [drafts, setDrafts] = useState<CourseDraftDto[]>([]);
    const [draftsLoading, setDraftsLoading] = useState(false);
    const [rejectDraftModalOpen, setRejectDraftModalOpen] = useState(false);
    const [rejectingDraft, setRejectingDraft] = useState<CourseDraftDto | null>(null);
    const [rejectDraftReason, setRejectDraftReason] = useState("");

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectingCourse, setRejectingCourse] = useState<CourseDto | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [stats, setStats] = useState<ModeratorStatsDto | null | undefined>(undefined);
    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        if (userData && userData.role !== "Moderator" && userData.role !== "Admin") {
            navigate("/");
        }
    }, [userData, navigate]);

    const loadCourses = useCallback(async (currentPage: number) => {
        setLoading(true);
        const data = await courseApi.getPendingCourses(currentPage, pageSize);
        if (data) {
            setAllCourses(data.items);
            setTotal(data.totalCount);
        }
        setLoading(false);
    }, []);

    const loadDrafts = useCallback(async () => {
        setDraftsLoading(true);
        const data = await draftModerationApi.getPendingDrafts();
        setDrafts(data);
        setDraftsLoading(false);
    }, []);

    const loadStats = useCallback(async () => {
        setStatsLoading(true);
        const data = await moderationApi.getMyStats();
        setStats(data ?? undefined);
        setStatsLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCourses(page).catch(console.error);
    }, [page, loadCourses]);

    useEffect(() => {
        if (activeTab !== "drafts") return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDrafts().catch(console.error);
    }, [activeTab, loadDrafts]);

    useEffect(() => {
        if (activeTab !== "my" || stats != null) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadStats().catch(console.error);
    }, [activeTab, stats, loadStats]);

    const handleTabChange = (tab: ModTab) => {
        setActiveTab(tab);
        if (tab !== "drafts") {
            void loadCourses(1);
            setPage(1);
        }
        if (tab === "my") setStats(null);
    };

    // ─── Одобрение/отклонение курса (первичная модерация) ───
    const handleApprove = async (course: CourseDto) => {
        setActionLoading(course.id);
        const ok = await courseApi.approveCourse(course.id);
        if (ok) {
            message.success(`Курс «${course.title}» одобрен и опубликован`);
            await loadCourses(page);
            setStats(null);
        } else {
            message.error("Ошибка при одобрении");
        }
        setActionLoading(null);
    };

    const handleOpenReject = (course: CourseDto) => {
        setRejectingCourse(course);
        setRejectReason("");
        setRejectModalOpen(true);
    };

    const handleReject = async () => {
        if (!rejectingCourse) return;
        setActionLoading(rejectingCourse.id);
        const ok = await courseApi.rejectCourse(rejectingCourse.id, rejectReason);
        if (ok) {
            message.success(`Курс «${rejectingCourse.title}» отклонён`);
            setRejectModalOpen(false);
            await loadCourses(page);
            setStats(null);
        } else {
            message.error("Ошибка при отклонении");
        }
        setActionLoading(null);
    };

    // ─── Одобрение/отклонение черновика изменений ───────────
    const handleApproveDraft = async (draft: CourseDraftDto) => {
        setActionLoading(draft.id);
        const ok = await draftModerationApi.approveDraft(draft.id);
        if (ok) {
            message.success(`Изменения курса «${draft.title}» одобрены и применены`);
            setDrafts((p) => p.filter((d) => d.id !== draft.id));
        } else {
            message.error("Ошибка при одобрении изменений");
        }
        setActionLoading(null);
    };

    const handleOpenRejectDraft = (draft: CourseDraftDto) => {
        setRejectingDraft(draft);
        setRejectDraftReason("");
        setRejectDraftModalOpen(true);
    };

    const handleRejectDraft = async () => {
        if (!rejectingDraft) return;
        setActionLoading(rejectingDraft.id);
        const ok = await draftModerationApi.rejectDraft(rejectingDraft.id, rejectDraftReason);
        if (ok) {
            message.success(`Изменения курса «${rejectingDraft.title}» отклонены`);
            setRejectDraftModalOpen(false);
            setDrafts((p) => p.filter((d) => d.id !== rejectingDraft.id));
        } else {
            message.error("Ошибка при отклонении изменений");
        }
        setActionLoading(null);
    };

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

    if (userData.role !== "Moderator" && userData.role !== "Admin") return null;

    const freeCourses = allCourses.filter((c) => !c.reviewerId);
    const inReviewCourses = allCourses.filter((c) => !!c.reviewerId && c.reviewerId !== userData.id);
    const myCourses = allCourses.filter((c) => c.reviewerId === userData.id);

    const tabs: { key: ModTab; label: string; count: number }[] = [
        { key: "free", label: "Свободные", count: freeCourses.length },
        { key: "inReview", label: "На проверке", count: inReviewCourses.length },
        { key: "my", label: "Мои курсы", count: myCourses.length },
        { key: "drafts", label: "Изменения курсов", count: drafts.length },
    ];

    const visibleCourses =
        activeTab === "free" ? freeCourses :
            activeTab === "inReview" ? inReviewCourses :
                myCourses;

    return (
        <>
            <Header />
            <Layout style={{ minHeight: "calc(100vh - 64px)", background: "#fafafa" }}>
                <Content style={{ padding: "40px 60px" }}>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={2} style={{ margin: 0 }}>Панель модератора</Title>
                        <Text type="secondary">
                            Курсов на проверке: <strong>{total}</strong>
                            {" · "}
                            Изменений на проверке: <strong>{drafts.length}</strong>
                        </Text>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                        {tabs.map((tab) => (
                            <Button
                                key={tab.key}
                                type={activeTab === tab.key ? "primary" : "default"}
                                onClick={() => handleTabChange(tab.key)}
                                style={activeTab === tab.key ? { background: "rgba(0,100,0,0.8)" } : {}}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span style={{
                                        marginLeft: 6,
                                        background: activeTab === tab.key ? "rgba(255,255,255,0.25)" : "#f0f0f0",
                                        color: activeTab === tab.key ? "#fff" : "#666",
                                        borderRadius: 10, padding: "0 6px",
                                        fontSize: 11, fontWeight: 600,
                                    }}>
                                        {tab.count}
                                    </span>
                                )}
                            </Button>
                        ))}
                    </div>

                    <Divider style={{ margin: "0 0 24px" }} />

                    {/* Вкладка черновиков изменений */}
                    {activeTab === "drafts" && (
                        draftsLoading ? (
                            <div style={{ textAlign: "center", paddingTop: 60 }}><Spin size="large" /></div>
                        ) : drafts.length === 0 ? (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                                   description="Нет изменений курсов ожидающих проверки" />
                        ) : (
                            <Row gutter={[24, 24]}>
                                {drafts.map((draft) => (
                                    <Col key={draft.id} xs={24} sm={12} lg={8}>
                                        <DraftCard
                                            draft={draft}
                                            actionLoading={actionLoading}
                                            onApprove={handleApproveDraft}
                                            onReject={handleOpenRejectDraft}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        )
                    )}

                    {/* Вкладки курсов */}
                    {activeTab !== "drafts" && (
                        <>
                            {activeTab === "my" && (
                                <>
                                    <div style={{
                                        background: "#fff", borderRadius: 10,
                                        border: "1px solid #f0f0f0", overflow: "hidden", marginBottom: 32,
                                    }}>
                                        <div style={{ padding: "12px 18px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
                                            <Text strong style={{ fontSize: 14 }}>Моя статистика</Text>
                                        </div>
                                        {statsLoading || stats === undefined ? (
                                            <div style={{ padding: 32, textAlign: "center" }}><Spin /></div>
                                        ) : stats ? (
                                            <Row gutter={0}>
                                                {[
                                                    { label: "Проверяю сейчас", value: stats.currentlyReviewing, color: stats.currentlyReviewing > 0 ? "#faad14" : undefined },
                                                    { label: "Всего проверено", value: stats.totalReviewed, color: undefined },
                                                    { label: "Одобрено", value: stats.totalApproved, color: "#52c41a" },
                                                    { label: "Отклонено", value: stats.totalRejected, color: "#ff4d4f" },
                                                ].map((s, i, arr) => (
                                                    <Col key={s.label} xs={12} sm={6} style={{
                                                        padding: "20px 24px",
                                                        borderRight: i < arr.length - 1 ? "1px solid #f0f0f0" : undefined,
                                                    }}>
                                                        <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
                                                            {s.label}
                                                        </Text>
                                                        <Text strong style={{ fontSize: 28, color: s.color }}>{s.value}</Text>
                                                    </Col>
                                                ))}
                                            </Row>
                                        ) : (
                                            <div style={{ padding: 24, textAlign: "center" }}>
                                                <Text type="secondary">Не удалось загрузить статистику</Text>
                                            </div>
                                        )}
                                    </div>
                                    <Text strong style={{ fontSize: 14, display: "block", marginBottom: 16 }}>
                                        Курсы которые вы проверяете
                                    </Text>
                                </>
                            )}

                            {loading ? (
                                <div style={{ textAlign: "center", paddingTop: 60 }}><Spin size="large" /></div>
                            ) : visibleCourses.length === 0 ? (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                                       description={
                                           activeTab === "free" ? "Нет свободных курсов — все разобраны" :
                                               activeTab === "inReview" ? "Нет курсов которые проверяют другие модераторы" :
                                                   "Вы не проверяете ни одного курса"
                                       } />
                            ) : (
                                <>
                                    <Row gutter={[24, 24]}>
                                        {visibleCourses.map((course) => (
                                            <Col key={course.id} xs={24} sm={12} lg={8}>
                                                <CourseCard
                                                    course={course}
                                                    currentUserId={userData.id}
                                                    actionLoading={actionLoading}
                                                    onApprove={handleApprove}
                                                    onReject={handleOpenReject}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                    {activeTab === "free" && total > pageSize && (
                                        <div style={{ textAlign: "center", marginTop: 32 }}>
                                            <Pagination current={page} pageSize={pageSize} total={total}
                                                        onChange={setPage} showSizeChanger={false} />
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Content>
            </Layout>
            <Footer />

            {/* Modal отклонения курса */}
            <Modal
                open={rejectModalOpen}
                title={`Отклонить курс «${rejectingCourse?.title}»`}
                onCancel={() => setRejectModalOpen(false)}
                onOk={handleReject}
                okText="Отклонить" cancelText="Отмена"
                okButtonProps={{ danger: true, loading: actionLoading === rejectingCourse?.id }}
                centered
            >
                <div style={{ marginTop: 8 }}>
                    <Text style={{ display: "block", marginBottom: 8 }}>Укажите причину отклонения (необязательно):</Text>
                    <Input.TextArea rows={4} value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Например: недостаточно материала, некорректное описание..." />
                </div>
            </Modal>

            {/* Modal отклонения черновика */}
            <Modal
                open={rejectDraftModalOpen}
                title={`Отклонить изменения курса «${rejectingDraft?.title}»`}
                onCancel={() => setRejectDraftModalOpen(false)}
                onOk={handleRejectDraft}
                okText="Отклонить" cancelText="Отмена"
                okButtonProps={{ danger: true, loading: actionLoading === rejectingDraft?.id }}
                centered
            >
                <div style={{ marginTop: 8 }}>
                    <Text style={{ display: "block", marginBottom: 8 }}>Укажите причину отклонения (необязательно):</Text>
                    <Input.TextArea rows={4} value={rejectDraftReason}
                                    onChange={(e) => setRejectDraftReason(e.target.value)}
                                    placeholder="Например: некорректные изменения, нарушение правил..." />
                </div>
            </Modal>
        </>
    );
};

export default ModeratorPage;