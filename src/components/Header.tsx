import { LoginOutlined, LogoutOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
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
import { useEffect, type MouseEventHandler, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { authStorage } from "../services/auth-storage.service";
import { useUserStore, getAvatarUrl } from "../stores/userStore";

const { Title } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = authStorage.isAuthenticated();
  const { userData, fetchUser } = useUserStore();
  const [searchValue, setSearchValue] = useState("");

  // Синхронизация поисковой строки с URL-параметром ?search= на главной странице
  useEffect(() => {
    if (location.pathname === "/") {
      const params = new URLSearchParams(location.search);
      const searchParam = params.get("search") || "";
      setSearchValue(searchParam);
    } else {
      setSearchValue(""); // очищаем на других страницах
    }
  }, [location]);

  const redirectToLogin: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    navigate("/login");
  };

  const handleLogout = () => {
    const userId = authStorage.getUserData<string>();
    authStorage.clearAllAuthData();
    useUserStore.getState().clear();
    if (userId) {
      const keysToDelete: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`voxfox_${userId}_`)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(k => localStorage.removeItem(k));
    }
    navigate("/");
    window.location.reload();
  };

  const handleHeaderSearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed) {
      navigate(`/?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
      <header
          style={{
            background: "#fff",
            padding: "0 24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
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
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Image
                      src={logo}
                      alt="VoxFox"
                      preview={false}
                      style={{ height: "40px", width: "auto", objectFit: "contain" }}
                  />
                </div>
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
                  {isAuth && (
                      <Menu.Item key="projects" style={{ fontWeight: 600, color: "#389e0d" }}>
                        Проекты
                      </Menu.Item>
                  )}
                  {isAuth && (
                      <Menu.Item
                          key="learn"
                          style={{ fontWeight: 600, color: "#389e0d" }}
                          onClick={() => navigate("/cource")}
                      >
                        Преподавание
                      </Menu.Item>
                  )}
                  <Menu.Item key="community" style={{ fontWeight: 600, color: "#389e0d" }}>
                    Сообщество
                  </Menu.Item>
                  <Menu.Item key="about" style={{ fontWeight: 600, color: "#389e0d" }}>
                    О нас
                  </Menu.Item>
                  <Menu.Item key="pricing" style={{ fontWeight: 600, color: "#389e0d" }}>
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
                  onChange={(e) => setSearchValue(e.target.value)}
                  onSearch={handleHeaderSearch}
              />
              {!isAuth && (
                  <Button icon={<LoginOutlined />} onClick={redirectToLogin}>
                    Войти
                  </Button>
              )}
              {userData && (
                  <>
                    <Title
                        onClick={() => navigate("/profile")}
                        level={4}
                        style={{ margin: 0, fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                    >
                      {userData.name}
                    </Title>
                    <Avatar
                        src={getAvatarUrl(userData.avatarUrl)}
                        icon={!userData.avatarUrl && <UserOutlined />}
                        style={{
                          background: userData.avatarUrl
                              ? undefined
                              : "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
                          border: "4px solid #fff",
                          boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate("/profile")}
                        size="default"
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