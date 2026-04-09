import {Button, Card, Col, Row, Tag, Typography} from "antd";
import ReactMarkdown from "react-markdown";
import {HeartFilled, HeartOutlined, StarOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type {CourseDto} from "../../api/types/course.ts";
import {useState} from "react";
import {authStorage} from "../../services/auth-storage.service.ts";
import {favoriteApi} from "../../api/favoriteApi.ts";
type CardCourseProps = {
  course: CourseDto;
  isFavorite?: boolean;
};
const CardCourse = ({ course, isFavorite = false }: CardCourseProps) => {
  const navigate = useNavigate();
  const { Title } = Typography;
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const { Text } = Typography;

  const goToCoursePage = () => {
    navigate(`/course/${course.id}`);
  };
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // не переходим на страницу курса
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
      <Col span={6}>
        <Card variant="borderless" size="default" onClick={goToCoursePage}>
          <Row gutter={[8, 8]}>
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
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <Title level={3}>{course.title}</Title>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <ReactMarkdown>{course.description}</ReactMarkdown>
            </Col>
          </Row>
          {course.author && (
              <Row>
                <Col span={24} style={{ margin: "18px 10px" }}>
                  <Text type="secondary">Автор: {course.author.name}</Text>
                </Col>
              </Row>
          )}
          {course.publishedAt && (
              <Row>
                <Col span={24} style={{ margin: "8px 10px" }}>
                  <Text type="secondary">
                    Опубликовано:{" "}
                    {new Date(course.publishedAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </Col>
              </Row>
          )}
          <Row>
            <Col style={{ margin: "8px 10px" }}>
              {course.tags?.map((tag) => (
                  <Tag key={tag.name} color="#3b7159" style={{ margin: 5, fontSize: 15 }}>
                    {tag.name}
                  </Tag>
              ))}
            </Col>
          </Row>
          <Row justify="center">
            <Col style={{ marginTop: "20px" }}>
              <Button
                  style={{
                    width: "100px",
                    background: "rgba(0, 100, 0, 0.15)",
                    padding: "20px",
                    margin: "10px",
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
      </Col>
  );
};
export default CardCourse;
