// src/pages/CourseCreationPage.tsx
import { useState } from 'react';
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
  Radio,
  message,
  Badge,
  Collapse,
  type FormProps
} from 'antd';
import { 
  PlusOutlined,
  BookOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  SettingOutlined,
  UploadOutlined,
  DollarOutlined,
  TeamOutlined,
  SaveOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { gradients } from '../../theme';
import Sidebar from '../../components/Sidebar';
import type { LoginFormData } from '../../api/types/auth';
import type { CourseFormData, CourseRequest } from '../../api/types/course';
import { courseApi } from '../../api/CourseApi';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const CourseCreationPage = () => {
  const [form] = Form.useForm();
  const [menuSelected, setMenuSelected] = useState('courses');
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [isPaidCourse, setIsPaidCourse] = useState(false);
  const [showPriceSection, setShowPriceSection] = useState(false);

  // Моковые данные существующих курсов
  const existingCourses = [
    { id: 1, title: 'React Advanced', status: 'published', students: 245, updated: '2 дня назад' },
    { id: 2, title: 'TypeScript Basics', status: 'draft', students: 0, updated: '1 час назад' },
    { id: 3, title: 'Node.js API', status: 'published', students: 189, updated: 'неделю назад' },
  ];

  const categories = [
    'Программирование',
    'Дизайн',
    'Data Science',
    'Маркетинг',
    'Бизнес'
  ];

  const levels = [
    { value: 'beginner', label: 'Начинающий' },
    { value: 'intermediate', label: 'Средний' },
    { value: 'advanced', label: 'Продвинутый' }
  ];

  const handleImageUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} успешно загружено`);
      if (info.file.originFileObj) {
        setCourseImage(URL.createObjectURL(info.file.originFileObj));
      }
    }
  };

  const handleMenuClick = (key: string) => {
    setMenuSelected(key);
  };

  const handleSaveDraft = () => {
    form.validateFields().then(values => {
      console.log('Сохранен черновик:', values);
      message.success('Черновик сохранен');
    });
  };

  const handlePublish = () => {
    form.validateFields().then(values => {
      console.log('Курс опубликован:', values);
      message.success('Курс опубликован!');
    });
  };

  const handleSubmit = (values: any) => {
    console.log('Данные курса:', values);
    message.success('Курс успешно сохранен!');
  };


  const onFinish: FormProps<CourseFormData>["onFinish"] = async (values) =>
  {
    console.log(values);
    const courseRequest: CourseRequest = {
    title: values.title,
    description: values.description,
    shortDescription: values.shortDescription || 
    values.description.substring(0, 100) + (values.description.length > 100 ? '...' : ''),
    category: values.category,
    level: values.level,
    imageUrl: courseImage || 'https://via.placeholder.com/300x200',
    lessonsCount: values.lessonsCount || 0,
    duration: values.duration || '',
    format: values.format || 'mixed',
    hasCertificate: values.hasCertificate || false, // Из формы
    hasHomework: values.hasHomework || false,       // Из формы
    isPaid: values.isPaid || false,                 // Из формы
    price: values.isPaid ? (values.price || 0) : 0,
    discountedPrice: values.isPaid ? (values.discountedPrice || 0) : 0,
    tags: values.tags || [],
  };
  const courseResponse = await courseApi.createCourse(courseRequest);
  console.log(courseResponse);
  
  if (courseResponse) {
    message.success('Курс успешно создан!');
  } else {
    message.error('Не удалось создать курс');
  }
}

  const onFinishFailed: FormProps<LoginFormData>["onFinishFailed"] = (
  errorInfo
  ) => {
    console.log(errorInfo);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
    <Layout style={{ flex: 1, background: '#fafafa' }}>
          <Sidebar/>

        {/* Основной контент */}
        <Content style={{ padding: '32px 40px', overflow: 'auto' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Заголовок */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  Создание нового курса
                  {/* {menuSelected === 'new-course' ? 'Создание нового курса' : 'Редактирование курса'} */}
                </Title>
                <Text type="secondary">
                  Заполните информацию о курсе
                </Text>
              </div>
              
              <Space>
                <Button 
                  type="default"
                  icon={<SaveOutlined />}
                  onClick={handleSaveDraft}
                  size="large"
                >
                  Сохранить черновик
                </Button>
                <Button 
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={handlePublish}
                  size="large"
                  style={{ background: gradients.primary, border: 'none' }}
                >
                  Опубликовать курс
                </Button>
              </Space>
            </div>

            {/* Форма создания курса */}
            <Card style={{ marginBottom: 32, borderRadius: '12px' }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                size="large"
              >
                {/* Основная информация */}
                <div style={{ marginBottom: '32px' }}>
                  <Title level={4} style={{ marginBottom: '24px' }}>
                    Основная информация
                  </Title>
                  
                  <Row gutter={24}>
                    <Col span={16}>
                      <Form.Item<CourseFormData>
                        label="Название курса"
                        name="title"
                        rules={[{ required: true, message: 'Введите название курса' }]}
                      >
                        <Input 
                          placeholder="Например: 'React с нуля до PRO'" 
                          size="large"
                        />
                      </Form.Item>

                      <Form.Item<CourseFormData>
                        label="Описание курса"
                        name="description"
                        rules={[{ required: true, message: 'Введите описание курса' }]}
                      >
                        <TextArea 
                          placeholder="Опишите, чему научатся студенты"
                          rows={4}
                          maxLength={500}
                          showCount
                        />
                      </Form.Item>
                    </Col>
                    
                    <Col span={8}>
                      <Form.Item<CourseFormData>
                        label="Обложка курса"
                        name="imageFile"
                      >
                        <Upload
                          accept="image/*"
                          showUploadList={false}
                          customRequest={({ onSuccess }: any) => {
                            setTimeout(() => {
                              onSuccess("ok");
                            }, 0);
                          }}
                          onChange={handleImageUpload}
                        >
                          <div style={{
                            width: '100%',
                            height: '180px',
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
                                <UploadOutlined style={{ fontSize: '24px', color: '#999', marginBottom: '8px' }} />
                                <Text type="secondary">Загрузить обложку</Text>
                              </>
                            )}
                          </div>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider />

                {/* Категории и уровень */}
                <div style={{ marginBottom: '32px' }}>
                  <Title level={4} style={{ marginBottom: '24px' }}>
                    Категории и настройки
                  </Title>
                  
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item<CourseFormData>
                        label="Категория"
                        name = "category"
                        rules={[{ required: true, message: 'Выберите категорию' }]}
                      >
                        <Select placeholder="Выберите категорию">
                          {categories.map(cat => (
                            <Option key={cat} value={cat}>{cat}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                      <Form.Item<CourseFormData>
                        label="Уровень сложности"
                        name="level"
                        rules={[{ required: true, message: 'Выберите уровень' }]}
                      >
                        <Select placeholder="Выберите уровень сложности">
                          {levels.map(level => (
                            <Option key={level.value} value={level.value}>
                              {level.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item<CourseFormData>
                    label="Теги (до 5)"
                    name="tags"
                  >
                    <Select
                      mode="tags"
                      placeholder="Добавьте теги, например: React, JavaScript"
                      maxTagCount={5}
                    />
                  </Form.Item>
                </div>

                <Divider />

                {/* Содержание курса */}
                <div style={{ marginBottom: '32px' }}>
                  <Title level={4} style={{ marginBottom: '24px' }}>
                    Содержание курса
                  </Title>
                  
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item<CourseFormData>
                        label="Количество уроков"
                        name="lessonsCount"
                      >
                        <InputNumber 
                          min={1} 
                          placeholder="Например: 24" 
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<CourseFormData>
                        label="Общая длительность"
                        name="duration"
                      >
                        <Input 
                          placeholder="Например: 36 часов" 
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item<CourseFormData>
                    label="Формат обучения"
                    name="format"
                  >
                    <Radio.Group>
                      <Radio value="video">Видеоуроки</Radio>
                      <Radio value="text">Текстовые уроки</Radio>
                      <Radio value="mixed">Смешанный формат</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>

                <Divider />

                {/* Настройки курса */}
                <div style={{ marginBottom: '32px' }}>
                  <Title level={4} style={{ marginBottom: '24px' }}>
                    Настройки курса
                  </Title>
                  
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item<CourseFormData>
                        label="Сертификат об окончании"
                        name="hasCertificate"
                        valuePropName="checked"
                        initialValue={true}
                      >
                        <Switch />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item<CourseFormData>
                        label="Домашние задания"
                        name="hasHomework"
                        valuePropName="checked"
                        initialValue={true}
                      >
                        <Switch />
                      </Form.Item>
                    </Col>
                  </Row>

                 
                </div>

                <Divider />

                {/* Цена курса (опционально) */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '24px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowPriceSection(!showPriceSection)}
                  >
                    <Title level={4} style={{ margin: 0 }}>
                      Настройки цены {showPriceSection ? <UpOutlined /> : <DownOutlined />}
                    </Title>
                     <Form.Item<CourseFormData>
                      name="isPaid"
                      valuePropName="checked"
                      initialValue={false}
                      style={{ marginBottom: 0 }}
                    >
                      <Switch
                        onChange={(checked) => {
                          if (checked) {
                            setShowPriceSection(true);
                          }
                        }}
                        checkedChildren="Платный"
                        unCheckedChildren="Бесплатный"
                      />
                    </Form.Item>
                  </div>

                  {showPriceSection && isPaidCourse && (
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item<CourseFormData>
                          label="Цена курса"
                          name="price"
                          rules={[{ required: true, message: 'Укажите цену' }]}
                        >
                          <InputNumber 
                            min={0} 
                            style={{ width: '100%' }}
                            placeholder="0"
                            addonBefore={<DollarOutlined />}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item<CourseFormData>
                          label="Цена со скидкой"
                          name="discountedPrice"
                        >
                          <InputNumber 
                            min={0} 
                            style={{ width: '100%' }}
                            placeholder="Укажите, если есть скидка"
                            addonBefore={<DollarOutlined />}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </div>

                {/* Кнопки формы */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '40px',
                  paddingTop: '24px',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <Button 
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => {
                      form.resetFields();
                      setCourseImage(null);
                      setIsPaidCourse(false);
                      setShowPriceSection(false);
                      message.info('Форма очищена');
                    }}
                  >
                    Очистить форму
                  </Button>
                  
                  <Space>
                    <Button 
                      type="primary"
                      htmlType='submit'
                      icon={<SaveOutlined />}
                      size="large"
                      onClick={handleSaveDraft}
                    >
                      Сохранить черновик
                    </Button>
                    <Button 
                      type="primary"
                      htmlType="submit"
                      icon={<UploadOutlined />}
                      size="large"
                      style={{ background: gradients.primary, border: 'none' }}
                      onClick={handlePublish}
                    >
                      Опубликовать курс
                    </Button>
                  </Space>
                </div>
              </Form>
            </Card>

            {/* Подсказки */}
            <Card style={{ borderRadius: '12px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}>
                💡 Советы по созданию курса
              </Title>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li><Text>Добавьте качественную обложку</Text></li>
                <li><Text>Четко опишите, чему научатся студенты</Text></li>
                <li><Text>Выберите правильный уровень сложности</Text></li>
                <li><Text>Добавьте теги для лучшего поиска</Text></li>
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