import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  FireOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Input,
  Progress,
  Rate,
  Row,
  Select,
  Slider,
  Space,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { commonStyles, componentProps, gradients } from "../../theme";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Типизация курса
interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  students: number;
  rating: number;
  price: number;
  discountedPrice?: number;
  tags: string[];
  instructor: string;
  instructorAvatar?: string;
  imageColor: string;
  progress?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  lessons: number;
}

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<string>("popular");

  // Моковые данные курсов
  const courses: Course[] = [
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
      tags: ["React", "TypeScript", "Hooks"],
      instructor: "Иван Петров",
      imageColor: "#1890ff",
      isFeatured: true,
      progress: 65,
      lessons: 28,
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
      tags: ["TypeScript", "JavaScript"],
      instructor: "Анна Сидорова",
      imageColor: "#722ed1",
      isNew: true,
      lessons: 24,
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
      tags: ["Node.js", "Express", "MongoDB"],
      instructor: "Дмитрий Козлов",
      imageColor: "#52c41a",
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
      tags: ["Figma", "UI/UX", "Дизайн"],
      instructor: "Мария Иванова",
      imageColor: "#fa8c16",
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
      tags: ["Python", "Data Science", "ML"],
      instructor: "Алексей Смирнов",
      imageColor: "#13c2c2",
      isFeatured: true,
      lessons: 40,
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
      tags: ["Docker", "Kubernetes", "CI/CD"],
      instructor: "Сергей Волков",
      imageColor: "#f5222d",
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
      tags: ["Vue.js", "TypeScript"],
      instructor: "Ольга Новикова",
      imageColor: "#52c41a",
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
      tags: ["Алгоритмы", "Интервью"],
      instructor: "Павел Лебедев",
      imageColor: "#722ed1",
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
      tags: ["Flutter", "Dart", "Mobile"],
      instructor: "Екатерина Фёдорова",
      imageColor: "#1890ff",
      isNew: true,
      lessons: 30,
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
      tags: ["GraphQL", "Apollo"],
      instructor: "Артем Васильев",
      imageColor: "#eb2f96",
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
      tags: ["Jest", "Cypress", "Testing"],
      instructor: "Наталья Ковалёва",
      imageColor: "#fa8c16",
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
      tags: ["Архитектура", "System Design"],
      instructor: "Михаил Орлов",
      imageColor: "#13c2c2",
      isFeatured: true,
      lessons: 33,
    },
  ];

  // Категории курсов
  const categories = [
    { value: "all", label: "Все курсы", count: courses.length, icon: "" },
    {
      value: "frontend",
      label: "Frontend",
      count: courses.filter((c) => c.category === "frontend").length,
      icon: "",
    },
    {
      value: "backend",
      label: "Backend",
      count: courses.filter((c) => c.category === "backend").length,
      icon: "",
    },
    {
      value: "mobile",
      label: "Mobile",
      count: courses.filter((c) => c.category === "mobile").length,
      icon: "",
    },
    {
      value: "data",
      label: "Data Science",
      count: courses.filter((c) => c.category === "data").length,
      icon: "",
    },
    {
      value: "devops",
      label: "DevOps",
      count: courses.filter((c) => c.category === "devops").length,
      icon: "",
    },
    {
      value: "design",
      label: "Дизайн",
      count: courses.filter((c) => c.category === "design").length,
      icon: "",
    },
    {
      value: "algorithms",
      label: "Алгоритмы",
      count: courses.filter((c) => c.category === "algorithms").length,
      icon: "",
    },
    {
      value: "testing",
      label: "Тестирование",
      count: courses.filter((c) => c.category === "testing").length,
      icon: "",
    },
    {
      value: "architecture",
      label: "Архитектура",
      count: courses.filter((c) => c.category === "architecture").length,
      icon: "",
    },
  ];

  // Уровни сложности
  const levels = [
    { value: "all", label: "Все уровни", color: "default" },
    { value: "beginner", label: "Начинающий", color: "green" },
    { value: "intermediate", label: "Средний", color: "orange" },
    { value: "advanced", label: "Продвинутый", color: "red" },
  ];

  // Фильтрация и сортировка курсов
  const filteredCourses = courses
    .filter((course) => {
      // Поиск по названию и описанию
      if (
        searchQuery &&
        !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !course.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Фильтр по категории
      if (selectedCategory !== "all" && course.category !== selectedCategory) {
        return false;
      }

      // Фильтр по уровню
      if (selectedLevel !== "all" && course.level !== selectedLevel) {
        return false;
      }

      // Фильтр по цене
      if (course.discountedPrice) {
        if (
          course.discountedPrice < priceRange[0] ||
          course.discountedPrice > priceRange[1]
        ) {
          return false;
        }
      } else {
        if (course.price < priceRange[0] || course.price > priceRange[1]) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Сортировка
      switch (sortBy) {
        case "popular":
          return b.students - a.students;
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return (
            (a.discountedPrice || a.price) - (b.discountedPrice || b.price)
          );
        case "price-high":
          return (
            (b.discountedPrice || b.price) - (a.discountedPrice || a.price)
          );
        case "new":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return b.students - a.students;
      }
    });

  // Функция для форматирования цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  // Функция для получения цвета уровня
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: "#52c41a",
      intermediate: "#fa8c16",
      advanced: "#f5222d",
    };
    return colors[level] || "#d9d9d9";
  };

  // Функция для получения русскоязычного названия уровня
  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: "Начинающий",
      intermediate: "Средний",
      advanced: "Продвинутый",
    };
    return labels[level] || level;
  };

  // Получение иконки категории
  const getCategoryIcon = (category: string) => {
    const icon = categories.find((c) => c.value === category)?.icon;
    return icon || "📚";
  };

  return (
    <div style={commonStyles.pageLayout}>
      <Header />

      <main style={commonStyles.mainContent}>
        {/* Герой-секция с поиском */}
        <div style={commonStyles.heroSection}>
          <div style={{ ...commonStyles.container, padding: "0 20px" }}>
            <Title
              level={1}
              style={{ ...commonStyles.titleGradient, marginBottom: 16 }}
            >
              Найдите свой идеальный курс!!!!!!!!!!!!!!!!!!!123
            </Title>
            <Paragraph style={commonStyles.paragraphLarge}>
              Более 1000 курсов по программированию, дизайну, data science и
              другим направлениям от лучших экспертов
            </Paragraph>

            {/* Поисковая строка */}
            <div style={commonStyles.containerNarrow}>
              <Input.Search
                size="large"
                placeholder="Введите название курса, технологию или ключевое слово..."
                enterButton={
                  <Button
                    size="large"
                    {...componentProps.button.primaryGradient}
                  >
                    <SearchOutlined /> Найти курс
                  </Button>
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Популярные теги */}
              <Space {...componentProps.space.wrapCenter}>
                <Text {...componentProps.text.secondary}>Популярное:</Text>
                {[
                  "React",
                  "JavaScript",
                  "Python",
                  "TypeScript",
                  "UI/UX",
                  "Node.js",
                  "Docker",
                ].map((tag) => (
                  <Tag
                    key={tag}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div style={commonStyles.container}>
          <Row gutter={[32, 32]}>
            {/* Боковая панель с фильтрами */}
            <Col xs={24} md={8} lg={6}>
              <Card
                title={
                  <Space>
                    <FilterOutlined />
                    <Text strong>Фильтры</Text>
                  </Space>
                }
              >
                {/* Категории */}
                <div style={{ marginBottom: "32px" }}>
                  <Title level={5} style={{ marginBottom: "16px" }}>
                    Категории
                  </Title>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {categories.map((cat) => (
                      <Button
                        key={cat.value}
                        type={
                          selectedCategory === cat.value ? "primary" : "default"
                        }
                        block
                        style={{
                          textAlign: "left",
                          justifyContent: "space-between",
                          height: 48,
                          ...(selectedCategory === cat.value && {
                            background: gradients.primary,
                            border: "none",
                          }),
                        }}
                        onClick={() => setSelectedCategory(cat.value)}
                      >
                        <Space
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Space>
                            <span style={{ fontSize: 18 }}>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </Space>
                          <Badge
                            count={cat.count}
                            style={{
                              backgroundColor:
                                selectedCategory === cat.value
                                  ? "#fff"
                                  : undefined,
                              color:
                                selectedCategory === cat.value
                                  ? "#52c41a"
                                  : undefined,
                            }}
                          />
                        </Space>
                      </Button>
                    ))}
                  </Space>
                </div>

                {/* Уровень */}
                <div style={{ marginBottom: "32px" }}>
                  <Title level={5} style={{ marginBottom: "16px" }}>
                    Уровень
                  </Title>
                  <Space wrap style={{ width: "100%" }}>
                    {levels.map((level) => (
                      <Button
                        key={level.value}
                        type={
                          selectedLevel === level.value ? "primary" : "default"
                        }
                        style={{
                          borderColor: getLevelColor(level.value),
                          color:
                            selectedLevel === level.value
                              ? "#fff"
                              : getLevelColor(level.value),
                          background:
                            selectedLevel === level.value
                              ? getLevelColor(level.value)
                              : "transparent",
                          borderRadius: "8px",
                        }}
                        onClick={() => setSelectedLevel(level.value)}
                      >
                        {level.label}
                      </Button>
                    ))}
                  </Space>
                </div>

                {/* Цена */}
                <div style={{ marginBottom: "32px" }}>
                  <Title level={5} style={{ marginBottom: "16px" }}>
                    Цена, ₽
                  </Title>
                  <div style={{ padding: "0 8px" }}>
                    <Slider
                      range
                      min={0}
                      max={50000}
                      step={1000}
                      value={priceRange}
                      onChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      tooltip={{
                        formatter: (value) => `${value?.toLocaleString()} ₽`,
                      }}
                      trackStyle={[{ background: gradients.primary }]}
                      handleStyle={[{ borderColor: "#52c41a" }]}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "8px",
                      }}
                    >
                      <Text type="secondary">
                        {priceRange[0].toLocaleString()} ₽
                      </Text>
                      <Text type="secondary">
                        {priceRange[1].toLocaleString()} ₽
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Кнопка сброса */}
                <Button
                  block
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedLevel("all");
                    setPriceRange([0, 50000]);
                    setSortBy("popular");
                  }}
                >
                  Сбросить фильтры
                </Button>
              </Card>

              {/* Статистика */}
              <Card
                style={{ marginTop: 24, background: gradients.primaryLight }}
              >
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Text strong>Найдено курсов:</Text>
                    <Title
                      level={3}
                      style={{ margin: "8px 0", color: "#52c41a" }}
                    >
                      {filteredCourses.length}
                    </Title>
                  </div>
                  <div>
                    <Text type="secondary">Всего курсов в каталоге:</Text>
                    <Text strong style={{ fontSize: 16 }}>
                      {" "}
                      {courses.length}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">Средний рейтинг:</Text>
                    <Space style={{ marginTop: 4 }}>
                      <Rate disabled defaultValue={4.7} />
                      <Text strong style={{ color: "#fa8c16" }}>
                        4.7/5
                      </Text>
                    </Space>
                  </div>
                </Space>
              </Card>
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
                  <Title level={2} style={{ margin: 0 }}>
                    Каталог курсов
                  </Title>
                  <Text type="secondary">
                    {filteredCourses.length === courses.length
                      ? `Все курсы (${courses.length})`
                      : `Найдено ${filteredCourses.length} из ${courses.length} курсов`}
                  </Text>
                </div>

                <Space>
                  <Text type="secondary">Сортировать:</Text>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    style={{ width: "200px" }}
                    dropdownStyle={{ borderRadius: "8px" }}
                  >
                    <Option value="popular">По популярности</Option>
                    <Option value="rating">По рейтингу</Option>
                    <Option value="price-low">От дешевых к дорогим</Option>
                    <Option value="price-high">От дорогих к дешевым</Option>
                    <Option value="new">Сначала новые</Option>
                  </Select>
                </Space>
              </div>

              {/* Сетка курсов - 3 В СТРОКУ */}
              {filteredCourses.length > 0 ? (
                <Row gutter={[24, 32]}>
                  {filteredCourses.map((course) => (
                    <Col xs={24} sm={12} lg={8} key={course.id}>
                      <Card
                        hoverable
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                        bodyStyle={{
                          padding: 20,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {/* Верхняя часть карточки */}
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
                                  background: `linear-gradient(135deg, ${course.imageColor} 0%, ${course.imageColor}80 100%)`,
                                  borderRadius: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "20px",
                                }}
                              >
                                {getCategoryIcon(course.category)}
                              </div>
                              <div>
                                <Tag
                                  color="default"
                                  style={{
                                    borderColor: getLevelColor(course.level),
                                    color: getLevelColor(course.level),
                                    margin: 0,
                                    fontWeight: 600,
                                  }}
                                >
                                  {getLevelLabel(course.level)}
                                </Tag>
                              </div>
                            </div>

                            <div>
                              {course.isNew && (
                                <Badge
                                  count="NEW"
                                  style={{ backgroundColor: "#52c41a" }}
                                />
                              )}
                              {course.isFeatured && (
                                <Badge
                                  count={
                                    <FireOutlined style={{ fontSize: 10 }} />
                                  }
                                  style={{
                                    backgroundColor: "#fa8c16",
                                    marginLeft: 4,
                                  }}
                                />
                              )}
                            </div>
                          </div>

                          {/* Заголовок и описание */}
                          <Title
                            level={5}
                            style={{
                              margin: "0 0 8px 0",
                              lineHeight: 1.3,
                              minHeight: "44px",
                            }}
                            ellipsis={{ rows: 2 }}
                          >
                            {course.title}
                          </Title>
                          <Paragraph
                            type="secondary"
                            style={{ marginBottom: 16, minHeight: 36 }}
                            ellipsis={{ rows: 2 }}
                          >
                            {course.description}
                          </Paragraph>
                        </div>

                        {/* Информация о курсе */}
                        <div style={{ marginBottom: "16px", flex: 1 }}>
                          {/* Инструктор */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: 12,
                              padding: 8,
                              background: "#fafafa",
                              borderRadius: 8,
                            }}
                          >
                            <Avatar
                              size="small"
                              icon={<UserOutlined />}
                              style={{
                                marginRight: "8px",
                                background: course.imageColor,
                              }}
                            />
                            <Text style={{ fontSize: "13px", fontWeight: 500 }}>
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
                                padding: 8,
                                background: "#f9f9f9",
                                borderRadius: 8,
                              }}
                            >
                              <ClockCircleOutlined
                                style={{
                                  fontSize: 14,
                                  color: "#999",
                                  marginRight: 4,
                                }}
                              />
                              <Text style={{ fontSize: 12, fontWeight: 500 }}>
                                {course.duration}
                              </Text>
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                padding: 8,
                                background: "#f9f9f9",
                                borderRadius: 8,
                              }}
                            >
                              <PlayCircleOutlined
                                style={{
                                  fontSize: 14,
                                  color: "#999",
                                  marginRight: 4,
                                }}
                              />
                              <Text style={{ fontSize: 12, fontWeight: 500 }}>
                                {course.lessons} уроков
                              </Text>
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                padding: 8,
                                background: "#f9f9f9",
                                borderRadius: 8,
                              }}
                            >
                              <TeamOutlined
                                style={{
                                  fontSize: 14,
                                  color: "#999",
                                  marginRight: 4,
                                }}
                              />
                              <Text style={{ fontSize: 12, fontWeight: 500 }}>
                                {(course.students / 1000).toFixed(1)}k
                              </Text>
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                padding: 8,
                                background: "#f9f9f9",
                                borderRadius: 8,
                              }}
                            >
                              <StarOutlined
                                style={{
                                  fontSize: 14,
                                  color: "#ffc107",
                                  marginRight: 4,
                                }}
                              />
                              <Text style={{ fontSize: 12, fontWeight: 500 }}>
                                {course.rating}
                              </Text>
                            </div>
                          </div>

                          {/* Теги */}
                          <div style={{ marginBottom: 12 }}>
                            {course.tags.slice(0, 3).map((tag) => (
                              <Tag key={tag} style={{ margin: "0 4px 4px 0" }}>
                                {tag}
                              </Tag>
                            ))}
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
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  Прогресс
                                </Text>
                                <Text
                                  strong
                                  style={{
                                    fontSize: "12px",
                                    color: course.imageColor,
                                  }}
                                >
                                  {course.progress}%
                                </Text>
                              </div>
                              <Progress
                                percent={course.progress}
                                size="small"
                                strokeColor={course.imageColor}
                                showInfo={false}
                                style={{ marginBottom: 0 }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Нижняя часть карточки */}
                        <div
                          style={{
                            borderTop: "1px solid #f0f0f0",
                            paddingTop: "16px",
                            marginTop: "auto",
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
                                    style={{ fontSize: 18, color: "#52c41a" }}
                                  >
                                    {formatPrice(course.discountedPrice)}
                                  </Text>
                                  <Text
                                    delete
                                    type="secondary"
                                    style={{ marginLeft: 8, fontSize: 14 }}
                                  >
                                    {formatPrice(course.price)}
                                  </Text>
                                </>
                              ) : (
                                <Text strong style={{ fontSize: 18 }}>
                                  {formatPrice(course.price)}
                                </Text>
                              )}
                            </div>
                            <Rate
                              disabled
                              defaultValue={course.rating}
                              style={{ fontSize: "14px" }}
                            />
                          </div>
                          <Button
                            type="primary"
                            block
                            style={{
                              background: gradients.primary,
                              border: "none",
                              height: 40,
                            }}
                          >
                            {course.progress ? "Продолжить" : "Начать курс"}
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                  <div style={{ fontSize: "64px", marginBottom: "24px" }}>
                    🔍
                  </div>
                  <Title level={3}>Курсы не найдены</Title>
                  <Paragraph type="secondary" style={{ marginBottom: "32px" }}>
                    Попробуйте изменить параметры поиска или сбросить фильтры
                  </Paragraph>
                  <Button
                    type="primary"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedLevel("all");
                      setPriceRange([0, 50000]);
                    }}
                    style={{ background: gradients.primary, border: "none" }}
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              )}

              {/* Пагинация */}
              {filteredCourses.length > 0 && (
                <div style={{ textAlign: "center", marginTop: 48 }}>
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      background: gradients.primary,
                      border: "none",
                      padding: "0 40px",
                      height: 48,
                    }}
                  >
                    Показать еще курсы
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </div>

        {/* Секция преимуществ */}
        <div
          style={{
            background: gradients.primaryLight,
            padding: "80px 20px",
            marginTop: 64,
          }}
        >
          <div
            style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
          >
            <Title level={2} style={{ textAlign: "center", marginBottom: 48 }}>
              Почему выбирают VoxFox?
            </Title>
            <Row gutter={[32, 32]}>
              {[
                {
                  icon: <TrophyOutlined />,
                  title: "Сертификаты",
                  desc: "Официальные сертификаты об окончании курсов",
                  gradient: gradients.green,
                },
                {
                  icon: <VideoCameraOutlined />,
                  title: "Практика",
                  desc: "Реальные проекты и домашние задания",
                  gradient: gradients.orange,
                },
                {
                  icon: <BookOutlined />,
                  title: "Сообщество",
                  desc: "Поддержка менторов и единомышленников",
                  gradient: gradients.blue,
                },
                {
                  icon: <CheckCircleOutlined />,
                  title: "Трудоустройство",
                  desc: "Помощь в подготовке к собеседованиям",
                  gradient: gradients.purple,
                },
              ].map((item, idx) => (
                <Col key={idx} xs={24} sm={12} md={6}>
                  <div style={commonStyles.textCenter}>
                    <div
                      style={{
                        ...commonStyles.iconBox,
                        background: item.gradient,
                      }}
                    >
                      <span style={{ fontSize: 32, color: "#fff" }}>
                        {item.icon}
                      </span>
                    </div>
                    <Title level={4}>{item.title}</Title>
                    <Paragraph>{item.desc}</Paragraph>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
