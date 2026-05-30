import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import type { CertificateDto } from "../api/types/certificate";

interface CertificateViewProps {
    certificate: CertificateDto;
    onDownload: () => void;
    downloading?: boolean;
    /** Дополнительная кнопка снизу (например "К странице курса") */
    extraAction?: React.ReactNode;
}

const CertificateView = ({
                             certificate,
                             onDownload,
                             downloading = false,
                             extraAction,
                         }: CertificateViewProps) => {
    return (
        <div
            style={{
                background: "linear-gradient(135deg, #f0fff4 0%, #f6ffed 60%, #e6f9ee 100%)",
                border: "2px solid #b7eb8f",
                borderRadius: 16,
                padding: "48px 40px 40px",
                textAlign: "center",
                fontFamily: "'Segoe UI', Arial, sans-serif",
            }}
        >
            {/* Заголовок */}
            <div
                style={{
                    fontSize: 38,
                    fontWeight: 800,
                    color: "#16a34a",
                    letterSpacing: 2,
                    marginBottom: 8,
                }}
            >
                СЕРТИФИКАТ
            </div>

            <div
                style={{
                    fontSize: 15,
                    color: "#6b7280",
                    marginBottom: 36,
                }}
            >
                об успешном прохождении курса
            </div>

            {/* Разделитель */}
            <div
                style={{
                    width: 60,
                    height: 2,
                    background: "#86efac",
                    margin: "0 auto 32px",
                    borderRadius: 2,
                }}
            />

            <div style={{ fontSize: 14, color: "#374151", marginBottom: 16 }}>
                Настоящим подтверждается, что
            </div>

            {/* Имя */}
            <div
                style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 16,
                }}
            >
                {certificate.userName}
            </div>

            <div style={{ fontSize: 14, color: "#374151", marginBottom: 16 }}>
                успешно завершил(а) курс
            </div>

            {/* Название курса */}
            <div
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#16a34a",
                    marginBottom: 36,
                }}
            >
                «{certificate.courseTitle}»
            </div>

            {/* Разделитель */}
            <div
                style={{
                    width: 60,
                    height: 2,
                    background: "#86efac",
                    margin: "0 auto 24px",
                    borderRadius: 2,
                }}
            />

            {/* Дата */}
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
                Дата выдачи:{" "}
                {new Date(certificate.issuedAt).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })}
            </div>

            {/* Токен */}
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 32 }}>
                Токен верификации: {certificate.verificationToken}
            </div>

            {/* Кнопки */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    size="large"
                    loading={downloading}
                    style={{ background: "rgba(0,100,0,0.8)", border: "none" }}
                    onClick={onDownload}
                >
                    Скачать PDF
                </Button>
                {extraAction}
            </div>
        </div>
    );
};

export default CertificateView;
