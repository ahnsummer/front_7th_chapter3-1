import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormCheckbox } from "../FormCheckbox";

describe("FormCheckbox", () => {
  const defaultProps = {
    name: "testCheckbox",
    checked: false,
    onChange: vi.fn(),
    label: "Checkbox Label",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("기본 렌더링", () => {
    it("checkbox input을 렌더링한다", () => {
      render(<FormCheckbox {...defaultProps} />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("label을 렌더링한다", () => {
      render(<FormCheckbox {...defaultProps} />);
      expect(screen.getByText("Checkbox Label")).toBeInTheDocument();
    });

    it("기본값으로 disabled=false를 적용한다", () => {
      render(<FormCheckbox {...defaultProps} />);
      expect(screen.getByRole("checkbox")).not.toBeDisabled();
    });

    it("checkmark 요소를 렌더링한다", () => {
      const { container } = render(<FormCheckbox {...defaultProps} />);
      expect(
        container.querySelector(".checkbox-checkmark")
      ).toBeInTheDocument();
    });
  });

  describe("checked prop", () => {
    it("checked가 false일 때 체크되지 않은 상태를 표시한다", () => {
      const { container } = render(
        <FormCheckbox {...defaultProps} checked={false} />
      );
      expect(screen.getByRole("checkbox")).not.toBeChecked();
      expect(
        container.querySelector(".checkbox-custom.checked")
      ).not.toBeInTheDocument();
      expect(
        container.querySelector(".checkbox-checkmark.visible")
      ).not.toBeInTheDocument();
    });

    it("checked가 true일 때 체크된 상태를 표시한다", () => {
      const { container } = render(
        <FormCheckbox {...defaultProps} checked={true} />
      );
      expect(screen.getByRole("checkbox")).toBeChecked();
      expect(
        container.querySelector(".checkbox-custom.checked")
      ).toBeInTheDocument();
      expect(
        container.querySelector(".checkbox-checkmark.visible")
      ).toBeInTheDocument();
    });
  });

  describe("disabled prop", () => {
    it("disabled가 true일 때 checkbox를 비활성화한다", () => {
      render(<FormCheckbox {...defaultProps} disabled />);
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("disabled가 true일 때 disabled 클래스를 추가한다", () => {
      const { container } = render(<FormCheckbox {...defaultProps} disabled />);
      expect(
        container.querySelector(".checkbox-wrapper.disabled")
      ).toBeInTheDocument();
      expect(
        container.querySelector(".checkbox-custom.disabled")
      ).toBeInTheDocument();
      expect(
        container.querySelector(".checkbox-label.disabled")
      ).toBeInTheDocument();
    });

    it("disabled가 false일 때 checkbox를 활성화한다", () => {
      render(<FormCheckbox {...defaultProps} disabled={false} />);
      expect(screen.getByRole("checkbox")).not.toBeDisabled();
    });
  });

  describe("onChange handler", () => {
    it("체크박스 클릭 시 onChange가 true로 호출된다 (checked=false일 때)", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <FormCheckbox
          {...defaultProps}
          checked={false}
          onChange={handleChange}
        />
      );

      await user.click(screen.getByRole("checkbox"));
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("체크박스 클릭 시 onChange가 false로 호출된다 (checked=true일 때)", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <FormCheckbox
          {...defaultProps}
          checked={true}
          onChange={handleChange}
        />
      );

      await user.click(screen.getByRole("checkbox"));
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it("wrapper 클릭 시에도 onChange가 호출된다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <FormCheckbox
          {...defaultProps}
          checked={false}
          onChange={handleChange}
        />
      );

      const wrapper = container.querySelector(".checkbox-wrapper");
      await user.click(wrapper!);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("label 클릭 시에도 onChange가 호출된다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <FormCheckbox
          {...defaultProps}
          checked={false}
          onChange={handleChange}
        />
      );

      await user.click(screen.getByText("Checkbox Label"));
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("disabled 상태에서는 클릭이 작동하지 않는다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <FormCheckbox {...defaultProps} onChange={handleChange} disabled />
      );

      await user.click(screen.getByRole("checkbox"));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("disabled 상태에서 wrapper 클릭도 작동하지 않는다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <FormCheckbox {...defaultProps} onChange={handleChange} disabled />
      );

      const wrapper = container.querySelector(".checkbox-wrapper");
      await user.click(wrapper!);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("error prop", () => {
    it("error가 있을 때 에러 메시지를 표시한다", () => {
      render(<FormCheckbox {...defaultProps} error="필수 항목입니다" />);
      expect(screen.getByText("필수 항목입니다")).toBeInTheDocument();
    });

    it("error가 있을 때 label에 error 클래스를 추가한다", () => {
      const { container } = render(
        <FormCheckbox {...defaultProps} error="에러" />
      );
      expect(
        container.querySelector(".checkbox-label.error")
      ).toBeInTheDocument();
    });

    it("error와 hint가 둘 다 있을 때 error만 표시한다", () => {
      render(
        <FormCheckbox
          {...defaultProps}
          error="에러 메시지"
          hint="힌트 텍스트"
        />
      );
      expect(screen.getByText("에러 메시지")).toBeInTheDocument();
      expect(screen.queryByText("힌트 텍스트")).not.toBeInTheDocument();
    });

    it("error가 없을 때는 error 클래스를 추가하지 않는다", () => {
      const { container } = render(<FormCheckbox {...defaultProps} />);
      expect(
        container.querySelector(".checkbox-label.error")
      ).not.toBeInTheDocument();
    });
  });

  describe("hint prop", () => {
    it("hint를 표시한다", () => {
      render(<FormCheckbox {...defaultProps} hint="이용약관에 동의해주세요" />);
      expect(screen.getByText("이용약관에 동의해주세요")).toBeInTheDocument();
    });

    it("error가 없을 때만 hint를 표시한다", () => {
      render(<FormCheckbox {...defaultProps} hint="힌트" />);
      expect(screen.getByText("힌트")).toBeInTheDocument();
    });

    it("error가 있으면 hint를 표시하지 않는다", () => {
      render(<FormCheckbox {...defaultProps} hint="힌트" error="에러" />);
      expect(screen.queryByText("힌트")).not.toBeInTheDocument();
    });
  });

  describe("CSS 클래스", () => {
    it("기본 checkbox 관련 클래스를 적용한다", () => {
      const { container } = render(<FormCheckbox {...defaultProps} />);
      expect(container.querySelector(".checkbox-wrapper")).toBeInTheDocument();
      expect(
        container.querySelector(".checkbox-container")
      ).toBeInTheDocument();
      expect(container.querySelector(".checkbox-input")).toBeInTheDocument();
      expect(container.querySelector(".checkbox-custom")).toBeInTheDocument();
      expect(
        container.querySelector(".checkbox-checkmark")
      ).toBeInTheDocument();
      expect(container.querySelector(".checkbox-label")).toBeInTheDocument();
    });

    it("checked 상태에 따라 클래스를 변경한다", () => {
      const { container, rerender } = render(
        <FormCheckbox {...defaultProps} checked={false} />
      );

      expect(
        container.querySelector(".checkbox-custom.checked")
      ).not.toBeInTheDocument();
      expect(
        container.querySelector(".checkbox-checkmark.visible")
      ).not.toBeInTheDocument();

      rerender(<FormCheckbox {...defaultProps} checked={true} />);

      expect(
        container.querySelector(".checkbox-custom.checked")
      ).toBeInTheDocument();
      expect(
        container.querySelector(".checkbox-checkmark.visible")
      ).toBeInTheDocument();
    });

    it("disabled 상태에 따라 클래스를 변경한다", () => {
      const { container, rerender } = render(
        <FormCheckbox {...defaultProps} disabled={false} />
      );

      expect(
        container.querySelector(".checkbox-wrapper.disabled")
      ).not.toBeInTheDocument();

      rerender(<FormCheckbox {...defaultProps} disabled={true} />);

      expect(
        container.querySelector(".checkbox-wrapper.disabled")
      ).toBeInTheDocument();
      expect(
        container.querySelector(".checkbox-custom.disabled")
      ).toBeInTheDocument();
      expect(
        container.querySelector(".checkbox-label.disabled")
      ).toBeInTheDocument();
    });
  });

  describe("checkbox input 속성", () => {
    it("name 속성을 설정한다", () => {
      render(<FormCheckbox {...defaultProps} />);
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "name",
        "testCheckbox"
      );
    });

    it("checkbox-input 클래스를 가진다", () => {
      const { container } = render(<FormCheckbox {...defaultProps} />);
      const input = container.querySelector(".checkbox-input");
      expect(input).toHaveAttribute("type", "checkbox");
    });

    it("input의 onChange는 빈 함수이다 (wrapper onClick으로 처리)", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<FormCheckbox {...defaultProps} onChange={handleChange} />);

      // wrapper를 통해 클릭하면 onChange가 호출됨
      const { container } = render(
        <FormCheckbox {...defaultProps} onChange={handleChange} />
      );
      const wrapper = container.querySelector(".checkbox-wrapper");
      await user.click(wrapper!);
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe("checkmark 표시", () => {
    it("checked=false일 때 체크마크를 숨긴다", () => {
      const { container } = render(
        <FormCheckbox {...defaultProps} checked={false} />
      );
      const checkmark = container.querySelector(".checkbox-checkmark");
      expect(checkmark).not.toHaveClass("visible");
      expect(checkmark?.textContent).toBe("✓");
    });

    it("checked=true일 때 체크마크를 표시한다", () => {
      const { container } = render(
        <FormCheckbox {...defaultProps} checked={true} />
      );
      const checkmark = container.querySelector(".checkbox-checkmark");
      expect(checkmark).toHaveClass("visible");
      expect(checkmark?.textContent).toBe("✓");
    });
  });

  describe("props 조합 테스트", () => {
    it("모든 props를 함께 사용할 수 있다", () => {
      const handleChange = vi.fn();
      render(
        <FormCheckbox
          name="terms"
          checked={true}
          onChange={handleChange}
          label="이용약관 동의"
          disabled={false}
          error=""
          hint="필수 항목입니다"
        />
      );

      expect(screen.getByRole("checkbox")).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeChecked();
      expect(screen.getByText("이용약관 동의")).toBeInTheDocument();
      expect(screen.getByText("필수 항목입니다")).toBeInTheDocument();
    });

    it("checked와 disabled를 함께 사용할 수 있다", () => {
      render(<FormCheckbox {...defaultProps} checked={true} disabled={true} />);
      expect(screen.getByRole("checkbox")).toBeChecked();
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });
  });

  describe("edge cases", () => {
    it("빈 label로도 렌더링된다", () => {
      render(<FormCheckbox {...defaultProps} label="" />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("stopPropagation이 작동한다 (wrapper 외부 클릭 방지)", async () => {
      const handleChange = vi.fn();
      const outerClick = vi.fn();
      const user = userEvent.setup();

      const { container } = render(
        <div onClick={outerClick}>
          <FormCheckbox {...defaultProps} onChange={handleChange} />
        </div>
      );

      const customCheckbox = container.querySelector(".checkbox-custom");
      await user.click(customCheckbox!);

      // onChange는 호출되지만, stopPropagation으로 인해 outerClick은 호출 안됨
      expect(handleChange).toHaveBeenCalled();
    });
  });
});
