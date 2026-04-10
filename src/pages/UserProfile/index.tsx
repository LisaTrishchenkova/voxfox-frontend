import { Avatar, Divider, Layout, Menu, Row, Spin, Tag, Typography, Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  HeartOutlined,
  BookOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import { userApi } from "../../api/userApi.ts";
import { enrollmentApi } from "../../api/enrollmentApi.ts";
import { favoriteApi } from "../../api/favoriteApi.ts";
import { authStorage } from "../../services/auth-storage.service.ts";
import type { MeResponse } from "../../api/types/user.ts";
import type { EnrollmentDto } from "../../api/types/enrollment.ts";
import type { FavoriteDto } from "../../api/types/favorite.ts";
import CardCourse from "../../components/CardCourse";
import { useUserStore, getAvatarUrl } from "../../stores/userStore.ts";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

type Section = "profile" | "courses" | "favorites";

const roleLabels: Record<string, string> = {
  Student: "Студент",
  Teacher: "Преподаватель",
  Moderator: "Модератор",
  Admin: "Администратор",
};

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [me, setMe] = useState<MeResponse | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentDto[]>([]);
  const [favorites, setFavorites] = useState<FavoriteDto[]>([]);
  const [loading, setLoading] = useState(true);

  const { userData, fetchUser, setAvatarUrl } = useUserStore();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [meData] = await Promise.all([userApi.getMe()]);
        setMe(meData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        if (activeSection === "courses") {
          const data = await enrollmentApi.getMyEnrollments();
          setEnrollments(data);
        } else if (activeSection === "favorites") {
          const data = await favoriteApi.getMyFavorites();
          setFavorites(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSectionData();
  }, [activeSection]);

  const handleLogout = () => {
    authStorage.clearAllAuthData();
    useUserStore.getState().clear();
    navigate("/");
    window.location.reload();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await userApi.uploadAvatar(file);
    if (result) {
      setAvatarUrl(result.avatarUrl);
      setMe(prev => prev ? { ...prev, avatarUrl: result.avatarUrl } : prev);
    }
    e.target.value = "";
  };

  const menuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Мои данные" },
    { key: "courses", icon: <BookOutlined />, label: "Мои курсы" },
    { key: "favorites", icon: <HeartOutlined />, label: "Избранное" },
  ];

  if (loading)
    return (
        <>
          <Header />
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
            <Spin size="large" />
          </div>
        </>
    );

  return (
      <>
        <Header />
        <Layout style={{ minHeight: "calc(100vh - 64px)" }}>
          <Sider
              width={260}
              style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}
              theme="light"
          >
            <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                style={{ display: "none" }}
                id="avatar-upload"
                onChange={handleAvatarChange}
            />

            <div
                style={{
                  padding: "32px 16px 16px",
                  textAlign: "center",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("avatar-upload")?.click()}
                title="Нажмите чтобы изменить аватар"
            >
              <Avatar
                  size={72}
                  src={getAvatarUrl(userData?.avatarUrl)}
                  icon={!userData?.avatarUrl && <UserOutlined />}
                  style={{
                    background: userData?.avatarUrl
                        ? undefined
                        : "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
                    marginBottom: 12,
                  }}
              />
              {me && (
                  <>
                    <div>
                      {userData && (
                          <Text strong style={{ fontSize: 15 }}>{userData.name}</Text>
                      )}
                    </div>
                    <Tag color="green" style={{ marginTop: 8 }}>
                      {roleLabels[me.role] ?? me.role}
                    </Tag>
                  </>
              )}
            </div>

            <Menu
                mode="inline"
                selectedKeys={[activeSection]}
                style={{ borderRight: 0, paddingTop: 8 }}
                items={menuItems}
                onClick={({ key }) => setActiveSection(key as Section)}
            />

            <div style={{ padding: "16px", position: "absolute", bottom: 0, width: "100%" }}>
              <Button
                  danger
                  block
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
              >
                Выйти
              </Button>
            </div>
          </Sider>

          <Content style={{ padding: "40px 60px", background: "#fafafa" }}>
            {activeSection === "profile" && me && (
                <div style={{ maxWidth: 600 }}>
                  <Title level={3}>Мои данные</Title>
                  <Divider />
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <Text type="secondary">Email</Text>
                      <div><Text strong>{me.email}</Text></div>
                    </div>
                    <div>
                      <Text type="secondary">Роль</Text>
                      <div>
                        <Tag color="green">{roleLabels[me.role] ?? me.role}</Tag>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary">Дата регистрации</Text>
                      <div>
                        <Text>
                          {new Date(me.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </Text>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary">Email подтверждён</Text>
                      <div>
                        <Tag color={me.isEmailVerified ? "green" : "orange"}>
                          {me.isEmailVerified ? "Да" : "Нет"}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {activeSection === "courses" && (
                <div>
                  <Title level={3}>Мои курсы</Title>
                  <Divider />
                  {enrollments.length === 0 ? (
                      <Text type="secondary">Вы ещё не записаны ни на один курс</Text>
                  ) : (
                      <Row gutter={[24, 24]}>
                        {enrollments.map(e => e.course && (
                            <CardCourse
                                key={e.id}
                                course={e.course}
                            />
                        ))}
                      </Row>
                  )}
                </div>
            )}

            {activeSection === "favorites" && (
                <div>
                  <Title level={3}>Избранное</Title>
                  <Divider />
                  {favorites.length === 0 ? (
                      <Text type="secondary">Вы ещё не добавили курсы в избранное</Text>
                  ) : (
                      <Row gutter={[24, 24]}>
                        {favorites.map(f => f.course && (
                            <CardCourse
                                key={f.id}
                                course={f.course}
                                isFavorite={true}
                            />
                        ))}
                      </Row>
                  )}
                </div>
            )}
          </Content>
        </Layout>
        <Footer />
      </>
  );
};

export default UserProfilePage;