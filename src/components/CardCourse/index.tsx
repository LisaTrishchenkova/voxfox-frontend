import { Button, Card, Col, Image, Row, Tag, Typography } from "antd";
import ReactMarkdown from "react-markdown";
import type { CourseDto, TagsDto } from "../../api/types/course";
import { BookOutlined, HeartOutlined } from "@ant-design/icons";
import { useState } from "react";
type CardCourseProps = {
  course: CourseDto;
};
const CardCourse = ({ course }: CardCourseProps) => {
  const { Title } = Typography;

  return (
    <Col span={6}>
      <Card variant="borderless" size="default">
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
        <Row>
          <Col>
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
                background: "rgba(59, 113, 89, 0.5)",
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
