import { Avatar, Divider, Layout, Menu, Row, Col, Spin, Tag, Typography, Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  HeartOutlined,
  BookOutlined,
  LogoutOutlined,
  EditOutlined,
  LockOutlined,
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
import { clearUserCourseData } from "../../utils/storage.ts";

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
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const { userData, fetchUser } = useUserStore();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const meData = await userApi.getMe();
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
    const userId = authStorage.getUserData<string>();
    authStorage.clearAllAuthData();
    useUserStore.getState().clear();
    if (userId) clearUserCourseData(userId);
    navigate("/");
    window.location.reload();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = await userApi.uploadAvatar(file);
    if (ok) {
      await fetchUser();
      const meData = await userApi.getMe();
      if (meData) setMe(meData);
    }
    e.target.value = "";
  };

  const handleSaveProfile = async (values: { name: string; bio?: string }) => {
    setSavingProfile(true);
    const ok = await userApi.updateProfile({ name: values.name, bio: values.bio ?? null });
    if (ok) {
      message.success("Профиль обновлён");
      await fetchUser();
      const meData = await userApi.getMe();
      if (meData) setMe(meData);
      setEditingProfile(false);
    } else {
      message.error("Ошибка при сохранении");
    }
    setSavingProfile(false);
  };

  const handleSavePassword = async (values: { oldPassword: string; newPassword: string }) => {
    setSavingPassword(true);
    const ok = await userApi.changePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
    if (ok) {
      message.success("Пароль изменён");
      passwordForm.resetFields();
      setEditingPassword(false);
    } else {
      message.error("Неверный текущий пароль или ошибка сервера");
    }
    setSavingPassword(false);
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
              {userData && (
                  <div>
                    <Text strong style={{ fontSize: 15 }}>{userData.name}</Text>
                  </div>
              )}
              {me && (
                  <Tag color="green" style={{ marginTop: 8 }}>
                    {roleLabels[me.role] ?? me.role}
                  </Tag>
              )}
              <div style={{ marginTop: 6 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Нажмите для смены фото
                </Text>
              </div>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[activeSection]}
                style={{ borderRight: 0, paddingTop: 8 }}
                items={menuItems}
                onClick={({ key }) => setActiveSection(key as Section)}
            />

            <div style={{ padding: "16px", position: "absolute", bottom: 0, width: "100%" }}>
              <Button danger block icon={<LogoutOutlined />} onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </Sider>

          <Content style={{ padding: "40px 60px", background: "#fafafa" }}>
            {activeSection === "profile" && me && (
                <div style={{ maxWidth: 600 }}>
                  <Title level={3}>Мои данные</Title>
                  <Divider />

                  {/* Просмотр / редактирование профиля */}
                  {!editingProfile ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                          <Text type="secondary">Имя</Text>
                          <div><Text strong>{me.name}</Text></div>
                        </div>
                        <div>
                          <Text type="secondary">Email</Text>
                          <div><Text strong>{me.email}</Text></div>
                        </div>
                        <div>
                          <Text type="secondary">О себе</Text>
                          <div>
                            <Text>{me.bio ?? <Text type="secondary" italic>Не указано</Text>}</Text>
                          </div>
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
                        {/*<div>*/}
                        {/*  <Text type="secondary">Email подтверждён</Text>*/}
                        {/*  <div>*/}
                        {/*    <Tag color={me.isEmailVerified ? "green" : "orange"}>*/}
                        {/*      {me.isEmailVerified ? "Да" : "Нет"}*/}
                        {/*    </Tag>*/}
                        {/*  </div>*/}
                        {/*</div>*/}
                        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                          <Button
                              icon={<EditOutlined />}
                              onClick={() => {
                                profileForm.setFieldsValue({ name: me.name, bio: me.bio ?? "" });
                                setEditingProfile(true);
                                setEditingPassword(false);
                              }}
                          >
                            Редактировать профиль
                          </Button>
                          <Button
                              icon={<LockOutlined />}
                              onClick={() => {
                                setEditingPassword(true);
                                setEditingProfile(false);
                              }}
                          >
                            Сменить пароль
                          </Button>
                        </div>
                      </div>
                  ) : (
                      /* Форма редактирования профиля */
                      <Form
                          form={profileForm}
                          layout="vertical"
                          onFinish={handleSaveProfile}
                          requiredMark={false}
                      >
                        <Form.Item
                            label="Имя"
                            name="name"
                            rules={[
                              { required: true, message: "Введите имя" },
                              { min: 2, message: "Минимум 2 символа" },
                              { max: 100, message: "Максимум 100 символов" },
                            ]}
                        >
                          <Input size="large" />
                        </Form.Item>
                        <Form.Item
                            label="О себе"
                            name="bio"
                            rules={[{ max: 500, message: "Максимум 500 символов" }]}
                        >
                          <Input.TextArea rows={4} placeholder="Расскажите о себе..." />
                        </Form.Item>
                        <div style={{ display: "flex", gap: 12 }}>
                          <Button
                              type="primary"
                              htmlType="submit"
                              loading={savingProfile}
                              style={{ background: "rgba(0,100,0,0.8)" }}
                          >
                            Сохранить
                          </Button>
                          <Button onClick={() => setEditingProfile(false)}>
                            Отмена
                          </Button>
                        </div>
                      </Form>
                  )}

                  {/* Форма смены пароля */}
                  {editingPassword && !editingProfile && (
                      <>
                        <Divider />
                        <Title level={4}>Смена пароля</Title>
                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={handleSavePassword}
                            requiredMark={false}
                        >
                          <Form.Item
                              label="Текущий пароль"
                              name="oldPassword"
                              rules={[{ required: true, message: "Введите текущий пароль" }]}
                          >
                            <Input.Password size="large" />
                          </Form.Item>
                          <Form.Item
                              label="Новый пароль"
                              name="newPassword"
                              rules={[
                                { required: true, message: "Введите новый пароль" },
                                { min: 8, message: "Минимум 8 символов" },
                              ]}
                          >
                            <Input.Password size="large" />
                          </Form.Item>
                          <Form.Item
                              label="Повторите новый пароль"
                              name="confirmPassword"
                              dependencies={["newPassword"]}
                              rules={[
                                { required: true, message: "Повторите пароль" },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value)
                                      return Promise.resolve();
                                    return Promise.reject(new Error("Пароли не совпадают"));
                                  },
                                }),
                              ]}
                          >
                            <Input.Password size="large" />
                          </Form.Item>
                          <div style={{ display: "flex", gap: 12 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={savingPassword}
                                style={{ background: "rgba(0,100,0,0.8)" }}
                            >
                              Сохранить
                            </Button>
                            <Button onClick={() => setEditingPassword(false)}>
                              Отмена
                            </Button>
                          </div>
                        </Form>
                      </>
                  )}
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
                            <Col key={e.id} xs={24} sm={12} lg={8}>
                              <CardCourse course={e.course} />
                            </Col>
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
                            <Col key={f.id} xs={24} sm={12} lg={8}>
                              <CardCourse course={f.course} isFavorite={true} />
                            </Col>
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