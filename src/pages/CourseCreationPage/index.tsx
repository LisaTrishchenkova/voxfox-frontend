// src/pages/CourseCreationPage.tsx
import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Form, 
  Input, 
  Select, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Divider,
  Space,
  Tag,
  InputNumber,
  Switch,
  Upload,
  Steps,
  Radio,
  Rate,
  DatePicker,
  message,
  Badge,
  Avatar,
  Tooltip
} from 'antd';
import { 
  PlusOutlined,
  BookOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  SettingOutlined,
  UploadOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
  GlobalOutlined,
  SaveOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const CourseCreationPage = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [menuSelected, setMenuSelected] = useState('courses');
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  // Моковые данные существующих курсов
  const existingCourses = [
    { id: 1, title: 'React Advanced', status: 'published', students: 245, updated: '2 дня назад' },
    { id: 2, title: 'TypeScript Basics', status: 'draft', students: 0, updated: '1 час назад' },
    { id: 3, title: 'Node.js API', status: 'published', students: 189, updated: 'неделю назад' },
    { id: 4, title: 'UI/UX Fundamentals', status: 'archived', students: 76, updated: '2 недели назад' },
  ];

  const categories = [
    'Программирование',
    'Дизайн',
    'Data Science',
    'Маркетинг',
    'Бизнес',
    'Личностный рост',
    'Иностранные языки'
  ];

  const levels = [
    { value: 'beginner', label: 'Начинающий' },
    { value: 'intermediate', label: 'Средний' },
    { value: 'advanced', label: 'Продвинутый' },
    { value: 'all', label: 'Все уровни' }
  ];

  const languages = [
    'Русский',
    'Английский',
    'Испанский',
    'Немецкий',
    'Французский'
  ];

  const steps = [
    { title: 'Основное', icon: <BookOutlined /> },
    { title: 'Содержание', icon: <VideoCameraOutlined /> },
    { title: 'Цена', icon: <DollarOutlined /> },
    { title: 'Настройки', icon: <SettingOutlined /> }
  ];

  const handleImageUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} успешно загружено`);
      setCourseImage(URL.createObjectURL(info.file.originFileObj));
    }
  };

  const handleMenuClick = (key: string) => {
    setMenuSelected(key);
  };

  const handleSaveDraft = () => {
    message.success('Черновик сохранен');
  };

  const handlePreview = () => {
    message.info('Предпросмотр курса');
  };

  const handlePublish = () => {
    setIsPublished(true);
    message.success('Курс опубликован!');
  };

  const handleSubmit = (values: any) => {
    console.log('Данные курса:', values);
    message.success('Курс успешно сохранен!');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Layout style={{ flex: 1, background: '#fafafa' }}>
        {/* Левое меню */}
        <Sider 
          width={280}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            padding: '24px 0',
            overflow: 'auto'
          }}
        >
          <div style={{ padding: '0 20px 24px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <Button 
              type="primary" 
              block 
              icon={<PlusOutlined />}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #fa8c16 100%)',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                fontWeight: 600
              }}
              onClick={() => {
                setMenuSelected('new-course');
                form.resetFields();
                setCourseImage(null);
                setIsPublished(false);
              }}
            >
              Новый курс
            </Button>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[menuSelected]}
            onClick={({ key }) => handleMenuClick(key as string)}
            style={{ border: 'none', padding: '8px 0' }}
          >
            <Menu.Item 
              key="courses" 
              icon={<BookOutlined />}
              style={{ 
                margin: '4px 8px',
                borderRadius: '8px',
                height: '48px'
              }}
            >
              Мои курсы
              <Badge count={existingCourses.length} style={{ marginLeft: '8px' }} />
            </Menu.Item>
            
            <Menu.Item 
              key="lessons" 
              icon={<VideoCameraOutlined />}
              style={{ 
                margin: '4px 8px',
                borderRadius: '8px',
                height: '48px'
              }}
            >
              Уроки
            </Menu.Item>
            
            <Menu.Item 
              key="materials" 
              icon={<FileTextOutlined />}
              style={{ 
                margin: '4px 8px',
                borderRadius: '8px',
                height: '48px'
              }}
            >
              Материалы
            </Menu.Item>
            
            <Menu.Item 
              key="analytics" 
              icon={<TeamOutlined />}
              style={{ 
                margin: '4px 8px',
                borderRadius: '8px',
                height: '48px'
              }}
            >
              Аналитика
            </Menu.Item>
            
            <Menu.Item 
              key="settings" 
              icon={<SettingOutlined />}
              style={{ 
                margin: '4px 8px',
                borderRadius: '8px',
                height: '48px'
              }}
            >
              Настройки
            </Menu.Item>
          </Menu>

          {/* Список существующих курсов */}
          <div style={{ padding: '20px', marginTop: '16px' }}>
            <Text strong style={{ display: 'block', marginBottom: '12px' }}>Последние курсы:</Text>
            <Space direction="vertical" style={{ width: '100%' }}>
              {existingCourses.map(course => (
                <Card 
                  key={course.id}
                  size="small"
                  style={{ 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: menuSelected === `course-${course.id}` ? '2px solid #52c41a' : '1px solid #f0f0f0'
                  }}
                  onClick={() => handleMenuClick(`course-${course.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text ellipsis style={{ maxWidth: '140px' }}>{course.title}</Text>
                    <Tag 
                      color={
                        course.status === 'published' ? 'green' : 
                        course.status === 'draft' ? 'orange' : 'default'
                      }
                      style={{ fontSize: '10px', margin: 0 }}
                    >
                      {course.status === 'published' ? 'Опубликован' : 
                       course.status === 'draft' ? 'Черновик' : 'Архив'}
                    </Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '10px' }}>
                      {course.students} студентов
                    </Text>
                    <Text type="secondary" style={{ fontSize: '10px' }}>
                      {course.updated}
                    </Text>
                  </div>
                </Card>
              ))}
            </Space>
          </div>
        </Sider>

        {/* Основной контент */}
        <Content style={{ padding: '32px 40px', overflow: 'auto' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Заголовок и статус */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  {menuSelected === 'new-course' ? 'Создание нового курса' : 'Редактирование курса'}
                </Title>
                <Text type="secondary">
                  Заполните информацию о курсе, чтобы начать обучение студентов
                </Text>
              </div>
              
              <Space>
                <Switch
                  checked={isPublished}
                  onChange={setIsPublished}
                  checkedChildren="Опубликован"
                  unCheckedChildren="Черновик"
                  style={{ background: isPublished ? '#52c41a' : '#d9d9d9' }}
                />
                <Button 
                  icon={<SaveOutlined />}
                  onClick={handleSaveDraft}
                >
                  Сохранить черновик
                </Button>
                <Button 
                  icon={<EyeOutlined />}
                  onClick={handlePreview}
                >
                  Предпросмотр
                </Button>
                <Button 
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={handlePublish}
                  style={{
                    background: 'linear-gradient(135deg, #52c41a 0%, #fa8c16 100%)',
                    border: 'none'
                  }}
                >
                  Опубликовать
                </Button>
              </Space>
            </div>

            {/* Шаги создания */}
            <div style={{ marginBottom: '40px' }}>
              {/* <Steps current={currentStep} size="small">
                {steps.map((step, index) => (
                  <Step 
                    key={index} 
                    title={step.title} 
                    icon={step.icon}
                    onClick={() => setCurrentStep(index)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Steps> */}
            </div>

            {/* Форма создания курса */}
            <Card style={{ borderRadius: '16px', marginBottom: '32px' }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
              >
                {currentStep === 0 && (
                  <>
                    {/* Основная информация */}
                    <div style={{ marginBottom: '32px' }}>
                      <Title level={4} style={{ marginBottom: '24px' }}>
                        Основная информация
                      </Title>
                      
                      <Row gutter={24}>
                        <Col span={16}>
                          <Form.Item
                            label="Название курса"
                            name="title"
                            rules={[{ required: true, message: 'Введите название курса' }]}
                          >
                            <Input 
                              placeholder="Введите название курса, например: 'React с нуля до PRO'" 
                              size="large"
                            />
                          </Form.Item>

                          <Form.Item
                            label="Описание курса"
                            name="description"
                            rules={[{ required: true, message: 'Введите описание курса' }]}
                          >
                            <TextArea 
                              placeholder="Опишите, чему научатся студенты, пройдя этот курс"
                              rows={4}
                              maxLength={500}
                              showCount
                            />
                          </Form.Item>

                          <Form.Item
                            label="Краткое описание"
                            name="shortDescription"
                          >
                            <Input 
                              placeholder="Краткое описание для карточки курса (максимум 150 символов)"
                              maxLength={150}
                              showCount
                            />
                          </Form.Item>
                        </Col>
                        
                        <Col span={8}>
                          <Form.Item
                            label="Обложка курса"
                            name="image"
                          >
                            <Upload
                              accept="image/*"
                              showUploadList={false}
                              customRequest={({ file, onSuccess }: any) => {
                                setTimeout(() => {
                                  onSuccess("ok");
                                }, 0);
                              }}
                              onChange={handleImageUpload}
                            >
                              <div style={{
                                width: '100%',
                                height: '200px',
                                border: '2px dashed #d9d9d9',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: courseImage ? `url(${courseImage}) center/cover` : '#fafafa',
                                cursor: 'pointer'
                              }}>
                                {!courseImage && (
                                  <>
                                    <UploadOutlined style={{ fontSize: '32px', color: '#999', marginBottom: '12px' }} />
                                    <Text type="secondary">Загрузить обложку</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                      Рекомендуется 1280×720px
                                    </Text>
                                  </>
                                )}
                              </div>
                            </Upload>
                          </Form.Item>

                          <Form.Item
                            label="Язык курса"
                            name="language"
                            rules={[{ required: true, message: 'Выберите язык' }]}
                          >
                            <Select placeholder="Выберите язык" allowClear>
                              {languages.map(lang => (
                                <Option key={lang} value={lang}>{lang}</Option>
                              ))}
                            </Select>
                          </Form.Item>

                          <Form.Item
                            label="Дата начала"
                            name="startDate"
                          >
                            <DatePicker 
                              style={{ width: '100%' }}
                              suffixIcon={<CalendarOutlined />}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>

                    <Divider />

                    {/* Категории и теги */}
                    <div style={{ marginBottom: '32px' }}>
                      <Title level={4} style={{ marginBottom: '24px' }}>
                        Категории и теги
                      </Title>
                      
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item
                            label="Категория"
                            name="category"
                            rules={[{ required: true, message: 'Выберите категорию' }]}
                          >
                            <Select placeholder="Выберите основную категорию" allowClear>
                              {categories.map(cat => (
                                <Option key={cat} value={cat}>{cat}</Option>
                              ))}
                            </Select>
                          </Form.Item>

                          <Form.Item
                            label="Уровень сложности"
                            name="level"
                            rules={[{ required: true, message: 'Выберите уровень' }]}
                          >
                            <Select placeholder="Выберите уровень сложности" allowClear>
                              {levels.map(level => (
                                <Option key={level.value} value={level.value}>
                                  {level.label}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        
                        <Col span={12}>
                          <Form.Item
                            label="Теги (до 5)"
                            name="tags"
                          >
                            <Select
                              mode="tags"
                              placeholder="Добавьте теги, например: React, JavaScript"
                              maxTagCount={5}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Целевая аудитория"
                            name="audience"
                          >
                            <Input 
                              placeholder="Кому подойдет этот курс, например: начинающим разработчикам" 
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    {/* Содержание курса */}
                    <div style={{ marginBottom: '32px' }}>
                      <Title level={4} style={{ marginBottom: '24px' }}>
                        Структура курса
                      </Title>
                      
                      <Form.Item
                        label="Количество уроков"
                        name="lessonsCount"
                      >
                        <InputNumber 
                          min={1} 
                          max={100} 
                          placeholder="Например: 24" 
                          style={{ width: '200px' }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Общая длительность курса"
                        name="duration"
                      >
                        <Input 
                          placeholder="Например: 36 часов" 
                          style={{ width: '200px' }}
                          suffix="часов"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Формат обучения"
                        name="format"
                      >
                        <Radio.Group>
                          <Radio value="video">Видеоуроки</Radio>
                          <Radio value="text">Текстовые уроки</Radio>
                          <Radio value="mixed">Смешанный формат</Radio>
                        </Radio.Group>
                      </Form.Item>

                      <div style={{ 
                        background: '#f9f9f9', 
                        padding: '24px', 
                        borderRadius: '8px',
                        marginTop: '24px'
                      }}>
                        <Title level={5} style={{ marginBottom: '16px' }}>
                          Модули курса
                        </Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Card size="small" title="Модуль 1: Введение" extra={<EditOutlined />}>
                            <Text>5 уроков • 8 часов</Text>
                          </Card>
                          <Card size="small" title="Модуль 2: Основы" extra={<EditOutlined />}>
                            <Text>8 уроков • 12 часов</Text>
                          </Card>
                          <Card size="small" title="Модуль 3: Продвинутые темы" extra={<EditOutlined />}>
                            <Text>6 уроков • 10 часов</Text>
                          </Card>
                          <Button 
                            type="dashed" 
                            block 
                            icon={<PlusOutlined />}
                            style={{ marginTop: '12px' }}
                          >
                            Добавить модуль
                          </Button>
                        </Space>
                      </div>
                    </div>

                    <Divider />

                    {/* Результаты обучения */}
                    <div>
                      <Title level={4} style={{ marginBottom: '24px' }}>
                        Результаты обучения
                      </Title>
                      
                      <Form.Item
                        label="Что узнают студенты?"
                        name="learningOutcomes"
                      >
                        <Select
                          mode="tags"
                          placeholder="Добавьте результаты обучения"
                          maxTagCount={10}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Необходимые знания"
                        name="prerequisites"
                      >
                        <TextArea 
                          placeholder="Какие знания должны быть у студентов перед началом курса"
                          rows={3}
                        />
                      </Form.Item>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    {/* Цена и монетизация */}
                    <div style={{ marginBottom: '32px' }}>
                      <Title level={4} style={{ marginBottom: '24px' }}>
                        Цена и условия продажи
                      </Title>
                      
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item
                            label="Цена курса"
                            name="price"
                            rules={[{ required: true, message: 'Укажите цену' }]}
                          >
                            <InputNumber 
                              min={0} 
                              style={{ width: '100%' }}
                              placeholder="0"
                              prefix={<DollarOutlined />}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Цена со скидкой"
                            name="discountedPrice"
                          >
                            <InputNumber 
                              min={0} 
                              style={{ width: '100%' }}
                              placeholder="Укажите, если есть скидка"
                              prefix={<DollarOutlined />}
                            />
                          </Form.Item>
                        </Col>
                        
                        <Col span={12}>
                          <Form.Item
                            label="Валюта"
                            name="currency"
                          >
                            <Select defaultValue="RUB">
                              <Option value="RUB">Рубли (RUB)</Option>
                              <Option value="USD">Доллары (USD)</Option>
                              <Option value="EUR">Евро (EUR)</Option>
                            </Select>
                          </Form.Item>

                          <Form.Item
                            label="Тип доступа"
                            name="accessType"
                          >
                            <Radio.Group>
                              <Radio value="lifetime">Пожизненный доступ</Radio>
                              <Radio value="subscription">Подписка</Radio>
                              <Radio value="rental">Аренда</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        label="Сертификат об окончании"
                        name="certificate"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </div>

                    <Divider />

                    {/* Промо-материалы */}
                    <div>
                      <Title level={4} style={{ marginBottom: '24px' }}>
                        Промо-материалы
                      </Title>
                      
                      <Form.Item
                        label="Промо-видео (ссылка)"
                        name="promoVideo"
                      >
                        <Input 
                          placeholder="Ссылка на YouTube или Vimeo" 
                          prefix={<VideoCameraOutlined />}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Бесплатный урок"
                        name="freeLesson"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    {/* Настройки */}
                    <div style={{ marginBottom: '32px' }}>
                      <Title level={4} style={{ marginBottom: '24px' }}>
                        Настройки видимости
                      </Title>
                      
                      <Form.Item
                        label="Доступность курса"
                        name="visibility"
                      >
                        <Radio.Group>
                          <Radio value="public">Публичный (виден всем)</Radio>
                          <Radio value="private">Приватный (только по ссылке)</Radio>
                          <Radio value="hidden">Скрытый (только автору)</Radio>
                        </Radio.Group>
                      </Form.Item>

                      <Form.Item
                        label="Комментарии"
                        name="comments"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>

                      <Form.Item
                        label="Рейтинг"
                        name="rating"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </div>

                    <Divider />

                    {/* Дополнительные настройки */}
                    <div>
                      <Title level={4} style={{ marginBottom: '24px' }}>
                        Дополнительные настройки
                      </Title>
                      
                      <Form.Item
                        label="Автозавершение уроков"
                        name="autoComplete"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>

                      <Form.Item
                        label="Домашние задания"
                        name="homework"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>

                      <Form.Item
                        label="Тестирование"
                        name="testing"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>

                      <Form.Item
                        label="Поддержка сообщества"
                        name="community"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </div>
                  </>
                )}

                {/* Кнопки навигации */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '40px',
                  paddingTop: '24px',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <Space>
                    <Button 
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      Назад
                    </Button>
                    <Button 
                      type="primary"
                      onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                      disabled={currentStep === 3}
                      style={{
                        background: 'linear-gradient(135deg, #52c41a 0%, #fa8c16 100%)',
                        border: 'none'
                      }}
                    >
                      Далее
                    </Button>
                  </Space>

                  <Space>
                    <Button 
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => {
                        form.resetFields();
                        setCourseImage(null);
                        message.info('Форма очищена');
                      }}
                    >
                      Очистить
                    </Button>
                    <Button 
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      size="large"
                      style={{
                        background: 'linear-gradient(135deg, #52c41a 0%, #fa8c16 100%)',
                        border: 'none',
                        padding: '0 32px'
                      }}
                    >
                      Сохранить курс
                    </Button>
                  </Space>
                </div>
              </Form>
            </Card>

            {/* Быстрые советы */}
            <Card style={{ borderRadius: '16px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}>
                💡 Советы по созданию успешного курса
              </Title>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li><Text>Добавьте качественную обложку — она повышает доверие</Text></li>
                <li><Text>Подробно опишите, что получат студенты</Text></li>
                <li><Text>Разбейте курс на логические модули</Text></li>
                <li><Text>Добавьте практические задания</Text></li>
                <li><Text>Установите конкурентную цену</Text></li>
              </ul>
            </Card>
          </div>
        </Content>
      </Layout>

      <Footer />
    </div>
  );
};

export default CourseCreationPage;