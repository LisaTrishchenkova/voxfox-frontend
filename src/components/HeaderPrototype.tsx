import { Row, Col, Menu, Space, Typography } from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const HeaderPrototype = () => {
  return (
    <header
      style={{
        background: "#fff",
        padding: "0 24px",
        borderBottom: "1px solid #ddd",
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
                <div
                  style={{
                    height: "40px",
                    width: "40px",
                    background: "#f0f0f0",
                    border: "1px solid #ddd",
                  }}
                />
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    color: "#333",
                    fontWeight: 600,
                  }}
                >
                  VoxFox
                </Title>
              </div>
            </Col>
            <Col>
              <Menu
                mode="horizontal"
                style={{ border: "none", background: "transparent" }}
              >
                <Menu.Item key="home">Главная</Menu.Item>
                <Menu.Item key="projects">Проекты</Menu.Item>
                <Menu.Item key="learn">Обучение</Menu.Item>
                <Menu.Item key="community">Сообщество</Menu.Item>
                <Menu.Item key="about">О нас</Menu.Item>
                <Menu.Item key="pricing">Цены</Menu.Item>
              </Menu>
            </Col>
          </Row>
        </Col>
        <Col>
          <Space size="middle" align="center">
            <div
              style={{
                width: "240px",
                height: "32px",
                background: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
              }}
            >
              <SearchOutlined style={{ color: "#999", marginRight: "8px" }} />
              <span style={{ color: "#999" }}>Поиск курсов...</span>
            </div>

            <div
              style={{
                padding: "8px 16px",
                background: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <LoginOutlined />
              <span>Войти</span>
            </div>
            <div
              style={{
                padding: "8px 16px",
                background: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 500,
              }}
            >
              <UserAddOutlined />
              <span>Зарегистрироваться</span>
            </div>
          </Space>
        </Col>
      </Row>
    </header>
  );
};

export default HeaderPrototype;
