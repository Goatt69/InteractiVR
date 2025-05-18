import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@heroui/react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Protects routes that require authentication
 * If user is not authenticated, redirects to specified path
 */
export default function AuthGuard({ 
  children, 
  redirectTo = '/'
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth state is determined
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // If authenticated, show the protected content
  return isAuthenticated ? <>{children}</> : null;
}
