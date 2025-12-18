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
  Space,
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
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { gradients, commonStyles, componentProps } from "../../theme";
import { authStorage } from "../../services/auth-storage.service";
import { userApi } from "../../api/userApi";
import type { UserResponse } from "../../api/types/user";

// eslint-disable-next-line react-hooks/rules-of-hooks

// Импортируем вынесенный Header

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserResponse | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = authStorage.getUserData<string>();
      if (!userId) {
        return;
      }
      const userResponse = await userApi.getUserById(userId);
      setUserData(userResponse);
    };
    fetchUser();
  }, []);

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
    <Layout style={commonStyles.pageLayout}>
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
          <Card bodyStyle={{ padding: 24 }}>
            {userData && (
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <Avatar
                  size={96}
                  icon={<UserOutlined />}
                  style={{
                      background: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
                      border: "4px solid #fff",
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                      marginBottom: 16,
                  }}
                />
                <Title level={3} style={{ margin: 0, marginBottom: "4px" }}>
                  {userData.name}
                </Title>
                <Title level={3} style={{ margin: 0, marginBottom: "4px" }}>
                  {userData.email}
                </Title>
              </div>
            )}
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
                      <Text {...componentProps.text.secondary}>Подписчики</Text>
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
                      <Text {...componentProps.text.secondary}>Знания</Text>
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

            <div style={commonStyles.infoBox}>
              <Space {...componentProps.space.vertical} size="small">
                <Space>
                  <CalendarOutlined style={{ color: "#1890ff" }} />
                  <Text {...componentProps.text.secondary}>
                    Присоединился 2 года назад
                  </Text>
                </Space>
                <Text {...componentProps.text.secondary}>
                  Как мой профиль видят другие
                </Text>
                <Text {...componentProps.text.strong}>User ID: 690037095</Text>
              </Space>
            </div>

            <Divider />

            <div style={{ marginBottom: 24 }}>
              <Space
                {...componentProps.space.flexBetween}
                style={{ marginBottom: 12 }}
              >
                <Text {...componentProps.text.strong}>
                  Активность за последний год
                </Text>
                <Badge
                  count="сегодня"
                  style={{
                    background: "#f6ffed",
                    color: "#52c41a",
                    borderColor: "#b7eb8f",
                  }}
                />
              </Space>
              <Progress percent={40} />
              <Calendar
                fullscreen={false}
                headerRender={() => null}
                style={{ border: "1px solid #f0f0f0", borderRadius: 8 }}
              />
              <div style={commonStyles.infoBoxSuccess}>
                <Space {...componentProps.space.flexBetween}>
                  <Text style={{ color: "#52c41a" }}>
                    Следующий день в 00:00 UTC
                  </Text>
                  <FireOutlined style={{ color: "#ff7a45" }} />
                </Space>
              </div>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
              {[
                {
                  value: 0,
                  label: "дней без перерыва",
                  bg: "#e6f7ff",
                  color: "#1890ff",
                },
                {
                  value: 5,
                  label: "макс. дней",
                  bg: "#f6ffed",
                  color: "#52c41a",
                },
                {
                  value: 500,
                  label: "задач решено",
                  bg: "#f9f0ff",
                  color: "#722ed1",
                },
              ].map((item, idx) => (
                <Col key={idx} span={8} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      ...commonStyles.iconBoxSmall,
                      background: item.bg,
                    }}
                  >
                    <Title level={2} style={{ margin: 0, color: item.color }}>
                      {item.value}
                    </Title>
                  </div>
                  <Text {...componentProps.text.secondary}>{item.label}</Text>
                </Col>
              ))}
            </Row>

            <div style={{ marginTop: 24 }}>
              <Space
                {...componentProps.space.flexBetween}
                style={{ marginBottom: 8 }}
              >
                <Text {...componentProps.text.strong}>Прогресс обучения</Text>
                <Text
                  {...componentProps.text.strong}
                  style={{ color: "#1890ff" }}
                >
                  65%
                </Text>
              </Space>
              <Progress
                percent={65}
                strokeColor={{ "0%": "#1890ff", "100%": "#52c41a" }}
                showInfo={false}
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
          <Card style={{ minHeight: "calc(100vh - 112px)" }}>
            <Space
              {...componentProps.space.flexBetween}
              style={{ marginBottom: 24 }}
            >
              <Title level={2} style={{ margin: 0 }}>
                Добро пожаловать в VoxFox! 🦊
              </Title>
              <Button type="primary" icon={<StarOutlined />}>
                Новое задание
              </Button>
            </Space>

            <Row gutter={[24, 24]}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Активные проекты"
                    value={3}
                    valueStyle={{ color: "#1890ff", fontSize: "32px" }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Выполнено заданий"
                    value={24}
                    valueStyle={{ color: "#52c41a", fontSize: "32px" }}
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
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
                  extra={<Button type="link">Смотреть все</Button>}
                >
                  <div
                    style={{ padding: "40px 0", ...commonStyles.textCenter }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
                    <Title level={3}>Начните новый проект</Title>
                    <Text
                      {...componentProps.text.secondary}
                      style={{ marginBottom: 24, display: "block" }}
                    >
                      Создайте свой первый проект и начните развивать свои
                      навыки
                    </Text>
                    <Button type="primary" size="large">
                      Создать проект
                    </Button>
                  </div>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="Последняя активность">
                  <Space {...componentProps.space.verticalWithPadding}>
                    {[
                      { title: "Вы начали новый курс", time: "2 часа назад" },
                      { title: "Задание выполнено", time: "Вчера" },
                      { title: "Новый сертификат", time: "3 дня назад" },
                    ].map((item, idx) => (
                      <Space
                        key={idx}
                        style={{
                          width: "100%",
                          paddingBottom: idx < 2 ? 16 : 0,
                          borderBottom: idx < 2 ? "1px solid #f0f0f0" : "none",
                        }}
                      >
                        <Avatar icon={<UserOutlined />} />
                        <div>
                          <Text {...componentProps.text.strong}>
                            {item.title}
                          </Text>
                          <div>
                            <Text {...componentProps.text.secondary}>
                              {item.time}
                            </Text>
                          </div>
                        </div>
                      </Space>
                    ))}
                  </Space>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="Рекомендуемые курсы">
                  <Space {...componentProps.space.verticalWithPadding}>
                    {[
                      {
                        title: "React с нуля",
                        progress: 30,
                        action: "Продолжить",
                      },
                      {
                        title: "TypeScript для начинающих",
                        progress: 75,
                        action: "Продолжить",
                      },
                      {
                        title: "Ant Design и UI/UX",
                        progress: 45,
                        action: "Начать",
                      },
                    ].map((item, idx) => (
                      <Space
                        key={idx}
                        {...componentProps.space.flexBetween}
                        style={{
                          paddingBottom: idx < 2 ? 16 : 0,
                          borderBottom: idx < 2 ? "1px solid #f0f0f0" : "none",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <Text {...componentProps.text.strong}>
                            {item.title}
                          </Text>
                          <div>
                            <Progress
                              percent={item.progress}
                              {...componentProps.progress.small}
                            />
                          </div>
                        </div>
                        <Button {...componentProps.button.link}>
                          {item.action}
                        </Button>
                      </Space>
                    ))}
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default UserProfile;
