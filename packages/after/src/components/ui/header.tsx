import Logo from "./Logo";

export const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-50 border-b border-gray-200 dark:border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 flex justify-between items-center h-14 sm:h-16">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3 pr-12">
          <div className="hidden md:block text-right">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-900">
              Demo User
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-700">
              demo@example.com
            </div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-info-light dark:bg-info-light flex items-center justify-center text-primary dark:text-primary font-semibold text-sm sm:text-base">
            DU
          </div>
        </div>
      </div>
    </header>
  );
};
