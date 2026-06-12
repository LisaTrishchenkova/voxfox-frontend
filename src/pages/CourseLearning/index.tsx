import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Input,
  Layout,
  Menu,
  Modal,
  Progress,
  Radio,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { LessonDto, SectionDto } from "../../api/types/course.ts";
import type {
  TaskStudentDto,
  TaskSubmissionDto,
  SubmitTaskRequest,
} from "../../api/types/task.ts";
import type { QuestionDto } from "../../api/types/question.ts";
import type { CertificateDto } from "../../api/types/certificate.ts";
import { authStorage } from "../../services/auth-storage.service.ts";
import { questionApi } from "../../api/questionApi.ts";
import { certificateApi } from "../../api/certificateApi.ts";
import { API_URL } from "../../config.ts";
import {
  BookOutlined,
  BulbOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { markdownComponents } from "../../components/markdownComponents";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import leoProfanity from "leo-profanity";
import CertificateView from "../../components/CertificateView.tsx";
import remarkGfm from "remark-gfm";
import AchievementPopup from "../../components/AchievementPopup.tsx";
import type { NewAchievement } from "../../components/AchievementPopup.tsx";
import { achievementApi } from "../../api/achievementApi.ts";

leoProfanity.loadDictionary("ru");

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

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
  const wrongAttempts = submissions.filter((s) => !s.isCorrect).length;
  const isCorrect = submissions.some((s) => s.isCorrect);
  const correctSubmission = submissions.find((s) => s.isCorrect);
  const lastSubmission = submissions[submissions.length - 1];
  const hints = task.hints ?? [];
  const visibleHints = hints.slice(0, wrongAttempts);
  const allHintsShown = wrongAttempts >= hints.length && hints.length > 0;

  const displayAnswer = (): string | null => {
    if (!isCorrect || !correctSubmission) return null;
    if (task.type === "SingleChoice" && correctSubmission.answerIndex != null && task.options)
      return task.options[correctSubmission.answerIndex] ?? null;
    if (task.type === "MultiChoice" && correctSubmission.answerIndexes && task.options)
      return correctSubmission.answerIndexes.map((i) => task.options![i]).join(", ");
    if (task.type === "TextInput") return correctSubmission.answerText ?? null;
    return null;
  };

  const userAnswer = displayAnswer();

  return (
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, marginTop: 16, border: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          {isCorrect
              ? <CheckCircleFilled style={{ color: "#52c41a", fontSize: 16 }} />
              : <CheckCircleOutlined style={{ color: "#d9d9d9", fontSize: 16 }} />
          }
          <Text type="secondary" style={{ fontSize: 13 }}>
            {task.isRequired ? "Обязательное" : "Необязательное"} · {task.points} очков
          </Text>
        </div>
        <Title level={5} style={{ marginTop: 8, marginBottom: 16 }}>{task.question}</Title>

        {task.type === "SingleChoice" && task.options && (
            <Radio.Group
                disabled={isCorrect}
                value={isCorrect ? correctSubmission?.answerIndex : answer?.answerIndex}
                onChange={(e) => onAnswerChange({ answerIndex: e.target.value })}
                style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {task.options.map((opt, i) => <Radio key={i} value={i}>{opt}</Radio>)}
              </Space>
            </Radio.Group>
        )}
        {task.type === "MultiChoice" && task.options && (
            <Checkbox.Group
                disabled={isCorrect}
                value={isCorrect ? (correctSubmission?.answerIndexes ?? []) : (answer?.answerIndexes ?? [])}
                onChange={(vals) => onAnswerChange({ answerIndexes: vals as number[] })}
                style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {task.options.map((opt, i) => <Checkbox key={i} value={i}>{opt}</Checkbox>)}
              </Space>
            </Checkbox.Group>
        )}
        {task.type === "TextInput" && (
            <Input.TextArea
                disabled={isCorrect}
                rows={3}
                value={isCorrect ? (correctSubmission?.answerText ?? "") : (answer?.answerText ?? "")}
                onChange={(e) => onAnswerChange({ answerText: e.target.value })}
                placeholder="Введите ваш ответ..."
                style={{ width: "100%" }}
            />
        )}

        {visibleHints.map((hint, i) => (
            <Alert key={i} icon={<BulbOutlined />} showIcon type="warning"
                   message={`Подсказка ${i + 1}`} description={hint} style={{ marginTop: 12 }} />
        ))}

        {isCorrect && (
            <Alert style={{ marginTop: 12 }} type="success" message={
              <div>
                <div>Верно! +{correctSubmission?.score ?? 0} очков</div>
                {userAnswer && <div style={{ marginTop: 4, fontSize: 12, color: "#555" }}>Ваш ответ: <strong>{userAnswer}</strong></div>}
              </div>
            } />
        )}

        {!isCorrect && lastSubmission && (
            <Alert style={{ marginTop: 12 }} type="error"
                   message={allHintsShown ? "Все подсказки исчерпаны. Изучите материал ещё раз." : "Неверно. Попробуйте ещё раз."} />
        )}

        {!isCorrect && (
            <Button type="primary" style={{ marginTop: 16, background: "rgba(0,100,0,0.8)" }} loading={submitting} onClick={onSubmit}>
              Ответить
            </Button>
        )}
      </div>
  );
};

