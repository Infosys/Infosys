import React, { memo, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { ApplicationCard } from './ApplicationCard';
import ErrorBoundary from './ErrorBoundary';
import type { AllApplicationModel } from '../models/PropertyApplicationModel';

export const ApplicationsList: React.FC<{
  applications: AllApplicationModel[];
  sortOrder: string;
  agentsData: any;
}> = memo(({ applications, sortOrder, agentsData }) => {
  const sortedApplications = useMemo(() => {
    return applications
      .slice()
      .sort((a, b) => {
        const dateA = new Date(a.DueDate).getTime();
        const dateB = new Date(b.DueDate).getTime();
        return sortOrder === 'New - Old' ? dateB - dateA : dateA - dateB;
      });
  }, [applications, sortOrder]);

  return (
    <Virtuoso
      style={{ height: '800px' }}
      data={sortedApplications}
      itemContent={(
        _, application) => (
        <ErrorBoundary key={`error-boundary-${application.ID}`}>
          <ApplicationCard
            key={application.ID}
            application={application}
            agentsData={agentsData}
          />
        </ErrorBoundary>
      )}
    />
  );
});

ApplicationsList.displayName = 'ApplicationsList';