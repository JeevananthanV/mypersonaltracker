import React from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { ChitSchemesDashboard } from '../components/investments/ChitSchemesDashboard';

export const ChitSchemesPage: React.FC = () => {
  const { investments, navigateToTab } = useLifeOS();

  // Filter strictly to the 3 authorized chits
  const chitSchemes = investments.filter(
    i =>
      i.id === 'chit-grt-gold-11m' ||
      i.id === 'chit-saravana-fund-20m' ||
      i.id === 'chit-offline-monthly-1000'
  );

  return (
    <div className="space-y-6">
      <ChitSchemesDashboard
        chitSchemes={chitSchemes}
        onBackToOverview={() => navigateToTab('dashboard')}
      />
    </div>
  );
};

export default ChitSchemesPage;
