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
    EditOutlined,
    FileTextOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "../../components/Header.tsx";
import { courseApi } from "../../api/courseApi.ts";
import { moderationApi } from "../../api/moderationApi.ts";
import { sectionApi } from "../../api/sectionApi.ts";
import { taskTeacherApi } from "../../api/taskTeacherApi.ts";
import { useUserStore } from "../../stores/userStore.ts";
import { markdownComponents } from "../../components/markdownComponents.tsx";
import { API_URL } from "../../config.ts";
import { authStorage } from "../../services/auth-storage.service.ts";
import type { CourseReviewDto } from "../../api/moderationApi.ts";
import type { SectionDto, LessonDto } from "../../api/types/course.ts";
import type { TaskTeacherDto } from "../../api/taskTeacherApi.ts";
import type { CourseDraftDto, DraftSectionDto, DraftLessonDto } from "../../api/courseDraftApi.ts";

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

// ─── API черновиков для модератора ───────────────────────────
const draftModerationApi = {
    approveDraft: async (draftId: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/moderation/drafts/${draftId}/approve`, {
                method: "PUT", headers: authStorage.getAuthHeaders(),
            });
            return res.ok;
        } catch { return false; }
    },
    rejectDraft: async (draftId: string, reason?: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/moderation/drafts/${draftId}/reject`, {
                method: "PUT",
                headers: { ...authStorage.getAuthHeaders(), "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            });
            return res.ok;
        } catch { return false; }
    },
};

// ─── LessonContent (обычный урок) ────────────────────────────
const LessonContent = ({ lesson, index }: { lesson: LessonDto; index: string }) => {
    const [tasks, setTasks] = useState<TaskTeacherDto[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    useEffect(() => {
        taskTeacherApi.getLessonTasks(lesson.id).then((data) => {
            setTasks(data);
            setLoadingTasks(false);
        });
    }, [lesson.id]);

    return <LessonView title={lesson.title} description={lesson.description}
                       content={lesson.content} index={index} tasks={tasks} loadingTasks={loadingTasks} />;
};

// ─── DraftLessonContent (урок из черновика) ──────────────────
const DraftLessonContent = ({ lesson, index }: { lesson: DraftLessonDto; index: string }) => {
    const tasks: TaskTeacherDto[] = (lesson.tasks ?? []).map((t) => ({
        id: t.id,
        lessonId: lesson.id,
        type: t.type as TaskTeacherDto["type"],
        question: t.question,
        options: t.options ?? undefined,
        correctIndex: t.correctIndex ?? undefined,
        correctIndexes: t.correctIndexes ?? undefined,
        correctAnswer: t.correctAnswer ?? undefined,
        explanation: t.explanation ?? undefined,
        hints: [],
        points: t.points,
        isRequired: t.isRequired,
        orderIndex: t.orderIndex,
        createdAt: "",
    }));

    return <LessonView title={lesson.title} description={lesson.description}
                       content={lesson.content} index={index} tasks={tasks} loadingTasks={false} />;
};

// ─── LessonView (общий рендер) ───────────────────────────────
const LessonView = ({ title, description, content, index, tasks, loadingTasks }: {
    title: string;
    description: string;
    content?: string | null;
    index: string;
    tasks: TaskTeacherDto[];
    loadingTasks: boolean;
}) => (
    <div>
        <div style={{ marginBottom: 24 }}>
            <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Урок {index}
            </Text>
            <Title level={3} style={{ margin: "4px 0 8px" }}>{title}</Title>
            <Text type="secondary">{description}</Text>
        </div>

        {content ? (
            <div style={{ marginBottom: 32 }}>
                <div className="markdown-preview">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {content}
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
            <Text strong style={{ fontSize: 14, display: "block", marginBottom: 16 }}>Задания к уроку</Text>
            {loadingTasks ? <Spin size="small" /> : tasks.length === 0 ? (
                <Text type="secondary">Заданий нет</Text>
            ) : (
                tasks.map((task, ti) => (
                    <div key={task.id} style={{
                        border: "1px solid #f0f0f0", borderRadius: 8,
                        padding: "16px 20px", marginBottom: 12, background: "#fff",
                    }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                            <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, minWidth: 20 }}>{ti + 1}.</Text>
                            <Tag style={{ fontSize: 11, margin: 0 }}>{taskTypeLabel[task.type] ?? task.type}</Tag>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                {task.points} {task.points === 1 ? "очко" : "очков"}
                                {" · "}{task.isRequired ? "Обязательное" : "Необязательное"}
                            </Text>
                        </div>

                        <Text strong style={{ fontSize: 14, display: "block", marginBottom: 12 }}>{task.question}</Text>

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
                                <Text style={{ fontSize: 13 }}>Правильный ответ: <strong>{task.correctAnswer}</strong></Text>
                            </div>
                        )}

                        {task.explanation && (
                            <div style={{ padding: "7px 12px", borderRadius: 6, background: "#e6f7ff", border: "1px solid #91d5ff" }}>
                                <Text style={{ fontSize: 12, color: "#1890ff" }}>💡 {task.explanation}</Text>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    </div>
);

// ─── CourseReviewPage ───────────────────────────────────────
const CourseReviewPage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [searchParams] = useSearchParams();
    const draftId = searchParams.get("draftId"); // если есть — режим черновика
    const navigate = useNavigate();
    const { userData } = useUserStore();

    // Обычный курс
    const [course, setCourse] = useState<CourseReviewDto | null>(null);
    const [sections, setSections] = useState<SectionDto[]>([]);
    const [lessonsBySection, setLessonsBySection] = useState<Record<string, LessonDto[]>>({});
    const [claimError, setClaimError] = useState<string | null>(null);

    // Черновик
    const [draft, setDraft] = useState<CourseDraftDto | null>(null);

    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState<{ lesson: LessonDto | DraftLessonDto; index: string } | null>(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (userData && userData.role !== "Moderator" && userData.role !== "Admin") navigate("/");
    }, [userData, navigate]);

    useEffect(() => {
        if (!courseId) return;

        const loadDraft = async () => {
            setLoading(true);
            const res = await fetch(`${API_URL}/moderation/drafts/${draftId}`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (res.ok) {
                const data: CourseDraftDto = await res.json();
                setDraft(data);
                // Выбираем первый урок первого раздела
                const firstSection = data.sections?.[0];
                const firstLesson = firstSection?.lessons?.[0];
                if (firstLesson) setSelectedLesson({ lesson: firstLesson, index: "1.1" });
            }
            setLoading(false);
        };

        const loadCourse = async () => {
            setLoading(true);

            const claimRes = await fetch(
                `${API_URL}/moderation/courses/${courseId}/claim`,
                { method: "POST", headers: authStorage.getAuthHeaders() }
            );

            if (!claimRes.ok && claimRes.status === 409) {
                const reviewData = await moderationApi.getCourseForReview(courseId);
                if (reviewData?.reviewerName) {
                    setClaimError(`Этот курс уже проверяется модератором ${reviewData.reviewerName}.`);
                } else {
                    setClaimError("Этот курс уже проверяется другим модератором.");
                }
                setCourse(reviewData);
                setLoading(false);
                return;
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

            const firstLesson = lessonsMap[sectionsData[0]?.id]?.[0];
            if (firstLesson) setSelectedLesson({ lesson: firstLesson, index: "1.1" });

            setLoading(false);
        };

        if (draftId) { void loadDraft(); } else { void loadCourse(); }
    }, [courseId, draftId]);

    const handleBack = async () => {
        if (!draftId && courseId && !claimError) await moderationApi.releaseCourse(courseId);
        navigate("/moderator");
    };

    const handleApprove = async () => {
        if (draftId) {
            setActionLoading(true);
            const ok = await draftModerationApi.approveDraft(draftId);
            if (ok) { message.success("Изменения одобрены и применены к курсу"); navigate("/moderator"); }
            else { message.error("Ошибка при одобрении"); setActionLoading(false); }
        } else {
            if (!courseId || !course) return;
            setActionLoading(true);
            const ok = await courseApi.approveCourse(courseId);
            if (ok) { message.success(`Курс «${course.title}» одобрен`); navigate("/moderator"); }
            else { message.error("Ошибка при одобрении"); setActionLoading(false); }
        }
    };

    const handleReject = async () => {
        if (draftId) {
            setActionLoading(true);
            const ok = await draftModerationApi.rejectDraft(draftId, rejectReason);
            if (ok) { message.success("Изменения отклонены"); navigate("/moderator"); }
            else { message.error("Ошибка при отклонении"); setActionLoading(false); }
        } else {
            if (!courseId || !course) return;
            setActionLoading(true);
            const ok = await courseApi.rejectCourse(courseId, rejectReason);
            if (ok) { message.success(`Курс «${course.title}» отклонён`); navigate("/moderator"); }
            else { message.error("Ошибка при отклонении"); setActionLoading(false); }
        }
    };

    if (!userData) return <Spin />;
    if (userData.role !== "Moderator" && userData.role !== "Admin") return null;

    // Данные для рендера — либо из черновика либо из курса
    const isDraft = !!draftId && !!draft;
    const displayTitle = isDraft ? draft.title : (course?.title ?? "");
    const displaySections: (SectionDto | DraftSectionDto)[] = isDraft ? (draft.sections ?? []) : sections;
    const totalLessons = isDraft
        ? (draft.sections ?? []).reduce((acc, s) => acc + (s.lessons?.length ?? 0), 0)
        : Object.values(lessonsBySection).flat().length;

    const getLessons = (section: SectionDto | DraftSectionDto): (LessonDto | DraftLessonDto)[] =>
        isDraft
            ? ((section as DraftSectionDto).lessons ?? [])
            : (lessonsBySection[(section as SectionDto).id] ?? []);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />

            {loading ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Spin size="large" />
                </div>
            ) : (!isDraft && !course) ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Empty description="Курс не найден" />
                </div>
            ) : (
                <Layout style={{ flex: 1, overflow: "hidden" }}>
                    {/* ── Sidebar ── */}
                    <Sider width={300} style={{
                        background: "#fff", borderRight: "1px solid #f0f0f0",
                        overflow: "auto", display: "flex", flexDirection: "column",
                    }}>
                        <div style={{ padding: "16px 16px 0" }}>
                            <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}
                                    size="small" style={{ paddingLeft: 0, color: "#666", marginBottom: 12 }}>
                                К очереди
                            </Button>

                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                                    {isDraft
                                        ? <Tag icon={<EditOutlined />} color="warning" style={{ fontSize: 11 }}>Изменения курса</Tag>
                                        : <Tag color="processing" style={{ fontSize: 11 }}>На проверке</Tag>
                                    }
                                    <Tag style={{ fontSize: 11 }}>
                                        {levelLabel[isDraft ? draft.level : (course?.level ?? "")] ?? (isDraft ? draft.level : course?.level)}
                                    </Tag>
                                    {!isDraft && course && course.reviewCount > 1 && (
                                        <Tag color="orange" style={{ fontSize: 11 }}>#{course.reviewCount}</Tag>
                                    )}
                                </div>
                                <Text strong style={{ fontSize: 14, display: "block", lineHeight: 1.4 }}>{displayTitle}</Text>
                                {!isDraft && course && (
                                    <Text type="secondary" style={{ fontSize: 12 }}>{course.authorName ?? "—"}</Text>
                                )}
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {displaySections.length} разд. · {totalLessons} уроков
                                </Text>
                            </div>

                            {!claimError && (
                                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                                    <Button danger size="small" icon={<CloseOutlined />}
                                            style={{ flex: 1 }}
                                            onClick={() => { setRejectReason(""); setRejectModalOpen(true); }}
                                            loading={actionLoading}>
                                        Отклонить
                                    </Button>
                                    <Button type="primary" size="small" icon={<CheckOutlined />}
                                            style={{ flex: 1, background: "rgba(0,100,0,0.8)" }}
                                            onClick={handleApprove} loading={actionLoading}>
                                        Одобрить
                                    </Button>
                                </div>
                            )}

                            <Divider style={{ margin: "0 0 8px" }} />
                        </div>

                        <div style={{ padding: "0 16px 12px" }}>
                            <div style={{
                                padding: "10px 12px", borderRadius: 6, cursor: "pointer",
                                background: !selectedLesson ? "#f0f5ff" : "transparent", marginBottom: 4,
                            }} onClick={() => setSelectedLesson(null)}>
                                <Text strong style={{ fontSize: 13 }}>📋 Информация о курсе</Text>
                            </div>
                        </div>

                        <Divider style={{ margin: "0 0 4px" }} />

                        <div style={{ padding: "4px 0 16px", overflow: "auto", flex: 1 }}>
                            {displaySections.map((section, si) => (
                                <div key={section.id}>
                                    <div style={{ padding: "8px 16px 4px" }}>
                                        <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                            {si + 1}. {section.title}
                                        </Text>
                                    </div>
                                    {getLessons(section).map((lesson, li) => {
                                        const index = `${si + 1}.${li + 1}`;
                                        const isActive = selectedLesson?.lesson.id === lesson.id;
                                        return (
                                            <div key={lesson.id}
                                                 onClick={() => setSelectedLesson({ lesson, index })}
                                                 style={{
                                                     padding: "8px 16px 8px 28px", cursor: "pointer",
                                                     background: isActive ? "#f0f5ff" : "transparent",
                                                     borderLeft: isActive ? "3px solid #52c41a" : "3px solid transparent",
                                                     display: "flex", alignItems: "center", gap: 8,
                                                     transition: "background 0.15s",
                                                 }}>
                                                <FileTextOutlined style={{ fontSize: 12, color: isActive ? "#52c41a" : "#bbb", flexShrink: 0 }} />
                                                <Text style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {lesson.title}
                                                </Text>
                                            </div>
                                        );
                                    })}
                                    {getLessons(section).length === 0 && (
                                        <div style={{ padding: "4px 16px 4px 28px" }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Нет уроков</Text>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {displaySections.length === 0 && (
                                <div style={{ padding: 16, textAlign: "center" }}>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Разделов нет</Text>
                                </div>
                            )}
                        </div>
                    </Sider>

                    {/* ── Основной контент ── */}
                    <Content style={{ overflow: "auto", background: "#fafafa" }}>
                        <div style={{ padding: "40px 56px", maxWidth: 860, margin: "0 auto" }}>

                            {claimError && (
                                <Alert type="warning" showIcon icon={<LockOutlined />}
                                       message="Курс недоступен для проверки"
                                       description={claimError} style={{ marginBottom: 24 }} />
                            )}

                            {isDraft && (
                                <Alert type="info" showIcon icon={<EditOutlined />}
                                       message="Изменения опубликованного курса"
                                       description="Это обновления к уже опубликованному курсу. Студенты видят текущую версию. После одобрения изменения применятся автоматически."
                                       style={{ marginBottom: 24 }} />
                            )}

                            {!selectedLesson ? (
                                // ── Информация о курсе ──
                                <div>
                                    <Title level={2} style={{ margin: "0 0 8px" }}>{displayTitle}</Title>
                                    {!isDraft && course && (
                                        <Text type="secondary" style={{ fontSize: 14 }}>
                                            Автор: <strong>{course.authorName ?? "—"}</strong>
                                            {course.submittedAt && <> · Отправлен {new Date(course.submittedAt).toLocaleDateString("ru-RU")}</>}
                                        </Text>
                                    )}

                                    <div style={{ display: "flex", gap: 8, margin: "16px 0", flexWrap: "wrap" }}>
                                        <Tag>{levelLabel[isDraft ? draft!.level : (course?.level ?? "")] ?? ""}</Tag>
                                        <Tag>{(isDraft ? draft!.price : course?.price) === 0 ? "Бесплатно" : `${isDraft ? draft!.price : course?.price} ₽`}</Tag>
                                        {(isDraft ? draft!.certificateEnabled : course?.certificateEnabled) && <Tag color="gold">Сертификат</Tag>}
                                        {!isDraft && course && course.reviewCount > 1 && <Tag color="orange">Повторная проверка #{course.reviewCount}</Tag>}
                                    </div>

                                    {(isDraft ? draft!.coverImageUrl : course?.coverImageUrl) && (
                                        <img src={isDraft ? draft!.coverImageUrl! : course!.coverImageUrl!}
                                             alt={displayTitle}
                                             style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 12, marginBottom: 32 }} />
                                    )}

                                    <div style={{ marginBottom: 24 }}>
                                        <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
                                            Краткое описание
                                        </Text>
                                        <Paragraph style={{ fontSize: 15, marginBottom: 0 }}>
                                            {isDraft ? draft!.description : course?.description}
                                        </Paragraph>
                                    </div>

                                    {(isDraft ? draft!.fullDescription : course?.fullDescription) && (
                                        <div style={{ marginBottom: 24 }}>
                                            <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
                                                Полное описание
                                            </Text>
                                            <Paragraph style={{ fontSize: 14, marginBottom: 0 }}>
                                                {isDraft ? draft!.fullDescription : course?.fullDescription}
                                            </Paragraph>
                                        </div>
                                    )}

                                    {(isDraft ? draft!.tags : course?.tags ?? []).length > 0 && (
                                        <div style={{ marginBottom: 24 }}>
                                            <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>
                                                Теги
                                            </Text>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                {(isDraft ? draft!.tags : course?.tags ?? []).map((t) => <Tag key={t}>{t}</Tag>)}
                                            </div>
                                        </div>
                                    )}

                                    <Divider />

                                    <div>
                                        <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 12 }}>
                                            Структура курса
                                        </Text>
                                        {displaySections.map((section, si) => (
                                            <div key={section.id} style={{ marginBottom: 16 }}>
                                                <Text strong style={{ display: "block", marginBottom: 6 }}>
                                                    {si + 1}. {section.title}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 6 }}>
                                                    {section.description}
                                                </Text>
                                                {getLessons(section).map((lesson, li) => (
                                                    <div key={lesson.id} style={{
                                                        padding: "8px 12px", borderRadius: 6,
                                                        background: "#fff", border: "1px solid #f0f0f0",
                                                        marginBottom: 4, cursor: "pointer",
                                                        display: "flex", alignItems: "center", gap: 8,
                                                    }} onClick={() => setSelectedLesson({ lesson, index: `${si + 1}.${li + 1}` })}>
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
                                                    {isDraft ? "Одобрить изменения" : "Одобрить курс"}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                // ── Урок ──
                                isDraft
                                    ? <DraftLessonContent key={selectedLesson.lesson.id}
                                                          lesson={selectedLesson.lesson as DraftLessonDto}
                                                          index={selectedLesson.index} />
                                    : <LessonContent key={selectedLesson.lesson.id}
                                                     lesson={selectedLesson.lesson as LessonDto}
                                                     index={selectedLesson.index} />
                            )}
                        </div>
                    </Content>
                </Layout>
            )}

            <Modal open={rejectModalOpen}
                   title={isDraft ? "Отклонить изменения курса" : `Отклонить курс «${course?.title}»`}
                   onCancel={() => setRejectModalOpen(false)}
                   onOk={handleReject}
                   okText="Отклонить" cancelText="Отмена"
                   okButtonProps={{ danger: true, loading: actionLoading }}
                   centered>
                <div style={{ marginTop: 8 }}>
                    <Text style={{ display: "block", marginBottom: 8 }}>Укажите причину (необязательно):</Text>
                    <Input.TextArea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Например: некорректные изменения, нарушение правил..." />
                </div>
            </Modal>
        </div>
    );
};

export default CourseReviewPage;