import { cva } from "class-variance-authority";
import Logo from "./Logo";

const headerVariants = cva(
  "bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"
);

const headerContainerVariants = cva(
  "max-w-[1400px] mx-auto px-6 flex justify-between items-center h-16"
);

const userSectionVariants = cva("flex items-center gap-3");

const userInfoVariants = cva("text-right");

const userNameVariants = cva("text-sm font-semibold text-gray-900");

const userEmailVariants = cva("text-xs text-gray-700");

const avatarVariants = cva(
  "w-10 h-10 rounded-full bg-info-light flex items-center justify-center text-primary font-semibold text-base"
);

export const Header = () => {
  return (
    <header className={headerVariants()}>
      <div className={headerContainerVariants()}>
        <Logo />

        <div className={userSectionVariants()}>
          <div className={userInfoVariants()}>
            <div className={userNameVariants()}>Demo User</div>
            <div className={userEmailVariants()}>demo@example.com</div>
          </div>
          <div className={avatarVariants()}>DU</div>
        </div>
      </div>
    </header>
  );
};
