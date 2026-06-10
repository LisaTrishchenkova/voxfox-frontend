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
    Upload,
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
    UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import MarkdownEditor from "../../components/MarkdownEditor.tsx";
import ReactMarkdown from "react-markdown";
import { courseApi } from "../../api/courseApi.ts";
import { sectionApi } from "../../api/sectionApi.ts";
import { lessonApi } from "../../api/lessonApi.ts";
import { taskTeacherApi } from "../../api/taskTeacherApi.ts";
import { courseDraftApi, draftToCreateDto } from "../../api/courseDraftApi.ts";
import type { CourseDraftDto, DraftSectionDto, DraftLessonDto, DraftTaskDto } from "../../api/courseDraftApi.ts";
import { useUserStore } from "../../stores/userStore.ts";
import { API_URL } from "../../config.ts";
import { getImageUrl, COVER_PLACEHOLDER_STYLE } from "../../utils/imageUtils.ts";
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

const MAX_OPTIONS = 6;

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

const PAGE_SIZE = 12;

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
                        courseId, onCoverUploaded,
                    }: {
    form: ReturnType<typeof Form.useForm<CourseFormValues>>[0];
    categories: CategoryDto[];
    initialTags?: string[];
    onFinish: (values: CourseFormValues, tags: string[], coverFile?: File | null) => void;
    onCancel: () => void;
    submitLabel: string;
    loading: boolean;
    courseId?: string;          // если передан — показываем загрузку файла
    onCoverUploaded?: (url: string) => void; // коллбэк после успешной загрузки
}) => {
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>(initialTags);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) setTags((p) => [...p, t]);
        setTagInput("");
    };

    return (
        <Form form={form} layout="vertical" onFinish={(values) => onFinish(values, tags, pendingCoverFile)}>
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
            <Form.Item label="Обложка курса">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* Загрузка файла — только для существующего курса */}
                    {courseId && (
                        <Upload
                            accept=".jpg,.jpeg,.png,.webp"
                            showUploadList={false}
                            beforeUpload={async (file) => {
                                setUploadingCover(true);
                                const formData = new FormData();
                                formData.append("file", file);
                                try {
                                    // Для multipart/form-data НЕ ставим Content-Type — браузер сам добавит с boundary
                                    const authHeaders = authStorage.getAuthHeaders() as Record<string, string>;
                                    const { "Content-Type": _, ...headersWithoutContentType } = authHeaders;
                                    const res = await fetch(
                                        `${API_URL}/Courses/${courseId}/cover`,
                                        { method: "POST", headers: headersWithoutContentType, body: formData }
                                    );
                                    if (res.ok) {
                                        const data = await res.json();
                                        form.setFieldValue("coverImageUrl", data.coverImageUrl);
                                        onCoverUploaded?.(data.coverImageUrl);
                                        message.success("Обложка загружена");
                                    } else {
                                        message.error("Ошибка при загрузке обложки");
                                    }
                                } catch {
                                    message.error("Ошибка при загрузке обложки");
                                }
                                setUploadingCover(false);
                                return false; // не даём antd делать свой upload
                            }}
                        >
                            <Button icon={<UploadOutlined />} loading={uploadingCover} size="small">
                                Загрузить файл (jpg, png, webp, до 10MB)
                            </Button>
                        </Upload>
                    )}
                    <Form.Item name="coverImageUrl" noStyle
                               extra={courseId ? "Или вставьте прямую ссылку на изображение" : "Прямая ссылка на изображение (jpg, png, webp)"}>
                        <Input placeholder="https://..." />
                    </Form.Item>
                    {!courseId && (
                        <Upload
                            accept=".jpg,.jpeg,.png,.webp"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                setPendingCoverFile(file);
                                message.info(`Файл «${file.name}» будет загружен после создания курса`);
                                return false;
                            }}
                        >
                            <Button icon={<UploadOutlined />} size="small">
                                {pendingCoverFile ? `Файл выбран: ${pendingCoverFile.name}` : "Выбрать файл обложки"}
                            </Button>
                        </Upload>
                    )}
                </div>
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
const TaskForm = ({ lessonId, onCreated, onCancel, draftMode = false }: {
    lessonId: string;
    onCreated: (task: TaskTeacherDto) => void;
    onCancel: () => void;
    draftMode?: boolean; // если true — не вызывает API, просто возвращает данные через onCreated
}) => {
    const [form] = Form.useForm<TaskFormValues>();
    const [taskType, setTaskType] = useState<TaskType>("SingleChoice");
    const [options, setOptions] = useState<string[]>(["", ""]);
    const [hints, setHints] = useState<string[]>([""]);
    const [saving, setSaving] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showForm, setShowForm] = useState(!draftMode); // в draftMode форма скрыта по умолчанию

    const addHint = () => { if (hints.length < 3) setHints((p) => [...p, ""]); };
    const removeHint = (i: number) => setHints((p) => p.filter((_, idx) => idx !== i));
    const setHint = (i: number, val: string) => setHints((p) => p.map((h, idx) => idx === i ? val : h));

    const updateOption = (i: number, val: string) => {
        setOptions((p) => p.map((o, idx) => idx === i ? val : o));
    };

    const addOption = () => {
        const lastOption = options[options.length - 1];
        if (!lastOption.trim()) {
            message.warning("Заполните предыдущий вариант перед добавлением нового");
            return;
        }
        if (options.length >= MAX_OPTIONS) {
            message.warning(`Максимальное количество вариантов — ${MAX_OPTIONS}`);
            return;
        }
        setOptions((p) => [...p, ""]);
    };

    const removeOption = (i: number) => {
        setOptions((p) => p.filter((_, idx) => idx !== i));
        form.setFieldsValue({ correctIndex: undefined, correctIndexes: [] });
    };

    const handleSubmit = async (values: TaskFormValues) => {
        setSubmitted(true);
        if (taskType === "SingleChoice" || taskType === "MultiChoice") {
            const emptyIndex = options.findIndex((o) => !o.trim());
            if (emptyIndex !== -1) {
                message.error(`Вариант ${emptyIndex + 1} не заполнен. Все варианты ответов должны быть заполнены`);
                return;
            }
        }

        setSaving(true);
        const cleanHints = hints.map((h) => h.trim()).filter(Boolean);

        if (draftMode) {
            // В режиме черновика — не вызываем API, формируем объект и возвращаем через onCreated
            // Создаём объект который совместим с DraftTaskDto
            const draftTaskData: DraftTaskDto = {
                id: `temp-task-${Date.now()}`,
                originalTaskId: undefined,
                type: taskType,
                question: values.question,
                options: taskType !== "TextInput" ? options : undefined,
                correctIndex: taskType === "SingleChoice" ? (values.correctIndex ?? undefined) : undefined,
                correctIndexes: taskType === "MultiChoice" ? (values.correctIndexes ?? undefined) : undefined,
                correctAnswer: taskType === "TextInput" ? (values.correctAnswer ?? undefined) : undefined,
                explanation: values.explanation ?? undefined,
                points: values.points ?? 1,
                isRequired: values.isRequired ?? true,
                orderIndex: 0,
            };
            // Приводим к TaskTeacherDto для совместимости с onCreated
            const fakeTask = draftTaskData as unknown as TaskTeacherDto;
            onCreated(fakeTask);
            form.resetFields();
            setOptions(["", ""]);
            setHints([""]);
            setSubmitted(false);
            setShowForm(false);
            setSaving(false);
            return;
        }

        let result: TaskTeacherDto | null = null;

        if (taskType === "SingleChoice") {
            if (values.correctIndex == null) { message.error("Выберите правильный ответ"); setSaving(false); return; }
            result = await taskTeacherApi.createSingleChoice(lessonId, {
                question: values.question, options, correctIndex: values.correctIndex,
                explanation: values.explanation, hints: cleanHints,
                points: values.points ?? 1, isRequired: values.isRequired ?? true,
            });
        } else if (taskType === "MultiChoice") {
            if (!values.correctIndexes?.length) { message.error("Выберите хотя бы один правильный ответ"); setSaving(false); return; }
            result = await taskTeacherApi.createMultiChoice(lessonId, {
                question: values.question, options, correctIndexes: values.correctIndexes,
                explanation: values.explanation, hints: cleanHints,
                points: values.points ?? 1, isRequired: values.isRequired ?? true,
            });
        } else {
            result = await taskTeacherApi.createTextInput(lessonId, {
                question: values.question, correctAnswer: values.correctAnswer ?? "",
                explanation: values.explanation, hints: cleanHints,
                points: values.points ?? 1, isRequired: values.isRequired ?? true,
            });
        }

        if (result) {
            message.success("Задание создано");
            onCreated(result);
            form.resetFields();
            setOptions(["", ""]);
            setHints([""]);
            setSubmitted(false);
        } else {
            message.error("Ошибка при создании задания");
        }
        setSaving(false);
    };

    const canAddOption = options.length < MAX_OPTIONS;

    // В draftMode показываем кнопку "Добавить задание", форма разворачивается по клику
    if (draftMode && !showForm) {
        return (
            <Button size="small" icon={<PlusOutlined />} style={{ marginTop: 8 }} onClick={() => setShowForm(true)}>
                Добавить задание
            </Button>
        );
    }

    return (
        <div style={{ borderRadius: 8, padding: 20, marginTop: 12, border: "1px solid #b7eb8f" }}>
            <Text strong style={{ color: "#389e0d" }}>Новое задание</Text>
            <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 12 }}>
                <Form.Item label="Тип задания">
                    <Select value={taskType} onChange={(val) => {
                        setTaskType(val);
                        form.setFieldsValue({ correctIndex: undefined, correctIndexes: [] });
                    }} style={{ width: 240 }}>
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
                    <Form.Item label={
                        <span>Варианты ответов <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>({options.length} / {MAX_OPTIONS})</Text></span>
                    }>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            {options.map((opt, i) => (
                                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <Text type="secondary" style={{ fontSize: 12, minWidth: 20 }}>{i + 1}.</Text>
                                    <Input value={opt} onChange={(e) => updateOption(i, e.target.value)}
                                           placeholder={`Вариант ${i + 1}`}
                                           style={{ flex: 1, borderColor: submitted && opt.trim() === "" ? "#ff4d4f" : undefined }}
                                           status={submitted && opt.trim() === "" ? "error" : ""} />
                                    {options.length > 2 && (
                                        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeOption(i)} />
                                    )}
                                </div>
                            ))}
                            {submitted && options.some((o) => !o.trim()) && (
                                <Text type="danger" style={{ fontSize: 12 }}>Все варианты должны быть заполнены</Text>
                            )}
                            <Button size="small" icon={<PlusOutlined />} onClick={addOption} disabled={!canAddOption}>
                                Добавить вариант{!canAddOption && ` (макс. ${MAX_OPTIONS})`}
                            </Button>
                        </Space>
                    </Form.Item>
                )}
                {taskType === "SingleChoice" && (
                    <Form.Item label="Правильный ответ" name="correctIndex">
                        <Radio.Group>
                            <Space direction="vertical">
                                {options.map((opt, i) => (
                                    <Radio key={i} value={i} disabled={!opt.trim()}>
                                        {opt || <Text type="secondary">{`Вариант ${i + 1} (не заполнен)`}</Text>}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                )}
                {taskType === "MultiChoice" && (
                    <Form.Item label="Правильные ответы" name="correctIndexes">
                        <Checkbox.Group>
                            <Space direction="vertical">
                                {options.map((opt, i) => (
                                    <Checkbox key={i} value={i} disabled={!opt.trim()}>
                                        {opt || <Text type="secondary">{`Вариант ${i + 1} (не заполнен)`}</Text>}
                                    </Checkbox>
                                ))}
                            </Space>
                        </Checkbox.Group>
                    </Form.Item>
                )}
                {taskType === "TextInput" && (
                    <Form.Item label="Правильный ответ" name="correctAnswer"
                               rules={[{ required: true, message: "Введите правильный ответ" }, { whitespace: true, message: "Ответ не может быть пустым" }]}>
                        <Input placeholder="Правильный ответ..." />
                    </Form.Item>
                )}
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Очки" name="points" initialValue={1}>
                            <InputNumber min={1} max={100} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label={
                    <span>Подсказки <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>(показываются после каждой неправильной попытки, до 3 штук)</Text></span>
                }>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        {hints.map((hint, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <Input value={hint} onChange={(e) => setHint(i, e.target.value)}
                                       placeholder={`Подсказка ${i + 1}`} style={{ flex: 1 }} />
                                {hints.length > 1 && (
                                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeHint(i)} />
                                )}
                            </div>
                        ))}
                        {hints.length < 3 && (
                            <Button size="small" icon={<PlusOutlined />} onClick={addHint}>Добавить подсказку</Button>
                        )}
                    </Space>
                </Form.Item>
                <Form.Item label="Объяснение (показывается после правильного ответа)" name="explanation">
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
                    {lesson ? `Редактирование: ${lesson.title}` : "Новый урок"}
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
                <Form.Item label="Содержимое урока (Markdown)">
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
                                                    {task.points} очк.
                                                    {task.hints && task.hints.length > 0 && (
                                                        <span style={{ marginLeft: 6, color: "#faad14" }}>· {task.hints.length} подсказки</span>
                                                    )}
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

// ─── ReadonlyTaskList ────────────────────────────────────────
const ReadonlyTaskList = ({ lessonId }: { lessonId: string }) => {
    const [tasks, setTasks] = useState<TaskTeacherDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        taskTeacherApi.getLessonTasks(lessonId).then((data) => {
            setTasks(data);
            setLoading(false);
        });
    }, [lessonId]);

    if (loading) return <Spin size="small" />;
    if (tasks.length === 0) return <Text type="secondary" style={{ fontSize: 13 }}>Заданий нет</Text>;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tasks.map((task, idx) => (
                <div key={task.id} style={{ border: "1px solid #e8f5e9", borderRadius: 8, padding: "14px 16px", background: "#fff" }}>
                    {/* Заголовок */}
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                        <Text type="secondary" style={{ fontSize: 12, minWidth: 20 }}>{idx + 1}.</Text>
                        <div style={{ flex: 1 }}>
                            <Tag color="blue" style={{ fontSize: 11, marginBottom: 6 }}>{taskTypeLabel[task.type]}</Tag>
                            <Text strong style={{ display: "block", fontSize: 14 }}>{task.question}</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>{task.points} очк.</Text>
                        </div>
                    </div>

                    {/* Варианты ответов — SingleChoice */}
                    {task.type === "SingleChoice" && task.options && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 28 }}>
                            {task.options.map((opt, i) => (
                                <div key={i} style={{
                                    padding: "6px 10px", borderRadius: 6, fontSize: 13,
                                    background: task.correctIndex === i ? "#f6ffed" : "#fafafa",
                                    border: `1px solid ${task.correctIndex === i ? "#b7eb8f" : "#f0f0f0"}`,
                                    display: "flex", alignItems: "center", gap: 8,
                                }}>
                                    {task.correctIndex === i
                                        ? <CheckOutlined style={{ color: "#52c41a", fontSize: 12 }} />
                                        : <span style={{ width: 12, display: "inline-block" }} />
                                    }
                                    <Text style={{ fontSize: 13, color: task.correctIndex === i ? "#389e0d" : undefined }}>
                                        {opt}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Варианты ответов — MultiChoice */}
                    {task.type === "MultiChoice" && task.options && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 28 }}>
                            {task.options.map((opt, i) => {
                                const isCorrect = task.correctIndexes?.includes(i);
                                return (
                                    <div key={i} style={{
                                        padding: "6px 10px", borderRadius: 6, fontSize: 13,
                                        background: isCorrect ? "#f6ffed" : "#fafafa",
                                        border: `1px solid ${isCorrect ? "#b7eb8f" : "#f0f0f0"}`,
                                        display: "flex", alignItems: "center", gap: 8,
                                    }}>
                                        {isCorrect
                                            ? <CheckOutlined style={{ color: "#52c41a", fontSize: 12 }} />
                                            : <span style={{ width: 12, display: "inline-block" }} />
                                        }
                                        <Text style={{ fontSize: 13, color: isCorrect ? "#389e0d" : undefined }}>
                                            {opt}
                                        </Text>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Текстовый ответ */}
                    {task.type === "TextInput" && (
                        <div style={{ marginLeft: 28 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>Правильный ответ: </Text>
                            <Text style={{ fontSize: 13, color: "#389e0d", fontWeight: 600 }}>{task.correctAnswer}</Text>
                        </div>
                    )}

                    {/* Объяснение */}
                    {task.explanation && (
                        <div style={{ marginTop: 8, marginLeft: 28, padding: "6px 10px", background: "#fffbe6", borderRadius: 6, borderLeft: "3px solid #faad14" }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>Объяснение: </Text>
                            <Text style={{ fontSize: 13 }}>{task.explanation}</Text>
                        </div>
                    )}

                    {/* Подсказки */}
                    {task.hints && task.hints.length > 0 && (
                        <div style={{ marginTop: 8, marginLeft: 28 }}>
                            {task.hints.map((hint, i) => (
                                <div key={i} style={{ fontSize: 12, color: "#faad14" }}>
                                    💡 Подсказка {i + 1}: {hint}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// ─── ReadonlyLessonContent ────────────────────────────────────
// Загружает полный урок (с content) и задания
const ReadonlyLessonContent = ({ lessonId }: { lessonId: string }) => {
    const [lesson, setLesson] = useState<LessonDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Загружаем полный урок с content
        fetch(`${API_URL}/Lessons/${lessonId}`, { headers: authStorage.getAuthHeaders() })
            .then((r) => r.ok ? r.json() : null)
            .then((data) => {
                setLesson(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [lessonId]);

    if (loading) return <div style={{ padding: 16 }}><Spin size="small" /></div>;
    if (!lesson) return <Text type="secondary">Не удалось загрузить урок</Text>;

    return (
        <div>
            {lesson.content ? (
                <div style={{ marginBottom: 16 }}>
                    <ReactMarkdown>{lesson.content}</ReactMarkdown>
                </div>
            ) : (
                <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
                    Содержимое урока не добавлено
                </Text>
            )}
            <Divider style={{ margin: "12px 0" }} />
            <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>Задания:</Text>
            <ReadonlyTaskList lessonId={lessonId} />
        </div>
    );
};

// ─── DraftSectionEditor ──────────────────────────────────────
// Компонент редактирования одного раздела черновика
const DraftLessonEditor = ({ lesson, onSave, onCancel }: {
    lesson: DraftLessonDto | null; // null = новый урок
    onSave: (data: { title: string; description: string; content: string }) => void;
    onCancel: () => void;
}) => {
    const [form] = Form.useForm<LessonFormValues>();
    const [content, setContent] = useState(lesson?.content ?? "");



    return (
        <div style={{ border: "2px solid #52c41a", borderRadius: 10, padding: 20, marginBottom: 12, background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Text strong style={{ fontSize: 15, color: "#389e0d" }}>
                    {lesson ? `Редактирование: ${lesson.title}` : "Новый урок"}
                </Text>
                <Button size="small" icon={<CloseOutlined />} onClick={onCancel} type="text" danger>Отмена</Button>
            </div>
            <Form form={form} layout="vertical" initialValues={{ title: lesson?.title ?? "", description: lesson?.description ?? "" }} onFinish={(values) => onSave({ ...values, content })}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Название урока" name="title" rules={[{ required: true }, { min: 2 }]}>
                            <Input placeholder="Название урока" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Краткое описание" name="description" rules={[{ required: true }, { min: 10 }]}>
                            <Input placeholder="Краткое описание" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Содержимое урока (Markdown)">
                    <MarkdownEditor value={content} onChange={setContent} minHeight={400} />
                </Form.Item>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <Button onClick={onCancel}>Отмена</Button>
                    <Button type="primary" htmlType="submit" icon={<CheckOutlined />} style={{ background: "rgba(0,100,0,0.8)" }}>
                        {lesson ? "Сохранить урок" : "Создать урок"}
                    </Button>
                </div>
            </Form>
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

    // Черновик для опубликованного курса
    const [existingDraft, setExistingDraft] = useState<CourseDraftDto | null>(null);
    const [loadingDraft] = useState(false); // зарезервировано
    const [submittingDraft, setSubmittingDraft] = useState(false);
    const [cancellingDraft, setCancellingDraft] = useState(false);
    const [creatingDraft, setCreatingDraft] = useState(false);
    const [confirmEditModalOpen, setConfirmEditModalOpen] = useState(false);
    // "view" | "editing" | "review"
    type PublishedMode = "view" | "editing" | "review";
    const [publishedMode, setPublishedMode] = useState<PublishedMode>("view");

    // Состояние редактора черновика структуры
    const [draftSections, setDraftSections] = useState<DraftSectionDto[]>([]);
    const [draftSectionModal, setDraftSectionModal] = useState(false);
    const [editingDraftSection, setEditingDraftSection] = useState<DraftSectionDto | null>(null);
    const [draftSectionForm] = Form.useForm<SectionFormValues>();

    // Синхронизируем форму раздела когда editingDraftSection меняется
    useEffect(() => {
        if (draftSectionModal) {
            if (editingDraftSection) {
                draftSectionForm.setFieldsValue({
                    title: editingDraftSection.title,
                    description: editingDraftSection.description,
                });
            } else {
                draftSectionForm.resetFields();
            }
        }
    }, [draftSectionModal, editingDraftSection, draftSectionForm]);
    const [editingDraftLesson, setEditingDraftLesson] = useState<{ sectionId: string; lesson: DraftLessonDto | null } | null>(null);
    const [savingDraft, setSavingDraft] = useState(false);


    useEffect(() => {
        const load = async () => {
            const data: SectionDto[] = await courseApi.getSections(course.id);
            setSections(data);
            const lessonsMap: Record<string, LessonDto[]> = {};
            await Promise.all(data.map(async (s) => {
                lessonsMap[s.id] = await sectionApi.getLessonsBySection(s.id);
            }));
            setLessonsBySection(lessonsMap);
            setLoading(false);
        };
        void load();
    }, [course.id]);

    // При открытии опубликованного курса — проверяем есть ли уже черновик
    const draftCheckedRef = useRef(false);
    useEffect(() => {
        if (course.status !== "Published" || draftCheckedRef.current) return;
        draftCheckedRef.current = true;
        courseDraftApi.getDraft(course.id).then((draft) => {
            if (draft) {
                setExistingDraft(draft);
                const sorted0 = [...(draft.sections ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
                setDraftSections(sorted0);
                setPublishedMode(draft.status === "UnderReview" ? "review" : "editing");
            } else {
                setConfirmEditModalOpen(true);
            }
        });
    }, [course.id, course.status]);

    // ─── Сохранить черновик целиком на бэкенд ────────────────
    const saveDraftToServer = async (draft: CourseDraftDto, sections: DraftSectionDto[]): Promise<CourseDraftDto | null> => {
        setSavingDraft(true);
        const updated = { ...draft, sections };
        const payload = draftToCreateDto(updated);
        const result = await courseDraftApi.updateDraftFull(course.id, draft.id, payload);
        setSavingDraft(false);
        if (!result) { message.error("Ошибка при сохранении черновика"); return null; }
        return result;
    };

    // ─── Операции с разделами черновика ─────────────────────

    const handleDraftSaveSection = async (values: SectionFormValues) => {
        if (!existingDraft) return;
        let newSections: DraftSectionDto[];

        if (editingDraftSection) {
            newSections = draftSections.map((s) =>
                s.id === editingDraftSection.id ? { ...s, ...values } : s
            );
        } else {
            const newSection: DraftSectionDto = {
                id: `temp-${Date.now()}`,
                title: values.title,
                description: values.description,
                orderIndex: draftSections.length,
                lessons: [],
            };
            newSections = [...draftSections, newSection];
        }

        const saved = await saveDraftToServer(existingDraft, newSections);
        if (saved) {
            setExistingDraft(saved);
            const sortedSections = [...(saved.sections ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
            setDraftSections(sortedSections);
            message.success(editingDraftSection ? "Раздел обновлён" : "Раздел создан");
        }
        setDraftSectionModal(false);
    };

    const handleDraftDeleteSection = async (sectionId: string) => {
        if (!existingDraft) return;
        const newSections = draftSections
            .filter((s) => s.id !== sectionId)
            .map((s, i) => ({ ...s, orderIndex: i }));
        const saved = await saveDraftToServer(existingDraft, newSections);
        if (saved) {
            setExistingDraft(saved);
            const sortedSections = [...(saved.sections ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
            setDraftSections(sortedSections);
            message.success("Раздел удалён");
        }
    };

    // ─── Операции с уроками черновика ─────────────────────

    const handleDraftSaveLesson = async (sectionId: string, data: { title: string; description: string; content: string }) => {
        if (!existingDraft) return;
        const newSections = draftSections.map((s) => {
            if (s.id !== sectionId) return s;

            if (editingDraftLesson?.lesson) {
                // редактируем существующий урок
                return {
                    ...s,
                    lessons: s.lessons.map((l) =>
                        l.id === editingDraftLesson.lesson!.id ? { ...l, ...data } : l
                    ),
                };
            } else {
                // новый урок
                const newLesson: DraftLessonDto = {
                    id: `temp-lesson-${Date.now()}`,
                    title: data.title,
                    description: data.description,
                    content: data.content,
                    orderIndex: s.lessons.length,
                    tasks: [],
                };
                return { ...s, lessons: [...s.lessons, newLesson] };
            }
        });

        const saved = await saveDraftToServer(existingDraft, newSections);
        if (saved) {
            setExistingDraft(saved);
            const sortedSections = [...(saved.sections ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
            setDraftSections(sortedSections);
            message.success(editingDraftLesson?.lesson ? "Урок обновлён" : "Урок создан");
        }
        setEditingDraftLesson(null);
    };

    const handleDraftDeleteLesson = async (sectionId: string, lessonId: string) => {
        if (!existingDraft) return;
        const newSections = draftSections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
                ...s,
                lessons: s.lessons.filter((l) => l.id !== lessonId).map((l, i) => ({ ...l, orderIndex: i })),
            };
        });
        const saved = await saveDraftToServer(existingDraft, newSections);
        if (saved) {
            setExistingDraft(saved);
            const sortedSections = [...(saved.sections ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
            setDraftSections(sortedSections);
            message.success("Урок удалён");
        }
    };

    // ─── Операции с заданиями черновика ─────────────────────

    const handleDraftTaskCreated = async (sectionId: string, lessonId: string, task: DraftTaskDto) => {
        if (!existingDraft) return;
        const newSections = draftSections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
                ...s,
                lessons: s.lessons.map((l) => {
                    if (l.id !== lessonId) return l;
                    return { ...l, tasks: [...l.tasks, { ...task, orderIndex: l.tasks.length }] };
                }),
            };
        });
        const saved = await saveDraftToServer(existingDraft, newSections);
        if (saved) {
            setExistingDraft(saved);
            const sortedSections = [...(saved.sections ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
            setDraftSections(sortedSections);
        }
    };

    const handleDraftTaskDeleted = async (sectionId: string, lessonId: string, taskId: string) => {
        if (!existingDraft) return;
        const newSections = draftSections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
                ...s,
                lessons: s.lessons.map((l) => {
                    if (l.id !== lessonId) return l;
                    return {
                        ...l,
                        tasks: l.tasks.filter((t) => t.id !== taskId).map((t, i) => ({ ...t, orderIndex: i })),
                    };
                }),
            };
        });
        const saved = await saveDraftToServer(existingDraft, newSections);
        if (saved) {
            setExistingDraft(saved);
            const sortedSections = [...(saved.sections ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
            setDraftSections(sortedSections);
        }
    };

    // ─── Стандартные операции (для не-Published курсов) ──────

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

    // Для Published — сохранение метаданных через черновик
    const handleSaveCourseDraft = async (values: CourseFormValues, tags: string[]) => {
        if (!existingDraft) return;
        setSavingCourse(true);
        const updatedDraft: CourseDraftDto = {
            ...existingDraft,
            title: values.title,
            description: values.description,
            fullDescription: values.fullDescription,
            coverImageUrl: values.coverImageUrl,
            price: values.price ?? 0,
            level: values.level ?? "Beginner",
            certificateEnabled: values.certificateEnabled ?? false,
            categoryId: values.categoryId,
            tags,
            sections: draftSections,
        };
        const saved = await courseDraftApi.updateDraftFull(course.id, existingDraft.id, draftToCreateDto(updatedDraft));
        if (saved) {
            setExistingDraft(saved);
            const sortedSections = [...(saved.sections ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
            setDraftSections(sortedSections);
            message.success("Изменения сохранены в черновике");
            setEditCourseOpen(false);
        } else {
            message.error("Ошибка при сохранении черновика");
        }
        setSavingCourse(false);
    };

    const handleSubmitDraft = async () => {
        if (!existingDraft) return;
        setSubmittingDraft(true);
        const ok = await courseDraftApi.submitDraft(course.id, existingDraft.id);
        if (ok) {
            message.success("Изменения отправлены на модерацию");
            setExistingDraft(null);
            setPublishedMode("review");
        } else {
            message.error("Ошибка при отправке на модерацию");
        }
        setSubmittingDraft(false);
    };

    const handleCancelDraft = async () => {
        if (!existingDraft) return;
        setCancellingDraft(true);
        const ok = await courseDraftApi.deleteDraft(course.id, existingDraft.id);
        if (ok) {
            message.success("Черновик изменений удалён");
            setExistingDraft(null);
            setDraftSections([]);
            setPublishedMode("view");
        } else {
            message.error("Ошибка при удалении черновика");
        }
        setCancellingDraft(false);
    };

    const handleConfirmEdit = async () => {
        setCreatingDraft(true);
        const draft = await courseDraftApi.getOrCreateDraft(course.id);
        setCreatingDraft(false);
        if (draft) {
            const sorted = [...(draft.sections ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
            setExistingDraft(draft);
            setDraftSections(sorted);
            setPublishedMode("editing");
            setConfirmEditModalOpen(false);
        } else {
            message.error("Не удалось создать черновик. Попробуйте ещё раз.");
        }
    };

    const openEditForm = () => {
        const tags = existingDraft?.tags ?? course.tags?.map((t) => t.name) ?? [];
        const source = existingDraft ?? course;
        setEditCourseTags(tags);
        setEditCourseKey((k) => k + 1);
        courseForm.setFieldsValue({
            title: source.title,
            description: source.description,
            fullDescription: source.fullDescription ?? undefined,
            price: source.price,
            level: (source.level as CourseLevel) ?? "Beginner",
            certificateEnabled: source.certificateEnabled,
            categoryId: (source as CourseDto).categoryId ?? (source as CourseDraftDto).categoryId ?? undefined,
            coverImageUrl: source.coverImageUrl ?? undefined,
        });
        setEditCourseOpen(true);
    };

    const isUnderReview = course.status === "UnderReview";
    const isPublished = course.status === "Published";
    const isReadOnly   = isPublished && publishedMode === "view";
    const isDraftReview = isPublished && publishedMode === "review";
    const isEditing    = isPublished && publishedMode === "editing";

    // ─── Рендер черновика структуры (sections/lessons/tasks) ─

    const renderDraftStructure = () => (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Разделы курса {savingDraft && <Spin size="small" style={{ marginLeft: 8 }} />}</Title>
                <Button icon={<PlusOutlined />} onClick={() => { setEditingDraftSection(null); draftSectionForm.resetFields(); setDraftSectionModal(true); }}>
                    Добавить раздел
                </Button>
            </div>

            {draftSections.length === 0 ? (
                <Empty description="Разделов пока нет. Добавьте первый раздел!" />
            ) : (
                <Collapse key={draftSections.map(s => s.id).join(',')} defaultActiveKey={draftSections.map((s) => s.id)}>
                    {[...draftSections].sort((a, b) => a.orderIndex - b.orderIndex).map((section) => (
                        <Panel key={section.id} header={
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <span>
                                    <BookOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                                    <Text strong>{section.title}</Text>
                                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{section.description}</Text>
                                </span>
                                <Space onClick={(e) => e.stopPropagation()}>
                                    <Button size="small" icon={<EditOutlined />} onClick={() => {
                                        setEditingDraftSection(section);
                                        setDraftSectionModal(true);
                                    }} />
                                    <Popconfirm title="Удалить раздел?" description="Все уроки раздела тоже будут удалены из черновика"
                                                onConfirm={() => handleDraftDeleteSection(section.id)}
                                                okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}>
                                        <Button size="small" danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </Space>
                            </div>
                        }>
                            {[...section.lessons].sort((a, b) => a.orderIndex - b.orderIndex).map((lesson) => (
                                <div key={lesson.id}>
                                    {editingDraftLesson?.lesson?.id === lesson.id ? (
                                        <DraftLessonEditor
                                            lesson={lesson}
                                            onSave={(data) => handleDraftSaveLesson(section.id, data)}
                                            onCancel={() => setEditingDraftLesson(null)}
                                        />
                                    ) : (
                                        <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, marginBottom: 8, background: "#fff" }}>
                                            <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                                                    <FileTextOutlined style={{ color: "#52c41a" }} />
                                                    <Text strong>{lesson.title}</Text>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>{lesson.description}</Text>
                                                </div>
                                                <Space>
                                                    <Button size="small" icon={<EditOutlined />}
                                                            onClick={() => setEditingDraftLesson({ sectionId: section.id, lesson })} />
                                                    <Popconfirm title="Удалить урок из черновика?"
                                                                onConfirm={() => handleDraftDeleteLesson(section.id, lesson.id)}
                                                                okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}>
                                                        <Button size="small" danger icon={<DeleteOutlined />} />
                                                    </Popconfirm>
                                                </Space>
                                            </div>
                                            {/* Задания урока в черновике */}
                                            <div style={{ padding: "0 16px 12px" }}>
                                                {lesson.tasks.length > 0 && (
                                                    <div style={{ marginBottom: 8 }}>
                                                        {[...lesson.tasks].sort((a, b) => a.orderIndex - b.orderIndex).map((task) => (
                                                            <div key={task.id} style={{
                                                                padding: "8px 12px", background: "#fafafa", borderRadius: 6,
                                                                marginBottom: 4, display: "flex", justifyContent: "space-between",
                                                            }}>
                                                                <div>
                                                                    <Tag color="blue" style={{ fontSize: 11 }}>{task.type}</Tag>
                                                                    <Text style={{ fontSize: 13 }}>{task.question}</Text>
                                                                </div>
                                                                <Popconfirm title="Удалить задание из черновика?"
                                                                            onConfirm={() => handleDraftTaskDeleted(section.id, lesson.id, task.id)}
                                                                            okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}>
                                                                    <Button size="small" danger icon={<DeleteOutlined />} />
                                                                </Popconfirm>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <TaskForm
                                                    lessonId={lesson.id}
                                                    onCreated={(task) => {
                                                        const draftTask: DraftTaskDto = {
                                                            id: `temp-task-${Date.now()}`,
                                                            originalTaskId: undefined,
                                                            type: task.type,
                                                            question: task.question,
                                                            options: task.options ?? undefined,
                                                            correctIndex: task.correctIndex ?? undefined,
                                                            correctIndexes: task.correctIndexes ?? undefined,
                                                            correctAnswer: task.correctAnswer ?? undefined,
                                                            explanation: task.explanation ?? undefined,
                                                            points: task.points,
                                                            isRequired: task.isRequired,
                                                            orderIndex: lesson.tasks.length,
                                                        };
                                                        void handleDraftTaskCreated(section.id, lesson.id, draftTask);
                                                    }}
                                                    onCancel={() => {}}
                                                    draftMode
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {editingDraftLesson?.sectionId === section.id && !editingDraftLesson.lesson ? (
                                <DraftLessonEditor
                                    lesson={null}
                                    onSave={(data) => handleDraftSaveLesson(section.id, data)}
                                    onCancel={() => setEditingDraftLesson(null)}
                                />
                            ) : (
                                <Button icon={<PlusOutlined />} size="small" style={{ marginTop: 8 }}
                                        onClick={() => setEditingDraftLesson({ sectionId: section.id, lesson: null })}>
                                    Добавить урок
                                </Button>
                            )}
                        </Panel>
                    ))}
                </Collapse>
            )}

            <Modal open={draftSectionModal} title={editingDraftSection ? "Редактировать раздел" : "Новый раздел"}
                   onCancel={() => setDraftSectionModal(false)} footer={null} centered>
                <Form form={draftSectionForm} layout="vertical" onFinish={handleDraftSaveSection}>
                    <Form.Item label="Название" name="title" rules={[{ required: true }, { min: 2 }]}><Input /></Form.Item>
                    <Form.Item label="Описание" name="description" rules={[{ required: true }, { min: 10 }]}><Input.TextArea rows={3} /></Form.Item>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button onClick={() => setDraftSectionModal(false)}>Отмена</Button>
                        <Button type="primary" htmlType="submit" style={{ background: "rgba(0,100,0,0.8)" }}>
                            {editingDraftSection ? "Сохранить" : "Создать"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );

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
                {!isReadOnly && !isDraftReview && (
                    <Tooltip title={isUnderReview ? "Нельзя редактировать курс во время модерации" : ""}>
                        <Button icon={<EditOutlined />} disabled={isUnderReview} loading={loadingDraft} onClick={openEditForm}>
                            {isEditing ? "Редактировать метаданные" : "Редактировать курс"}
                        </Button>
                    </Tooltip>
                )}

                {(course.status === "Draft" || course.status === "RejectedByModerator") && (
                    <Button type="primary" icon={<SendOutlined />} loading={submitting}
                            style={{ background: "rgba(0,100,0,0.8)" }} onClick={handleSubmitModeration}>
                        Отправить на модерацию
                    </Button>
                )}
                {isUnderReview && (
                    <Tag color="processing" style={{ padding: "4px 12px", fontSize: 13 }}>Ожидает проверки модератора</Tag>
                )}
                {isEditing && (
                    <>
                        <Button type="primary" loading={submittingDraft}
                                style={{ background: "rgba(0,100,0,0.8)" }}
                                onClick={handleSubmitDraft}>
                            Отправить на проверку
                        </Button>
                        <Popconfirm
                            title="Отменить изменения?"
                            description="Черновик будет удалён, курс останется без изменений."
                            onConfirm={handleCancelDraft}
                            okText="Отменить изменения" cancelText="Нет"
                            okButtonProps={{ danger: true }}
                        >
                            <Button danger loading={cancellingDraft}>Отменить изменения</Button>
                        </Popconfirm>
                    </>
                )}
                {isPublished && !isEditing && !isDraftReview && (
                    <Tag color="success" style={{ padding: "4px 12px", fontSize: 13 }}>Курс опубликован</Tag>
                )}
            </div>

            <Divider />

            {/* Структура курса */}
            {loading ? <Spin /> : isEditing ? (
                // Режим редактирования черновика — всё через draft state
                renderDraftStructure()
            ) : isUnderReview || isDraftReview ? (
                <div style={{ background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 12, padding: "40px 32px", textAlign: "center" }}>
                    <div style={{ fontSize: 56, marginBottom: 20 }}>⏳</div>
                    <Text strong style={{ display: "block", fontSize: 20, color: "#d48806", marginBottom: 12 }}>
                        {isUnderReview ? "Курс отправлен на проверку" : "Изменения отправлены на проверку"}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 14, display: "block", maxWidth: 520, margin: "0 auto 24px" }}>
                        {isUnderReview
                            ? "Ваш курс проходит первичную модерацию. До завершения проверки редактирование недоступно. После одобрения курс будет опубликован и станет доступен студентам."
                            : "Ваши изменения проверяются модератором. Студенты пока видят текущую версию курса. После одобрения все изменения будут применены автоматически."}
                    </Text>
                </div>
            ) : isReadOnly ? (
                <>
                    <Alert
                        type="warning"
                        message="Режим просмотра"
                        description="Чтобы внести изменения — нажмите кнопку «Начать редактирование». Изменения пройдут модерацию перед публикацией."
                        showIcon
                        style={{ marginBottom: 16 }}
                        action={
                            <Button size="small" type="primary" style={{ background: "rgba(0,100,0,0.8)" }} onClick={handleConfirmEdit} loading={creatingDraft}>
                                Начать редактирование
                            </Button>
                        }
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>Разделы курса</Title>
                    </div>
                    {sections.length === 0 ? (
                        <Empty description="Разделов пока нет" />
                    ) : (
                        <Collapse>
                            {sections.map((section) => (
                                <Panel key={section.id} header={
                                    <span>
                                        <BookOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                                        <Text strong>{section.title}</Text>
                                        <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{section.description}</Text>
                                    </span>
                                }>
                                    {(lessonsBySection[section.id] ?? []).length === 0 ? (
                                        <Text type="secondary" style={{ fontSize: 13 }}>Уроков нет</Text>
                                    ) : (
                                        <Collapse>
                                            {(lessonsBySection[section.id] ?? []).map((lesson) => (
                                                <Panel key={lesson.id} header={
                                                    <span>
                                                        <FileTextOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                                                        <Text strong>{lesson.title}</Text>
                                                        <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{lesson.description}</Text>
                                                    </span>
                                                }>
                                                    <ReadonlyLessonContent lessonId={lesson.id} />
                                                </Panel>
                                            ))}
                                        </Collapse>
                                    )}
                                </Panel>
                            ))}
                        </Collapse>
                    )}
                </>
            ) : (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>Разделы курса</Title>
                        <Button icon={<PlusOutlined />} onClick={() => { setEditingSection(null); sectionForm.resetFields(); setSectionModalOpen(true); }}>
                            Добавить раздел
                        </Button>
                    </div>
                    {sections.length === 0 ? (
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
                </>
            )}

            {/* Модалки для не-Published курсов */}
            <Modal open={sectionModalOpen} title={editingSection ? "Редактировать раздел" : "Новый раздел"}
                   onCancel={() => setSectionModalOpen(false)} footer={null} centered>
                <Form form={sectionForm} layout="vertical" onFinish={handleSaveSection}>
                    <Form.Item label="Название" name="title" rules={[{ required: true }, { min: 2 }]}><Input /></Form.Item>
                    <Form.Item label="Описание" name="description" rules={[{ required: true }, { min: 10 }]}><Input.TextArea rows={3} /></Form.Item>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button onClick={() => setSectionModalOpen(false)}>Отмена</Button>
                        <Button type="primary" htmlType="submit" style={{ background: "rgba(0,100,0,0.8)" }}>
                            {editingSection ? "Сохранить" : "Создать"}
                        </Button>
                    </div>
                </Form>
            </Modal>

            <Modal
                open={editCourseOpen}
                title={isEditing ? "Редактировать метаданные курса (черновик)" : "Редактировать курс"}
                onCancel={() => setEditCourseOpen(false)}
                footer={null} centered width={700}
                styles={{ body: { padding: "16px 24px 24px" } }}
            >
                {isEditing && (
                    <Alert type="info" message="Изменения метаданных сохраняются в черновик и вступят в силу после одобрения модератором."
                           showIcon style={{ marginBottom: 16 }} />
                )}
                <CourseForm
                    key={editCourseKey}
                    form={courseForm}
                    categories={categories}
                    initialTags={editCourseTags}
                    onFinish={isEditing ? handleSaveCourseDraft : handleSaveCourse}
                    onCancel={() => setEditCourseOpen(false)}
                    submitLabel={isEditing ? "Сохранить в черновик" : "Сохранить"}
                    loading={savingCourse}
                    courseId={course.id}
                    onCoverUploaded={(url) => {
                        onUpdated({ ...course, coverImageUrl: url });
                        courseForm.setFieldValue("coverImageUrl", url);
                    }}
                />
            </Modal>

            {/* Modal подтверждения редактирования опубликованного курса */}
            <Modal
                open={confirmEditModalOpen}
                title="Редактировать опубликованный курс?"
                onCancel={() => setConfirmEditModalOpen(false)}
                footer={null}
                centered
            >
                <div style={{ padding: "8px 0 16px" }}>
                    <Text style={{ display: "block", marginBottom: 16 }}>
                        Этот курс уже опубликован и доступен студентам. Вы можете внести изменения, но они
                        не вступят в силу сразу — сначала пройдут проверку модератора.
                    </Text>
                    <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
                        Пока изменения на проверке, студенты продолжают видеть текущую версию курса.
                    </Text>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button onClick={() => setConfirmEditModalOpen(false)}>Только просмотр</Button>
                        <Button type="primary" loading={creatingDraft} style={{ background: "rgba(0,100,0,0.8)" }} onClick={handleConfirmEdit}>
                            Редактировать
                        </Button>
                    </div>
                </div>
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

    const handleSearch = () => { setSearch(searchInput.trim()); setPage(1); };
    const handleStatusFilter = (val: CourseStatus | "") => { setStatusFilter(val); setPage(1); };

    const handleCreateCourse = async (values: CourseFormValues, tags: string[], coverFile?: File | null) => {
        setCreating(true);
        const tagsDto: TagsDto[] = tags.map((name) => ({ name }));
        const created = await courseApi.createCourse({
            title: values.title, description: values.description,
            fullDescription: values.fullDescription, price: values.price ?? 0,
            level: values.level ?? "Beginner", certificateEnabled: values.certificateEnabled ?? false,
            categoryId: values.categoryId, coverImageUrl: values.coverImageUrl, tags: tagsDto,
        });
        if (created) {
            let finalCourse = created;
            // Загружаем файл обложки если был выбран
            if (coverFile) {
                const formData = new FormData();
                formData.append("file", coverFile);
                const authHeaders = authStorage.getAuthHeaders() as Record<string, string>;
                const { "Content-Type": _, ...headersWithoutContentType } = authHeaders;
                const res = await fetch(`${API_URL}/Courses/${created.id}/cover`, {
                    method: "POST", headers: headersWithoutContentType, body: formData,
                });
                if (res.ok) {
                    const data = await res.json();
                    finalCourse = { ...created, coverImageUrl: data.coverImageUrl };
                } else {
                    message.warning("Курс создан, но обложку загрузить не удалось");
                }
            }
            setAllCourses((p) => [finalCourse, ...p]);
            message.success("Курс создан");
            setCreateModalOpen(false);
            createForm.resetFields();
            setSelectedCourse(finalCourse);
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

                            <div style={{ marginBottom: 20 }}>
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
                                    <Row gutter={[20, 20]}>
                                        {paginatedCourses.map((course) => (
                                            <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
                                                <div
                                                    onClick={() => setSelectedCourse(course)}
                                                    style={{
                                                        background: "#fff", borderRadius: 10,
                                                        border: "1px solid #f0f0f0", padding: 16,
                                                        cursor: "pointer", transition: "box-shadow 0.2s",
                                                        height: "100%", display: "flex", flexDirection: "column",
                                                    }}
                                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; }}
                                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                                                >
                                                    <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 6, marginBottom: 12, overflow: "hidden" }}>
                                                        {course.coverImageUrl
                                                            ? <img src={getImageUrl(course.coverImageUrl)} alt={course.title}
                                                                   style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                                            : <div style={{ ...COVER_PLACEHOLDER_STYLE, width: "100%", height: "100%" }}>🎓</div>
                                                        }
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                                        <Tag color={statusColor[course.status]} style={{ fontSize: 11 }}>
                                                            {statusLabel[course.status]}
                                                        </Tag>
                                                        <Tag style={{ fontSize: 11 }}>{levelLabel[course.level]}</Tag>
                                                    </div>
                                                    <Text strong style={{ fontSize: 14, display: "block", marginBottom: 4, lineHeight: 1.4 }}>
                                                        {course.title}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: 12, flex: 1 }}>
                                                        {course.description.length > 70 ? course.description.slice(0, 70) + "..." : course.description}
                                                    </Text>
                                                    <Divider style={{ margin: "10px 0" }} />
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <Text type="secondary" style={{ fontSize: 11 }}>{course.enrollmentCount} студентов</Text>
                                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                                            {course.price === 0 ? "Бесплатно" : `${course.price} ₽`}
                                                        </Text>
                                                    </div>
                                                    {course.tags && course.tags.length > 0 && (
                                                        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                                                            {course.tags.slice(0, 2).map((t) => (
                                                                <Tag key={t.name} style={{ fontSize: 10, margin: 0 }}>{t.name}</Tag>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {course.status === "RejectedByModerator" && (
                                                        <div style={{ marginTop: 8 }}>
                                                            <Tag color="error" icon={<QuestionCircleOutlined />} style={{ fontSize: 11 }}>
                                                                Требует исправлений
                                                            </Tag>
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>

                                    {filteredCourses.length > PAGE_SIZE && (
                                        <div style={{ textAlign: "center", marginTop: 32 }}>
                                            <Pagination
                                                current={page} pageSize={PAGE_SIZE}
                                                total={filteredCourses.length} onChange={setPage}
                                                showSizeChanger={false} showTotal={(t) => `Всего: ${t}`}
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