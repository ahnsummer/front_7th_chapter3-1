import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormSelect } from "../FormSelect";

describe("FormSelect", () => {
  const mockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const defaultProps = {
    name: "testSelect",
    value: "",
    onChange: vi.fn(),
    options: mockOptions,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("기본 렌더링", () => {
    it("select 요소를 렌더링한다", () => {
      render(<FormSelect {...defaultProps} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("기본값으로 required=false, disabled=false를 적용한다", () => {
      render(<FormSelect {...defaultProps} />);
      const select = screen.getByRole("combobox");
      expect(select).not.toBeRequired();
      expect(select).not.toBeDisabled();
    });

    it("name과 value를 올바르게 설정한다", () => {
      render(<FormSelect {...defaultProps} value="option1" />);
      const select = screen.getByRole("combobox");
      expect(select).toHaveAttribute("name", "testSelect");
      expect(select).toHaveValue("option1");
    });

    it("기본 placeholder option을 렌더링한다", () => {
      render(<FormSelect {...defaultProps} />);
      expect(screen.getByText("Select an option...")).toBeInTheDocument();
    });

    it("placeholder option은 비활성화되어 있다", () => {
      render(<FormSelect {...defaultProps} />);
      const placeholderOption = screen.getByText(
        "Select an option..."
      ) as HTMLOptionElement;
      expect(placeholderOption).toHaveAttribute("disabled");
      expect(placeholderOption).toHaveAttribute("value", "");
    });
  });

  describe("options prop", () => {
    it("제공된 options를 모두 렌더링한다", () => {
      render(<FormSelect {...defaultProps} />);
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("각 option에 value 속성을 올바르게 설정한다", () => {
      render(<FormSelect {...defaultProps} />);
      const option1 = screen.getByText("Option 1") as HTMLOptionElement;
      const option2 = screen.getByText("Option 2") as HTMLOptionElement;
      expect(option1).toHaveAttribute("value", "option1");
      expect(option2).toHaveAttribute("value", "option2");
    });

    it("option의 key를 value로 설정한다", () => {
      const { container } = render(<FormSelect {...defaultProps} />);
      const options = container.querySelectorAll("option");
      // placeholder + 3 options
      expect(options).toHaveLength(4);
    });
  });

  describe("label prop", () => {
    it("label이 있을 때 label 요소를 렌더링한다", () => {
      render(<FormSelect {...defaultProps} label="카테고리" />);
      expect(screen.getByText("카테고리")).toBeInTheDocument();
    });

    it("label이 없을 때 label 요소를 렌더링하지 않는다", () => {
      render(<FormSelect {...defaultProps} />);
      expect(document.querySelector(".form-label")).not.toBeInTheDocument();
    });

    it("required가 true일 때 label에 * 표시를 추가한다", () => {
      render(<FormSelect {...defaultProps} label="필수 항목" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });

  describe("placeholder prop", () => {
    it("커스텀 placeholder를 설정한다", () => {
      render(<FormSelect {...defaultProps} placeholder="선택해주세요" />);
      expect(screen.getByText("선택해주세요")).toBeInTheDocument();
      expect(screen.queryByText("Select an option...")).not.toBeInTheDocument();
    });
  });

  describe("required prop", () => {
    it("required가 true일 때 select에 required 속성을 추가한다", () => {
      render(<FormSelect {...defaultProps} required />);
      expect(screen.getByRole("combobox")).toBeRequired();
    });

    it("required가 false일 때 select에 required 속성을 추가하지 않는다", () => {
      render(<FormSelect {...defaultProps} required={false} />);
      expect(screen.getByRole("combobox")).not.toBeRequired();
    });
  });

  describe("disabled prop", () => {
    it("disabled가 true일 때 select를 비활성화한다", () => {
      render(<FormSelect {...defaultProps} disabled />);
      expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("disabled가 false일 때 select를 활성화한다", () => {
      render(<FormSelect {...defaultProps} disabled={false} />);
      expect(screen.getByRole("combobox")).not.toBeDisabled();
    });
  });

  describe("error prop", () => {
    it("error가 있을 때 에러 메시지를 표시한다", () => {
      render(<FormSelect {...defaultProps} error="필수 항목입니다" />);
      expect(screen.getByText("필수 항목입니다")).toBeInTheDocument();
    });

    it("error가 있을 때 error 클래스를 추가한다", () => {
      render(<FormSelect {...defaultProps} error="에러" />);
      expect(screen.getByRole("combobox")).toHaveClass("error");
    });

    it("error와 helpText가 둘 다 있을 때 error만 표시한다", () => {
      render(
        <FormSelect
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
      render(<FormSelect {...defaultProps} helpText="카테고리를 선택하세요" />);
      expect(screen.getByText("카테고리를 선택하세요")).toBeInTheDocument();
    });

    it("error가 없을 때만 helpText를 표시한다", () => {
      render(<FormSelect {...defaultProps} helpText="도움말" />);
      expect(screen.getByText("도움말")).toBeInTheDocument();
    });
  });

  describe("size prop", () => {
    it("size prop이 있어도 렌더링에 영향을 주지 않는다 (void)", () => {
      render(<FormSelect {...defaultProps} size="lg" />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      // size는 렌더링에 사용되지 않음
    });
  });

  describe("onChange handler", () => {
    it("선택 시 onChange가 새 값과 함께 호출된다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<FormSelect {...defaultProps} onChange={handleChange} />);

      await user.selectOptions(screen.getByRole("combobox"), "option2");
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("option2");
    });

    it("disabled 상태에서는 선택이 불가능하다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<FormSelect {...defaultProps} onChange={handleChange} disabled />);

      await user.selectOptions(screen.getByRole("combobox"), "option2");
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("CSS 클래스", () => {
    it("기본 form-select 클래스를 적용한다", () => {
      render(<FormSelect {...defaultProps} />);
      expect(screen.getByRole("combobox")).toHaveClass("form-select");
    });

    it("error가 있을 때 error 클래스를 추가한다", () => {
      render(<FormSelect {...defaultProps} error="에러" />);
      const select = screen.getByRole("combobox");
      expect(select).toHaveClass("form-select", "error");
    });

    it("helper text에 error 클래스를 조건부로 적용한다", () => {
      const { rerender } = render(
        <FormSelect {...defaultProps} helpText="도움말" />
      );
      expect(screen.getByText("도움말")).not.toHaveClass("error");

      rerender(<FormSelect {...defaultProps} error="에러" />);
      expect(screen.getByText("에러")).toHaveClass("error");
    });
  });

  describe("form-group 구조", () => {
    it("form-group 클래스를 가진 div로 감싸진다", () => {
      const { container } = render(<FormSelect {...defaultProps} />);
      expect(container.querySelector(".form-group")).toBeInTheDocument();
    });

    it("label, select, helpText 순서로 렌더링된다", () => {
      const { container } = render(
        <FormSelect {...defaultProps} label="테스트" helpText="도움말" />
      );
      const formGroup = container.querySelector(".form-group");
      const children = formGroup?.children;

      expect(children?.[0]).toHaveClass("form-label");
      expect(children?.[1]?.tagName).toBe("SELECT");
      expect(children?.[2]).toHaveClass("form-helper-text");
    });
  });

  describe("edge cases", () => {
    it("빈 options 배열로도 렌더링된다", () => {
      render(<FormSelect {...defaultProps} options={[]} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      // placeholder만 있음
      expect(screen.getByText("Select an option...")).toBeInTheDocument();
    });

    it("value가 빈 문자열일 때 placeholder가 선택된다", () => {
      render(<FormSelect {...defaultProps} value="" />);
      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("");
    });
  });
});
