import { CommandAll } from "@/components/command-demo";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="relative h-full w-full">
      {/* Main content container - adjust margin to match sidebar behavior */}
      <div className="h-screen w-full flex items-center justify-center transition-all duration-300 ">
        {/* Your main page content goes here */}
       
      </div>
      
      {/* CommandAll positioned in the top right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2">
        <CommandAll />
        <ModeToggle />
        </div>
      </div>
    </div>
  );
}
