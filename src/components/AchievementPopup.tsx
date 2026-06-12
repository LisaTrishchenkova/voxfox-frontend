import { Modal, Typography } from "antd";
import { useState } from "react";

const { Text, Title } = Typography;

export interface NewAchievement {
    code: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
}

interface Props {
    achievements: NewAchievement[];
    onClose: () => void;
}

// key пробрасывается снаружи чтобы сбрасывать current при новом наборе ачивок
const AchievementPopup = ({ achievements, onClose }: Props) => {
    const [current, setCurrent] = useState(0);

    if (achievements.length === 0) return null;

    const achievement = achievements[current];
    const hasNext = current < achievements.length - 1;

    const handleNext = () => {
        if (hasNext) setCurrent((p) => p + 1);
        else onClose();
    };

    return (
        <Modal
            open={true}
            onCancel={onClose}
            footer={null}
            centered
            width={380}
            styles={{ body: { padding: "32px 28px 24px", textAlign: "center" } }}
        >
            <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>{achievement.icon}</div>

            <div style={{
                display: "inline-block",
                background: "rgba(0,100,0,0.08)",
                color: "rgba(0,100,0,0.85)",
                borderRadius: 20,
                padding: "2px 14px",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 12,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
            }}>
                Новое достижение
            </div>

            <Title level={3} style={{ margin: "0 0 8px", color: "#1a1a1a" }}>
                {achievement.title}
            </Title>
            <Text type="secondary" style={{ fontSize: 14, display: "block", marginBottom: 24 }}>
                {achievement.description}
            </Text>

            {achievements.length > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
                    {achievements.map((_, i) => (
                        <div key={i} style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: i === current ? "rgba(0,100,0,0.85)" : "#e0e0e0",
                            transition: "background 0.2s",
                        }} />
                    ))}
                </div>
            )}

            <button
                onClick={handleNext}
                style={{
                    width: "100%",
                    padding: "10px 0",
                    background: "rgba(0,100,0,0.85)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                }}
            >
                {hasNext ? "Следующее →" : "Отлично!"}
            </button>
        </Modal>
    );
};

export default AchievementPopup;