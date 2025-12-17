import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Checkbox,
  Divider,
  Typography,
  Space,
  type FormProps,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  GithubOutlined,
  FacebookOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { LoginFormData } from "../../api/types/auth";
import { authApi } from "../../api/authApi";
import { gradients, commonStyles, componentProps } from "../../theme";

const { Title, Text, Link } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish: FormProps<LoginFormData>["onFinish"] = async (values) => {
    console.log(values);
    const loginResponse = await authApi.login(values.email, values.password);
    console.log(loginResponse);
    if (loginResponse == null) {
      return;
    }
    localStorage.setItem("tokenAccess", loginResponse.tokenAccess);
    navigate("/user-profile");
  };

  const onFinishFailed: FormProps<LoginFormData>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log(errorInfo);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: gradients.primaryBackground,
        ...commonStyles.flexCenter,
        padding: "40px 20px",
      }}
    >
      <Row
        gutter={0}
        style={{
          maxWidth: 1200,
          width: "100%",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(82, 196, 26, 0.15)",
          background: "#fff",
        }}
      >
        {/* Левая часть - форма входа */}
        <Col xs={24} md={12} lg={10}>
          <div style={{ padding: "60px 48px" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: gradients.primary,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <LockOutlined style={commonStyles.iconWhite} />
              </div>
              <Title
                level={2}
                style={{
                  background: gradients.primaryText,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 12,
                  fontWeight: 700,
                }}
              >
                Вход в аккаунт
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Если вы вдруг не зарегистрировались
                <br />
                Можете сделать это здесь{" "}
                <Link
                  onClick={() => navigate("/registration")}
                  style={{
                    color: "#52c41a",
                    fontWeight: 600,
                    borderBottom: "1px dashed #52c41a",
                  }}
                >
                  Зарегистрироваться!
                </Link>
              </Text>
            </div>

            <Form
              form={form}
              name="login"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              requiredMark={false}
            >
              <Form.Item<LoginFormData>
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
                  placeholder="Введите вашу почту"
                  prefix={<MailOutlined style={commonStyles.iconPrimary} />}
                />
              </Form.Item>

              <Form.Item<LoginFormData>
                label={
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#262626",
                      marginBottom: "8px",
                    }}
                  >
                    Password
                  </div>
                }
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите ваш пароль",
                  },
                  {
                    min: 6,
                    message: "Пароль должен содержать минимум 6 символов",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Введите ваш пароль"
                  prefix={<LockOutlined style={commonStyles.iconPrimary} />}
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px",
                }}
              >
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox style={{ color: "#595959" }}>
                    Запомнить меня
                  </Checkbox>
                </Form.Item>
                <Link
                  onClick={() => navigate("/forgot-password")}
                  style={{ color: "#52c41a", fontWeight: 500 }}
                >
                  Забыли пароль?
                </Link>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  // style={{
                  //   background: 'linear-gradient(135deg, #52c41a 0%, #fa8c16 100%)',
                  //   border: 'none',
                  //   borderRadius: '12px',
                  //   height: '52px',
                  //   fontSize: '16px',
                  //   fontWeight: 600,
                  //   boxShadow: '0 4px 15px rgba(82, 196, 26, 0.3)',
                  //   transition: 'all 0.3s'
                  // }}
                  // onMouseEnter={(e) => {
                  //   e.currentTarget.style.transform = 'translateY(-2px)';
                  //   e.currentTarget.style.boxShadow = '0 8px 25px rgba(82, 196, 26, 0.4)';
                  // }}
                  // onMouseLeave={(e) => {
                  //   e.currentTarget.style.transform = 'translateY(0)';
                  //   e.currentTarget.style.boxShadow = '0 4px 15px rgba(82, 196, 26, 0.3)';
                  // }}
                >
                  Войти <ArrowRightOutlined style={{ marginLeft: "8px" }} />
                </Button>
              </Form.Item>
            </Form>

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
                    width: 52,
                    height: 52,
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                />
                <Button
                  shape="circle"
                  icon={<GithubOutlined />}
                  size="large"
                  style={{
                    width: 52,
                    height: 52,
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                />
                <Button
                  shape="circle"
                  icon={<FacebookOutlined />}
                  size="large"
                  style={{
                    width: 52,
                    height: 52,
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                />
              </Space>

              <div style={{ textAlign: "center" }}>
                <Text type="secondary">
                  Нажимая кнопку "Войти", вы соглашаетесь с{" "}
                  <Link style={{ color: "#52c41a" }}>
                    политикой конфиденциальности
                  </Link>{" "}
                  и{" "}
                  <Link style={{ color: "#52c41a" }}>
                    условиями использования
                  </Link>
                </Text>
              </div>
            </Space>
          </div>
        </Col>

        {/* Правая часть - декоративная иллюстрация */}
        <Col xs={24} md={12} lg={14}>
          <div style={commonStyles.authSide}>
            {/* Декоративные элементы */}
            <div
              style={{
                ...commonStyles.decorativeCircle,
                top: -100,
                right: -100,
                width: 400,
                height: 400,
              }}
            />
            <div
              style={{
                ...commonStyles.decorativeCircle,
                bottom: -150,
                left: -150,
                width: 500,
                height: 500,
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
                Добро пожаловать в VoxFox!
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
                Присоединяйтесь к сообществу разработчиков, которые уже
                осваивают новые технологии и строят успешную карьеру
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
                {[
                  { emoji: "🚀", text: "Быстрый старт" },
                  { emoji: "💡", text: "Практика" },
                  { emoji: "👥", text: "Сообщество" },
                ].map((item, idx) => (
                  <div key={idx} style={commonStyles.textCenter}>
                    <div
                      style={{
                        ...commonStyles.iconBox,
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                        marginBottom: 16,
                      }}
                    >
                      <span style={{ fontSize: 40 }}>{item.emoji}</span>
                    </div>
                    <Text {...componentProps.text.whiteStrong}>
                      {item.text}
                    </Text>
                  </div>
                ))}
              </div>

              {/* Дополнительная информация */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: 24,
                  borderRadius: 16,
                  backdropFilter: "blur(10px)",
                  maxWidth: 600,
                  margin: "0 auto",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    display: "block",
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
                    }}
                  >
                    ✓
                  </span>
                  Доступ к 500+ курсам
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    display: "block",
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
                    display: "block",
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
                    }}
                  >
                    ✓
                  </span>
                  Поддержка комьюнити
                </Text>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
