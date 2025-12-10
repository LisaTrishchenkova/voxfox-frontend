import { ConfigProvider, Spin } from "antd";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

const Home = React.lazy(() => import("./pages/Home"));

function App() {
  return (
    <ConfigProvider>
      {/* <MainLayout> */}
      <React.Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Spin size="large" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />

          {/* <Route path="/about" element={<About />} />
            <Route path="/users" element={<Users />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </React.Suspense>
      {/* </MainLayout> */}
    </ConfigProvider>
  );
}

export default App;
