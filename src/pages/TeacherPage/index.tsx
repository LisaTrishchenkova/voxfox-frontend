import {
    Alert,
    Button,
    Checkbox,
    Col,
    Collapse,
    Divider,
    Empty,
    Form,
    Input,
    InputNumber,
    Layout,
    Modal,
    Pagination,
    Popconfirm,
    Radio,
    Row,
    Select,
    Space,
    Spin,
    Switch,
    Tag,
    Tooltip,
    Typography,
    message,
} from "antd";
import {
    BookOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    FileTextOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    SendOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import MarkdownEditor from "../../components/MarkdownEditor.tsx";
import { courseApi } from "../../api/courseApi.ts";
import { sectionApi } from "../../api/sectionApi.ts";
import { lessonApi } from "../../api/lessonApi.ts";
import { taskTeacherApi } from "../../api/taskTeacherApi.ts";
import { useUserStore } from "../../stores/userStore.ts";
import { API_URL } from "../../config.ts";
import { authStorage } from "../../services/auth-storage.service.ts";
import type {
    CourseDto,
    CourseStatus,
    SectionDto,
    LessonDto,
    CourseLevel,
    CategoryDto,
    TagsDto,
} from "../../api/types/course.ts";
import type { TaskType } from "../../api/types/task.ts";
import type { TaskTeacherDto } from "../../api/taskTeacherApi.ts";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

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
const levelLabel: Record<string, string> = {
    Beginner: "Начинающий",
    Intermediate: "Средний",
    Advanced: "Продвинутый",
};
const taskTypeLabel: Record<TaskType, string> = {
    SingleChoice: "Одиночный выбор",
    MultiChoice: "Множественный выбор",
    TextInput: "Текстовый ответ",
};

const PAGE_SIZE = 9;

interface CourseFormValues {
    title: string;
    description: string;
    fullDescription?: string;
    price?: number;
    level?: CourseLevel;
    certificateEnabled?: boolean;
    categoryId?: string;
    coverImageUrl?: string;
}
interface SectionFormValues { title: string; description: string; }
interface LessonFormValues { title: string; description: string; }
interface TaskFormValues {
    question: string;
    correctIndex?: number;
    correctIndexes?: number[];
    correctAnswer?: string;
    explanation?: string;
    points?: number;
    isRequired?: boolean;
}

// ─── CourseForm ─────────────────────────────────────────────
const CourseForm = ({
                        form, categories, initialTags = [], onFinish, onCancel, submitLabel, loading,
                    }: {
    form: ReturnType<typeof Form.useForm<CourseFormValues>>[0];
    categories: CategoryDto[];
    initialTags?: string[];
    onFinish: (values: CourseFormValues, tags: string[]) => void;
    onCancel: () => void;
    submitLabel: string;
    loading: boolean;
}) => {
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>(initialTags);

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) setTags((p) => [...p, t]);
        setTagInput("");
    };

    return (
        <Form form={form} layout="vertical" onFinish={(values) => onFinish(values, tags)}>
            <Row gutter={16}>
                <Col span={16}>
                    <Form.Item label="Название" name="title"
                               rules={[{ required: true, message: "Введите название" }, { min: 2 }, { max: 200 }]}>
                        <Input placeholder="Название курса" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Уровень" name="level" initialValue="Beginner">
                        <Select>
                            <Select.Option value="Beginner">Начинающий</Select.Option>
                            <Select.Option value="Intermediate">Средний</Select.Option>
                            <Select.Option value="Advanced">Продвинутый</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Краткое описание" name="description"
                       rules={[{ required: true, message: "Введите описание" }, { min: 10 }, { max: 500 }]}>
                <Input.TextArea rows={2} placeholder="До 500 символов" />
            </Form.Item>
            <Form.Item label="Полное описание" name="fullDescription">
                <Input.TextArea rows={4} placeholder="Подробно: что узнают студенты, требования, программа..." />
            </Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Категория" name="categoryId">
                        <Select placeholder="Выберите категорию" allowClear>
                            {categories.map((c) => (
                                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Цена (0 = бесплатно)" name="price" initialValue={0}>
                        <InputNumber min={0} max={1000000} style={{ width: "100%" }} addonAfter="₽" />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Ссылка на обложку" name="coverImageUrl"
                       extra="Прямая ссылка на изображение (jpg, png, webp)">
                <Input placeholder="https://..." />
            </Form.Item>
            <Form.Item label="Теги">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {tags.length === 0
                        ? <Text type="secondary" style={{ fontSize: 12 }}>Теги не добавлены</Text>
                        : tags.map((t) => (
                            <Tag key={t} closable onClose={() => setTags((p) => p.filter((x) => x !== t))} color="green">{t}</Tag>
                        ))}
                </div>
                <Space>
                    <Input size="small" placeholder="Новый тег" value={tagInput}
                           onChange={(e) => setTagInput(e.target.value)}
                           onPressEnter={(e) => { e.preventDefault(); addTag(); }}
                           style={{ width: 180 }} />
                    <Button size="small" icon={<PlusOutlined />} onClick={addTag}>Добавить</Button>
                </Space>
            </Form.Item>
            <Form.Item label="Выдавать сертификат по завершении"
                       name="certificateEnabled" valuePropName="checked" initialValue={false}>
                <Switch />
            </Form.Item>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Button onClick={onCancel}>Отмена</Button>
                <Button type="primary" htmlType="submit" loading={loading}
                        style={{ background: "rgba(0,100,0,0.8)" }}>
                    {submitLabel}
                </Button>
            </div>
        </Form>
    );
};

// ─── TaskForm ────────────────────────────────────────────────
const TaskForm = ({ lessonId, onCreated, onCancel }: {
    lessonId: string;
    onCreated: (task: TaskTeacherDto) => void;
    onCancel: () => void;
}) => {
    const [form] = Form.useForm<TaskFormValues>();
    const [taskType, setTaskType] = useState<TaskType>("SingleChoice");
    const [options, setOptions] = useState<string[]>(["", ""]);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (values: TaskFormValues) => {
        setSaving(true);
        let result: TaskTeacherDto | null = null;
        if (taskType === "SingleChoice") {
            if (values.correctIndex == null) { message.error("Выберите правильный ответ"); setSaving(false); return; }
            result = await taskTeacherApi.createSingleChoice(lessonId, {
                question: values.question, options, correctIndex: values.correctIndex,
                explanation: values.explanation, points: values.points ?? 1, isRequired: values.isRequired ?? true,
            });
        } else if (taskType === "MultiChoice") {
            if (!values.correctIndexes?.length) { message.error("Выберите хотя бы один правильный ответ"); setSaving(false); return; }
            result = await taskTeacherApi.createMultiChoice(lessonId, {
                question: values.question, options, correctIndexes: values.correctIndexes,
                explanation: values.explanation, points: values.points ?? 1, isRequired: values.isRequired ?? true,
            });
        } else {
            result = await taskTeacherApi.createTextInput(lessonId, {
                question: values.question, correctAnswer: values.correctAnswer ?? "",
                explanation: values.explanation, points: values.points ?? 1, isRequired: values.isRequired ?? true,
            });
        }
        if (result) { message.success("Задание создано"); onCreated(result); form.resetFields(); setOptions(["", ""]); }
        else { message.error("Ошибка при создании задания"); }
        setSaving(false);
    };

    return (
        <div style={{ background: "#f0fff4", borderRadius: 8, padding: 20, marginTop: 12, border: "1px solid #b7eb8f" }}>
            <Text strong style={{ color: "#389e0d" }}>Новое задание</Text>
            <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 12 }}>
                <Form.Item label="Тип задания">
                    <Select value={taskType} onChange={setTaskType} style={{ width: 240 }}>
                        <Select.Option value="SingleChoice">Одиночный выбор</Select.Option>
                        <Select.Option value="MultiChoice">Множественный выбор</Select.Option>
                        <Select.Option value="TextInput">Текстовый ответ</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Вопрос" name="question"
                           rules={[{ required: true, message: "Введите вопрос" }, { min: 5 }]}>
                    <Input.TextArea rows={2} placeholder="Введите вопрос..." />
                </Form.Item>
                {(taskType === "SingleChoice" || taskType === "MultiChoice") && (
                    <Form.Item label="Варианты ответов">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            {options.map((opt, i) => (
                                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <Input value={opt} onChange={(e) => setOptions((p) => p.map((o, idx) => idx === i ? e.target.value : o))}
                                           placeholder={`Вариант ${i + 1}`} style={{ flex: 1 }} />
                                    {options.length > 2 && (
                                        <Button size="small" danger icon={<DeleteOutlined />}
                                                onClick={() => setOptions((p) => p.filter((_, idx) => idx !== i))} />
                                    )}
                                </div>
                            ))}
                            <Button size="small" icon={<PlusOutlined />} onClick={() => setOptions((p) => [...p, ""])}>
                                Добавить вариант
                            </Button>
                        </Space>
                    </Form.Item>
                )}
                {taskType === "SingleChoice" && (
                    <Form.Item label="Правильный ответ" name="correctIndex">
                        <Radio.Group>
                            <Space direction="vertical">
                                {options.map((opt, i) => <Radio key={i} value={i}>{opt || `Вариант ${i + 1}`}</Radio>)}
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                )}
                {taskType === "MultiChoice" && (
                    <Form.Item label="Правильные ответы" name="correctIndexes">
                        <Checkbox.Group>
                            <Space direction="vertical">
                                {options.map((opt, i) => <Checkbox key={i} value={i}>{opt || `Вариант ${i + 1}`}</Checkbox>)}
                            </Space>
                        </Checkbox.Group>
                    </Form.Item>
                )}
                {taskType === "TextInput" && (
                    <Form.Item label="Правильный ответ" name="correctAnswer"
                               rules={[{ required: true, message: "Введите правильный ответ" }]}>
                        <Input placeholder="Правильный ответ..." />
                    </Form.Item>
                )}
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Очки" name="points" initialValue={1}>
                            <InputNumber min={1} max={100} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Обязательное" name="isRequired" valuePropName="checked" initialValue={true}>
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Объяснение (показывается после ответа)" name="explanation">
                    <Input.TextArea rows={2} placeholder="Необязательно..." />
                </Form.Item>
                <div style={{ display: "flex", gap: 8 }}>
                    <Button type="primary" htmlType="submit" loading={saving} style={{ background: "rgba(0,100,0,0.8)" }}>
                        Создать задание
                    </Button>
                    <Button onClick={onCancel}>Отмена</Button>
                </div>
            </Form>
        </div>
    );
};

