// src/pages/UserProfile.jsx
import {
  Button,
  Col,
  Layout,
  Row,
  Card,
  Statistic,
  Typography,
  Divider,
  Progress,
  Avatar,
  Calendar,
  Badge,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  StarOutlined,
  FireOutlined,
} from "@ant-design/icons";
import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
// Импортируем вынесенный Header

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  // Функция для отображения календаря активности
  // const getDateCellRender = (value: any) => {
  //   const date = value.date();
  //   // Простая логика для демонстрации активности
  //   const isActive = date % 3 === 0;
  //   const isVeryActive = date % 7 === 0;

  //   if (isVeryActive) {
  //     return (
  //       <Tooltip title="Высокая активность">
  //         <div
  //           style={{
  //             background: "#52c41a",
  //             borderRadius: "2px",
  //             height: "4px",
  //             width: "4px",
  //             margin: "auto",
  //           }}
  //         />
  //       </Tooltip>
  //     );
  //   }

  //   if (isActive) {
  //     return (
  //       <Tooltip title="Средняя активность">
  //         <div
  //           style={{
  //             background: "#1890ff",
  //             borderRadius: "2px",
  //             height: "4px",
  //             width: "4px",
  //             margin: "auto",
  //           }}
  //         />
  //       </Tooltip>
  //     );
  //   }
  //   return null;
  // };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />

      <Layout>
        {/* Боковая панель профиля */}
        <Sider
          width={320}
          style={{
            background: "transparent",
            padding: "24px 16px",
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Avatar
                size={96}
                icon={<UserOutlined />}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  marginBottom: "16px",
                  border: "4px solid #fff",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                }}
              />
              <Title level={3} style={{ margin: 0, marginBottom: "4px" }}>
                Елизавета Трищенкова
              </Title>
              <Text type="secondary">Frontend Developer</Text>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
              <Col span={12}>
                <Statistic
                  title={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <TeamOutlined style={{ color: "#1890ff" }} />
                      <Text type="secondary">Подписчики</Text>
                    </div>
                  }
                  value={0}
                  valueStyle={{ fontSize: "28px", fontWeight: 600 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <TrophyOutlined style={{ color: "#faad14" }} />
                      <Text type="secondary">Знания</Text>
                    </div>
                  }
                  value={500}
                  valueStyle={{
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "#faad14",
                  }}
                />
              </Col>
            </Row>

            <Row gutter={[12, 12]} style={{ marginBottom: "24px" }}>
              <Col span={12}>
                <Button
                  block
                  icon={<UserOutlined />}
                  style={{ height: "40px", borderRadius: "8px" }}
                >
                  Профиль
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  icon={<TrophyOutlined />}
                  style={{ height: "40px", borderRadius: "8px" }}
                >
                  Сертификаты
                </Button>
              </Col>
            </Row>

            <div
              style={{
                background: "#f9f9f9",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            >
              <div style={{ marginBottom: "8px" }}>
                <CalendarOutlined
                  style={{ marginRight: "8px", color: "#1890ff" }}
                />
                <Text type="secondary">Присоединился 2 года назад</Text>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <Text type="secondary">Как мой профиль видят другие</Text>
              </div>
              <div>
                <Text strong>User ID: 690037095</Text>
              </div>
            </div>

            <Divider />

            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <Text strong>Активность за последний год</Text>
                <Badge
                  count="сегодня"
                  style={{
                    background: "#f6ffed",
                    color: "#52c41a",
                    borderColor: "#b7eb8f",
                  }}
                />
              </div>
              <Progress percent={40}></Progress>
              ;
              <Calendar
                fullscreen={false}
                headerRender={() => null}
                // cellRender={getDateCellRender}
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                }}
              />
              <div
                style={{
                  background: "#f6ffed",
                  padding: "12px",
                  borderRadius: "6px",
                  marginTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#52c41a" }}>
                  Следующий день в 00:00 UTC
                </Text>
                <FireOutlined style={{ color: "#ff7a45" }} />
              </div>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={8} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#e6f7ff",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px",
                  }}
                >
                  <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                    0
                  </Title>
                </div>
                <Text type="secondary">дней без перерыва</Text>
              </Col>
              <Col span={8} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#f6ffed",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px",
                  }}
                >
                  <Title level={2} style={{ margin: 0, color: "#52c41a" }}>
                    5
                  </Title>
                </div>
                <Text type="secondary">макс. дней</Text>
              </Col>
              <Col span={8} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#f9f0ff",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px",
                  }}
                >
                  <Title level={2} style={{ margin: 0, color: "#722ed1" }}>
                    500
                  </Title>
                </div>
                <Text type="secondary">задач решено</Text>
              </Col>
            </Row>

            <div style={{ marginTop: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <Text strong>Прогресс обучения</Text>
                <Text strong style={{ color: "#1890ff" }}>
                  65%
                </Text>
              </div>
              <Progress
                percent={65}
                strokeColor={{
                  "0%": "#1890ff",
                  "100%": "#52c41a",
                }}
                showInfo={false}
                style={{ marginBottom: "0" }}
              />
            </div>
          </Card>
        </Sider>

        <Content
          style={{
            padding: "24px",
            background: "#fafafa",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
              minHeight: "calc(100vh - 112px)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <Title level={2} style={{ margin: 0 }}>
                Добро пожаловать в VoxFox! 🦊
              </Title>
              <Button type="primary" icon={<StarOutlined />}>
                Новое задание
              </Button>
            </div>

            <Row gutter={[24, 24]}>
              <Col span={8}>
                <Card style={{ borderRadius: "12px" }}>
                  <Statistic
                    title="Активные проекты"
                    value={3}
                    valueStyle={{ color: "#1890ff", fontSize: "32px" }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ borderRadius: "12px" }}>
                  <Statistic
                    title="Выполнено заданий"
                    value={24}
                    valueStyle={{ color: "#52c41a", fontSize: "32px" }}
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ borderRadius: "12px" }}>
                  <Statistic
                    title="Очков опыта"
                    value={1250}
                    valueStyle={{ color: "#722ed1", fontSize: "32px" }}
                    prefix={<FireOutlined />}
                  />
                </Card>
              </Col>

              <Col span={24}>
                <Card
                  title="Мои проекты"
                  style={{ borderRadius: "12px" }}
                  extra={<Button type="link">Смотреть все</Button>}
                >
                  <div style={{ padding: "40px 0", textAlign: "center" }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                      🚀
                    </div>
                    <Title level={3}>Начните новый проект</Title>
                    <Text
                      type="secondary"
                      style={{ marginBottom: "24px", display: "block" }}
                    >
                      Создайте свой первый проект и начните развивать свои
                      навыки
                    </Text>
                    <Button
                      type="primary"
                      size="large"
                      style={{ borderRadius: "8px" }}
                    >
                      Создать проект
                    </Button>
                  </div>
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  title="Последняя активность"
                  style={{ borderRadius: "12px" }}
                >
                  <div style={{ padding: "16px 0" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px",
                        paddingBottom: "16px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ marginRight: "12px" }}
                      />
                      <div>
                        <Text strong>Вы начали новый курс</Text>
                        <div>
                          <Text type="secondary">2 часа назад</Text>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px",
                        paddingBottom: "16px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ marginRight: "12px" }}
                      />
                      <div>
                        <Text strong>Задание выполнено</Text>
                        <div>
                          <Text type="secondary">Вчера</Text>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ marginRight: "12px" }}
                      />
                      <div>
                        <Text strong>Новый сертификат</Text>
                        <div>
                          <Text type="secondary">3 дня назад</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  title="Рекомендуемые курсы"
                  style={{ borderRadius: "12px" }}
                >
                  <div style={{ padding: "16px 0" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                        paddingBottom: "16px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <div>
                        <Text strong>React с нуля</Text>
                        <div>
                          <Progress percent={30} size="small" />
                        </div>
                      </div>
                      <Button type="link">Продолжить</Button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                        paddingBottom: "16px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <div>
                        <Text strong>TypeScript для начинающих</Text>
                        <div>
                          <Progress percent={75} size="small" />
                        </div>
                      </div>
                      <Button type="link">Продолжить</Button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <Text strong>Ant Design и UI/UX</Text>
                        <div>
                          <Progress percent={45} size="small" />
                        </div>
                      </div>
                      <Button type="link">Начать</Button>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default UserProfile;
