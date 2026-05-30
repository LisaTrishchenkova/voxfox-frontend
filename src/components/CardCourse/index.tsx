import {Button, Card, Col, Row, Tag, Typography} from "antd";
import {HeartFilled, HeartOutlined, StarOutlined, TrophyOutlined, ClockCircleOutlined, TeamOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type {CourseDto} from "../../api/types/course.ts";
import {useState} from "react";
import {authStorage} from "../../services/auth-storage.service.ts";
import {favoriteApi} from "../../api/favoriteApi.ts";

type CardCourseProps = {
  course: CourseDto;
  isFavorite?: boolean;
};

const levelLabels: Record<string, string> = {
  Beginner: "Начинающий",
  Intermediate: "Средний",
  Advanced: "Продвинутый",
};

const CardCourse = ({ course, isFavorite = false }: CardCourseProps) => {
  const navigate = useNavigate();
  const { Title, Text } = Typography;
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!authStorage.isAuthenticated()) {
      navigate(`/login?redirect=/`);
      return;
    }
    setLoading(true);
    if (favorite) {
      const ok = await favoriteApi.remove(course.id);
      if (ok) setFavorite(false);
    } else {
      const result = await favoriteApi.add(course.id);
      if (result) setFavorite(true);
    }
    setLoading(false);
  };

  return (
      <Card
          variant="borderless"
          size="default"
          onClick={() => navigate(`/course/${course.id}`)}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
          }}
          styles={{ body: { flex: 1, display: "flex", flexDirection: "column" } }}
      >
        {/* Рейтинг + избранное */}
        <Row gutter={[8, 8]} align="middle">
          <Col span={12}>
            <Text style={{ fontSize: 14 }}>
              <StarOutlined style={{ color: "#faad14", marginRight: 6 }} />
              {course.rating.toFixed(1)}
            </Text>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {favorite ? (
                <HeartFilled
                    style={{ fontSize: 20, color: "#AC2724", cursor: loading ? "wait" : "pointer" }}
                    onClick={toggleFavorite}
                />
            ) : (
                <HeartOutlined
                    style={{ fontSize: 20, color: "#AC2724", cursor: loading ? "wait" : "pointer" }}
                    onClick={toggleFavorite}
                />
            )}
          </Col>
        </Row>

        <hr style={{ backgroundColor: "black", margin: "10px 0" }} />

        {/* Название */}
        <Row>
          <Col span={24} style={{ textAlign: "center", marginBottom: 8 }}>
            <Title level={3} style={{
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 64,
            }}>
              {course.title}
            </Title>
          </Col>
        </Row>

        {/* Описание */}
        <Row>
          <Col span={24} style={{ textAlign: "center", marginBottom: 8 }}>
            <div style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 60,
              fontSize: 14,
              color: "#666",
            }}>
              {course.description}
            </div>
          </Col>
        </Row>

        {/* Автор */}
        <Row>
          <Col span={24} style={{ margin: "8px 10px", minHeight: 28 }}>
            {course.author && (
                <Text type="secondary" style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                 <span
                     onClick={(e) => { e.stopPropagation(); navigate(`/teacher/${course.author.id}`); }}
                     style={{ cursor: "pointer", color: "#1890ff" }}
                 >
                {course.author.name}
                </span>
                </Text>
            )}
          </Col>
        </Row>

        {/* Цена */}
        <Row>
          <Col span={24} style={{ margin: "8px 10px" }}>
            <Text strong style={{ fontSize: 18, color: "#389e0d" }}>
              {course.isFree ? "Бесплатно" : `${course.price} ₽`}
            </Text>
          </Col>
        </Row>

        {/* Уровень, сертификат, длительность, студенты */}
        <Row>
          <Col span={24} style={{ margin: "4px 10px", minHeight: 56 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <Tag color="blue" style={{ fontSize: 13, margin: 0 }}>
                {levelLabels[course.level] ?? course.level}
              </Tag>
              {course.certificateEnabled && (
                  <Tag color="gold" icon={<TrophyOutlined />} style={{ fontSize: 13, margin: 0 }}>
                    Сертификат
                  </Tag>
              )}
              {course.durationMinutes > 0 && (
                  <Tag icon={<ClockCircleOutlined />} style={{ fontSize: 13, margin: 0 }}>
                    {course.durationMinutes} мин
                  </Tag>
              )}
              {course.enrollmentCount > 0 && (
                  <Tag icon={<TeamOutlined />} style={{ fontSize: 13, margin: 0 }}>
                    {course.enrollmentCount}
                  </Tag>
              )}
            </div>
          </Col>
        </Row>

        {/* Теги */}
        <Row>
          <Col style={{ margin: "4px 10px", minHeight: 52, overflow: "hidden" }}>
            <div style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {course.tags?.map((tag) => (
                  <Tag key={tag.name} color="#3b7159" style={{ margin: 3, fontSize: 13 }}>
                    {tag.name}
                  </Tag>
              ))}
            </div>
          </Col>
        </Row>

        {/* Кнопка */}
        <Row justify="center" style={{ marginTop: "auto", paddingTop: 12 }}>
          <Col>
            <Button
                style={{
                  background: "rgba(0, 100, 0, 0.15)",
                  padding: "20px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/course/${course.id}`);
                }}
            >
              Начать курс
            </Button>
          </Col>
        </Row>
      </Card>
  );
};

export default CardCourse;