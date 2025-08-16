'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { useReducedMotion } from '../../motion/useReducedMotion';
import { createRipple } from '../../motion/ripple';

interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface NavigationMenuProps {
  items: NavItem[];
  className?: string;
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  glass?: boolean;
  navigate?: (href: string) => void;
}

/**
 * Navigation menu with smooth transitions and glass effects
 * Supports horizontal and vertical layouts with active indicators
 */
export function NavigationMenu({
  items,
  className = '',
  variant = 'horizontal',
  size = 'md',
  glass = true,
  navigate,
}: NavigationMenuProps) {
  const [activeIndex, setActiveIndex] = useState(items.findIndex((item) => item.active));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const menuRef = useRef<HTMLNavElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Update active indicator position
  useEffect(() => {
    if (activeIndex === -1 || !itemRefs.current[activeIndex]) return;

    const activeItem = itemRefs.current[activeIndex];
    if (!activeItem) return;

    const menuRect = menuRef.current?.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    if (!menuRect) return;

    if (variant === 'horizontal') {
      setIndicatorStyle({
        left: itemRect.left - menuRect.left,
        width: itemRect.width,
        height: '2px',
        bottom: 0,
      });
    } else {
      setIndicatorStyle({
        top: itemRect.top - menuRect.top,
        height: itemRect.height,
        width: '3px',
        left: 0,
      });
    }
  }, [activeIndex, variant]);

  const sizeClasses = {
    sm: 'text-sm gap-1 p-1',
    md: 'text-base gap-2 p-2',
    lg: 'text-lg gap-3 p-3',
  };

  const itemSizeClasses = {
    sm: 'px-3 py-1.5 min-h-[32px]',
    md: 'px-4 py-2 min-h-[40px]',
    lg: 'px-5 py-2.5 min-h-[48px]',
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const enabledItems = items
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => !item.disabled);
    const currentFocusIndex = focusedIndex === -1 ? activeIndex : focusedIndex;
    let nextIndex = currentFocusIndex;

    switch (e.key) {
      case 'ArrowRight':
        if (variant === 'horizontal') {
          e.preventDefault();
          const nextEnabledIdx = enabledItems.findIndex(({ idx }) => idx > currentFocusIndex);
          if (nextEnabledIdx !== -1) {
            nextIndex = enabledItems[nextEnabledIdx].idx;
          } else if (enabledItems.length > 0) {
            nextIndex = enabledItems[0].idx; // Wrap to first
          }
        }
        break;

      case 'ArrowLeft':
        if (variant === 'horizontal') {
          e.preventDefault();
          const prevEnabledItems = enabledItems.filter(({ idx }) => idx < currentFocusIndex);
          if (prevEnabledItems.length > 0) {
            nextIndex = prevEnabledItems[prevEnabledItems.length - 1].idx;
          } else if (enabledItems.length > 0) {
            nextIndex = enabledItems[enabledItems.length - 1].idx; // Wrap to last
          }
        }
        break;

      case 'ArrowDown':
        if (variant === 'vertical') {
          e.preventDefault();
          const nextEnabledIdx = enabledItems.findIndex(({ idx }) => idx > currentFocusIndex);
          if (nextEnabledIdx !== -1) {
            nextIndex = enabledItems[nextEnabledIdx].idx;
          } else if (enabledItems.length > 0) {
            nextIndex = enabledItems[0].idx; // Wrap to first
          }
        }
        break;

      case 'ArrowUp':
        if (variant === 'vertical') {
          e.preventDefault();
          const prevEnabledItems = enabledItems.filter(({ idx }) => idx < currentFocusIndex);
          if (prevEnabledItems.length > 0) {
            nextIndex = prevEnabledItems[prevEnabledItems.length - 1].idx;
          } else if (enabledItems.length > 0) {
            nextIndex = enabledItems[enabledItems.length - 1].idx; // Wrap to last
          }
        }
        break;

      case 'Home':
        e.preventDefault();
        if (enabledItems.length > 0) {
          nextIndex = enabledItems[0].idx;
        }
        break;

      case 'End':
        e.preventDefault();
        if (enabledItems.length > 0) {
          nextIndex = enabledItems[enabledItems.length - 1].idx;
        }
        break;

      case 'Enter':
      case ' ':
        if (focusedIndex !== -1 && focusedIndex < items.length) {
          e.preventDefault();
          const item = items[focusedIndex];
          if (!item.disabled) {
            setActiveIndex(focusedIndex);
            if (item.onClick) {
              item.onClick();
            } else if (item.href) {
              if (navigate) {
                navigate(item.href);
              } else {
                window.location.href = item.href;
              }
            }
          }
        }
        break;

      default:
        return;
    }

    if (nextIndex !== currentFocusIndex && itemRefs.current[nextIndex]) {
      setFocusedIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();
    }
  };

  const handleItemClick = (item: NavItem, index: number, e: React.MouseEvent) => {
    if (item.disabled) return;

    // Update active state
    setActiveIndex(index);

    // Ripple effect
    if (!prefersReducedMotion) {
      const target = e.currentTarget as HTMLElement;
      createRipple(e, target);
    }

    // Handle navigation
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      if (navigate) {
        navigate(item.href);
      } else {
        window.location.href = item.href;
      }
    }
  };

  const containerClasses = cn(
    'relative',
    variant === 'horizontal' ? 'flex flex-row' : 'flex flex-col',
    glass && 'glass rounded-lg',
    sizeClasses[size],
    className
  );

  return (
    <nav ref={menuRef} className={containerClasses} role="navigation" onKeyDown={handleKeyDown}>
      {/* Active indicator */}
      {activeIndex !== -1 && !prefersReducedMotion && (
        <div
          className={cn(
            'absolute bg-gradient-to-r from-primary-warm to-accent-coral rounded-full',
            'transition-all duration-300 ease-out',
            variant === 'horizontal' ? 'h-[2px]' : 'w-[3px]'
          )}
          style={indicatorStyle}
          aria-hidden="true"
        />
      )}

      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const Component = item.href && !item.onClick ? 'a' : 'button';

        return (
          <Component
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            href={item.href}
            onClick={(e) => handleItemClick(item, index, e)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            disabled={item.disabled}
            tabIndex={isActive ? 0 : -1}
            className={cn(
              'relative flex items-center justify-center gap-2',
              'rounded-md transition-all overflow-hidden',
              itemSizeClasses[size],
              isActive ? 'text-primary-warm font-semibold' : 'text-text-secondary hover:text-text',
              !item.disabled && 'hover:bg-surface-dim/50 active:scale-[0.98]',
              item.disabled && 'opacity-50 cursor-not-allowed',
              !prefersReducedMotion && 'hover-lift'
            )}
            role="menuitem"
            aria-current={isActive ? 'page' : undefined}
            aria-disabled={item.disabled}
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}

            <span>{item.label}</span>

            {item.badge !== undefined && (
              <span
                className={cn(
                  'ml-auto flex items-center justify-center',
                  'min-w-[20px] h-5 px-1.5',
                  'text-xs font-bold rounded-full',
                  'bg-accent-coral text-inverse',
                  !prefersReducedMotion && 'anim-bounce-in'
                )}
              >
                {item.badge}
              </span>
            )}
          </Component>
        );
      })}
    </nav>
  );
}
