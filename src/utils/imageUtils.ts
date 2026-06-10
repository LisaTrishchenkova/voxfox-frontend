import { API_URL } from "../config";

export const getImageUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const origin = new URL(API_URL).origin;
    return `${origin}${url}`;
};

export const COVER_PLACEHOLDER_STYLE: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(0,100,0,0.15) 0%, rgba(0,100,0,0.35) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(0,100,0,0.5)",
    fontSize: 40,
};