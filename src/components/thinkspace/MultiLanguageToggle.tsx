import { useState } from "react";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
];

export const MultiLanguageToggle = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleLanguageChange = async (language: Language) => {
    if (language.code === selectedLanguage.code) return;
    
    setIsTranslating(true);
    
    // Simulate translation loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSelectedLanguage(language);
    setIsTranslating(false);
    
    // Here you would implement actual translation logic
    // For example, using Google Translate API or i18n library
    console.log(`Translating content to ${language.name}...`);
  };

  return (
    <div className="flex items-center gap-2">
      {isTranslating && (
        <Badge variant="secondary" className="animate-pulse">
          Translating...
        </Badge>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2" disabled={isTranslating}>
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">
              {selectedLanguage.flag} {selectedLanguage.nativeName}
            </span>
            <span className="sm:hidden">
              {selectedLanguage.flag}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
            Select Language
          </div>
          {languages.map((language) => (
            <DropdownMenuItem 
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-xs text-muted-foreground">{language.nativeName}</span>
                </div>
              </div>
              {selectedLanguage.code === language.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
          
          <div className="border-t mt-1 pt-1">
            <div className="px-2 py-1 text-xs text-muted-foreground">
              Translation powered by AI
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};