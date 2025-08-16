'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

/**
 * Hook for page navigation with View Transitions API
 * Falls back to regular navigation if not supported
 */
export function useViewTransition() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (href: string) => {
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      router.push(href);
      return;
    }

    // Use View Transitions API for smooth page transitions
    document.startViewTransition(() => {
      startTransition(() => {
        router.push(href);
      });
    });
  };

  const replace = (href: string) => {
    if (!document.startViewTransition) {
      router.replace(href);
      return;
    }

    document.startViewTransition(() => {
      startTransition(() => {
        router.replace(href);
      });
    });
  };

  const back = () => {
    if (!document.startViewTransition) {
      router.back();
      return;
    }

    document.startViewTransition(() => {
      startTransition(() => {
        router.back();
      });
    });
  };

  const forward = () => {
    if (!document.startViewTransition) {
      router.forward();
      return;
    }

    document.startViewTransition(() => {
      startTransition(() => {
        router.forward();
      });
    });
  };

  return {
    navigate,
    replace,
    back,
    forward,
    isPending,
  };
}
