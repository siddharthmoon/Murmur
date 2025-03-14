import { Search } from "lucide-react";
import { useIdeas } from "@/hooks/useIdeas";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const { setSearchQuery } = useIdeas();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8 text-primary"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
            />
          </svg>
          <h1 className="text-3xl font-extrabold ml-2">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent drop-shadow-sm">Murmur</span>
          </h1>
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search your murmurs..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            onChange={handleSearch}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
