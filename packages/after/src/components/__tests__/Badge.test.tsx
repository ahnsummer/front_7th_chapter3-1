import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../ui/badge";

describe("Badge", () => {
  describe("기본 렌더링", () => {
    it("children을 렌더링한다", () => {
      render(<Badge>테스트 뱃지</Badge>);
      expect(screen.getByText("테스트 뱃지")).toBeInTheDocument();
    });

    it("기본값으로 primary variant와 md size를 적용한다", () => {
      render(<Badge>기본</Badge>);
      const badge = screen.getByText("기본");
      expect(badge).toHaveClass("bg-primary", "px-1.5", "py-0.5", "text-sm");
    });

    it("pill이 false일 때 rounded-full 클래스를 적용하지 않는다", () => {
      render(<Badge pill={false}>뱃지</Badge>);
      expect(screen.getByText("뱃지")).not.toHaveClass("rounded-full");
    });
  });

  describe("variant prop", () => {
    it.each([
      ["primary", "bg-primary"],
      ["secondary", "bg-secondary"],
      ["success", "bg-success"],
      ["danger", "bg-danger"],
      ["warning", "bg-warning"],
      ["info", "bg-info"],
    ] as const)(
      "variant이 %s일 때 %s 클래스를 적용한다",
      (variant, className) => {
        render(<Badge variant={variant}>뱃지</Badge>);
        expect(screen.getByText("뱃지")).toHaveClass(className);
      }
    );
  });

  describe("size prop", () => {
    it.each([
      ["sm", "px-1", "py-0.5", "text-xs"],
      ["md", "px-1.5", "py-0.5", "text-sm"],
      ["lg", "px-2", "py-1", "text-md"],
    ] as const)(
      "size가 %s일 때 적절한 클래스를 적용한다",
      (size, ...classNames) => {
        render(<Badge size={size}>뱃지</Badge>);
        const badge = screen.getByText("뱃지");
        classNames.forEach((className) => {
          expect(badge).toHaveClass(className);
        });
      }
    );
  });

  describe("pill prop", () => {
    it("pill이 true일 때 rounded-full 클래스를 적용한다", () => {
      render(<Badge pill={true}>뱃지</Badge>);
      expect(screen.getByText("뱃지")).toHaveClass("rounded-full");
    });

    it("pill이 false일 때 rounded-full 클래스를 적용하지 않는다", () => {
      render(<Badge pill={false}>뱃지</Badge>);
      expect(screen.getByText("뱃지")).not.toHaveClass("rounded-full");
    });
  });

  describe("showIcon prop", () => {
    it("showIcon이 true일 때도 정상 렌더링된다 (아이콘 미구현)", () => {
      render(<Badge showIcon={true}>뱃지</Badge>);
      expect(screen.getByText("뱃지")).toBeInTheDocument();
    });

    it("showIcon이 false일 때 정상 렌더링된다", () => {
      render(<Badge showIcon={false}>뱃지</Badge>);
      expect(screen.getByText("뱃지")).toBeInTheDocument();
    });
  });

  describe("props 조합 테스트", () => {
    it("variant와 pill을 함께 사용할 수 있다", () => {
      render(
        <Badge variant="success" pill>
          게시
        </Badge>
      );
      const badge = screen.getByText("게시");
      expect(badge).toHaveClass("bg-success", "rounded-full");
    });

    it("variant, size, pill을 함께 사용할 수 있다", () => {
      render(
        <Badge variant="danger" size="lg" pill>
          관리자
        </Badge>
      );
      const badge = screen.getByText("관리자");
      expect(badge).toHaveClass("bg-danger", "px-2", "py-1", "rounded-full");
    });

    it("모든 props를 함께 사용할 수 있다", () => {
      render(
        <Badge variant="info" size="sm" pill showIcon>
          알림
        </Badge>
      );
      const badge = screen.getByText("알림");
      expect(badge).toHaveClass("bg-info", "px-1", "py-0.5", "text-xs", "rounded-full");
    });
  });
});
