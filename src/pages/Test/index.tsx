import { Input, Slider, Image } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import { useState } from "react";

const Test: React.FC = () => {
  const [fontSize, setFontSize] = useState(10);
  const [text, setText] = useState("text");
  const [age, setAge] = useState(10);

  return (
    <>
      <Slider value={fontSize} onChange={setFontSize}></Slider>
      <Slider value={age} onChange={setAge}></Slider>
      <Input value={text} onChange={(e) => setText(e.target.value)}></Input>
      <Image
        width={50}
        height={50}
        src="https://avatars.mds.yandex.net/get-vertis-journal/3934100/shutterstock_607458200.jpg_1727031562600/orig"
      ></Image>
      <Title style={{ fontSize: fontSize }}>{text + age}</Title>
    </>
  );
};

export default Test;
