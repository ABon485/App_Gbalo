import { apiBlog } from "@/config/blog";
import { TermsResponse } from "@/types/blog";

const BlogApi = {
  postTermsConditions: (data: string[]) =>
    apiBlog.post<TermsResponse>("/Blog/Info/Get", data).catch((error) => {
      console.error("BlogApi Error:", error);
      throw error;
    }),
};

export default BlogApi;
