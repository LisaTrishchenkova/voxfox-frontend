import { InputNumber, Modal, Typography } from "antd";
import { useState } from "react";
import { balanceApi } from "../api/balanceApi";

const { Text } = Typography;

interface TopUpModalProps {
    open: boolean;
    currentBalance: number;
    onClose: () => void;
    onSuccess: (newBalance: number) => void;
}

const TopUpModal = ({ open, currentBalance, onClose, onSuccess }: TopUpModalProps) => {
    const [amount, setAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTopUp = async () => {
        if (!amount || amount <= 0) return;
        setLoading(true);
        const data = await balanceApi.topUp(amount);
        if (data) {
            onSuccess(data.balance);
            setAmount(null);
            onClose();
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setAmount(null);
        onClose();
    };

    return (
        <Modal
            open={open}
            title="Пополнение баланса"
            onCancel={handleCancel}
            onOk={handleTopUp}
            okText="Пополнить"
            cancelText="Отмена"
            okButtonProps={{
                loading,
                disabled: !amount || amount <= 0,
                style: { background: "rgba(0,100,0,0.8)" },
            }}
            centered
            width={360}
        >
            <div style={{ padding: "12px 0" }}>
                <Text type="secondary" style={{ display: "block", marginBottom: 10, fontSize: 13 }}>
                    Текущий баланс:{" "}
                    <Text strong>{currentBalance.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽</Text>
                </Text>
                <InputNumber
                    value={amount}
                    onChange={(v) => setAmount(v)}
                    min={1}
                    max={1_000_000}
                    placeholder="Введите сумму"
                    style={{ width: "100%" }}
                    size="large"
                    addonAfter="₽"
                    autoFocus
                />
            </div>
        </Modal>
    );
};

export default TopUpModal;