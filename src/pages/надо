import {Alert, Button, Checkbox, Divider, Input, Layout, Menu, Progress, Radio, Space, Spin, Typography} from "antd";
import {useParams, useNavigate} from "react-router-dom";
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
                      task, answer, submissions, submitting, onAnswerChange, onSubmit,
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
        <div style={{background: "#fff", borderRadius: 12, padding: 24, marginTop: 16, border: "1px solid #f0f0f0"}}>
            <Text type="secondary" style={{fontSize: 13}}>
                {task.isRequired ? "Обязательное" : "Необязательное"} · {task.points} очков
            </Text>
            <Title level={5} style={{marginTop: 8, marginBottom: 16}}>{task.question}</Title>

            {task.type === "SingleChoice" && task.options && (
                <Radio.Group disabled={isCorrect} value={answer?.answerIndex}
                             onChange={e => onAnswerChange({answerIndex: e.target.value})} style={{width: "100%"}}>
                    <Space direction="vertical" style={{width: "100%"}}>
                        {task.options.map((opt, i) => <Radio key={i} value={i}>{opt}</Radio>)}
                    </Space>
                </Radio.Group>
            )}
            {task.type === "MultiChoice" && task.options && (
                <Checkbox.Group disabled={isCorrect} value={answer?.answerIndexes ?? []}
                                onChange={vals => onAnswerChange({answerIndexes: vals as number[]})} style={{width: "100%"}}>
                    <Space direction="vertical" style={{width: "100%"}}>
                        {task.options.map((opt, i) => <Checkbox key={i} value={i}>{opt}</Checkbox>)}
                    </Space>
                </Checkbox.Group>
            )}
            {task.type === "TextInput" && (
                <Input.TextArea disabled={isCorrect} rows={3} value={answer?.answerText ?? ""}
                                onChange={e => onAnswerChange({answerText: e.target.value})}
                                placeholder="Введите ваш ответ..." style={{width: "100%"}}/>
            )}

            {visibleHints.map((hint, i) => (
                <Alert key={i} icon={<BulbOutlined/>} showIcon type="warning"
                       message={`Подсказка ${i + 1}`} description={hint} style={{marginTop: 12}}/>
            ))}

            {submissions.length > 0 && (
                <Alert style={{marginTop: 12}} type={isCorrect ? "success" : "error"}
                       message={isCorrect
                           ? `Верно! +${submissions.find(s => s.isCorrect)?.score ?? 0} очков`
                           : allHintsShown ? "Все подсказки исчерпаны. Изучите материал ещё раз."
                               : "Неверно. Попробуйте ещё раз."}/>
            )}

            {!isCorrect && (
                <Button type="primary" style={{marginTop: 16, background: "rgba(0,100,0,0.8)"}}
                        loading={submitting} onClick={onSubmit}>
                    Ответить
                </Button>
            )}
        </div>
    );
};

