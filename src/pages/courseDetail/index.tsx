import {Button, Col, Collapse, Divider, Form, Input, Modal, Rate, Row, Skeleton, Tag, Typography, Avatar, message} from "antd";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import type {CourseDto, SectionDto, LessonDto} from "../../api/types/course";
import {API_URL} from "../../config";
import {
  BookOutlined,
  ClockCircleOutlined,
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header";
import ReactMarkdown from "react-markdown";
import Footer from "../../components/Footer.tsx";
import {enrollmentApi} from "../../api/enrollmentApi.ts";
import type {EnrollmentDto} from "../../api/types/enrollment.ts";
import {authStorage} from "../../services/auth-storage.service.ts";
import {favoriteApi} from "../../api/favoriteApi.ts";
import {reviewApi} from "../../api/reviewApi.ts";
import type {ReviewDto} from "../../api/types/review.ts";
import {useUserStore} from "../../stores/userStore.ts";
import {balanceApi} from "../../api/balanceApi.ts";
import leoProfanity from "leo-profanity";
import { getImageUrl } from "../../utils/imageUtils";

leoProfanity.loadDictionary("ru");

const {Title, Text, Paragraph} = Typography;

const levelLabels: Record<string, string> = {
  Beginner: "Начинающий",
  Intermediate: "Средний",
  Advanced: "Продвинутый",
};

const CourseDetailPage = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();
  const {userData} = useUserStore();

  const [course, setCourse] = useState<CourseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<EnrollmentDto | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [sections, setSections] = useState<SectionDto[]>([]);
  const [lessonsBySection, setLessonsBySection] = useState<Record<string, LessonDto[]>>({});
  const [loadingSections, setLoadingSections] = useState(false);

  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm] = Form.useForm();
  const [userReview, setUserReview] = useState<ReviewDto | null>(null);

  // Баланс и покупка
  const [balance, setBalance] = useState<number>(0);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const isAuth = authStorage.isAuthenticated();
  const currentUserId = authStorage.getUserData<string>();
  const isPublished = course?.status === "Published";
  const isPaid = (course?.price ?? 0) > 0;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API_URL}/Courses/${id}`);
        if (!res.ok) throw new Error("Курс не найден!");
        setCourse(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const checkEnrollment = async () => {
      const enrollments = await enrollmentApi.getMyEnrollments();
      const found = enrollments.find(e => e.courseId === id);
      setEnrollment(found ?? null);
    };

    const checkFavorite = async () => {
      const favs = await favoriteApi.getMyFavorites();
      setIsFavorite(favs.some(f => f.courseId === id));
    };

    const fetchBalance = async () => {
      const data = await balanceApi.getBalance();
      if (data) setBalance(data.balance);
    };

    const fetchSections = async () => {
      setLoadingSections(true);
      try {
        const res = await fetch(`${API_URL}/Courses/${id}/sections`);
        if (!res.ok) return;
        const data: SectionDto[] = await res.json();
        setSections(data);
        const lessonsMap: Record<string, LessonDto[]> = {};
        await Promise.all(data.map(async section => {
          const lRes = await fetch(`${API_URL}/Sections/${section.id}/lessons`);
          if (lRes.ok) lessonsMap[section.id] = await lRes.json();
        }));
        setLessonsBySection(lessonsMap);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSections(false);
      }
    };

    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const data = await reviewApi.getCourseReviews(id!);
        setReviews(data);
        if (currentUserId) {
          const mine = data.find(r => r.userId === currentUserId);
          setUserReview(mine ?? null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchCourse();
    fetchSections();
    fetchReviews();
    if (isAuth) {
      checkEnrollment();
      checkFavorite();
      fetchBalance();
    }
  }, [id, isAuth]);

  const toggleFavorite = async () => {
    if (!isAuth) { navigate(`/login?redirect=/course/${id}`); return; }
    setFavoriteLoading(true);
    if (isFavorite) {
      const ok = await favoriteApi.remove(id!);
      if (ok) setIsFavorite(false);
    } else {
      const result = await favoriteApi.add(id!);
      if (result) setIsFavorite(true);
    }
    setFavoriteLoading(false);
  };

  // ─── Покупка курса ─────────────────────────────────────
  const handlePurchase = async () => {
    setPurchaseLoading(true);
    const { data, error } = await balanceApi.purchaseCourse(id!);
    if (data) {
      // Бэк создал enrollment — получаем его
      const enrollments = await enrollmentApi.getMyEnrollments();
      const found = enrollments.find(e => e.courseId === id);
      setEnrollment(found ?? null);

      // Обновляем баланс
      const balanceData = await balanceApi.getBalance();
      if (balanceData) setBalance(balanceData.balance);

      message.success("Курс куплен! Приятного обучения");
      setPurchaseModalOpen(false);
    } else {
      message.error(error ?? "Ошибка при покупке курса");
    }
    setPurchaseLoading(false);
  };

  const handleSubmitReview = async (values: {rating: number; comment: string}) => {
    if (!isAuth) { navigate(`/login?redirect=/course/${id}`); return; }
    const commentText = values.comment ?? "";
    if (leoProfanity.check(commentText)) {
      message.error("Комментарий содержит недопустимые слова. Пожалуйста, используйте корректные выражения.");
      return;
    }
    setSubmittingReview(true);
    const result = await reviewApi.createReview(id!, { rating: values.rating, comment: commentText });
    if (result) {
      const reviewWithName: ReviewDto = { ...result, userName: result.userName ?? userData?.name ?? "Аноним" };
      setReviews(prev => [reviewWithName, ...prev]);
      setUserReview(reviewWithName);
      reviewForm.resetFields();
      message.success("Отзыв добавлен!");
    } else {
      message.error("Не удалось добавить отзыв");
    }
    setSubmittingReview(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    const ok = await reviewApi.deleteReview(reviewId);
    if (ok) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      setUserReview(null);
      message.success("Отзыв удалён");
    }
  };

  const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const totalLessons = Object.values(lessonsBySection).reduce((sum, arr) => sum + arr.length, 0);

  if (loading)
    return (<><Header/><Skeleton active style={{padding: 40}}/></>);
  if (!course)
    return (<><Header/><div style={{padding: 40}}>Курс не найден!</div></>);

  // ─── Кнопка записи/покупки ────────────────────────────
  const renderEnrollButton = () => {
    // Уже записан — показываем "Продолжить"
    if (isAuth && enrollment) {
      return (
          <Button type="primary" size="large" block
                  style={{marginTop: 12, height: 48, fontSize: 16, background: "rgba(0,100,0,0.8)"}}
                  onClick={() => navigate(`/course/${id}/learn`)}>
            Продолжить курс
          </Button>
      );
    }

    // Курс не опубликован
    if (!isPublished) {
      return (
          <Button size="large" block disabled style={{marginTop: 12, height: 48, fontSize: 16}}>
            Запись недоступна
          </Button>
      );
    }

    // Не авторизован
    if (!isAuth) {
      return (
          <Button type="primary" size="large" block
                  style={{marginTop: 12, height: 48, fontSize: 16, background: "rgba(0,100,0,0.8)"}}
                  onClick={() => navigate(`/login?redirect=/course/${id}`)}>
            {isPaid ? `Войти чтобы купить` : "Войти чтобы записаться"}
          </Button>
      );
    }

    // Авторизован, не записан, курс платный
    if (isPaid) {
      return (
          <Button type="primary" size="large" block
                  icon={<ShoppingCartOutlined />}
                  style={{marginTop: 12, height: 48, fontSize: 16, background: "rgba(0,100,0,0.8)"}}
                  onClick={() => setPurchaseModalOpen(true)}>
            Купить за {course.price.toLocaleString("ru-RU")} ₽
          </Button>
      );
    }

    // Авторизован, не записан, курс бесплатный
    return (
        <Button type="primary" size="large" block loading={enrollLoading}
                style={{marginTop: 12, height: 48, fontSize: 16, background: "rgba(0,100,0,0.8)"}}
                onClick={async () => {
                  setEnrollLoading(true);
                  const result = await enrollmentApi.enroll(id!);
                  if (result) setEnrollment(result);
                  setEnrollLoading(false);
                }}>
          Записаться бесплатно
        </Button>
    );
  };

  const hasEnoughBalance = balance >= (course?.price ?? 0);

  return (
      <>
        <Header/>

        <div style={{backgroundColor: "rgba(0,100,0,0.1)", padding: "60px 80px"}}>
          <Row gutter={[48, 24]} align="middle">
            <Col xs={24} md={16}>
              <div style={{display: "flex", gap: 8, marginBottom: 16, alignItems: "center"}}>
                <Tag color="green">{levelLabels[course.level] ?? course.level}</Tag>
                {course.certificateEnabled && (
                    <Tag color="gold" icon={<TrophyOutlined/>}>Сертификат</Tag>
                )}
                {!isPublished && <Tag color="warning">Курс ещё не опубликован</Tag>}
              </div>

              <Title level={1} style={{margin: 0, lineHeight: 1.2}}>{course.title}</Title>

              <Paragraph style={{fontSize: 16, marginTop: 16, marginBottom: 0, color: "#444"}}>
                {course.description}
              </Paragraph>

              <Divider style={{margin: "20px 0"}}/>

              <div style={{display: "flex", gap: 28, flexWrap: "wrap"}}>
                <Text style={{fontSize: 14}}>
                  <StarOutlined style={{color: "#faad14", marginRight: 6}}/>
                  {avgRating > 0 ? avgRating.toFixed(1) : course.rating.toFixed(1)}
                  <Text type="secondary" style={{fontSize: 12, marginLeft: 4}}>({reviews.length} отзывов)</Text>
                </Text>
                <Text style={{fontSize: 14}}>
                  <TeamOutlined style={{color: "#1677ff", marginRight: 6}}/>{course.enrollmentCount} студентов
                </Text>
                <Text style={{fontSize: 14}}>
                  <ClockCircleOutlined style={{color: "#52c41a", marginRight: 6}}/>{course.durationMinutes} мин
                </Text>
                <Text style={{fontSize: 14}}>
                  <BookOutlined style={{marginRight: 6}}/>{course.author?.name}
                </Text>
              </div>

              {course.tags && course.tags.length > 0 && (
                  <div style={{marginTop: 20}}>
                    {course.tags.map(tag => (
                        <Tag key={tag.name} color="#3b7159" style={{margin: 4, fontSize: 13}}>{tag.name}</Tag>
                    ))}
                  </div>
              )}
            </Col>

            <Col xs={24} md={8} style={{textAlign: "center"}}>
              <div style={{width: "100%", borderRadius: 12, overflow: "hidden", marginBottom: 16}}>
                {course.coverImageUrl
                    ? <img src={getImageUrl(course.coverImageUrl)} alt={course.title}
                           style={{width: "100%", maxHeight: 280, objectFit: "cover", display: "block"}} />
                    : <div style={{height: 200, background: "linear-gradient(135deg, rgba(0,100,0,0.15) 0%, rgba(0,100,0,0.35) 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, color: "rgba(0,100,0,0.4)"}}>🎓</div>
                }
              </div>

              <div style={{marginTop: 16}}>
                <Title level={3} style={{margin: 0}}>
                  {course.price === 0 ? "Бесплатно" : `${course.price.toLocaleString("ru-RU")} ₽`}
                </Title>

                {renderEnrollButton()}

                {isPublished && (
                    <Button size="large" block loading={favoriteLoading}
                            icon={isFavorite ? <HeartFilled style={{color: "#AC2724"}}/> : <HeartOutlined style={{color: "#AC2724"}}/>}
                            style={{marginTop: 8, height: 48, fontSize: 16}}
                            onClick={toggleFavorite}>
                      {isFavorite ? "В избранном" : "В избранное"}
                    </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>

        {/* Основной контент */}
        <div style={{padding: "40px 60px", maxWidth: 1200, margin: "0 auto"}}>
          <Row gutter={[48, 32]}>
            <Col xs={24} md={16}>

              {course.fullDescription && (
                  <>
                    <Title level={3}>О курсе</Title>
                    <Divider style={{margin: "12px 0"}}/>
                    <Paragraph style={{fontSize: 15, lineHeight: 1.8}}>
                      <ReactMarkdown>{course.fullDescription}</ReactMarkdown>
                    </Paragraph>
                  </>
              )}

              <Title level={3} style={{marginTop: 32}}>Программа курса</Title>
              <Divider style={{margin: "12px 0"}}/>
              {loadingSections ? (
                  <Skeleton active paragraph={{rows: 4}}/>
              ) : sections.length === 0 ? (
                  <Text type="secondary">Программа курса пока не добавлена</Text>
              ) : (
                  <>
                    <Text type="secondary" style={{display: "block", marginBottom: 16}}>
                      {sections.length} разделов · {totalLessons} уроков
                    </Text>
                    <Collapse
                        items={sections.map(section => ({
                          key: section.id,
                          label: (
                              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <Text strong>{section.title}</Text>
                                <Text type="secondary" style={{fontSize: 12}}>
                                  {lessonsBySection[section.id]?.length ?? 0} уроков
                                </Text>
                              </div>
                          ),
                          children: (
                              <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                {section.description && (
                                    <Text type="secondary" style={{fontSize: 13, marginBottom: 8, display: "block"}}>
                                      {section.description}
                                    </Text>
                                )}
                                {(lessonsBySection[section.id] ?? []).map((lesson, idx) => (
                                    <div key={lesson.id} style={{display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0f0f0"}}>
                                      <Text type="secondary" style={{fontSize: 12, minWidth: 20}}>{idx + 1}</Text>
                                      <BookOutlined style={{color: "#52c41a", fontSize: 14}}/>
                                      <Text style={{flex: 1}}>{lesson.title}</Text>
                                    </div>
                                ))}
                              </div>
                          ),
                        }))}
                    />
                  </>
              )}

              <Title level={3} style={{marginTop: 48}}>Отзывы</Title>
              <Divider style={{margin: "12px 0"}}/>

              {reviews.length > 0 && (
                  <div style={{display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "rgba(0,100,0,0.05)", borderRadius: 12, marginBottom: 24}}>
                    <div style={{textAlign: "center"}}>
                      <div style={{fontSize: 40, fontWeight: 700, color: "#389e0d", lineHeight: 1}}>{avgRating.toFixed(1)}</div>
                      <Rate disabled allowHalf value={avgRating} style={{fontSize: 14}}/>
                      <div style={{fontSize: 12, color: "#888", marginTop: 4}}>{reviews.length} отзывов</div>
                    </div>
                  </div>
              )}

              {isAuth && enrollment && !userReview && (
                  <div style={{background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #f0f0f0", marginBottom: 24}}>
                    <Title level={5} style={{marginBottom: 16}}>Оставить отзыв</Title>
                    <Form form={reviewForm} onFinish={handleSubmitReview} layout="vertical">
                      <Form.Item name="rating" label="Оценка" rules={[{required: true, message: "Поставьте оценку"}]}>
                        <Rate/>
                      </Form.Item>
                      <Form.Item name="comment" label="Комментарий" rules={[{max: 1000, message: "Максимум 1000 символов"}]}>
                        <Input.TextArea rows={4} placeholder="Расскажите о курсе..." maxLength={1000} showCount/>
                      </Form.Item>
                      <Button type="primary" htmlType="submit" loading={submittingReview} style={{background: "rgba(0,100,0,0.8)"}}>
                        Отправить отзыв
                      </Button>
                    </Form>
                  </div>
              )}

              {isAuth && !enrollment && (
                  <Text type="secondary" style={{display: "block", marginBottom: 24}}>
                    {isPaid ? "Купите курс чтобы оставить отзыв" : "Запишитесь на курс чтобы оставить отзыв"}
                  </Text>
              )}

              {loadingReviews ? (
                  <Skeleton active paragraph={{rows: 3}}/>
              ) : reviews.length === 0 ? (
                  <Text type="secondary">Отзывов пока нет. Будьте первым!</Text>
              ) : (
                  <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                    {reviews.map(review => (
                        <div key={review.id} style={{background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #f0f0f0"}}>
                          <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8}}>
                            <div style={{display: "flex", alignItems: "center", gap: 10}}>
                              <Avatar icon={<UserOutlined/>} style={{background: "#52c41a"}}/>
                              <div>
                                <Text strong style={{display: "block"}}>{review.userName ?? "Аноним"}</Text>
                                <Text type="secondary" style={{fontSize: 12}}>
                                  {new Date(review.createdAt).toLocaleDateString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                                </Text>
                              </div>
                            </div>
                            <div style={{display: "flex", alignItems: "center", gap: 8}}>
                              <Rate disabled value={review.rating} style={{fontSize: 14}}/>
                              {review.userId === currentUserId && (
                                  <Button size="small" danger onClick={() => handleDeleteReview(review.id)}>Удалить</Button>
                              )}
                            </div>
                          </div>
                          {review.comment && <Text style={{fontSize: 14}}>{review.comment}</Text>}
                        </div>
                    ))}
                  </div>
              )}
            </Col>

            <Col xs={24} md={8}>
              <div style={{position: "sticky", top: 24, backgroundColor: "rgba(0,100,0,0.1)", borderRadius: 12, padding: "24px", border: "1px solid #eee"}}>
                <Title level={4} style={{marginBottom: 16}}>Информация</Title>
                <div style={{display: "flex", flexDirection: "column", gap: 14}}>
                  <div style={{display: "flex", alignItems: "center", gap: 10}}>
                    <StarOutlined style={{color: "#faad14", fontSize: 16}}/>
                    <Text>Рейтинг: <strong>{avgRating > 0 ? avgRating.toFixed(1) : course.rating.toFixed(1)}</strong></Text>
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: 10}}>
                    <TeamOutlined style={{color: "#1677ff", fontSize: 16}}/>
                    <Text>Студентов: <strong>{course.enrollmentCount}</strong></Text>
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: 10}}>
                    <ClockCircleOutlined style={{color: "#52c41a", fontSize: 16}}/>
                    <Text>Длительность: <strong>{course.durationMinutes} мин</strong></Text>
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: 10}}>
                    <BookOutlined style={{fontSize: 16}}/>
                    <Text>Уроков: <strong>{totalLessons}</strong></Text>
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: 10}}>
                    <BookOutlined style={{fontSize: 16}}/>
                    <Text>Автор: <strong>{course.author?.name}</strong></Text>
                  </div>
                  {course.publishedAt && (
                      <div style={{display: "flex", alignItems: "center", gap: 10}}>
                        <Text type="secondary">
                          Опубликован:{" "}
                          {new Date(course.publishedAt).toLocaleDateString("ru-RU", {day: "numeric", month: "long", year: "numeric"})}
                        </Text>
                      </div>
                  )}
                  {course.certificateEnabled && (
                      <div style={{display: "flex", alignItems: "center", gap: 10}}>
                        <TrophyOutlined style={{color: "#faad14", fontSize: 16}}/>
                        <Text>Есть сертификат</Text>
                      </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Модалка подтверждения покупки */}
        <Modal
            open={purchaseModalOpen}
            title="Подтверждение покупки"
            onCancel={() => setPurchaseModalOpen(false)}
            onOk={handlePurchase}
            okText="Оплатить"
            cancelText="Отмена"
            okButtonProps={{
              loading: purchaseLoading,
              disabled: !hasEnoughBalance,
              style: hasEnoughBalance ? { background: "rgba(0,100,0,0.8)" } : undefined,
            }}
            centered
        >
          <div style={{display: "flex", flexDirection: "column", gap: 16, marginTop: 8}}>
            {/* Что покупаем */}
            <div style={{background: "#fafafa", borderRadius: 8, padding: "12px 16px", border: "1px solid #f0f0f0"}}>
              <Text strong style={{display: "block", marginBottom: 4}}>{course.title}</Text>
              <Text type="secondary" style={{fontSize: 13}}>{course.description}</Text>
            </div>

            {/* Сумма */}
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <Text>Стоимость курса:</Text>
              <Text strong style={{fontSize: 18}}>{course.price.toLocaleString("ru-RU")} ₽</Text>
            </div>

            {/* Баланс */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 14px", borderRadius: 8,
              background: hasEnoughBalance ? "rgba(0,100,0,0.05)" : "rgba(255,77,79,0.05)",
              border: `1px solid ${hasEnoughBalance ? "rgba(0,100,0,0.15)" : "rgba(255,77,79,0.2)"}`,
            }}>
              <div style={{display: "flex", alignItems: "center", gap: 8}}>
                <WalletOutlined style={{color: hasEnoughBalance ? "rgba(0,100,0,0.8)" : "#ff4d4f"}}/>
                <Text>Ваш баланс:</Text>
              </div>
              <Text strong style={{color: hasEnoughBalance ? "rgba(0,100,0,0.8)" : "#ff4d4f", fontSize: 16}}>
                {balance.toLocaleString("ru-RU", {minimumFractionDigits: 2})} ₽
              </Text>
            </div>

            {/* Недостаточно средств */}
            {!hasEnoughBalance && (
                <div style={{background: "rgba(255,77,79,0.05)", borderRadius: 8, padding: "10px 14px", border: "1px solid rgba(255,77,79,0.2)"}}>
                  <Text type="danger" style={{fontSize: 13}}>
                    Недостаточно средств. Пополните баланс на{" "}
                    <Text strong type="danger">
                      {(course.price - balance).toLocaleString("ru-RU", {minimumFractionDigits: 2})} ₽
                    </Text>
                  </Text>
                </div>
            )}

            {/* Остаток после покупки */}
            {hasEnoughBalance && (
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <Text type="secondary" style={{fontSize: 13}}>Остаток после оплаты:</Text>
                  <Text type="secondary" style={{fontSize: 13}}>
                    {(balance - course.price).toLocaleString("ru-RU", {minimumFractionDigits: 2})} ₽
                  </Text>
                </div>
            )}
          </div>
        </Modal>

        <Footer/>
      </>
  );
};

export default CourseDetailPage;