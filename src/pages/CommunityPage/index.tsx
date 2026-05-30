import {
    Avatar,
    Col,
    Empty,
    Input,
    Layout,
    Pagination,
    Row,
    Spin,
    Typography,
} from "antd";
import {
    SearchOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import { API_URL } from "../../config.ts";
import { getAvatarUrl } from "../../stores/userStore.ts";

const { Content } = Layout;
const { Title, Text } = Typography;

interface TeacherDto {
    id: string;
    name: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
}

interface TeachersResponse {
    items: TeacherDto[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}

const PAGE_SIZE = 12;

const CommunityPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const initialSearch = params.get("search") ?? "";
    const initialPage = parseInt(params.get("page") ?? "1", 10);

    const [teachers, setTeachers] = useState<TeacherDto[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(initialSearch);
    const [search, setSearch] = useState(initialSearch);
    const [page, setPage] = useState(initialPage);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const p = new URLSearchParams();
                if (search) p.append("search", search);
                p.append("page", String(page));
                p.append("pageSize", String(PAGE_SIZE));

                const res = await fetch(`${API_URL}/Users/teachers?${p}`);
                if (res.ok) {
                    const data: TeachersResponse = await res.json();
                    // бэк может вернуть массив или объект с items
                    if (Array.isArray(data)) {
                        setTeachers(data as unknown as TeacherDto[]);
                        setTotal((data as unknown as TeacherDto[]).length);
                    } else {
                        setTeachers(data.items ?? []);
                        setTotal(data.totalCount ?? 0);
                    }
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        void load();
    }, [search, page]);

    const handleSearch = () => {
        setSearch(searchInput.trim());
        setPage(1);
    };

    const handlePageChange = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <Header />
            <Layout style={{ minHeight: "calc(100vh - 64px)", background: "#fafafa" }}>
                <Content style={{ padding: "40px 60px" }}>
                    {/* Шапка */}
                    <div style={{ marginBottom: 32 }}>
                        <Title level={2} style={{ margin: 0 }}>Сообщество</Title>
                        <Text type="secondary" style={{ fontSize: 15 }}>
                            Преподаватели платформы VoxFox
                        </Text>
                    </div>

                    {/* Поиск */}
                    <div style={{ maxWidth: 480, marginBottom: 32 }}>
                        <Input
                            size="large"
                            placeholder="Поиск преподавателя по имени..."
                            prefix={<SearchOutlined style={{ color: "#52c41a" }} />}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onPressEnter={handleSearch}
                            allowClear
                            onClear={() => { setSearchInput(""); setSearch(""); setPage(1); }}
                        />
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", paddingTop: 80 }}>
                            <Spin size="large" />
                        </div>
                    ) : teachers.length === 0 ? (
                        <Empty
                            description={search ? "Преподаватели не найдены" : "Преподавателей пока нет"}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                {teachers.map((teacher) => (
                                    <Col key={teacher.id} xs={24} sm={12} md={8} lg={6}>
                                        <div
                                            onClick={() => navigate(`/teacher/${teacher.id}`)}
                                            style={{
                                                background: "#fff",
                                                borderRadius: 12,
                                                border: "1px solid #f0f0f0",
                                                padding: 24,
                                                cursor: "pointer",
                                                transition: "box-shadow 0.2s",
                                                textAlign: "center",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: 12,
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                            }}
                                        >
                                            <Avatar
                                                size={80}
                                                src={getAvatarUrl(teacher.avatarUrl)}
                                                icon={!teacher.avatarUrl && <UserOutlined />}
                                                style={{
                                                    background: teacher.avatarUrl
                                                        ? undefined
                                                        : "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
                                                    flexShrink: 0,
                                                }}
                                            />

                                            <div style={{ width: "100%" }}>
                                                <Text strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>
                                                    {teacher.name}
                                                </Text>
                                                {teacher.bio ? (
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {teacher.bio.length > 80
                                                            ? teacher.bio.slice(0, 80) + "..."
                                                            : teacher.bio}
                                                    </Text>
                                                ) : (
                                                    <Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
                                                        Преподаватель
                                                    </Text>
                                                )}
                                            </div>

                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                                С {new Date(teacher.createdAt).toLocaleDateString("ru-RU", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                            </Text>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            {total > PAGE_SIZE && (
                                <div style={{ textAlign: "center", marginTop: 40 }}>
                                    <Pagination
                                        current={page}
                                        pageSize={PAGE_SIZE}
                                        total={total}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                        showTotal={(t) => `Всего преподавателей: ${t}`}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Content>
            </Layout>
            <Footer />
        </>
    );
};

export default CommunityPage;