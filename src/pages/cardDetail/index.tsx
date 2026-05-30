import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Spin, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import type { CourseDto } from "../../api/types/course";

const { Title, Text } = Typography;

const CardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8081/api/Courses/${id}`);
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Ошибка загрузки курса:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3}>Курс не найден</Title>
        <Button onClick={() => navigate("/")}>Вернуться на главную</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        Назад
      </Button>

      <Card>
        <Title level={2}>{course.title}</Title>

        <div style={{ marginBottom: "20px" }}>
          <ReactMarkdown>{course.description}</ReactMarkdown>
        </div>

        {course.author && (
          <div style={{ marginBottom: "10px" }}>
            <Text type="secondary">Автор: </Text>
            <Text>{course.author.name}</Text>
          </div>
        )}

        {course.publishedAt && (
          <div style={{ marginBottom: "10px" }}>
            <Text type="secondary">Опубликовано: </Text>
            <Text>
              {new Date(course.publishedAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </div>
        )}

        {course.tags && course.tags.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <Text type="secondary">Теги: </Text>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {course.tags.map((tag) => (
                <span
                  style={{
                    background: "#3b7159",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "30px" }}>
          <Button
            type="primary"
            size="large"
            style={{
              background: "rgba(0, 100, 0, 0.15)",
              color: "black",
              border: "none",
            }}
          >
            Начать обучение
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CardDetailPage;
