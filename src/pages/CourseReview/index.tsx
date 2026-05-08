import {
    Alert,
    Button,
    Divider,
    Empty,
    Input,
    Layout,
    Modal,
    Spin,
    Tag,
    Typography,
    message,
} from "antd";
import {
    ArrowLeftOutlined,
    CheckOutlined,
    CloseOutlined,
    FileTextOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "../../components/Header.tsx";
import { courseApi } from "../../api/courseApi.ts";
import { moderationApi } from "../../api/moderationApi.ts";
import { sectionApi } from "../../api/sectionApi.ts";
import { taskTeacherApi } from "../../api/taskTeacherApi.ts";
import { useUserStore } from "../../stores/userStore.ts";
import { markdownComponents } from "../../components/markdownComponents.tsx";
import type { CourseReviewDto } from "../../api/moderationApi.ts";
import type { SectionDto, LessonDto } from "../../api/types/course.ts";
import type { TaskTeacherDto } from "../../api/taskTeacherApi.ts";

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const levelLabel: Record<string, string> = {
    Beginner: "Начинающий",
    Intermediate: "Средний",
    Advanced: "Продвинутый",
};

const taskTypeLabel: Record<string, string> = {
    SingleChoice: "Одиночный выбор",
    MultiChoice: "Множественный выбор",
    TextInput: "Текстовый ответ",
};

// ─── LessonContent ──────────────────────────────────────────
const LessonContent = ({
                           lesson,
                           index,
                       }: {
    lesson: LessonDto;
    index: string;
}) => {
    const [tasks, setTasks] = useState<TaskTeacherDto[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await taskTeacherApi.getLessonTasks(lesson.id);
            setTasks(data);
            setLoadingTasks(false);
        };
        void load();
    }, [lesson.id]);

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    Урок {index}
                </Text>
                <Title level={3} style={{ margin: "4px 0 8px" }}>{lesson.title}</Title>
                <Text type="secondary">{lesson.description}</Text>
            </div>

            {lesson.content ? (
                <div style={{ marginBottom: 32 }}>
                    <div className="markdown-preview">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {lesson.content}
                        </ReactMarkdown>
                    </div>
                </div>
            ) : (
                <div style={{
                    padding: 24, borderRadius: 8, background: "#fafafa",
                    border: "1px dashed #d9d9d9", marginBottom: 32, textAlign: "center",
                }}>
                    <Text type="secondary">Содержимое урока не добавлено</Text>
                </div>
            )}

            <Divider />

            <div>
                <Text strong style={{ fontSize: 14, display: "block", marginBottom: 16 }}>
                    Задания к уроку
                </Text>

                {loadingTasks ? (
                    <Spin size="small" />
                ) : tasks.length === 0 ? (
                    <Text type="secondary">Заданий нет</Text>
                ) : (
                    tasks.map((task, ti) => (
                        <div key={task.id} style={{
                            border: "1px solid #f0f0f0",
                            borderRadius: 8,
                            padding: "16px 20px",
                            marginBottom: 12,
                            background: "#fff",
                        }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, minWidth: 20 }}>
                                    {ti + 1}.
                                </Text>
                                <Tag style={{ fontSize: 11, margin: 0 }}>
                                    {taskTypeLabel[task.type] ?? task.type}
                                </Tag>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    {task.points} {task.points === 1 ? "очко" : "очков"}
                                    {" · "}
                                    {task.isRequired ? "Обязательное" : "Необязательное"}
                                </Text>
                            </div>

                            <Text strong style={{ fontSize: 14, display: "block", marginBottom: 12 }}>
                                {task.question}
                            </Text>

                            {task.options && task.options.length > 0 && (
                                <div style={{ marginBottom: 10 }}>
                                    {task.options.map((opt, oi) => {
                                        const isCorrect = task.correctIndex === oi || task.correctIndexes?.includes(oi);
                                        return (
                                            <div key={oi} style={{
                                                display: "flex", alignItems: "center", gap: 8,
                                                padding: "7px 12px", borderRadius: 6, marginBottom: 4,
                                                border: `1px solid ${isCorrect ? "#b7eb8f" : "#f0f0f0"}`,
                                                background: isCorrect ? "#f6ffed" : "#fafafa",
                                            }}>
                                                <span style={{ width: 16, flexShrink: 0, textAlign: "center" }}>
                                                    {isCorrect
                                                        ? <CheckOutlined style={{ color: "#52c41a", fontSize: 12 }} />
                                                        : <span style={{ color: "#ccc", fontSize: 12 }}>○</span>
                                                    }
                                                </span>
                                                <Text style={{ fontSize: 13 }}>{opt}</Text>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {task.correctAnswer && (
                                <div style={{
                                    padding: "7px 12px", borderRadius: 6,
                                    border: "1px solid #b7eb8f", background: "#f6ffed", marginBottom: 8,
                                    display: "flex", alignItems: "center", gap: 8,
                                }}>
                                    <CheckOutlined style={{ color: "#52c41a", fontSize: 12 }} />
                                    <Text style={{ fontSize: 13 }}>
                                        Правильный ответ: <strong>{task.correctAnswer}</strong>
                                    </Text>
                                </div>
                            )}

                            {task.explanation && (
                                <div style={{
                                    padding: "7px 12px", borderRadius: 6,
                                    background: "#e6f7ff", border: "1px solid #91d5ff",
                                }}>
                                    <Text style={{ fontSize: 12, color: "#1890ff" }}>💡 {task.explanation}</Text>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// ─── CourseReviewPage ───────────────────────────────────────
const CourseReviewPage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { userData } = useUserStore();

    const [course, setCourse] = useState<CourseReviewDto | null>(null);
    const [sections, setSections] = useState<SectionDto[]>([]);
    const [lessonsBySection, setLessonsBySection] = useState<Record<string, LessonDto[]>>({});
    const [loading, setLoading] = useState(true);
    const [claimError, setClaimError] = useState<string | null>(null);

    const [selectedLesson, setSelectedLesson] = useState<{ lesson: LessonDto; index: string } | null>(null);

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (userData && userData.role !== "Moderator" && userData.role !== "Admin") {
            navigate("/");
        }
    }, [userData, navigate]);

    useEffect(() => {
        if (!courseId) return;
        const load = async () => {
            setLoading(true);

            // Пытаемся захватить курс
            const claimRes = await fetch(
                `${(await import("../../config")).API_URL}/moderation/courses/${courseId}/claim`,
                { method: "POST", headers: (await import("../../services/auth-storage.service")).authStorage.getAuthHeaders() }
            );

            if (!claimRes.ok) {
                if (claimRes.status === 409) {
                    // Курс занят — получаем инфо о кем
                    const reviewData = await moderationApi.getCourseForReview(courseId);
                    if (reviewData?.reviewerName) {
                        setClaimError(`Этот курс уже проверяется модератором ${reviewData.reviewerName}. Дождитесь завершения проверки.`);
                    } else {
                        setClaimError("Этот курс уже проверяется другим модератором.");
                    }
                    setCourse(reviewData);
                    setLoading(false);
                    return;
                }
            }

            const [reviewData, sectionsData] = await Promise.all([
                moderationApi.getCourseForReview(courseId),
                courseApi.getSections(courseId),
            ]);

            setCourse(reviewData);
            setSections(sectionsData);

            const lessonsMap: Record<string, LessonDto[]> = {};
            await Promise.all(sectionsData.map(async (s: SectionDto) => {
                const ls = await sectionApi.getLessonsBySection(s.id);
                lessonsMap[s.id] = ls;
            }));
            setLessonsBySection(lessonsMap);

            // Выбираем первый урок по умолчанию
            const firstSection = sectionsData[0];
            if (firstSection) {
                const firstLessons = lessonsMap[firstSection.id] ?? [];
                if (firstLessons[0]) {
                    setSelectedLesson({ lesson: firstLessons[0], index: "1.1" });
                }
            }

            setLoading(false);
        };
        void load();
    }, [courseId]);

    const handleBack = async () => {
        if (courseId && !claimError) await moderationApi.releaseCourse(courseId);
        navigate("/moderator");
    };

    const handleApprove = async () => {
        if (!courseId || !course) return;
        setActionLoading(true);
        await moderationApi.releaseCourse(courseId);
        const ok = await courseApi.approveCourse(courseId);
        if (ok) {
            message.success(`Курс «${course.title}» одобрен`);
            navigate("/moderator");
        } else {
            message.error("Ошибка при одобрении");
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!courseId || !course) return;
        setActionLoading(true);
        await moderationApi.releaseCourse(courseId);
        const ok = await courseApi.rejectCourse(courseId, rejectReason);
        if (ok) {
            message.success(`Курс «${course.title}» отклонён`);
            navigate("/moderator");
        } else {
            message.error("Ошибка при отклонении");
            setActionLoading(false);
        }
    };

    if (!userData) return <Spin />;
    if (userData.role !== "Moderator" && userData.role !== "Admin") return null;

    const totalLessons = Object.values(lessonsBySection).flat().length;

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />

            {loading ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Spin size="large" />
                </div>
            ) : !course ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Empty description="Курс не найден" />
                </div>
            ) : (
                <Layout style={{ flex: 1, overflow: "hidden" }}>
                    {/* ── Sidebar ── */}
                    <Sider
                        width={300}
                        style={{
                            background: "#fff",
                            borderRight: "1px solid #f0f0f0",
                            overflow: "auto",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Шапка сайдбара */}
                        <div style={{ padding: "16px 16px 0" }}>
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                onClick={handleBack}
                                size="small"
                                style={{ paddingLeft: 0, color: "#666", marginBottom: 12 }}
                            >
                                К очереди
                            </Button>

                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                                    <Tag color="processing" style={{ fontSize: 11 }}>На проверке</Tag>
                                    <Tag style={{ fontSize: 11 }}>{levelLabel[course.level] ?? course.level}</Tag>
                                    {course.reviewCount > 1 && (
                                        <Tag color="orange" style={{ fontSize: 11 }}>#{course.reviewCount}</Tag>
                                    )}
                                </div>
                                <Text strong style={{ fontSize: 14, display: "block", lineHeight: 1.4 }}>
                                    {course.title}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {course.authorName ?? "—"}
                                </Text>
                            </div>

                            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {sections.length} разд. · {totalLessons} уроков
                                </Text>
                            </div>

                            {/* Кнопки действий */}
                            {!claimError && (
                                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                                    <Button
                                        danger size="small" icon={<CloseOutlined />}
                                        style={{ flex: 1 }}
                                        onClick={() => { setRejectReason(""); setRejectModalOpen(true); }}
                                        loading={actionLoading}
                                    >
                                        Отклонить
                                    </Button>
                                    <Button
                                        type="primary" size="small" icon={<CheckOutlined />}
                                        style={{ flex: 1, background: "rgba(0,100,0,0.8)" }}
                                        onClick={handleApprove}
                                        loading={actionLoading}
                                    >
                                        Одобрить
                                    </Button>
                                </div>
                            )}

                            <Divider style={{ margin: "0 0 8px" }} />
                        </div>

                        {/* Курс — инфо */}
                        <div style={{ padding: "0 16px 12px" }}>
                            <div
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: 6,
                                    cursor: "pointer",
                                    background: !selectedLesson ? "#f0f5ff" : "transparent",
                                    marginBottom: 4,
                                }}
                                onClick={() => setSelectedLesson(null)}
                            >
                                <Text strong style={{ fontSize: 13 }}>📋 Информация о курсе</Text>
                            </div>
                        </div>

                        <Divider style={{ margin: "0 0 4px" }} />

                        {/* Разделы и уроки */}
                        <div style={{ padding: "4px 0 16px", overflow: "auto", flex: 1 }}>
                            {sections.map((section, si) => (
                                <div key={section.id}>
                                    <div style={{ padding: "8px 16px 4px" }}>
                                        <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                            {si + 1}. {section.title}
                                        </Text>
                                    </div>

                                    {(lessonsBySection[section.id] ?? []).map((lesson, li) => {
                                        const index = `${si + 1}.${li + 1}`;
                                        const isActive = selectedLesson?.lesson.id === lesson.id;
                                        return (
                                            <div
                                                key={lesson.id}
                                                onClick={() => setSelectedLesson({ lesson, index })}
                                                style={{
                                                    padding: "8px 16px 8px 28px",
                                                    cursor: "pointer",
                                                    background: isActive ? "#f0f5ff" : "transparent",
                                                    borderLeft: isActive ? "3px solid #52c41a" : "3px solid transparent",
                                                    display: "flex", alignItems: "center", gap: 8,
                                                    transition: "background 0.15s",
                                                }}
                                            >
                                                <FileTextOutlined style={{ fontSize: 12, color: isActive ? "#52c41a" : "#bbb", flexShrink: 0 }} />
                                                <div style={{ minWidth: 0 }}>
                                                    <Text style={{
                                                        fontSize: 13, display: "block",
                                                        color: isActive ? "#000" : "#333",
                                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                                    }}>
                                                        {lesson.title}
                                                    </Text>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {(lessonsBySection[section.id] ?? []).length === 0 && (
                                        <div style={{ padding: "4px 16px 4px 28px" }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Нет уроков</Text>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {sections.length === 0 && (
                                <div style={{ padding: "16px", textAlign: "center" }}>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Разделов нет</Text>
                                </div>
                            )}
                        </div>
                    </Sider>

                    {/* ── Основной контент ── */}
                    <Content style={{ overflow: "auto", background: "#fafafa" }}>
                        <div style={{ padding: "40px 56px", maxWidth: 860, margin: "0 auto" }}>

                            {/* Предупреждение о захвате */}
                            {claimError && (
                                <Alert
                                    type="warning"
                                    showIcon
                                    icon={<LockOutlined />}
                                    message="Курс недоступен для проверки"
                                    description={claimError}
                                    style={{ marginBottom: 24 }}
                                />
                            )}

                            {/* Информация о курсе */}
                            {!selectedLesson ? (
                                <div>
                                    <Title level={2} style={{ margin: "0 0 8px" }}>{course.title}</Title>
                                    <Text type="secondary" style={{ fontSize: 14 }}>
                                        Автор: <strong>{course.authorName ?? "—"}</strong>
                                        {course.submittedAt && (
                                            <> · Отправлен {new Date(course.submittedAt).toLocaleDateString("ru-RU")}</>
                                        )}
                                    </Text>

                                    <div style={{ display: "flex", gap: 8, margin: "16px 0", flexWrap: "wrap" }}>
                                        <Tag>{levelLabel[course.level] ?? course.level}</Tag>
                                        <Tag>{course.price === 0 ? "Бесплатно" : `${course.price} ₽`}</Tag>
                                        {course.certificateEnabled && <Tag color="gold">Сертификат</Tag>}
                                        {course.reviewCount > 1 && <Tag color="orange">Повторная проверка #{course.reviewCount}</Tag>}
                                    </div>

                                    {course.coverImageUrl && (
                                        <img src={course.coverImageUrl} alt={course.title}
                                             style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 12, marginBottom: 32 }} />
                                    )}

                                    <div style={{ marginBottom: 24 }}>
                                        <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
                                            Краткое описание
                                        </Text>
                                        <Paragraph style={{ fontSize: 15, marginBottom: 0 }}>{course.description}</Paragraph>
                                    </div>

                                    {course.fullDescription && (
                                        <div style={{ marginBottom: 24 }}>
                                            <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
                                                Полное описание
                                            </Text>
                                            <Paragraph style={{ fontSize: 14, marginBottom: 0 }}>{course.fullDescription}</Paragraph>
                                        </div>
                                    )}

                                    {course.tags.length > 0 && (
                                        <div style={{ marginBottom: 24 }}>
                                            <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
                                                Теги
                                            </Text>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                {course.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                                            </div>
                                        </div>
                                    )}

                                    <Divider />

                                    <div>
                                        <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 12 }}>
                                            Структура курса
                                        </Text>
                                        {sections.map((section, si) => (
                                            <div key={section.id} style={{ marginBottom: 16 }}>
                                                <Text strong style={{ display: "block", marginBottom: 6 }}>
                                                    {si + 1}. {section.title}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 6 }}>
                                                    {section.description}
                                                </Text>
                                                {(lessonsBySection[section.id] ?? []).map((lesson, li) => (
                                                    <div
                                                        key={lesson.id}
                                                        style={{
                                                            padding: "8px 12px", borderRadius: 6,
                                                            background: "#fff", border: "1px solid #f0f0f0",
                                                            marginBottom: 4, cursor: "pointer",
                                                            display: "flex", alignItems: "center", gap: 8,
                                                        }}
                                                        onClick={() => setSelectedLesson({ lesson, index: `${si + 1}.${li + 1}` })}
                                                    >
                                                        <FileTextOutlined style={{ color: "#bbb", fontSize: 12 }} />
                                                        <Text style={{ fontSize: 13 }}>{lesson.title}</Text>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                    {!claimError && (
                                        <>
                                            <Divider />
                                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <Button danger icon={<CloseOutlined />}
                                                        onClick={() => { setRejectReason(""); setRejectModalOpen(true); }}
                                                        loading={actionLoading}>
                                                    Отклонить
                                                </Button>
                                                <Button type="primary" icon={<CheckOutlined />}
                                                        style={{ background: "rgba(0,100,0,0.8)" }}
                                                        onClick={handleApprove} loading={actionLoading}>
                                                    Одобрить курс
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <LessonContent
                                    key={selectedLesson.lesson.id}
                                    lesson={selectedLesson.lesson}
                                    index={selectedLesson.index}
                                />
                            )}
                        </div>
                    </Content>
                </Layout>
            )}

            {/* Модалка отклонения */}
            <Modal
                open={rejectModalOpen}
                title={`Отклонить курс «${course?.title}»`}
                onCancel={() => setRejectModalOpen(false)}
                onOk={handleReject}
                okText="Отклонить" cancelText="Отмена"
                okButtonProps={{ danger: true, loading: actionLoading }}
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
        </div>
    );
};

export default CourseReviewPage;