const CourseLearningPage = () => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();

    const [courseName, setCourseName] = useState("");
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
    const [progressPercent, setProgressPercent] = useState(0);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [navigating, setNavigating] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const [courseRes, sectionsRes, enrollmentRes] = await Promise.all([
                    fetch(`${API_URL}/Courses/${id}`, {headers: authStorage.getAuthHeaders()}),
                    fetch(`${API_URL}/Courses/${id}/sections`, {headers: authStorage.getAuthHeaders()}),
                    fetch(`${API_URL}/Enrollments`, {headers: authStorage.getAuthHeaders()}),
                ]);
                if (courseRes.ok) setCourseName((await courseRes.json()).title);
                if (sectionsRes.ok) setSections(await sectionsRes.json());
                if (enrollmentRes.ok) {
                    const enrollments = await enrollmentRes.json();
                    const enrollment = enrollments.find((e: {courseId: string; progressPercent: number}) => e.courseId === id);
                    if (enrollment) setProgressPercent(enrollment.progressPercent);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    const fetchLessonsForSection = async (sectionId: string) => {
        if (lessonsBySection[sectionId]) return;
        try {
            const res = await fetch(`${API_URL}/Sections/${sectionId}/lessons`, {headers: authStorage.getAuthHeaders()});
            if (!res.ok) return;
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
        window.scrollTo({top: 0, behavior: "smooth"});
        try {
            const [lessonRes, tasksRes] = await Promise.all([
                fetch(`${API_URL}/Lessons/${lessonId}`, {headers: authStorage.getAuthHeaders()}),
                fetch(`${API_URL}/lessons/${lessonId}/tasks`, {headers: authStorage.getAuthHeaders()}),
            ]);
            if (!lessonRes.ok) return;
            setSelectedLesson(await lessonRes.json());
            setTasks(tasksRes.ok ? await tasksRes.json() : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingLesson(false);
        }
    };

    const completeCurrentLesson = async () => {
        if (!selectedLessonId || completedLessons.has(selectedLessonId)) return;
        try {
            const res = await fetch(`${API_URL}/Lessons/${selectedLessonId}/complete`, {
                method: "POST",
                headers: authStorage.getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setCompletedLessons(prev => new Set([...prev, selectedLessonId]));
                setProgressPercent(data.progressPercent);
            }
        } catch (e) {
            console.error(e);
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
            if (!res.ok) return;
            const data: TaskSubmissionDto = await res.json();
            setSubmissions(prev => ({...prev, [taskId]: [...(prev[taskId] ?? []), data]}));
            if (!data.isCorrect) {
                setAnswers(prev => {const next = {...prev}; delete next[taskId]; return next;});
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(prev => ({...prev, [taskId]: false}));
        }
    };

    const handleNextLesson = async () => {
        setNavigating(true);
        await completeCurrentLesson();
        if (!selectedLessonId) { setNavigating(false); return; }

        for (let si = 0; si < sections.length; si++) {
            const sectionLessons = lessonsBySection[sections[si].id] ?? [];
            const idx = sectionLessons.findIndex(l => l.id === selectedLessonId);
            if (idx === -1) continue;
            if (idx < sectionLessons.length - 1) {
                await fetchLesson(sectionLessons[idx + 1].id);
                setNavigating(false);
                return;
            }
            for (let nextSi = si + 1; nextSi < sections.length; nextSi++) {
                await fetchLessonsForSection(sections[nextSi].id);
                const nextLessons = lessonsBySection[sections[nextSi].id] ?? [];
                if (nextLessons.length > 0) {
                    await fetchLesson(nextLessons[0].id);
                    setNavigating(false);
                    return;
                }
            }
            break;
        }
        setNavigating(false);
    };

    const handleFinishCourse = async () => {
        setNavigating(true);
        await completeCurrentLesson();
        navigate(`/course/${id}`);
    };

    const isLastLesson = () => {
        if (!selectedLessonId) return false;
        const lastSection = sections[sections.length - 1];
        if (!lastSection) return false;
        const lastLessons = lessonsBySection[lastSection.id] ?? [];
        return lastLessons[lastLessons.length - 1]?.id === selectedLessonId;
    };

    const menuItems = sections.map(section => ({
        key: section.id,
        label: section.title,
        children: (lessonsBySection[section.id] ?? []).map(lesson => ({
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
                    {!collapsed && (
                        <div style={{padding: "16px 16px 12px", borderBottom: "1px solid #f0f0f0"}}>
                            {courseName && (
                                <Text strong style={{fontSize: 14, color: "#333", display: "block", marginBottom: 12}}>
                                    {courseName}
                                </Text>
                            )}
                            <div style={{display: "flex", justifyContent: "space-between", marginBottom: 6}}>
                                <Text type="secondary" style={{fontSize: 12}}>Прогресс курса</Text>
                                <Text strong style={{fontSize: 12, color: "#389e0d"}}>{progressPercent}%</Text>
                            </div>
                            <Progress percent={progressPercent} showInfo={false}
                                      strokeColor="#52c41a" trailColor="#f0f0f0" size="small"/>
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
                            style={{height: "calc(100% - 110px)", borderRight: 0, paddingTop: 8, overflowY: "auto"}}
                            items={menuItems}
                            onOpenChange={openKeys => {
                                openKeys.forEach(key => {
                                    if (sections.some(s => s.id === key)) fetchLessonsForSection(key);
                                });
                            }}
                            onClick={({key}) => {
                                const isLesson = Object.values(lessonsBySection).flat().some(l => l.id === key);
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
                                </div>
                            )}

                            <div style={{marginTop: 48, display: "flex", justifyContent: "flex-end"}}>
                                {isLastLesson() ? (
                                    <Button type="primary" size="large" loading={navigating}
                                            style={{background: "rgba(0,100,0,0.8)", minWidth: 200}}
                                            onClick={handleFinishCourse}>
                                         Завершить курс
                                    </Button>
                                ) : (
                                    <Button type="primary" size="large" loading={navigating}
                                            style={{background: "rgba(0,100,0,0.8)", minWidth: 200}}
                                            onClick={handleNextLesson}>
                                        Следующий урок →
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            textAlign: "center", paddingTop: 120, display: "flex",
                            flexDirection: "column", alignItems: "center", gap: 16,
                        }}>
                            <BookOutlined style={{fontSize: 56, color: "#bbb"}}/>
                            <Text style={{fontSize: 16, color: "#bbb"}}>Выберите урок из меню слева</Text>
                        </div>
                    )}
                </Content>
            </Layout>
            <Footer/>
        </>
    );
};

export default CourseLearningPage;