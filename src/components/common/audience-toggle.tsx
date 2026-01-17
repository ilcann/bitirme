import React from 'react';
import { Users } from 'lucide-react';
import { audiences } from '@/config/audiences';
import { useAudience } from '@/providers/audience-provider';
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next'; // veya kendi i18n çözümünüz

export const AudienceToggle: React.FC = () => {
  const { audience, setAudience } = useAudience();
  const { t } = useTranslation();

  return (
    <MenubarMenu>
      <MenubarTrigger asChild>
        <Button variant="ghost" size="icon">
          <Users className="h-5 w-5" />
        </Button>
      </MenubarTrigger>
      <MenubarContent align="end">
        {Object.entries(audiences).map(([key, { translationKey }]) => (
          <MenubarItem
            key={key}
            onClick={() => setAudience(key as keyof typeof audiences)}
            disabled={key === audience}
          >
            {t(translationKey)}
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  );
};