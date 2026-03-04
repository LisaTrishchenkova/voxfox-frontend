import { useEffect, useState } from "react";
import type { PaginatedResponse } from "../../api/types/course";
import {
  Button,
  Card,
  Image,
  Input,
  Pagination,
  Select,
  Typography,
} from "antd";
import ReactMarkdown from "react-markdown";
import { data } from "react-router-dom";

const HomePage = () => {
  const { Title } = Typography;

  const [paginatedCourses, setPaginatedCources] = useState<PaginatedResponse>();
  const [search, setSearch] = useState<string>("");
  const [totalCourse, setTotalCourse] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);

  type SortBy = "Title" | "Relevance";

  const Search = () => {
    const url = `http://localhost:8081/api/Courses/search?searchTerm=${search}&page=${currentPage}&pageSize=${currentPageSize}`;
    console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data: PaginatedResponse) => {
        setPaginatedCources(data);
        setTotalCourse(data.totalCount);
      })
      .catch(console.error);
    console.log("кнопка нажата");
  };

  useEffect(() => {
    Search();
  }, [currentPage, currentPageSize]);

  const OnChangePagination = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setCurrentPageSize(pageSize);
  };

  return (
    <div>
      <Input onChange={(e) => setSearch(e.target.value)} />
      <Button onClick={() => Search()}>Поиск</Button>
      <Select
        style={{ width: "200px" }}
        // options={}
        showSearch={{ optionFilterProp: "label" }}
        onChange={(value) => {}}
      />
      <Pagination
        showSizeChanger
        defaultCurrent={1}
        total={totalCourse}
        onChange={OnChangePagination}
      />
      <Title>Курсы:</Title>
      {paginatedCourses?.items.map((cource) => (
        <Card>
          <Image src="https://static.aviasales.com/psgr-v2/ru/putevoditel-po-islandii/shutterstock_aa704c95ce.jpg?" />
          <Title level={2}>{cource.title}</Title>
          <ReactMarkdown>{cource.description}</ReactMarkdown>
        </Card>
      ))}
    </div>
  );
};

export default HomePage;
