import { Badge, Button } from "@repo/after";
import type { Column } from "@repo/after";
import type { User } from "@/services/userService";
import type { Post } from "@/services/postService";
import {
  USER_ROLE_CONFIG,
  USER_STATUS_CONFIG,
  POST_CATEGORY_CONFIG,
  POST_STATUS_CONFIG,
} from "@/utils/badge-configs";

type UserColumnHandlers = {
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
};

type PostColumnHandlers = {
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  onStatusAction: (id: number, action: "publish" | "archive" | "restore") => void;
};

export const getUserColumns = (handlers: UserColumnHandlers): Column<User>[] => [
  { key: "id", header: "ID", width: "60px" },
  { key: "username", header: "사용자명", width: "150px" },
  { key: "email", header: "이메일" },
  {
    key: "role",
    header: "역할",
    width: "120px",
    render: (user) => {
      const config = USER_ROLE_CONFIG[user.role];
      return (
        <Badge variant={config.variant} showIcon>
          {config.text}
        </Badge>
      );
    },
  },
  {
    key: "status",
    header: "상태",
    width: "120px",
    render: (user) => {
      const config = USER_STATUS_CONFIG[user.status];
      return (
        <Badge variant={config.variant} showIcon>
          {config.text}
        </Badge>
      );
    },
  },
  { key: "createdAt", header: "생성일", width: "120px" },
  {
    key: "lastLogin",
    header: "마지막 로그인",
    width: "140px",
    render: (user) => user.lastLogin || "-",
  },
  {
    key: "actions",
    header: "관리",
    width: "200px",
    render: (user) => (
      <div className="flex gap-2">
        <Button size="sm" variant="primary" onClick={() => handlers.onEdit(user)}>
          수정
        </Button>
        <Button size="sm" variant="danger" onClick={() => handlers.onDelete(user.id)}>
          삭제
        </Button>
      </div>
    ),
  },
];

export const getPostColumns = (handlers: PostColumnHandlers): Column<Post>[] => [
  { key: "id", header: "ID", width: "60px" },
  { key: "title", header: "제목" },
  { key: "author", header: "작성자", width: "120px" },
  {
    key: "category",
    header: "카테고리",
    width: "140px",
    render: (post) => (
      <Badge variant={POST_CATEGORY_CONFIG[post.category]} pill>
        {post.category}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "상태",
    width: "120px",
    render: (post) => {
      const config = POST_STATUS_CONFIG[post.status];
      return (
        <Badge variant={config.variant} showIcon>
          {config.text}
        </Badge>
      );
    },
  },
  {
    key: "views",
    header: "조회수",
    width: "100px",
    render: (post) => post.views.toLocaleString(),
  },
  { key: "createdAt", header: "작성일", width: "120px" },
  {
    key: "actions",
    header: "관리",
    width: "250px",
    render: (post) => (
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="primary" onClick={() => handlers.onEdit(post)}>
          수정
        </Button>
        {post.status === "draft" && (
          <Button
            size="sm"
            variant="success"
            onClick={() => handlers.onStatusAction(post.id, "publish")}>
            게시
          </Button>
        )}
        {post.status === "published" && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handlers.onStatusAction(post.id, "archive")}>
            보관
          </Button>
        )}
        {post.status === "archived" && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => handlers.onStatusAction(post.id, "restore")}>
            복원
          </Button>
        )}
        <Button size="sm" variant="danger" onClick={() => handlers.onDelete(post.id)}>
          삭제
        </Button>
      </div>
    ),
  },
];