// ─── LessonEditor ────────────────────────────────────────────
const LessonEditor = ({ lesson, sectionId, onSaved, onCancel }: {
    lesson: LessonDto | null;
    sectionId: string;
    onSaved: (lesson: LessonDto, isNew: boolean) => void;
    onCancel: () => void;
}) => {
    const [form] = Form.useForm<LessonFormValues>();
    const [content, setContent] = useState(lesson?.content ?? "");
    const [saving, setSaving] = useState(false);

    form.setFieldsValue({ title: lesson?.title ?? "", description: lesson?.description ?? "" });

    const handleSave = async (values: LessonFormValues) => {
        setSaving(true);
        const payload = { ...values, content };
        if (lesson) {
            const ok = await lessonApi.updateLesson(lesson.id, payload);
            if (ok) { message.success("Урок обновлён"); onSaved({ ...lesson, ...payload }, false); }
            else { message.error("Ошибка при сохранении"); }
        } else {
            const created = await lessonApi.createLesson(sectionId, payload);
            if (created) { message.success("Урок создан"); onSaved(created, true); }
            else { message.error("Ошибка при создании"); }
        }
        setSaving(false);
    };

    return (
        <div style={{ border: "2px solid #52c41a", borderRadius: 10, padding: 20, marginBottom: 12, background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Text strong style={{ fontSize: 15, color: "#389e0d" }}>
                    {lesson ? `✏️ Редактирование: ${lesson.title}` : "➕ Новый урок"}
                </Text>
                <Button size="small" icon={<CloseOutlined />} onClick={onCancel} type="text" danger>Отмена</Button>
            </div>
            <Form form={form} layout="vertical" onFinish={handleSave}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Название урока" name="title"
                                   rules={[{ required: true, message: "Введите название" }, { min: 2 }]}>
                            <Input placeholder="Название урока" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Краткое описание" name="description"
                                   rules={[{ required: true, message: "Введите описание" }, { min: 10, message: "Минимум 10 символов" }]}>
                            <Input placeholder="Краткое описание урока" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Содержимое урока (Markdown + видео)">
                    <MarkdownEditor value={content} onChange={setContent} minHeight={400} />
                </Form.Item>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <Button onClick={onCancel}>Отмена</Button>
                    <Button type="primary" htmlType="submit" loading={saving} icon={<CheckOutlined />}
                            style={{ background: "rgba(0,100,0,0.8)" }}>
                        {lesson ? "Сохранить урок" : "Создать урок"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

// ─── LessonPanel ─────────────────────────────────────────────
const LessonPanel = ({ lesson, sectionId, onDelete, onUpdated }: {
    lesson: LessonDto;
    sectionId: string;
    onDelete: (id: string) => void;
    onUpdated: (lesson: LessonDto) => void;
}) => {
    const [tasks, setTasks] = useState<TaskTeacherDto[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);

    const handleExpand = () => {
        if (!expanded) {
            setLoadingTasks(true);
            void taskTeacherApi.getLessonTasks(lesson.id).then((data) => {
                setTasks(data);
                setLoadingTasks(false);
            });
        }
        setExpanded((p) => !p);
    };

    if (editing) {
        return (
            <LessonEditor key={lesson.id} lesson={lesson} sectionId={sectionId}
                          onSaved={(updated) => { onUpdated(updated); setEditing(false); }}
                          onCancel={() => setEditing(false)} />
        );
    }

    return (
        <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, marginBottom: 8, background: "#fff" }}>
            <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                 onClick={handleExpand}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                    <FileTextOutlined style={{ color: "#52c41a", flexShrink: 0 }} />
                    <Text strong style={{ marginRight: 4 }}>{lesson.title}</Text>
                    <Text type="secondary" style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {lesson.description}
                    </Text>
                </div>
                <Space onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Редактировать урок">
                        <Button size="small" icon={<EditOutlined />}
                                onClick={() => { setEditing(true); setExpanded(false); }} />
                    </Tooltip>
                    <Popconfirm title="Удалить урок?" description="Все задания урока тоже будут удалены"
                                onConfirm={() => onDelete(lesson.id)}
                                okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}>
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            </div>
            {expanded && (
                <div style={{ padding: "0 16px 16px" }}>
                    <Divider style={{ margin: "8px 0" }} />
                    <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>Задания к уроку</Text>
                    {loadingTasks ? <Spin size="small" /> : (
                        <>
                            {tasks.length === 0
                                ? <Text type="secondary" style={{ fontSize: 13 }}>Заданий пока нет</Text>
                                : tasks.map((task) => (
                                    <div key={task.id} style={{
                                        padding: "10px 12px", background: "#fafafa", borderRadius: 6, marginBottom: 6,
                                        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                                    }}>
                                        <div>
                                            <Tag color="blue" style={{ fontSize: 11 }}>{taskTypeLabel[task.type]}</Tag>
                                            <Text style={{ fontSize: 13 }}>{task.question}</Text>
                                            <div style={{ marginTop: 4 }}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {task.points} очк. · {task.isRequired ? "Обязательное" : "Необязательное"}
                                                </Text>
                                            </div>
                                        </div>
                                        <Popconfirm title="Удалить задание?"
                                                    onConfirm={async () => {
                                                        const ok = await taskTeacherApi.deleteTask(task.id);
                                                        if (ok) { setTasks((p) => p.filter((t) => t.id !== task.id)); message.success("Задание удалено"); }
                                                    }}
                                                    okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}>
                                            <Button size="small" danger icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    </div>
                                ))
                            }
                            {showTaskForm
                                ? <TaskForm lessonId={lesson.id}
                                            onCreated={(t) => { setTasks((p) => [...p, t]); setShowTaskForm(false); }}
                                            onCancel={() => setShowTaskForm(false)} />
                                : <Button size="small" icon={<PlusOutlined />} style={{ marginTop: 8 }}
                                          onClick={() => setShowTaskForm(true)}>
                                    Добавить задание
                                </Button>
                            }
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── CourseEditor ─────────────────────────────────────────────
const CourseEditor = ({ course, categories, onBack, onUpdated }: {
    course: CourseDto;
    categories: CategoryDto[];
    onBack: () => void;
    onUpdated: (c: CourseDto) => void;
}) => {
    const [sections, setSections] = useState<SectionDto[]>([]);
    const [lessonsBySection, setLessonsBySection] = useState<Record<string, LessonDto[]>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<SectionDto | null>(null);
    const [sectionForm] = Form.useForm<SectionFormValues>();
    const [inlineLesson, setInlineLesson] = useState<{ sectionId: string } | null>(null);

    const [editCourseOpen, setEditCourseOpen] = useState(false);
    const [courseForm] = Form.useForm<CourseFormValues>();
    const [savingCourse, setSavingCourse] = useState(false);
    const [editCourseTags, setEditCourseTags] = useState<string[]>([]);
    const [editCourseKey, setEditCourseKey] = useState(0);

    useEffect(() => {
        const load = async () => {
            const data: SectionDto[] = await courseApi.getSections(course.id);
            setSections(data);
            const lessonsMap: Record<string, LessonDto[]> = {};
            await Promise.all(data.map(async (s) => {
                const ls = await sectionApi.getLessonsBySection(s.id);
                lessonsMap[s.id] = ls;
            }));
            setLessonsBySection(lessonsMap);
            setLoading(false);
        };
        void load();
    }, [course.id]);

    const handleSaveSection = async (values: SectionFormValues) => {
        if (editingSection) {
            const ok = await sectionApi.updateSection(editingSection.id, values);
            if (ok) { setSections((p) => p.map((s) => s.id === editingSection.id ? { ...s, ...values } : s)); message.success("Раздел обновлён"); }
            else { message.error("Ошибка"); }
        } else {
            const created = await sectionApi.createSection(course.id, values);
            if (created) {
                setSections((p) => [...p, created]);
                setLessonsBySection((p) => ({ ...p, [created.id]: [] }));
                message.success("Раздел создан");
            } else { message.error("Ошибка"); }
        }
        setSectionModalOpen(false);
    };

    const handleDeleteSection = async (id: string) => {
        const ok = await sectionApi.deleteSection(id);
        if (ok) { setSections((p) => p.filter((s) => s.id !== id)); message.success("Раздел удалён"); }
        else { message.error("Ошибка"); }
    };

    const handleLessonSaved = (lesson: LessonDto, isNew: boolean) => {
        if (!inlineLesson) return;
        const sid = inlineLesson.sectionId;
        setLessonsBySection((p) => ({
            ...p,
            [sid]: isNew ? [...(p[sid] ?? []), lesson] : (p[sid] ?? []).map((l) => l.id === lesson.id ? lesson : l),
        }));
        setInlineLesson(null);
    };

    const handleDeleteLesson = async (lessonId: string) => {
        const ok = await lessonApi.deleteLesson(lessonId);
        if (ok) {
            setLessonsBySection((p) => {
                const next = { ...p };
                for (const sid in next) next[sid] = next[sid].filter((l) => l.id !== lessonId);
                return next;
            });
            message.success("Урок удалён");
        } else { message.error("Ошибка"); }
    };

    const handleSubmitModeration = async () => {
        setSubmitting(true);
        const ok = await courseApi.submitForModeration(course.id);
        if (ok) { message.success("Курс отправлен на модерацию"); onUpdated({ ...course, status: "UnderReview" }); }
        else { message.error("Ошибка при отправке на модерацию"); }
        setSubmitting(false);
    };

    const handleSaveCourse = async (values: CourseFormValues, tags: string[]) => {
        setSavingCourse(true);
        const tagsDto: TagsDto[] = tags.map((name) => ({ name }));
        const ok = await courseApi.updateCourse(course.id, { ...values, tags: tagsDto });
        if (ok) {
            message.success("Курс обновлён");
            onUpdated({ ...course, ...values, tags: tagsDto });
            setEditCourseOpen(false);
        } else { message.error("Ошибка при сохранении"); }
        setSavingCourse(false);
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <Button onClick={onBack}>← Назад</Button>
                <Title level={3} style={{ margin: 0, flex: 1 }}>{course.title}</Title>
                <Tag color={statusColor[course.status]}>{statusLabel[course.status]}</Tag>
            </div>

            {course.status === "RejectedByModerator" && (
                <Alert type="error" message="Курс отклонён модератором"
                       description="Исправьте замечания и отправьте на повторную проверку."
                       style={{ marginBottom: 16 }} />
            )}

            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                <Button icon={<EditOutlined />} onClick={() => {
                    setEditCourseTags(course.tags?.map((t) => t.name) ?? []);
                    setEditCourseKey((k) => k + 1);
                    courseForm.setFieldsValue({
                        title: course.title, description: course.description,
                        fullDescription: course.fullDescription ?? undefined,
                        price: course.price, level: course.level,
                        certificateEnabled: course.certificateEnabled,
                        categoryId: course.categoryId ?? undefined,
                        coverImageUrl: course.coverImageUrl ?? undefined,
                    });
                    setEditCourseOpen(true);
                }}>
                    Редактировать курс
                </Button>
                {(course.status === "Draft" || course.status === "RejectedByModerator") && (
                    <Button type="primary" icon={<SendOutlined />} loading={submitting}
                            style={{ background: "rgba(0,100,0,0.8)" }} onClick={handleSubmitModeration}>
                        Отправить на модерацию
                    </Button>
                )}
                {course.status === "UnderReview" && (
                    <Tag color="processing" style={{ padding: "4px 12px", fontSize: 13 }}>Ожидает проверки модератора</Tag>
                )}
                {course.status === "Published" && (
                    <Tag color="success" style={{ padding: "4px 12px", fontSize: 13 }}>Курс опубликован</Tag>
                )}
            </div>

            <Divider />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Разделы курса</Title>
                <Button icon={<PlusOutlined />} onClick={() => {
                    setEditingSection(null);
                    sectionForm.resetFields();
                    setSectionModalOpen(true);
                }}>Добавить раздел</Button>
            </div>

            {loading ? <Spin /> : sections.length === 0 ? (
                <Empty description="Разделов пока нет. Добавьте первый раздел!" />
            ) : (
                <Collapse defaultActiveKey={sections.map((s) => s.id)}>
                    {sections.map((section) => (
                        <Panel key={section.id} header={
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <span>
                                    <BookOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                                    <Text strong>{section.title}</Text>
                                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{section.description}</Text>
                                </span>
                                <Space onClick={(e) => e.stopPropagation()}>
                                    <Button size="small" icon={<EditOutlined />} onClick={() => {
                                        setEditingSection(section);
                                        sectionForm.setFieldsValue({ title: section.title, description: section.description });
                                        setSectionModalOpen(true);
                                    }} />
                                    <Popconfirm title="Удалить раздел?" description="Все уроки раздела тоже будут удалены"
                                                onConfirm={() => handleDeleteSection(section.id)}
                                                okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}>
                                        <Button size="small" danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </Space>
                            </div>
                        }>
                            {(lessonsBySection[section.id] ?? []).map((lesson) => (
                                <LessonPanel key={lesson.id} lesson={lesson} sectionId={section.id}
                                             onDelete={handleDeleteLesson}
                                             onUpdated={(updated) => {
                                                 setLessonsBySection((p) => ({
                                                     ...p,
                                                     [section.id]: p[section.id].map((l) => l.id === updated.id ? updated : l),
                                                 }));
                                             }} />
                            ))}
                            {inlineLesson?.sectionId === section.id ? (
                                <LessonEditor key={`new-${section.id}`} lesson={null} sectionId={section.id}
                                              onSaved={handleLessonSaved} onCancel={() => setInlineLesson(null)} />
                            ) : (
                                <Button icon={<PlusOutlined />} size="small" style={{ marginTop: 8 }}
                                        onClick={() => setInlineLesson({ sectionId: section.id })}>
                                    Добавить урок
                                </Button>
                            )}
                        </Panel>
                    ))}
                </Collapse>
            )}

            <Modal open={sectionModalOpen} title={editingSection ? "Редактировать раздел" : "Новый раздел"}
                   onCancel={() => setSectionModalOpen(false)} footer={null} centered>
                <Form form={sectionForm} layout="vertical" onFinish={handleSaveSection}>
                    <Form.Item label="Название" name="title" rules={[{ required: true }, { min: 2 }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Описание" name="description"
                               rules={[{ required: true }, { min: 10, message: "Минимум 10 символов" }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button onClick={() => setSectionModalOpen(false)}>Отмена</Button>
                        <Button type="primary" htmlType="submit" style={{ background: "rgba(0,100,0,0.8)" }}>
                            {editingSection ? "Сохранить" : "Создать"}
                        </Button>
                    </div>
                </Form>
            </Modal>

            <Modal open={editCourseOpen} title="Редактировать курс" onCancel={() => setEditCourseOpen(false)}
                   footer={null} centered width={700} styles={{ body: { padding: "16px 24px 24px" } }}>
                <CourseForm key={editCourseKey} form={courseForm} categories={categories}
                            initialTags={editCourseTags} onFinish={handleSaveCourse}
                            onCancel={() => setEditCourseOpen(false)} submitLabel="Сохранить" loading={savingCourse} />
            </Modal>
        </div>
    );
};

// ─── TeacherPage ─────────────────────────────────────────────
const TeacherPage = () => {
    const navigate = useNavigate();
    const { userData } = useUserStore();

    const [allCourses, setAllCourses] = useState<CourseDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<CourseDto | null>(null);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createForm] = Form.useForm<CourseFormValues>();
    const [creating, setCreating] = useState(false);

    // Фильтры и поиск
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<CourseStatus | "">("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (userData && userData.role !== "Teacher" && userData.role !== "Admin") {
            navigate("/");
        }
    }, [userData, navigate]);

    useEffect(() => {
        const load = async () => {
            const [coursesData, catsRes] = await Promise.all([
                courseApi.getMyCourses(),
                fetch(`${API_URL}/Categories`, { headers: authStorage.getAuthHeaders() }),
            ]);
            setAllCourses(coursesData);
            if (catsRes.ok) setCategories(await catsRes.json());
            setLoading(false);
        };
        void load();
    }, []);

    // Фильтрация и поиск на фронте
    const filteredCourses = useMemo(() => {
        let result = allCourses;
        if (statusFilter) result = result.filter((c) => c.status === statusFilter);
        if (search) result = result.filter((c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase())
        );
        return result;
    }, [allCourses, statusFilter, search]);

    const paginatedCourses = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredCourses.slice(start, start + PAGE_SIZE);
    }, [filteredCourses, page]);

    const handleSearch = () => {
        setSearch(searchInput.trim());
        setPage(1);
    };

    const handleStatusFilter = (val: CourseStatus | "") => {
        setStatusFilter(val);
        setPage(1);
    };

    const handleCreateCourse = async (values: CourseFormValues, tags: string[]) => {
        setCreating(true);
        const tagsDto: TagsDto[] = tags.map((name) => ({ name }));
        const created = await courseApi.createCourse({
            title: values.title, description: values.description,
            fullDescription: values.fullDescription, price: values.price ?? 0,
            level: values.level ?? "Beginner", certificateEnabled: values.certificateEnabled ?? false,
            categoryId: values.categoryId, coverImageUrl: values.coverImageUrl, tags: tagsDto,
        });
        if (created) {
            setAllCourses((p) => [created, ...p]);
            message.success("Курс создан");
            setCreateModalOpen(false);
            createForm.resetFields();
            setSelectedCourse(created);
        } else {
            message.error("Ошибка при создании курса");
        }
        setCreating(false);
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

    if (userData.role !== "Teacher" && userData.role !== "Admin") return null;

    // Счётчики по статусам
    const counts: Record<string, number> = {
        "": allCourses.length,
        Draft: allCourses.filter((c) => c.status === "Draft").length,
        UnderReview: allCourses.filter((c) => c.status === "UnderReview").length,
        RejectedByModerator: allCourses.filter((c) => c.status === "RejectedByModerator").length,
        Published: allCourses.filter((c) => c.status === "Published").length,
    };

    return (
        <>
            <Header />
            <Layout style={{ minHeight: "calc(100vh - 64px)", background: "#fafafa" }}>
                <Content style={{ padding: "40px 60px" }}>
                    {selectedCourse ? (
                        <CourseEditor
                            course={selectedCourse}
                            categories={categories}
                            onBack={() => setSelectedCourse(null)}
                            onUpdated={(c) => {
                                setSelectedCourse(c);
                                setAllCourses((p) => p.map((x) => x.id === c.id ? c : x));
                            }}
                        />
                    ) : (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                <div>
                                    <Title level={2} style={{ margin: 0 }}>Мои курсы</Title>
                                    <Text type="secondary">Всего курсов: <strong>{allCourses.length}</strong></Text>
                                </div>
                                <Button type="primary" icon={<PlusOutlined />} size="large"
                                        style={{ background: "rgba(0,100,0,0.8)" }}
                                        onClick={() => setCreateModalOpen(true)}>
                                    Создать курс
                                </Button>
                            </div>

                            {/* Фильтры */}
                            <div style={{ marginBottom: 20 }}>
                                {/* Фильтр по статусу — кнопки */}
                                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                                    {([
                                        { value: "", label: "Все" },
                                        { value: "Draft", label: "Черновики" },
                                        { value: "UnderReview", label: "На проверке" },
                                        { value: "RejectedByModerator", label: "Отклонённые" },
                                        { value: "Published", label: "Опубликованные" },
                                    ] as { value: CourseStatus | ""; label: string }[]).map((btn) => (
                                        <Button
                                            key={btn.value}
                                            type={statusFilter === btn.value ? "primary" : "default"}
                                            onClick={() => handleStatusFilter(btn.value)}
                                            style={statusFilter === btn.value ? { background: "rgba(0,100,0,0.8)" } : {}}
                                        >
                                            {btn.label}
                                            {counts[btn.value] > 0 && (
                                                <span style={{
                                                    marginLeft: 6,
                                                    background: statusFilter === btn.value ? "rgba(255,255,255,0.25)" : "#f0f0f0",
                                                    color: statusFilter === btn.value ? "#fff" : "#666",
                                                    borderRadius: 10, padding: "0 6px",
                                                    fontSize: 11, fontWeight: 600,
                                                }}>
                                                    {counts[btn.value]}
                                                </span>
                                            )}
                                        </Button>
                                    ))}
                                </div>

                                {/* Поиск */}
                                <Row gutter={8}>
                                    <Col flex="auto">
                                        <Input
                                            placeholder="Поиск по названию или описанию..."
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
                                </Row>
                            </div>

                            <Divider style={{ margin: "0 0 24px" }} />

                            {loading ? (
                                <div style={{ textAlign: "center", paddingTop: 60 }}><Spin size="large" /></div>
                            ) : filteredCourses.length === 0 ? (
                                <Empty
                                    description={search || statusFilter ? "Ничего не найдено" : "У вас пока нет курсов"}
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                >
                                    {!search && !statusFilter && (
                                        <Button type="primary" style={{ background: "rgba(0,100,0,0.8)" }}
                                                onClick={() => setCreateModalOpen(true)}>
                                            Создать первый курс
                                        </Button>
                                    )}
                                </Empty>
                            ) : (
                                <>
                                    <Row gutter={[24, 24]}>
                                        {paginatedCourses.map((course) => (
                                            <Col key={course.id} xs={24} sm={12} lg={8}>
                                                <div
                                                    onClick={() => setSelectedCourse(course)}
                                                    style={{
                                                        background: "#fff", borderRadius: 12,
                                                        border: "1px solid #f0f0f0", padding: 20,
                                                        cursor: "pointer", transition: "box-shadow 0.2s",
                                                    }}
                                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; }}
                                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                                                >
                                                    {course.coverImageUrl && (
                                                        <img src={course.coverImageUrl} alt={course.title}
                                                             style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 12 }} />
                                                    )}
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                                        <Tag color={statusColor[course.status]}>{statusLabel[course.status]}</Tag>
                                                        <Tag>{levelLabel[course.level]}</Tag>
                                                    </div>
                                                    <Text strong style={{ fontSize: 15, display: "block", marginBottom: 6 }}>{course.title}</Text>
                                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                                        {course.description.length > 80 ? course.description.slice(0, 80) + "..." : course.description}
                                                    </Text>
                                                    <Divider style={{ margin: "12px 0" }} />
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>{course.enrollmentCount} студентов</Text>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {course.price === 0 ? "Бесплатно" : `${course.price} ₽`}
                                                        </Text>
                                                    </div>
                                                    {course.tags && course.tags.length > 0 && (
                                                        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                                                            {course.tags.slice(0, 3).map((t) => (
                                                                <Tag key={t.name} style={{ fontSize: 11 }}>{t.name}</Tag>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {course.status === "RejectedByModerator" && (
                                                        <div style={{ marginTop: 8 }}>
                                                            <Tag color="error" icon={<QuestionCircleOutlined />}>Требует исправлений</Tag>
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>

                                    {filteredCourses.length > PAGE_SIZE && (
                                        <div style={{ textAlign: "center", marginTop: 32 }}>
                                            <Pagination
                                                current={page}
                                                pageSize={PAGE_SIZE}
                                                total={filteredCourses.length}
                                                onChange={setPage}
                                                showSizeChanger={false}
                                                showTotal={(t) => `Всего: ${t}`}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Content>
            </Layout>
            <Footer />

            <Modal open={createModalOpen} title="Создать новый курс"
                   onCancel={() => setCreateModalOpen(false)}
                   footer={null} centered width={700}
                   styles={{ body: { padding: "16px 24px 24px" } }}>
                <CourseForm form={createForm} categories={categories} initialTags={[]}
                            onFinish={handleCreateCourse} onCancel={() => setCreateModalOpen(false)}
                            submitLabel="Создать курс" loading={creating} />
            </Modal>
        </>
    );
};

export default TeacherPage;