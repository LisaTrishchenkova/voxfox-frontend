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
    Statistic,
    Tag,
    Typography,
    message,
} from "antd";
import {
    BarChartOutlined,
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
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

const levelLabel: Record<string, string> = {
    Beginner: "Начинающий",
    Intermediate: "Средний",
    Advanced: "Продвинутый",
};

const ModeratorPage = () => {
    const navigate = useNavigate();
    const { userData } = useUserStore();

    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 12;

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectingCourse, setRejectingCourse] = useState<CourseDto | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [stats, setStats] = useState<ModeratorStatsDto | null>(null);
    const [statsOpen, setStatsOpen] = useState(false);

    useEffect(() => {
        if (userData && userData.role !== "Moderator" && userData.role !== "Admin") {
            navigate("/");
        }
    }, [userData, navigate]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await courseApi.getPendingCourses(page, pageSize);
            if (data) {
                setCourses(data.items);
                setTotal(data.totalCount);
            }
            setLoading(false);
        };
        void load();
    }, [page]);

    const handleApprove = async (course: CourseDto) => {
        setActionLoading(course.id);
        await moderationApi.releaseCourse(course.id);
        const ok = await courseApi.approveCourse(course.id);
        if (ok) {
            message.success(`Курс «${course.title}» одобрен и опубликован`);
            setCourses((p) => p.filter((c) => c.id !== course.id));
            setTotal((t) => t - 1);
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
        await moderationApi.releaseCourse(rejectingCourse.id);
        const ok = await courseApi.rejectCourse(rejectingCourse.id, rejectReason);
        if (ok) {
            message.success(`Курс «${rejectingCourse.title}» отклонён`);
            setCourses((p) => p.filter((c) => c.id !== rejectingCourse.id));
            setTotal((t) => t - 1);
            setRejectModalOpen(false);
        } else {
            message.error("Ошибка при отклонении");
        }
        setActionLoading(null);
    };

    const handleOpenStats = async () => {
        const data = await moderationApi.getMyStats();
        setStats(data);
        setStatsOpen(true);
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

    return (
        <>
            <Header />
            <Layout style={{ minHeight: "calc(100vh - 64px)", background: "#fafafa" }}>
                <Content style={{ padding: "40px 60px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                        <div>
                            <Title level={2} style={{ margin: 0 }}>Панель модератора</Title>
                            <Text type="secondary">
                                Курсов ожидают проверки: <strong>{total}</strong>
                            </Text>
                        </div>
                        <Button icon={<BarChartOutlined />} onClick={handleOpenStats}>
                            Моя статистика
                        </Button>
                    </div>

                    <Divider />

                    {loading ? (
                        <div style={{ textAlign: "center", paddingTop: 60 }}><Spin size="large" /></div>
                    ) : courses.length === 0 ? (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет курсов на проверке — всё проверено!" />
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                {courses.map((course) => (
                                    <Col key={course.id} xs={24} sm={12} lg={8}>
                                        <Card
                                            style={{ borderRadius: 12, height: "100%" }}
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

                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    Автор: {course.author?.name ?? "—"}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {course.price === 0 ? "Бесплатно" : `${course.price} ₽`}
                                                </Text>
                                            </div>

                                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                <Button size="small" icon={<EyeOutlined />}
                                                        onClick={() => navigate(`/moderator/review/${course.id}`)}>
                                                    Проверить
                                                </Button>
                                                <Button size="small" type="primary" icon={<CheckOutlined />}
                                                        loading={actionLoading === course.id}
                                                        style={{ background: "rgba(0,100,0,0.8)" }}
                                                        onClick={() => handleApprove(course)}>
                                                    Одобрить
                                                </Button>
                                                <Button size="small" danger icon={<CloseOutlined />}
                                                        loading={actionLoading === course.id}
                                                        onClick={() => handleOpenReject(course)}>
                                                    Отклонить
                                                </Button>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {total > pageSize && (
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

            {/* Отклонение */}
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

            {/* Статистика */}
            <Modal open={statsOpen} onCancel={() => setStatsOpen(false)}
                   footer={<Button onClick={() => setStatsOpen(false)}>Закрыть</Button>}
                   title="Моя статистика" centered width={480}>
                {stats ? (
                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col span={12}><Statistic title="Проверяю сейчас" value={stats.currentlyReviewing} /></Col>
                        <Col span={12}><Statistic title="Всего проверено" value={stats.totalReviewed} /></Col>
                        <Col span={12}><Statistic title="Одобрено" value={stats.totalApproved} valueStyle={{ color: "#52c41a" }} /></Col>
                        <Col span={12}><Statistic title="Отклонено" value={stats.totalRejected} valueStyle={{ color: "#ff4d4f" }} /></Col>
                    </Row>
                ) : (
                    <div style={{ textAlign: "center", padding: 32 }}><Spin /></div>
                )}
            </Modal>
        </>
    );
};

export default ModeratorPage;
