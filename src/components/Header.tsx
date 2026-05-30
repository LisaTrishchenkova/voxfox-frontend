import {
  LoginOutlined,
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Image,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import { useEffect, type MouseEventHandler } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { authStorage } from "../services/auth-storage.service";
import { getAvatarUrl, useUserStore } from "../stores/userStore";
import { clearUserCourseData } from "../utils/storage";
import NotificationBell from "./NotificationBell";

const { Title } = Typography;

const NavItem = ({
                   label,
                   onClick,
                   danger = false,
                 }: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) => (
    <span
        onClick={onClick}
        style={{
          fontWeight: 600,
          fontSize: 14,
          color: danger ? "#cf1322" : "#389e0d",
          cursor: "pointer",
          padding: "0 12px",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = "0.75";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = "1";
        }}
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

  const searchValue =
      location.pathname === "/"
          ? (new URLSearchParams(location.search).get("search") ?? "")
          : "";

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  <NavItem label="Главная" onClick={() => navigate("/")} />
                  <NavItem label="Сообщество" onClick={() => navigate("/community")} />
                  {isAuth && (role === "Teacher" || role === "Admin") && (
                      <NavItem label="Преподавание" onClick={() => navigate("/teacher")} />
                  )}
                  {isAuth && (role === "Moderator" || role === "Admin") && (
                      <NavItem label="Модерация" onClick={() => navigate("/moderator")} />
                  )}
                  {isAuth && role === "Admin" && (
                      <NavItem label="Администрирование" onClick={() => navigate("/admin")} danger />
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

                    <Title
                        level={4}
                        onClick={() => navigate("/profile")}
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                    >
                      {userData.name}
                    </Title>

                    <Avatar
                        src={getAvatarUrl(userData.avatarUrl)}
                        icon={!userData.avatarUrl && <UserOutlined />}
                        onClick={() => navigate("/profile")}
                        style={{
                          background: userData.avatarUrl
                              ? undefined
                              : "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
                          border: "4px solid #fff",
                          boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                    />

                    <Button
                        icon={<LogoutOutlined />}
                        type="text"
                        danger
                        onClick={handleLogout}
                    />
                  </>
              )}
            </Space>
          </Col>
        </Row>
      </header>
  );
};

export default Header;