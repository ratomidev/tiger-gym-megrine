import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Users } from "lucide-react";
import Image from "next/image";

export interface ProgramProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: "débutant" | "intermédiaire" | "avancé";
  category: string;
  modules?: string[];
}

export default function ProgramCard({ 
  title, 
  description, 
  imageUrl, 
  duration, 
  level,
  category,
  modules = []
}: ProgramProps) {
  
  // Function to determine badge color based on level
  const getLevelColor = () => {
    switch (level) {
      case "débutant": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermédiaire": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "avancé": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="aspect-video relative w-full overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <Badge variant="outline" className={`${getLevelColor()} border-0`}>
            {level}
          </Badge>
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" /> {duration}
          </span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{category}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        
        {modules.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Modules inclus:</h4>
            <ul className="space-y-1">
              {modules.slice(0, 3).map((module, index) => (
                <li key={index} className="text-sm flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                  {module}
                </li>
              ))}
              {modules.length > 3 && (
                <li className="text-sm text-muted-foreground">
                  + {modules.length - 3} autres modules
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}