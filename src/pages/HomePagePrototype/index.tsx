import { Col, Row, Typography } from "antd";
import FooterPrototype from "../../components/FooterPrototype";
import HeaderPrototype from "../../components/HeaderPrototype";

const { Title, Text, Paragraph } = Typography;

const HomePagePrototype = () => {
  const courses = [
    {
      id: 1,
      title: "React с нуля до PRO",
      description:
        "Освойте современный React с хуками, контекстом и Redux Toolkit",
      category: "frontend",
      level: "beginner",
      duration: "42 часа",
      students: 24500,
      rating: 4.9,
      price: 29900,
      discountedPrice: 19900,
      instructor: "Иван Петров",
      lessons: 28,
      progress: 65,
      isFeatured: true,
    },
    {
      id: 2,
      title: "Полный курс по TypeScript",
      description:
        "TypeScript для разработчиков JavaScript. Generics, Decorators, Advanced Types",
      category: "frontend",
      level: "intermediate",
      duration: "36 часов",
      students: 18200,
      rating: 4.8,
      price: 24900,
      instructor: "Анна Сидорова",
      lessons: 24,
      isNew: true,
    },
    {
      id: 3,
      title: "Node.js и Express",
      description:
        "Создание серверных приложений на Node.js с использованием Express и MongoDB",
      category: "backend",
      level: "intermediate",
      duration: "48 часов",
      students: 15600,
      rating: 4.7,
      price: 34900,
      instructor: "Дмитрий Козлов",
      lessons: 32,
    },
    {
      id: 4,
      title: "UI/UX Дизайн для разработчиков",
      description: "Основы дизайна интерфейсов, Figma, прототипирование",
      category: "design",
      level: "beginner",
      duration: "28 часов",
      students: 11200,
      rating: 4.9,
      price: 22900,
      discountedPrice: 17900,
      instructor: "Мария Иванова",
      lessons: 18,
    },
    {
      id: 5,
      title: "Python для Data Science",
      description: "Анализ данных, машинное обучение и визуализация на Python",
      category: "data",
      level: "advanced",
      duration: "60 часов",
      students: 8900,
      rating: 4.8,
      price: 45900,
      instructor: "Алексей Смирнов",
      lessons: 40,
      isFeatured: true,
    },
    {
      id: 6,
      title: "DevOps и Docker",
      description: "Контейнеризация, оркестрация и CI/CD пайплайны",
      category: "devops",
      level: "intermediate",
      duration: "40 часов",
      students: 7600,
      rating: 4.6,
      price: 37900,
      instructor: "Сергей Волков",
      lessons: 26,
    },
    {
      id: 7,
      title: "Vue.js 3 Composition API",
      description: "Современный Vue 3 с Composition API, Pinia и TypeScript",
      category: "frontend",
      level: "intermediate",
      duration: "34 часа",
      students: 13400,
      rating: 4.7,
      price: 26900,
      instructor: "Ольга Новикова",
      lessons: 22,
    },
    {
      id: 8,
      title: "Алгоритмы и структуры данных",
      description: "Подготовка к техническим собеседованиям в IT-компаниях",
      category: "algorithms",
      level: "advanced",
      duration: "52 часа",
      students: 21500,
      rating: 4.9,
      price: 32900,
      instructor: "Павел Лебедев",
      lessons: 35,
    },
    {
      id: 9,
      title: "Мобильная разработка на Flutter",
      description: "Создание кроссплатформенных мобильных приложений",
      category: "mobile",
      level: "beginner",
      duration: "45 часов",
      students: 9800,
      rating: 4.6,
      price: 28900,
      instructor: "Екатерина Фёдорова",
      lessons: 30,
      isNew: true,
    },
    {
      id: 10,
      title: "GraphQL и Apollo",
      description: "Современный API с GraphQL, Apollo Client и Server",
      category: "backend",
      level: "advanced",
      duration: "32 часа",
      students: 6400,
      rating: 4.7,
      price: 31900,
      instructor: "Артем Васильев",
      lessons: 21,
    },
    {
      id: 11,
      title: "Тестирование на JavaScript",
      description: "Unit, Integration и E2E тестирование с Jest и Cypress",
      category: "testing",
      level: "intermediate",
      duration: "38 часов",
      students: 7200,
      rating: 4.5,
      price: 23900,
      instructor: "Наталья Ковалёва",
      lessons: 25,
    },
    {
      id: 12,
      title: "Системное проектирование",
      description:
        "Проектирование масштабируемых систем и архитектурные паттерны",
      category: "architecture",
      level: "advanced",
      duration: "50 часов",
      students: 5400,
      rating: 4.8,
      price: 49900,
      discountedPrice: 39900,
      instructor: "Михаил Орлов",
      lessons: 33,
      isFeatured: true,
    },
  ];

  const categories = [
    { value: "all", label: "Все курсы", count: 12 },
    { value: "frontend", label: "Frontend", count: 3 },
    { value: "backend", label: "Backend", count: 2 },
    { value: "mobile", label: "Mobile", count: 1 },
    { value: "data", label: "Data Science", count: 1 },
    { value: "devops", label: "DevOps", count: 1 },
    { value: "design", label: "Дизайн", count: 1 },
    { value: "algorithms", label: "Алгоритмы", count: 1 },
    { value: "testing", label: "Тестирование", count: 1 },
    { value: "architecture", label: "Архитектура", count: 1 },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <HeaderPrototype />

      <main style={{ flex: 1, background: "#fafafa" }}>
        {/* Герой-секция */}
        <div
          style={{
            background: "#f5f5f5",
            padding: "80px 20px",
            textAlign: "center",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Title level={1} style={{ marginBottom: "16px", color: "#333" }}>
              Найдите свой идеальный курс!!!!!!!!!!!!!!!!!!!123
            </Title>
            <Paragraph
              style={{ fontSize: "20px", color: "#666", marginBottom: "48px" }}
            >
              Более 1000 курсов по программированию, дизайну, data science и
              другим направлениям от лучших экспертов
            </Paragraph>

            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              {/* Поле поиска */}
              <div
                style={{
                  display: "flex",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: "#fff",
                    color: "#999",
                  }}
                >
                  Введите название курса, технологию или ключевое слово...
                </div>
                <div
                  style={{
                    padding: "12px 24px",
                    background: "#e0e0e0",
                    borderLeft: "1px solid #ddd",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Найти курс
                </div>
              </div>

              {/* Популярные теги */}
              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Text style={{ marginRight: "12px", color: "#666" }}>
                  Популярное:
                </Text>
                {[
                  "React",
                  "JavaScript",
                  "Python",
                  "TypeScript",
                  "UI/UX",
                  "Node.js",
                  "Docker",
                ].map((tag) => (
                  <div
                    key={tag}
                    style={{
                      padding: "4px 12px",
                      background: "#f0f0f0",
                      border: "1px solid #ddd",
                      borderRadius: "16px",
                      color: "#666",
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}
        >
          <Row gutter={[32, 32]}>
            {/* Боковая панель с фильтрами */}
            <Col xs={24} md={8} lg={6}>
              {/* Фильтры */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "#e0e0e0",
                      marginRight: "8px",
                    }}
                  ></div>
                  <Text strong style={{ color: "#333" }}>
                    Фильтры
                  </Text>
                </div>

                {/* Категории */}
                <div style={{ marginBottom: "32px" }}>
                  <Title
                    level={5}
                    style={{ marginBottom: "16px", color: "#333" }}
                  >
                    Категории
                  </Title>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {categories.map((cat) => (
                      <div
                        key={cat.value}
                        style={{
                          padding: "12px 16px",
                          background: "#f5f5f5",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              background: "#ddd",
                            }}
                          ></div>
                          <span style={{ color: "#333" }}>{cat.label}</span>
                        </div>
                        <div
                          style={{
                            background: "#e0e0e0",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "#666",
                          }}
                        >
                          {cat.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Уровень */}
                <div style={{ marginBottom: "32px" }}>
                  <Title
                    level={5}
                    style={{ marginBottom: "16px", color: "#333" }}
                  >
                    Уровень
                  </Title>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {["Все уровни", "Начинающий", "Средний", "Продвинутый"].map(
                      (level) => (
                        <div
                          key={level}
                          style={{
                            padding: "8px 16px",
                            background: "#f5f5f5",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            color: "#333",
                          }}
                        >
                          {level}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Цена */}
                <div style={{ marginBottom: "32px" }}>
                  <Title
                    level={5}
                    style={{ marginBottom: "16px", color: "#333" }}
                  >
                    Цена, ₽
                  </Title>
                  <div style={{ padding: "0 8px" }}>
                    <div
                      style={{
                        height: "4px",
                        background: "#e0e0e0",
                        borderRadius: "2px",
                        position: "relative",
                        margin: "20px 0",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "20%",
                          right: "40%",
                          height: "100%",
                          background: "#ccc",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "8px",
                      }}
                    >
                      <Text style={{ color: "#666" }}>0 ₽</Text>
                      <Text style={{ color: "#666" }}>50 000 ₽</Text>
                    </div>
                  </div>
                </div>

                {/* Кнопка сброса */}
                <div
                  style={{
                    padding: "12px",
                    background: "#f0f0f0",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    textAlign: "center",
                    fontWeight: 500,
                    color: "#333",
                  }}
                >
                  Сбросить фильтры
                </div>
              </div>

              {/* Статистика */}
              <div
                style={{
                  background: "#f9f9f9",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "20px",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <Text strong style={{ color: "#333" }}>
                    Найдено курсов:
                  </Text>
                  <Title level={3} style={{ margin: "8px 0", color: "#333" }}>
                    12
                  </Title>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <Text style={{ color: "#666" }}>
                    Всего курсов в каталоге:
                  </Text>
                  <Text strong style={{ fontSize: "16px", color: "#333" }}>
                    {" "}
                    12
                  </Text>
                </div>
                <div>
                  <Text style={{ color: "#666" }}>Средний рейтинг:</Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "4px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: "16px",
                            height: "16px",
                            background: i < 4 ? "#ccc" : "#e0e0e0",
                            borderRadius: "2px",
                          }}
                        ></div>
                      ))}
                    </div>
                    <Text strong style={{ color: "#666" }}>
                      4.7/5
                    </Text>
                  </div>
                </div>
              </div>
            </Col>

            {/* Основная часть с курсами */}
            <Col xs={24} md={16} lg={18}>
              {/* Заголовок и сортировка */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <Title level={2} style={{ margin: 0, color: "#333" }}>
                    Каталог курсов
                  </Title>
                  <Text style={{ color: "#666" }}>Все курсы (12)</Text>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Text style={{ color: "#666" }}>Сортировать:</Text>
                  <div
                    style={{
                      width: "200px",
                      padding: "8px 12px",
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      color: "#333",
                    }}
                  >
                    По популярности
                  </div>
                </div>
              </div>

              {/* Сетка курсов */}
              <Row gutter={[24, 32]}>
                {courses.map((course) => (
                  <Col xs={24} sm={12} lg={8} key={course.id}>
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          padding: "20px",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div style={{ marginBottom: "16px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "12px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  background: "#e0e0e0",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                }}
                              ></div>
                              <div
                                style={{
                                  padding: "4px 8px",
                                  background: "#f0f0f0",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  color: "#333",
                                }}
                              >
                                {course.level === "beginner"
                                  ? "Начинающий"
                                  : course.level === "intermediate"
                                    ? "Средний"
                                    : "Продвинутый"}
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "4px" }}>
                              {course.isNew && (
                                <div
                                  style={{
                                    background: "#e0e0e0",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    fontSize: "10px",
                                    fontWeight: 500,
                                    color: "#333",
                                  }}
                                >
                                  NEW
                                </div>
                              )}
                              {course.isFeatured && (
                                <div
                                  style={{
                                    background: "#e0e0e0",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    fontSize: "10px",
                                    fontWeight: 500,
                                    color: "#333",
                                  }}
                                >
                                  FEATURED
                                </div>
                              )}
                            </div>
                          </div>

                          <Title
                            level={5}
                            style={{ margin: "0 0 8px 0", color: "#333" }}
                          >
                            {course.title}
                          </Title>
                          <Paragraph
                            style={{
                              color: "#666",
                              marginBottom: "16px",
                              fontSize: "13px",
                              minHeight: "36px",
                            }}
                          >
                            {course.description}
                          </Paragraph>
                        </div>

                        <div style={{ marginBottom: "16px", flex: 1 }}>
                          {/* Инструктор */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "12px",
                              padding: "8px",
                              background: "#f9f9f9",
                              borderRadius: "4px",
                            }}
                          >
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                background: "#ddd",
                                borderRadius: "50%",
                                marginRight: "8px",
                              }}
                            ></div>
                            <Text style={{ fontSize: "13px", color: "#333" }}>
                              {course.instructor}
                            </Text>
                          </div>

                          {/* Детали курса */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "8px",
                              marginBottom: "16px",
                            }}
                          >
                            <div
                              style={{
                                textAlign: "center",
                                padding: "8px",
                                background: "#f9f9f9",
                                borderRadius: "4px",
                              }}
                            >
                              <Text style={{ fontSize: "12px", color: "#333" }}>
                                {course.duration}
                              </Text>
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                padding: "8px",
                                background: "#f9f9f9",
                                borderRadius: "4px",
                              }}
                            >
                              <Text style={{ fontSize: "12px", color: "#333" }}>
                                {course.lessons} уроков
                              </Text>
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                padding: "8px",
                                background: "#f9f9f9",
                                borderRadius: "4px",
                              }}
                            >
                              <Text style={{ fontSize: "12px", color: "#333" }}>
                                {(course.students / 1000).toFixed(1)}k студентов
                              </Text>
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                padding: "8px",
                                background: "#f9f9f9",
                                borderRadius: "4px",
                              }}
                            >
                              <Text style={{ fontSize: "12px", color: "#333" }}>
                                {course.rating} рейтинг
                              </Text>
                            </div>
                          </div>

                          {/* Прогресс (если есть) */}
                          {course.progress && (
                            <div style={{ marginBottom: "16px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "4px",
                                }}
                              >
                                <Text
                                  style={{ fontSize: "12px", color: "#666" }}
                                >
                                  Прогресс
                                </Text>
                                <Text
                                  style={{
                                    fontSize: "12px",
                                    color: "#333",
                                    fontWeight: 500,
                                  }}
                                >
                                  {course.progress}%
                                </Text>
                              </div>
                              <div
                                style={{
                                  height: "6px",
                                  background: "#e0e0e0",
                                  borderRadius: "3px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${course.progress}%`,
                                    height: "100%",
                                    background: "#ccc",
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Нижняя часть карточки */}
                        <div
                          style={{
                            borderTop: "1px solid #eee",
                            paddingTop: "16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "12px",
                            }}
                          >
                            <div>
                              {course.discountedPrice ? (
                                <>
                                  <Text
                                    strong
                                    style={{ fontSize: "18px", color: "#333" }}
                                  >
                                    {formatPrice(course.discountedPrice)}
                                  </Text>
                                  <Text
                                    style={{
                                      marginLeft: "8px",
                                      fontSize: "14px",
                                      color: "#999",
                                      textDecoration: "line-through",
                                    }}
                                  >
                                    {formatPrice(course.price)}
                                  </Text>
                                </>
                              ) : (
                                <Text
                                  strong
                                  style={{ fontSize: "18px", color: "#333" }}
                                >
                                  {formatPrice(course.price)}
                                </Text>
                              )}
                            </div>
                            <div style={{ display: "flex", gap: "2px" }}>
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  style={{
                                    width: "14px",
                                    height: "14px",
                                    background:
                                      i < Math.floor(course.rating)
                                        ? "#ccc"
                                        : "#e0e0e0",
                                    borderRadius: "2px",
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                          <div
                            style={{
                              padding: "12px",
                              background: "#e0e0e0",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              textAlign: "center",
                              fontWeight: 500,
                              color: "#333",
                              cursor: "pointer",
                            }}
                          >
                            {course.progress ? "Продолжить" : "Начать курс"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Пагинация */}
              <div style={{ textAlign: "center", marginTop: "48px" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "12px 40px",
                    background: "#e0e0e0",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontWeight: 500,
                    fontSize: "16px",
                    color: "#333",
                  }}
                >
                  Показать еще курсы
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Секция преимуществ */}
        <div
          style={{
            background: "#f5f5f5",
            padding: "80px 20px",
            marginTop: "64px",
            borderTop: "1px solid #ddd",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Title
              level={2}
              style={{
                textAlign: "center",
                marginBottom: "48px",
                color: "#333",
              }}
            >
              Почему выбирают VoxFox?
            </Title>
            <Row gutter={[32, 32]}>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#e0e0e0",
                      borderRadius: "8px",
                      margin: "0 auto 20px",
                    }}
                  ></div>
                  <Title level={4} style={{ color: "#333" }}>
                    Сертификаты
                  </Title>
                  <Paragraph style={{ color: "#666" }}>
                    Официальные сертификаты об окончании курсов
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#e0e0e0",
                      borderRadius: "8px",
                      margin: "0 auto 20px",
                    }}
                  ></div>
                  <Title level={4} style={{ color: "#333" }}>
                    Практика
                  </Title>
                  <Paragraph style={{ color: "#666" }}>
                    Реальные проекты и домашние задания
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#e0e0e0",
                      borderRadius: "8px",
                      margin: "0 auto 20px",
                    }}
                  ></div>
                  <Title level={4} style={{ color: "#333" }}>
                    Сообщество
                  </Title>
                  <Paragraph style={{ color: "#666" }}>
                    Поддержка менторов и единомышленников
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#e0e0e0",
                      borderRadius: "8px",
                      margin: "0 auto 20px",
                    }}
                  ></div>
                  <Title level={4} style={{ color: "#333" }}>
                    Трудоустройство
                  </Title>
                  <Paragraph style={{ color: "#666" }}>
                    Помощь в подготовке к собеседованиям
                  </Paragraph>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </main>

      <FooterPrototype />
    </div>
  );
};

export default HomePagePrototype;
