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
import { LoginOutlined, SearchOutlined } from "@ant-design/icons";
import type { MouseEvent } from "react";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Header = () => {
  const navigate = useNavigate();
  function redirectToLogin(event: MouseEvent<HTMLElement, MouseEvent>): void {
    event.preventDefault();
    navigate("/login");
  }

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
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    background:
                      "linear-gradient(135deg, #52c41a 0%, #fa8c16 50%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 700,
                  }}
                >
                  VoxFox
                </Title>
              </div>
            </Col>
            <Col>
              <Menu mode="horizontal" style={{ border: "none" }}>
                <Menu.Item
                  key="home"
                  style={{
                    fontWeight: 600,
                    color: "#389e0d",
                    borderBottom: "2px solid transparent",
                  }}
                  activeStyle={{
                    color: "#fa8c16",
                    borderBottom: "2px solid #fa8c16",
                  }}
                >
                  Главная
                </Menu.Item>
                <Menu.Item
                  key="projects"
                  style={{
                    fontWeight: 600,
                    color: "#389e0d",
                  }}
                >
                  Проекты
                </Menu.Item>
                <Menu.Item
                  key="learn"
                  style={{
                    fontWeight: 600,
                    color: "#389e0d",
                  }}
                >
                  Обучение
                </Menu.Item>
                <Menu.Item
                  key="community"
                  style={{
                    fontWeight: 600,
                    color: "#389e0d",
                  }}
                >
                  Сообщество
                </Menu.Item>
                <Menu.Item
                  key="about"
                  style={{
                    fontWeight: 600,
                    color: "#389e0d",
                  }}
                >
                  О нас
                </Menu.Item>
                <Menu.Item
                  key="pricing"
                  style={{
                    fontWeight: 600,
                    color: "#389e0d",
                  }}
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
              style={{
                width: "240px",
                borderRadius: "20px",
              }}
            />

            <Button icon={<LoginOutlined />} onClick={redirectToLogin}>
              Войти
            </Button>
            <Avatar></Avatar>
          </Space>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
