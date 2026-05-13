import { ConfigProvider, Spin } from "antd";
import React, { createContext } from "react";
import { Route, Routes } from "react-router-dom";
import { API_URL, APP_VERSION, BUILD_DATE, COMMIT_HASH } from "./config";
import HomePage from "./pages/home";
import { customTheme } from "./theme";
import CourseDetailPage from "./pages/courseDetail";
import RegPage from "./pages/RegPage";
import OldLogPage from "./pages/OldLogPage";
import CourseLearningPage from "./pages/CourseLearning";
import UserProfilePage from "./pages/UserProfile";
import TeacherPage from "./pages/TeacherPage";
import ModeratorPage from "./pages/ModeratorPage";
import AdminPage from "./pages/AdminPage";
import CourseReviewPage from "./pages/CourseReview";
import TeacherProfilePage from "./pages/TeacherProfilePage";

const ThemeContext = createContext(true);

function App() {
    return (
        <ThemeContext.Provider value={true}>
            <ConfigProvider theme={customTheme}>
                <React.Suspense
                    fallback={
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                            <Spin size="large" />
                        </div>
                    }
                >
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/course/:id" element={<CourseDetailPage />} />
                        <Route path="/login" element={<OldLogPage />} />
                        <Route path="/registration" element={<RegPage />} />
                        <Route path="/course/:id/learn" element={<CourseLearningPage />} />
                        <Route path="/profile" element={<UserProfilePage />} />
                        <Route path="/teacher" element={<TeacherPage />} />
                        <Route path="/moderator" element={<ModeratorPage />} />
                        <Route path="/moderator/review/:courseId" element={<CourseReviewPage />} />
                        <Route path="/teacher/:id" element={<TeacherProfilePage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route
                            path="/debug"
                            element={
                                <>
                                    <p>API_URL: {API_URL}</p>
                                    <p>APP_VERSION: {APP_VERSION}</p>
                                    <p>COMMIT_HASH: {COMMIT_HASH}</p>
                                    <p>BUILD_DATE: {BUILD_DATE}</p>
                                </>
                            }
                        />
                    </Routes>
                </React.Suspense>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
}

export default App;
