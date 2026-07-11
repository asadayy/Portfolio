import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@/styles/markdown.css";

/**
 * Server-rendered markdown (project long descriptions, experience bullets).
 * react-markdown builds a React tree — no raw HTML pass-through — so stored
 * markdown can't inject script tags.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
