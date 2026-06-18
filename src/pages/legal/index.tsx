import { Layout, Typography, Divider } from "antd";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// ─── Политика конфиденциальности ─────────────────────────────
const PrivacyPolicy = () => (
    <div>
        <Title level={1} style={{ color: "#1a3a1a", marginBottom: 8 }}>Политика конфиденциальности</Title>
        <Text type="secondary">Последнее обновление: июнь 2026</Text>
        <Divider />

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>1. Общие положения</Title>
            <Paragraph>
                VoxFox серьёзно относится к защите ваших персональных данных.
                Настоящая политика объясняет, какие данные мы собираем, как используем и как защищаем их
                при использовании нашей платформы.
            </Paragraph>
            <Paragraph>
                Используя VoxFox, вы соглашаетесь с условиями данной политики. Если вы не согласны -
                пожалуйста, не используйте наш сервис.
            </Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>2. Какие данные мы собираем</Title>
            <Paragraph><strong>Данные аккаунта:</strong> имя, адрес электронной почты, пароль (в зашифрованном виде), аватар.</Paragraph>
            <Paragraph><strong>Данные об обучении:</strong> прогресс по курсам, ответы на задания, полученные сертификаты и достижения.</Paragraph>
            <Paragraph><strong>Финансовые данные:</strong> история транзакций, баланс счёта. Данные банковских карт мы не храним.</Paragraph>
            <Paragraph><strong>Данные общения:</strong> вопросы к урокам, отзывы на курсы, которые вы оставляете на платформе.</Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>3. Как мы используем ваши данные</Title>
            <Paragraph>Мы используем ваши данные для:</Paragraph>
            <ul style={{ paddingLeft: 24, lineHeight: 2 }}>
                <li>предоставления доступа к курсам и отслеживания вашего прогресса;</li>
                <li>обработки платежей и выдачи сертификатов;</li>
                <li>улучшения качества платформы и персонализации контента;</li>
                <li>отправки важных уведомлений (одобрение курсов, ответы на вопросы);</li>
                <li>обеспечения безопасности и предотвращения мошенничества.</li>
            </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>4. Передача данных третьим лицам</Title>
            <Paragraph>
                Мы не продаём и не передаём ваши персональные данные третьим лицам в коммерческих целях.
                Данные могут быть переданы только в следующих случаях:
            </Paragraph>
            <ul style={{ paddingLeft: 24, lineHeight: 2 }}>
                <li>с вашего явного согласия;</li>
                <li>по требованию законодательства или судебных органов;</li>
                <li>нашим техническим партнёрам (хостинг, платёжные системы) исключительно для выполнения услуг.</li>
            </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>5. Хранение и защита данных</Title>
            <Paragraph>
                Мы применяем современные технические меры для защиты ваших данных: шифрование при передаче (HTTPS),
                хеширование паролей, ограниченный доступ сотрудников к персональным данным.
            </Paragraph>
            <Paragraph>
                Данные хранятся на серверах на территории РФ. Мы храним ваши данные, пока вы используете
                платформу, и в течение 3 лет после удаления аккаунта (если это требуется законодательством).
            </Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>6. Ваши права</Title>
            <Paragraph>Вы вправе:</Paragraph>
            <ul style={{ paddingLeft: 24, lineHeight: 2 }}>
                <li>получить копию своих персональных данных;</li>
                <li>исправить неточные данные через настройки профиля;</li>
                <li>запросить удаление аккаунта и связанных данных.</li>
            </ul>
            <Paragraph>Для реализации прав обратитесь к нам: <strong>voxfox@gmail.com</strong></Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>7. Cookies</Title>
            <Paragraph>
                Мы используем cookies для авторизации, сохранения предпочтений и аналитики.
                Вы можете отключить cookies в настройках браузера, однако часть функций платформы может перестать работать.
            </Paragraph>
        </section>

        <section>
            <Title level={3}>8. Изменения политики</Title>
            <Paragraph>
                Мы можем обновлять данную политику. О существенных изменениях уведомим вас по email
                или через уведомления на платформе.
            </Paragraph>
        </section>
    </div>
);

