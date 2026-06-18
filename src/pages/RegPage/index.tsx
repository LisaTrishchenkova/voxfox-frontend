// src/pages/RegistrationPage.tsx
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Divider,
    Typography,
    Alert,
    type FormProps,
} from "antd";
import {
    MailOutlined,
    UserOutlined,
    LockOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useUserStore } from "../../stores/userStore.ts";
import type { RegistrationFormData } from "../../api/types/auth.ts";
import { authApi } from "../../api/authApi.ts";
import { gradients, commonStyles, componentProps } from "../../theme.ts";
import { Select } from "antd";

const { Title, Text, Link } = Typography;

const RegPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { fetchUser } = useUserStore();
    const [regError, setRegError] = useState<string | null>(null);

    const onFinish: FormProps<RegistrationFormData>["onFinish"] = async (values) => {
        setRegError(null);
        setLoading(true);

        const result = await authApi.registration(
            values.email,
            values.name,
            values.password,
            values.role,
        );

        setLoading(false);

        if (result.success) {
            const loginResult = await authApi.login(values.email, values.password);
            if (loginResult.success) {
                await fetchUser();
                navigate("/");
            } else {
                navigate("/login");
            }
            return;
        }

        const { error } = result;
        if (error.code === "EMAIL_TAKEN") {
            setRegError("Пользователь с таким email уже существует");
        } else if (error.code === "ACCOUNT_DELETED") {
            setRegError("Аккаунт с этим email был удалён. Обратитесь к администратору.");
        } else {
            setRegError("Произошла ошибка при регистрации. Попробуйте ещё раз.");
        }
    };

    const onFinishFailed: FormProps<RegistrationFormData>["onFinishFailed"] = () => {
        setRegError(null);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: gradients.primaryBackground,
            ...commonStyles.flexCenter,
            padding: "40px 20px",
        }}>
            <Row gutter={0} style={{
                maxWidth: 1200,
                width: "100%",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(82, 196, 26, 0.15)",
                background: "#fff",
            }}>
                {/* Левая часть - форма регистрации */}
                <Col xs={24} md={12} lg={10}>
                    <div style={{ padding: "60px 48px" }}>
                        <div style={{ textAlign: "center", marginBottom: 40 }}>
                            <div style={{
                                width: 64, height: 64,
                                background: gradients.primary,
                                borderRadius: 16,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 20px",
                            }}>
                                <UserOutlined style={{ fontSize: 28, color: "#fff" }} />
                            </div>
                            <Title level={2} style={{
                                background: gradients.primaryText,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                marginBottom: 12,
                                fontWeight: 700,
                            }}>
                                Регистрация
                            </Title>
                            <Text type="secondary" style={{ fontSize: 16 }}>
                                Если вы уже регистрировали аккаунт
                                <br />
                                Перейдите сюда{" "}
                                <Link onClick={() => navigate("/login")} style={{ color: "#52c41a", fontWeight: 600, borderBottom: "1px dashed #52c41a" }}>
                                    Войти в профиль!
                                </Link>
                            </Text>
                        </div>

                        {regError && (
                            <Alert type="error" message={regError} showIcon style={{ marginBottom: 24 }}
                                   closable onClose={() => setRegError(null)} />
                        )}

                        <Form form={form} name="register" layout="vertical"
                              onFinish={onFinish} onFinishFailed={onFinishFailed}
                              autoComplete="off" requiredMark={false}>
                            <Form.Item<RegistrationFormData>
                                label={<div style={{ fontSize: "16px", fontWeight: 600, color: "#262626", marginBottom: "8px" }}>Email</div>}
                                name="email"
                                rules={[
                                    { required: true, message: "Пожалуйста, введите вашу почту" },
                                    { type: "email", message: "Пожалуйста, введите корректный email" },
                                ]}
                            >
                                <Input size="large" placeholder="Введите свою почту"
                                       prefix={<MailOutlined style={commonStyles.iconPrimary} />}
                                       onChange={() => setRegError(null)} />
                            </Form.Item>

                            <Divider />

                            <Form.Item<RegistrationFormData>
                                label={<div style={commonStyles.formLabel}>Введите ваш ник</div>}
                                name="name"
                                rules={[
                                    { required: true, message: "Пожалуйста, введите ваш ник" },
                                    { min: 3, message: "Ник должен содержать минимум 3 символа" },
                                    { max: 20, message: "Ник должен содержать максимум 20 символов" },
                                ]}
                            >
                                <Input size="large" placeholder="Придумайте уникальный ник"
                                       prefix={<UserOutlined style={commonStyles.iconPrimary} />} />
                            </Form.Item>

                            <Form.Item<RegistrationFormData>
                                label={<div style={commonStyles.formLabel}>Пароль</div>}
                                name="password"
                                rules={[
                                    { required: true, message: "Пожалуйста, введите пароль" },
                                    { min: 8, message: "Пароль должен содержать минимум 8 символов" },
                                    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: "Пароль должен содержать заглавные, строчные буквы и цифры" },
                                ]}
                            >
                                <Input.Password size="large" placeholder="Придумайте надежный пароль"
                                                prefix={<LockOutlined style={commonStyles.iconPrimary} />} />
                            </Form.Item>

                            <Form.Item<RegistrationFormData>
                                label={<div style={commonStyles.formLabel}>Я регистрируюсь как</div>}
                                name="role"
                                rules={[{ required: true, message: "Пожалуйста, выберите роль" }]}
                            >
                                <Select size="large" placeholder="Выберите роль">
                                    <Select.Option value="Student">Студент</Select.Option>
                                    <Select.Option value="Teacher">Преподаватель</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item style={commonStyles.formItemMargin}>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Зарегистрироваться <ArrowRightOutlined style={{ marginLeft: "8px" }} />
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={commonStyles.formTextCenter}>
                            <Text {...componentProps.text.secondary}>
                                Нажимая кнопку "Зарегистрироваться", вы соглашаетесь с{" "}
                                <RouterLink to="/legal/privacy" style={{ color: "#52c41a" }}>
                                    политикой конфиденциальности
                                </RouterLink>{" "}
                                и{" "}
                                <RouterLink to="/legal/terms" style={{ color: "#52c41a" }}>
                                    условиями использования
                                </RouterLink>
                            </Text>
                        </div>
                    </div>
                </Col>

                {/* Правая часть */}
                <Col xs={24} md={12} lg={14}>
                    <div style={commonStyles.authSide}>
                        <div style={{ ...commonStyles.decorativeCircle, top: -100, right: -100, width: 400, height: 400 }} />
                        <div style={{ ...commonStyles.decorativeCircleLight, bottom: -150, left: -150, width: 500, height: 500 }} />
                        <div style={{ position: "relative", zIndex: 2, textAlign: "center", color: "#fff" }}>
                            <Title level={1} style={{ color: "#fff", marginBottom: "24px", fontSize: "48px", fontWeight: 800 }}>
                                Начните свой путь!
                            </Title>
                            <div style={{ fontSize: "20px", lineHeight: 1.6, marginBottom: "48px", maxWidth: "600px", opacity: 0.9 }}>
                                Присоединяйтесь к сообществу разработчиков и получите доступ ко всем возможностям VoxFox
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap", marginBottom: "60px" }}>
                                {[
                                    { emoji: "🎓", text: "500+ курсов" },
                                    { emoji: "🏆", text: "Сертификаты" },
                                    { emoji: "🤝", text: "Менторство" },
                                ].map((item, idx) => (
                                    <div key={idx} style={commonStyles.textCenter}>
                                        <div style={commonStyles.iconBoxBlur}>
                                            <span style={{ fontSize: 40 }}>{item.emoji}</span>
                                        </div>
                                        <Text {...componentProps.text.whiteStrong}>{item.text}</Text>
                                    </div>
                                ))}
                            </div>
                            <div style={{
                                background: "rgba(255, 255, 255, 0.1)", padding: 32, borderRadius: 20,
                                backdropFilter: "blur(10px)", maxWidth: 700, margin: "0 auto", textAlign: "left",
                            }}>
                                <Title level={4} style={{ color: "#fff", marginBottom: "20px" }}>Преимущества регистрации:</Title>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                                    {[
                                        ["Персональный план обучения", "Практические проекты", "Поддержка сообщества"],
                                        ["Прогресс обучения", "Сертификаты об окончании", "Карьерные возможности"],
                                    ].map((col, ci) => (
                                        <div key={ci} style={{ flex: "1", minWidth: "250px" }}>
                                            {col.map((item) => (
                                                <Text key={item} style={{ color: "#fff", fontSize: "16px", display: "flex", alignItems: "center", marginBottom: "12px" }}>
                                                    <span style={{ display: "inline-block", width: "24px", height: "24px", background: "#fff", borderRadius: "50%", color: "#52c41a", fontWeight: "bold", lineHeight: "24px", marginRight: "12px", flexShrink: 0, textAlign: "center" }}>✓</span>
                                                    {item}
                                                </Text>
                                            ))}
                                        </div>
                                    ))}
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