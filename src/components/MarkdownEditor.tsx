import { useRef } from "react";
import { Button, Tooltip, Typography } from "antd";
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
    { label: "B",          title: "Жирный текст",               action: (sel) => ({ text: `**${sel || "жирный текст"}**`, offset: sel ? 0 : 2 }) },
    { label: "I",          title: "Курсив",                     action: (sel) => ({ text: `*${sel || "курсив"}*`, offset: sel ? 0 : 1 }) },
    { label: "S",          title: "Зачёркнутый текст",          action: (sel) => ({ text: `~~${sel || "зачёркнутый"}~~`, offset: sel ? 0 : 2 }) },
    { label: "H1",         title: "Заголовок 1",                action: (sel) => ({ text: `# ${sel || "Заголовок"}`, offset: sel ? 0 : 2 }) },
    { label: "H2",         title: "Заголовок 2",                action: (sel) => ({ text: `## ${sel || "Заголовок"}`, offset: sel ? 0 : 3 }) },
    { label: "H3",         title: "Заголовок 3",                action: (sel) => ({ text: `### ${sel || "Заголовок"}`, offset: sel ? 0 : 4 }) },
    { label: "—",          title: "Горизонтальный разделитель", action: () => ({ text: "\n---\n", offset: 0 }) },
    { label: "• Список",   title: "Маркированный список",       action: (sel) => ({ text: sel ? sel.split("\n").map((l) => `- ${l}`).join("\n") : "- Пункт 1\n- Пункт 2\n- Пункт 3", offset: sel ? 0 : 2 }) },
    { label: "1. Список",  title: "Нумерованный список",        action: (sel) => ({ text: sel ? sel.split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n") : "1. Пункт\n2. Пункт\n3. Пункт", offset: sel ? 0 : 3 }) },
    { label: "> Цитата",   title: "Цитата",                     action: (sel) => ({ text: `> ${sel || "цитата"}`, offset: sel ? 0 : 2 }) },
    { label: "`код`",      title: "Строчный код",               action: (sel) => ({ text: `\`${sel || "код"}\``, offset: sel ? 0 : 1 }) },
    { label: "```блок```", title: "Блок кода",                  action: (sel) => ({ text: `\`\`\`\n${sel || "код"}\n\`\`\``, offset: sel ? 0 : 4 }) },
    { label: "🔗 Ссылка",  title: "Ссылка",                     action: (sel) => ({ text: `[${sel || "текст ссылки"}](url)`, offset: sel ? 0 : 1 }) },
];

// Определяем является ли строка ссылкой на изображение
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif|svg|bmp|avif)(\?.*)?$/i;
const isImageUrl = (url: string) =>
    IMAGE_EXTENSIONS.test(url.trim()) && /^https?:\/\//i.test(url.trim());

const MarkdownEditor = ({ value, onChange, minHeight = 320 }: MarkdownEditorProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    // При вставке (paste) — если вставляют ссылку на картинку, оборачиваем в ![]()
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const pasted = e.clipboardData.getData("text");
        if (!isImageUrl(pasted)) return;

        e.preventDefault();
        const ta = textareaRef.current;
        if (!ta) return;

        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const before = value.slice(0, start);
        const after = value.slice(end);
        const needsNewline = before.length > 0 && !before.endsWith("\n");
        const prefix = needsNewline ? "\n" : "";
        const imageMarkdown = `![](${pasted.trim()})`;
        const newValue = before + prefix + imageMarkdown + "\n" + after;
        onChange(newValue);

        requestAnimationFrame(() => {
            ta.focus();
            const pos = start + prefix.length + imageMarkdown.length + 1;
            ta.setSelectionRange(pos, pos);
        });
    };

    // При каждом изменении — конвертируем голые URL картинок в markdown-изображения
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const ta = textareaRef.current;
        const cursorPos = ta?.selectionStart ?? 0;

        // Ищем строки которые являются голым URL картинки (не обёрнуты в ![] или [])
        const converted = newValue.replace(
            /^(https?:\/\/\S+\.(?:jpg|jpeg|png|webp|gif|svg|bmp|avif)(?:\?[^\s]*)?)$/gim,
            (match) => {
                // Не трогаем если уже обёрнуто в markdown
                const index = newValue.indexOf(match);
                const before = newValue.slice(0, index);
                if (before.endsWith("](") || before.endsWith("![")) return match;
                return `![](${match})`;
            }
        );

        if (converted !== newValue) {
            onChange(converted);
            // Восстанавливаем позицию курсора
            requestAnimationFrame(() => {
                if (ta) {
                    const diff = converted.length - newValue.length;
                    const newPos = cursorPos + diff;
                    ta.setSelectionRange(newPos, newPos);
                }
            });
        } else {
            onChange(newValue);
        }
    };

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
                        onChange={handleChange}
                        onPaste={handlePaste}
                        style={{
                            flex: 1, padding: "12px 14px", border: "none", outline: "none",
                            resize: "none",
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            fontSize: 13, lineHeight: 1.7, background: "#fff", color: "#1f1f1f",
                        }}
                        placeholder={
                            "# Мой первый заголовок\n\n" +
                            "Привет! Вот как пользоваться редактором:\n\n" +
                            "**жирный текст** | *курсив* | `код` | ~~зачёркнутый~~\n\n" +
                            "## Изображения\n" +
                            "Вставьте ссылку на картинку — она автоматически отобразится как изображение\n\n" +
                            "💡 Совет: Выделите текст и нажмите нужную кнопку!"
                        }
                        spellCheck={false}
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
        </div>
    );
};

export default MarkdownEditor;