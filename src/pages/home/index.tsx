import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  InputNumber,
  Pagination,
  Row,
  Select,
  Spin,
  Typography,
  Input,
  Divider,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { useEffect, useState } from "react";
import type { CategoryDto, CourseLevel, PaginatedResponse } from "../../api/types/course";
import CardCourse from "../../components/CardCourse";
import Header from "../../components/Header";
import { API_URL } from "../../config";
import { authStorage } from "../../services/auth-storage.service.ts";
import { favoriteApi } from "../../api/favoriteApi.ts";
import { courseApi } from "../../api/courseApi.ts";
import Footer from "../../components/Footer.tsx";

type SortBy = "Title" | "Relevance" | "Date" | "DateDesc" | "Price";

const sortOptions = [
  { label: "По популярности", value: "Relevance" },
  { label: "По заголовку", value: "Title" },
  { label: "По дате (новые)", value: "Date" },
  { label: "По дате (старые)", value: "DateDesc" },
  { label: "По цене", value: "Price" },
];

const levelOptions: { label: string; value: CourseLevel }[] = [
  { label: "Начинающий", value: "Beginner" },
  { label: "Средний", value: "Intermediate" },
  { label: "Продвинутый", value: "Advanced" },
];

const { Title } = Typography;

const HomePage = () => {
  const [paginatedCourses, setPaginatedCourses] = useState<PaginatedResponse>();
  const [search, setSearch] = useState("");
  const [totalCourse, setTotalCourse] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentSortBy, setCurrentSortBy] = useState<SortBy>("Relevance");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoryId, setCategoryId] = useState<string>();
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isOpenCategoryBlock, setIsOpenCategoryBlock] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | undefined>();
  const [isFree, setIsFree] = useState<boolean | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const data = await courseApi.getCourses({
        searchTerm: search || undefined,
        page: currentPage,
        pageSize: currentPageSize,
        sortBy: currentSortBy,
        categoryId,
        level: selectedLevel,
        isFree,
        minPrice: isFree ? undefined : minPrice,
        maxPrice: isFree ? undefined : maxPrice,
      });
      if (data) {
        setPaginatedCourses(data);
        setTotalCourse(data.totalCount);
      }
    } catch (error) {
      console.error("Ошибка загрузки", error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/Categories`);
      if (!res.ok) return;
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      const promises: Promise<unknown>[] = [fetchCourses(), fetchCategories()];
      if (authStorage.isAuthenticated()) {
        promises.push(
            favoriteApi.getMyFavorites().then((favs) => {
              setFavoriteIds(new Set(favs.map((f) => f.courseId)));
            })
        );
      }
      await Promise.all(promises);
    };
    load();
  }, [currentPage, currentPageSize, categoryId, currentSortBy, selectedLevel, isFree]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCourses();
  };

  const handleResetFilters = () => {
    setSelectedLevel(undefined);
    setIsFree(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setCategoryId(undefined);
    setCurrentSortBy("Relevance");
    setSearch("");
    setCurrentPage(1);
  };

  const visibleCategories = isOpenCategoryBlock ? categories : categories.slice(0, 5);

  return (
      <div>
        <Header />

        <div style={{ backgroundColor: "rgba(0,100,0,0.15)", padding: "40px 20px", textAlign: "center" }}>
          <Title level={1} style={{ marginBottom: 16 }}>Найдите свой идеальный курс!</Title>
          <Paragraph style={{ marginBottom: 24, maxWidth: 800, margin: "0 auto 24px" }}>
            В нашем каталоге — курсы по программированию, дизайну, анализу данных,
            маркетингу, управлению проектами и многому другому.
          </Paragraph>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <Input.Search
                size="large"
                placeholder="Введите название курса..."
                enterButton={<Button icon={<SearchOutlined />}>Найти курс</Button>}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onSearch={handleSearch}
            />
          </div>
        </div>

        <div style={{ padding: "16px 2%" }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Title level={3} style={{ margin: 0 }}>Каталог курсов</Title>
            <Select
                style={{ width: 260 }}
                options={sortOptions}
                value={currentSortBy}
                onChange={(v) => { setCurrentSortBy(v); setCurrentPage(1); }}
            />
          </Row>

          <div style={{ display: "flex", gap: "2%" }}>
            {/* Сайдбар */}
            <div style={{ width: 220, flexShrink: 0 }}>

              {/* Категории */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <FilterOutlined /> Категории
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Button
                      onClick={() => { setCategoryId(undefined); setCurrentPage(1); }}
                      type={!categoryId ? "primary" : "default"}
                      size="small"
                      style={{ width: "100%", textAlign: "left" }}
                  >
                    Все категории
                  </Button>
                  {visibleCategories.map((cat) => (
                      <Button
                          key={cat.id}
                          onClick={() => { setCategoryId(cat.id); setCurrentPage(1); }}
                          type={categoryId === cat.id ? "primary" : "default"}
                          size="small"
                          style={{ width: "100%", textAlign: "left" }}
                      >
                        {cat.name}
                      </Button>
                  ))}
                </div>
                {categories.length > 5 && (
                    <span
                        onClick={() => setIsOpenCategoryBlock(!isOpenCategoryBlock)}
                        style={{ color: "rgba(0,100,0,1)", cursor: "pointer", display: "block", marginTop: 8, fontSize: 13 }}
                    >
                  {isOpenCategoryBlock ? "Скрыть" : `Ещё ${categories.length - 5}...`}
                </span>
                )}
              </div>

              <Divider style={{ margin: "12px 0" }} />

              {/* Уровень */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Уровень</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {levelOptions.map((opt) => (
                      <Checkbox
                          key={opt.value}
                          checked={selectedLevel === opt.value}
                          onChange={(e) => {
                            setSelectedLevel(e.target.checked ? opt.value : undefined);
                            setCurrentPage(1);
                          }}
                      >
                        {opt.label}
                      </Checkbox>
                  ))}
                </div>
              </div>

              <Divider style={{ margin: "12px 0" }} />

              {/* Цена */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Цена</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Checkbox
                      checked={isFree === true}
                      onChange={(e) => {
                        setIsFree(e.target.checked ? true : undefined);
                        if (e.target.checked) { setMinPrice(undefined); setMaxPrice(undefined); }
                        setCurrentPage(1);
                      }}
                  >
                    Только бесплатные
                  </Checkbox>
                  {isFree !== true && (
                      <>
                        <InputNumber
                            placeholder="От ₽"
                            style={{ width: "100%" }}
                            min={0}
                            value={minPrice}
                            onChange={(v) => setMinPrice(v ?? undefined)}
                        />
                        <InputNumber
                            placeholder="До ₽"
                            style={{ width: "100%" }}
                            min={0}
                            value={maxPrice}
                            onChange={(v) => setMaxPrice(v ?? undefined)}
                        />
                        <Button
                            size="small"
                            style={{ width: "100%" }}
                            onClick={() => { setCurrentPage(1); fetchCourses(); }}
                        >
                          Применить
                        </Button>
                      </>
                  )}
                </div>
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <Button size="small" style={{ width: "100%" }} onClick={handleResetFilters}>
                Сбросить фильтры
              </Button>
            </div>

            {/* Сетка курсов */}
            {isLoadingCourses ? (
                <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: 48 }}>
                  <Spin size="large" />
                </div>
            ) : (
                <div style={{ flex: 1 }}>
                  {paginatedCourses?.items.length === 0 && (
                      <div style={{ textAlign: "center", padding: 48, color: "#888" }}>
                        Курсы не найдены. Попробуйте изменить фильтры.
                      </div>
                  )}
                  <Row gutter={[24, 24]}>
                    {paginatedCourses?.items.map((course) => (
                        <Col key={course.id} xs={24} sm={12} lg={8} xl={6}>
                          <CardCourse
                              course={course}
                              isFavorite={favoriteIds.has(course.id)}
                          />
                        </Col>
                    ))}
                  </Row>
                </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", paddingBottom: 40 }}>
          <Pagination
              showSizeChanger
              current={currentPage}
              pageSize={currentPageSize}
              total={totalCourse}
              onChange={(page, pageSize) => { setCurrentPage(page); setCurrentPageSize(pageSize); }}
              pageSizeOptions={[10, 20, 50]}
          />
        </div>
        <Footer/>
      </div>
  );
};

export default HomePage;