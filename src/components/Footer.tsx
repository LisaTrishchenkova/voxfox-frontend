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
import { gradients } from "../theme";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{
      background: "#f9fff4",
      borderTop: "1px solid #e8f5e9",
      padding: "64px 0 24px",
      marginTop: "auto",
      boxShadow: "0 -2px 10px rgba(82, 196, 26, 0.05)",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <Card
          style={{
            background: gradients.primaryLight,
            border: "1px solid rgba(82, 196, 26, 0.2)",
            borderRadius: 16,
            marginBottom: 48,
            padding: 32,
          }}
        >
          <Row align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Title
                level={3}
                style={{
                  marginBottom: 8,
                  background: gradients.primary,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                }}
              >
                Готовы начать свой путь?
              </Title>
              <Text style={{ color: "#595959", fontSize: 16 }}>
                Присоединяйтесь к 50,000+ учащимся, которые уже развивают свои
                навыки на VoxFox
              </Text>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                size="large"
                style={{ background: gradients.primary, border: "none", padding: "0 32px", height: 48 }}
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
                    width: 44,
                    height: 44,
                    background: gradients.primary,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RocketOutlined style={{ fontSize: 22, color: "#fff" }} />
                </div>
                <div>
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      background: gradients.primaryText,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 700,
                    }}
                  >
                    VoxFox
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
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
                  style={{ width: 40, height: 40, border: "1px solid #e8f5e9" }}
                />
                <Button
                  type="text"
                  shape="circle"
                  icon={<TwitterOutlined style={{ color: "#52c41a" }} />}
                  style={{ width: 40, height: 40, border: "1px solid #e8f5e9" }}
                />
                <Button
                  type="text"
                  shape="circle"
                  icon={<InstagramOutlined style={{ color: "#52c41a" }} />}
                  style={{ width: 40, height: 40, border: "1px solid #e8f5e9" }}
                />
                <Button
                  type="text"
                  shape="circle"
                  icon={<GithubOutlined style={{ color: "#52c41a" }} />}
                  style={{ width: 40, height: 40, border: "1px solid #e8f5e9" }}
                />
              </Space>
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Title level={5} style={{ marginBottom: 20, color: "#389e0d", fontWeight: 600 }}>
              Платформа
            </Title>
            <Space direction="vertical" size="small">
              {[
                { icon: <CodeOutlined />, text: "Курсы" },
                { icon: <RocketOutlined />, text: "Проекты" },
                { icon: <TeamOutlined />, text: "Сообщество" },
                { icon: <TrophyOutlined />, text: "Сертификаты" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href="#"
                  style={{ color: "#595959", display: "block", padding: "6px 0", transition: "color 0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
                >
                  <span style={{ marginRight: 8, color: "#52c41a" }}>{item.icon}</span>
                  {item.text}
                </Link>
              ))}
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Title level={5} style={{ marginBottom: 20, color: "#389e0d", fontWeight: 600 }}>
              Ресурсы
            </Title>
            <Space direction="vertical" size="small">
              {['Блог', 'Документация', 'FAQ', 'Карьера', 'Для компаний'].map(item => (
                <Link
                  key={item}
                  href="#"
                  style={{ color: "#595959", display: "block", padding: "6px 0", transition: "color 0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#595959")}
                >
                  {item}
                </Link>
              ))}
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Title level={5} style={{ marginBottom: 20, color: "#389e0d", fontWeight: 600 }}>
              Контакты
            </Title>
            <Space direction="vertical" size="middle">
              {[
                { icon: <MailOutlined />, label: "Email", value: "support@voxfox.com" },
                { icon: <PhoneOutlined />, label: "Телефон", value: "+7 (999) 123-45-67" },
                { icon: <EnvironmentOutlined />, label: "Адрес", value: "Москва, ул. Примерная, 123" },
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
            <Text type="secondary">
              © 2024 VoxFox Platform. Все права защищены.
            </Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Space size="large">
              {['Политика конфиденциальности', 'Условия использования', 'Правила сообщества'].map(item => (
                <Link
                  key={item}
                  href="#"
                  style={{ color: "#52c41a", transition: "color 0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fa8c16")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#52c41a")}
                >
                  {item}
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