// ─── Условия использования ───────────────────────────────────
const TermsOfService = () => (
    <div>
        <Title level={1} style={{ color: "#1a3a1a", marginBottom: 8 }}>Условия использования</Title>
        <Text type="secondary">Последнее обновление: июнь 2026</Text>
        <Divider />

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>1. Принятие условий</Title>
            <Paragraph>
                Регистрируясь на VoxFox, вы подтверждаете, что прочитали, поняли и соглашаетесь с настоящими
                Условиями использования. Если вы не согласны - не создавайте аккаунт и не используйте сервис.
            </Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>2. Аккаунт</Title>
            <Paragraph>
                Для использования большинства функций необходима регистрация. Вы обязаны предоставить
                достоверные данные и нести ответственность за безопасность своего пароля.
            </Paragraph>
            <Paragraph>
                Один человек - один аккаунт. Передача аккаунта другому лицу запрещена.
                Мы вправе заблокировать аккаунт при подозрении на нарушение условий.
            </Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>3. Права и обязанности студентов</Title>
            <Paragraph>Записавшись на курс, вы получаете право:</Paragraph>
            <ul style={{ paddingLeft: 24, lineHeight: 2 }}>
                <li>проходить курс в своём темпе;</li>
                <li>задавать вопросы преподавателю;</li>
                <li>оставлять отзывы;</li>
                <li>получить сертификат при успешном завершении (если курс его предусматривает).</li>
            </ul>
            <Paragraph>Вы обязуетесь:</Paragraph>
            <ul style={{ paddingLeft: 24, lineHeight: 2 }}>
                <li>не распространять материалы курса без разрешения автора;</li>
                <li>не использовать платформу для коммерческой перепродажи контента;</li>
                <li>соблюдать Правила сообщества при общении.</li>
            </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>4. Права и обязанности преподавателей</Title>
            <Paragraph>Создавая курс, преподаватель подтверждает, что:</Paragraph>
            <ul style={{ paddingLeft: 24, lineHeight: 2 }}>
                <li>является автором материалов или имеет право их использовать;</li>
                <li>контент не нарушает авторские права третьих лиц;</li>
                <li>материалы соответствуют заявленной теме и уровню сложности;</li>
                <li>информация в курсе является достоверной.</li>
            </ul>
            <Paragraph>
                VoxFox взимает комиссию с продаж платных курсов в размере 15%.
            </Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>5. Оплата и возвраты</Title>
            <Paragraph>
                Платные курсы оплачиваются через внутренний баланс платформы. Пополнение баланса
                происходит через доступные платёжные системы.
            </Paragraph>
            <Paragraph>
                Возврат средств возможен в течение 7 дней с момента покупки, если вы прошли менее 20% курса.
                Для оформления возврата обратитесь в поддержку или воспользуйтесь функцией возврата
                в разделе транзакций (для администраторов).
            </Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>6. Интеллектуальная собственность</Title>
            <Paragraph>
                Весь контент платформы (дизайн, код, логотипы) принадлежит VoxFox.
                Материалы курсов принадлежат их авторам-преподавателям.
            </Paragraph>
            <Paragraph>
                Запрещается копировать, воспроизводить или распространять материалы платформы
                без письменного разрешения правообладателя.
            </Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>7. Модерация и блокировка</Title>
            <Paragraph>
                Мы вправе отклонить, снять с публикации или удалить курс, а также заблокировать
                аккаунт пользователя, нарушающего настоящие Условия или Правила сообщества -
                без предварительного уведомления в случае серьёзных нарушений.
            </Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>8. Ограничение ответственности</Title>
            <Paragraph>
                VoxFox предоставляет платформу «как есть». Мы не гарантируем, что обучение
                на платформе приведёт к конкретным профессиональным результатам.
                Качество курсов определяется их авторами.
            </Paragraph>
        </section>

        <section>
            <Title level={3}>9. Контакты</Title>
            <Paragraph>
                По вопросам, связанным с условиями использования: <strong>voxfox@gmail.com</strong>
            </Paragraph>
        </section>
    </div>
);

