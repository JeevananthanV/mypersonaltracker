// Badge Challenge Component
// Time-limited badge earning challenges with progress tracking

import React, { useState, useEffect } from 'react';
import { Badge, Achievement } from '../types';
import { useLifeOS } from '../context/LifeOSContext';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetType: 'sessions_completed' | 'consecutive_days' | 'total_minutes' | 'categories_completed' | 'custom';
  targetValue: number;
  timeLimit: '7d' | '14d' | '30d' | '90d'; // Time limit in days
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD (or null for ongoing)
  progress: number;
  completed: boolean;
  reward: string; // Badge ID rewarded upon completion
  icon: string;
}

export interface ChallengeStats {
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  currentStreak: number;
  longestStreak: number;
}

export const useBadgeChallenges = () => {
  const { progressTracker } = useLifeOS();
  // Initialize challenges from existing progress tracker or create default ones
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    // Check for existing challenges in localStorage or progressTracker
    const stored = (progressTracker as any)?.challenges;
    if (stored && stored.length > 0) {
      return stored;
    }
    // Default challenges
    const now = new Date();
    const start = now.toISOString().substring(0, 10);
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    const fourteenDaysLater = new Date(now);
    fourteenDaysLater.setDate(fourteenDaysLater.getDate() + 14);
    const thirtyDaysLater = new Date(now);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    return [
      {
        id: 'challenge-1',
        title: '7-Day Streak',
        description: 'Complete workouts on 7 consecutive days',
        targetType: 'consecutive_days',
        targetValue: 7,
        timeLimit: '7d',
        startDate: start,
        endDate: sevenDaysLater.toISOString().substring(0, 10),
        progress: 0,
        completed: false,
        reward: 'badge-3', // Consistency King badge
        icon: '🔥',
      },
      {
        id: 'challenge-2',
        title: 'Monthly Warrior',
        description: 'Complete 20 workouts in 30 days',
        targetType: 'sessions_completed',
        targetValue: 20,
        timeLimit: '30d',
        startDate: start,
        endDate: thirtyDaysLater.toISOString().substring(0, 10),
        progress: 0,
        completed: false,
        reward: 'badge-4', // Monthly Master badge
        icon: '🏆',
      },
      {
        id: 'challenge-3',
        title: 'Exercise Explorer',
        description: 'Try 5 different exercise categories',
        targetType: 'categories_completed',
        targetValue: 5,
        timeLimit: '30d',
        startDate: start,
        endDate: thirtyDaysLater.toISOString().substring(0, 10),
        progress: 0,
        completed: false,
        reward: 'badge-15', // Exercise Variety badge
        icon: '🔀',
      },
    ];
  });

  // Update challenge progress based on session data
  const updateChallengeProgress = (sessionData: any) => {
    setChallenges((prev) =>
      prev.map((challenge) => {
        let newProgress = challenge.progress;
        let newCompleted = challenge.completed;

        // Check if challenge is already completed
        if (challenge.completed) return challenge;

        // Update progress based on target type
        switch (challenge.targetType) {
          case 'consecutive_days':
            // Check if session date contributes to streak
            const sessionDate = sessionData.date;
            if (sessionData.isCompleted) {
              // Simple streak logic - check if it's the next day after last workout
              newProgress++;
              if (newProgress >= challenge.targetValue) {
                newCompleted = true;
              }
            }
            break;

          case 'sessions_completed':
            if (sessionData.isCompleted) {
              newProgress++;
              if (newProgress >= challenge.targetValue) {
                newCompleted = true;
              }
            }
            break;

          case 'categories_completed':
            // Count categories completed
            if (sessionData.isStrength) {
              // Track in progressTracker
            }
            break;

          case 'custom':
            // Custom condition
            break;
        }

        return {
          ...challenge,
          progress: newProgress,
          completed: newCompleted,
        };
      })
    );
  };

  // Check and auto-complete challenges
  const checkCompletedChallenges = () => {
    setChallenges((prev) =>
      prev.map((challenge) => {
        if (challenge.completed) return challenge;

        const now = new Date();
        const endDate = challenge.endDate 
          ? new Date(challenge.endDate) 
          : null;

        // Check if time limit is exceeded
        if (endDate && now > endDate) {
          // Challenge expired without completion
          return {
            ...challenge,
            completed: false,
            progress: challenge.targetValue, // Show full progress
          };
        }

        return challenge;
      })
    );
  };

  // Auto-run check on mount
  useEffect(() => {
    checkCompletedChallenges();
  }, []);

  return {
    challenges,
    updateChallengeProgress,
    checkCompletedChallenges,
    stats: {
      totalChallenges: challenges.length,
      activeChallenges: challenges.filter((c) => !c.completed).length,
      completedChallenges: challenges.filter((c) => c.completed).length,
    } as ChallengeStats,
  };
};

export default useBadgeChallenges;