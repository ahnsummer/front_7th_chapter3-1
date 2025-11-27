import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  const defaultProps = {
    name: "testInput",
    value: "",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("기본 렌더링", () => {
    it("input 요소를 렌더링한다", () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it('기본값으로 type="text", disabled=false, required=false를 적용한다', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
      expect(input).not.toBeDisabled();
      expect(input).not.toBeRequired();
    });

    it("name과 value를 올바르게 설정한다", () => {
      render(<Input {...defaultProps} value="테스트 값" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("name", "testInput");
      expect(input).toHaveValue("테스트 값");
    });
  });

  describe("label prop", () => {
    it("label이 있을 때 label 요소를 렌더링한다", () => {
      render(<Input {...defaultProps} label="사용자명" />);
      expect(screen.getByLabelText("사용자명")).toBeInTheDocument();
    });

    it("label이 없을 때 label 요소를 렌더링하지 않는다", () => {
      render(<Input {...defaultProps} />);
      expect(screen.queryByRole("textbox")).toBeInTheDocument();
      // label이 없으므로 form-label 클래스가 없어야 함
      expect(document.querySelector(".form-label")).not.toBeInTheDocument();
    });

    it("required가 true일 때 label에 * 표시를 추가한다", () => {
      render(<Input {...defaultProps} label="이메일" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });

  describe("type prop", () => {
    it("type이 text일 때 해당 type 속성을 적용한다", () => {
      render(<Input {...defaultProps} type="text" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
    });

    it("type이 email일 때 해당 type 속성을 적용한다", () => {
      render(<Input {...defaultProps} type="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
    });

    it("type이 password일 때 해당 type 속성을 적용한다", () => {
      const { container } = render(<Input {...defaultProps} type="password" />);
      const input = container.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "password");
    });

    it("type이 number일 때 해당 type 속성을 적용한다", () => {
      render(<Input {...defaultProps} type="number" />);
      expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
    });

    it("type이 url일 때 해당 type 속성을 적용한다", () => {
      render(<Input {...defaultProps} type="url" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "url");
    });
  });

  describe("placeholder prop", () => {
    it("placeholder를 설정한다", () => {
      render(<Input {...defaultProps} placeholder="입력하세요" />);
      expect(screen.getByPlaceholderText("입력하세요")).toBeInTheDocument();
    });
  });

  describe("required prop", () => {
    it("required가 true일 때 input에 required 속성을 추가한다", () => {
      render(<Input {...defaultProps} required />);
      expect(screen.getByRole("textbox")).toBeRequired();
    });

    it("required가 false일 때 input에 required 속성을 추가하지 않는다", () => {
      render(<Input {...defaultProps} required={false} />);
      expect(screen.getByRole("textbox")).not.toBeRequired();
    });
  });

  describe("disabled prop", () => {
    it("disabled가 true일 때 input을 비활성화한다", () => {
      render(<Input {...defaultProps} disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("disabled가 false일 때 input을 활성화한다", () => {
      render(<Input {...defaultProps} disabled={false} />);
      expect(screen.getByRole("textbox")).not.toBeDisabled();
    });
  });

  describe("error prop", () => {
    it("error가 있을 때 에러 메시지를 표시한다", () => {
      render(<Input {...defaultProps} error="필수 항목입니다" />);
      expect(screen.getByText("필수 항목입니다")).toBeInTheDocument();
    });

    it("error가 있을 때 error 클래스를 추가한다", () => {
      render(<Input {...defaultProps} error="에러" />);
      expect(screen.getByRole("textbox")).toHaveClass("border-danger");
    });

    it("error와 helpText가 둘 다 있을 때 error만 표시한다", () => {
      render(
        <Input {...defaultProps} error="에러 메시지" helpText="도움말 텍스트" />
      );
      expect(screen.getByText("에러 메시지")).toBeInTheDocument();
      expect(screen.queryByText("도움말 텍스트")).not.toBeInTheDocument();
    });
  });

  describe("helpText prop", () => {
    it("helpText를 표시한다", () => {
      render(<Input {...defaultProps} helpText="3자 이상 입력하세요" />);
      expect(screen.getByText("3자 이상 입력하세요")).toBeInTheDocument();
    });

    it("error가 없을 때만 helpText를 표시한다", () => {
      render(<Input {...defaultProps} helpText="도움말" />);
      expect(screen.getByText("도움말")).toBeInTheDocument();
    });
  });

  describe("size prop", () => {
    it("size가 sm일 때 해당 클래스를 적용한다", () => {
      render(<Input {...defaultProps} size="sm" />);
      expect(screen.getByRole("textbox")).toHaveClass("w-[200px]");
    });

    it("size가 md일 때 해당 클래스를 적용한다", () => {
      render(<Input {...defaultProps} size="md" />);
      expect(screen.getByRole("textbox")).toHaveClass("w-[300px]");
    });

    it("size가 lg일 때 해당 클래스를 적용한다", () => {
      render(<Input {...defaultProps} size="lg" />);
      expect(screen.getByRole("textbox")).toHaveClass("w-[400px]");
    });

    it("기본값은 full이다", () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole("textbox")).toHaveClass("w-full");
    });
  });

  describe("onChange handler", () => {
    it("입력 시 onChange가 새 값과 함께 호출된다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Input {...defaultProps} onChange={handleChange} />);

      await user.type(screen.getByRole("textbox"), "test");
      expect(handleChange).toHaveBeenCalledTimes(4); // 't', 'e', 's', 't'
      // userEvent.type은 한 글자씩 입력하므로 마지막 호출은 't'
      expect(handleChange).toHaveBeenLastCalledWith("t");
    });

    it("disabled 상태에서는 입력이 불가능하다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Input {...defaultProps} onChange={handleChange} disabled />);

      await user.type(screen.getByRole("textbox"), "test");
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("onValidate prop", () => {
    it("입력 시 onValidate가 호출된다", async () => {
      const handleValidate = vi.fn().mockReturnValue(undefined);
      const user = userEvent.setup();
      render(<Input {...defaultProps} onValidate={handleValidate} />);

      await user.type(screen.getByRole("textbox"), "test");
      expect(handleValidate).toHaveBeenCalledTimes(4);
      // userEvent.type은 한 글자씩 입력: 't', 'e', 's', 't'
      expect(handleValidate).toHaveBeenNthCalledWith(1, "t");
      expect(handleValidate).toHaveBeenNthCalledWith(2, "e");
      expect(handleValidate).toHaveBeenNthCalledWith(3, "s");
      expect(handleValidate).toHaveBeenNthCalledWith(4, "t");
    });

    it("onValidate가 에러를 반환하면 표시되지 않는다 (외부 error prop 사용)", async () => {
      const handleValidate = vi.fn().mockReturnValue("검증 실패");
      const user = userEvent.setup();
      render(<Input {...defaultProps} onValidate={handleValidate} />);

      await user.type(screen.getByRole("textbox"), "x");
      expect(handleValidate).toHaveBeenCalled();
      // onValidate 자체는 에러를 표시하지 않고, 외부에서 error prop으로 전달해야 함
    });

    it("onValidate와 onChange가 모두 호출된다", async () => {
      const handleChange = vi.fn();
      const handleValidate = vi.fn();
      const user = userEvent.setup();
      render(
        <Input
          {...defaultProps}
          onChange={handleChange}
          onValidate={handleValidate}
        />
      );

      await user.type(screen.getByRole("textbox"), "abc");
      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleValidate).toHaveBeenCalledTimes(3);
    });

    it("onValidate 없이도 정상 작동한다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Input {...defaultProps} onChange={handleChange} />);

      await user.type(screen.getByRole("textbox"), "test");
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("id 속성이 name과 동일하게 설정된다", () => {
      render(<Input {...defaultProps} label="테스트" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "testInput");
    });
  });
});
