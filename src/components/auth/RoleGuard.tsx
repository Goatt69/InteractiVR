import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@heroui/react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

/**
 * Protects routes that require specific user roles
 * If user doesn't have the required role, redirects to specified path
 */
export default function RoleGuard({
  children,
  allowedRoles,
  redirectTo = '/'
}: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth state is determined
    if (!isLoading) {
      // Redirect if not authenticated
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Redirect if authenticated but doesn't have required role
      if (user && !allowedRoles.includes(user.role)) {
        router.push(redirectTo);
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // If authenticated and has the required role, show the protected content
  return (isAuthenticated && user && allowedRoles.includes(user.role)) ? <>{children}</> : null;
}
