import {
  ArrowRightOutlined,
  CodeOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  GithubOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
  RocketOutlined,
  TeamOutlined,
  TrophyOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Col, Divider, Layout, Row, Space, Typography } from "antd";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const FooterPrototype = () => {
  return (
    <AntFooter
      style={{
        background: "#fff",
        borderTop: "1px solid #ddd",
        padding: "64px 0 24px",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div
          style={{
            background: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "8px",
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
                  color: "#333",
                  fontWeight: 600,
                }}
              >
                Готовы начать свой путь?
              </Title>
              <Text style={{ color: "#666", fontSize: "16px" }}>
                Присоединяйтесь к 50,000+ учащимся, которые уже развивают свои
                навыки на VoxFox
              </Text>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  background: "#e0e0e0",
                  border: "1px solid #bbb",
                  borderRadius: "4px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Начать бесплатно <ArrowRightOutlined />
              </div>
            </Col>
          </Row>
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={24} md={6}>
            <Space orientation="vertical" size="large">
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "#f0f0f0",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RocketOutlined style={{ fontSize: "22px", color: "#999" }} />
                </div>
                <div>
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      color: "#333",
                      fontWeight: 600,
                    }}
                  >
                    VoxFox
                  </Title>
                  <Text style={{ color: "#666", fontSize: "12px" }}>
                    Платформа для всех желающих обрести знания в разных сферах
                  </Text>
                </div>
              </div>

              <Text style={{ color: "#666", lineHeight: 1.6 }}>
                Образовательная платформа нового поколения. Развивайте навыки
                через практику и сообщество.
              </Text>

              <Space size="middle">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#f5f5f5",
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <FacebookOutlined style={{ color: "#999" }} />
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#f5f5f5",
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <TwitterOutlined style={{ color: "#999" }} />
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#f5f5f5",
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <InstagramOutlined style={{ color: "#999" }} />
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#f5f5f5",
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <GithubOutlined style={{ color: "#999" }} />
                </div>
              </Space>
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Title
              level={5}
              style={{
                marginBottom: "20px",
                color: "#333",
                fontWeight: 600,
              }}
            >
              Платформа
            </Title>
            <Space direction="vertical" size="small">
              <div
                style={{
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 0",
                  cursor: "pointer",
                }}
              >
                <CodeOutlined style={{ marginRight: "8px", color: "#999" }} />{" "}
                Курсы
              </div>
              <div
                style={{
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 0",
                  cursor: "pointer",
                }}
              >
                <RocketOutlined style={{ marginRight: "8px", color: "#999" }} />{" "}
                Проекты
              </div>
              <div
                style={{
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 0",
                  cursor: "pointer",
                }}
              >
                <TeamOutlined style={{ marginRight: "8px", color: "#999" }} />{" "}
                Сообщество
              </div>
              <div
                style={{
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 0",
                  cursor: "pointer",
                }}
              >
                <TrophyOutlined style={{ marginRight: "8px", color: "#999" }} />{" "}
                Сертификаты
              </div>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Title
              level={5}
              style={{
                marginBottom: "20px",
                color: "#333",
                fontWeight: 600,
              }}
            >
              Ресурсы
            </Title>
            <Space direction="vertical" size="small">
              <div
                style={{
                  color: "#666",
                  padding: "6px 0",
                  cursor: "pointer",
                }}
              >
                Блог
              </div>
              <div
                style={{
                  color: "#666",
                  padding: "6px 0",
                  cursor: "pointer",
                }}
              >
                Документация
              </div>
              <div
                style={{
                  color: "#666",
                  padding: "6px 0",
                  cursor: "pointer",
                }}
              >
                FAQ
              </div>
              <div
                style={{
                  color: "#666",
                  padding: "6px 0",
                  cursor: "pointer",
                }}
              >
                Карьера
              </div>
              <div
                style={{
                  color: "#666",
                  padding: "6px 0",
                  cursor: "pointer",
                }}
              >
                Для компаний
              </div>
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Title
              level={5}
              style={{
                marginBottom: "20px",
                color: "#333",
                fontWeight: 600,
              }}
            >
              Контакты
            </Title>
            <Space direction="vertical" size="middle">
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <MailOutlined style={{ color: "#999" }} />
                <div>
                  <Text style={{ color: "#333", display: "block" }}>Email</Text>
                  <Text style={{ color: "#666" }}>support@voxfox.com</Text>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <PhoneOutlined style={{ color: "#999" }} />
                <div>
                  <Text style={{ color: "#333", display: "block" }}>
                    Телефон
                  </Text>
                  <Text style={{ color: "#666" }}>+7 (999) 123-45-67</Text>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <EnvironmentOutlined style={{ color: "#999" }} />
                <div>
                  <Text style={{ color: "#333", display: "block" }}>Адрес</Text>
                  <Text style={{ color: "#666" }}>
                    Москва, ул. Примерная, 123
                  </Text>
                </div>
              </div>
            </Space>
          </Col>
        </Row>

        <Divider
          style={{
            margin: "48px 0 32px",
            borderColor: "#ddd",
          }}
        />

        <Row justify="space-between" align="middle">
          <Col xs={24} md={12}>
            <Text style={{ color: "#666" }}>
              © 2024 VoxFox Platform. Все права защищены.
            </Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Space size="large">
              <div
                style={{
                  color: "#666",
                  cursor: "pointer",
                }}
              >
                Политика конфиденциальности
              </div>
              <div
                style={{
                  color: "#666",
                  cursor: "pointer",
                }}
              >
                Условия использования
              </div>
              <div
                style={{
                  color: "#666",
                  cursor: "pointer",
                }}
              >
                Правила сообщества
              </div>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default FooterPrototype;
