import {
    Layout,
    Row,
    Col,
    Typography,
    Space,
    Button,
    Divider,
    Card,
    Modal,
} from "antd";
import {
    CodeOutlined,
    TeamOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    ArrowRightOutlined,

} from "@ant-design/icons";
import { gradients } from "../theme";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const ComingSoonLink = ({ children }: { children: React.ReactNode }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <a
                onClick={() => setModalOpen(true)}
                style={{ color: "#595959", display: "block", padding: "6px 0", transition: "color 0.3s", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
            >
                {children}
            </a>
            <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} centered title="В разработке">
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <span style={{ fontSize: 48 }}>🚧</span>
                    <Title level={4} style={{ marginTop: 16 }}>
                        Когда-нибудь тут что-нибудь будет, а пока я просто не успела!
                    </Title>
                    <Text type="secondary">Я работаю над этой страницей</Text>
                    <div style={{ marginTop: 24 }}>
                        <Button onClick={() => setModalOpen(false)}>Понятно</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

const linkStyle = {
    color: "#595959",
    display: "block",
    padding: "6px 0",
    transition: "color 0.3s",
    textDecoration: "none",
} as React.CSSProperties;

const Footer = () => {
    const navigate = useNavigate();

    return (
        <AntFooter style={{
            background: "#f9fff4",
            borderTop: "1px solid #e8f5e9",
            padding: "64px 0 24px",
            marginTop: "auto",
            boxShadow: "0 -2px 10px rgba(82, 196, 26, 0.05)",
        }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
                <Card style={{
                    background: gradients.primaryLight,
                    border: "1px solid rgba(82, 196, 26, 0.2)",
                    borderRadius: 16,
                    marginBottom: 48,
                    padding: 32,
                }}>
                    <Row align="middle" justify="space-between">
                        <Col xs={24} md={16}>
                            <Title level={3} style={{
                                marginBottom: 8,
                                background: gradients.primary,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontWeight: 700,
                            }}>
                                Готовы начать свой путь?
                            </Title>
                            <Text style={{ color: "#595959", fontSize: 16 }}>
                                Присоединяйтесь к учащимся, которые уже развивают свои навыки на VoxFox
                            </Text>
                        </Col>
                        <Col xs={24} md={8} style={{ textAlign: "right" }}>
                            <Button type="primary" size="large"
                                    style={{ background: gradients.primary, border: "none", padding: "0 32px", height: 48 }}
                                    onClick={() => navigate("/")}>
                                Начать бесплатно <ArrowRightOutlined />
                            </Button>
                        </Col>
                    </Row>
                </Card>

                <Row gutter={[32, 32]}>
                    {/* Лого и описание */}
                    <Col xs={24} md={6}>
                        <Space direction="vertical" size="large">
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

                                <div>
                                    <Title level={3} style={{
                                        margin: 0,
                                        background: gradients.primaryText,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        fontWeight: 700,
                                    }}>
                                        VoxFox
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Платформа для всех желающих обрести знания
                                    </Text>
                                </div>
                            </div>
                            <Text style={{ color: "#595959", lineHeight: 1.6 }}>
                                Образовательная платформа. Развивайте навыки через практику и сообщество.
                            </Text>
                        </Space>
                    </Col>

                    {/* Платформа */}
                    <Col xs={24} md={6}>
                        <Title level={5} style={{ marginBottom: 20, color: "#389e0d", fontWeight: 600 }}>Платформа</Title>
                        <Space direction="vertical" size="small">
                            <Link to="/" onClick={() => window.scrollTo(0, 0)} style={linkStyle}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}>
                                <span style={{ marginRight: 8, color: "#52c41a" }}><CodeOutlined /></span>Курсы
                            </Link>
                            <Link to="/community" onClick={() => window.scrollTo(0, 0)} style={linkStyle}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}>
                                <span style={{ marginRight: 8, color: "#52c41a" }}><TeamOutlined /></span>Сообщество
                            </Link>
                        </Space>
                    </Col>

                    {/* Ресурсы */}
                    <Col xs={24} md={6}>
                        <Title level={5} style={{ marginBottom: 20, color: "#389e0d", fontWeight: 600 }}>Ресурсы</Title>
                        <Space direction="vertical" size="small">
                            <ComingSoonLink>Документация</ComingSoonLink>
                            <ComingSoonLink>Карьера</ComingSoonLink>
                            <ComingSoonLink>Для компаний</ComingSoonLink>
                        </Space>
                    </Col>

                    {/* Контакты */}
                    <Col xs={24} md={6}>
                        <Title level={5} style={{ marginBottom: 20, color: "#389e0d", fontWeight: 600 }}>Контакты</Title>
                        <Space direction="vertical" size="middle">
                            {[
                                { icon: <MailOutlined />, label: "Email", value: "voxfox@gmail.com" },
                                { icon: <PhoneOutlined />, label: "Телефон", value: "+7 (999) 123-45-67" },
                                { icon: <EnvironmentOutlined />, label: "Адрес", value: "Смоленск, ул. Генерала Паскевича, 7" },
                            ].map((item, idx) => (
                                <Space key={idx}>
                                    <span style={{ color: "#52c41a" }}>{item.icon}</span>
                                    <div>
                                        <Text strong>{item.label}</Text>
                                        <div><Text type="secondary">{item.value}</Text></div>
                                    </div>
                                </Space>
                            ))}
                        </Space>
                    </Col>
                </Row>

                <Divider style={{ margin: "48px 0 32px", borderColor: "#e8f5e9" }} />

                <Row justify="space-between" align="middle">
                    <Col xs={24} md={12}>
                        <Text type="secondary">© 2025 VoxFox Platform. Все права защищены.</Text>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: "right" }}>
                        <Space size="large">
                            {[
                                { to: "/legal/privacy", label: "Политика конфиденциальности" },
                                { to: "/legal/terms", label: "Условия использования" },
                                { to: "/legal/community", label: "Правила сообщества" },
                            ].map(({ to, label }) => (
                                <Link key={to} to={to}
                                      style={{ color: "#52c41a", transition: "color 0.3s", textDecoration: "none", fontSize: 13 }}
                                      onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                                      onMouseLeave={(e) => (e.currentTarget.style.color = "#52c41a")}>
                                    {label}
                                </Link>
                            ))}
                        </Space>
                    </Col>
                </Row>
            </div>
        </AntFooter>
    );
};

export default Footer;