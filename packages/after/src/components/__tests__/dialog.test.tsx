import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "../ui/dialog";

describe("Dialog", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: "Dialog content",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // body overflow 초기화
    document.body.style.overflow = "unset";
  });

  afterEach(() => {
    // 테스트 후 정리
    document.body.style.overflow = "unset";
  });

  describe("기본 렌더링", () => {
    it("isOpen이 true일 때 모달을 렌더링한다", () => {
      render(<Dialog {...defaultProps} />);
      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });

    it("isOpen이 false일 때 모달을 렌더링하지 않는다", () => {
      render(<Dialog {...defaultProps} isOpen={false} />);
      expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
    });

    it('기본값으로 size="md"을 적용한다', () => {
      const { container } = render(<Dialog {...defaultProps} />);
      const content = container.querySelector(
        ".bg-white.rounded-xl, .dark\\:bg-gray-50"
      );
      expect(content).toBeInTheDocument();
      // 반응형 클래스는 미디어 쿼리이므로 className에 포함되어 있는지 확인
      if (content) {
        expect(content.className).toContain("max-w-[calc(100vw-2rem)]");
        expect(content.className).toContain("sm:max-w-[600px]");
      }
    });

    it("title이 없을 때 header를 렌더링하지 않는다", () => {
      render(<Dialog {...defaultProps} />);
      // title이 없으면 × 버튼도 없음
      expect(screen.queryByText("×")).not.toBeInTheDocument();
    });

    it("showFooter가 false일 때 footer를 렌더링하지 않는다", () => {
      const { container } = render(
        <Dialog
          {...defaultProps}
          showFooter={false}
          footerContent={<div>Footer</div>}
        />
      );
      // footer가 없으면 border-t를 가진 div가 없어야 함
      const footerDiv = Array.from(container.querySelectorAll("div")).find(
        (div) => div.className.includes("border-t")
      );
      expect(footerDiv).toBeUndefined();
    });
  });

  describe("title prop", () => {
    it("title이 있을 때 header와 title을 렌더링한다", () => {
      render(<Dialog {...defaultProps} title="Dialog Title" />);
      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      expect(screen.getByText("×")).toBeInTheDocument();
    });

    it("title이 있을 때 close 버튼을 렌더링한다", () => {
      render(<Dialog {...defaultProps} title="Dialog Title" />);
      expect(screen.getByText("×")).toBeInTheDocument();
    });

    it("title이 h3 요소로 렌더링된다", () => {
      render(<Dialog {...defaultProps} title="Dialog Title" />);
      const title = screen.getByText("Dialog Title");
      expect(title.tagName).toBe("H3");
      expect(title).toHaveClass("m-0", "text-xl", "font-medium");
    });
  });

  describe("size prop", () => {
    it.each([
      ["sm", "sm:max-w-[400px]"],
      ["md", "sm:max-w-[600px]"],
      ["lg", "sm:max-w-[900px]"],
    ] as const)("size가 %s일 때 %s 클래스를 적용한다", (size, maxWidth) => {
      const { container } = render(<Dialog {...defaultProps} size={size} />);
      const content = container.querySelector(
        ".bg-white.rounded-xl, .dark\\:bg-gray-50"
      );
      expect(content).toBeInTheDocument();
      // 반응형 클래스는 미디어 쿼리이므로 className에 포함되어 있는지 확인
      if (content) {
        expect(content.className).toContain("max-w-[calc(100vw-2rem)]");
        expect(content.className).toContain(maxWidth);
      }
    });
  });

  describe("showFooter와 footerContent", () => {
    it("showFooter가 false일 때 footer를 렌더링하지 않는다", () => {
      const { container } = render(
        <Dialog
          {...defaultProps}
          showFooter={false}
          footerContent={<div>Footer</div>}
        />
      );
      expect(container.querySelector(".Dialog-footer")).not.toBeInTheDocument();
    });

    it("showFooter가 true이고 footerContent가 있을 때 footer를 렌더링한다", () => {
      render(
        <Dialog
          {...defaultProps}
          showFooter={true}
          footerContent={<button>Confirm</button>}
        />
      );
      expect(
        screen.getByRole("button", { name: "Confirm" })
      ).toBeInTheDocument();
    });

    it("showFooter가 true이지만 footerContent가 없으면 footer를 렌더링하지 않는다", () => {
      const { container } = render(
        <Dialog {...defaultProps} showFooter={true} />
      );
      expect(container.querySelector(".Dialog-footer")).not.toBeInTheDocument();
    });

    it("footerContent에 여러 요소를 렌더링할 수 있다", () => {
      const footerContent = (
        <>
          <button>Cancel</button>
          <button>Confirm</button>
        </>
      );
      render(
        <Dialog {...defaultProps} showFooter footerContent={footerContent} />
      );
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Confirm" })
      ).toBeInTheDocument();
    });
  });

  describe("onClose handler", () => {
    it("overlay 클릭 시 onClose가 호출된다", async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Dialog {...defaultProps} onClose={handleClose} />
      );

      // fixed position인 첫 번째 div가 overlay
      const overlay = container.querySelector(".fixed");
      await user.click(overlay!);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("Dialog content 클릭 시 onClose가 호출되지 않는다 (stopPropagation)", async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Dialog {...defaultProps} onClose={handleClose} />
      );

      // bg-white를 가진 div가 content
      const DialogContent = container.querySelector(".bg-white");
      await user.click(DialogContent!);
      expect(handleClose).not.toHaveBeenCalled();
    });

    it("header close 버튼 클릭 시 onClose가 호출된다", async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      render(<Dialog {...defaultProps} title="Title" onClose={handleClose} />);

      await user.click(screen.getByText("×"));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("body 내부 요소 클릭 시 onClose가 호출되지 않는다", async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      render(
        <Dialog {...defaultProps} onClose={handleClose}>
          <button>Inner button</button>
        </Dialog>
      );

      await user.click(screen.getByRole("button", { name: "Inner button" }));
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe("body overflow 관리", () => {
    it("isOpen이 true가 되면 body overflow를 hidden으로 설정한다", () => {
      render(<Dialog {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("isOpen이 false가 되면 body overflow를 unset으로 복원한다", () => {
      const { rerender } = render(<Dialog {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");

      rerender(<Dialog {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe("unset");
    });

    it("컴포넌트 언마운트 시 body overflow를 복원한다", () => {
      const { unmount } = render(<Dialog {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");

      unmount();
      expect(document.body.style.overflow).toBe("unset");
    });

    it("isOpen이 변경될 때마다 body overflow를 업데이트한다", () => {
      const { rerender } = render(<Dialog {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe("unset");

      rerender(<Dialog {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");

      rerender(<Dialog {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe("unset");

      rerender(<Dialog {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  describe("CSS 구조", () => {
    it("overlay, content, body를 렌더링한다", () => {
      const { container } = render(<Dialog {...defaultProps} />);
      // overlay (fixed)
      expect(container.querySelector(".fixed")).toBeInTheDocument();
      // content (bg-white rounded-xl)
      expect(
        container.querySelector(".bg-white.rounded-xl")
      ).toBeInTheDocument();
      // body (overflow-y-auto)
      expect(container.querySelector(".overflow-y-auto")).toBeInTheDocument();
    });

    it("title이 있을 때 header를 렌더링한다", () => {
      render(<Dialog {...defaultProps} title="Title" />);
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("×")).toBeInTheDocument();
    });

    it("showFooter와 footerContent가 있을 때 footer를 렌더링한다", () => {
      render(
        <Dialog
          {...defaultProps}
          showFooter
          footerContent={<div>Footer</div>}
        />
      );
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });

    it("구조 순서: header, body, footer", () => {
      const { container } = render(
        <Dialog
          {...defaultProps}
          title="Title"
          showFooter
          footerContent={<div>Footer</div>}>
          Body
        </Dialog>
      );

      const content = container.querySelector(".bg-white.rounded-xl");
      const children = content?.children;

      // header (border-b)
      expect(children?.[0]).toHaveClass("border-b");
      // body (overflow-y-auto)
      expect(children?.[1]).toHaveClass("overflow-y-auto");
      // footer (border-t)
      expect(children?.[2]).toHaveClass("border-t");
    });
  });

  describe("props 조합 테스트", () => {
    it("모든 props를 함께 사용할 수 있다", async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      const footerContent = <button>Submit</button>;

      render(
        <Dialog
          isOpen={true}
          onClose={handleClose}
          title="Complete Dialog"
          size="lg"
          showFooter
          footerContent={footerContent}>
          <p>Dialog body content</p>
        </Dialog>
      );

      expect(screen.getByText("Complete Dialog")).toBeInTheDocument();
      expect(screen.getByText("Dialog body content")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Submit" })
      ).toBeInTheDocument();

      await user.click(screen.getByText("×"));
      expect(handleClose).toHaveBeenCalled();
    });

    it("최소 props만으로 렌더링할 수 있다", () => {
      render(
        <Dialog isOpen={true} onClose={vi.fn()}>
          Content
        </Dialog>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("children 타입", () => {
    it("문자열 children을 렌더링한다", () => {
      render(<Dialog {...defaultProps}>Simple text</Dialog>);
      expect(screen.getByText("Simple text")).toBeInTheDocument();
    });

    it("JSX children을 렌더링한다", () => {
      render(
        <Dialog {...defaultProps}>
          <div data-testid="custom">Custom content</div>
        </Dialog>
      );
      expect(screen.getByTestId("custom")).toBeInTheDocument();
    });

    it("복잡한 children 구조를 렌더링한다", () => {
      render(
        <Dialog {...defaultProps}>
          <h2>Title</h2>
          <p>Paragraph</p>
          <form>
            <input type="text" />
            <button>Submit</button>
          </form>
        </Dialog>
      );

      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Submit" })
      ).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("isOpen이 빠르게 토글되어도 정상 작동한다", () => {
      const { rerender } = render(<Dialog {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");

      rerender(<Dialog {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe("unset");

      rerender(<Dialog {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("title 없이 header close 버튼을 렌더링하지 않는다", () => {
      render(<Dialog {...defaultProps} />);
      expect(screen.queryByText("×")).not.toBeInTheDocument();
    });

    it("footerContent 없이 showFooter만 true여도 footer가 렌더링되지 않는다", () => {
      const { container } = render(
        <Dialog {...defaultProps} showFooter={true} footerContent={undefined} />
      );
      const footerDiv = Array.from(container.querySelectorAll("div")).find(
        (div) => div.className.includes("border-t")
      );
      expect(footerDiv).toBeUndefined();
    });
  });
});
