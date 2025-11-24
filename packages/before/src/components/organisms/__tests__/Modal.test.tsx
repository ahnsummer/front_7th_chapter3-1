import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "../Modal";

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: "Modal content",
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
      render(<Modal {...defaultProps} />);
      expect(screen.getByText("Modal content")).toBeInTheDocument();
    });

    it("isOpen이 false일 때 모달을 렌더링하지 않는다", () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
    });

    it('기본값으로 size="medium"을 적용한다', () => {
      const { container } = render(<Modal {...defaultProps} />);
      expect(container.querySelector(".modal-medium")).toBeInTheDocument();
    });

    it("title이 없을 때 header를 렌더링하지 않는다", () => {
      const { container } = render(<Modal {...defaultProps} />);
      expect(container.querySelector(".modal-header")).not.toBeInTheDocument();
    });

    it("showFooter가 false일 때 footer를 렌더링하지 않는다", () => {
      const { container } = render(
        <Modal {...defaultProps} showFooter={false} />
      );
      expect(container.querySelector(".modal-footer")).not.toBeInTheDocument();
    });
  });

  describe("title prop", () => {
    it("title이 있을 때 header와 title을 렌더링한다", () => {
      const { container } = render(
        <Modal {...defaultProps} title="Modal Title" />
      );
      expect(container.querySelector(".modal-header")).toBeInTheDocument();
      expect(screen.getByText("Modal Title")).toBeInTheDocument();
    });

    it("title이 있을 때 close 버튼을 렌더링한다", () => {
      render(<Modal {...defaultProps} title="Modal Title" />);
      expect(screen.getByText("×")).toBeInTheDocument();
    });

    it("title이 h3 요소로 렌더링된다", () => {
      render(<Modal {...defaultProps} title="Modal Title" />);
      const title = screen.getByText("Modal Title");
      expect(title.tagName).toBe("H3");
      expect(title).toHaveClass("modal-title");
    });
  });

  describe("size prop", () => {
    it.each([
      ["small", "modal-small"],
      ["medium", "modal-medium"],
      ["large", "modal-large"],
    ] as const)("size가 %s일 때 %s 클래스를 적용한다", (size, className) => {
      const { container } = render(<Modal {...defaultProps} size={size} />);
      expect(container.querySelector(".modal-content")).toHaveClass(className);
    });
  });

  describe("showFooter와 footerContent", () => {
    it("showFooter가 false일 때 footer를 렌더링하지 않는다", () => {
      const { container } = render(
        <Modal
          {...defaultProps}
          showFooter={false}
          footerContent={<div>Footer</div>}
        />
      );
      expect(container.querySelector(".modal-footer")).not.toBeInTheDocument();
    });

    it("showFooter가 true이고 footerContent가 있을 때 footer를 렌더링한다", () => {
      const { container } = render(
        <Modal
          {...defaultProps}
          showFooter={true}
          footerContent={<button>Confirm</button>}
        />
      );
      expect(container.querySelector(".modal-footer")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Confirm" })
      ).toBeInTheDocument();
    });

    it("showFooter가 true이지만 footerContent가 없으면 footer를 렌더링하지 않는다", () => {
      const { container } = render(
        <Modal {...defaultProps} showFooter={true} />
      );
      expect(container.querySelector(".modal-footer")).not.toBeInTheDocument();
    });

    it("footerContent에 여러 요소를 렌더링할 수 있다", () => {
      const footerContent = (
        <>
          <button>Cancel</button>
          <button>Confirm</button>
        </>
      );
      render(
        <Modal {...defaultProps} showFooter footerContent={footerContent} />
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
        <Modal {...defaultProps} onClose={handleClose} />
      );

      const overlay = container.querySelector(".modal-overlay");
      await user.click(overlay!);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("modal content 클릭 시 onClose가 호출되지 않는다 (stopPropagation)", async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Modal {...defaultProps} onClose={handleClose} />
      );

      const modalContent = container.querySelector(".modal-content");
      await user.click(modalContent!);
      expect(handleClose).not.toHaveBeenCalled();
    });

    it("header close 버튼 클릭 시 onClose가 호출된다", async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      render(<Modal {...defaultProps} title="Title" onClose={handleClose} />);

      await user.click(screen.getByText("×"));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("body 내부 요소 클릭 시 onClose가 호출되지 않는다", async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      render(
        <Modal {...defaultProps} onClose={handleClose}>
          <button>Inner button</button>
        </Modal>
      );

      await user.click(screen.getByRole("button", { name: "Inner button" }));
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe("body overflow 관리", () => {
    it("isOpen이 true가 되면 body overflow를 hidden으로 설정한다", () => {
      render(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("isOpen이 false가 되면 body overflow를 unset으로 복원한다", () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");

      rerender(<Modal {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe("unset");
    });

    it("컴포넌트 언마운트 시 body overflow를 복원한다", () => {
      const { unmount } = render(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");

      unmount();
      expect(document.body.style.overflow).toBe("unset");
    });

    it("isOpen이 변경될 때마다 body overflow를 업데이트한다", () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe("unset");

      rerender(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");

      rerender(<Modal {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe("unset");

      rerender(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  describe("CSS 구조", () => {
    it("modal-overlay, modal-content, modal-body를 렌더링한다", () => {
      const { container } = render(<Modal {...defaultProps} />);
      expect(container.querySelector(".modal-overlay")).toBeInTheDocument();
      expect(container.querySelector(".modal-content")).toHaveClass(
        "modal-content",
        "modal-medium"
      );
      expect(container.querySelector(".modal-body")).toBeInTheDocument();
    });

    it("title이 있을 때 modal-header를 렌더링한다", () => {
      const { container } = render(<Modal {...defaultProps} title="Title" />);
      expect(container.querySelector(".modal-header")).toBeInTheDocument();
      expect(container.querySelector(".modal-title")).toBeInTheDocument();
      expect(container.querySelector(".modal-close")).toBeInTheDocument();
    });

    it("showFooter와 footerContent가 있을 때 modal-footer를 렌더링한다", () => {
      const { container } = render(
        <Modal {...defaultProps} showFooter footerContent={<div>Footer</div>} />
      );
      expect(container.querySelector(".modal-footer")).toBeInTheDocument();
    });

    it("구조 순서: header, body, footer", () => {
      const { container } = render(
        <Modal
          {...defaultProps}
          title="Title"
          showFooter
          footerContent={<div>Footer</div>}>
          Body
        </Modal>
      );

      const modalContent = container.querySelector(".modal-content");
      const children = modalContent?.children;

      expect(children?.[0]).toHaveClass("modal-header");
      expect(children?.[1]).toHaveClass("modal-body");
      expect(children?.[2]).toHaveClass("modal-footer");
    });
  });

  describe("props 조합 테스트", () => {
    it("모든 props를 함께 사용할 수 있다", async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      const footerContent = <button>Submit</button>;

      render(
        <Modal
          isOpen={true}
          onClose={handleClose}
          title="Complete Modal"
          size="large"
          showFooter
          footerContent={footerContent}>
          <p>Modal body content</p>
        </Modal>
      );

      expect(screen.getByText("Complete Modal")).toBeInTheDocument();
      expect(screen.getByText("Modal body content")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Submit" })
      ).toBeInTheDocument();

      await user.click(screen.getByText("×"));
      expect(handleClose).toHaveBeenCalled();
    });

    it("최소 props만으로 렌더링할 수 있다", () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          Content
        </Modal>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("children 타입", () => {
    it("문자열 children을 렌더링한다", () => {
      render(<Modal {...defaultProps}>Simple text</Modal>);
      expect(screen.getByText("Simple text")).toBeInTheDocument();
    });

    it("JSX children을 렌더링한다", () => {
      render(
        <Modal {...defaultProps}>
          <div data-testid="custom">Custom content</div>
        </Modal>
      );
      expect(screen.getByTestId("custom")).toBeInTheDocument();
    });

    it("복잡한 children 구조를 렌더링한다", () => {
      render(
        <Modal {...defaultProps}>
          <h2>Title</h2>
          <p>Paragraph</p>
          <form>
            <input type="text" />
            <button>Submit</button>
          </form>
        </Modal>
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
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");

      rerender(<Modal {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe("unset");

      rerender(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("title 없이 header close 버튼을 렌더링하지 않는다", () => {
      const { container } = render(<Modal {...defaultProps} />);
      expect(container.querySelector(".modal-close")).not.toBeInTheDocument();
    });

    it("footerContent 없이 showFooter만 true여도 footer가 렌더링되지 않는다", () => {
      const { container } = render(
        <Modal {...defaultProps} showFooter={true} footerContent={undefined} />
      );
      expect(container.querySelector(".modal-footer")).not.toBeInTheDocument();
    });
  });
});
