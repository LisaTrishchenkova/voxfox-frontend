import {Alert, Button, Checkbox, Divider, Input, Layout, Menu, Radio, Space, Spin, Typography} from "antd";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {LessonDto, SectionDto} from "../../api/types/course.ts";
import type {TaskStudentDto, TaskSubmissionDto, SubmitTaskRequest} from "../../api/types/task.ts";
import {authStorage} from "../../services/auth-storage.service.ts";
import {API_URL} from "../../config.ts";
import {BookOutlined, BulbOutlined} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";

const {Sider, Content} = Layout;
const {Title, Text} = Typography;

const TaskCard = ({
                      task,
                      answer,
                      submissions,
                      submitting,
                      onAnswerChange,
                      onSubmit,
                  }: {
    task: TaskStudentDto;
    answer?: SubmitTaskRequest;
    submissions: TaskSubmissionDto[];
    submitting: boolean;
    onAnswerChange: (val: SubmitTaskRequest) => void;
    onSubmit: () => void;
}) => {
    const wrongAttempts = submissions.filter(s => !s.isCorrect).length;
    const isCorrect = submissions.some(s => s.isCorrect);
    const hints = task.hints ?? [];
    const visibleHints = hints.slice(0, wrongAttempts);
    const allHintsShown = wrongAttempts >= hints.length && hints.length > 0;

    return (
        <div style={{
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            marginTop: 16,
            border: "1px solid #f0f0f0"
        }}>
            <Text type="secondary" style={{fontSize: 13}}>
                {task.isRequired ? "Обязательное" : "Необязательное"} · {task.points} очков
            </Text>
            <Title level={5} style={{marginTop: 8, marginBottom: 16}}>{task.question}</Title>

            {task.type === "SingleChoice" && task.options && (
                <Radio.Group
                    disabled={isCorrect}
                    value={answer?.answerIndex}
                    onChange={e => onAnswerChange({answerIndex: e.target.value})}
                    style={{width: "100%"}}
                >
                    <Space direction="vertical" style={{width: "100%"}}>
                        {task.options.map((opt, i) => <Radio key={i} value={i}>{opt}</Radio>)}
                    </Space>
                </Radio.Group>
            )}

            {task.type === "MultiChoice" && task.options && (
                <Checkbox.Group
                    disabled={isCorrect}
                    value={answer?.answerIndexes ?? []}
                    onChange={vals => onAnswerChange({answerIndexes: vals as number[]})}
                    style={{width: "100%"}}
                >
                    <Space direction="vertical" style={{width: "100%"}}>
                        {task.options.map((opt, i) => <Checkbox key={i} value={i}>{opt}</Checkbox>)}
                    </Space>
                </Checkbox.Group>
            )}

            {task.type === "TextInput" && (
                <Input.TextArea
                    disabled={isCorrect}
                    rows={3}
                    value={answer?.answerText ?? ""}
                    onChange={e => onAnswerChange({answerText: e.target.value})}
                    placeholder="Введите ваш ответ..."
                    style={{width: "100%"}}
                />
            )}

            {/* подсказки — по одной за каждую неверную попытку */}
            {visibleHints.map((hint, i) => (
                <Alert
                    key={i}
                    icon={<BulbOutlined/>}
                    showIcon
                    type="warning"
                    message={`Подсказка ${i + 1}`}
                    description={hint}
                    style={{marginTop: 12}}
                />
            ))}

            {submissions.length > 0 && (
                <Alert
                    style={{marginTop: 12}}
                    type={isCorrect ? "success" : "error"}
                    message={isCorrect
                        ? `Верно! +${submissions.find(s => s.isCorrect)?.score ?? 0} очков`
                        : allHintsShown
                            ? "Все подсказки исчерпаны. Изучите материал ещё раз."
                            : "Неверно. Попробуйте ещё раз."
                    }
                />
            )}

            {!isCorrect && (
                <Button
                    type="primary"
                    style={{marginTop: 16, background: "rgba(0,100,0,0.8)"}}
                    loading={submitting}
                    onClick={onSubmit}
                >
                    Ответить
                </Button>
            )}
        </div>
    );
};

