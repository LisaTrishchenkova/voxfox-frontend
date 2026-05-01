import {
    BellOutlined,
    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Button,
    Empty,
    List,
    Popover,
    Spin,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "../api/notificationApi";
import type {
    NotificationDto,
    NotificationType,
} from "../api/types/notification";

const { Text } = Typography;

const POLL_INTERVAL = 30_000;

function getNavigationPath(
    type: NotificationType,
    relatedEntityId: string | null,
    relatedCourseId: string | null
): string | null {
    switch (type) {
        case "CourseApproved":
        case "CourseRejected":
            return relatedEntityId ? `/course/${relatedEntityId}` : null;
        case "NewQuestion":
        case "QuestionAnswered": {
            if (!relatedCourseId) return null;
            const qs = relatedEntityId ? `?questionId=${relatedEntityId}` : "";
            return `/course/${relatedCourseId}/learn${qs}`;
        }
        default:
            return null;
    }
}

function getTypeTag(type: NotificationType) {
    const map: Record<NotificationType, { color: string; label: string }> = {
        CourseApproved:   { color: "green",  label: "Курс одобрен" },
        CourseRejected:   { color: "red",    label: "Курс отклонён" },
        NewQuestion:      { color: "blue",   label: "Вопрос" },
        QuestionAnswered: { color: "purple", label: "Ответ" },
    };
    const cfg = map[type] ?? { color: "default", label: type };
    return (
        <Tag color={cfg.color} style={{ fontSize: 11, marginBottom: 2 }}>
            {cfg.label}
        </Tag>
    );
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60_000);
    if (m < 1) return "только что";
    if (m < 60) return `${m} мин назад`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} ч назад`;
    return `${Math.floor(h / 24)} д назад`;
}

const NotificationBell = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchCount = useCallback(async () => {
        const count = await notificationApi.getUnreadCount();
        setUnreadCount(count);
    }, []);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const data = await notificationApi.getMyNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
        setLoading(false);
    }, []);

    useEffect(() => {
        const init = async () => {
            await fetchCount();
        };
        void init();
        pollRef.current = setInterval(() => {
            void fetchCount();
        }, POLL_INTERVAL);
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [fetchCount]);

    useEffect(() => {
        if (!open) return;
        const load = async () => {
            await fetchAll();
        };
        void load();
    }, [open, fetchAll]);

    const handleMarkRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await notificationApi.markAsRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
    };

    const handleMarkAllRead = async () => {
        await notificationApi.markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
    };

    const handleItemClick = async (notification: NotificationDto) => {
        if (!notification.isRead) {
            await notificationApi.markAsRead(notification.id);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notification.id ? { ...n, isRead: true } : n
                )
            );
            setUnreadCount((c) => Math.max(0, c - 1));
        }
        const path = getNavigationPath(
            notification.type,
            notification.relatedEntityId,
            notification.relatedCourseId
        );
        if (path) {
            setOpen(false);
            navigate(path);
        }
    };

    const content = (
        <div style={{ width: 360 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0 12px",
                    borderBottom: "1px solid #f0f0f0",
                    marginBottom: 4,
                }}
            >
                <Text strong style={{ fontSize: 15 }}>
                    Уведомления
                </Text>
                {unreadCount > 0 && (
                    <Tooltip title="Отметить все прочитанными">
                        <Button
                            size="small"
                            type="text"
                            icon={<CheckOutlined />}
                            onClick={handleMarkAllRead}
                            style={{ color: "#52c41a" }}
                        >
                            Все прочитаны
                        </Button>
                    </Tooltip>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <Spin size="small" />
                </div>
            ) : notifications.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Нет уведомлений"
                    style={{ padding: "16px 0" }}
                />
            ) : (
                <List
                    dataSource={notifications}
                    style={{ maxHeight: 400, overflowY: "auto" }}
                    renderItem={(item) => {
                        const navigable = !!getNavigationPath(
                            item.type,
                            item.relatedEntityId,
                            item.relatedCourseId
                        );
                        const bgDefault = item.isRead ? "transparent" : "#f6ffed";
                        const bgHover = item.isRead ? "#fafafa" : "#d9f7be";

                        return (
                            <List.Item
                                key={item.id}
                                style={{
                                    padding: "10px 8px",
                                    cursor: navigable ? "pointer" : "default",
                                    background: bgDefault,
                                    borderRadius: 8,
                                    marginBottom: 2,
                                    transition: "background 0.2s",
                                    alignItems: "flex-start",
                                    gap: 8,
                                }}
                                onClick={() => handleItemClick(item)}
                                onMouseEnter={(e) => {
                                    if (navigable)
                                        (e.currentTarget as HTMLElement).style.background = bgHover;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = bgDefault;
                                }}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {getTypeTag(item.type)}
                                    <div
                                        style={{
                                            fontWeight: item.isRead ? 400 : 600,
                                            fontSize: 13,
                                            marginBottom: 2,
                                        }}
                                    >
                                        {item.title}
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {item.message}
                                    </Text>
                                    <div style={{ marginTop: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            {timeAgo(item.createdAt)}
                                        </Text>
                                        {navigable && (
                                            <Text
                                                style={{
                                                    fontSize: 11,
                                                    color: "#52c41a",
                                                    marginLeft: 8,
                                                }}
                                            >
                                                Перейти →
                                            </Text>
                                        )}
                                    </div>
                                </div>

                                {!item.isRead && (
                                    <Tooltip title="Отметить прочитанным">
                                        <Button
                                            size="small"
                                            type="text"
                                            icon={<CloseOutlined style={{ fontSize: 10 }} />}
                                            onClick={(e) => handleMarkRead(item.id, e)}
                                            style={{
                                                color: "#bfbfbf",
                                                flexShrink: 0,
                                                marginTop: 2,
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            </List.Item>
                        );
                    }}
                />
            )}
        </div>
    );

    return (
        <Popover
            content={content}
            trigger="click"
            open={open}
            onOpenChange={setOpen}
            placement="bottomRight"
            arrow={false}
            style={{ padding: "8px 12px" }}
        >
            <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                <Button
                    type="text"
                    icon={
                        <BellOutlined
                            style={{
                                fontSize: 20,
                                color: unreadCount > 0 ? "#52c41a" : "#8c8c8c",
                            }}
                        />
                    }
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                />
            </Badge>
        </Popover>
    );
};

export default NotificationBell;
