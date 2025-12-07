'use client';

import { usePathname } from 'next/navigation';
import { TabId } from '../types/blackbox.types';
import { BlackboxHeader } from '../components/blackbox-header.component';
import { BlackboxTabs } from '../components/blackbox-tabs.component';
import { DatabaseDiagram } from '../components/database-diagram.component';
import { BlackboxUserContainer } from './blackbox-user.container';
import { SubscriptionsCrud } from '../components/subscriptions-crud.component';
import { MealsCrud } from '../components/meals-crud.component';
import { ExercisesCrud } from '../components/exercises-crud.component';
import { MealTemplatesCrud } from '../components/meal-templates-crud.component';
import { ExerciseTemplatesCrud } from '../components/exercise-templates-crud.component';
import { DailyAssignmentsCrud } from '../components/daily-assignments-crud.component';

/**
 * Map pathnames to tab IDs
 */
function getTabFromPathname(pathname: string): TabId {
  if (pathname === '/blackbox/user') return 'users';
  if (pathname === '/blackbox/subscriptions') return 'subscriptions';
  if (pathname === '/blackbox/meals') return 'meals';
  if (pathname === '/blackbox/exercises') return 'exercises';
  if (pathname === '/blackbox/meal-templates') return 'meal-templates';
  if (pathname === '/blackbox/exercise-templates') return 'exercise-templates';
  if (pathname === '/blackbox/daily-assignments') return 'daily-assignments';
  return 'diagram'; // Default to diagram
}

/**
 * Blackbox Container
 * Main container for the blackbox admin tool with tabbed interface
 */
export function BlackboxContainer() {
  const pathname = usePathname();
  const activeTab = getTabFromPathname(pathname);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'diagram':
        return <DatabaseDiagram />;
      case 'users':
        return <BlackboxUserContainer />;
      case 'subscriptions':
        return <SubscriptionsCrud />;
      case 'meals':
        return <MealsCrud />;
      case 'exercises':
        return <ExercisesCrud />;
      case 'meal-templates':
        return <MealTemplatesCrud />;
      case 'exercise-templates':
        return <ExerciseTemplatesCrud />;
      case 'daily-assignments':
        return <DailyAssignmentsCrud />;
      default:
        return <DatabaseDiagram />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BlackboxHeader />
      <BlackboxTabs activeTab={activeTab} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {renderTabContent()}
      </div>
    </div>
  );
}


