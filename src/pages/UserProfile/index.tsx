import {
  Avatar, Button, Col, Divider, Empty, Form, Input,
  Layout, Menu, Modal, Row, Spin, Tag, Typography, message,
} from "antd";
import {
  BookOutlined, EditOutlined, HeartOutlined, LockOutlined,
  LogoutOutlined, SafetyCertificateOutlined, TrophyOutlined,
  UserOutlined, WalletOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import { userApi } from "../../api/userApi.ts";
import { enrollmentApi } from "../../api/enrollmentApi.ts";
import { favoriteApi } from "../../api/favoriteApi.ts";
import { certificateApi } from "../../api/certificateApi.ts";
import { balanceApi } from "../../api/balanceApi.ts";
import { achievementApi } from "../../api/achievementApi.ts";
import type { AchievementDto } from "../../api/achievementApi.ts";
import { authStorage } from "../../services/auth-storage.service.ts";
import type { MeResponse } from "../../api/types/user.ts";
import type { EnrollmentDto } from "../../api/types/enrollment.ts";
import type { FavoriteDto } from "../../api/types/favorite.ts";
import type { CertificateDto } from "../../api/types/certificate.ts";
import CardCourse from "../../components/CardCourse";
import { getAvatarUrl, useUserStore } from "../../stores/userStore.ts";
import CertificateView from "../../components/CertificateView.tsx";
import TransactionsTab from "../../components/TransactionsTab.tsx";
import TopUpModal from "../../components/TopUpModal.tsx";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

type Section = "profile" | "courses" | "favorites" | "certificates" | "wallet" | "achievements";

const roleLabels: Record<string, string> = {
  Student: "Студент",
  Teacher: "Преподаватель",
  Moderator: "Модератор",
  Admin: "Администратор",
};

// ─── CertificateCard ──────────────────────────────────────────
const CertificateCard = ({ cert }: { cert: CertificateDto }) => {
  const [downloading, setDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await certificateApi.downloadPdf(cert.id, cert.courseTitle);
    setDownloading(false);
  };

  return (
      <>
        <div
            onClick={() => setPreviewOpen(true)}
            style={{ borderRadius: 12, border: "1px solid #d9f7be", background: "linear-gradient(135deg, #f6ffed 0%, #fff 100%)", padding: 20, cursor: "pointer", transition: "box-shadow 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(82,196,26,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <SafetyCertificateOutlined style={{ fontSize: 36, color: "#52c41a", flexShrink: 0, marginTop: 4 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>{cert.courseTitle}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Выдан: {new Date(cert.issuedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
              </Text>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <Button size="small" type="primary" loading={downloading} style={{ background: "rgba(0,100,0,0.8)" }}
                        onClick={(e) => { e.stopPropagation(); handleDownload(); }}>
                  Скачать PDF
                </Button>
                <Button size="small" onClick={(e) => { e.stopPropagation(); setPreviewOpen(true); }}>Просмотр</Button>
              </div>
            </div>
          </div>
        </div>
        <Modal open={previewOpen} onCancel={() => setPreviewOpen(false)} footer={null} width={580} centered styles={{ body: { padding: 24 } }}>
          <CertificateView certificate={cert} onDownload={handleDownload} downloading={downloading} />
        </Modal>
      </>
  );
};

// ─── AchievementsTab ──────────────────────────────────────────
const AchievementsTab = () => {
  const [achievements, setAchievements] = useState<AchievementDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    achievementApi.getMyAchievements().then((data) => {
      setAchievements(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: "center", paddingTop: 40 }}><Spin /></div>;

  const earned = achievements.filter((a) => a.isEarned);
  const locked = achievements.filter((a) => !a.isEarned);

  return (
      <div>
        <Title level={3}>Достижения</Title>
        <Divider />

        {/* Прогресс */}
        <div style={{ marginBottom: 28 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Получено <Text strong style={{ color: "rgba(0,100,0,0.85)" }}>{earned.length}</Text> из <Text strong>{achievements.length}</Text>
          </Text>
          <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: "#f0f0f0", overflow: "hidden", maxWidth: 300 }}>
            <div style={{ height: "100%", borderRadius: 3, background: "rgba(0,100,0,0.75)", width: achievements.length > 0 ? `${Math.round(earned.length / achievements.length * 100)}%` : "0%", transition: "width 0.4s" }} />
          </div>
        </div>

        {/* Полученные */}
        {earned.length > 0 && (
            <>
              <Text strong style={{ fontSize: 13, display: "block", marginBottom: 14 }}>Получены</Text>
              <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                {earned.map((a) => (
                    <Col key={a.code} xs={24} sm={12} md={8} lg={6}>
                      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #d9f7be", padding: "20px 16px", textAlign: "center", height: "100%" }}>
                        <div style={{ fontSize: 40, marginBottom: 10, lineHeight: 1 }}>{a.icon}</div>
                        <Text strong style={{ fontSize: 14, display: "block", marginBottom: 4 }}>{a.title}</Text>
                        <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>{a.description}</Text>
                        {a.earnedAt && (
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {new Date(a.earnedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}
                            </Text>
                        )}
                      </div>
                    </Col>
                ))}
              </Row>
            </>
        )}

        {/* Заблокированные */}
        {locked.length > 0 && (
            <>
              <Text strong style={{ fontSize: 13, display: "block", marginBottom: 14, color: "#999" }}>Ещё не получены</Text>
              <Row gutter={[16, 16]}>
                {locked.map((a) => (
                    <Col key={a.code} xs={24} sm={12} md={8} lg={6}>
                      <div style={{ background: "#fafafa", borderRadius: 12, border: "1px solid #f0f0f0", padding: "20px 16px", textAlign: "center", height: "100%", opacity: 0.6 }}>
                        <div style={{ fontSize: 40, marginBottom: 10, lineHeight: 1, filter: "grayscale(1)" }}>{a.icon}</div>
                        <Text strong style={{ fontSize: 14, display: "block", marginBottom: 4, color: "#999" }}>{a.title}</Text>
                        <Text type="secondary" style={{ fontSize: 12, display: "block" }}>{a.description}</Text>
                      </div>
                    </Col>
                ))}
              </Row>
            </>
        )}

        {achievements.length === 0 && (
            <Empty description="Не удалось загрузить достижения" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
  );
};

// ─── UserProfilePage ──────────────────────────────────────────
const UserProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabFromUrl = new URLSearchParams(location.search).get("tab") as Section | null;
  const activeSection: Section = tabFromUrl ?? "profile";

  const [me, setMe] = useState<MeResponse | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentDto[]>([]);
  const [favorites, setFavorites] = useState<FavoriteDto[]>([]);
  const [certificates, setCertificates] = useState<CertificateDto[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [topUpOpen, setTopUpOpen] = useState(false);

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
        const [meData, balanceData] = await Promise.all([userApi.getMe(), balanceApi.getBalance()]);
        if (meData) setMe(meData);
        if (balanceData) setBalance(balanceData.balance);
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
          setEnrollments(await enrollmentApi.getMyEnrollments());
        } else if (activeSection === "favorites") {
          setFavorites(await favoriteApi.getMyFavorites());
        } else if (activeSection === "certificates") {
          setCertificates(await certificateApi.getMyCertificates());
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
    if (userId) {
      const keysToDelete: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`voxfox_${userId}_`)) keysToDelete.push(key);
      }
      keysToDelete.forEach((k) => localStorage.removeItem(k));
    }
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
    const ok = await userApi.changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword });
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
    { key: "profile",      icon: <UserOutlined />,              label: "Мои данные" },
    { key: "courses",      icon: <BookOutlined />,              label: "Мои курсы" },
    { key: "favorites",    icon: <HeartOutlined />,             label: "Избранное" },
    { key: "certificates", icon: <SafetyCertificateOutlined />, label: "Сертификаты" },
    { key: "achievements", icon: <TrophyOutlined />,            label: "Достижения" },
    { key: "wallet",       icon: <WalletOutlined />,            label: "Баланс и операции" },
  ];

  if (loading)
    return (<><Header /><div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}><Spin size="large" /></div></>);

  return (
      <>
        <Header />
        <Layout style={{ minHeight: "calc(100vh - 64px)" }}>
          <Sider width={260} style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }} theme="light">
            <input type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: "none" }} id="avatar-upload" onChange={handleAvatarChange} />

            <div
                style={{ padding: "32px 16px 20px", textAlign: "center", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}
                onClick={() => document.getElementById("avatar-upload")?.click()}
                title="Нажмите чтобы изменить аватар"
            >
              <Avatar
                  size={72}
                  src={getAvatarUrl(userData?.avatarUrl)}
                  icon={!userData?.avatarUrl && <UserOutlined />}
                  style={{ background: userData?.avatarUrl ? undefined : "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)", marginBottom: 12 }}
              />
              {userData && <div><Text strong style={{ fontSize: 15 }}>{userData.name}</Text></div>}
              {me && <Tag color="green" style={{ marginTop: 8 }}>{roleLabels[me.role] ?? me.role}</Tag>}
              <div style={{ marginTop: 6 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Нажмите для смены фото</Text>
              </div>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[activeSection]}
                style={{ borderRight: 0, paddingTop: 8 }}
                items={menuItems}
                onClick={({ key }) => navigate(`/profile?tab=${key}`)}
            />

            <div style={{ padding: 16, position: "absolute", bottom: 0, width: "100%" }}>
              <Button danger block icon={<LogoutOutlined />} onClick={handleLogout}>Выйти</Button>
            </div>
          </Sider>

          <Content style={{ padding: "40px 60px", background: "#fafafa" }}>

            {/* Мои данные */}
            {activeSection === "profile" && me && (
                <div style={{ maxWidth: 600 }}>
                  <Title level={3}>Мои данные</Title>
                  <Divider />
                  {!editingProfile ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div><Text type="secondary">Имя</Text><div><Text strong>{me.name}</Text></div></div>
                        <div><Text type="secondary">Email</Text><div><Text strong>{me.email}</Text></div></div>
                        <div>
                          <Text type="secondary">О себе</Text>
                          <div>{me.bio ? <Text>{me.bio}</Text> : <Text type="secondary" italic>Не указано</Text>}</div>
                        </div>
                        <div><Text type="secondary">Роль</Text><div><Tag color="green">{roleLabels[me.role] ?? me.role}</Tag></div></div>
                        <div>
                          <Text type="secondary">Дата регистрации</Text>
                          <div><Text>{new Date(me.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</Text></div>
                        </div>
                        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                          <Button icon={<EditOutlined />} onClick={() => { profileForm.setFieldsValue({ name: me.name, bio: me.bio ?? "" }); setEditingProfile(true); setEditingPassword(false); }}>
                            Редактировать профиль
                          </Button>
                          <Button icon={<LockOutlined />} onClick={() => { setEditingPassword(true); setEditingProfile(false); }}>
                            Сменить пароль
                          </Button>
                        </div>
                      </div>
                  ) : (
                      <Form form={profileForm} layout="vertical" onFinish={handleSaveProfile} requiredMark={false}>
                        <Form.Item label="Имя" name="name" rules={[{ required: true, message: "Введите имя" }, { min: 2 }, { max: 100 }]}>
                          <Input size="large" />
                        </Form.Item>
                        <Form.Item label="О себе" name="bio" rules={[{ max: 500 }]}>
                          <Input.TextArea rows={4} placeholder="Расскажите о себе..." />
                        </Form.Item>
                        <div style={{ display: "flex", gap: 12 }}>
                          <Button type="primary" htmlType="submit" loading={savingProfile} style={{ background: "rgba(0,100,0,0.8)" }}>Сохранить</Button>
                          <Button onClick={() => setEditingProfile(false)}>Отмена</Button>
                        </div>
                      </Form>
                  )}

                  {editingPassword && !editingProfile && (
                      <>
                        <Divider />
                        <Title level={4}>Смена пароля</Title>
                        <Form form={passwordForm} layout="vertical" onFinish={handleSavePassword} requiredMark={false}>
                          <Form.Item label="Текущий пароль" name="oldPassword" rules={[{ required: true, message: "Введите текущий пароль" }]}>
                            <Input.Password size="large" />
                          </Form.Item>
                          <Form.Item label="Новый пароль" name="newPassword" rules={[{ required: true }, { min: 8 }]}>
                            <Input.Password size="large" />
                          </Form.Item>
                          <Form.Item label="Повторите новый пароль" name="confirmPassword" dependencies={["newPassword"]}
                                     rules={[{ required: true, message: "Повторите пароль" }, ({ getFieldValue }) => ({
                                       validator(_, value) {
                                         if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                                         return Promise.reject(new Error("Пароли не совпадают"));
                                       },
                                     })]}>
                            <Input.Password size="large" />
                          </Form.Item>
                          <div style={{ display: "flex", gap: 12 }}>
                            <Button type="primary" htmlType="submit" loading={savingPassword} style={{ background: "rgba(0,100,0,0.8)" }}>Сохранить</Button>
                            <Button onClick={() => setEditingPassword(false)}>Отмена</Button>
                          </div>
                        </Form>
                      </>
                  )}
                </div>
            )}

            {/* Мои курсы */}
            {activeSection === "courses" && (
                <div>
                  <Title level={3}>Мои курсы</Title>
                  <Divider />
                  {enrollments.length === 0 ? (
                      <Empty description={<Text type="secondary">Вы ещё не записаны ни на один курс</Text>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                      <Row gutter={[24, 24]}>
                        {enrollments.map((e) => e.course && (<Col key={e.id} xs={24} sm={12} lg={6}><CardCourse course={e.course} /></Col>))}
                      </Row>
                  )}
                </div>
            )}

            {/* Избранное */}
            {activeSection === "favorites" && (
                <div>
                  <Title level={3}>Избранное</Title>
                  <Divider />
                  {favorites.length === 0 ? (
                      <Empty description={<Text type="secondary">Вы ещё не добавили курсы в избранное</Text>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                      <Row gutter={[24, 24]}>
                        {favorites.map((f) => f.course && (<Col key={f.id} xs={24} sm={12} lg={6}><CardCourse course={f.course} isFavorite={true} /></Col>))}
                      </Row>
                  )}
                </div>
            )}

            {/* Сертификаты */}
            {activeSection === "certificates" && (
                <div>
                  <Title level={3}>Мои сертификаты</Title>
                  <Divider />
                  {certificates.length === 0 ? (
                      <Empty image={<SafetyCertificateOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />}
                             description={<Text type="secondary">У вас пока нет сертификатов. Завершите курс чтобы получить первый!</Text>} />
                  ) : (
                      <Row gutter={[24, 24]}>
                        {certificates.map((cert) => (<Col key={cert.id} xs={24} sm={12} lg={8}><CertificateCard cert={cert} /></Col>))}
                      </Row>
                  )}
                </div>
            )}

            {/* Достижения */}
            {activeSection === "achievements" && <AchievementsTab />}

            {/* Баланс и операции */}
            {activeSection === "wallet" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <Title level={3} style={{ margin: 0 }}>Баланс и операции</Title>
                    <Button type="primary" icon={<WalletOutlined />} style={{ background: "rgba(0,100,0,0.8)" }} onClick={() => setTopUpOpen(true)}>
                      Пополнить баланс
                    </Button>
                  </div>

                  <div style={{
                    background: "linear-gradient(135deg, rgba(0,100,0,0.85) 0%, rgba(0,128,0,0.7) 100%)",
                    borderRadius: 12, padding: "24px 32px", marginBottom: 32,
                    display: "inline-flex", flexDirection: "column", gap: 4, minWidth: 240,
                  }}>
                    <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>Текущий баланс</Text>
                    <Text strong style={{ color: "#fff", fontSize: 32, lineHeight: 1.2 }}>
                      {balance.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                    </Text>
                  </div>

                  <Divider />
                  <Title level={4} style={{ marginBottom: 16 }}>История операций</Title>
                  <TransactionsTab />
                </div>
            )}
          </Content>
        </Layout>

        <TopUpModal
            open={topUpOpen}
            currentBalance={balance}
            onClose={() => setTopUpOpen(false)}
            onSuccess={(newBalance) => setBalance(newBalance)}
        />

        <Footer />
      </>
  );
};

export default UserProfilePage;