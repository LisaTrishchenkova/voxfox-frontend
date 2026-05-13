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
    InboxOutlined,
    LoadingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import { courseApi } from "../../api/courseApi.ts";
import { moderationApi } from "../../api/moderationApi.ts";
import { useUserStore } from "../../stores/userStore.ts";
import type { CourseDto } from "../../api/types/course.ts";
import type { ModeratorStatsDto } from "../../api/moderationApi.ts";

const { Content } = Layout;
const { Title, Text } = Typography;

type ModTab = "free" | "inReview" | "my";

const levelLabel: Record<string, string> = {
    Beginner: "Начинающий",
    Intermediate: "Средний",
    Advanced: "Продвинутый",
};

// ─── CourseCard ─────────────────────────────────────────────
const CourseCard = ({
                        course,
                        currentUserId,
                        actionLoading,
                        onApprove,
                        onReject,
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
                borderRadius: 12,
                height: "100%",
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
                {course.description.length > 100
                    ? course.description.slice(0, 100) + "..."
                    : course.description}
            </Text>

            <Divider style={{ margin: "12px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Автор: {course.author?.name ?? "—"}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {course.price === 0 ? "Бесплатно" : `${course.price} ₽`}
                </Text>
            </div>

            {isClaimedByOther && (
                <div style={{ marginBottom: 10 }}>
                    <Tag color="warning" style={{ fontSize: 11 }}>
                        🔒 Проверяет: {course.reviewerName}
                    </Tag>
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

    const loadCourses = async (currentPage: number) => {
        setLoading(true);
        const data = await courseApi.getPendingCourses(currentPage, pageSize);
        if (data) {
            setAllCourses(data.items);
            setTotal(data.totalCount);
        }
        setLoading(false);
    };

    useEffect(() => {
        const load = async () => {
            await loadCourses(page);
        };
        void load();
    }, [page]);

    useEffect(() => {
        if (activeTab !== "my" || stats != null) return;
        const load = async () => {
            setStatsLoading(true);
            const data = await moderationApi.getMyStats();
            setStats(data ?? undefined);
            setStatsLoading(false);
        };
        void load();
    }, [activeTab, stats]);

    const handleTabChange = (tab: ModTab) => {
        setActiveTab(tab);
        void loadCourses(1);
        setPage(1);
        if (tab === "my") {
            setStats(null);
        }
    };

    const handleApprove = async (course: CourseDto) => {
        setActionLoading(course.id);
        // Не вызываем release — бэк сам обнулит ReviewerId в ApproveCourseAsync
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
        // Не вызываем release — бэк сам обнулит ReviewerId в RejectCourseAsync
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

    const tabs: { key: ModTab; label: string; icon: React.ReactNode; count: number }[] = [
        { key: "free", label: "Свободные", icon: <InboxOutlined />, count: freeCourses.length },
        { key: "inReview", label: "На проверке", icon: <LoadingOutlined />, count: inReviewCourses.length },
        { key: "my", label: "Мои курсы", icon: <UserOutlined />, count: myCourses.length },
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
                            Всего на проверке: <strong>{total}</strong>
                            {" · "}
                            Свободных: <strong>{freeCourses.length}</strong>
                            {" · "}
                            Ваших: <strong>{myCourses.length}</strong>
                        </Text>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                        {tabs.map((tab) => (
                            <Button
                                key={tab.key}
                                type={activeTab === tab.key ? "primary" : "default"}
                                icon={tab.icon}
                                onClick={() => handleTabChange(tab.key)}
                                style={activeTab === tab.key ? { background: "rgba(0,100,0,0.8)" } : {}}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span style={{
                                        marginLeft: 6,
                                        background: activeTab === tab.key ? "rgba(255,255,255,0.25)" : "#f0f0f0",
                                        color: activeTab === tab.key ? "#fff" : "#666",
                                        borderRadius: 10,
                                        padding: "0 6px",
                                        fontSize: 11,
                                        fontWeight: 600,
                                    }}>
                                        {tab.count}
                                    </span>
                                )}
                            </Button>
                        ))}
                    </div>

                    <Divider style={{ margin: "0 0 24px" }} />

                    {activeTab === "my" && (
                        <>
                            <div style={{
                                background: "#fff", borderRadius: 10,
                                border: "1px solid #f0f0f0", overflow: "hidden",
                                marginBottom: 32,
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
                                                <Text strong style={{ fontSize: 28, color: s.color }}>
                                                    {s.value}
                                                </Text>
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
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                activeTab === "free" ? "Нет свободных курсов — все разобраны" :
                                    activeTab === "inReview" ? "Нет курсов которые проверяют другие модераторы" :
                                        "Вы не проверяете ни одного курса"
                            }
                        />
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
                </Content>
            </Layout>
            <Footer />

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
                    <Text style={{ display: "block", marginBottom: 8 }}>
                        Укажите причину отклонения (необязательно):
                    </Text>
                    <Input.TextArea rows={4} value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Например: недостаточно материала, некорректное описание..." />
                </div>
            </Modal>
        </>
    );
};

export default ModeratorPage;