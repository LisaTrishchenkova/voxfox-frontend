import { useRef, useState } from "react";
import { Button, Modal, Input, Tooltip, Typography } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "./markdownComponents";

const { Text } = Typography;

interface MarkdownEditorProps {
    value: string;
    onChange: (val: string) => void;
    minHeight?: number;
}

interface ToolbarItem {
    label: string;
    title: string;
    action: (selected: string) => { text: string; offset: number };
}

const TOOLBAR: ToolbarItem[] = [
    { label: "B",         title: "Жирный текст",               action: (sel) => ({ text: `**${sel || "жирный текст"}**`, offset: sel ? 0 : 2 }) },
    { label: "I",         title: "Курсив",                     action: (sel) => ({ text: `*${sel || "курсив"}*`, offset: sel ? 0 : 1 }) },
    { label: "S",         title: "Зачёркнутый текст",          action: (sel) => ({ text: `~~${sel || "зачёркнутый"}~~`, offset: sel ? 0 : 2 }) },
    { label: "H1",        title: "Заголовок 1",                action: (sel) => ({ text: `# ${sel || "Заголовок"}`, offset: sel ? 0 : 2 }) },
    { label: "H2",        title: "Заголовок 2",                action: (sel) => ({ text: `## ${sel || "Заголовок"}`, offset: sel ? 0 : 3 }) },
    { label: "H3",        title: "Заголовок 3",                action: (sel) => ({ text: `### ${sel || "Заголовок"}`, offset: sel ? 0 : 4 }) },
    { label: "—",         title: "Горизонтальный разделитель", action: () => ({ text: "\n---\n", offset: 0 }) },
    { label: "• Список",  title: "Маркированный список",       action: (sel) => ({ text: sel ? sel.split("\n").map((l) => `- ${l}`).join("\n") : "- Пункт 1\n- Пункт 2\n- Пункт 3", offset: sel ? 0 : 2 }) },
    { label: "1. Список", title: "Нумерованный список",        action: (sel) => ({ text: sel ? sel.split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n") : "1. Пункт\n2. Пункт\n3. Пункт", offset: sel ? 0 : 3 }) },
    { label: "> Цитата",  title: "Цитата",                     action: (sel) => ({ text: `> ${sel || "цитата"}`, offset: sel ? 0 : 2 }) },
    { label: "`код`",     title: "Строчный код",               action: (sel) => ({ text: `\`${sel || "код"}\``, offset: sel ? 0 : 1 }) },
    { label: "```блок```",title: "Блок кода",                  action: (sel) => ({ text: `\`\`\`\n${sel || "код"}\n\`\`\``, offset: sel ? 0 : 4 }) },
    { label: "🔗 Ссылка", title: "Ссылка",                     action: (sel) => ({ text: `[${sel || "текст ссылки"}](url)`, offset: sel ? 0 : 1 }) },
];

const MarkdownEditor = ({ value, onChange, minHeight = 320 }: MarkdownEditorProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [videoLabel, setVideoLabel] = useState("");

    const insertAtCursor = (text: string, cursorOffset?: number) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const before = value.slice(0, start);
        const after = value.slice(end);
        const needsNewline = before.length > 0 && !before.endsWith("\n");
        const prefix = needsNewline ? "\n" : "";
        onChange(before + prefix + text + after);
        requestAnimationFrame(() => {
            ta.focus();
            const pos = start + prefix.length + (cursorOffset ?? text.length);
            ta.setSelectionRange(pos, pos);
        });
    };

    const insertText = (item: ToolbarItem) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = value.slice(start, end);
        const { text, offset } = item.action(selected);
        const before = value.slice(0, start);
        const after = value.slice(end);
        const needsNewline =
            before.length > 0 &&
            !before.endsWith("\n") &&
            (text.startsWith("#") || text.startsWith("-") || text.startsWith(">") ||
                text.startsWith("1.") || text.startsWith("---") || text.startsWith("```"));
        const prefix = needsNewline ? "\n" : "";
        onChange(before + prefix + text + after);
        requestAnimationFrame(() => {
            ta.focus();
            if (!selected) {
                const cursorPos = start + prefix.length + offset;
                ta.setSelectionRange(cursorPos, cursorPos + (text.length - offset * 2));
            } else {
                ta.setSelectionRange(start + prefix.length, start + prefix.length + text.length);
            }
        });
    };

    const handleInsertVideo = () => {
        const url = videoUrl.trim();
        if (!url) return;
        const label = videoLabel.trim() || "Видео";
        insertAtCursor(`\n[${label}](${url})\n`);
        setVideoUrl("");
        setVideoLabel("");
        setVideoModalOpen(false);
    };

    const detectPlatform = (url: string): string => {
        if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
        if (url.includes("vimeo.com")) return "Vimeo";
        if (url.includes("vkvideo.ru") || url.includes("vk.com")) return "ВКонтакте";
        if (/\.(mp4|webm|ogg)/i.test(url)) return "Видео-файл";
        return "";
    };

    const platform = detectPlatform(videoUrl.trim());

    return (
        <div style={{ border: "1px solid #d9d9d9", borderRadius: 8, overflow: "hidden" }}>
            {/* Тулбар */}
            <div style={{
                display: "flex", flexWrap: "wrap", gap: 2,
                padding: "6px 8px", background: "#fafafa",
                borderBottom: "1px solid #e8e8e8", alignItems: "center",
            }}>
                {TOOLBAR.map((item, i) => (
                    <Tooltip key={i} title={item.title} mouseEnterDelay={0.4} color="#333333">
                        <Button
                            size="small"
                            type="text"
                            style={{
                                fontWeight: item.label === "B" ? 700 : 400,
                                fontStyle: item.label === "I" ? "italic" : "normal",
                                textDecoration: item.label === "S" ? "line-through" : "none",
                                fontSize: item.label.startsWith("H") ? 11 : 12,
                                minWidth: 32,
                                height: 26,
                                color: "#333",
                            }}
                            onMouseDown={(e) => { e.preventDefault(); insertText(item); }}
                        >
                            {item.label}
                        </Button>
                    </Tooltip>
                ))}

                <div style={{ width: 1, height: 20, background: "#e8e8e8", margin: "0 4px" }} />

                <Tooltip title="Вставить видео" mouseEnterDelay={0.4} color="#333333">
                    <Button
                        size="small"
                        type="text"
                        icon={<VideoCameraOutlined />}
                        style={{ height: 26, color: "#389e0d", fontWeight: 500 }}
                        onMouseDown={(e) => { e.preventDefault(); setVideoModalOpen(true); }}
                    >
                        Видео
                    </Button>
                </Tooltip>
            </div>

            {/* Split-panel */}
            <div style={{ display: "flex", height: minHeight }}>
                <div style={{ flex: 1, borderRight: "1px solid #e8e8e8", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "4px 10px", background: "#f5f5f5", borderBottom: "1px solid #e8e8e8", fontSize: 11, color: "#888" }}>
                        Редактор (Markdown)
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        style={{
                            flex: 1, padding: "12px 14px", border: "none", outline: "none",
                            resize: "none",
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            fontSize: 13, lineHeight: 1.7, background: "#fff", color: "#1f1f1f",
                        }}
                        placeholder={
                            "# Мой первый заголовок\n\n" +
                            "Привет! Вот как пользоваться редактором:\n\n" +
                            "## Быстрое форматирование, используйте кнопки на панели чтобы сделать разработку проще:\n" +
                            "**жирный текст** | *курсив* | `код` | ~~зачёркнутый~~\n\n" +
                            "## Списки:\n" +
                            "- Маркированный список (кнопка • Список)\n" +
                            "1. Нумерованный список (кнопка 1. Список)\n\n" +
                            "## Ссылки (можете вставлять или напряму или использовать панель для вставки видео или ссылок)\n\n\n" +
                            "💡 Совет: Выделите текст и нажмите нужную кнопку!"
                        }                        spellCheck={false}
                    />
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ padding: "4px 10px", background: "#f5f5f5", borderBottom: "1px solid #e8e8e8", fontSize: 11, color: "#888" }}>
                        Предпросмотр
                    </div>
                    <div style={{ flex: 1, padding: "12px 16px", overflowY: "auto", background: "#fff" }}>
                        {value.trim() ? (
                            <div className="markdown-preview">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                    {value}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                Предпросмотр появится здесь...
                            </Text>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ padding: "4px 12px", background: "#fafafa", borderTop: "1px solid #e8e8e8", fontSize: 11, color: "#aaa", textAlign: "right" }}>
                {value.length} символов
            </div>

            <Modal
                open={videoModalOpen}
                title="Вставить видео"
                onCancel={() => { setVideoModalOpen(false); setVideoUrl(""); setVideoLabel(""); }}
                onOk={handleInsertVideo}
                okText="Вставить"
                cancelText="Отмена"
                centered
                okButtonProps={{ style: { background: "rgba(0,100,0,0.8)" }, disabled: !videoUrl.trim() }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                    <div>
                        <Text strong style={{ display: "block", marginBottom: 6 }}>Ссылка на видео</Text>
                        <Input
                            placeholder="https://youtu.be/... или https://vkvideo.ru/... или .mp4"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            onPressEnter={handleInsertVideo}
                        />
                        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                            Поддерживаются: YouTube, ВКонтакте, прямые ссылки на mp4/webm
                        </Text>
                    </div>

                    <div>
                        <Text strong style={{ display: "block", marginBottom: 6 }}>Подпись (необязательно)</Text>
                        <Input
                            placeholder="Название видео"
                            value={videoLabel}
                            onChange={(e) => setVideoLabel(e.target.value)}
                        />
                    </div>

                    {videoUrl.trim() && (
                        <div style={{
                            background: "#f6ffed", border: "1px solid #b7eb8f",
                            borderRadius: 6, padding: "10px 12px",
                        }}>
                            {platform && (
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                                    Определено: <strong>{platform}</strong>
                                </Text>
                            )}
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                В тексте: <code>[{videoLabel || "Видео"}]({videoUrl.trim()})</code>
                            </Text>
                            {(videoUrl.includes("vk.com/video") || videoUrl.includes("vkvideo.ru/video-")) &&
                                !videoUrl.includes("video_ext.php") && (
                                    <div style={{
                                        marginTop: 8, padding: "6px 10px",
                                        background: "#fffbe6", border: "1px solid #ffe58f",
                                        borderRadius: 4,
                                    }}>
                                        <Text style={{ fontSize: 11, color: "#ad6800" }}>
                                            ⚠️ Для ВКонтакте используйте embed-ссылку:
                                            Нажмите "Поделиться" → "Код для встраивания" → скопируйте src из iframe
                                        </Text>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default MarkdownEditor;