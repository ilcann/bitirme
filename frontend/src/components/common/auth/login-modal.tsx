import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/auth-provider';

const LoginModal = () => {
  const { t } = useTranslation('auth');
  const { isLoginOpen, closeLogin, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeLogin();
      setError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      setEmail('');
      setPassword('');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : t('invalid_credentials'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="login-email">{t('email')}</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">{t('password')}</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? <p className="text-destructive text-sm">{error}</p> : null}

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('signing_in') : t('login')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;