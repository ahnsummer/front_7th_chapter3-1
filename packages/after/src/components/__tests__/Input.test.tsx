import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  const defaultProps = {
    name: "testInput",
    value: "",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("기본 렌더링", () => {
    it("input 요소를 렌더링한다", () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it('기본값으로 type="text", disabled=false, required=false를 적용한다', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
      expect(input).not.toBeDisabled();
      expect(input).not.toBeRequired();
    });

    it("name과 value를 올바르게 설정한다", () => {
      render(<Input {...defaultProps} value="테스트 값" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("name", "testInput");
      expect(input).toHaveValue("테스트 값");
    });
  });

  describe("label prop", () => {
    it("label이 있을 때 label 요소를 렌더링한다", () => {
      render(<Input {...defaultProps} label="사용자명" />);
      expect(screen.getByLabelText("사용자명")).toBeInTheDocument();
    });

    it("label이 없을 때 label 요소를 렌더링하지 않는다", () => {
      render(<Input {...defaultProps} />);
      expect(screen.queryByRole("textbox")).toBeInTheDocument();
      // label이 없으므로 form-label 클래스가 없어야 함
      expect(document.querySelector(".form-label")).not.toBeInTheDocument();
    });

    it("required가 true일 때 label에 * 표시를 추가한다", () => {
      render(<Input {...defaultProps} label="이메일" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });

  describe("type prop", () => {
    it("type이 text일 때 해당 type 속성을 적용한다", () => {
      render(<Input {...defaultProps} type="text" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
    });

    it("type이 email일 때 해당 type 속성을 적용한다", () => {
      render(<Input {...defaultProps} type="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
    });

    it("type이 password일 때 해당 type 속성을 적용한다", () => {
      const { container } = render(<Input {...defaultProps} type="password" />);
      const input = container.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "password");
    });

    it("type이 number일 때 해당 type 속성을 적용한다", () => {
      render(<Input {...defaultProps} type="number" />);
      expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
    });

    it("type이 url일 때 해당 type 속성을 적용한다", () => {
      render(<Input {...defaultProps} type="url" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "url");
    });
  });

  describe("placeholder prop", () => {
    it("placeholder를 설정한다", () => {
      render(<Input {...defaultProps} placeholder="입력하세요" />);
      expect(screen.getByPlaceholderText("입력하세요")).toBeInTheDocument();
    });
  });

  describe("required prop", () => {
    it("required가 true일 때 input에 required 속성을 추가한다", () => {
      render(<Input {...defaultProps} required />);
      expect(screen.getByRole("textbox")).toBeRequired();
    });

    it("required가 false일 때 input에 required 속성을 추가하지 않는다", () => {
      render(<Input {...defaultProps} required={false} />);
      expect(screen.getByRole("textbox")).not.toBeRequired();
    });
  });

  describe("disabled prop", () => {
    it("disabled가 true일 때 input을 비활성화한다", () => {
      render(<Input {...defaultProps} disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("disabled가 false일 때 input을 활성화한다", () => {
      render(<Input {...defaultProps} disabled={false} />);
      expect(screen.getByRole("textbox")).not.toBeDisabled();
    });
  });

  describe("error prop", () => {
    it("error가 있을 때 에러 메시지를 표시한다", () => {
      render(<Input {...defaultProps} error="필수 항목입니다" />);
      expect(screen.getByText("필수 항목입니다")).toBeInTheDocument();
    });

    it("error가 있을 때 error 클래스를 추가한다", () => {
      render(<Input {...defaultProps} error="에러" />);
      expect(screen.getByRole("textbox")).toHaveClass("border-danger");
    });

    it("error와 helpText가 둘 다 있을 때 error만 표시한다", () => {
      render(
        <Input {...defaultProps} error="에러 메시지" helpText="도움말 텍스트" />
      );
      expect(screen.getByText("에러 메시지")).toBeInTheDocument();
      expect(screen.queryByText("도움말 텍스트")).not.toBeInTheDocument();
    });
  });

  describe("helpText prop", () => {
    it("helpText를 표시한다", () => {
      render(<Input {...defaultProps} helpText="3자 이상 입력하세요" />);
      expect(screen.getByText("3자 이상 입력하세요")).toBeInTheDocument();
    });

    it("error가 없을 때만 helpText를 표시한다", () => {
      render(<Input {...defaultProps} helpText="도움말" />);
      expect(screen.getByText("도움말")).toBeInTheDocument();
    });
  });

  describe("size prop", () => {
    it("size가 sm일 때 해당 클래스를 적용한다", () => {
      render(<Input {...defaultProps} size="sm" />);
      expect(screen.getByRole("textbox")).toHaveClass("w-[200px]");
    });

    it("size가 md일 때 해당 클래스를 적용한다", () => {
      render(<Input {...defaultProps} size="md" />);
      expect(screen.getByRole("textbox")).toHaveClass("w-[300px]");
    });

    it("size가 lg일 때 해당 클래스를 적용한다", () => {
      render(<Input {...defaultProps} size="lg" />);
      expect(screen.getByRole("textbox")).toHaveClass("w-[400px]");
    });

    it("기본값은 full이다", () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole("textbox")).toHaveClass("w-full");
    });
  });

  describe("onChange handler", () => {
    it("입력 시 onChange가 새 값과 함께 호출된다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Input {...defaultProps} onChange={handleChange} />);

      await user.type(screen.getByRole("textbox"), "test");
      expect(handleChange).toHaveBeenCalledTimes(4); // 't', 'e', 's', 't'
      // userEvent.type은 한 글자씩 입력하므로 마지막 호출은 't'
      expect(handleChange).toHaveBeenLastCalledWith("t");
    });

    it("disabled 상태에서는 입력이 불가능하다", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Input {...defaultProps} onChange={handleChange} disabled />);

      await user.type(screen.getByRole("textbox"), "test");
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("fieldType - username 검증", () => {
    it("username 필드에 3자 미만 입력 시 에러를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} fieldType="username" />);

      await user.type(screen.getByRole("textbox"), "ab");
      await waitFor(() => {
        expect(
          screen.getByText("사용자명은 3자 이상이어야 합니다")
        ).toBeInTheDocument();
      });
    });

    it("username 필드에 유효하지 않은 문자 입력 시 에러를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} fieldType="username" />);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.paste("user@name");

      await waitFor(() => {
        expect(
          screen.getByText("영문, 숫자, 언더스코어만 사용 가능합니다")
        ).toBeInTheDocument();
      });
    });

    it("username 필드에 20자 초과 입력 시 에러를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} fieldType="username" />);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.paste("a".repeat(21));

      await waitFor(() => {
        expect(
          screen.getByText("사용자명은 20자 이하여야 합니다")
        ).toBeInTheDocument();
      });
    });

    it("checkBusinessRules가 true일 때 예약어를 체크한다", async () => {
      const user = userEvent.setup();
      render(
        <Input
          {...defaultProps}
          fieldType="username"
          checkBusinessRules={true}
        />
      );

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.paste("admin");

      await waitFor(() => {
        expect(screen.getByText("예약된 사용자명입니다")).toBeInTheDocument();
      });
    });

    it("checkBusinessRules가 false일 때 예약어를 허용한다", async () => {
      const user = userEvent.setup();
      render(
        <Input
          {...defaultProps}
          fieldType="username"
          checkBusinessRules={false}
        />
      );

      await user.type(screen.getByRole("textbox"), "admin");
      await waitFor(() => {
        expect(
          screen.queryByText("예약된 사용자명입니다")
        ).not.toBeInTheDocument();
      });
    });

    it.each(["admin", "root", "system", "administrator"])(
      '예약어 "%s"를 체크한다',
      async (reservedWord) => {
        const user = userEvent.setup();
        render(
          <Input
            {...defaultProps}
            fieldType="username"
            checkBusinessRules={true}
          />
        );

        const input = screen.getByRole("textbox");
        await user.clear(input);
        await user.paste(reservedWord);

        await waitFor(() => {
          expect(screen.getByText("예약된 사용자명입니다")).toBeInTheDocument();
        });
      }
    );

    it("유효한 username을 입력하면 에러가 없다", async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} fieldType="username" />);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.paste("valid_user123");

      await waitFor(() => {
        expect(screen.queryByText(/사용자명/)).not.toBeInTheDocument();
      });
    });
  });

  describe("fieldType - email 검증", () => {
    it("유효하지 않은 이메일 형식에 대해 에러를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} fieldType="email" />);

      await user.type(screen.getByRole("textbox"), "invalid-email");
      await waitFor(() => {
        expect(
          screen.getByText("올바른 이메일 형식이 아닙니다")
        ).toBeInTheDocument();
      });
    });

    it("checkBusinessRules가 true이고 entityType이 user일 때 회사 도메인을 체크한다", async () => {
      const user = userEvent.setup();
      render(
        <Input
          {...defaultProps}
          fieldType="email"
          entityType="user"
          checkBusinessRules={true}
        />
      );

      await user.type(screen.getByRole("textbox"), "user@gmail.com");
      await waitFor(() => {
        expect(
          screen.getByText(
            "회사 이메일(@company.com 또는 @example.com)만 사용 가능합니다"
          )
        ).toBeInTheDocument();
      });
    });

    it("회사 도메인 이메일은 허용한다 - @company.com", async () => {
      const user = userEvent.setup();
      render(
        <Input
          {...defaultProps}
          fieldType="email"
          entityType="user"
          checkBusinessRules={true}
        />
      );

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.paste("user@company.com");

      await waitFor(() => {
        expect(screen.queryByText(/회사 이메일/)).not.toBeInTheDocument();
      });
    });

    it("회사 도메인 이메일은 허용한다 - @example.com", async () => {
      const user = userEvent.setup();
      render(
        <Input
          {...defaultProps}
          fieldType="email"
          entityType="user"
          checkBusinessRules={true}
        />
      );

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.paste("user@example.com");

      await waitFor(() => {
        expect(screen.queryByText(/회사 이메일/)).not.toBeInTheDocument();
      });
    });

    it("checkBusinessRules가 false일 때 도메인 제한이 없다", async () => {
      const user = userEvent.setup();
      render(
        <Input
          {...defaultProps}
          fieldType="email"
          entityType="user"
          checkBusinessRules={false}
        />
      );

      await user.type(screen.getByRole("textbox"), "user@gmail.com");
      await waitFor(() => {
        expect(screen.queryByText(/회사 이메일/)).not.toBeInTheDocument();
      });
    });
  });

  describe("fieldType - postTitle 검증", () => {
    it("제목이 5자 미만일 때 에러를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} fieldType="postTitle" />);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.paste("짧음");

      await waitFor(() => {
        expect(
          screen.getByText("제목은 5자 이상이어야 합니다")
        ).toBeInTheDocument();
      });
    });

    it("제목이 100자 초과일 때 에러를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} fieldType="postTitle" />);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.paste("a".repeat(101));

      await waitFor(() => {
        expect(
          screen.getByText("제목은 100자 이하여야 합니다")
        ).toBeInTheDocument();
      });
    });

    it("checkBusinessRules가 true이고 entityType이 post일 때 금칙어를 체크한다", async () => {
      const user = userEvent.setup();
      render(
        <Input
          {...defaultProps}
          fieldType="postTitle"
          entityType="post"
          checkBusinessRules={true}
        />
      );

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.paste("이것은 광고입니다");

      await waitFor(() => {
        expect(
          screen.getByText("제목에 금지된 단어가 포함되어 있습니다")
        ).toBeInTheDocument();
      });
    });

    it.each(["광고", "스팸", "홍보"])(
      '금칙어 "%s"를 체크한다',
      async (bannedWord) => {
        const user = userEvent.setup();
        render(
          <Input
            {...defaultProps}
            fieldType="postTitle"
            entityType="post"
            checkBusinessRules={true}
          />
        );

        const input = screen.getByRole("textbox");
        await user.clear(input);
        await user.paste(`테스트 ${bannedWord} 제목`);

        await waitFor(() => {
          expect(
            screen.getByText("제목에 금지된 단어가 포함되어 있습니다")
          ).toBeInTheDocument();
        });
      }
    );

    it("유효한 제목을 입력하면 에러가 없다", async () => {
      const user = userEvent.setup();
      render(
        <Input
          {...defaultProps}
          fieldType="postTitle"
          entityType="post"
          checkBusinessRules={true}
        />
      );

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.paste("정상적인 게시글 제목입니다");

      await waitFor(() => {
        expect(
          screen.queryByText("제목은 5자 이상이어야 합니다")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("제목은 100자 이하여야 합니다")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("제목에 금지된 단어가 포함되어 있습니다")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("fieldType - normal", () => {
    it("normal 필드는 검증을 하지 않는다", async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} fieldType="normal" />);

      await user.type(screen.getByRole("textbox"), "x");
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe("내부 에러와 외부 에러", () => {
    it("외부 error prop이 내부 검증 에러보다 우선한다", async () => {
      const user = userEvent.setup();
      render(
        <Input {...defaultProps} fieldType="username" error="외부 에러" />
      );

      await user.type(screen.getByRole("textbox"), "ab");
      expect(screen.getByText("외부 에러")).toBeInTheDocument();
      expect(
        screen.queryByText("사용자명은 3자 이상이어야 합니다")
      ).not.toBeInTheDocument();
    });

    it("외부 error가 없을 때 내부 검증 에러를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} fieldType="username" />);

      await user.type(screen.getByRole("textbox"), "ab");
      await waitFor(() => {
        expect(
          screen.getByText("사용자명은 3자 이상이어야 합니다")
        ).toBeInTheDocument();
      });
    });
  });

  describe("빈 값 처리", () => {
    it("빈 값 입력 시 검증을 하지 않는다", async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} fieldType="username" value="abc" />);

      await user.clear(screen.getByRole("textbox"));
      expect(screen.queryByText(/사용자명/)).not.toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("id 속성이 name과 동일하게 설정된다", () => {
      render(<Input {...defaultProps} label="테스트" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "testInput");
    });
  });
});
