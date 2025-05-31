import MarkdownApp from "@/components/markdown-app";
import MarkdownRenderer from "@/components/markdown-renderer";
import RenderAPIs from "@/components/root-page";

const router = [
  {
    path: "/",
    element: (
      <div className="bg-gray-700 grid grid-cols-2 gap-5 !w-full">
        <RenderAPIs />
        <div className="!h-screen overflow-y-scroll">
          <MarkdownApp />
          <MarkdownRenderer />
        </div>
      </div>
    ),
  },
];

export default router;
