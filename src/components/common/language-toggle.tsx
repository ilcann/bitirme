import React from 'react';
import { lngs, type LangKey } from '@/config/languages';
import { useLanguage } from '@/providers/language-provider';
import { Button } from '../ui/button';
import { Globe } from 'lucide-react';
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

export const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();
  return (
    <MenubarMenu>
      <MenubarTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </MenubarTrigger>
      <MenubarContent align="end">
        {Object.entries(lngs).map(([code, { nativeName }]) => (
          <MenubarItem
            key={code}
            onClick={() => setLang(code as LangKey)}
            disabled={code === lang}
          >
            {nativeName}
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  )
};