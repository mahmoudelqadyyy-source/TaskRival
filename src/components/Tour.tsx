import React, { useState, useEffect } from 'react';
import { Joyride, CallBackProps, STATUS, Step } from 'react-joyride';
import { useStore } from '../store/useStore';

export function Tour() {
  const user = useStore(state => state.user);
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Only run the tour if the user is logged in and hasn't seen it yet
    // For this demo, we'll run it once per session if they just onboarded
    // In a real app, you'd save this to the user's profile in Firestore
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (user && !hasSeenTour) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setRun(true);
        localStorage.setItem('hasSeenTour', 'true');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to TaskRival! Let me show you around so you can start crushing your goals.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.tour-dashboard',
      content: 'This is your Dashboard. Here you can see a quick overview of your progress, upcoming tasks, and recent activity.',
      placement: 'right',
    },
    {
      target: '.tour-tasks',
      content: 'Manage your daily tasks here. You can add new tasks, break them down with AI, and earn points for completing them!',
      placement: 'right',
    },
    {
      target: '.tour-challenges',
      content: 'Join challenges to push yourself further. Complete them to earn massive points and rewards.',
      placement: 'right',
    },
    {
      target: '.tour-leaderboard',
      content: 'Compete with your friends! Add friends to see who is the most productive this week.',
      placement: 'right',
    },
    {
      target: '.tour-store',
      content: 'Spend your hard-earned points here on cool avatars, themes, and power-ups.',
      placement: 'right',
    },
    {
      target: '.tour-profile',
      content: 'Check your profile to see your stats, achievements, and customize your settings.',
      placement: 'bottom',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('hasSeenTour', 'true');
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#4f46e5',
          textColor: '#334155',
          backgroundColor: '#ffffff',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#4f46e5',
        },
        buttonBack: {
          color: '#4f46e5',
        }
      }}
    />
  );
}
