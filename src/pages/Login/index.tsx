import { Button, Form, Input, type FormProps } from "antd";
import type React from "react";
import type { LoginFormData } from "../../api/types/auth.ts";
import { authApi } from "../../api/authApi.ts";

const onFinish: FormProps<LoginFormData>["onFinish"] = async (values) => {
  console.log(values);
  const loginResponse = await authApi.login(values.email, values.password);
  console.log(loginResponse);
};

const onFinishFailed: FormProps<LoginFormData>["onFinishFailed"] = (
  errorInfo,
) => {
  console.log(errorInfo);
};

const Login: React.FC = () => {
  return (
    <Form
      autoComplete="off"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item<LoginFormData>
        label="Email"
        name="email"
        rules={[{ required: true, message: "Введите почту" }]}
      >
        <Input></Input>
      </Form.Item>

      <Form.Item<LoginFormData>
        label="Пароль"
        name="password"
        rules={[{ required: true, message: "Введите пароль" }]}
      >
        <Input.Password></Input.Password>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
