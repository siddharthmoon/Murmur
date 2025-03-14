import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost" 
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 bg-primary/10 text-primary hover:bg-primary/20"
    >
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}