// ─── Правила сообщества ──────────────────────────────────────
const CommunityRules = () => (
    <div>
        <Title level={1} style={{ color: "#1a3a1a", marginBottom: 8 }}>Правила сообщества</Title>
        <Text type="secondary">Последнее обновление: июнь 2026</Text>
        <Divider />

        <Paragraph style={{ fontSize: 15, color: "#444", marginBottom: 32 }}>
            VoxFox - это место для обучения и роста. Мы хотим, чтобы каждый чувствовал себя
            здесь комфортно и безопасно. Эти правила помогают нам сохранить такую среду.
        </Paragraph>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>✅ Что мы приветствуем</Title>
            <ul style={{ paddingLeft: 24, lineHeight: 2.2 }}>
                <li><strong>Уважение.</strong> Общайтесь вежливо, даже если не согласны с собеседником.</li>
                <li><strong>Конструктивность.</strong> Задавайте вопросы по теме урока, давайте развёрнутые ответы.</li>
                <li><strong>Честные отзывы.</strong> Оставляйте объективные отзывы, которые помогают другим студентам.</li>
                <li><strong>Помощь другим.</strong> Делитесь знаниями, отвечайте на вопросы, если можете помочь.</li>
                <li><strong>Качественный контент.</strong> Создавайте курсы, которые действительно несут ценность.</li>
            </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>🚫 Что запрещено</Title>

            <Title level={4} style={{ color: "#c0392b" }}>Оскорбления и дискриминация</Title>
            <Paragraph>
                Запрещены любые высказывания, унижающие людей по признаку пола, возраста, национальности,
                религии, сексуальной ориентации, внешности или состояния здоровья.
                Оскорбления, угрозы и буллинг - повод для немедленной блокировки.
            </Paragraph>

            <Title level={4} style={{ color: "#c0392b" }}>Спам и реклама</Title>
            <Paragraph>
                Запрещено размещать ссылки на сторонние ресурсы, рекламировать услуги и продукты,
                рассылать навязчивые сообщения другим пользователям.
            </Paragraph>

            <Title level={4} style={{ color: "#c0392b" }}>Недостоверная информация</Title>
            <Paragraph>
                Не публикуйте заведомо ложную информацию, особенно в сфере медицины, финансов
                и юриспруденции. Если не уверены - так и скажите.
            </Paragraph>

            <Title level={4} style={{ color: "#c0392b" }}>Нарушение авторских прав</Title>
            <Paragraph>
                Запрещено копировать материалы курсов и распространять их без разрешения автора.
                Нельзя использовать чужие материалы в своих курсах без указания источника и разрешения.
            </Paragraph>

            <Title level={4} style={{ color: "#c0392b" }}>Манипуляции с отзывами</Title>
            <Paragraph>
                Запрещено накручивать рейтинги, договариваться об обмене положительными отзывами,
                оставлять фиктивные отзывы на чужие курсы.
            </Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>⚠️ Последствия нарушений</Title>
            <Paragraph>В зависимости от серьёзности нарушения мы можем:</Paragraph>
            <ul style={{ paddingLeft: 24, lineHeight: 2 }}>
                <li>удалить нарушающий контент (вопрос, отзыв, курс);</li>
                <li>выдать предупреждение;</li>
                <li>временно ограничить возможности аккаунта;</li>
                <li>заблокировать аккаунт без возможности восстановления.</li>
            </ul>
            <Paragraph>
                При серьёзных нарушениях (мошенничество, угрозы) мы вправе передать данные в правоохранительные органы.
            </Paragraph>
        </section>

        <section style={{ marginBottom: 32 }}>
            <Title level={3}>📢 Как сообщить о нарушении</Title>
            <Paragraph>
                Если вы заметили нарушение правил, напишите нам на <strong>voxfox@gmail.com</strong>.
                Мы рассматриваем каждое обращение и стараемся ответить в течение 48 часов.
            </Paragraph>
            <Paragraph>
                Злоупотребление функцией жалоб (отправка необоснованных жалоб) также является нарушением правил.
            </Paragraph>
        </section>

        <section>
            <Title level={3}>💬 Дух сообщества</Title>
            <Paragraph>
                Мы строим платформу, где каждый может учиться и делиться знаниями в безопасной атмосфере.
                Относитесь к другим так, как хотите, чтобы относились к вам — и VoxFox будет местом,
                куда хочется возвращаться.
            </Paragraph>
        </section>
    </div>
);

// ─── LegalPage (роутер) ──────────────────────────────────────
const LegalPage = () => {
    const { page } = useParams<{ page: string }>();

    const pages: Record<string, { component: React.ReactNode; title: string }> = {
        privacy: { component: <PrivacyPolicy />, title: "Политика конфиденциальности" },
        terms: { component: <TermsOfService />, title: "Условия использования" },
        community: { component: <CommunityRules />, title: "Правила сообщества" },
    };

    const current = page ? pages[page] : null;

    return (
        <>
            <Header />
            <Layout style={{ minHeight: "calc(100vh - 64px)", background: "#fafafa" }}>
                <Content style={{ maxWidth: 800, margin: "0 auto", padding: "48px 40px" }}>

                    {/* Навигация между документами */}
                    <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
                        {Object.entries(pages).map(([key, val]) => (
                            <Link key={key} to={`/legal/${key}`}
                                  style={{
                                      fontSize: 13,
                                      color: page === key ? "rgba(0,100,0,0.85)" : "#888",
                                      fontWeight: page === key ? 600 : 400,
                                      textDecoration: "none",
                                      borderBottom: page === key ? "2px solid rgba(0,100,0,0.85)" : "2px solid transparent",
                                      paddingBottom: 4,
                                  }}>
                                {val.title}
                            </Link>
                        ))}
                    </div>

                    <div style={{ background: "#fff", borderRadius: 12, padding: "40px 48px", border: "1px solid #f0f0f0" }}>
                        {current ? current.component : (
                            <div style={{ textAlign: "center", padding: "60px 0" }}>
                                <Title level={3} style={{ color: "#ccc" }}>Страница не найдена</Title>
                                <Link to="/legal/privacy" style={{ color: "rgba(0,100,0,0.85)" }}>
                                    Политика конфиденциальности
                                </Link>
                            </div>
                        )}
                    </div>
                </Content>
            </Layout>
            <Footer />
        </>
    );
};

export default LegalPage;