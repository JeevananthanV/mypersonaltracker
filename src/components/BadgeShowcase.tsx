// Badge Showcase Component
// Displays earned badges with filtering by rarity and category

import React from 'react';
import { Badge, Achievement } from '../types';

export interface BadgeFilter {
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  category?: 'workout' | 'consistency' | 'milestone' | 'challenge';
  search?: string;
}

export interface BadgeShowcaseProps {
  earnedBadges: Badge[];
  allBadges: Badge[];
  achievements: Achievement[];
  progressTracker: Record<string, number>;
}

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({
  earnedBadges,
  allBadges,
  achievements,
  progressTracker,
}) => {
  // Compute filter state
  const [filter, setFilter] = React.useState<BadgeFilter>({});

  // Filter badges
  const filteredBadges = React.useMemo(() => {
    return allBadges.filter((badge) => {
      // Rarity filter
      if (filter.rarity && badge.rarity !== filter.rarity) return false;
      // Category filter
      if (filter.category && badge.category !== filter.category) return false;
      // Search filter
      if (filter.search && !badge.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
      // Show only earned badges if no search
      if (!filter.search && !earnedBadges.some((eb) => eb.id === badge.id)) return false;
      return true;
    });
  }, [allBadges, earnedBadges, filter]);

  // Compute badge progress
  const badgeProgress = React.useMemo(() => {
    const progress: Record<string, number> = {};
    allBadges.forEach((badge) => {
      const earned = earnedBadges.some((eb) => eb.id === badge.id);
      progress[badge.id] = earned ? 100 : 0;
    });
    return progress;
  }, [allBadges, earnedBadges]);

  // Unique categories from all badges
  const categories = React.useMemo(() => {
    const catSet = new Set<string>();
    allBadges.forEach((badge) => catSet.add(badge.category));
    return Array.from(catSet);
  }, [allBadges]);

  // Handle filter change
  const handleFilterChange = (newFilter: BadgeFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider">Rarity</label>
          <select
            onChange={(e) => setFilter({ ...filter, rarity: e.target.value as any })}
            className="rounded-lg border-slate-600 px-2 py-1 text-sm"
          >
            <option value="">All Rarities</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider">Category</label>
          <select
            onChange={(e) => setFilter({ ...filter, category: e.target.value as any })}
            className="rounded-lg border-slate-600 px-2 py-1 text-sm"
          >
            <option value="">All Categories</option>
            <option value="workout">Workout</option>
            <option value="consistency">Consistency</option>
            <option value="milestone">Milestone</option>
            <option value="challenge">Challenge</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider">Search</label>
          <input
            type="text"
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            value={filter.search || ''}
            className="rounded-lg border-slate-600 px-2 py-1 text-sm w-full"
            placeholder="Search badge name..."
          />
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const isEarned = earnedBadges.some((eb) => eb.id === badge.id);
          const progress = badgeProgress[badge.id];
          const earnedAt = earnedBadges.find((eb) => eb.id === badge.id)?.earnedAt || '';

          return (
            <div
              key={badge.id}
              className={`border rounded-lg p-3 ${
                isEarned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-950/50 text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-center mb-2">
                <span className="text-2xl {isEarned ? 'text-emerald-300' : 'text-slate-300'}">
                  {badge.icon}
                </span>
                <p className="text-xs text-slate-300 mt-1 truncate">{badge.name}</p>
              </div>
              <p className="text-[10px] text-slate-400 mb-2 line-clamp-2">
                {badge.description}
              </p>
              {isEarned && (
                <div className="text-xs text-emerald-300 mt-1">
                  Earned: {earnedAt ? new Date(earnedAt).toLocaleDateString() : 'N/A'}
                </div>
              )}
              {!isEarned && (
                <div className="text-xs text-slate-400 mt-1">
                  Progress: {progress}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      {earnedBadges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400">
          <p>Earned: {earnedBadges.length}/{allBadges.length} badges</p>
          <p>Progress: {((earnedBadges.length / allBadges.length) * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
};

export default BadgeShowcase;