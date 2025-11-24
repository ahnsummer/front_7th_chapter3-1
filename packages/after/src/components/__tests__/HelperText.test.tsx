import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HelperText } from "../ui/helper-text";

describe("HelperText", () => {
  describe("기본 렌더링", () => {
    it("text를 렌더링한다", () => {
      render(<HelperText text="도움말 텍스트" />);
      expect(screen.getByText("도움말 텍스트")).toBeInTheDocument();
    });

    it("span 요소로 렌더링된다", () => {
      const { container } = render(<HelperText text="텍스트" />);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe("텍스트");
    });

    it("기본값으로 hasError=false를 적용한다", () => {
      render(<HelperText text="텍스트" />);
      const element = screen.getByText("텍스트");
      expect(element).not.toHaveClass("text-danger");
      expect(element).toHaveClass("text-gray-600");
    });
  });

  describe("hasError prop", () => {
    it("hasError가 false일 때 일반 스타일을 적용한다", () => {
      render(<HelperText text="텍스트" hasError={false} />);
      const element = screen.getByText("텍스트");
      expect(element).toHaveClass("text-gray-600");
      expect(element).not.toHaveClass("text-danger");
    });

    it("hasError가 true일 때 에러 스타일을 적용한다", () => {
      render(<HelperText text="에러 메시지" hasError={true} />);
      const element = screen.getByText("에러 메시지");
      expect(element).toHaveClass("text-danger");
    });

    it("hasError가 undefined일 때 기본값(false)을 사용한다", () => {
      render(<HelperText text="텍스트" hasError={undefined} />);
      const element = screen.getByText("텍스트");
      expect(element).toHaveClass("text-gray-600");
    });
  });

  describe("CSS 클래스", () => {
    it("기본 클래스를 적용한다", () => {
      render(<HelperText text="텍스트" />);
      const element = screen.getByText("텍스트");
      expect(element).toHaveClass("mt-1", "text-xs");
    });

    it("hasError에 따라 클래스가 변경된다", () => {
      const { rerender } = render(
        <HelperText text="텍스트" hasError={false} />
      );
      let element = screen.getByText("텍스트");
      expect(element).toHaveClass("text-gray-600");
      expect(element).not.toHaveClass("text-danger");

      rerender(<HelperText text="텍스트" hasError={true} />);
      element = screen.getByText("텍스트");
      expect(element).toHaveClass("text-danger");
      expect(element).not.toHaveClass("text-gray-600");
    });
  });

  describe("텍스트 내용", () => {
    it("빈 문자열도 렌더링한다", () => {
      const { container } = render(<HelperText text="" />);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe("");
    });

    it("긴 텍스트를 렌더링한다", () => {
      const longText = "매우 긴 도움말 텍스트입니다.".repeat(10);
      render(<HelperText text={longText} />);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("특수문자를 포함한 텍스트를 렌더링한다", () => {
      render(<HelperText text="이메일 형식: user@example.com" />);
      expect(
        screen.getByText("이메일 형식: user@example.com")
      ).toBeInTheDocument();
    });

    it("HTML 엔티티를 이스케이프한다", () => {
      render(<HelperText text="<script>alert('xss')</script>" />);
      expect(
        screen.getByText("<script>alert('xss')</script>")
      ).toBeInTheDocument();
    });
  });

  describe("props 조합", () => {
    it("모든 props를 함께 사용할 수 있다", () => {
      render(<HelperText text="에러 메시지" hasError={true} />);
      const element = screen.getByText("에러 메시지");
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass("mt-1", "text-xs", "text-danger");
    });
  });
});
