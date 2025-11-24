import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "../Card";

describe("Card", () => {
  describe("기본 렌더링", () => {
    it("children을 렌더링한다", () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it('기본값으로 variant="default"를 적용한다', () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector(".card")).toHaveClass("card-default");
    });

    it("title, subtitle, headerActions가 없을 때 header를 렌더링하지 않는다", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector(".card-header")).not.toBeInTheDocument();
    });

    it("card-body에 children을 렌더링한다", () => {
      const { container } = render(<Card>Content</Card>);
      const cardBody = container.querySelector(".card-body");
      expect(cardBody).toBeInTheDocument();
      expect(cardBody?.textContent).toBe("Content");
    });
  });

  describe("variant prop", () => {
    it.each([
      ["default", "card-default"],
      ["bordered", "card-bordered"],
      ["elevated", "card-elevated"],
      ["flat", "card-flat"],
    ] as const)(
      "variant가 %s일 때 %s 클래스를 적용한다",
      (variant, className) => {
        const { container } = render(<Card variant={variant}>Content</Card>);
        expect(container.querySelector(".card")).toHaveClass(className);
      }
    );
  });

  describe("title prop", () => {
    it("title이 있을 때 header와 title을 렌더링한다", () => {
      const { container } = render(<Card title="Card Title">Content</Card>);
      expect(container.querySelector(".card-header")).toBeInTheDocument();
      expect(screen.getByText("Card Title")).toBeInTheDocument();
    });

    it("title이 h3 요소로 렌더링된다", () => {
      render(<Card title="Card Title">Content</Card>);
      const title = screen.getByText("Card Title");
      expect(title.tagName).toBe("H3");
      expect(title).toHaveClass("card-title");
    });

    it("title 없이도 렌더링된다", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector(".card-title")).not.toBeInTheDocument();
    });
  });

  describe("subtitle prop", () => {
    it("subtitle이 있을 때 subtitle을 렌더링한다", () => {
      const { container } = render(
        <Card subtitle="Card Subtitle">Content</Card>
      );
      expect(container.querySelector(".card-header")).toBeInTheDocument();
      expect(screen.getByText("Card Subtitle")).toBeInTheDocument();
    });

    it("subtitle이 p 요소로 렌더링된다", () => {
      render(<Card subtitle="Card Subtitle">Content</Card>);
      const subtitle = screen.getByText("Card Subtitle");
      expect(subtitle.tagName).toBe("P");
      expect(subtitle).toHaveClass("card-subtitle");
    });

    it("title과 subtitle을 함께 렌더링한다", () => {
      render(
        <Card title="Title" subtitle="Subtitle">
          Content
        </Card>
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Subtitle")).toBeInTheDocument();
    });

    it("subtitle만 있어도 header를 렌더링한다", () => {
      const { container } = render(<Card subtitle="Subtitle">Content</Card>);
      expect(container.querySelector(".card-header")).toBeInTheDocument();
    });
  });

  describe("headerActions prop", () => {
    it("headerActions가 있을 때 header와 actions를 렌더링한다", () => {
      const actions = <button>Action</button>;
      const { container } = render(
        <Card headerActions={actions}>Content</Card>
      );
      expect(container.querySelector(".card-header")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Action" })
      ).toBeInTheDocument();
    });

    it("headerActions만 있어도 header를 렌더링한다", () => {
      const actions = <span>Actions</span>;
      const { container } = render(
        <Card headerActions={actions}>Content</Card>
      );
      expect(container.querySelector(".card-header")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    it("title과 headerActions를 함께 렌더링한다", () => {
      const actions = <button>Edit</button>;
      render(
        <Card title="Card Title" headerActions={actions}>
          Content
        </Card>
      );
      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    });

    it("여러 headerActions를 렌더링할 수 있다", () => {
      const actions = (
        <>
          <button>Edit</button>
          <button>Delete</button>
        </>
      );
      render(<Card headerActions={actions}>Content</Card>);
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Delete" })
      ).toBeInTheDocument();
    });
  });

  describe("CSS 구조", () => {
    it("card 클래스를 가진 div를 렌더링한다", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector(".card")).toBeInTheDocument();
    });

    it("header가 있을 때 card-header를 렌더링한다", () => {
      const { container } = render(<Card title="Title">Content</Card>);
      const header = container.querySelector(".card-header");
      expect(header).toBeInTheDocument();
    });

    it("항상 card-body를 렌더링한다", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector(".card-body")).toBeInTheDocument();
    });

    it("header 내부에 title/subtitle과 actions가 올바른 구조로 배치된다", () => {
      const actions = <button>Action</button>;
      const { container } = render(
        <Card title="Title" subtitle="Subtitle" headerActions={actions}>
          Content
        </Card>
      );

      const header = container.querySelector(".card-header");
      const children = header?.children;

      // 첫 번째 div: title과 subtitle을 포함
      expect(children?.[0]?.tagName).toBe("DIV");
      expect(children?.[0]?.querySelector(".card-title")).toBeInTheDocument();
      expect(
        children?.[0]?.querySelector(".card-subtitle")
      ).toBeInTheDocument();

      // 두 번째 div: actions를 포함
      expect(children?.[1]?.tagName).toBe("DIV");
      expect(children?.[1]?.querySelector("button")).toBeInTheDocument();
    });
  });

  describe("props 조합 테스트", () => {
    it("모든 props를 함께 사용할 수 있다", () => {
      const actions = <button>Action</button>;
      render(
        <Card
          title="Card Title"
          subtitle="Card Subtitle"
          variant="elevated"
          headerActions={actions}>
          Card content here
        </Card>
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card Subtitle")).toBeInTheDocument();
      expect(screen.getByText("Card content here")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Action" })
      ).toBeInTheDocument();
    });

    it("title과 subtitle만 사용할 수 있다", () => {
      render(
        <Card title="Title" subtitle="Subtitle">
          Content
        </Card>
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Subtitle")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("title과 headerActions만 사용할 수 있다", () => {
      const actions = <span>Actions</span>;
      render(
        <Card title="Title" headerActions={actions}>
          Content
        </Card>
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toBeInTheDocument();
      expect(screen.queryByText("Subtitle")).not.toBeInTheDocument();
    });
  });

  describe("children 타입", () => {
    it("문자열 children을 렌더링한다", () => {
      render(<Card>Simple text</Card>);
      expect(screen.getByText("Simple text")).toBeInTheDocument();
    });

    it("JSX children을 렌더링한다", () => {
      render(
        <Card>
          <div data-testid="custom">Custom content</div>
        </Card>
      );
      expect(screen.getByTestId("custom")).toBeInTheDocument();
    });

    it("children 없이도 렌더링된다", () => {
      const { container } = render(<Card title="Title" />);
      expect(container.querySelector(".card-body")).toBeInTheDocument();
    });

    it("복잡한 children 구조를 렌더링한다", () => {
      render(
        <Card title="Title">
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </Card>
      );

      expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });
  });
});
