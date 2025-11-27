// 사용자 필드 검증
export const validateUsername = (value: string): string | undefined => {
  if (!value) return undefined;
  
  if (value.length < 3) {
    return "사용자명은 3자 이상이어야 합니다";
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return "영문, 숫자, 언더스코어만 사용 가능합니다";
  }
  
  if (value.length > 20) {
    return "사용자명은 20자 이하여야 합니다";
  }
  
  // 비즈니스 규칙: 예약어 체크
  const RESERVED_WORDS = ["admin", "root", "system", "administrator"];
  if (RESERVED_WORDS.includes(value.toLowerCase())) {
    return "예약된 사용자명입니다";
  }
  
  return undefined;
};

export const validateEmail = (value: string): string | undefined => {
  if (!value) return undefined;
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "올바른 이메일 형식이 아닙니다";
  }
  
  // 비즈니스 규칙: 회사 도메인만 허용
  if (!value.endsWith("@company.com") && !value.endsWith("@example.com")) {
    return "회사 이메일(@company.com 또는 @example.com)만 사용 가능합니다";
  }
  
  return undefined;
};

// 게시글 필드 검증
export const validatePostTitle = (value: string): string | undefined => {
  if (!value) return undefined;
  
  if (value.length < 5) {
    return "제목은 5자 이상이어야 합니다";
  }
  
  if (value.length > 100) {
    return "제목은 100자 이하여야 합니다";
  }
  
  // 비즈니스 규칙: 금칙어 체크
  const BANNED_WORDS = ["광고", "스팸", "홍보"];
  const hasBannedWord = BANNED_WORDS.some((word) => value.includes(word));
  if (hasBannedWord) {
    return "제목에 금지된 단어가 포함되어 있습니다";
  }
  
  return undefined;
};

export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value || value.trim() === "") {
    return `${fieldName}을(를) 입력해주세요`;
  }
  return undefined;
};

