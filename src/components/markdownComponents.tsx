import type { Components } from "react-markdown";

function toEmbedUrl(url: string): string | null {
    const ytShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;

    const ytLong = url.match(/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/);
    if (ytLong) return `https://www.youtube.com/embed/${ytLong[1]}`;

    if (url.match(/youtube\.com\/embed\//)) return url;

    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

    if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return url;

    return null;
}

function isVideoUrl(href: string): boolean {
    return (
        href.includes("youtube.com") ||
        href.includes("youtu.be") ||
        href.includes("vimeo.com") ||
        /\.(mp4|webm|ogg)(\?.*)?$/i.test(href)
    );
}

export const markdownComponents: Components = {
    a({ href, children }) {
        if (!href) return <a href={href}>{children}</a>;

        if (isVideoUrl(href)) {
            const embedUrl = toEmbedUrl(href);

            if (embedUrl && (embedUrl.includes("youtube.com/embed") || embedUrl.includes("vimeo.com"))) {
                return (
                    <div style={{ margin: "16px 0", borderRadius: 8, overflow: "hidden", lineHeight: 0 }}>
                        <iframe
                            src={embedUrl}
                            width="100%"
                            height="315"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ border: "none", display: "block" }}
                            title="video"
                        />
                    </div>
                );
            }

            if (embedUrl && /\.(mp4|webm|ogg)/i.test(embedUrl)) {
                return (
                    <div style={{ margin: "16px 0" }}>
                        <video
                            src={embedUrl}
                            controls
                            style={{ width: "100%", borderRadius: 8, maxHeight: 360 }}
                        />
                    </div>
                );
            }
        }

        return (
            <a href={href} target="_blank" rel="noreferrer">
                {children}
            </a>
        );
    },
};