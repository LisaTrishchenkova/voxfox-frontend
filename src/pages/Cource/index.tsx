import { Layout, Card, Typography, Row, Col, Tag } from "antd";
import {
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { gradients } from "../../theme";
import Sidebar from "../../components/Sidebar";

const { Content } = Layout;
const { Title, Text } = Typography;

// Тип курса
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published";
  students: number;
  updatedAt: string;
  lessonsCount: number;
  duration: string;
  author: string;
}

const Course = () => {
  const navigate = useNavigate();
  // const [selectedMenu, setSelectedMenu] = useState("courses");

  // Тестовые данные курсов (3 примера)
  const courses: Course[] = [
    {
      id: "1",
      title: "React для начинающих",
      description:
        "Изучите основы React, создайте свое первое приложение и поймите основные концепции.",
      category: "Программирование",
      level: "beginner",
      status: "published",
      students: 245,
      updatedAt: "2 дня назад",
      lessonsCount: 15,
      duration: "20 часов",
      author: "Алексей Петров",
    },
    {
      id: "2",
      title: "TypeScript с нуля",
      description:
        "Освойте TypeScript для создания надежных и масштабируемых приложений.",
      category: "Программирование",
      level: "intermediate",
      status: "draft",
      students: 0,
      updatedAt: "вчера",
      lessonsCount: 12,
      duration: "18 часов",
      author: "Алексей Петров",
    },
    {
      id: "3",
      title: "UI/UX дизайн",
      description:
        "Создание красивых и удобных интерфейсов для веб и мобильных приложений.",
      category: "Дизайн",
      level: "beginner",
      status: "published",
      students: 156,
      updatedAt: "неделю назад",
      lessonsCount: 10,
      duration: "15 часов",
      author: "Алексей Петров",
    },
  ];

  // const handleCreateCourse = () => {
  //   // navigate('/course/new');
  //   navigate("/cource-creating");
  // };

  // При клике на карточку курса - переходим на страницу уроков
  const handleCourseClick = (courseId: string) => {
    // navigate(`/course/${courseId}/lessons`);
    console.log(courseId);
    navigate("/cource-lesson");
  };

  // При клике на редактирование - открываем форму редактирования курса
  const handleEditCourse = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем всплытие, чтобы не открылась страница уроков
    // navigate(`/course/${courseId}/edit`);
    console.log(courseId);
    navigate("/cource-creating");
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />

      <Layout style={{ flex: 1, background: "#fafafa" }}>
        {/* Левое меню */}
        <Sidebar coursesCount={courses.length} />

        {/* Основной контент */}
        <Content style={{ padding: "32px" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {/* Заголовок */}
            <div style={{ marginBottom: "32px" }}>
              <Title level={2} style={{ margin: 0 }}>
                Мои курсы
              </Title>
              <Text type="secondary">
                Управляйте своими курсами и создавайте новые
              </Text>
            </div>

            {/* Список курсов */}
            <Row gutter={[24, 24]}>
              {courses.map((course) => (
                <Col key={course.id} xs={24} md={12} lg={8}>
                  <Card
                    hoverable
                    onClick={() => handleCourseClick(course.id)}
                    style={{
                      height: "100%",
                      borderRadius: "16px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    cover={
                      <div
                        style={{
                          height: "140px",
                          background:
                            course.status === "published"
                              ? gradients.primaryLight
                              : "linear-gradient(135deg, #f6ffed 0%, #fff7e6 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <BookOutlined
                          style={{
                            fontSize: "48px",
                            color:
                              course.status === "published"
                                ? "#52c41a"
                                : "#fa8c16",
                          }}
                        />
                      </div>
                    }
                    actions={[
                      <EditOutlined
                        key="edit"
                        onClick={(e) => handleEditCourse(course.id, e)}
                      />,
                      <DeleteOutlined
                        key="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Логика удаления
                        }}
                      />,
                    ]}
                  >
                    {/* Статус курса */}
                    <div style={{ marginBottom: "12px" }}>
                      <Tag
                        color={
                          course.status === "published" ? "green" : "orange"
                        }
                        style={{
                          borderRadius: "12px",
                          padding: "4px 12px",
                          fontWeight: 500,
                        }}
                      >
                        {course.status === "published"
                          ? "Опубликован"
                          : "Черновик"}
                      </Tag>
                    </div>

                    {/* Название и описание */}
                    <Title level={4} style={{ marginBottom: "8px" }}>
                      {course.title}
                    </Title>

                    <Text
                      type="secondary"
                      style={{
                        display: "block",
                        marginBottom: "16px",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {course.description}
                    </Text>

                    {/* Информация об авторе */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <UserOutlined
                        style={{
                          marginRight: "8px",
                          color: "#595959",
                          fontSize: "14px",
                        }}
                      />
                      <Text style={{ fontSize: "14px" }}>{course.author}</Text>
                    </div>

                    {/* Статистика курса */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "16px",
                        paddingTop: "16px",
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <PlayCircleOutlined
                            style={{ color: "#595959", fontSize: "14px" }}
                          />
                          <Text style={{ fontSize: "14px", fontWeight: 500 }}>
                            {course.lessonsCount}
                          </Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          уроков
                        </Text>
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <Text style={{ fontSize: "14px", fontWeight: 500 }}>
                          {course.duration}
                        </Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          длительность
                        </Text>
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <Text style={{ fontSize: "14px", fontWeight: 500 }}>
                          {course.students}
                        </Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          студентов
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Content>
      </Layout>

      <Footer />
    </div>
  );
};

export default Course;
