// src/pages/CourseLessonsPage.tsx
import { useState } from "react";
import {
  Button,
  Card,
  Typography,
  List,
  Space,
  Input,
  Modal,
  Form,
  Select,
  message,
} from "antd";
import {
  PlusOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: "video" | "text" | "quiz";
  duration: string;
  isFreePreview: boolean;
  order: number;
  content?: string;
  videoUrl?: string;
}

const CourseLessonsPage = () => {
  // const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "1",
      title: "Введение в React",
      description: "Знакомство с библиотекой React и её основными концепциями",
      type: "video",
      duration: "25 мин",
      isFreePreview: true,
      order: 1,
    },
    {
      id: "2",
      title: "Компоненты и JSX",
      description: "Создание компонентов и работа с JSX синтаксисом",
      type: "video",
      duration: "30 мин",
      isFreePreview: false,
      order: 2,
    },
    {
      id: "3",
      title: "Практическое задание",
      description: "Создание своего первого компонента",
      type: "text",
      duration: "15 мин",
      isFreePreview: false,
      order: 3,
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const handleAddLesson = () => {
    setEditingLesson(null);
    setIsModalVisible(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsModalVisible(true);
  };

  const handleSaveLesson = (values: any) => {
    if (editingLesson) {
      // Редактируем существующий урок
      setLessons(
        lessons.map((l) =>
          l.id === editingLesson.id ? { ...l, ...values } : l,
        ),
      );
      message.success("Урок обновлен");
    } else {
      // Добавляем новый урок
      const newLesson: Lesson = {
        id: `lesson-${Date.now()}`,
        ...values,
        order: lessons.length + 1,
      };
      setLessons([...lessons, newLesson]);
      message.success("Урок добавлен");
    }
    setIsModalVisible(false);
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />

      <div style={{ flex: 1, padding: "32px", background: "#fafafa" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Заголовок и действия */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "32px",
            }}
          >
            <div>
              <Title level={2}>Уроки курса "React для начинающих"</Title>
              <Text type="secondary">
                Добавляйте и редактируйте уроки вашего курса
              </Text>
            </div>
            <Space>
              <Button onClick={() => navigate(`/cource`)}>
                Назад к курсам
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddLesson}
              >
                Добавить урок
              </Button>
            </Space>
          </div>

          {/* Список уроков */}
          <Card>
            <List
              dataSource={lessons.sort((a, b) => a.order - b.order)}
              renderItem={(lesson) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        /* предпросмотр */
                      }}
                    />,
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditLesson(lesson)}
                    />,
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        setLessons(lessons.filter((l) => l.id !== lesson.id))
                      }
                    />,
                    <DragOutlined style={{ cursor: "move" }} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          background:
                            lesson.type === "video" ? "#e6f7ff" : "#f6ffed",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {lesson.type === "video" ? (
                          <VideoCameraOutlined
                            style={{ fontSize: "20px", color: "#1890ff" }}
                          />
                        ) : (
                          <FileTextOutlined
                            style={{ fontSize: "20px", color: "#52c41a" }}
                          />
                        )}
                      </div>
                    }
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Text strong>{lesson.title}</Text>
                        {lesson.isFreePreview && (
                          <span
                            style={{
                              fontSize: "12px",
                              padding: "2px 8px",
                              background: "#f6ffed",
                              color: "#52c41a",
                              borderRadius: "12px",
                            }}
                          >
                            Бесплатный просмотр
                          </span>
                        )}
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary">{lesson.description}</Text>
                        <div style={{ marginTop: "4px" }}>
                          <Space>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {lesson.type === "video" ? "Видео" : "Текст"}
                            </Text>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {lesson.duration}
                            </Text>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              Порядок: {lesson.order}
                            </Text>
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Подсказки */}
          <Card style={{ marginTop: "24px" }}>
            <Title level={5}>💡 Как создать хороший курс:</Title>
            <Space direction="vertical" size="small">
              <Text>1. Начните с вводного урока (бесплатного)</Text>
              <Text>2. Чередуйте теорию и практику</Text>
              <Text>3. Добавляйте практические задания</Text>
              <Text>4. Создайте итоговый проект</Text>
            </Space>
          </Card>
        </div>
      </div>

      <Footer />

      {/* Модальное окно создания/редактирования урока */}
      <Modal
        title={editingLesson ? "Редактирование урока" : "Создание урока"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          layout="vertical"
          onFinish={handleSaveLesson}
          initialValues={editingLesson || undefined}
        >
          <Form.Item
            label="Название урока"
            name="title"
            rules={[{ required: true, message: "Введите название урока" }]}
          >
            <Input placeholder="Например: Введение в React" />
          </Form.Item>

          <Form.Item label="Описание" name="description">
            <TextArea rows={3} placeholder="Краткое описание урока" />
          </Form.Item>

          <Form.Item
            label="Тип урока"
            name="type"
            rules={[{ required: true, message: "Выберите тип урока" }]}
          >
            <Select>
              <Select.Option value="video">Видео урок</Select.Option>
              <Select.Option value="text">Текстовый урок</Select.Option>
              <Select.Option value="quiz">Тест/Квиз</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Длительность" name="duration">
            <Input placeholder="Например: 25 мин" />
          </Form.Item>

          <Form.Item
            label="Бесплатный предпросмотр"
            name="isFreePreview"
            valuePropName="checked"
          >
            <input type="checkbox" />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: "24px" }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Отмена</Button>
              <Button type="primary" htmlType="submit">
                {editingLesson ? "Сохранить" : "Создать урок"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseLessonsPage;
