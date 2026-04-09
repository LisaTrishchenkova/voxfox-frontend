import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Pagination,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { useEffect, useState } from "react";
import type { CategoryDto, PaginatedResponse } from "../../api/types/course";
import CardCourse from "../../components/CardCourse";
import Header from "../../components/Header";
import { API_URL } from "../../config";
import {authStorage} from "../../services/auth-storage.service.ts";
import {favoriteApi} from "../../api/favoriteApi.ts";

const HomePage = () => {
  const { Title } = Typography;

  const [paginatedCourses, setPaginatedCources] = useState<PaginatedResponse>();
  const [search, setSearch] = useState<string>("");
  const [totalCourse, setTotalCourse] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const [currentSortBy, setCurrentSortBy] = useState<SortBy>("Relevance");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoryId, setCategoryId] = useState<string>();
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isOpenCategoryBlock, setIsOpenCategoryBlock] =
    useState<boolean>(false);

  type SortBy = "Title" | "Relevance" | "Date" | "DateDesc";
  // type SortDirection = "asc" | "desc";

  interface SortOption {
    label: string;
    value: SortBy;
  }

  const sortOptions: SortOption[] = [
    {
      label: "по пулярности",
      value: "Relevance",
    },
    {
      label: "по заголовку",
      value: "Title",
    },
    {
      label: "по дате(самые новые)",
      value: "Date",
    },
    {
      label: "по дате(начиная со старых)",
      value: "DateDesc",
    },
  ];

  const featchCourses = async () => {
    try {
      setIsLoadingCourses(true);

      const params = new URLSearchParams();

      if (search) params.append("searchTerm", search);
      if (currentPage) params.append("page", currentPage.toString());
      if (currentPageSize)
        params.append("pageSize", currentPageSize.toString());

      params.append("sortBy", currentSortBy);
      if (categoryId) params.append("categoryId", categoryId);

      const url = `${API_URL}/Courses?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP  error! status: ${response.status}, message: ${errorText}`,
        );
      }
      const data = await response.json();
      setPaginatedCources(data);
      setTotalCourse(data.totalCount);
    } catch (error) {
      console.error("Ошибка загрузки", error); // почему тут не поймал ошибку
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const url = `${API_URL}/Categories`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises: Promise<void>[] = [
          featchCourses(),
          fetchCategories(),
        ];
        if (authStorage.isAuthenticated()) {
          promises.push(
              favoriteApi.getMyFavorites().then(favs => {
                setFavoriteIds(new Set(favs.map(f => f.courseId)));
              })
          );
        }
        await Promise.all(promises);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [currentPage, currentPageSize, categoryId, currentSortBy]);

  useEffect(() => {
    console.log(isOpenCategoryBlock);
  }, [isOpenCategoryBlock]);

  const OnChangePagination = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setCurrentPageSize(pageSize);
  };

  const visibleCategories = isOpenCategoryBlock
    ? categories
    : categories.slice(0, 5);

  return (
    <div>
      <Header />
      <div
        style={{
          backgroundColor: "rgba(0, 100, 0, 0.15)",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <Title level={1} style={{ marginBottom: 16 }}>
          Найдите свой идеальный курс!
        </Title>
        <Paragraph
          style={{
            marginBottom: 24,
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          В нашем каталоге — более 1000 курсов по самым востребованным
          направлениям: программирование, дизайн, анализ данных и машинное
          обучение, маркетинг и SMM, управление проектами, кибербезопасность,
          разработка мобильных приложений, а также курсы по английскому языку,
          финансам и инвестициям, психологии, творчеству и личностному росту.
        </Paragraph>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Input.Search
            size="large"
            placeholder="Введите название курса..."
            enterButton={<Button icon={<SearchOutlined />}>Найти курс</Button>}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={() => featchCourses()}
          />
        </div>
      </div>

      <div style={{ padding: "1%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Категории:
          </Title>
          <Select
            style={{ width: "300px" }}
            options={sortOptions}
            onChange={(value) => {
              setCurrentSortBy(value);
            }}
            value={currentSortBy}
          />
        </div>

        <div style={{ display: "flex", gap: "2%" }}>
          <div>
            <div
              style={{
                width: "250px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <Space size="small" style={{ width: "100%" }} wrap>
                <Button
                  onClick={() => setCategoryId(undefined)}
                  type={!categoryId ? "primary" : "default"}
                  style={{ width: "200px" }}
                >
                  Все категории
                </Button>
                {visibleCategories.map((cat) => (
                  <Button
                    onClick={() => {
                      setCategoryId(cat.id);
                    }}
                    type={categoryId === cat.id ? "primary" : "default"}
                    style={{ width: "200px" }}
                    key={cat.id}
                  >
                    {cat.name}
                  </Button>
                ))}
              </Space>
            </div>
            <span
              onClick={() => {
                setIsOpenCategoryBlock(!isOpenCategoryBlock);
              }}
              style={{
                color: "rgba(0, 100, 0, 1)",
                cursor: "pointer",
                display: "inline-block",
                marginTop: "20px",
                width: "200px",
                textAlign: "center",
              }}
            >
              {isOpenCategoryBlock ? "Закрыть" : "Открыть"}
            </span>
          </div>
          {isLoadingCourses ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                padding: "48px",
              }}
            >
              <Spin />
            </div>
          ) : (
            <div style={{ flex: 1, gap: "30px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "30px",

                  flexWrap: "wrap",
                }}
              >
                {paginatedCourses?.items.map((course) => (
                    <CardCourse
                        key={course.id}
                        course={course}
                        isFavorite={favoriteIds.has(course.id)}
                    />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        <Pagination
          showSizeChanger
          defaultCurrent={1}
          total={totalCourse}
          onChange={OnChangePagination}
          pageSizeOptions={[10, 20, 50]}
        />
      </div>
    </div>
  );
};

export default HomePage;
