// src/components/Sidebar.tsx
import { Layout, Menu, Button, Badge, Typography, ConfigProvider } from 'antd';
import { 
  PlusOutlined,
  BookOutlined,
  VideoCameraOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { gradients, customTheme, commonStyles } from '../theme';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  selectedMenu?: string;
  onMenuClick?: (key: string) => void;
  coursesCount?: number;
}

const Sidebar = ({ 
  selectedMenu = 'courses', 
  onMenuClick, 
  coursesCount = 0 
}: SidebarProps) => {
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    navigate('/cource-creating');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (onMenuClick) {
      onMenuClick(key);
    }
  };

  // Извлекаем значения из темы
  const themeToken = customTheme.token || {};
  const themeComponents = customTheme.components || {};

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeToken.colorPrimary,
          borderRadius: themeToken.borderRadius,
          colorBgContainer: themeToken.colorBgContainer,
        },
        components: {
          Menu: {
            itemBorderRadius: themeComponents.Menu?.itemBorderRadius,
            itemMarginInline: themeComponents.Menu?.itemMarginInline,
            itemMarginBlock: themeComponents.Menu?.itemMarginBlock,
          }
        }
      }}
    >
      <Sider
        width={260}
        style={{
          background: themeToken.colorBgContainer,
          borderRight: `1px solid ${themeToken.colorBorderSecondary}`,
          padding: `${themeToken.paddingLG}px 0`,
          minHeight: 'calc(100vh - 128px)',
          boxShadow: themeToken.boxShadowSecondary,
          display: 'flex',
          flexDirection: 'column' as const
        }}
      >
        {/* Кнопка создания курса */}
        <div style={{ 
          padding: `0 ${themeToken.paddingLG}px ${themeToken.paddingLG}px ${themeToken.paddingLG}px`, 
          borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
          flexShrink: 0
        }}>
          <Button 
            type="primary" 
            block 
            icon={<PlusOutlined />}
            size="large"
            style={{ 
              background: gradients.primary, 
              border: 'none', 
              height: 48,
              borderRadius: themeToken.borderRadius,
              fontWeight: themeComponents.Button?.fontWeight,
              fontFamily: 'inherit'
            }}
            onClick={handleCreateCourse}
          >
            Новый курс
          </Button>
        </div>

        {/* Меню */}
        <div style={{ flex: 1, overflow: 'auto', padding: `${themeToken.paddingXS}px 0` }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={handleMenuClick}
            style={{ 
              border: 'none'
            }}
          >
            <Menu.Item 
              key="courses" 
              icon={<BookOutlined />}
              style={{ 
                margin: `${themeComponents.Menu?.itemMarginBlock}px ${themeComponents.Menu?.itemMarginInline}px`,
                borderRadius: themeComponents.Menu?.itemBorderRadius,
                height: '48px',
                fontSize: themeToken.fontSizeLG,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={commonStyles.flexBetween}
              onClick={() => navigate("/cource")}>
                <span>Мои курсы</span>
                <Badge 
                  count={coursesCount} 
                  size="small" 
                  style={{ 
                    marginLeft: themeToken.paddingSM,
                    backgroundColor: themeToken.colorPrimary,
                    fontSize: themeComponents.Badge?.fontSizeSM
                  }} 
                />
              </div>
            </Menu.Item>
            
            <Menu.Item 
              key="lessons" 
              icon={<VideoCameraOutlined />}
              style={{ 
                margin: `${themeComponents.Menu?.itemMarginBlock}px ${themeComponents.Menu?.itemMarginInline}px`,
                borderRadius: themeComponents.Menu?.itemBorderRadius,
                height: '48px',
                fontSize: themeToken.fontSizeLG,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Уроки
            </Menu.Item>
            
            <Menu.Item 
              key="settings" 
              icon={<SettingOutlined />}
              style={{ 
                margin: `${themeComponents.Menu?.itemMarginBlock}px ${themeComponents.Menu?.itemMarginInline}px`,
                borderRadius: themeComponents.Menu?.itemBorderRadius,
                height: '48px',
                fontSize: themeToken.fontSizeLG,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Настройки
            </Menu.Item>
          </Menu>
        </div>

        {/* Быстрые подсказки */}
        <div style={{ 
          padding: `${themeToken.padding}px ${themeToken.paddingLG}px`, 
          marginTop: 'auto',
          borderTop: `1px solid ${themeToken.colorBorderSecondary}`,
          flexShrink: 0
        }}>
          <Text 
            type="secondary" 
            style={{ 
              fontSize: themeToken.fontSizeSM,
              color: themeToken.colorTextTertiary,
              lineHeight: themeToken.lineHeightSM
            }}
          >
            💡 Совет: Нажмите на курс, чтобы перейти к управлению уроками
          </Text>
        </div>
      </Sider>
    </ConfigProvider>
  );
};

export default Sidebar;