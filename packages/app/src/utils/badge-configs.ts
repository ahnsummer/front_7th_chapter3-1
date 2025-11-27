import type { User } from "@/services/userService";
import type { Post } from "@/services/postService";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";

export const USER_ROLE_CONFIG: Record<
  User["role"],
  { variant: BadgeVariant; text: string }
> = {
  admin: { variant: "danger", text: "관리자" },
  moderator: { variant: "warning", text: "운영자" },
  user: { variant: "primary", text: "사용자" },
};

export const USER_STATUS_CONFIG: Record<
  User["status"],
  { variant: BadgeVariant; text: string }
> = {
  active: { variant: "success", text: "활성" },
  inactive: { variant: "warning", text: "비활성" },
  suspended: { variant: "danger", text: "정지" },
};

export const POST_CATEGORY_CONFIG: Record<Post["category"], BadgeVariant> = {
  development: "primary",
  design: "info",
  accessibility: "danger",
  news: "secondary",
};

export const POST_STATUS_CONFIG: Record<
  Post["status"],
  { variant: BadgeVariant; text: string }
> = {
  published: { variant: "success", text: "게시됨" },
  draft: { variant: "warning", text: "임시저장" },
  archived: { variant: "secondary", text: "보관됨" },
};
