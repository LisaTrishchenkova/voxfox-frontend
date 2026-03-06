import { useEffect, useState } from "react";
import type {
  Category,
  CategoryDto,
  PaginatedResponse,
} from "../../api/types/course";
import {
  Button,
  Card,
  Image,
  Input,
  Pagination,
  Select,
  Spin,
  Typography,
} from "antd";
import ReactMarkdown from "react-markdown";
import { data } from "react-router-dom";
import CardCourse from "../../components/CardCourse";

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

  type SortBy = "Title" | "Relevance";
  type SortDirection = "asc" | "desc";

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
  ];

  const featchCourses = async () => {
    try {
      setIsLoadingCourses(true);

      const params = new URLSearchParams();

      if (search) params.append("searchTerm", search);
      if (currentPage) params.append("page", currentPage.toString());
      if (currentPageSize)
        params.append("pageSize", currentPageSize.toString());
      if (currentSortBy) params.append("sortBy", currentSortBy);
      if (categoryId) params.append("categoryId", categoryId);

      const url = `http://localhost:8081/api/Courses/search?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      setPaginatedCources(data);
      setTotalCourse(data.totalCount);
    } catch (error) {
      console.error("Ошибка загрузки", error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const fetchCategories = () => {
    const url = `http://localhost:8081/api/Category`;

    console.log(url);

    fetch(url)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([featchCourses(), fetchCategories()]);
        // await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [currentPage, currentPageSize, categoryId]);

  const OnChangePagination = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setCurrentPageSize(pageSize);
  };

  return (
    <div>
      <Input onChange={(e) => setSearch(e.target.value)} />
      <Button onClick={() => featchCourses()}>Поиск</Button>
      <Select
        style={{ width: "200px" }}
        options={sortOptions}
        // showSearch={{ optionFilterProp: "label" }}
        onChange={(value) => {
          setCurrentSortBy(value);
          console.log(currentSortBy);
        }}
        value={currentSortBy}
      />
      <Pagination
        showSizeChanger
        defaultCurrent={1}
        total={totalCourse}
        onChange={OnChangePagination}
      />
      <div style={{ display: "flex", gap: "30px" }}>
        <div style={{ width: "250px" }}>
          <Title>Категории:</Title>
          {categories.map((cat) => (
            <Button
              onClick={(e) => {
                setCategoryId(cat.id);
              }}
              style={{ width: "200px" }}
              key={cat.id}
            >
              {cat.name}
            </Button>
          ))}
        </div>
        {isLoadingCourses ? (
          <Spin />
        ) : (
          <div style={{ flex: 1, gap: "30px" }}>
            <Title>Курсы:</Title>
            <div style={{ display: "flex", gap: "20px" }}>
              {paginatedCourses?.items.map((cource) => (
                <CardCourse course={cource} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
