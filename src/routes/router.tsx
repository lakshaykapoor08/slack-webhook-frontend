import MarkdownApp from "@/components/markdown-app";
import MarkdownRenderer from "@/components/markdown-renderer";
import RenderAPIs from "@/components/root-page";

const router = [
  {
    path: "/",
    element: (
      <div className="bg-gray-700 md:grid md:grid-cols-2 flex flex-col gap-5 !w-full !p-2">
        <RenderAPIs />
        <div>
          <MarkdownApp />
          <MarkdownRenderer />
        </div>
      </div>
    ),
  },
];

export default router;
