import {
    Avatar,
    Button,
    Col,
    Divider,
    Empty,
    Layout,
    Row,
    Spin,
    Tag,
    Typography,
} from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import { API_URL } from "../../config.ts";
import type { CourseDto } from "../../api/types/course.ts";
import CardCourse from "../../components/CardCourse";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface UserResponse {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    bio?: string | null;
    role: string;
    createdAt: string;
    isDeleted: boolean;
}

interface UserStatsDto {
    createdCoursesCount: number;
    publishedCoursesCount: number;
    totalStudentsCount: number;
    averageRating: number;
}

const getAvatarUrl = (url?: string | null) => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `${API_URL.replace("/api", "")}${url}`;
};

const TeacherProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [teacher, setTeacher] = useState<UserResponse | null>(null);
    const [stats, setStats] = useState<UserStatsDto | null>(null);
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            setLoading(true);

            const [userRes, statsRes, coursesRes] = await Promise.all([
                fetch(`${API_URL}/Users/${id}`),
                fetch(`${API_URL}/Users/${id}/stats`),
                fetch(`${API_URL}/Users/${id}/courses`),
            ]);

            if (!userRes.ok) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            const userData: UserResponse = await userRes.json();

            if (userData.role !== "Teacher" && userData.role !== "Admin") {
                setNotFound(true);
                setLoading(false);
                return;
            }

            setTeacher(userData);

            if (statsRes.ok) setStats(await statsRes.json());

            if (coursesRes.ok) {
                const data = await coursesRes.json();
                setCourses(
                    Array.isArray(data)
                        ? data.filter((c: CourseDto) => c.status === "Published")
                        : []
                );
            }

            setLoading(false);
        };
        void load();
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
                    <Spin size="large" />
                </div>
            </>
        );
    }

    if (notFound || !teacher) {
        return (
            <>
                <Header />
                <Layout style={{ minHeight: "calc(100vh - 64px)", background: "#fafafa" }}>
                    <Content style={{ padding: "80px 60px", textAlign: "center" }}>
                        <Empty description="Преподаватель не найден" />
                        <Button style={{ marginTop: 16 }} onClick={() => navigate(-1)}>Назад</Button>
                    </Content>
                </Layout>
                <Footer />
            </>
        );
    }

    const joinedYear = new Date(teacher.createdAt).getFullYear();

    const statItems = [
        { label: "Опубликованных курсов", value: stats?.publishedCoursesCount ?? "—" },
        { label: "Студентов", value: stats?.totalStudentsCount ?? "—" },
        {
            label: "Средний рейтинг",
            value: stats && stats.averageRating > 0
                ? `${Number(stats.averageRating).toFixed(1)}`
                : "—",
        },
    ];

    return (
        <>
            <Header />
            <Layout style={{ minHeight: "calc(100vh - 64px)", background: "#fafafa" }}>
                <Content style={{ padding: "40px 60px" }}>

                    <Button type="text" icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(-1)}
                            style={{ paddingLeft: 0, color: "#888", marginBottom: 32, fontSize: 13 }}>
                        Назад
                    </Button>

                    {/* Шапка */}
                    <div style={{
                        background: "#fff",
                        borderRadius: 12,
                        border: "1px solid #ebebeb",
                        padding: "40px 48px",
                        marginBottom: 24,
                    }}>
                        <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
                            <Avatar
                                size={88}
                                src={getAvatarUrl(teacher.avatarUrl)}
                                icon={!teacher.avatarUrl && <UserOutlined />}
                                style={{
                                    flexShrink: 0,
                                    background: teacher.avatarUrl ? undefined : "#e8e8e8",
                                    color: "#999",
                                }}
                            />

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                                    <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
                                        {teacher.name}
                                    </Title>
                                    <Tag style={{
                                        fontSize: 12, color: "#666",
                                        background: "#f5f5f5", border: "1px solid #e8e8e8",
                                        borderRadius: 6,
                                    }}>
                                        Преподаватель
                                    </Tag>
                                </div>

                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    На платформе с {joinedYear} года
                                </Text>

                                {teacher.bio && (
                                    <Paragraph style={{
                                        marginTop: 14, marginBottom: 0,
                                        fontSize: 14, color: "#555",
                                        lineHeight: 1.7,
                                    }}>
                                        {teacher.bio}
                                    </Paragraph>
                                )}
                            </div>
                        </div>

                        {/* Статистика */}
                        {stats && (
                            <>
                                <Divider style={{ margin: "28px 0" }} />
                                <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
                                    {statItems.map((s) => (
                                        <div key={s.label}>
                                            <div style={{ fontSize: 22, fontWeight: 600, color: "#222", lineHeight: 1.2 }}>
                                                {s.value}
                                            </div>
                                            <Text type="secondary" style={{ fontSize: 12, marginTop: 2, display: "block" }}>
                                                {s.label}
                                            </Text>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Курсы */}
                    <div style={{
                        background: "#fff",
                        borderRadius: 12,
                        border: "1px solid #ebebeb",
                        padding: "32px 48px",
                    }}>
                        <div style={{ marginBottom: 24 }}>
                            <Text strong style={{ fontSize: 16 }}>Курсы</Text>
                            {courses.length > 0 && (
                                <Text type="secondary" style={{ fontSize: 13, marginLeft: 8 }}>
                                    {courses.length}
                                </Text>
                            )}
                        </div>

                        {courses.length === 0 ? (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                        Нет опубликованных курсов
                                    </Text>
                                }
                            />
                        ) : (
                            <Row gutter={[24, 24]}>
                                {courses.map((course) => (
                                    <Col key={course.id} xs={24} sm={12} xl={8}>
                                        <CardCourse course={course} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>

                </Content>
            </Layout>
            <Footer />
        </>
    );
};

export default TeacherProfilePage;