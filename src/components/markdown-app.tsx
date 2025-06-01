import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface MarkdownAppProps {
  url?: string;
}

const MarkdownApp: React.FC<MarkdownAppProps> = ({ url = "/README.md" }) => {
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRemoteMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add more detailed error logging
        console.log("Attempting to fetch markdown from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "text/plain, text/markdown, */*",
            "Cache-Control": "no-cache",
          },
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const content = await response.text();
        console.log("Content length:", content.length);

        if (!content || content.trim().length === 0) {
          throw new Error("Received empty content");
        }

        setMarkdown(content);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch remote markdown"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRemoteMarkdown();
  }, [url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 !w-full flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Loading markdown...
          </h3>
          <p className="text-gray-500">Fetching content from {url}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 !w-full flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-red-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">
            Failed to load markdown
          </h3>
          <p className="text-red-600 mb-4">❌ {error}</p>
          <div className="text-sm text-gray-600">
            <p>
              Attempted URL:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">{url}</code>
            </p>
            <p className="mt-2">Check browser console for more details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-full bg-gray-50 rounded-lg p-4 !w-full">
      <div className="bg-white rounded-lg shadow-sm p-6 h-screen overflow-y-auto">
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");

                return match ? (
                  <SyntaxHighlighter
                    PreTag="div"
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    style={tomorrow}
                    showLineNumbers={true}
                    className="rounded-md"
                  />
                ) : (
                  <code
                    {...rest}
                    className={`${
                      className ?? ""
                    } bg-gray-100 px-1 py-0.5 rounded text-sm break-words whitespace-pre-wrap`}
                  >
                    {children}
                  </code>
                );
              },
              // Handle images properly for Vercel deployment
              img: ({ src, alt, ...props }) => {
                // Ensure images from public folder work on Vercel
                const imageSrc = src?.startsWith("/") ? src : `/${src}`;
                return (
                  <img
                    {...props}
                    src={imageSrc}
                    alt={alt}
                    className="max-w-full h-auto rounded-lg shadow-sm my-4"
                    onError={(e) => {
                      console.error("Image load error:", imageSrc);
                      // Fallback or hide broken images
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                );
              },
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold mb-6 text-gray-900 border-b pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-semibold mb-4 text-gray-800 mt-8">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-medium mb-3 text-gray-700 mt-6">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-gray-600 leading-relaxed text-lg">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 text-gray-600 space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="ml-4">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-6 my-6 italic text-gray-700 bg-blue-50 py-4 rounded-r-md">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gray-50">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody className="bg-white divide-y divide-gray-200">
                  {children}
                </tbody>
              ),
              tr: ({ children }) => <tr>{children}</tr>,
              th: ({ children }) => (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {children}
                </td>
              ),
              hr: () => <hr className="my-8 border-gray-300" />,
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownApp;
