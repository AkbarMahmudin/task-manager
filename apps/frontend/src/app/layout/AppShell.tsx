import { FormEvent, ReactNode } from 'react';
import { useAuth } from '../context/auth-context';
import { useLogout } from '../hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@task-manager/ui/components/dropdown-menu';
import { Avatar, AvatarFallback } from '@task-manager/ui/components/avatar';
import { ThemeToggle } from '@task-manager/ui/components/theme-toggle';
import { ChevronDownIcon, LogOutIcon } from 'lucide-react';

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  const handleSignOut = async (e: FormEvent) => {
    e.preventDefault();
    logoutMutation.mutate();
  };

  return (
    <div>
      <nav className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 md:px-8 px-2 justify-between w-full max-w-6xl mx-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-2 items-center">
              <Avatar>
                <AvatarFallback className="uppercase">
                  {user?.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronDownIcon className="ml-auto size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-fit"
              side={'bottom'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive"
              >
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl md:px-8 px-2 py-2">{children}</div>
      </main>
    </div>
  );
}
