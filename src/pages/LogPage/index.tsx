import { Button, Card, Col, Form, Row, Typography } from "antd";
import type React from "react";
import type { LoginFormData } from "../../api/types/auth";
import Input from "antd/es/input/Input";

const { Text, Title } = Typography;
const LogPage: React.FC = () => {
  return (
    <Card>
      <Row>
        <Col span={12} offset={6}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
          >
            <Title level={4}>Форма для авторизации</Title>
            <Form.Item<LoginFormData>
              label="Почта"
              name="email"
              rules={[
                { required: true, message: "Пожалуйста введите вашу почту!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<LoginFormData>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Пожалуйста введите ваш пароль!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label={null}>
              <Row>
                <Col span={24}>
                  <Text>
                    Если вы вдруг не зарегистрировались можете сделать это тут
                  </Text>
                  <Button type="link">зарегистрироваться</Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Войти
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};
export default LogPage;
