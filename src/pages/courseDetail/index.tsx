import { Button, Col, Divider, Row, Skeleton, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CourseDto } from "../../api/types/course";
import { API_URL } from "../../config";
import {
  BookOutlined,
  ClockCircleOutlined,
  HeartFilled,
  HeartOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header";
import ReactMarkdown from "react-markdown";
import Footer from "../../components/Footer.tsx";
import { enrollmentApi } from "../../api/enrollmentApi.ts";
import type { EnrollmentDto } from "../../api/types/enrollment.ts";
import { authStorage } from "../../services/auth-storage.service.ts";
import { favoriteApi } from "../../api/favoriteApi.ts";

const { Title, Text, Paragraph } = Typography;

const levelLabels: Record<string, string> = {
  Beginner: "Начинающий",
  Intermediate: "Средний",
  Advanced: "Продвинутый",
};

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cource, setCourse] = useState<CourseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<EnrollmentDto | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const isAuth = authStorage.isAuthenticated();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API_URL}/Courses/${id}`);
        if (!res.ok) throw new Error("Курс не найден!");
        const data = await res.json();
        setCourse(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const checkEnrollment = async () => {
      const enrollments = await enrollmentApi.getMyEnrollments();
      const found = enrollments.find((e) => e.courseId === id);
      setEnrollment(found ?? null);
    };

    const checkFavorite = async () => {
      const favs = await favoriteApi.getMyFavorites();
      setIsFavorite(favs.some(f => f.courseId === id));
    };

    fetchCourse();
    if (isAuth) {
      checkEnrollment();
      checkFavorite();
    }
  }, [id, isAuth]);

  const toggleFavorite = async () => {
    if (!isAuth) {
      navigate(`/login?redirect=/course/${id}`);
      return;
    }
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

  if (loading)
    return (
        <>
          <Header />
          <Skeleton active style={{ padding: 40 }} />
        </>
    );
  if (!cource)
    return (
        <>
          <Header />
          <div style={{ padding: 40 }}>Курс не найден!</div>
        </>
    );

  return (
      <>
        <Header />

        <div style={{ backgroundColor: "rgba(0,100,0,0.1)", padding: "60px 80px" }}>
          <Row gutter={[48, 24]} align="middle">
            <Col xs={24} md={16}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
                <Tag color="green">
                  {levelLabels[cource.level] ?? cource.level}
                </Tag>
                {cource.certificateEnabled && (
                    <Tag color="gold" icon={<TrophyOutlined />}>
                      Сертификат
                    </Tag>
                )}
              </div>

              <Title level={1} style={{ margin: 0, lineHeight: 1.2 }}>
                {cource.title}
              </Title>

              <Paragraph style={{ fontSize: 16, marginTop: 16, marginBottom: 0, color: "#444" }}>
                {cource.description}
              </Paragraph>

              <Divider style={{ margin: "20px 0" }} />

              <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                <Text style={{ fontSize: 14 }}>
                  <StarOutlined style={{ color: "#faad14", marginRight: 6 }} />
                  {cource.rating.toFixed(1)}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  <TeamOutlined style={{ color: "#1677ff", marginRight: 6 }} />
                  {cource.enrollmentCount} студентов
                </Text>
                <Text style={{ fontSize: 14 }}>
                  <ClockCircleOutlined style={{ color: "#52c41a", marginRight: 6 }} />
                  {cource.durationMinutes} мин
                </Text>
                <Text style={{ fontSize: 14 }}>
                  <BookOutlined style={{ marginRight: 6 }} />
                  {cource.author?.name}
                </Text>
              </div>

              {cource.tags && cource.tags.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    {cource.tags.map((tag) => (
                        <Tag key={tag.name} color="#3b7159" style={{ margin: 4, fontSize: 13 }}>
                          {tag.name}
                        </Tag>
                    ))}
                  </div>
              )}
            </Col>

            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              {cource.coverImageUrl && (
                  <img
                      src={cource.coverImageUrl}
                      alt={cource.title}
                      style={{ width: "100%", borderRadius: 12, maxHeight: 280, objectFit: "cover" }}
                  />
              )}
              <div style={{ marginTop: 16 }}>
                <Title level={3} style={{ margin: 0 }}>
                  {cource.isFree ? "Бесплатно" : `${cource.price} ₽`}
                </Title>
                {isAuth ? (
                    enrollment ? (
                        <Button
                            type="primary"
                            size="large"
                            block
                            style={{ marginTop: 12, height: 48, fontSize: 16, background: "rgba(0,100,0,0.8)" }}
                            onClick={() => navigate(`/course/${id}/learn`)}
                        >
                          Начать курс
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            block
                            loading={enrollLoading}
                            style={{ marginTop: 12, height: 48, fontSize: 16, background: "rgba(0,100,0,0.8)" }}
                            onClick={async () => {
                              setEnrollLoading(true);
                              const result = await enrollmentApi.enroll(id!);
                              if (result) setEnrollment(result);
                              setEnrollLoading(false);
                            }}
                        >
                          Записаться на курс
                        </Button>
                    )
                ) : (
                    <Button
                        type="primary"
                        size="large"
                        block
                        style={{ marginTop: 12, height: 48, fontSize: 16, background: "rgba(0,100,0,0.8)" }}
                        onClick={() => navigate(`/login?redirect=/course/${id}`)}
                    >
                      Войти чтобы записаться
                    </Button>
                )}

                {/* кнопка избранного под основной */}
                <Button
                    size="large"
                    block
                    loading={favoriteLoading}
                    icon={isFavorite ? <HeartFilled style={{ color: "#AC2724" }} /> : <HeartOutlined style={{ color: "#AC2724" }} />}
                    style={{ marginTop: 8, height: 48, fontSize: 16 }}
                    onClick={toggleFavorite}
                >
                  {isFavorite ? "В избранном" : "В избранное"}
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ padding: "40px 60px", maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[48, 32]}>
            <Col xs={24} md={16}>
              {cource.fullDescription && (
                  <>
                    <Title level={3}>О курсе</Title>
                    <Divider style={{ margin: "12px 0" }} />
                    <Paragraph style={{ fontSize: 15, lineHeight: 1.8 }}>
                      <ReactMarkdown>{cource.fullDescription}</ReactMarkdown>
                    </Paragraph>
                  </>
              )}
            </Col>

            <Col xs={24} md={8}>
              <div style={{
                position: "sticky",
                top: 24,
                backgroundColor: "rgba(0,100,0,0.1)",
                borderRadius: 12,
                padding: "24px",
                border: "1px solid #eee",
              }}>
                <Title level={4} style={{ marginBottom: 16 }}>Информация</Title>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <StarOutlined style={{ color: "#faad14", fontSize: 16 }} />
                    <Text>Рейтинг: <strong>{cource.rating.toFixed(1)}</strong></Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <TeamOutlined style={{ color: "#1677ff", fontSize: 16 }} />
                    <Text>Студентов: <strong>{cource.enrollmentCount}</strong></Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <ClockCircleOutlined style={{ color: "#52c41a", fontSize: 16 }} />
                    <Text>Длительность: <strong>{cource.durationMinutes} мин</strong></Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <BookOutlined style={{ fontSize: 16 }} />
                    <Text>Автор: <strong>{cource.author?.name}</strong></Text>
                  </div>
                  {cource.publishedAt && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Text type="secondary">
                          Опубликован:{" "}
                          {new Date(cource.publishedAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </Text>
                      </div>
                  )}
                  {cource.certificateEnabled && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <TrophyOutlined style={{ color: "#faad14", fontSize: 16 }} />
                        <Text>Есть сертификат</Text>
                      </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <Footer />
      </>
  );
};

export default CourseDetailPage;