const CourseLearningPage = () => {
    const {id} = useParams<{ id: string }>();

    const [courseName, setCourseName] = useState<string>("");
    const [sections, setSections] = useState<SectionDto[]>([]);
    const [lessonsBySection, setLessonsBySection] = useState<Record<string, LessonDto[]>>({});
    const [selectedLesson, setSelectedLesson] = useState<LessonDto | null>(null);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [tasks, setTasks] = useState<TaskStudentDto[]>([]);

    const [submissions, setSubmissions] = useState<Record<string, TaskSubmissionDto[]>>({});
    const [answers, setAnswers] = useState<Record<string, SubmitTaskRequest>>({});
    const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
    const [loadingLesson, setLoadingLesson] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseAndSections = async () => {
            try {
                const [courseRes, sectionsRes] = await Promise.all([
                    fetch(`${API_URL}/Courses/${id}`, {headers: authStorage.getAuthHeaders()}),
                    fetch(`${API_URL}/Courses/${id}/sections`, {headers: authStorage.getAuthHeaders()}),
                ]);
                if (courseRes.ok) {
                    const course = await courseRes.json();
                    setCourseName(course.title);
                }
                if (sectionsRes.ok) {
                    const data: SectionDto[] = await sectionsRes.json();
                    setSections(data);
                }

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseAndSections();
    }, [id]);

    const fetchLessonsForSection = async (sectionId: string) => {
        if (lessonsBySection[sectionId]) return;
        try {
            const res = await fetch(`${API_URL}/Sections/${sectionId}/lessons`, {
                headers: authStorage.getAuthHeaders(),
            });
            if (!res.ok) throw new Error();
            const data: LessonDto[] = await res.json();
            setLessonsBySection(prev => ({...prev, [sectionId]: data}));
        } catch (e) {
            console.error(e);
        }
    };

    const fetchLesson = async (lessonId: string) => {
        setLoadingLesson(true);
        setTasks([]);
        setSubmissions({});
        setAnswers({});
        setSelectedLessonId(lessonId);
        window.scrollTo({ top: 0, behavior: "smooth" });
        try {
            const [lessonRes, tasksRes] = await Promise.all([
                fetch(`${API_URL}/Lessons/${lessonId}`, {headers: authStorage.getAuthHeaders()}),
                fetch(`${API_URL}/lessons/${lessonId}/tasks`, {headers: authStorage.getAuthHeaders()}),
            ]);
            if (!lessonRes.ok) throw new Error();
            const lessonData: LessonDto = await lessonRes.json();
            const tasksData: TaskStudentDto[] = tasksRes.ok ? await tasksRes.json() : [];
            setSelectedLesson(lessonData);
            setTasks(tasksData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingLesson(false);
        }
    };

    const submitTask = async (taskId: string) => {
        const answer = answers[taskId];
        if (!answer) return;
        setSubmitting(prev => ({...prev, [taskId]: true}));
        try {
            const res = await fetch(`${API_URL}/tasks/${taskId}/submit`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
                body: JSON.stringify(answer),
            });
            if (!res.ok) throw new Error();
            const data: TaskSubmissionDto = await res.json();
            setSubmissions(prev => ({ ...prev,
                [taskId]: [...(prev[taskId] ?? []), data],}));
            if (!data.isCorrect) {
                setAnswers(prev => {
                    const next = {...prev};
                    delete next[taskId];
                    return next;
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(prev => ({...prev, [taskId]: false}));
        }
    };

    const goToNextLesson = async () => {
        if (!selectedLessonId) return;
        for (let si = 0; si < sections.length; si++) {
            const sectionLessons = lessonsBySection[sections[si].id] ?? [];
            const lessonIndex = sectionLessons.findIndex(l => l.id === selectedLessonId);
            if (lessonIndex === -1) continue;

            // следующий урок в той же секции
            if (lessonIndex < sectionLessons.length - 1) {
                fetchLesson(sectionLessons[lessonIndex + 1].id);
                return;
            }
            // первый урок следующей секции
            for (let nextSi = si + 1; nextSi < sections.length; nextSi++) {
                const nextSection = sections[nextSi];
                await fetchLessonsForSection(nextSection.id);
                const nextLessons = lessonsBySection[nextSection.id] ?? [];
                if (nextLessons.length > 0) {
                    fetchLesson(nextLessons[0].id);
                }
                return;
            }
            return;
        }
    };

    const isLastLesson = () => {
        if (!selectedLessonId) return false;
        const lastSection = sections[sections.length - 1];
        if (!lastSection) return false;
        const lastSectionLessons = lessonsBySection[lastSection.id] ?? [];
        return lastSectionLessons[lastSectionLessons.length - 1]?.id === selectedLessonId;
    };



    const menuItems = sections.map((section) => ({
        key: section.id,
        label: section.title,
        children: (lessonsBySection[section.id] ?? []).map((lesson) => ({
            key: lesson.id,
            label: lesson.title,
            icon: <BookOutlined/>,
        })),
    }));

    return (
        <>
            <Header/>
            <Layout style={{minHeight: "calc(100vh - 64px)"}}>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    width={300}
                    style={{background: "#fff", borderRight: "1px solid #f0f0f0"}}
                    theme="light"
                >
                    {!collapsed && courseName && (
                        <div style={{
                            padding: "20px 16px 12px",
                            borderBottom: "1px solid #f0f0f0",
                        }}>
                            <Text strong style={{fontSize: 14, color: "#333"}}>
                                {courseName}
                            </Text>
                        </div>
                    )}
                    {loading ? (
                        <div style={{padding: 24, textAlign: "center"}}>
                            <Spin/>
                        </div>
                    ) : (
                        <Menu
                            selectedKeys={selectedLessonId ? [selectedLessonId] : []}
                            mode="inline"
                            style={{height: "100%", borderRight: 0, paddingTop: 8}}
                            items={menuItems}
                            onOpenChange={(openKeys) => {
                                openKeys.forEach(key => {
                                    if (sections.some(s => s.id === key)) {
                                        fetchLessonsForSection(key);
                                    }
                                });
                            }}
                            onClick={({key}) => {
                                const isLesson = Object.values(lessonsBySection)
                                    .flat()
                                    .some(l => l.id === key);
                                if (isLesson) fetchLesson(key);
                            }}
                        />
                    )}
                </Sider>

                <Content style={{padding: "40px 60px", background: "#fafafa"}}>
                    {loadingLesson ? (
                        <div style={{textAlign: "center", paddingTop: 80}}>
                            <Spin size="large"/>
                        </div>
                    ) : selectedLesson ? (
                        <div style={{maxWidth: 800}}>
                            <Title level={2}>{selectedLesson.title}</Title>
                            <Text type="secondary">{selectedLesson.description}</Text>
                            <Divider/>
                            {selectedLesson.content && (
                                <div style={{fontSize: 15, lineHeight: 1.8}}>
                                    <ReactMarkdown>{selectedLesson.content}</ReactMarkdown>
                                </div>
                            )}

                            {tasks.length > 0 && (
                                <div style={{marginTop: 40}}>
                                    <Divider/>
                                    <Title level={4}>Задания</Title>
                                    {tasks.map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            answer={answers[task.id]}
                                            submissions={submissions[task.id] ?? []}
                                            submitting={submitting[task.id] ?? false}
                                            onAnswerChange={val => setAnswers(prev => ({...prev, [task.id]: val}))}
                                            onSubmit={() => submitTask(task.id)}
                                        />
                                    ))}
                                    <div style={{marginTop: 48, display: "flex", justifyContent: "flex-end"}}>
                                        {!isLastLesson() && (
                                            <Button
                                                type="primary"
                                                size="large"
                                                style={{background: "rgba(0,100,0,0.8)", minWidth: 200}}
                                                onClick={goToNextLesson}
                                            >
                                                Следующий урок →
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: "center",
                            paddingTop: 120,
                            color: "#bbb",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 16
                        }}>
                            <BookOutlined style={{fontSize: 56}}/>
                            <Text style={{fontSize: 16, color: "#bbb"}}>
                                Выберите урок из меню слева
                            </Text>
                        </div>
                    )}
                </Content>
            </Layout>
            <Footer/>
        </>
    );
};

export default CourseLearningPage;