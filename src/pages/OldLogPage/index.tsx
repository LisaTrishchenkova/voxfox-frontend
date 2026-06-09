import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Typography,
    Space,
    Alert,
    type FormProps,
} from "antd";
import {
    MailOutlined,
    LockOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import type { LoginFormData } from "../../api/types/auth.ts";
import { authApi } from "../../api/authApi.ts";
import { gradients, commonStyles, componentProps } from "../../theme.ts";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../../stores/userStore.ts";

const { Title, Text, Link } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/";
    const [form] = Form.useForm();
    const { fetchUser } = useUserStore();
    const [loginError, setLoginError] = useState<{
        code: string;
        type: "error" | "warning";
        message: string;
        description?: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const onFinish: FormProps<LoginFormData>["onFinish"] = async (values) => {
        setLoginError(null);
        setLoading(true);

        const result = await authApi.login(values.email, values.password);

        if (!result.success) {
            const { error } = result;

            if (error.code === "ACCOUNT_DELETED") {
                setLoginError({
                    code: "ACCOUNT_DELETED",
                    type: "error",
                    message: "Аккаунт удалён",
                    description: "Ваш аккаунт был деактивирован. Если вы считаете это ошибкой — свяжитесь с администратором.",
                });
            } else if (error.code === "ACCOUNT_BLOCKED") {
                setLoginError({
                    code: "ACCOUNT_BLOCKED",
                    type: "warning",
                    message: "Аккаунт заблокирован",
                    description: error.reason
                        ? `Причина блокировки: ${error.reason}`
                        : "Ваш аккаунт заблокирован. Обратитесь к администратору для уточнения причины.",
                });
            } else if (error.code === "INVALID_CREDENTIALS") {
                setLoginError({
                    code: "INVALID_CREDENTIALS",
                    type: "error",
                    message: "Неверный email или пароль",
                });
            } else {
                setLoginError({
                    code: "UNKNOWN",
                    type: "error",
                    message: "Произошла ошибка",
                    description: "Попробуйте ещё раз или обратитесь в поддержку.",
                });
            }

            setLoading(false);
            return;
        }

        await fetchUser();
        navigate(redirect, { replace: true });
        setLoading(false);
    };

    const onFinishFailed: FormProps<LoginFormData>["onFinishFailed"] = () => {
        setLoginError(null);
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

                        {/* Блок ошибки — показывается только при проблемах с входом */}
                        {loginError && loginError.code !== 'INVALID_CREDENTIALS' && (
                            <Alert
                                type={loginError.type}
                                message={loginError.message}
                                description={loginError.description}
                                showIcon
                                style={{ marginBottom: 24 }}
                                closable
                                onClose={() => setLoginError(null)}
                            />
                        )}

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
                                    { required: true, message: "Пожалуйста, введите вашу почту" },
                                    { type: "email", message: "Пожалуйста, введите корректный email" },
                                ]}
                            >
                                <Input
                                    size="large"
                                    placeholder="Введите вашу почту"
                                    prefix={<MailOutlined style={commonStyles.iconPrimary} />}
                                    onChange={() => setLoginError(null)}
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
                                        Пароль
                                    </div>
                                }
                                name="password"
                                rules={[
                                    { required: true, message: "Пожалуйста, введите ваш пароль" },
                                    { min: 6, message: "Пароль должен содержать минимум 6 символов" },
                                ]}
                            >
                                <Input.Password
                                    size="large"
                                    placeholder="Введите ваш пароль"
                                    prefix={<LockOutlined style={commonStyles.iconPrimary} />}
                                    onChange={() => setLoginError(null)}
                                />
                            </Form.Item>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                                <div style={{ flex: 1 }}>
                                    {loginError?.code === 'INVALID_CREDENTIALS' && (
                                        <div style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 6,
                                            padding: "4px 12px",
                                            border: "1px solid #ffccc7",
                                            borderRadius: 6,
                                            background: "#fff2f0",
                                        }}>
                                            <Text type="danger" style={{ fontSize: 13 }}>
                                                Неверный email или пароль
                                            </Text>
                                        </div>
                                    )}
                                </div>
                                <Link
                                    onClick={() => navigate("/forgot-password")}
                                    style={{ color: "#52c41a", fontWeight: 500, flexShrink: 0 }}
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
                                    loading={loading}
                                >
                                    Войти <ArrowRightOutlined style={{ marginLeft: "8px" }} />
                                </Button>
                            </Form.Item>

                        </Form>

                        <Space direction="vertical" align="center" style={{ width: "100%" }} size="large">
                            <div style={{ textAlign: "center" }}>
                                <Text type="secondary">
                                    Нажимая кнопку "Войти", вы соглашаетесь с{" "}
                                    <Link style={{ color: "#52c41a" }}>политикой конфиденциальности</Link>{" "}
                                    и{" "}
                                    <Link style={{ color: "#52c41a" }}>условиями использования</Link>
                                </Text>
                            </div>
                        </Space>
                    </div>
                </Col>

                {/* Правая часть */}
                <Col xs={24} md={12} lg={14}>
                    <div style={commonStyles.authSide}>
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
                                        <Text {...componentProps.text.whiteStrong}>{item.text}</Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default LoginPage;