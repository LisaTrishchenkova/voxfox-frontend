// src/pages/RegistrationPage.tsx
import React from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Divider,
  Typography,
  Space,
  type FormProps,
  notification,
  message,
} from "antd";
import {
  MailOutlined,
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  GithubOutlined,
  FacebookOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { RegFormData } from "../../api/types/reg";
import { regApi } from "../../api/regApi";

const { Title, Text, Link } = Typography;

const RegPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish: FormProps<RegFormData>["onFinish"] = async (values) => {
    console.log(values);
    const status = await regApi.reg(values.email, values.name, values.password);
    console.log(status);
    if (status === 204) {
      navigate("/user-profile");
    } else {
    }
  };

  const onFinishFailed: FormProps<RegFormData>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log(errorInfo);
  };

  // Валидация для подтверждения пароля
  // const validateConfirmPassword = ({ getFieldValue }: any) => ({
  //   validator(_: any, value: string) {
  //     if (!value || getFieldValue("password") === value) {
  //       return Promise.resolve();
  //     }
  //     return Promise.reject(new Error("Пароли не совпадают!"));
  //   },
  // });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fff4 0%, #f0f9e6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <Row
        gutter={0}
        style={{
          maxWidth: "1200px",
          width: "100%",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(82, 196, 26, 0.15)",
          background: "#fff",
        }}
      >
        {/* Левая часть - форма регистрации */}
        <Col xs={24} md={12} lg={10}>
          <div style={{ padding: "60px 48px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background:
                    "linear-gradient(135deg, #52c41a 0%, #fa8c16 100%)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <UserOutlined style={{ fontSize: "28px", color: "#fff" }} />
              </div>
              <Title
                level={2}
                style={{
                  marginBottom: "12px",
                  background:
                    "linear-gradient(135deg, #52c41a 0%, #fa8c16 50%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                }}
              >
                Регистрация
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                Если вы уже регистрировали аккаунт
                <br />
                Перейдите сюда{" "}
                <Link
                  onClick={() => navigate("/login")}
                  style={{
                    color: "#52c41a",
                    fontWeight: 600,
                    borderBottom: "1px dashed #52c41a",
                  }}
                >
                  Войти в профиль!
                </Link>
              </Text>
            </div>

            <Form
              form={form}
              name="register"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              requiredMark={false}
            >
              <Form.Item<RegFormData>
                label={
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#262626",
                      marginBottom: "8px",
                    }}
                  >
                    Email
                  </div>
                }
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите вашу почту",
                  },
                  {
                    type: "email",
                    message: "Пожалуйста, введите корректный email",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Введите свою почту"
                  prefix={<MailOutlined style={{ color: "#52c41a" }} />}
                  style={{
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "16px",
                  }}
                />
              </Form.Item>

              <Divider />

              <Form.Item<RegFormData>
                label={
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#262626",
                      marginBottom: "8px",
                    }}
                  >
                    Введите ваш ник
                  </div>
                }
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите ваш ник",
                  },
                  {
                    min: 3,
                    message: "Ник должен содержать минимум 3 символа",
                  },
                  {
                    max: 20,
                    message: "Ник должен содержать максимум 20 символов",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Придумайте уникальный ник"
                  prefix={<UserOutlined style={{ color: "#52c41a" }} />}
                  style={{
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "16px",
                  }}
                />
              </Form.Item>

              <Form.Item<RegFormData>
                label={
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#262626",
                      marginBottom: "8px",
                    }}
                  >
                    Пароль
                  </div>
                }
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите пароль",
                  },
                  {
                    min: 8,
                    message: "Пароль должен содержать минимум 8 символов",
                  },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      "Пароль должен содержать заглавные, строчные буквы и цифры",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Придумайте надежный пароль"
                  prefix={<LockOutlined style={{ color: "#52c41a" }} />}
                  style={{
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "16px",
                  }}
                />
              </Form.Item>

              {/* <Form.Item
                label={
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#262626',
                    marginBottom: '8px'
                  }}>
                    Повторите пароль
                  </div>
                }
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: 'Пожалуйста, повторите пароль'
                  },
                  validateConfirmPassword
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Повторите пароль"
                  prefix={<LockOutlined style={{ color: '#52c41a' }} />}
                  style={{
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px'
                  }}
                />
              </Form.Item> */}

              <Form.Item style={{ marginTop: "40px" }}>
                <Button type="primary" htmlType="submit">
                  Зарегистрироваться{" "}
                  <ArrowRightOutlined style={{ marginLeft: "8px" }} />
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Text type="secondary">
                Нажимая кнопку "Зарегистрироваться", вы соглашаетесь с{" "}
                <Link style={{ color: "#52c41a" }}>
                  политикой конфиденциальности
                </Link>{" "}
                и{" "}
                <Link style={{ color: "#52c41a" }}>
                  условиями использования
                </Link>
              </Text>
            </div>

            <Divider>
              <Text type="secondary">или продолжить через</Text>
            </Divider>

            <Space
              direction="vertical"
              align="center"
              style={{ width: "100%" }}
              size="large"
            >
              <Space size="large">
                <Button
                  shape="circle"
                  icon={<GoogleOutlined />}
                  size="large"
                  style={{
                    width: "52px",
                    height: "52px",
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                />
                <Button
                  shape="circle"
                  icon={<GithubOutlined />}
                  size="large"
                  style={{
                    width: "52px",
                    height: "52px",
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                />
                <Button
                  shape="circle"
                  icon={<FacebookOutlined />}
                  size="large"
                  style={{
                    width: "52px",
                    height: "52px",
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                />
              </Space>
            </Space>
          </div>
        </Col>

        {/* Правая часть - декоративная иллюстрация */}
        <Col xs={24} md={12} lg={14}>
          <div
            style={{
              height: "100%",
              minHeight: "600px",
              background:
                "linear-gradient(135deg, rgba(82, 196, 26, 0.95) 0%, rgba(250, 140, 22, 0.95) 100%)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "60px 48px",
              overflow: "hidden",
            }}
          >
            {/* Декоративные элементы */}
            <div
              style={{
                position: "absolute",
                top: "-100px",
                right: "-100px",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-150px",
                left: "-150px",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
              }}
            />

            {/* Контент правой части */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                color: "#fff",
              }}
            >
              <Title
                level={1}
                style={{
                  color: "#fff",
                  marginBottom: "24px",
                  fontSize: "48px",
                  fontWeight: 800,
                }}
              >
                Начните свой путь!
              </Title>

              <div
                style={{
                  fontSize: "20px",
                  lineHeight: 1.6,
                  marginBottom: "48px",
                  maxWidth: "600px",
                  opacity: 0.9,
                }}
              >
                Присоединяйтесь к сообществу разработчиков и получите доступ ко
                всем возможностям VoxFox
              </div>

              {/* Иллюстрация в виде иконок */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "40px",
                  flexWrap: "wrap",
                  marginBottom: "60px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <span style={{ fontSize: "40px" }}>🎓</span>
                  </div>
                  <Text strong style={{ color: "#fff", fontSize: "16px" }}>
                    500+ курсов
                  </Text>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <span style={{ fontSize: "40px" }}>🏆</span>
                  </div>
                  <Text strong style={{ color: "#fff", fontSize: "16px" }}>
                    Сертификаты
                  </Text>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <span style={{ fontSize: "40px" }}>🤝</span>
                  </div>
                  <Text strong style={{ color: "#fff", fontSize: "16px" }}>
                    Менторство
                  </Text>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "32px",
                  borderRadius: "20px",
                  backdropFilter: "blur(10px)",
                  maxWidth: "700px",
                  margin: "0 auto",
                  textAlign: "left",
                }}
              >
                <Title
                  level={4}
                  style={{ color: "#fff", marginBottom: "20px" }}
                >
                  Преимущества регистрации:
                </Title>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ flex: "1", minWidth: "250px" }}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "24px",
                          height: "24px",
                          background: "#fff",
                          borderRadius: "50%",
                          color: "#52c41a",
                          fontWeight: "bold",
                          lineHeight: "24px",
                          marginRight: "12px",
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      Персональный план обучения
                    </Text>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "24px",
                          height: "24px",
                          background: "#fff",
                          borderRadius: "50%",
                          color: "#52c41a",
                          fontWeight: "bold",
                          lineHeight: "24px",
                          marginRight: "12px",
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      Практические проекты
                    </Text>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "24px",
                          height: "24px",
                          background: "#fff",
                          borderRadius: "50%",
                          color: "#52c41a",
                          fontWeight: "bold",
                          lineHeight: "24px",
                          marginRight: "12px",
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      Поддержка сообщества
                    </Text>
                  </div>

                  <div style={{ flex: "1", minWidth: "250px" }}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "24px",
                          height: "24px",
                          background: "#fff",
                          borderRadius: "50%",
                          color: "#52c41a",
                          fontWeight: "bold",
                          lineHeight: "24px",
                          marginRight: "12px",
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      Прогресс обучения
                    </Text>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "24px",
                          height: "24px",
                          background: "#fff",
                          borderRadius: "50%",
                          color: "#52c41a",
                          fontWeight: "bold",
                          lineHeight: "24px",
                          marginRight: "12px",
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      Сертификаты об окончании
                    </Text>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "24px",
                          height: "24px",
                          background: "#fff",
                          borderRadius: "50%",
                          color: "#52c41a",
                          fontWeight: "bold",
                          lineHeight: "24px",
                          marginRight: "12px",
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      Карьерные возможности
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RegPage;
