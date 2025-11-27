import type { User } from "@/services/userService";
import type { Post } from "@/services/postService";

export type StatsData = {
  total: number;
  stat1: { label: string; value: number; color: string };
  stat2: { label: string; value: number; color: string };
  stat3: { label: string; value: number; color: string };
  stat4: { label: string; value: number; color: string };
};

export const calculateUserStats = (users: User[]): StatsData => {
  return {
    total: users.length,
    stat1: {
      label: "활성",
      value: users.filter((u) => u.status === "active").length,
      color: "#2e7d32",
    },
    stat2: {
      label: "비활성",
      value: users.filter((u) => u.status === "inactive").length,
      color: "#ed6c02",
    },
    stat3: {
      label: "정지",
      value: users.filter((u) => u.status === "suspended").length,
      color: "#d32f2f",
    },
    stat4: {
      label: "관리자",
      value: users.filter((u) => u.role === "admin").length,
      color: "#1976d2",
    },
  };
};

export const calculatePostStats = (posts: Post[]): StatsData => {
  return {
    total: posts.length,
    stat1: {
      label: "게시됨",
      value: posts.filter((p) => p.status === "published").length,
      color: "#2e7d32",
    },
    stat2: {
      label: "임시저장",
      value: posts.filter((p) => p.status === "draft").length,
      color: "#ed6c02",
    },
    stat3: {
      label: "보관됨",
      value: posts.filter((p) => p.status === "archived").length,
      color: "rgba(0, 0, 0, 0.6)",
    },
    stat4: {
      label: "총 조회수",
      value: posts.reduce((sum, p) => sum + p.views, 0),
      color: "#1976d2",
    },
  };
};

