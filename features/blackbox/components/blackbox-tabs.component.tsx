'use client';

import Link from 'next/link';
import { TabId } from '../types/blackbox.types';
import { BLACKBOX_TABS } from '../constants/blackbox.constants';

interface BlackboxTabsProps {
  activeTab: TabId;
}

/**
 * Map tab IDs to their routes
 */
function getTabRoute(tabId: TabId): string {
  switch (tabId) {
    case 'users':
      return '/blackbox/user';
    case 'subscriptions':
      return '/blackbox/subscriptions';
    case 'meals':
      return '/blackbox/meals';
    case 'exercises':
      return '/blackbox/exercises';
    case 'meal-templates':
      return '/blackbox/meal-templates';
    case 'exercise-templates':
      return '/blackbox/exercise-templates';
    case 'daily-assignments':
      return '/blackbox/daily-assignments';
    case 'diagram':
    default:
      return '/blackbox';
  }
}

/**
 * Blackbox Tabs Component
 * Displays the tab navigation for the blackbox admin tool
 */
export function BlackboxTabs({ activeTab }: BlackboxTabsProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {BLACKBOX_TABS.map((tab) => {
            const href = getTabRoute(tab.id);
            const isActive = activeTab === tab.id;

            return (
              <Link
                key={tab.id}
                href={href}
                className={`
                  whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}


