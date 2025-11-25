import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Label } from "../ui/label";

describe("Label", () => {
  describe("기본 렌더링", () => {
    it("children을 렌더링한다", () => {
      render(<Label required={false}>라벨 텍스트</Label>);
      expect(screen.getByText("라벨 텍스트")).toBeInTheDocument();
    });

    it("label 요소로 렌더링된다", () => {
      const { container } = render(<Label required={false}>라벨</Label>);
      const label = container.querySelector("label");
      expect(label).toBeInTheDocument();
    });

    it("기본 CSS 클래스를 적용한다", () => {
      const { container } = render(<Label required={false}>라벨</Label>);
      const label = container.querySelector("label");
      expect(label).toHaveClass("text-sm", "leading-none", "font-medium");
    });

    it("data-slot 속성을 가진다", () => {
      const { container } = render(<Label required={false}>라벨</Label>);
      const label = container.querySelector("label");
      expect(label).toHaveAttribute("data-slot", "label");
    });
  });

  describe("required prop", () => {
    it("required가 false일 때 * 표시를 렌더링하지 않는다", () => {
      render(<Label required={false}>라벨</Label>);
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("required가 true일 때 * 표시를 렌더링한다", () => {
      render(<Label required={true}>라벨</Label>);
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("* 표시에 text-danger 클래스를 적용한다", () => {
      render(<Label required={true}>라벨</Label>);
      const asterisk = screen.getByText("*");
      expect(asterisk).toHaveClass("text-danger");
    });

    it("required 표시가 children 다음에 렌더링된다", () => {
      const { container } = render(<Label required={true}>이메일</Label>);
      const label = container.querySelector("label");
      expect(label?.textContent).toBe("이메일*");
    });
  });

  describe("children 타입", () => {
    it("문자열 children을 렌더링한다", () => {
      render(<Label required={false}>Simple text</Label>);
      expect(screen.getByText("Simple text")).toBeInTheDocument();
    });

    it("JSX children을 렌더링한다", () => {
      render(
        <Label required={false}>
          <span>Complex</span> <strong>Label</strong>
        </Label>
      );
      expect(screen.getByText("Complex")).toBeInTheDocument();
      expect(screen.getByText("Label")).toBeInTheDocument();
    });

    it("빈 children도 렌더링한다", () => {
      const { container } = render(<Label required={false}></Label>);
      expect(container.querySelector("label")).toBeInTheDocument();
    });

    it("children과 required를 함께 사용한다", () => {
      render(
        <Label required={true}>
          <span>Label</span> Text
        </Label>
      );
      expect(screen.getByText("Label")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });

  describe("className prop", () => {
    it("커스텀 className을 추가할 수 있다", () => {
      const { container } = render(
        <Label required={false} className="custom-class">
          라벨
        </Label>
      );
      const label = container.querySelector("label");
      expect(label).toHaveClass("custom-class");
      expect(label).toHaveClass("text-sm"); // 기본 클래스도 유지
    });

    it("className이 기본 클래스와 병합된다", () => {
      const { container } = render(
        <Label required={false} className="text-lg text-blue-500">
          라벨
        </Label>
      );
      const label = container.querySelector("label");
      expect(label).toHaveClass("text-lg", "text-blue-500");
    });
  });

  describe("Radix UI Label props", () => {
    it("htmlFor 속성을 설정할 수 있다", () => {
      const { container } = render(
        <Label required={false} htmlFor="input-id">
          라벨
        </Label>
      );
      const label = container.querySelector("label");
      expect(label).toHaveAttribute("for", "input-id");
    });

    it("onClick 핸들러를 설정할 수 있다", async () => {
      const handleClick = vi.fn();
      render(
        <Label required={false} onClick={handleClick}>
          라벨
        </Label>
      );

      const label = screen.getByText("라벨");
      await userEvent.click(label);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("disabled 상태 스타일", () => {
    it("group-data-[disabled=true] 클래스를 가진다", () => {
      const { container } = render(<Label required={false}>라벨</Label>);
      const label = container.querySelector("label");
      // 클래스가 포함되어 있는지 확인
      const classNames = label?.className || "";
      expect(classNames).toContain(
        "group-data-[disabled=true]:pointer-events-none"
      );
      expect(classNames).toContain("group-data-[disabled=true]:opacity-50");
    });

    it("peer-disabled 클래스를 가진다", () => {
      const { container } = render(<Label required={false}>라벨</Label>);
      const label = container.querySelector("label");
      const classNames = label?.className || "";
      expect(classNames).toContain("peer-disabled:cursor-not-allowed");
      expect(classNames).toContain("peer-disabled:opacity-50");
    });
  });

  describe("접근성", () => {
    it("select-none 클래스로 텍스트 선택을 방지한다", () => {
      const { container } = render(<Label required={false}>라벨</Label>);
      const label = container.querySelector("label");
      expect(label).toHaveClass("select-none");
    });

    it("Radix UI Label의 기본 접근성 기능을 사용한다", () => {
      const { container } = render(
        <Label required={false} htmlFor="test-input">
          Test Label
        </Label>
      );
      const label = container.querySelector("label");
      expect(label).toHaveAttribute("for", "test-input");
    });
  });

  describe("edge cases", () => {
    it("required prop 없이 렌더링하면 타입 에러가 발생한다", () => {
      // TypeScript 타입 검증용 - required는 필수 prop
      // @ts-expect-error - required prop is required
      render(<Label>라벨</Label>);
      expect(screen.getByText("라벨")).toBeInTheDocument();
    });

    it("빈 문자열 children도 렌더링한다", () => {
      const { container } = render(<Label required={false}>{""}</Label>);
      expect(container.querySelector("label")).toBeInTheDocument();
    });

    it("숫자 children을 렌더링한다", () => {
      render(<Label required={false}>{123}</Label>);
      expect(screen.getByText("123")).toBeInTheDocument();
    });
  });

  describe("props 조합", () => {
    it("모든 props를 함께 사용할 수 있다", () => {
      const { container } = render(
        <Label required={true} htmlFor="test-input" className="custom-class">
          필수 라벨
        </Label>
      );

      const label = container.querySelector("label");
      expect(label).toHaveAttribute("for", "test-input");
      expect(label).toHaveClass("custom-class");
      expect(screen.getByText("필수 라벨")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });
});
