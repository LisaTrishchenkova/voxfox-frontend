import { Button, Card, Col, Image, Row, Tag, Typography } from "antd";
import ReactMarkdown from "react-markdown";
import type { CourseDto, TagsDto } from "../../api/types/course";
import { BookOutlined, HeartOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
type CardCourseProps = {
  course: CourseDto;
};
const CardCourse = ({ course }: CardCourseProps) => {
  const navigate = useNavigate();
  const { Title } = Typography;
  const { Text } = Typography;

  const goToCoursePage = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <Col span={6}>
      <Card variant="borderless" size="default" onClick={goToCoursePage}>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <BookOutlined style={{ fontSize: "20px", color: "#e97c15" }} />{" "}
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {/* <Image src="https://static.aviasales.com/psgr-v2/ru/putevoditel-po-islandii/shutterstock_aa704c95ce.jpg?" /> */}
            <HeartOutlined style={{ fontSize: "20px", color: "#AC2724" }} />
          </Col>
        </Row>
        <hr
          style={{
            backgroundColor: "black",
            margin: "10px 0",
          }}
        />
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
            {course.tags &&
              course.tags.map((tag) => (
                <Tag
                  key={tag.id}
                  color="#3b7159"
                  style={{ margin: "5px", fontSize: "15px" }}
                >
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
