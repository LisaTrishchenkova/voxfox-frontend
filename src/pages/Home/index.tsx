import { AlipayCircleOutlined, FullscreenOutlined } from "@ant-design/icons";
import { Button, Flex, Spin } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";

const Home: React.FC = () => {
  // const navigate = useNavigate();

  return (
    <Flex orientation="vertical">
      <Title>ksiwqhsydiwqshiq</Title>
      <Button size="large">dfgdse</Button>
      <Button size="small" type="primary" >
        <FullscreenOutlined />
        dfgdse
        <FullscreenOutlined />
      </Button>
      <Spin></Spin>
      <FullscreenOutlined />
      <AlipayCircleOutlined />
    </Flex>
  );
};

export default Home;
