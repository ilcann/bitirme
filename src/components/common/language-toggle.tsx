import React from 'react';
import { lngs, type LangKey } from '@/locale/languages';
import { useLanguage } from '@/providers/language-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {Object.entries(lngs).map(([code, { nativeName }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLang(code as LangKey)}
            disabled={code === lang}
            className="px-2 py-1 rounded border"
          >
            {nativeName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
};