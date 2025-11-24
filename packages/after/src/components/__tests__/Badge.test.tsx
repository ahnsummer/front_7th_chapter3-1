import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../ui/badge";

describe("Badge", () => {
  describe("기본 렌더링", () => {
    it("children을 렌더링한다", () => {
      render(<Badge>테스트 뱃지</Badge>);
      expect(screen.getByText("테스트 뱃지")).toBeInTheDocument();
    });

    it("기본값으로 primary variant와 md size를 적용한다", () => {
      render(<Badge>기본</Badge>);
      const badge = screen.getByText("기본");
      expect(badge).toHaveClass("bg-primary", "px-1.5", "py-0.5", "text-sm");
    });

    it("pill이 false일 때 rounded-xl 클래스를 적용하지 않는다", () => {
      render(<Badge pill={false}>뱃지</Badge>);
      expect(screen.getByText("뱃지")).not.toHaveClass("rounded-xl");
    });
  });

  describe("variant prop", () => {
    it.each([
      ["primary", "bg-primary"],
      ["secondary", "bg-secondary"],
      ["success", "bg-success"],
      ["danger", "bg-danger"],
      ["warning", "bg-warning"],
      ["info", "bg-info"],
    ] as const)(
      "variant이 %s일 때 %s 클래스를 적용한다",
      (variant, className) => {
        render(<Badge variant={variant}>뱃지</Badge>);
        expect(screen.getByText("뱃지")).toHaveClass(className);
      }
    );
  });

  describe("size prop", () => {
    it("size가 sm일 때 작은 크기를 적용한다", () => {
      render(<Badge size="sm">뱃지</Badge>);
      const badge = screen.getByText("뱃지");
      expect(badge).toHaveClass("px-1", "py-0.5", "text-xs");
    });

    it("size가 md일 때 중간 크기를 적용한다", () => {
      render(<Badge size="md">뱃지</Badge>);
      const badge = screen.getByText("뱃지");
      expect(badge).toHaveClass("px-1.5", "py-0.5", "text-sm");
    });

    it("size가 lg일 때 큰 크기를 적용한다", () => {
      render(<Badge size="lg">뱃지</Badge>);
      const badge = screen.getByText("뱃지");
      expect(badge).toHaveClass("px-2", "py-1", "text-md");
    });
  });

  describe("pill prop", () => {
    it("pill이 true일 때 rounded-xl 클래스를 적용한다", () => {
      render(<Badge pill={true}>뱃지</Badge>);
      expect(screen.getByText("뱃지")).toHaveClass("rounded-full");
    });
  });

  describe("status prop", () => {
    it('status가 published일 때 success variant와 "게시됨" 텍스트를 표시한다', () => {
      render(<Badge status="published" />);
      expect(screen.getByText("게시됨")).toBeInTheDocument();
      expect(screen.getByText("게시됨")).toHaveClass("bg-success");
    });

    it('status가 draft일 때 warning variant와 "임시저장" 텍스트를 표시한다', () => {
      render(<Badge status="draft" />);
      expect(screen.getByText("임시저장")).toBeInTheDocument();
      expect(screen.getByText("임시저장")).toHaveClass("bg-warning");
    });

    it('status가 archived일 때 secondary variant와 "보관됨" 텍스트를 표시한다', () => {
      render(<Badge status="archived" />);
      expect(screen.getByText("보관됨")).toBeInTheDocument();
      expect(screen.getByText("보관됨")).toHaveClass("bg-secondary");
    });

    it('status가 pending일 때 info variant와 "대기중" 텍스트를 표시한다', () => {
      render(<Badge status="pending" />);
      expect(screen.getByText("대기중")).toBeInTheDocument();
      expect(screen.getByText("대기중")).toHaveClass("bg-info");
    });

    it('status가 rejected일 때 danger variant와 "거부됨" 텍스트를 표시한다', () => {
      render(<Badge status="rejected" />);
      expect(screen.getByText("거부됨")).toBeInTheDocument();
      expect(screen.getByText("거부됨")).toHaveClass("bg-danger");
    });

    it("status가 있을 때 children이 있으면 children을 우선 표시한다", () => {
      render(<Badge status="published">커스텀 텍스트</Badge>);
      expect(screen.getByText("커스텀 텍스트")).toBeInTheDocument();
      expect(screen.queryByText("게시됨")).not.toBeInTheDocument();
    });
  });

  describe("userRole prop", () => {
    it('userRole이 admin일 때 danger variant와 "관리자" 텍스트를 표시한다', () => {
      render(<Badge userRole="admin" />);
      expect(screen.getByText("관리자")).toBeInTheDocument();
      expect(screen.getByText("관리자")).toHaveClass("bg-danger");
    });

    it('userRole이 moderator일 때 warning variant와 "운영자" 텍스트를 표시한다', () => {
      render(<Badge userRole="moderator" />);
      expect(screen.getByText("운영자")).toBeInTheDocument();
      expect(screen.getByText("운영자")).toHaveClass("bg-warning");
    });

    it('userRole이 user일 때 primary variant와 "사용자" 텍스트를 표시한다', () => {
      render(<Badge userRole="user" />);
      expect(screen.getByText("사용자")).toBeInTheDocument();
      expect(screen.getByText("사용자")).toHaveClass("bg-primary");
    });

    it('userRole이 guest일 때 secondary variant와 "게스트" 텍스트를 표시한다', () => {
      render(<Badge userRole="guest" />);
      expect(screen.getByText("게스트")).toBeInTheDocument();
      expect(screen.getByText("게스트")).toHaveClass("bg-secondary");
    });

    it("userRole이 있을 때 children이 있으면 children을 우선 표시한다", () => {
      render(<Badge userRole="admin">슈퍼관리자</Badge>);
      expect(screen.getByText("슈퍼관리자")).toBeInTheDocument();
      expect(screen.queryByText("관리자")).not.toBeInTheDocument();
    });
  });

  describe("priority prop", () => {
    it('priority가 high일 때 danger variant와 "높음" 텍스트를 표시한다', () => {
      render(<Badge priority="high" />);
      expect(screen.getByText("높음")).toBeInTheDocument();
      expect(screen.getByText("높음")).toHaveClass("bg-danger");
    });

    it('priority가 medium일 때 warning variant와 "보통" 텍스트를 표시한다', () => {
      render(<Badge priority="medium" />);
      expect(screen.getByText("보통")).toBeInTheDocument();
      expect(screen.getByText("보통")).toHaveClass("bg-warning");
    });

    it('priority가 low일 때 info variant와 "낮음" 텍스트를 표시한다', () => {
      render(<Badge priority="low" />);
      expect(screen.getByText("낮음")).toBeInTheDocument();
      expect(screen.getByText("낮음")).toHaveClass("bg-info");
    });

    it("priority가 있을 때 children이 있으면 children을 우선 표시한다", () => {
      render(<Badge priority="high">긴급</Badge>);
      expect(screen.getByText("긴급")).toBeInTheDocument();
      expect(screen.queryByText("높음")).not.toBeInTheDocument();
    });
  });

  describe("paymentStatus prop", () => {
    it('paymentStatus가 paid일 때 success variant와 "결제완료" 텍스트를 표시한다', () => {
      render(<Badge paymentStatus="paid" />);
      expect(screen.getByText("결제완료")).toBeInTheDocument();
      expect(screen.getByText("결제완료")).toHaveClass("bg-success");
    });

    it('paymentStatus가 pending일 때 warning variant와 "결제대기" 텍스트를 표시한다', () => {
      render(<Badge paymentStatus="pending" />);
      expect(screen.getByText("결제대기")).toBeInTheDocument();
      expect(screen.getByText("결제대기")).toHaveClass("bg-warning");
    });

    it('paymentStatus가 failed일 때 danger variant와 "결제실패" 텍스트를 표시한다', () => {
      render(<Badge paymentStatus="failed" />);
      expect(screen.getByText("결제실패")).toBeInTheDocument();
      expect(screen.getByText("결제실패")).toHaveClass("bg-danger");
    });

    it('paymentStatus가 refunded일 때 secondary variant와 "환불됨" 텍스트를 표시한다', () => {
      render(<Badge paymentStatus="refunded" />);
      expect(screen.getByText("환불됨")).toBeInTheDocument();
      expect(screen.getByText("환불됨")).toHaveClass("bg-secondary");
    });

    it("paymentStatus가 있을 때 children이 있으면 children을 우선 표시한다", () => {
      render(<Badge paymentStatus="paid">결제 성공</Badge>);
      expect(screen.getByText("결제 성공")).toBeInTheDocument();
      expect(screen.queryByText("결제완료")).not.toBeInTheDocument();
    });
  });

  describe("showIcon prop", () => {
    it("showIcon이 true일 때도 정상 렌더링된다 (아이콘 미구현)", () => {
      render(<Badge showIcon={true}>뱃지</Badge>);
      expect(screen.getByText("뱃지")).toBeInTheDocument();
    });

    it("showIcon이 false일 때 정상 렌더링된다", () => {
      render(<Badge showIcon={false}>뱃지</Badge>);
      expect(screen.getByText("뱃지")).toBeInTheDocument();
    });
  });

  describe("props 조합 테스트", () => {
    it("status와 pill을 함께 사용할 수 있다", () => {
      render(
        <Badge status="published" pill>
          게시
        </Badge>
      );
      const badge = screen.getByText("게시");
      expect(badge).toHaveClass("bg-success", "rounded-full");
    });

    it("userRole, size, pill을 함께 사용할 수 있다", () => {
      render(<Badge userRole="admin" size="lg" pill />);
      const badge = screen.getByText("관리자");
      expect(badge).toHaveClass("bg-danger", "px-2", "rounded-full");
    });

    it("여러 semantic prop이 동시에 있으면 variant는 마지막 것이 우선되지만 content는 첫 번째 것이 유지된다", () => {
      render(
        <Badge
          status="published"
          userRole="admin"
          priority="high"
          paymentStatus="paid"
        />
      );
      // actualContent는 status에서 '게시됨'으로 설정된 후 변경되지 않음
      // actualType은 paymentStatus의 'success'가 마지막으로 적용됨
      expect(screen.getByText("게시됨")).toBeInTheDocument();
      expect(screen.getByText("게시됨")).toHaveClass("bg-success");
    });
  });
});
