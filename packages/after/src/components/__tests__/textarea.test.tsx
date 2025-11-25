import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "../ui/textarea";

describe("Textarea", () => {
  const defaultProps = {
    name: "testTextarea",
    value: "",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("기본 렌더링", () => {
    it("textarea 요소를 렌더링한다", () => {
      render(<Textarea {...defaultProps} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("기본값으로 required=false, disabled=false, rows=4를 적용한다", () => {
      render(<Textarea {...defaultProps} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).not.toBeRequired();
      expect(textarea).not.toBeDisabled();
      expect(textarea).toHaveAttribute("rows", "4");
    });

    it("name과 value를 올바르게 설정한다", () => {
      render(<Textarea {...defaultProps} value="테스트 내용" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("name", "testTextarea");
      expect(textarea).toHaveValue("테스트 내용");
    });
  });

  describe("label prop", () => {
    it("label이 있을 때 label 요소를 렌더링한다", () => {
      render(<Textarea {...defaultProps} label="설명" />);
      expect(screen.getByText("설명")).toBeInTheDocument();
    });

    it("label이 없을 때 label 요소를 렌더링하지 않는다", () => {
      render(<Textarea {...defaultProps} />);
      expect(document.querySelector(".form-label")).not.toBeInTheDocument();
    });

    it("required가 true일 때 label에 * 표시를 추가한다", () => {
      render(<Textarea {...defaultProps} label="내용" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });

  describe("placeholder prop", () => {
    it("placeholder를 설정한다", () => {
      render(<Textarea {...defaultProps} placeholder="내용을 입력하세요" />);
      expect(
        screen.getByPlaceholderText("내용을 입력하세요")
      ).toBeInTheDocument();
    });
  });

  describe("required prop", () => {
    it("required가 true일 때 textarea에 required 속성을 추가한다", () => {
      render(<Textarea {...defaultProps} required />);
      expect(screen.getByRole("textbox")).toBeRequired();
    });

    it("required가 false일 때 textarea에 required 속성을 추가하지 않는다", () => {
      render(<Textarea {...defaultProps} required={false} />);
      expect(screen.getByRole("textbox")).not.toBeRequired();
    });
  });

  describe("disabled prop", () => {
    it("disabled가 true일 때 textarea를 비활성화한다", () => {
      render(<Textarea {...defaultProps} disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("disabled가 false일 때 textarea를 활성화한다", () => {
      render(<Textarea {...defaultProps} disabled={false} />);
      expect(screen.getByRole("textbox")).not.toBeDisabled();
    });
  });

  describe("rows prop", () => {
    it("rows를 설정한다", () => {
      render(<Textarea {...defaultProps} rows={10} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "10");
    });

    it("기본값은 4이다", () => {
      render(<Textarea {...defaultProps} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "4");
    });
  });

  describe("error prop", () => {
    it("error가 있을 때 에러 메시지를 표시한다", () => {
      render(<Textarea {...defaultProps} error="필수 항목입니다" />);
      expect(screen.getByText("필수 항목입니다")).toBeInTheDocument();
    });

    it("error가 있을 때 border-danger 클래스를 추가한다", () => {
      render(<Textarea {...defaultProps} error="에러" />);
      expect(screen.getByRole("textbox")).toHaveClass("border-danger");
    });

    it("error와 helpText가 둘 다 있을 때 error만 표시한다", () => {
      render(
        <Textarea
          {...defaultProps}
          error="에러 메시지"
          helpText="도움말 텍스트"
        />
      );
      expect(screen.getByText("에러 메시지")).toBeInTheDocument();
      expect(screen.queryByText("도움말 텍스트")).not.toBeInTheDocument();
    });
  });

  describe("helpText prop", () => {
    it("helpText를 표시한다", () => {
      render(
        <Textarea {...defaultProps} helpText="상세한 설명을 입력하세요" />
      );
      expect(screen.getByText("상세한 설명을 입력하세요")).toBeInTheDocument();
    });

    it("error가 없을 때만 helpText를 표시한다", () => {
      render(<Textarea {...defaultProps} helpText="도움말" />);
      expect(screen.getByText("도움말")).toBeInTheDocument();
    });
  });

  describe("onChange handler", () => {
    it("입력 시 onChange가 새 값과 함께 호출된다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Textarea {...defaultProps} onChange={handleChange} />);

      await user.type(screen.getByRole("textbox"), "test");
      expect(handleChange).toHaveBeenCalledTimes(4); // 't', 'e', 's', 't'
      // userEvent.type은 한 글자씩 입력하므로 마지막 호출은 't'
      expect(handleChange).toHaveBeenLastCalledWith("t");
    });

    it("disabled 상태에서는 입력이 불가능하다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Textarea {...defaultProps} onChange={handleChange} disabled />);

      await user.type(screen.getByRole("textbox"), "test");
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("여러 줄 입력을 처리한다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Textarea {...defaultProps} onChange={handleChange} />);

      await user.type(screen.getByRole("textbox"), "line1{Enter}line2");
      expect(handleChange).toHaveBeenCalled();
      // Enter가 포함된 호출 찾기
      const calls = handleChange.mock.calls.map((call) => call[0]);
      const hasNewline = calls.some((val) => val.includes("\n"));
      expect(hasNewline).toBe(true);
    });
  });

  describe("CSS 클래스", () => {
    it("helper text에 hasError에 따라 클래스를 조건부로 적용한다", () => {
      const { rerender } = render(
        <Textarea {...defaultProps} helpText="도움말" />
      );
      expect(screen.getByText("도움말")).toHaveClass("text-gray-600");
      expect(screen.getByText("도움말")).not.toHaveClass("text-danger");

      rerender(<Textarea {...defaultProps} error="에러" />);
      expect(screen.getByText("에러")).toHaveClass("text-danger");
    });
  });

  describe("컴포넌트 구조", () => {
    it("div로 감싸진다", () => {
      const { container } = render(<Textarea {...defaultProps} />);
      const wrapper = container.querySelector("div");
      expect(wrapper).toBeInTheDocument();
    });

    it("label, textarea, helpText 순서로 렌더링된다", () => {
      const { container } = render(
        <Textarea {...defaultProps} label="테스트" helpText="도움말" />
      );
      const wrapper = container.querySelector("div");
      const children = wrapper?.children;

      // Label 컴포넌트 (Radix UI)
      expect(children?.[0]?.getAttribute("data-slot")).toBe("label");
      // Textarea
      expect(children?.[1]?.tagName).toBe("TEXTAREA");
      // HelperText (span)
      expect(children?.[2]?.tagName).toBe("SPAN");
      expect(children?.[2]?.textContent).toBe("도움말");
    });
  });

  describe("edge cases", () => {
    it("빈 값으로도 렌더링된다", () => {
      render(<Textarea {...defaultProps} value="" />);
      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("긴 텍스트를 처리한다", async () => {
      const longText = "a".repeat(1000);
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Textarea {...defaultProps} onChange={handleChange} />);
      await user.type(screen.getByRole("textbox"), longText);

      expect(handleChange).toHaveBeenCalled();
    });
  });
});
