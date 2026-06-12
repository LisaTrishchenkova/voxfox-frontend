import { Col, Empty, Progress, Row, Spin, Tag, Typography } from "antd";
import {
    BookOutlined,
    DollarOutlined,
    SafetyCertificateOutlined,
    StarOutlined,
    TeamOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { teacherApi } from "../api/teacherApi";
import { getImageUrl } from "../utils/imageUtils";
import type { TeacherCourseStatsDto, TeacherStatsDto } from "../api/types/teacher";

const { Text } = Typography;

const statusColor: Record<string, string> = {
    Draft: "default",
    UnderReview: "processing",
    RejectedByModerator: "error",
    Published: "success",
};
const statusLabel: Record<string, string> = {
    Draft: "Черновик",
    UnderReview: "На проверке",
    RejectedByModerator: "Отклонён",
    Published: "Опубликован",
};

const TeacherStatsTab = () => {
    const [stats, setStats] = useState<TeacherStatsDto | null>(null);
    const [courseStats, setCourseStats] = useState<TeacherCourseStatsDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [statsData, coursesData] = await Promise.all([
                teacherApi.getStats(),
                teacherApi.getCourseStats(),
            ]);
            if (statsData) setStats(statsData);
            setCourseStats(coursesData);
            setLoading(false);
        };
        void load();
    }, []);

    if (loading)
        return <div style={{ textAlign: "center", paddingTop: 60 }}><Spin size="large" /></div>;

    if (!stats)
        return <Empty description="Не удалось загрузить статистику" />;

    const summaryCards = [
        {
            icon: <TeamOutlined style={{ fontSize: 20, color: "#1890ff" }} />,
            label: "Студентов",
            value: stats.totalStudents,
            sub: `${stats.completedEnrollments} завершили`,
            color: "#1890ff",
        },
        {
            icon: <BookOutlined style={{ fontSize: 20, color: "#52c41a" }} />,
            label: "Курсов",
            value: stats.publishedCourses,
            sub: `${stats.totalCourses} всего`,
            color: "#52c41a",
        },
        {
            icon: <StarOutlined style={{ fontSize: 20, color: "#faad14" }} />,
            label: "Средний рейтинг",
            value: stats.averageRating > 0 ? `★ ${stats.averageRating.toFixed(1)}` : "—",
            sub: "по всем курсам",
            color: "#faad14",
        },
        {
            icon: <DollarOutlined style={{ fontSize: 20, color: "#52c41a" }} />,
            label: "Заработок всего",
            value: `${stats.totalEarnings.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽`,
            sub: `+${stats.earningsThisMonth.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽ в этом месяце`,
            color: "#52c41a",
        },
        {
            icon: <SafetyCertificateOutlined style={{ fontSize: 20, color: "#722ed1" }} />,
            label: "Сертификатов",
            value: stats.totalCertificates,
            sub: "выдано студентам",
            color: "#722ed1",
        },
    ];

    return (
        <div>
            {/* Сводные карточки */}
            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                {summaryCards.map((card) => (
                    <Col key={card.label} xs={12} sm={8} md={8} lg={4}>
                        <div style={{
                            background: "#fff", borderRadius: 10,
                            border: "1px solid #f0f0f0", padding: "16px 18px",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                {card.icon}
                                <Text type="secondary" style={{ fontSize: 12 }}>{card.label}</Text>
                            </div>
                            <Text strong style={{ fontSize: 22, color: card.color, display: "block", lineHeight: 1.2 }}>
                                {card.value}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: "block" }}>
                                {card.sub}
                            </Text>
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Курсы */}
            <Text strong style={{ fontSize: 15, display: "block", marginBottom: 16 }}>
                Статистика по курсам
            </Text>

            {courseStats.length === 0 ? (
                <Empty description="Курсов пока нет" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {courseStats.map((course) => (
                        <div key={course.courseId} style={{
                            background: "#fff", borderRadius: 10,
                            border: "1px solid #f0f0f0", overflow: "hidden",
                        }}>
                            <div style={{ display: "flex", gap: 0 }}>
                                {/* Обложка */}
                                <div style={{ width: 120, flexShrink: 0 }}>
                                    {course.coverImageUrl
                                        ? <img src={getImageUrl(course.coverImageUrl)} alt={course.title}
                                               style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                        : <div style={{
                                            width: "100%", height: "100%", minHeight: 90,
                                            background: "linear-gradient(135deg, rgba(0,100,0,0.15) 0%, rgba(0,100,0,0.35) 100%)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 28, color: "rgba(0,100,0,0.4)",
                                        }}>🎓</div>
                                    }
                                </div>

                                {/* Основная информация */}
                                <div style={{ flex: 1, padding: "14px 20px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                        <div>
                                            <Text strong style={{ fontSize: 14, display: "block", marginBottom: 4 }}>
                                                {course.title}
                                            </Text>
                                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                <Tag color={statusColor[course.status]} style={{ fontSize: 11, margin: 0 }}>
                                                    {statusLabel[course.status] ?? course.status}
                                                </Tag>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {course.price === 0 ? "Бесплатно" : `${course.price.toLocaleString("ru-RU")} ₽`}
                                                </Text>
                                                {course.rating > 0 && (
                                                    <Text style={{ fontSize: 12, color: "#faad14" }}>
                                                        ★ {Number(course.rating).toFixed(1)}
                                                        <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                                                            ({course.reviewCount})
                                                        </Text>
                                                    </Text>
                                                )}
                                            </div>
                                        </div>

                                        {/* Заработок */}
                                        {course.earnings > 0 && (
                                            <div style={{ textAlign: "right" }}>
                                                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Заработок</Text>
                                                <Text strong style={{ fontSize: 16, color: "#52c41a" }}>
                                                    {course.earnings.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                                                </Text>
                                            </div>
                                        )}
                                    </div>

                                    {/* Метрики */}
                                    <Row gutter={[24, 8]}>
                                        <Col xs={12} sm={6}>
                                            <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Студентов</Text>
                                            <Text strong style={{ fontSize: 15 }}>{course.totalStudents}</Text>
                                            <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>
                                                ({course.activeStudents} активных)
                                            </Text>
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Завершили</Text>
                                            <Text strong style={{ fontSize: 15, color: "#52c41a" }}>
                                                {course.completedStudents}
                                            </Text>
                                            {course.totalStudents > 0 && (
                                                <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>
                                                    ({Math.round(course.completedStudents / course.totalStudents * 100)}%)
                                                </Text>
                                            )}
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Сертификатов</Text>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <TrophyOutlined style={{ color: "#722ed1", fontSize: 13 }} />
                                                <Text strong style={{ fontSize: 15 }}>{course.certificatesIssued}</Text>
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={6}>
                                            <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Средний прогресс</Text>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <Progress
                                                    percent={Number(course.averageProgress)}
                                                    size="small"
                                                    style={{ flex: 1, margin: 0 }}
                                                    strokeColor="rgba(0,100,0,0.8)"
                                                    showInfo={false}
                                                />
                                                <Text style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                                                    {Number(course.averageProgress).toFixed(0)}%
                                                </Text>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherStatsTab;