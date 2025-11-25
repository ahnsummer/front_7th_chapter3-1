import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "@/components/ui/alert";

describe("Alert", () => {
  const defaultProps = {
    children: "Alert message",
  };

  describe("기본 렌더링", () => {
    it("children을 렌더링한다", () => {
      render(<Alert {...defaultProps} />);
      expect(screen.getByText("Alert message")).toBeInTheDocument();
    });

    it('기본값으로 variant="default", showIcon=true를 적용한다', () => {
      render(<Alert {...defaultProps} />);
      expect(screen.getByText("•")).toBeInTheDocument(); // default icon
    });

    it("close 버튼이 없을 때 렌더링하지 않는다", () => {
      render(<Alert {...defaultProps} />);
      expect(screen.queryByText("×")).not.toBeInTheDocument();
    });

    it("role=alert 속성을 가진다", () => {
      render(<Alert {...defaultProps} />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("variant prop", () => {
    it.each([
      ["info", "bg-info", "ℹ️"],
      ["success", "bg-success", "✓"],
      ["warning", "bg-warning", "⚠️"],
      ["danger", "bg-danger", "✕"],
      ["primary", "bg-primary", "•"],
    ] as const)(
      "variant가 %s일 때 %s 배경색과 %s 아이콘을 표시한다",
      (variant, bgClass, icon) => {
        render(<Alert variant={variant}>Message</Alert>);
        const alert = screen.getByRole("alert");
        expect(alert).toHaveClass(bgClass);
        expect(screen.getByText(icon)).toBeInTheDocument();
      }
    );
  });

  describe("title prop", () => {
    it("title이 있을 때 title을 렌더링한다", () => {
      render(<Alert title="Important">Message</Alert>);
      expect(screen.getByText("Important")).toBeInTheDocument();
    });

    it("title이 없을 때 title 요소를 렌더링하지 않는다", () => {
      const { container } = render(<Alert>Message</Alert>);
      const titleDiv = Array.from(container.querySelectorAll("div")).find(
        (div) => div.className.includes("font-bold")
      );
      expect(titleDiv).toBeUndefined();
    });

    it("title과 children을 함께 렌더링한다", () => {
      render(<Alert title="Title">Content</Alert>);
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("title이 font-bold 클래스를 가진다", () => {
      render(<Alert title="Title">Content</Alert>);
      const title = screen.getByText("Title");
      expect(title).toHaveClass("font-bold", "mb-1");
    });
  });

  describe("showIcon prop", () => {
    it("showIcon이 true일 때 아이콘을 표시한다", () => {
      render(
        <Alert variant="info" showIcon={true}>
          Message
        </Alert>
      );
      expect(screen.getByText("ℹ️")).toBeInTheDocument();
    });

    it("showIcon이 false일 때 아이콘을 숨긴다", () => {
      render(
        <Alert variant="info" showIcon={false}>
          Message
        </Alert>
      );
      expect(screen.queryByText("ℹ️")).not.toBeInTheDocument();
    });

    it.each(["info", "success", "warning", "danger", "primary"] as const)(
      "%s variant에서 showIcon=false일 때 아이콘을 숨긴다",
      (variant) => {
        render(
          <Alert variant={variant} showIcon={false}>
            Message
          </Alert>
        );
        // 각 variant의 아이콘이 없어야 함
        const icons = ["ℹ️", "✓", "⚠️", "✕", "•"];
        icons.forEach((icon) => {
          expect(screen.queryByText(icon)).not.toBeInTheDocument();
        });
      }
    );
  });

  describe("onClose prop", () => {
    it("onClose가 있을 때 close 버튼을 렌더링한다", () => {
      const handleClose = vi.fn();
      render(<Alert onClose={handleClose}>Message</Alert>);
      expect(screen.getByText("×")).toBeInTheDocument();
    });

    it("onClose가 없을 때 close 버튼을 렌더링하지 않는다", () => {
      render(<Alert>Message</Alert>);
      expect(screen.queryByText("×")).not.toBeInTheDocument();
    });

    it("close 버튼 클릭 시 onClose가 호출된다", async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      render(<Alert onClose={handleClose}>Message</Alert>);

      await user.click(screen.getByText("×"));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("close 버튼이 button 요소이다", () => {
      render(<Alert onClose={vi.fn()}>Message</Alert>);
      const closeButton = screen.getByText("×");
      expect(closeButton.tagName).toBe("BUTTON");
    });
  });

  describe("CSS 구조", () => {
    it("flex gap-2 items-start 클래스를 가진다", () => {
      render(<Alert>Message</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("flex", "gap-2", "items-start");
    });

    it("showIcon이 true일 때 아이콘 div를 포함한다", () => {
      render(<Alert showIcon>Message</Alert>);
      const icon = screen.getByText("•");
      expect(icon).toHaveClass("shrink-0");
    });

    it("content div가 flex-1 클래스를 가진다", () => {
      const { container } = render(<Alert>Message</Alert>);
      const contentDiv = Array.from(container.querySelectorAll("div")).find(
        (div) => div.className.includes("flex-1")
      );
      expect(contentDiv).toBeInTheDocument();
    });

    it("title이 있을 때 title div를 포함한다", () => {
      render(<Alert title="Title">Message</Alert>);
      const title = screen.getByText("Title");
      expect(title).toHaveClass("font-bold");
    });

    it("onClose가 있을 때 close 버튼을 포함한다", () => {
      render(<Alert onClose={vi.fn()}>Message</Alert>);
      const closeButton = screen.getByText("×");
      expect(closeButton).toHaveClass("cursor-pointer");
    });
  });

  describe("props 조합 테스트", () => {
    it("모든 props를 함께 사용할 수 있다", async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();

      render(
        <Alert
          variant="warning"
          title="Warning"
          showIcon={true}
          onClose={handleClose}>
          This is a warning message
        </Alert>
      );

      expect(screen.getByText("⚠️")).toBeInTheDocument();
      expect(screen.getByText("Warning")).toBeInTheDocument();
      expect(screen.getByText("This is a warning message")).toBeInTheDocument();
      expect(screen.getByText("×")).toBeInTheDocument();

      await user.click(screen.getByText("×"));
      expect(handleClose).toHaveBeenCalled();
    });

    it("title 없이 icon과 close 버튼을 사용할 수 있다", () => {
      render(
        <Alert variant="danger" showIcon onClose={vi.fn()}>
          Error message
        </Alert>
      );

      expect(screen.getByText("✕")).toBeInTheDocument();
      expect(screen.getByText("×")).toBeInTheDocument();
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("icon 없이 title과 close 버튼을 사용할 수 있다", () => {
      render(
        <Alert title="Success" showIcon={false} onClose={vi.fn()}>
          Operation completed
        </Alert>
      );

      expect(screen.queryByText("✓")).not.toBeInTheDocument();
      expect(screen.getByText("Success")).toBeInTheDocument();
      expect(screen.getByText("×")).toBeInTheDocument();
    });
  });

  describe("children 타입", () => {
    it("문자열 children을 렌더링한다", () => {
      render(<Alert>Simple text</Alert>);
      expect(screen.getByText("Simple text")).toBeInTheDocument();
    });

    it("JSX children을 렌더링한다", () => {
      render(
        <Alert>
          <div data-testid="custom-content">Custom content</div>
        </Alert>
      );
      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    });

    it("여러 children을 렌더링한다", () => {
      render(
        <Alert>
          <span>Part 1</span>
          <span>Part 2</span>
        </Alert>
      );
      expect(screen.getByText("Part 1")).toBeInTheDocument();
      expect(screen.getByText("Part 2")).toBeInTheDocument();
    });
  });
});
