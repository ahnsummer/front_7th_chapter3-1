import { cva } from "class-variance-authority";

const logoLayoutVariants = cva("flex items-center gap-3");

const logoIconVariants = cva(
  "w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl"
);

const logoTextContainerVariants = cva("");

const logoTitleVariants = cva(
  "text-lg font-bold text-gray-900 dark:text-gray-900 m-0 leading-none"
);

const logoSubtitleVariants = cva(
  "text-xs text-gray-700 dark:text-gray-700 m-0 leading-none mt-0.5"
);

const Logo = () => {
  return (
    <div className={logoLayoutVariants()}>
      <div className={logoIconVariants()}>L</div>
      <div className={logoTextContainerVariants()}>
        <h1 className={logoTitleVariants()}>Hanghae Company</h1>
        <p className={logoSubtitleVariants()}>
          Design System Migration Project
        </p>
      </div>
    </div>
  );
};

export default Logo;
