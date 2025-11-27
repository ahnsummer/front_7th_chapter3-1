import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../ui/header";

describe("Header", () => {
  describe("기본 렌더링", () => {
    it("헤더 요소를 렌더링한다", () => {
      const { container } = render(<Header />);
      expect(container.querySelector("header")).toBeInTheDocument();
    });

    it('로고 텍스트 "L"을 렌더링한다', () => {
      render(<Header />);
      expect(screen.getByText("L")).toBeInTheDocument();
    });

    it('회사 이름 "Hanghae Company"를 렌더링한다', () => {
      render(<Header />);
      expect(screen.getByText("Hanghae Company")).toBeInTheDocument();
    });

    it('부제목 "Design System Migration Project"를 렌더링한다', () => {
      render(<Header />);
      expect(
        screen.getByText("Design System Migration Project")
      ).toBeInTheDocument();
    });

    it('사용자 이름 "Demo User"를 렌더링한다', () => {
      render(<Header />);
      expect(screen.getByText("Demo User")).toBeInTheDocument();
    });

    it('사용자 이메일 "demo@example.com"을 렌더링한다', () => {
      render(<Header />);
      expect(screen.getByText("demo@example.com")).toBeInTheDocument();
    });

    it('사용자 아바타 "DU"를 렌더링한다', () => {
      render(<Header />);
      expect(screen.getByText("DU")).toBeInTheDocument();
    });
  });

  describe("인라인 스타일", () => {
    it("header에 sticky 스타일을 적용한다", () => {
      const { container } = render(<Header />);
      const header = container.querySelector("header");
      expect(header).toHaveClass("sticky top-0 z-50");
    });

    it("header에 배경색과 border를 적용한다", () => {
      const { container } = render(<Header />);
      const header = container.querySelector("header");
      expect(header).toHaveClass("bg-white border-b border-gray-200");
    });

    it("header에 box-shadow를 적용한다", () => {
      const { container } = render(<Header />);
      const header = container.querySelector("header");
      expect(header).toHaveClass("shadow-sm");
    });
  });

  describe("레이아웃 구조", () => {
    it("로고 섹션과 사용자 정보 섹션이 flexbox로 배치된다", () => {
      const { container } = render(<Header />);
      const innerDiv = container.querySelector("header > div");
      expect(innerDiv).toHaveClass("flex justify-between items-center");
    });

    it("로고 섹션이 로고 아이콘과 텍스트를 포함한다", () => {
      render(<Header />);
      // 로고 아이콘 "L"
      expect(screen.getByText("L")).toBeInTheDocument();
      // 회사명
      expect(screen.getByText("Hanghae Company")).toBeInTheDocument();
      // 부제목
      expect(
        screen.getByText("Design System Migration Project")
      ).toBeInTheDocument();
    });

    it("사용자 정보 섹션이 이름, 이메일, 아바타를 포함한다", () => {
      render(<Header />);
      expect(screen.getByText("Demo User")).toBeInTheDocument();
      expect(screen.getByText("demo@example.com")).toBeInTheDocument();
      expect(screen.getByText("DU")).toBeInTheDocument();
    });
  });

  describe("로고 스타일", () => {
    it("로고 아이콘에 배경색과 border-radius를 적용한다", () => {
      render(<Header />);
      // "L" 텍스트를 감싸는 div를 직접 찾기
      const logoIcon = screen.getByText("L");
      expect(logoIcon).toHaveClass("bg-primary rounded-lg");
      expect(logoIcon.className).toMatch(/w-8|w-10/);
      expect(logoIcon.className).toMatch(/h-8|h-10/);
    });

    it("회사명에 올바른 스타일을 적용한다", () => {
      render(<Header />);
      const companyName = screen.getByText("Hanghae Company");
      expect(companyName.tagName).toBe("H1");
      expect(companyName).toHaveClass(
        "font-bold text-gray-900 m-0 leading-none"
      );
      expect(companyName.className).toMatch(/text-base|text-lg/);
    });

    it("부제목에 올바른 스타일을 적용한다", () => {
      render(<Header />);
      const subtitle = screen.getByText("Design System Migration Project");
      expect(subtitle.tagName).toBe("P");
      expect(subtitle).toHaveClass(
        "text-xs text-gray-700 dark:text-gray-700 m-0 leading-none mt-0.5"
      );
    });
  });

  describe("사용자 정보 스타일", () => {
    it("사용자 이름에 올바른 스타일을 적용한다", () => {
      render(<Header />);
      const userName = screen.getByText("Demo User");
      expect(userName).toHaveClass("text-sm font-semibold text-gray-900");
    });

    it("사용자 이메일에 올바른 스타일을 적용한다", () => {
      render(<Header />);
      const userEmail = screen.getByText("demo@example.com");
      expect(userEmail).toHaveClass("text-xs text-gray-700");
    });

    it("아바타에 원형 스타일을 적용한다", () => {
      render(<Header />);
      const avatar = screen.getByText("DU");
      expect(avatar).toHaveClass(
        "rounded-full bg-info-light flex items-center justify-center text-primary font-semibold"
      );
      expect(avatar.className).toMatch(/w-8|w-10/);
      expect(avatar.className).toMatch(/h-8|h-10/);
      expect(avatar.className).toMatch(/text-sm|text-base/);
    });
  });

  describe("컨테이너 스타일", () => {
    it("내부 컨테이너에 maxWidth와 padding을 적용한다", () => {
      const { container } = render(<Header />);
      const innerDiv = container.querySelector("header > div");
      expect(innerDiv).toHaveClass(
        "max-w-[1400px] mx-auto flex justify-between items-center"
      );
      expect(innerDiv?.className).toMatch(/px-3|px-6/);
      expect(innerDiv?.className).toMatch(/h-14|h-16/);
    });
  });

  describe("정적 콘텐츠", () => {
    it("props를 받지 않고 정적 콘텐츠를 렌더링한다", () => {
      render(<Header />);

      // 모든 정적 텍스트가 존재하는지 확인
      expect(screen.getByText("L")).toBeInTheDocument();
      expect(screen.getByText("Hanghae Company")).toBeInTheDocument();
      expect(
        screen.getByText("Design System Migration Project")
      ).toBeInTheDocument();
      expect(screen.getByText("Demo User")).toBeInTheDocument();
      expect(screen.getByText("demo@example.com")).toBeInTheDocument();
      expect(screen.getByText("DU")).toBeInTheDocument();
    });

    it("항상 동일한 콘텐츠를 렌더링한다", () => {
      const { rerender } = render(<Header />);
      const firstRender = screen.getByText("Hanghae Company");

      rerender(<Header />);
      const secondRender = screen.getByText("Hanghae Company");

      expect(firstRender).toBe(secondRender);
    });
  });

  describe("스냅샷", () => {
    it("일관된 구조를 렌더링한다", () => {
      const { container } = render(<Header />);

      // 기본 구조 검증
      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
      expect(header?.children).toHaveLength(1); // 하나의 내부 div

      const innerDiv = header?.children[0];
      expect(innerDiv?.children).toHaveLength(2); // 로고 섹션 + 사용자 섹션
    });
  });
});
