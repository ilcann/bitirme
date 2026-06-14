import { LogIn, LogOut, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AuthButtonProps = {
  className?: string;
  onAfterAction?: () => void;
};

const AuthButton = ({ className, onAfterAction }: AuthButtonProps) => {
  const { t } = useTranslation('auth');
  const { user, isAuthenticated, openLogin, logout } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      openLogin();
    }

    onAfterAction?.();
  };

  const handleLogout = () => {
    logout();
    onAfterAction?.();
  };

  const roleLabel = user ? t(`role_${user.role.toLowerCase()}`) : '';

  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn('shrink-0 gap-2 bg-background shadow-sm hover:bg-accent', className)}
        onClick={handleClick}
      >
        <LogIn className="h-4 w-4" />
        <span>{t('login')}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('shrink-0 rounded-full border border-border bg-background shadow-sm hover:bg-accent', className)}
          aria-label={t('profile_menu')}
        >
          <UserRound className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-56 p-2">
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 pt-1 pb-2">
          <span className="text-sm font-semibold leading-none">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {roleLabel}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="gap-2 px-2 py-2">
          <LogOut className="h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;