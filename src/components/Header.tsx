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
  Menu,
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
          }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Row align="middle" gutter={24}>
              <Col>
                <Image
                    src={logo}
                    alt="VoxFox"
                    preview={false}
                    style={{ height: 40, width: "auto", objectFit: "contain" }}
                />
              </Col>
              <Col>
                <Menu mode="horizontal" style={{ border: "none" }}>
                  <Menu.Item
                      key="home"
                      style={{ fontWeight: 600, color: "#389e0d" }}
                      onClick={() => navigate("/")}
                  >
                    Главная
                  </Menu.Item>

                  {/* Преподавание — только для Teacher и Admin */}
                  {isAuth && (role === "Teacher" || role === "Admin") && (
                      <Menu.Item
                          key="teacher"
                          style={{ fontWeight: 600, color: "#389e0d" }}
                          onClick={() => navigate("/teacher")}
                      >
                        Преподавание
                      </Menu.Item>
                  )}

                  {/* Модерация — только для Moderator и Admin */}
                  {isAuth && (role === "Moderator" || role === "Admin") && (
                      <Menu.Item
                          key="moderator"
                          style={{ fontWeight: 600, color: "#389e0d" }}
                          onClick={() => navigate("/moderator")}
                      >
                        Модерация
                      </Menu.Item>
                  )}

                  {/* Администрирование — только для Admin */}
                  {isAuth && role === "Admin" && (
                      <Menu.Item
                          key="admin"
                          style={{ fontWeight: 600, color: "#cf1322" }}
                          onClick={() => navigate("/admin")}
                      >
                        Администрирование
                      </Menu.Item>
                  )}

                  <Menu.Item
                      key="community"
                      style={{ fontWeight: 600, color: "#389e0d" }}
                  >
                    Сообщество
                  </Menu.Item>
                  <Menu.Item
                      key="about"
                      style={{ fontWeight: 600, color: "#389e0d" }}
                  >
                    О нас
                  </Menu.Item>
                  <Menu.Item
                      key="pricing"
                      style={{ fontWeight: 600, color: "#389e0d" }}
                  >
                    Цены
                  </Menu.Item>
                </Menu>
              </Col>
            </Row>
          </Col>

          <Col>
            <Space size="middle" align="center">
              <Input.Search
                  placeholder="Поиск курсов..."
                  allowClear
                  prefix={<SearchOutlined style={{ color: "#52c41a" }} />}
                  style={{ width: 240, borderRadius: 20 }}
                  value={searchValue}
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