import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "../Alert";

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
      const { container } = render(<Alert {...defaultProps} />);
      const alert = container.querySelector(".alert");
      expect(alert).toHaveClass("alert-default");
      expect(screen.getByText("•")).toBeInTheDocument(); // default icon
    });

    it("close 버튼이 없을 때 렌더링하지 않는다", () => {
      render(<Alert {...defaultProps} />);
      expect(screen.queryByText("×")).not.toBeInTheDocument();
    });
  });

  describe("variant prop", () => {
    it.each([
      ["info", "alert-info", "ℹ️"],
      ["success", "alert-success", "✓"],
      ["warning", "alert-warning", "⚠️"],
      ["error", "alert-error", "✕"],
      ["default", "alert-default", "•"],
    ] as const)(
      "variant가 %s일 때 %s 클래스와 %s 아이콘을 표시한다",
      (variant, className, icon) => {
        const { container } = render(<Alert variant={variant}>Message</Alert>);
        expect(container.querySelector(".alert")).toHaveClass(className);
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
      expect(container.querySelector(".alert-title")).not.toBeInTheDocument();
    });

    it("title과 children을 함께 렌더링한다", () => {
      render(<Alert title="Title">Content</Alert>);
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
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
      const { container } = render(
        <Alert variant="info" showIcon={false}>
          Message
        </Alert>
      );
      expect(container.querySelector(".alert-icon")).not.toBeInTheDocument();
      expect(screen.queryByText("ℹ️")).not.toBeInTheDocument();
    });

    it.each(["info", "success", "warning", "error", "default"] as const)(
      "%s variant에서 showIcon=false일 때 아이콘을 숨긴다",
      (variant) => {
        const { container } = render(
          <Alert variant={variant} showIcon={false}>
            Message
          </Alert>
        );
        expect(container.querySelector(".alert-icon")).not.toBeInTheDocument();
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
  });

  describe("CSS 구조", () => {
    it("alert, alert-content, alert-body 요소를 포함한다", () => {
      const { container } = render(<Alert>Message</Alert>);
      expect(container.querySelector(".alert")).toBeInTheDocument();
      expect(container.querySelector(".alert-content")).toBeInTheDocument();
      expect(container.querySelector(".alert-body")).toBeInTheDocument();
    });

    it("showIcon이 true일 때 alert-icon 요소를 포함한다", () => {
      const { container } = render(<Alert showIcon>Message</Alert>);
      expect(container.querySelector(".alert-icon")).toBeInTheDocument();
    });

    it("title이 있을 때 alert-title 요소를 포함한다", () => {
      const { container } = render(<Alert title="Title">Message</Alert>);
      expect(container.querySelector(".alert-title")).toBeInTheDocument();
    });

    it("onClose가 있을 때 alert-close 버튼을 포함한다", () => {
      const { container } = render(<Alert onClose={vi.fn()}>Message</Alert>);
      expect(container.querySelector(".alert-close")).toBeInTheDocument();
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
        <Alert variant="error" showIcon onClose={vi.fn()}>
          Error message
        </Alert>
      );

      expect(screen.getByText("✕")).toBeInTheDocument();
      expect(screen.getByText("×")).toBeInTheDocument();
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("icon 없이 title과 close 버튼을 사용할 수 있다", () => {
      const { container } = render(
        <Alert title="Success" showIcon={false} onClose={vi.fn()}>
          Operation completed
        </Alert>
      );

      expect(container.querySelector(".alert-icon")).not.toBeInTheDocument();
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
