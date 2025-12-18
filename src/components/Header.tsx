import {
  Row,
  Col,
  Menu,
  Input,
  Button,
  Space,
  Typography,
  Image,
  Avatar,
} from "antd";
import { LoginOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState, type MouseEventHandler } from "react";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import { authStorage } from "../services/auth-storage.service";
import type { UserResponse } from "../api/types/user";
import { userApi } from "../api/userApi";

const { Title } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const isAuth = authStorage.isAuthenticated();
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const redirectToLogin: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    navigate("/login");
  };

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
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Image
                  src={logo}
                  alt="VoxFox"
                  preview={false}
                  style={{
                    height: "40px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                {/* <Title
                  level={3}
                  style={{
                    margin: 0,
                    background: gradients.primaryText,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 700,
                  }}
                >
                  VoxFox
                </Title> */}
              </div>
            </Col>
            <Col>
              <Menu mode="horizontal" style={{ border: "none" }}>
                <Menu.Item
                  key="home"
                  style={{ fontWeight: 600, color: "#389e0d" }}
                  // activeStyle={{
                  //   color: "#fa8c16",
                  //   borderBottom: "2px solid #fa8c16",
                  // }}
                  onClick={() => navigate("/")}
                >
                  Главная
                </Menu.Item>
                {isAuth && (
                  <Menu.Item
                    key="projects"
                    style={{ fontWeight: 600, color: "#389e0d" }}
                  >
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
              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              //   if (!userData) return;

              //   setUserData({
              //     ...userData,
              //     name: e.target.value,
              //   });
              // }}
              prefix={<SearchOutlined style={{ color: "#52c41a" }} />}
              style={{ width: 240, borderRadius: 20 }}
            />
            {!isAuth && (
              <Button icon={<LoginOutlined />} onClick={redirectToLogin}>
                Войти
              </Button>
            )}
            {userData && (
              <>
                <Title
                  level={4}
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {userData.name}
                </Title>
                <Avatar size={"default"} icon={<UserOutlined />} />{" "}
              </>
            )}
          </Space>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
