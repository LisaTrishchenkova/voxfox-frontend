import React from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Divider,
  Card,
} from "antd";
import {
  RocketOutlined,
  CodeOutlined,
  TeamOutlined,
  TrophyOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  GithubOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter
      style={{
        background: "#f9fff4",
        borderTop: "1px solid #e8f5e9",
        padding: "64px 0 24px",
        marginTop: "auto",
        boxShadow: "0 -2px 10px rgba(82, 196, 26, 0.05)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <Card
          style={{
            background:
              "linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(250, 140, 22, 0.1) 100%)",
            border: "1px solid rgba(82, 196, 26, 0.2)",
            borderRadius: "16px",
            marginBottom: "48px",
            padding: "32px",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Title
                level={3}
                style={{
                  marginBottom: "8px",
                  background:
                    "linear-gradient(135deg, #52c41a 0%, #fa8c16 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                }}
              >
                Готовы начать свой путь?
              </Title>
              <Text style={{ color: "#595959", fontSize: "16px" }}>
                Присоединяйтесь к 50,000+ учащимся, которые уже развивают свои
                навыки на VoxFox
              </Text>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                size="large"
                style={{
                  background:
                    "linear-gradient(135deg, #52c41a 0%, #fa8c16 100%)",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  padding: "0 32px",
                  height: "48px",
                  boxShadow: "0 4px 12px rgba(82, 196, 26, 0.3)",
                }}
              >
                Начать бесплатно <ArrowRightOutlined />
              </Button>
            </Col>
          </Row>
        </Card>

        <Row gutter={[32, 32]}>
          <Col xs={24} md={6}>
            <Space direction="vertical" size="large">
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background:
                      "linear-gradient(135deg, #52c41a 0%, #fa8c16 100%)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RocketOutlined style={{ fontSize: "22px", color: "#fff" }} />
                </div>
                <div>
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      background:
                        "linear-gradient(135deg, #52c41a 0%, #fa8c16 50%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 700,
                    }}
                  >
                    VoxFox
                  </Title>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Платформа для всех желающих обрести знания в разных сферах
                  </Text>
                </div>
              </div>

              <Text style={{ color: "#595959", lineHeight: 1.6 }}>
                Образовательная платформа нового поколения. Развивайте навыки
                через практику и сообщество.
              </Text>

              <Space size="middle">
                <Button
                  type="text"
                  shape="circle"
                  icon={<FacebookOutlined style={{ color: "#52c41a" }} />}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid #e8f5e9",
                  }}
                />
                <Button
                  type="text"
                  shape="circle"
                  icon={<TwitterOutlined style={{ color: "#52c41a" }} />}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid #e8f5e9",
                  }}
                />
                <Button
                  type="text"
                  shape="circle"
                  icon={<InstagramOutlined style={{ color: "#52c41a" }} />}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid #e8f5e9",
                  }}
                />
                <Button
                  type="text"
                  shape="circle"
                  icon={<GithubOutlined style={{ color: "#52c41a" }} />}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid #e8f5e9",
                  }}
                />
              </Space>
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Title
              level={5}
              style={{
                marginBottom: "20px",
                color: "#389e0d",
                fontWeight: 600,
              }}
            >
              Платформа
            </Title>
            <Space direction="vertical" size="small">
              <Link
                href="#"
                style={{
                  color: "#595959",
                  display: "block",
                  padding: "6px 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
              >
                <CodeOutlined
                  style={{ marginRight: "8px", color: "#52c41a" }}
                />{" "}
                Курсы
              </Link>
              <Link
                href="#"
                style={{
                  color: "#595959",
                  display: "block",
                  padding: "6px 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
              >
                <RocketOutlined
                  style={{ marginRight: "8px", color: "#52c41a" }}
                />{" "}
                Проекты
              </Link>
              <Link
                href="#"
                style={{
                  color: "#595959",
                  display: "block",
                  padding: "6px 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
              >
                <TeamOutlined
                  style={{ marginRight: "8px", color: "#52c41a" }}
                />{" "}
                Сообщество
              </Link>
              <Link
                href="#"
                style={{
                  color: "#595959",
                  display: "block",
                  padding: "6px 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
              >
                <TrophyOutlined
                  style={{ marginRight: "8px", color: "#52c41a" }}
                />{" "}
                Сертификаты
              </Link>
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Title
              level={5}
              style={{
                marginBottom: "20px",
                color: "#389e0d",
                fontWeight: 600,
              }}
            >
              Ресурсы
            </Title>
            <Space direction="vertical" size="small">
              <Link
                href="#"
                style={{
                  color: "#595959",
                  display: "block",
                  padding: "6px 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
              >
                Блог
              </Link>
              <Link
                href="#"
                style={{
                  color: "#595959",
                  display: "block",
                  padding: "6px 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
              >
                Документация
              </Link>
              <Link
                href="#"
                style={{
                  color: "#595959",
                  display: "block",
                  padding: "6px 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
              >
                FAQ
              </Link>
              <Link
                href="#"
                style={{
                  color: "#595959",
                  display: "block",
                  padding: "6px 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
              >
                Карьера
              </Link>
              <Link
                href="#"
                style={{
                  color: "#595959",
                  display: "block",
                  padding: "6px 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
              >
                Для компаний
              </Link>
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Title
              level={5}
              style={{
                marginBottom: "20px",
                color: "#389e0d",
                fontWeight: 600,
              }}
            >
              Контакты
            </Title>
            <Space direction="vertical" size="middle">
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <MailOutlined style={{ color: "#52c41a" }} />
                <div>
                  <Text style={{ color: "#262626", display: "block" }}>
                    Email
                  </Text>
                  <Text type="secondary">support@voxfox.com</Text>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <PhoneOutlined style={{ color: "#52c41a" }} />
                <div>
                  <Text style={{ color: "#262626", display: "block" }}>
                    Телефон
                  </Text>
                  <Text type="secondary">+7 (999) 123-45-67</Text>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <EnvironmentOutlined style={{ color: "#52c41a" }} />
                <div>
                  <Text style={{ color: "#262626", display: "block" }}>
                    Адрес
                  </Text>
                  <Text type="secondary">Москва, ул. Примерная, 123</Text>
                </div>
              </div>
            </Space>
          </Col>
        </Row>

        <Divider
          style={{
            margin: "48px 0 32px",
            borderColor: "#e8f5e9",
          }}
        />

        <Row justify="space-between" align="middle">
          <Col xs={24} md={12}>
            <Text type="secondary">
              © 2024 VoxFox Platform. Все права защищены.
            </Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Space size="large">
              <Link
                href="#"
                style={{
                  color: "#52c41a",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#52c41a")}
              >
                Политика конфиденциальности
              </Link>
              <Link
                href="#"
                style={{
                  color: "#52c41a",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#52c41a")}
              >
                Условия использования
              </Link>
              <Link
                href="#"
                style={{
                  color: "#52c41a",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#52c41a")}
              >
                Правила сообщества
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;
