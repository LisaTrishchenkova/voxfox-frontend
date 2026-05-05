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
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import { courseApi } from "../../api/courseApi.ts";
import { useUserStore } from "../../stores/userStore.ts";
import type { CourseDto } from "../../api/types/course.ts";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

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
    const [previewCourse, setPreviewCourse] = useState<CourseDto | null>(null);

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
                    <div style={{ marginBottom: 24 }}>
                        <Title level={2} style={{ margin: 0 }}>Панель модератора</Title>
                        <Text type="secondary">
                            Курсы ожидающие проверки: <strong>{total}</strong>
                        </Text>
                    </div>

                    <Divider />

                    {loading ? (
                        <div style={{ textAlign: "center", paddingTop: 60 }}><Spin size="large" /></div>
                    ) : courses.length === 0 ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Нет курсов на проверке — всё проверено!"
                        />
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                {courses.map((course) => (
                                    <Col key={course.id} xs={24} sm={12} lg={8}>
                                        <Card
                                            style={{ borderRadius: 12, height: "100%" }}
                                            styles={{ body: { padding: 20 } }}
                                            cover={course.coverImageUrl ? (
                                                <img
                                                    src={course.coverImageUrl}
                                                    alt={course.title}
                                                    style={{ height: 140, objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                                                />
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
                                                        onClick={() => setPreviewCourse(course)}>
                                                    Подробнее
                                                </Button>
                                                <Button
                                                    size="small" type="primary" icon={<CheckOutlined />}
                                                    loading={actionLoading === course.id}
                                                    style={{ background: "rgba(0,100,0,0.8)" }}
                                                    onClick={() => handleApprove(course)}>
                                                    Одобрить
                                                </Button>
                                                <Button
                                                    size="small" danger icon={<CloseOutlined />}
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
                                    <Pagination
                                        current={page}
                                        pageSize={pageSize}
                                        total={total}
                                        onChange={setPage}
                                        showSizeChanger={false}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Content>
            </Layout>
            <Footer />

            {/* Подробности курса */}
            <Modal
                open={!!previewCourse}
                onCancel={() => setPreviewCourse(null)}
                footer={
                    previewCourse ? (
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <Button onClick={() => setPreviewCourse(null)}>Закрыть</Button>
                            <Button danger icon={<CloseOutlined />}
                                    onClick={() => { setPreviewCourse(null); handleOpenReject(previewCourse); }}>
                                Отклонить
                            </Button>
                            <Button type="primary" icon={<CheckOutlined />}
                                    style={{ background: "rgba(0,100,0,0.8)" }}
                                    loading={actionLoading === previewCourse.id}
                                    onClick={() => { handleApprove(previewCourse); setPreviewCourse(null); }}>
                                Одобрить
                            </Button>
                        </div>
                    ) : null
                }
                title={previewCourse?.title}
                width={640}
                centered
            >
                {previewCourse && (
                    <div>
                        {previewCourse.coverImageUrl && (
                            <img src={previewCourse.coverImageUrl} alt=""
                                 style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8, marginBottom: 16 }} />
                        )}
                        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                            <Tag>{levelLabel[previewCourse.level]}</Tag>
                            <Tag>{previewCourse.price === 0 ? "Бесплатно" : `${previewCourse.price} ₽`}</Tag>
                            {previewCourse.certificateEnabled && <Tag color="gold">Сертификат</Tag>}
                        </div>
                        <Text strong style={{ display: "block", marginBottom: 4 }}>Автор</Text>
                        <Text style={{ display: "block", marginBottom: 12 }}>{previewCourse.author?.name}</Text>
                        <Text strong style={{ display: "block", marginBottom: 4 }}>Краткое описание</Text>
                        <Paragraph style={{ marginBottom: 12 }}>{previewCourse.description}</Paragraph>
                        {previewCourse.fullDescription && (
                            <>
                                <Text strong style={{ display: "block", marginBottom: 4 }}>Полное описание</Text>
                                <Paragraph>{previewCourse.fullDescription}</Paragraph>
                            </>
                        )}
                        {previewCourse.tags && previewCourse.tags.length > 0 && (
                            <>
                                <Text strong style={{ display: "block", marginBottom: 6 }}>Теги</Text>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                    {previewCourse.tags.map((t) => <Tag key={t.name}>{t.name}</Tag>)}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>

            {/* Причина отклонения */}
            <Modal
                open={rejectModalOpen}
                title={`Отклонить курс «${rejectingCourse?.title}»`}
                onCancel={() => setRejectModalOpen(false)}
                onOk={handleReject}
                okText="Отклонить"
                cancelText="Отмена"
                okButtonProps={{ danger: true, loading: actionLoading === rejectingCourse?.id }}
                centered
            >
                <div style={{ marginTop: 8 }}>
                    <Text style={{ display: "block", marginBottom: 8 }}>
                        Укажите причину отклонения (необязательно):
                    </Text>
                    <Input.TextArea
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Например: недостаточно материала, некорректное описание..."
                    />
                </div>
            </Modal>
        </>
    );
};

export default ModeratorPage;