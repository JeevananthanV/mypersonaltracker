import React from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { ChitSchemesDashboard } from '../components/investments/ChitSchemesDashboard';

export const ChitSchemesPage: React.FC = () => {
  const { investments, navigateToTab } = useLifeOS();

  const chitSchemes = investments.filter(
    i => i.category === 'gold_chit' || i.category === 'silver_chit' || i.chitTenureMonths
  );

  return (
    <div className="space-y-6">
      <ChitSchemesDashboard
        chitSchemes={chitSchemes}
        onBackToOverview={() => navigateToTab('investments', 'overview')}
      />
    </div>
  );
};
