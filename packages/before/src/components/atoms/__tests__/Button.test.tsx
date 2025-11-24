import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button", () => {
  describe("기본 렌더링", () => {
    it("children을 렌더링한다", () => {
      render(<Button>클릭</Button>);
      expect(screen.getByRole("button", { name: "클릭" })).toBeInTheDocument();
    });

    it('기본값으로 type="button", variant="primary", size="md"를 적용한다', () => {
      render(<Button>버튼</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveClass("btn", "btn-primary", "btn-md");
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveClass("btn-fullwidth");
    });
  });

  describe("type prop", () => {
    it.each(["button", "submit", "reset"] as const)(
      "type이 %s일 때 해당 type 속성을 적용한다",
      (type) => {
        render(<Button type={type}>버튼</Button>);
        expect(screen.getByRole("button")).toHaveAttribute("type", type);
      }
    );
  });

  describe("variant prop", () => {
    it.each([
      ["primary", "btn-primary"],
      ["secondary", "btn-secondary"],
      ["danger", "btn-danger"],
      ["success", "btn-success"],
    ] as const)(
      "variant가 %s일 때 %s 클래스를 적용한다",
      (variant, className) => {
        render(<Button variant={variant}>버튼</Button>);
        expect(screen.getByRole("button")).toHaveClass(className);
      }
    );
  });

  describe("size prop", () => {
    it.each([
      ["sm", "btn-sm"],
      ["md", "btn-md"],
      ["lg", "btn-lg"],
    ] as const)("size가 %s일 때 %s 클래스를 적용한다", (size, className) => {
      render(<Button size={size}>버튼</Button>);
      expect(screen.getByRole("button")).toHaveClass(className);
    });
  });

  describe("disabled prop", () => {
    it("disabled가 true일 때 버튼을 비활성화한다", () => {
      render(<Button disabled>버튼</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("disabled가 false일 때 버튼을 활성화한다", () => {
      render(<Button disabled={false}>버튼</Button>);
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  describe("fullWidth prop", () => {
    it("fullWidth가 true일 때 btn-fullwidth 클래스를 적용한다", () => {
      render(<Button fullWidth>버튼</Button>);
      expect(screen.getByRole("button")).toHaveClass("btn-fullwidth");
    });

    it("fullWidth가 false일 때 btn-fullwidth 클래스를 적용하지 않는다", () => {
      render(<Button fullWidth={false}>버튼</Button>);
      expect(screen.getByRole("button")).not.toHaveClass("btn-fullwidth");
    });
  });

  describe("onClick handler", () => {
    it("클릭 시 onClick 핸들러가 호출된다", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>버튼</Button>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disabled 상태에서는 onClick이 호출되지 않는다", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Button onClick={handleClick} disabled>
          버튼
        </Button>
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("entityType과 action prop (도메인 로직)", () => {
    describe("user entity", () => {
      it("admin 사용자에 대한 delete action은 버튼을 비활성화한다", () => {
        const entity = { id: 1, role: "admin" };
        render(
          <Button entityType="user" action="delete" entity={entity}>
            삭제
          </Button>
        );
        expect(screen.getByRole("button")).toBeDisabled();
      });

      it("일반 사용자에 대한 delete action은 버튼을 활성화한다", () => {
        const entity = { id: 1, role: "user" };
        render(
          <Button entityType="user" action="delete" entity={entity}>
            삭제
          </Button>
        );
        expect(screen.getByRole("button")).not.toBeDisabled();
      });

      it('user entity의 create action은 "새 사용자 만들기" 텍스트를 표시한다', () => {
        const entity = { id: 1 };
        render(<Button entityType="user" action="create" entity={entity} />);
        expect(screen.getByText("새 사용자 만들기")).toBeInTheDocument();
      });

      it('user entity의 edit action은 "수정" 텍스트를 표시한다', () => {
        const entity = { id: 1 };
        render(<Button entityType="user" action="edit" entity={entity} />);
        expect(screen.getByText("수정")).toBeInTheDocument();
      });

      it('user entity의 delete action은 "삭제" 텍스트와 danger variant를 적용한다', () => {
        const entity = { id: 1, role: "user" };
        render(<Button entityType="user" action="delete" entity={entity} />);
        const button = screen.getByText("삭제");
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass("btn-danger");
      });
    });

    describe("post entity", () => {
      it("published 상태의 글에 대한 publish action은 버튼을 비활성화한다", () => {
        const entity = { id: 1, status: "published" };
        render(
          <Button entityType="post" action="publish" entity={entity}>
            게시
          </Button>
        );
        expect(screen.getByRole("button")).toBeDisabled();
      });

      it("draft 상태의 글에 대한 publish action은 버튼을 활성화한다", () => {
        const entity = { id: 1, status: "draft" };
        render(
          <Button entityType="post" action="publish" entity={entity}>
            게시
          </Button>
        );
        expect(screen.getByRole("button")).not.toBeDisabled();
      });

      it("published 상태가 아닌 글에 대한 archive action은 버튼을 비활성화한다", () => {
        const entity = { id: 1, status: "draft" };
        render(
          <Button entityType="post" action="archive" entity={entity}>
            보관
          </Button>
        );
        expect(screen.getByRole("button")).toBeDisabled();
      });

      it("published 상태의 글에 대한 archive action은 버튼을 활성화한다", () => {
        const entity = { id: 1, status: "published" };
        render(
          <Button entityType="post" action="archive" entity={entity}>
            보관
          </Button>
        );
        expect(screen.getByRole("button")).not.toBeDisabled();
      });

      it('post entity의 create action은 "새 게시글 만들기" 텍스트를 표시한다', () => {
        const entity = { id: 1 };
        render(<Button entityType="post" action="create" entity={entity} />);
        expect(screen.getByText("새 게시글 만들기")).toBeInTheDocument();
      });

      it('post entity의 edit action은 "수정" 텍스트를 표시한다', () => {
        const entity = { id: 1 };
        render(<Button entityType="post" action="edit" entity={entity} />);
        expect(screen.getByText("수정")).toBeInTheDocument();
      });

      it('post entity의 delete action은 "삭제" 텍스트와 danger variant를 적용한다', () => {
        const entity = { id: 1 };
        render(<Button entityType="post" action="delete" entity={entity} />);
        const button = screen.getByText("삭제");
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass("btn-danger");
      });

      it('post entity의 publish action은 "게시" 텍스트와 success variant를 적용한다', () => {
        const entity = { id: 1, status: "draft" };
        render(<Button entityType="post" action="publish" entity={entity} />);
        const button = screen.getByText("게시");
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass("btn-success");
      });

      it('post entity의 archive action은 "보관" 텍스트와 secondary variant를 적용한다', () => {
        const entity = { id: 1, status: "published" };
        render(<Button entityType="post" action="archive" entity={entity} />);
        const button = screen.getByText("보관");
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass("btn-secondary");
      });
    });

    it("children이 명시되면 자동 생성된 label 대신 children을 표시한다", () => {
      const entity = { id: 1 };
      render(
        <Button entityType="post" action="create" entity={entity}>
          커스텀 버튼
        </Button>
      );
      expect(screen.getByText("커스텀 버튼")).toBeInTheDocument();
      expect(screen.queryByText("새 게시글 만들기")).not.toBeInTheDocument();
    });

    it("entityType, action, entity 중 하나라도 없으면 도메인 로직을 적용하지 않는다", () => {
      const entity = { id: 1, role: "admin" };
      // entityType 없음
      render(
        <Button action="delete" entity={entity}>
          삭제
        </Button>
      );
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  describe("props 조합 테스트", () => {
    it("모든 기본 props를 함께 사용할 수 있다", () => {
      const handleClick = vi.fn();
      render(
        <Button
          onClick={handleClick}
          type="submit"
          variant="success"
          size="lg"
          fullWidth>
          전송
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveClass(
        "btn",
        "btn-success",
        "btn-lg",
        "btn-fullwidth"
      );
    });

    it("disabled prop이 명시되면 도메인 로직의 disabled보다 우선된다", () => {
      const entity = { id: 1, status: "draft" };
      render(
        <Button
          entityType="post"
          action="publish"
          entity={entity}
          disabled={true}>
          게시
        </Button>
      );
      // draft 상태라 도메인 로직으로는 활성화되어야 하지만, disabled prop이 true이므로 비활성화
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("action의 자동 variant가 명시된 variant prop을 덮어쓴다", () => {
      const entity = { id: 1 };
      render(
        <Button
          entityType="post"
          action="delete"
          entity={entity}
          variant="primary">
          삭제
        </Button>
      );
      // action이 나중에 처리되므로 delete action의 danger variant가 적용됨
      expect(screen.getByRole("button")).toHaveClass("btn-danger");
    });
  });

  describe("edge cases", () => {
    it("children 없이 렌더링할 수 있다", () => {
      render(<Button />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("onClick 없이 렌더링할 수 있다", () => {
      render(<Button>버튼</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("entity에 필요한 속성이 없어도 에러 없이 렌더링된다", () => {
      const entity = {};
      render(
        <Button entityType="user" action="delete" entity={entity}>
          삭제
        </Button>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});
