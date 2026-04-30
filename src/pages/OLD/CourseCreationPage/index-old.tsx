// import {
//   Button,
//   Card,
//   Form,
//   Input,
//   Layout,
//   message,
//   Select,
//   Space,
//   Spin,
//   Typography,
// } from "antd";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { courseApi } from "../../../api/courseApi";
// import { SaveOutlined } from "@ant-design/icons";
// import type {CategoryDto} from "../../../api/types/course.ts";
//
// const { Content } = Layout;
// const { Title } = Typography;
// const { TextArea } = Input;
// const { Option } = Select;
//
// interface CourseFormValues {
//   title: string;
//   description: string;
//   categoryId?: string;
//   tags?: string[];
// }
//
// const CourseCreationPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [form] = Form.useForm<CourseFormValues>();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [categories, setCategories] = useState<CategoryDto[]>([]);
//   const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
//
//   // Загрузка категорий при монтировании
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoadingCategories(true);
//         const data = await courseApi.getCategories();
//         setCategories(data);
//       } catch (error) {
//         message.error("Не удалось загрузить категории");
//         console.error(error);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//
//     fetchCategories();
//   }, []);
//
//   // Обработка отправки формы
//   const onFinish = async (values: CourseFormValues) => {
//     setLoading(true);
//
//     try {
//       // Преобразуем теги из строк в формат TagDto для API
//       const tags = values.tags?.map((tag) => ({ name: tag })) || null;
//
//       // Собираем данные строго по спецификации API
//       const courseData = {
//         title: values.title.trim(),
//         description: values.description.trim(),
//         categoryId: values.categoryId || null,
//         tags: tags, // API ожидает TagDto[] | null
//       };
//
//       await courseApi.createCourse(courseData);
//
//       message.success("Курс успешно создан!");
//       form.resetFields();
//       navigate("/courses");
//     } catch (error) {
//       if (error instanceof Error) {
//         message.error(error.message);
//       } else {
//         message.error("Ошибка при создании курса");
//       }
//       console.error("Ошибка создания курса:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // Обработка ошибок валидации
//   const onFinishFailed = () => {
//     message.warning("Пожалуйста, заполните все обязательные поля");
//   };
//
//   return (
//     <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
//       <Content
//         style={{
//           padding: "24px",
//           maxWidth: "800px",
//           margin: "0 auto",
//           width: "100%",
//         }}
//       >
//         <Card>
//           <Title
//             level={2}
//             style={{ marginBottom: "24px", textAlign: "center" }}
//           >
//             Создание нового курса
//           </Title>
//
//           <Spin spinning={loadingCategories} tip="Загрузка категорий...">
//             <Form
//               form={form}
//               layout="vertical"
//               onFinish={onFinish}
//               onFinishFailed={onFinishFailed}
//               requiredMark="optional"
//             >
//               {/* Название курса - required, minLength 2 */}
//               <Form.Item
//                 label="Название курса"
//                 name="title"
//                 rules={[
//                   { required: true, message: "Введите название курса" },
//                   { min: 2, message: "Минимум 2 символа" },
//                   { max: 100, message: "Максимум 100 символов" },
//                   {
//                     whitespace: true,
//                     message: "Название не может состоять из пробелов",
//                   },
//                 ]}
//                 hasFeedback
//               >
//                 <Input
//                   placeholder="Например: Основы программирования"
//                   size="large"
//                   disabled={loading}
//                 />
//               </Form.Item>
//
//               {/* Описание - required, minLength 10 */}
//               <Form.Item
//                 label="Описание курса"
//                 name="description"
//                 rules={[
//                   { required: true, message: "Введите описание курса" },
//                   { min: 10, message: "Минимум 10 символов" },
//                   { max: 2000, message: "Максимум 2000 символов" },
//                 ]}
//                 hasFeedback
//               >
//                 <TextArea
//                   rows={5}
//                   placeholder="Подробно опишите содержание курса (минимум 10 символов)"
//                   showCount
//                   maxLength={2000}
//                   disabled={loading}
//                 />
//               </Form.Item>
//
//               {/* Категория - optional */}
//               <Form.Item label="Категория" name="categoryId">
//                 <Select
//                   placeholder="Выберите категорию (необязательно)"
//                   allowClear
//                   loading={loadingCategories}
//                   disabled={loading}
//                   size="large"
//                 >
//                   {categories.map((cat) => (
//                     <Option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//
//               {/* Теги - преобразуются в TagDto[] на бэке */}
//               <Form.Item
//                 label="Теги"
//                 name="tags"
//                 tooltip="Введите теги и нажмите Enter для добавления"
//               >
//                 <Select
//                   mode="tags"
//                   placeholder="Введите теги и нажмите Enter"
//                   style={{ width: "100%" }}
//                   disabled={loading}
//                   size="large"
//                   tokenSeparators={[","]}
//                   maxTagCount={10}
//                 />
//               </Form.Item>
//
//               {/* Кнопки */}
//               <Form.Item>
//                 <Space
//                   size="middle"
//                   style={{ display: "flex", justifyContent: "flex-end" }}
//                 >
//                   <Button
//                     size="large"
//                     onClick={() => navigate(-1)}
//                     disabled={loading}
//                   >
//                     Отмена
//                   </Button>
//                   <Button
//                     size="large"
//                     onClick={() => form.resetFields()}
//                     disabled={loading}
//                   >
//                     Очистить
//                   </Button>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     icon={<SaveOutlined />}
//                     loading={loading}
//                     size="large"
//                   >
//                     {loading ? "Создание..." : "Создать курс"}
//                   </Button>
//                 </Space>
//               </Form.Item>
//             </Form>
//           </Spin>
//         </Card>
//       </Content>
//     </Layout>
//   );
// };
//
// export default CourseCreationPage;
//
// // const { Content } = Layout;
// // const { Title, Text } = Typography;
// // const { Option } = Select;
// // const { TextArea } = Input;
//
// // const CourseCreationPage = () => {
// //   const navigate = useNavigate();
// //   const [form] = Form.useForm<CourseFormData>();
// //   // const [menuSelected, setMenuSelected] = useState('courses');
// //   const [courseImage, setCourseImage] = useState<string | null>(null);
// //   const [showPriceSection, setShowPriceSection] = useState(false);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
//
// //   // // Моковые данные существующих курсов
// //   // const existingCourses = [
// //   //   { id: 1, title: 'React Advanced', status: 'published', students: 245, updated: '2 дня назад' },
// //   //   { id: 2, title: 'TypeScript Basics', status: 'draft', students: 0, updated: '1 час назад' },
// //   //   { id: 3, title: 'Node.js API', status: 'published', students: 189, updated: 'неделю назад' },
// //   // ];
//
// //   const categories = [
// //     "Программирование",
// //     "Дизайн",
// //     "Data Science",
// //     "Маркетинг",
// //     "Бизнес",
// //   ];
//
// //   const levels = [
// //     { value: "beginner", label: "Начинающий" },
// //     { value: "intermediate", label: "Средний" },
// //     { value: "advanced", label: "Продвинутый" },
// //   ];
//
// //   const handleImageUpload = (info: any) => {
// //     if (info.file.status === "done") {
// //       message.success(`${info.file.name} успешно загружено`);
// //       if (info.file.originFileObj) {
// //         setCourseImage(URL.createObjectURL(info.file.originFileObj));
// //       }
// //     }
// //   };
//
// //   // const handleMenuClick = (key: string) => {
// //   //   setMenuSelected(key);
// //   // };
//
// //   const handleSaveDraft = async () => {
// //     try {
// //       const values = await form.validateFields();
// //       console.log("Сохранен черновик:", values);
// //       message.success("Черновик сохранен");
// //       navigate("/cource");
// //     } catch (error) {
// //       console.error("Ошибка валидации:", error);
// //       message.error("Заполните обязательные поля");
// //     }
// //   };
//
// //   const onFinish: FormProps<CourseFormData>["onFinish"] = async (
// //     values: CourseFormData
// //   ) => {
// //     setIsSubmitting(true);
// //     try {
// //       console.log("Данные курса:", values);
//
// //       const courseRequest: CourseRequest = {
// //         title: values.title,
// //         description: values.description,
// //         shortDescription:
// //           values.shortDescription ||
// //           values.description.substring(0, 100) +
// //             (values.description.length > 100 ? "..." : ""),
// //         category: values.category,
// //         level: values.level,
// //         imageUrl: courseImage || "https://via.placeholder.com/300x200",
// //         lessonsCount: values.lessonsCount || 0,
// //         duration: values.duration || "",
// //         format: values.format || "mixed",
// //         hasCertificate: values.hasCertificate || false,
// //         hasHomework: values.hasHomework || false,
// //         isPaid: values.isPaid || false,
// //         price: values.isPaid ? values.price || 0 : 0,
// //         discountedPrice: values.isPaid ? values.discountedPrice || 0 : 0,
// //         tags: values.tags || [],
// //       };
//
// //       const courseResponse = await courseApi.createCourse(courseRequest);
// //       console.log(courseResponse);
//
// //       if (courseResponse) {
// //         message.success("Черновик успешно создан!");
// //       }
//
// //       // else {
// //       //   message.success("Каие-то неполадки!");
// //       // }
// //     } catch (error) {
// //       console.error("Ошибка создания курса:", error);
// //       message.error("Ошибка при создании курса");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };
//
// //   const onFinishFailed: FormProps<CourseFormData>["onFinishFailed"] = (
// //     errorInfo
// //   ) => {
// //     console.log("Ошибка валидации:", errorInfo);
// //     message.error("Проверьте правильность заполнения формы");
// //   };
//
// //   const handleClearForm = () => {
// //     form.resetFields();
// //     setCourseImage(null);
// //     setShowPriceSection(false);
// //     message.info("Форма очищена");
// //   };
//
// //   return (
// //     <div
// //       style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
// //     >
// //       <Header />
//
// //       <Layout style={{ flex: 1, background: "#fafafa" }}>
// //         <Sidebar />
//
// //         {/* Основной контент */}
// //         <Content style={{ padding: "32px 40px", overflow: "auto" }}>
// //           <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
// //             {/* Заголовок */}
// //             <div
// //               style={{
// //                 display: "flex",
// //                 justifyContent: "space-between",
// //                 alignItems: "center",
// //                 marginBottom: "32px",
// //               }}
// //             >
// //               <div>
// //                 <Title level={2} style={{ margin: 0 }}>
// //                   Создание нового курса
// //                 </Title>
// //                 <Text type="secondary">Заполните информацию о курсе</Text>
// //               </div>
// //             </div>
//
// //             <Card style={{ marginBottom: 32, borderRadius: "12px" }}>
// //               <Form
// //                 id="course-form"
// //                 form={form}
// //                 layout="vertical"
// //                 onFinish={onFinish}
// //                 onFinishFailed={onFinishFailed}
// //                 size="large"
// //               >
// //                 {/* Основная информация */}
// //                 <div style={{ marginBottom: "32px" }}>
// //                   <Title level={4} style={{ marginBottom: "24px" }}>
// //                     Основная информация
// //                   </Title>
//
// //                   <Row gutter={24}>
// //                     <Col span={16}>
// //                       <Form.Item<CourseFormData>
// //                         label="Название курса"
// //                         name="title"
// //                         rules={[
// //                           { required: true, message: "Введите название курса" },
// //                         ]}
// //                       >
// //                         <Input
// //                           placeholder="Например: 'React с нуля до PRO'"
// //                           size="large"
// //                         />
// //                       </Form.Item>
//
// //                       <Form.Item<CourseFormData>
// //                         label="Описание курса"
// //                         name="description"
// //                         rules={[
// //                           { required: true, message: "Введите описание курса" },
// //                         ]}
// //                       >
// //                         <TextArea
// //                           placeholder="Опишите, чему научатся студенты"
// //                           rows={4}
// //                           maxLength={500}
// //                           showCount
// //                         />
// //                       </Form.Item>
// //                     </Col>
//
// //                     <Col span={8}>
// //                       <Form.Item<CourseFormData> label="Обложка курса">
// //                         <Upload
// //                           accept="image/*"
// //                           showUploadList={false}
// //                           customRequest={({ onSuccess }: any) => {
// //                             setTimeout(() => {
// //                               onSuccess("ok");
// //                             }, 0);
// //                           }}
// //                           onChange={handleImageUpload}
// //                         >
// //                           <div
// //                             style={{
// //                               width: "100%",
// //                               height: "180px",
// //                               border: "2px dashed #d9d9d9",
// //                               borderRadius: "8px",
// //                               display: "flex",
// //                               flexDirection: "column",
// //                               alignItems: "center",
// //                               justifyContent: "center",
// //                               background: courseImage
// //                                 ? `url(${courseImage}) center/cover`
// //                                 : "#fafafa",
// //                               cursor: "pointer",
// //                             }}
// //                           >
// //                             {!courseImage && (
// //                               <>
// //                                 <UploadOutlined
// //                                   style={{
// //                                     fontSize: "24px",
// //                                     color: "#999",
// //                                     marginBottom: "8px",
// //                                   }}
// //                                 />
// //                                 <Text type="secondary">Загрузить обложку</Text>
// //                               </>
// //                             )}
// //                           </div>
// //                         </Upload>
// //                       </Form.Item>
// //                     </Col>
// //                   </Row>
// //                 </div>
//
// //                 <Divider />
//
// //                 {/* Категории и уровень */}
// //                 <div style={{ marginBottom: "32px" }}>
// //                   <Title level={4} style={{ marginBottom: "24px" }}>
// //                     Категории и настройки
// //                   </Title>
//
// //                   <Row gutter={24}>
// //                     <Col span={12}>
// //                       <Form.Item<CourseFormData>
// //                         label="Категория"
// //                         name="category"
// //                         rules={[
// //                           { required: true, message: "Выберите категорию" },
// //                         ]}
// //                       >
// //                         <Select placeholder="Выберите категорию">
// //                           {categories.map((cat) => (
// //                             <Option key={cat} value={cat}>
// //                               {cat}
// //                             </Option>
// //                           ))}
// //                         </Select>
// //                       </Form.Item>
// //                     </Col>
//
// //                     <Col span={12}>
// //                       <Form.Item<CourseFormData>
// //                         label="Уровень сложности"
// //                         name="level"
// //                         rules={[
// //                           { required: true, message: "Выберите уровень" },
// //                         ]}
// //                       >
// //                         <Select placeholder="Выберите уровень сложности">
// //                           {levels.map((level) => (
// //                             <Option key={level.value} value={level.value}>
// //                               {level.label}
// //                             </Option>
// //                           ))}
// //                         </Select>
// //                       </Form.Item>
// //                     </Col>
// //                   </Row>
//
// //                   <Form.Item<CourseFormData> label="Теги (до 5)" name="tags">
// //                     <Select
// //                       mode="tags"
// //                       placeholder="Добавьте теги, например: React, JavaScript"
// //                       maxTagCount={5}
// //                     />
// //                   </Form.Item>
// //                 </div>
//
// //                 <Divider />
//
// //                 {/* Содержание курса */}
// //                 <div style={{ marginBottom: "32px" }}>
// //                   <Title level={4} style={{ marginBottom: "24px" }}>
// //                     Содержание курса
// //                   </Title>
//
// //                   <Row gutter={24}>
// //                     <Col span={12}>
// //                       <Form.Item<CourseFormData>
// //                         label="Количество уроков"
// //                         name="lessonsCount"
// //                       >
// //                         <InputNumber
// //                           min={1}
// //                           placeholder="Например: 24"
// //                           style={{ width: "100%" }}
// //                         />
// //                       </Form.Item>
// //                     </Col>
// //                     <Col span={12}>
// //                       <Form.Item<CourseFormData>
// //                         label="Общая длительность"
// //                         name="duration"
// //                       >
// //                         <Input
// //                           placeholder="Например: 36 часов"
// //                           style={{ width: "100%" }}
// //                         />
// //                       </Form.Item>
// //                     </Col>
// //                   </Row>
//
// //                   <Form.Item<CourseFormData>
// //                     label="Формат обучения"
// //                     name="format"
// //                   >
// //                     <Radio.Group>
// //                       <Radio value="video">Видеоуроки</Radio>
// //                       <Radio value="text">Текстовые уроки</Radio>
// //                       <Radio value="mixed">Смешанный формат</Radio>
// //                     </Radio.Group>
// //                   </Form.Item>
// //                 </div>
//
// //                 <Divider />
//
// //                 {/* Настройки курса */}
// //                 <div style={{ marginBottom: "32px" }}>
// //                   <Title level={4} style={{ marginBottom: "24px" }}>
// //                     Настройки курса
// //                   </Title>
//
// //                   <Row gutter={24}>
// //                     <Col span={12}>
// //                       <Form.Item<CourseFormData>
// //                         label="Сертификат об окончании"
// //                         name="hasCertificate"
// //                         valuePropName="checked"
// //                         initialValue={true}
// //                       >
// //                         <Switch />
// //                       </Form.Item>
// //                     </Col>
// //                     <Col span={12}>
// //                       <Form.Item<CourseFormData>
// //                         label="Домашние задания"
// //                         name="hasHomework"
// //                         valuePropName="checked"
// //                         initialValue={true}
// //                       >
// //                         <Switch />
// //                       </Form.Item>
// //                     </Col>
// //                   </Row>
// //                 </div>
//
// //                 <Divider />
//
// //                 {/* Цена курса (опционально) */}
// //                 <div style={{ marginBottom: "32px" }}>
// //                   <div
// //                     style={{
// //                       display: "flex",
// //                       justifyContent: "space-between",
// //                       alignItems: "center",
// //                       marginBottom: "24px",
// //                       cursor: "pointer",
// //                     }}
// //                     onClick={() => setShowPriceSection(!showPriceSection)}
// //                   >
// //                     <Title level={4} style={{ margin: 0 }}>
// //                       Настройки цены{" "}
// //                       {showPriceSection ? <UpOutlined /> : <DownOutlined />}
// //                     </Title>
// //                     <Form.Item<CourseFormData>
// //                       name="isPaid"
// //                       valuePropName="checked"
// //                       initialValue={false}
// //                       style={{ marginBottom: 0 }}
// //                     >
// //                       <Switch
// //                         onChange={(checked) => {
// //                           if (checked) {
// //                             setShowPriceSection(true);
// //                           } else {
// //                             setShowPriceSection(false);
// //                           }
// //                         }}
// //                         checkedChildren="Платный"
// //                         unCheckedChildren="Бесплатный"
// //                       />
// //                     </Form.Item>
// //                   </div>
//
// //                   {showPriceSection && form.getFieldValue("isPaid") && (
// //                     <Row gutter={24}>
// //                       <Col span={12}>
// //                         <Form.Item<CourseFormData>
// //                           label="Цена курса"
// //                           name="price"
// //                           rules={[{ required: true, message: "Укажите цену" }]}
// //                         >
// //                           <InputNumber
// //                             min={0}
// //                             style={{ width: "100%" }}
// //                             placeholder="0"
// //                             formatter={(value) =>
// //                               `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
// //                             }
// //                             prefix="₽"
// //                           />
// //                         </Form.Item>
// //                       </Col>
// //                       <Col span={12}>
// //                         <Form.Item<CourseFormData>
// //                           label="Цена со скидкой"
// //                           name="discountedPrice"
// //                         >
// //                           <InputNumber
// //                             min={0}
// //                             style={{ width: "100%" }}
// //                             placeholder="Укажите, если есть скидка"
// //                             prefix="₽"
// //                           />
// //                         </Form.Item>
// //                       </Col>
// //                     </Row>
// //                   )}
// //                 </div>
//
// //                 {/* Кнопки формы */}
// //                 <div
// //                   style={{
// //                     display: "flex",
// //                     justifyContent: "space-between",
// //                     marginTop: "40px",
// //                     paddingTop: "24px",
// //                     borderTop: "1px solid #f0f0f0",
// //                   }}
// //                 >
// //                   <Button
// //                     icon={<DeleteOutlined />}
// //                     danger
// //                     onClick={handleClearForm}
// //                     disabled={isSubmitting}
// //                   >
// //                     Очистить форму
// //                   </Button>
//
// //                   <Space>
// //                     <Button
// //                       type="primary"
// //                       htmlType="submit"
// //                       icon={<SaveOutlined />}
// //                       size="large"
// //                       onClick={handleSaveDraft}
// //                       disabled={isSubmitting}
// //                     >
// //                       Сохранить черновик
// //                     </Button>
// //                     <Button
// //                       type="primary"
// //                       htmlType="submit"
// //                       form="course-form"
// //                       size="large"
// //                       style={{ background: gradients.primary, border: "none" }}
// //                       loading={isSubmitting}
// //                     >
// //                       Опубликовать курс
// //                     </Button>
// //                   </Space>
// //                 </div>
// //               </Form>
// //             </Card>
//
// //             {/* Подсказки */}
// //             <Card style={{ borderRadius: "12px" }}>
// //               <Title level={5} style={{ marginBottom: "16px" }}>
// //                 💡 Советы по созданию курса
// //               </Title>
// //               <ul style={{ margin: 0, paddingLeft: "20px" }}>
// //                 <li>
// //                   <Text>Добавьте качественную обложку</Text>
// //                 </li>
// //                 <li>
// //                   <Text>Четко опишите, чему научатся студенты</Text>
// //                 </li>
// //                 <li>
// //                   <Text>Выберите правильный уровень сложности</Text>
// //                 </li>
// //                 <li>
// //                   <Text>Добавьте теги для лучшего поиска</Text>
// //                 </li>
// //               </ul>
// //             </Card>
// //           </div>
// //         </Content>
// //       </Layout>
//
// //       <Footer />
// //     </div>
// //   );
// // };
//
// // export default CourseCreationPage;
