import { ConfigProvider, Spin } from "antd";
import React, { createContext } from "react";
import { Route, Routes } from "react-router-dom";
// import Course from "./pages/OLD/Cource";
// import CourseCreationPage from "./pages/OLD/CourseCreationPage/index-old";
// import CourseLessonsPage from "./pages/OLD/CourseLessonsPage";
// import HomePage from "./pages/OLD/HomePage";
// import LogPage from "./pages/OLD/LogPage";
// import RegPage from "./pages/OLD/RegPage";
// import Test from "./pages/OLD/Test";
// import UserProfile from "./pages/OLD/UserProfile";
import { customTheme } from "./theme";
import HomePage from "./pages/home";
import Course from "./pages/OLD/Cource";
import Home from "./pages/OLD/Home";
import HomePage1 from "./pages/OLD/HomePage";
import CardDetailPage from "./pages/cardDetail";

// const Home = React.lazy(() => import("./pages/Home"));

const ThemeContext = createContext(true);

function App() {
  return (
    <ThemeContext.Provider value={true}>
      <ConfigProvider theme={customTheme}>
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
            <Route path="/" element={<HomePage />} />
            <Route path="/course/:id" element={<CardDetailPage />} />
            {/* <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/login" element={<LogPage />} />
          <Route path="/registration" element={<RegPage />} />
          <Route path="/cource-creating" element={<CourseCreationPage />} />
          <Route path="/cource" element={<Course />} />
          <Route path="/cource-lesson" element={<CourseLessonsPage />} />
          <Route path="/test" element={<Test />} /> */}
            {/* <Route path="/about" element={<About />} />
            <Route path="/users" element={<Users />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </React.Suspense>
        {/* </MainLayout> */}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export default App;
