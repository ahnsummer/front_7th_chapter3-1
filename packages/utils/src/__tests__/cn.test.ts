import { describe, it, expect } from "vitest";
import { cn } from "../cn";

describe("cn", () => {
  describe("기본 기능", () => {
    it("단일 클래스를 반환한다", () => {
      expect(cn("text-red-500")).toBe("text-red-500");
    });

    it("여러 클래스를 병합한다", () => {
      expect(cn("text-red-500", "bg-blue-500")).toBe(
        "text-red-500 bg-blue-500"
      );
    });

    it("빈 문자열을 무시한다", () => {
      expect(cn("", "text-red-500", "")).toBe("text-red-500");
    });

    it("undefined를 무시한다", () => {
      expect(cn(undefined, "text-red-500", undefined)).toBe("text-red-500");
    });

    it("null을 무시한다", () => {
      expect(cn(null, "text-red-500", null)).toBe("text-red-500");
    });

    it("false를 무시한다", () => {
      expect(cn(false, "text-red-500", false)).toBe("text-red-500");
    });
  });

  describe("clsx 기능 - 조건부 클래스", () => {
    it("조건부로 클래스를 적용한다", () => {
      const isActive = true;
      expect(cn("base", isActive && "active")).toBe("base active");
    });

    it("false 조건의 클래스는 무시한다", () => {
      const isActive = false;
      expect(cn("base", isActive && "active")).toBe("base");
    });

    it("객체 형태의 조건부 클래스를 지원한다", () => {
      expect(cn({ "text-red-500": true, "bg-blue-500": false })).toBe(
        "text-red-500"
      );
    });

    it("배열을 지원한다", () => {
      expect(cn(["text-red-500", "bg-blue-500"])).toBe(
        "text-red-500 bg-blue-500"
      );
    });

    it("중첩된 배열을 지원한다", () => {
      expect(cn(["text-red-500", ["bg-blue-500", "p-4"]])).toBe(
        "text-red-500 bg-blue-500 p-4"
      );
    });
  });

  describe("tailwind-merge 기능 - 충돌 해결", () => {
    it("같은 속성의 클래스는 마지막 것이 우선한다", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("padding 충돌을 해결한다", () => {
      expect(cn("p-4", "p-8")).toBe("p-8");
    });

    it("특정 방향 padding은 전체 padding과 함께 유지된다", () => {
      expect(cn("p-4", "px-8")).toBe("p-4 px-8");
    });

    it("배경색 충돌을 해결한다", () => {
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("텍스트 크기 충돌을 해결한다", () => {
      expect(cn("text-sm", "text-lg")).toBe("text-lg");
    });

    it("border 충돌을 해결한다", () => {
      expect(cn("border-2", "border-4")).toBe("border-4");
    });

    it("width 충돌을 해결한다", () => {
      expect(cn("w-full", "w-1/2")).toBe("w-1/2");
    });

    it("높이 충돌을 해결한다", () => {
      expect(cn("h-10", "h-20")).toBe("h-20");
    });

    it("flexbox 충돌을 해결한다", () => {
      expect(cn("flex-row", "flex-col")).toBe("flex-col");
    });
  });

  describe("복잡한 시나리오", () => {
    it("조건부와 충돌 해결을 함께 사용한다", () => {
      const isError = true;
      expect(cn("border-gray-400", isError && "border-red-500")).toBe(
        "border-red-500"
      );
    });

    it("여러 조건과 충돌을 처리한다", () => {
      const isError = true;
      const isDisabled = false;
      expect(
        cn(
          "px-4 py-2 text-sm",
          isError && "border-red-500",
          isDisabled && "opacity-50",
          "text-base" // text-sm 덮어쓰기
        )
      ).toBe("px-4 py-2 border-red-500 text-base");
    });

    it("객체와 문자열을 섞어 사용한다", () => {
      expect(
        cn(
          "base-class",
          { "error-class": true, "disabled-class": false },
          "extra-class"
        )
      ).toBe("base-class error-class extra-class");
    });

    it("undefined가 있는 배열을 처리한다", () => {
      const conditionalClass = false ? "hidden" : undefined;
      expect(cn("flex", conditionalClass, "items-center")).toBe(
        "flex items-center"
      );
    });

    it("중복된 클래스를 제거한다", () => {
      expect(cn("flex", "flex", "items-center")).toBe("flex items-center");
    });
  });

  describe("실제 사용 사례", () => {
    it("버튼 variant 클래스를 병합한다", () => {
      const baseClasses = "px-4 py-2 rounded";
      const variantClasses = "bg-primary text-white";
      const customClasses = "bg-blue-600"; // variant 덮어쓰기

      expect(cn(baseClasses, variantClasses, customClasses)).toBe(
        "px-4 py-2 rounded text-white bg-blue-600"
      );
    });

    it("Input 컴포넌트 스타일을 병합한다", () => {
      const baseClasses = "w-full px-2.5 py-2 border";
      const errorClasses = false;
      const customClasses = "w-1/2"; // width 덮어쓰기

      expect(
        cn(baseClasses, errorClasses && "border-red-500", customClasses)
      ).toBe("px-2.5 py-2 border w-1/2");
    });

    it("cva variants와 className을 병합한다", () => {
      // cva에서 생성된 클래스
      const variantClasses =
        "inline-flex items-center px-2 py-1 text-sm bg-primary";
      // 사용자 커스텀 클래스
      const className = "bg-blue-600 text-base"; // bg, text-size 덮어쓰기

      expect(cn(variantClasses, className)).toBe(
        "inline-flex items-center px-2 py-1 bg-blue-600 text-base"
      );
    });

    it("Table 컴포넌트의 동적 클래스를 병합한다", () => {
      const baseClasses = "cursor-default";
      const clickable = true;

      expect(cn(clickable ? "cursor-pointer" : baseClasses)).toBe(
        "cursor-pointer"
      );
    });

    it("responsive 클래스와 일반 클래스를 병합한다", () => {
      expect(cn("w-full", "md:w-1/2", "lg:w-1/3")).toBe(
        "w-full md:w-1/2 lg:w-1/3"
      );
    });

    it("hover, focus 같은 pseudo 클래스를 병합한다", () => {
      expect(cn("bg-primary", "hover:bg-primary/90", "focus:ring-2")).toBe(
        "bg-primary hover:bg-primary/90 focus:ring-2"
      );
    });

    it("arbitrary values를 병합한다", () => {
      expect(cn("w-[100px]", "w-[200px]")).toBe("w-[200px]");
    });
  });

  describe("edge cases", () => {
    it("인자 없이 호출하면 빈 문자열을 반환한다", () => {
      expect(cn()).toBe("");
    });

    it("모든 인자가 falsy면 빈 문자열을 반환한다", () => {
      expect(cn(null, undefined, false, "")).toBe("");
    });

    it("빈 객체를 처리한다", () => {
      expect(cn({})).toBe("");
    });

    it("빈 배열을 처리한다", () => {
      expect(cn([])).toBe("");
    });

    it("숫자 0은 falsy로 무시된다", () => {
      expect(cn("text-red-500", 0)).toBe("text-red-500");
    });

    it("숫자 1 이상은 문자열로 변환된다", () => {
      expect(cn("text-red-500", 1)).toBe("text-red-500 1");
    });

    it("매우 긴 클래스 리스트를 처리한다", () => {
      const longClassList = Array.from({ length: 50 }, (_, i) => `class-${i}`);
      const result = cn(...longClassList);
      expect(result).toContain("class-0");
      expect(result).toContain("class-49");
    });
  });
});
