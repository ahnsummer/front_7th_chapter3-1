import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../ui/button";

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
      expect(button).toHaveClass("bg-primary", "px-5", "py-2.5", "text-base");
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveClass("w-full");
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
      ["primary", "bg-primary"],
      ["secondary", "bg-secondary"],
      ["danger", "bg-danger"],
      ["success", "bg-success"],
      ["info", "bg-info"],
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
      ["sm", "px-3", "py-1.5", "text-sm"],
      ["md", "px-5", "py-2.5", "text-base"],
      ["lg", "px-6", "py-3", "text-lg"],
    ] as const)(
      "size가 %s일 때 적절한 클래스를 적용한다",
      (size, ...classNames) => {
        render(<Button size={size}>버튼</Button>);
        const button = screen.getByRole("button");
        classNames.forEach((className) => {
          expect(button).toHaveClass(className);
        });
      }
    );
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
    it("fullWidth가 true일 때 w-full 클래스를 적용한다", () => {
      render(<Button fullWidth>버튼</Button>);
      expect(screen.getByRole("button")).toHaveClass("w-full");
    });

    it("fullWidth가 false일 때 w-full 클래스를 적용하지 않는다", () => {
      render(<Button fullWidth={false}>버튼</Button>);
      expect(screen.getByRole("button")).not.toHaveClass("w-full");
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

  describe("props 조합 테스트", () => {
    it("모든 props를 함께 사용할 수 있다", () => {
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
      expect(button).toHaveClass("bg-success", "px-6", "py-3", "text-lg", "w-full");
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
  });
});
