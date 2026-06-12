import {
    LoginOutlined,
    LogoutOutlined,
    SearchOutlined,
    UserOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Col,
    Image,
    Input,
    Row,
    Space,
    Tooltip,
    Typography,
} from "antd";
import { useEffect, useState, type MouseEventHandler } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { balanceApi } from "../api/balanceApi";
import { authStorage } from "../services/auth-storage.service";
import { getAvatarUrl, useUserStore } from "../stores/userStore";
import { clearUserCourseData } from "../utils/storage";
import NotificationBell from "./NotificationBell";
import TopUpModal from "./TopUpModal";

const { Title, Text } = Typography;

const NavItem = ({
                     label,
                     onClick,
                     danger = false,
                     active = false,
                 }: {
    label: string;
    onClick: () => void;
    danger?: boolean;
    active?: boolean;
}) => (
    <span
        onClick={onClick}
        style={{
            fontWeight: 600,
            fontSize: 14,
            color: danger ? "#cf1322" : active ? "#237804" : "#389e0d",
            cursor: "pointer",
            padding: "0 12px",
            whiteSpace: "nowrap",
            userSelect: "none",
            borderBottom: active ? "2px solid #52c41a" : "2px solid transparent",
            paddingBottom: 4,
            transition: "color 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
    >
        {label}
    </span>
);

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuth = authStorage.isAuthenticated();
    const { userData, fetchUser } = useUserStore();

    const role = userData?.role ?? "";
    const path = location.pathname;

    const [balance, setBalance] = useState<number | null>(null);
    const [topUpOpen, setTopUpOpen] = useState(false);

    const searchValue =
        path === "/" ? (new URLSearchParams(location.search).get("search") ?? "") : "";

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (isAuth) {
            balanceApi.getBalance().then((data) => {
                if (data) setBalance(data.balance);
            });
        }
    }, [isAuth]);

    const redirectToLogin: MouseEventHandler<HTMLElement> = (e) => {
        e.preventDefault();
        navigate("/login");
    };

    const handleLogout = () => {
        const userId = authStorage.getUserData<string>();
        authStorage.clearAllAuthData();
        useUserStore.getState().clear();
        if (userId) clearUserCourseData(userId);
        navigate("/");
        window.location.reload();
    };

    const handleHeaderSearch = (value: string) => {
        const trimmed = value.trim();
        navigate(trimmed ? `/?search=${encodeURIComponent(trimmed)}` : "/");
    };

    return (
        <>
            <header
                style={{
                    background: "#fff",
                    padding: "0 24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderBottom: "1px solid #e8e8e8",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Row justify="space-between" align="middle" style={{ width: "100%" }}>
                    <Col>
                        <Row align="middle" gutter={8}>
                            <Col>
                                <Image
                                    src={logo}
                                    alt="VoxFox"
                                    preview={false}
                                    style={{ height: 40, width: "auto", objectFit: "contain" }}
                                />
                            </Col>
                            <Col>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <NavItem label="Главная" onClick={() => navigate("/")} active={path === "/"} />
                                    <NavItem label="Сообщество" onClick={() => navigate("/community")} active={path === "/community"} />
                                    {isAuth && (role === "Teacher" || role === "Admin") && (
                                        <NavItem label="Преподавание" onClick={() => navigate("/teacher")} active={path === "/teacher"} />
                                    )}
                                    {isAuth && (role === "Moderator" || role === "Admin") && (
                                        <NavItem label="Модерация" onClick={() => navigate("/moderator")} active={path === "/moderator" || path.startsWith("/moderator/")} />
                                    )}
                                    {isAuth && role === "Admin" && (
                                        <NavItem label="Администрирование" onClick={() => navigate("/admin")} active={path === "/admin"} danger />
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Col>

                    <Col>
                        <Space size="middle" align="center">
                            <Input.Search
                                key={location.pathname}
                                placeholder="Поиск курсов..."
                                allowClear
                                prefix={<SearchOutlined style={{ color: "#52c41a" }} />}
                                style={{ width: 240, borderRadius: 20 }}
                                defaultValue={searchValue}
                                onSearch={handleHeaderSearch}
                            />

                            {!isAuth && (
                                <Button icon={<LoginOutlined />} onClick={redirectToLogin}>
                                    Войти
                                </Button>
                            )}

                            {userData && (
                                <>
                                    <NotificationBell />

                                    {/* Баланс */}
                                    {balance !== null && (
                                        <Tooltip title="Пополнить баланс">
                                            <div
                                                onClick={() => setTopUpOpen(true)}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                    background: "rgba(0,100,0,0.06)",
                                                    border: "1px solid rgba(0,100,0,0.15)",
                                                    borderRadius: 8,
                                                    padding: "3px 12px",
                                                    lineHeight: 1.3,
                                                    transition: "background 0.2s",
                                                }}
                                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,100,0,0.12)"; }}
                                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,100,0,0.06)"; }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <WalletOutlined style={{ color: "rgba(0,100,0,0.6)", fontSize: 11 }} />
                                                    <Text style={{ fontSize: 10, color: "rgba(0,100,0,0.6)", whiteSpace: "nowrap" }}>
                                                        Ваш баланс
                                                    </Text>
                                                </div>
                                                <Text strong style={{ fontSize: 13, color: "rgba(0,100,0,0.85)", whiteSpace: "nowrap" }}>
                                                    {balance.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                                                </Text>
                                            </div>
                                        </Tooltip>
                                    )}

                                    <Title
                                        level={4}
                                        onClick={() => navigate("/profile")}
                                        style={{
                                            margin: 0,
                                            fontSize: 14,
                                            fontWeight: path === "/profile" ? 700 : 500,
                                            cursor: "pointer",
                                            whiteSpace: "nowrap",
                                            color: path === "/profile" ? "#237804" : undefined,
                                        }}
                                    >
                                        {userData.name}
                                    </Title>

                                    <Avatar
                                        src={getAvatarUrl(userData.avatarUrl)}
                                        icon={!userData.avatarUrl && <UserOutlined />}
                                        onClick={() => navigate("/profile")}
                                        style={{
                                            background: userData.avatarUrl ? undefined : "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
                                            border: path === "/profile" ? "4px solid #52c41a" : "4px solid #fff",
                                            boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
                                            cursor: "pointer",
                                            flexShrink: 0,
                                        }}
                                    />

                                    <Button icon={<LogoutOutlined />} type="text" danger onClick={handleLogout} />
                                </>
                            )}
                        </Space>
                    </Col>
                </Row>
            </header>

            <TopUpModal
                open={topUpOpen}
                currentBalance={balance ?? 0}
                onClose={() => setTopUpOpen(false)}
                onSuccess={(newBalance) => setBalance(newBalance)}
            />
        </>
    );
};

export default Header;