const QuestionCard = ({
                        question, onAnswer, onDelete, currentUserId, highlighted,
                      }: {
  question: QuestionDto;
  onAnswer: (questionId: string, text: string) => Promise<void>;
  onDelete: (questionId: string) => Promise<void>;
  currentUserId: string | null;
  highlighted?: boolean;
}) => {
  const [answerText, setAnswerText] = useState("");
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwnQuestion = currentUserId === question.authorId;
  const canAnswer = !question.isAnswered && currentUserId && !isOwnQuestion;

  const handleAnswer = async () => {
    if (!answerText.trim()) return;
    setSubmitting(true);
    await onAnswer(question.id, answerText);
    setAnswerText("");
    setShowAnswerForm(false);
    setSubmitting(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(question.id);
    setDeleting(false);
  };

  return (
      <div style={{
        background: "#fff", borderRadius: 12, padding: 20, marginTop: 12,
        border: highlighted ? "2px solid #52c41a" : "1px solid #f0f0f0",
        transition: "border 0.3s",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <Text strong style={{ fontSize: 13 }}>{question.authorName ?? "Аноним"}</Text>
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
              {new Date(question.createdAt).toLocaleDateString("ru-RU")}
            </Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {question.isAnswered ? <Tag color="green">Отвечено</Tag> : <Tag color="orange">Без ответа</Tag>}
            {isOwnQuestion && (
                <Button size="small" danger loading={deleting} onClick={handleDelete}>Удалить</Button>
            )}
          </div>
        </div>

        <Text style={{ fontSize: 14 }}>{question.text}</Text>

        {question.isAnswered && question.answerText && (
            <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(0,100,0,0.05)", borderRadius: 8, borderLeft: "3px solid #52c41a" }}>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                Ответ от {question.answeredByName ?? "преподавателя"}
                {question.answeredAt && ` · ${new Date(question.answeredAt).toLocaleDateString("ru-RU")}`}
              </Text>
              <Text style={{ fontSize: 14 }}>{question.answerText}</Text>
            </div>
        )}

        {canAnswer && (
            <div style={{ marginTop: 12 }}>
              {!showAnswerForm ? (
                  <Button size="small" onClick={() => setShowAnswerForm(true)}>Ответить</Button>
              ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Input.TextArea rows={3} value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder="Введите ответ..." />
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button type="primary" size="small" loading={submitting} icon={<SendOutlined />}
                              style={{ background: "rgba(0,100,0,0.8)" }} onClick={handleAnswer}>
                        Отправить
                      </Button>
                      <Button size="small" onClick={() => setShowAnswerForm(false)}>Отмена</Button>
                    </div>
                  </div>
              )}
            </div>
        )}

        {isOwnQuestion && !question.isAnswered && (
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 8 }}>
              Это ваш вопрос — ожидайте ответа от преподавателя
            </Text>
        )}
      </div>
  );
};

const CourseLearningPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const targetQuestionId = new URLSearchParams(location.search).get("questionId");
  const currentUserId = authStorage.getUserData<string>();

  const LAST_LESSON_KEY = `voxfox_${currentUserId}_last_lesson_${id}`;
  const COMPLETED_KEY = `voxfox_${currentUserId}_completed_${id}`;

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
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // сертификат
  const [certificate, setCertificate] = useState<CertificateDto | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);

  // ачивки
  const [newAchievements, setNewAchievements] = useState<NewAchievement[]>([]);
  // флаг — после закрытия попапа ачивок нужно перейти на страницу курса
  const [pendingFinishNavigate, setPendingFinishNavigate] = useState(false);
  // коды ачивок уже показанных — чтобы не дублировать
  const shownAchievementsRef = useRef<Set<string>>(new Set());

  const scrolledRef = useRef<string | null>(null);

  useEffect(() => {
    if (!targetQuestionId || questions.length === 0) return;
    if (scrolledRef.current === targetQuestionId) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`question-${targetQuestionId}`);
      if (el) {
        scrolledRef.current = targetQuestionId;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.transition = "box-shadow 0.4s";
        el.style.boxShadow = "0 0 0 3px #52c41a";
        setTimeout(() => { el.style.boxShadow = ""; }, 2500);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [targetQuestionId, questions]);

  const fetchLesson = async (lessonId: string) => {
    setLoadingLesson(true);
    setTasks([]);
    setSubmissions({});
    setAnswers({});
    setQuestions([]);
    scrolledRef.current = null;
    setSelectedLessonId(lessonId);
    localStorage.setItem(LAST_LESSON_KEY, lessonId);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const [lessonRes, tasksRes] = await Promise.all([
        fetch(`${API_URL}/Lessons/${lessonId}`, { headers: authStorage.getAuthHeaders() }),
        fetch(`${API_URL}/lessons/${lessonId}/tasks`, { headers: authStorage.getAuthHeaders() }),
      ]);
      if (!lessonRes.ok) return;
      setSelectedLesson(await lessonRes.json());

      const tasksData: TaskStudentDto[] = tasksRes.ok ? await tasksRes.json() : [];
      setTasks(tasksData);

      if (tasksData.length > 0) {
        const submissionsMap: Record<string, TaskSubmissionDto[]> = {};
        await Promise.all(
            tasksData.map(async (task) => {
              try {
                const subRes = await fetch(`${API_URL}/tasks/${task.id}/my-submission`, { headers: authStorage.getAuthHeaders() });
                if (subRes.ok) {
                  const sub: TaskSubmissionDto = await subRes.json();
                  submissionsMap[task.id] = [sub];
                }
              } catch { /* нет submission */ }
            })
        );
        setSubmissions(submissionsMap);
      }

      const qs = await questionApi.getLessonQuestions(lessonId);
      setQuestions(qs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLesson(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [courseRes, sectionsRes, enrollmentRes] = await Promise.all([
          fetch(`${API_URL}/Courses/${id}`, { headers: authStorage.getAuthHeaders() }),
          fetch(`${API_URL}/Courses/${id}/sections`, { headers: authStorage.getAuthHeaders() }),
          fetch(`${API_URL}/Enrollments`, { headers: authStorage.getAuthHeaders() }),
        ]);

        if (courseRes.ok) setCourseName((await courseRes.json()).title);

        let fetchedSections: SectionDto[] = [];
        if (sectionsRes.ok) {
          fetchedSections = await sectionsRes.json();
          setSections(fetchedSections);
        }

        if (enrollmentRes.ok) {
          const enrollments = await enrollmentRes.json();
          const enrollment = enrollments.find(
              (e: { courseId: string; progressPercent: number }) => e.courseId === id
          );
          if (enrollment) setProgressPercent(enrollment.progressPercent);
        }

        const allLessonsData: Record<string, LessonDto[]> = {};
        await Promise.all(
            fetchedSections.map(async (section) => {
              const res = await fetch(`${API_URL}/Sections/${section.id}/lessons`, { headers: authStorage.getAuthHeaders() });
              if (res.ok) allLessonsData[section.id] = await res.json();
            })
        );
        setLessonsBySection(allLessonsData);

        try {
          const saved = localStorage.getItem(COMPLETED_KEY);
          if (saved) setCompletedLessons(new Set(JSON.parse(saved) as string[]));
        } catch { /* ignore */ }

        const savedLessonId = localStorage.getItem(LAST_LESSON_KEY);
        if (savedLessonId) {
          const lessonExists = Object.values(allLessonsData).flat().some((l) => l.id === savedLessonId);
          if (lessonExists) await fetchLesson(savedLessonId);
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
      const res = await fetch(`${API_URL}/Sections/${sectionId}/lessons`, { headers: authStorage.getAuthHeaders() });
      if (!res.ok) return;
      const data: LessonDto[] = await res.json();
      setLessonsBySection((prev) => ({ ...prev, [sectionId]: data }));
    } catch (e) { console.error(e); }
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
        const newCompleted = new Set([...completedLessons, selectedLessonId]);
        setCompletedLessons(newCompleted);
        setProgressPercent(data.progressPercent);
        localStorage.setItem(COMPLETED_KEY, JSON.stringify([...newCompleted]));

        // показываем попап если получены новые ачивки
        if (data.newAchievements && data.newAchievements.length > 0) {
          const fresh = (data.newAchievements as NewAchievement[]).filter(
              (a) => !shownAchievementsRef.current.has(a.code)
          );
          fresh.forEach((a) => shownAchievementsRef.current.add(a.code));
          if (fresh.length > 0) setNewAchievements(fresh);
        }
      }
    } catch (e) { console.error(e); }
  };

  const submitTask = async (taskId: string) => {
    const answer = answers[taskId];
    if (!answer) return;
    setSubmitting((prev) => ({ ...prev, [taskId]: true }));
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/submit`, {
        method: "POST",
        headers: authStorage.getAuthHeaders(),
        body: JSON.stringify(answer),
      });
      if (!res.ok) return;
      const data: TaskSubmissionDto = await res.json();
      setSubmissions((prev) => ({ ...prev, [taskId]: [...(prev[taskId] ?? []), data] }));
      if (!data.isCorrect) {
        setAnswers((prev) => { const next = { ...prev }; delete next[taskId]; return next; });
      }
    } catch (e) { console.error(e); }
    finally { setSubmitting((prev) => ({ ...prev, [taskId]: false })); }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim() || !selectedLessonId) return;
    if (leoProfanity.check(newQuestion.trim())) {
      message.error("Вопрос содержит недопустимые слова. Пожалуйста, используйте корректные выражения.");
      return;
    }
    setSubmittingQuestion(true);
    const result = await questionApi.createQuestion(selectedLessonId, { text: newQuestion });
    if (result) {
      setQuestions((prev) => [result, ...prev]);
      setNewQuestion("");
      message.success("Вопрос отправлен!");
    }
    setSubmittingQuestion(false);
  };

  const handleAnswerQuestion = async (questionId: string, text: string) => {
    if (leoProfanity.check(text.trim())) {
      message.error("Ответ содержит недопустимые слова. Пожалуйста, используйте корректные выражения.");
      return;
    }
    const result = await questionApi.answerQuestion(questionId, { answerText: text });
    if (result) setQuestions((prev) => prev.map((q) => (q.id === questionId ? result : q)));
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const ok = await questionApi.deleteQuestion(questionId);
    if (ok) setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleNextLesson = async () => {
    setNavigating(true);
    await completeCurrentLesson();
    if (!selectedLessonId) { setNavigating(false); return; }

    for (let si = 0; si < sections.length; si++) {
      const sectionLessons = lessonsBySection[sections[si].id] ?? [];
      const idx = sectionLessons.findIndex((l) => l.id === selectedLessonId);
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
    localStorage.removeItem(LAST_LESSON_KEY);
    setNavigating(false);

    // проверяем сертификат — показываем модалку если есть
    try {
      const certs = await certificateApi.getMyCertificates();
      const cert = certs.find((c) => c.courseId === id);
      if (cert) {
        setCertificate(cert);
        setCertModalOpen(true);
        return; // navigate будет при закрытии модалки
      }
    } catch { /* если не удалось — просто переходим */ }

    // подгружаем все ачивки и показываем те которые ещё не показывали
    try {
      const allAchievements = await achievementApi.getMyAchievements();
      const freshEarned = allAchievements
          .filter((a) => a.isEarned && !shownAchievementsRef.current.has(a.code))
          .map((a) => ({
            code: a.code,
            title: a.title,
            description: a.description,
            icon: a.icon,
            earnedAt: a.earnedAt ?? new Date().toISOString(),
          }));
      freshEarned.forEach((a) => shownAchievementsRef.current.add(a.code));
      if (freshEarned.length > 0) {
        setNewAchievements(freshEarned);
        setPendingFinishNavigate(true);
        return;
      }
    } catch { /* игнорируем */ }

    navigate(`/course/${id}`);
  };

  const isLastLesson = () => {
    if (!selectedLessonId) return false;
    const lastSection = sections[sections.length - 1];
    if (!lastSection) return false;
    const lastLessons = lessonsBySection[lastSection.id] ?? [];
    return lastLessons[lastLessons.length - 1]?.id === selectedLessonId;
  };

  const menuItems = sections.map((section) => ({
    key: section.id,
    label: section.title,
    children: (lessonsBySection[section.id] ?? []).map((lesson) => ({
      key: lesson.id,
      label: (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {completedLessons.has(lesson.id)
                ? <CheckCircleFilled style={{ color: "#52c41a", fontSize: 13, flexShrink: 0 }} />
                : <CheckCircleOutlined style={{ color: "#d9d9d9", fontSize: 13, flexShrink: 0 }} />
            }
            <span>{lesson.title}</span>
          </div>
      ),
    })),
  }));

  return (
      <>
        <Header />
        <Layout style={{ minHeight: "calc(100vh - 64px)" }}>
          <Sider
              collapsible collapsed={collapsed} onCollapse={setCollapsed}
              width={300}
              style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}
              theme="light"
          >
            {!collapsed && (
                <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f0f0f0" }}>
                  {courseName && (
                      <Text strong style={{ fontSize: 14, color: "#333", display: "block", marginBottom: 12 }}>
                        {courseName}
                      </Text>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Прогресс курса</Text>
                    <Text strong style={{ fontSize: 12, color: "#389e0d" }}>{progressPercent}%</Text>
                  </div>
                  <Progress percent={progressPercent} showInfo={false} strokeColor="#52c41a" trailColor="#f0f0f0" size="small" />
                </div>
            )}

            {loading ? (
                <div style={{ padding: 24, textAlign: "center" }}><Spin /></div>
            ) : (
                <Menu
                    selectedKeys={selectedLessonId ? [selectedLessonId] : []}
                    defaultOpenKeys={sections.map((s) => s.id)}
                    mode="inline"
                    style={{ height: "calc(100% - 110px)", borderRight: 0, paddingTop: 8, overflowY: "auto" }}
                    items={menuItems}
                    onOpenChange={(openKeys) => {
                      openKeys.forEach((key) => { if (sections.some((s) => s.id === key)) fetchLessonsForSection(key); });
                    }}
                    onClick={({ key }) => {
                      const isLesson = Object.values(lessonsBySection).flat().some((l) => l.id === key);
                      if (isLesson) fetchLesson(key);
                    }}
                />
            )}
          </Sider>

          <Content style={{ padding: "40px 60px", background: "#fafafa" }}>
            {loadingLesson ? (
                <div style={{ textAlign: "center", paddingTop: 80 }}><Spin size="large" /></div>
            ) : selectedLesson ? (
                <div>
                  <Title level={2}>{selectedLesson.title}</Title>
                  <Text type="secondary">{selectedLesson.description}</Text>
                  <Divider />

                  {selectedLesson.content && (
                      <div style={{ fontSize: 15, lineHeight: 1.8 }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                          {selectedLesson.content}
                        </ReactMarkdown>
                      </div>
                  )}

                  {tasks.length > 0 && (
                      <div style={{ marginTop: 40 }}>
                        <Divider />
                        <Title level={4}>Задание</Title>
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id} task={task}
                                answer={answers[task.id]}
                                submissions={submissions[task.id] ?? []}
                                submitting={submitting[task.id] ?? false}
                                onAnswerChange={(val) => setAnswers((prev) => ({ ...prev, [task.id]: val }))}
                                onSubmit={() => submitTask(task.id)}
                            />
                        ))}
                      </div>
                  )}

                  <div style={{ marginTop: 48, display: "flex", justifyContent: "flex-end" }}>
                    {isLastLesson() ? (
                        <Button type="primary" size="large" loading={navigating}
                                style={{ background: "rgba(0,100,0,0.8)", minWidth: 200 }}
                                onClick={handleFinishCourse}>
                          Завершить курс
                        </Button>
                    ) : (
                        <Button type="primary" size="large" loading={navigating}
                                style={{ background: "rgba(0,100,0,0.8)", minWidth: 200 }}
                                onClick={handleNextLesson}>
                          Следующий урок →
                        </Button>
                    )}
                  </div>

                  <Divider style={{ marginTop: 48 }} />
                  <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                    <MessageOutlined style={{ fontSize: 18, color: "#389e0d" }} />
                    <Title level={4} style={{ margin: 0 }}>Вопросы к уроку</Title>
                    <Tag color="green">{questions.length}</Tag>
                  </div>

                  <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #f0f0f0", marginBottom: 16 }}>
                    <Text strong style={{ display: "block", marginBottom: 8 }}>Задать вопрос</Text>
                    <Input.TextArea
                        rows={3} value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Введите ваш вопрос по материалу урока..."
                        style={{ marginBottom: 8 }}
                    />
                    <Button type="primary" icon={<SendOutlined />} loading={submittingQuestion}
                            disabled={!newQuestion.trim()} style={{ background: "rgba(0,100,0,0.8)" }}
                            onClick={handleAskQuestion}>
                      Отправить вопрос
                    </Button>
                  </div>

                  {questions.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "32px 0", color: "#bbb" }}>
                        <MessageOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                        <div>Вопросов пока нет. Будьте первым!</div>
                      </div>
                  ) : (
                      questions.map((q) => (
                          <div id={`question-${q.id}`} key={q.id + String(q.isAnswered)}>
                            <QuestionCard
                                question={q}
                                onAnswer={handleAnswerQuestion}
                                onDelete={handleDeleteQuestion}
                                currentUserId={currentUserId}
                                highlighted={q.id === targetQuestionId}
                            />
                          </div>
                      ))
                  )}
                </div>
            ) : (
                <div style={{ textAlign: "center", paddingTop: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <BookOutlined style={{ fontSize: 56, color: "#bbb" }} />
                  <Text style={{ fontSize: 16, color: "#bbb" }}>Выберите урок из меню слева</Text>
                </div>
            )}
          </Content>
        </Layout>
        <Footer />

        {/* Модалка сертификата */}
        {certificate && (
            <Modal
                open={certModalOpen}
                onCancel={() => { setCertModalOpen(false); navigate(`/course/${id}`); }}
                footer={null} width={620} centered
                styles={{ body: { padding: 24 } }}
            >
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <Title level={3} style={{ color: "#16a34a", margin: 0 }}>Поздравляем!</Title>
                <Text type="secondary" style={{ fontSize: 14 }}>Вы получили сертификат о прохождении курса</Text>
              </div>
              <CertificateView
                  certificate={certificate}
                  onDownload={async () => {
                    setDownloadingCert(true);
                    await certificateApi.downloadPdf(certificate.id, certificate.courseTitle);
                    setDownloadingCert(false);
                  }}
                  downloading={downloadingCert}
                  extraAction={
                    <Button size="large" onClick={() => { setCertModalOpen(false); navigate(`/course/${id}`); }}>
                      К странице курса
                    </Button>
                  }
              />
            </Modal>
        )}

        {/* Попап достижений */}
        {newAchievements.length > 0 && (
            <AchievementPopup
                achievements={newAchievements}
                onClose={() => {
                  setNewAchievements([]);
                  if (pendingFinishNavigate) {
                    setPendingFinishNavigate(false);
                    navigate(`/course/${id}`);
                  }
                }}
            />
        )}
      </>
  );
};

export default CourseLearningPage;