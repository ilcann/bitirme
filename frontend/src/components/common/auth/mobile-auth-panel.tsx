import { LogIn, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';

type MobileAuthPanelProps = {
  className?: string;
  onAfterAction?: () => void;
};

const MobileAuthPanel = ({ className, onAfterAction }: MobileAuthPanelProps) => {
  const { t } = useTranslation('auth');
  const { user, isAuthenticated, openLogin, logout } = useAuth();

  const roleLabel = user ? t(`role_${user.role.toLowerCase()}`) : '';

  const handleLogin = () => {
    openLogin();
    onAfterAction?.();
  };

  const handleLogout = () => {
    logout();
    onAfterAction?.();
  };

  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        className={cn('w-full justify-start gap-2 bg-background shadow-sm hover:bg-accent', className)}
        onClick={handleLogin}
      >
        <LogIn className="h-4 w-4" />
        <span>{t('login')}</span>
      </Button>
    );
  }

  return (
    <div className={cn('w-full rounded-xl border bg-background/80 p-4 shadow-sm backdrop-blur-sm', className)}>
      <div className="space-y-1">
        <div className="text-sm font-semibold leading-tight">
          {user?.firstName} {user?.lastName}
        </div>
        <div className="text-xs text-muted-foreground">
          {roleLabel}
        </div>
        {user?.role === 'STUDENT' && user.studentNumber ? (
          <div className="text-xs text-muted-foreground">
            Öğrenci No: {user.studentNumber}
          </div>
        ) : null}
      </div>

      <Button
        variant="ghost"
        className="mt-3 w-full justify-start gap-2 px-2 text-destructive hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        <span>{t('logout')}</span>
      </Button>
    </div>
  );
};

export default MobileAuthPanel;