/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { Onboarding } from './screens/Onboarding';
import { Auth } from './screens/Auth';
import { Dashboard } from './screens/Dashboard';
import { Tasks } from './screens/Tasks';
import { Challenges } from './screens/Challenges';
import { Leaderboard } from './screens/Leaderboard';
import { Profile } from './screens/Profile';
import { Achievements } from './screens/Achievements';
import { Store } from './screens/Store';
import { Focus } from './screens/Focus';

export default function App() {
  const activeItems = useStore(state => state.activeItems);

  useEffect(() => {
    if (activeItems.includes('i1')) {
      document.body.classList.add('theme-neon');
    } else {
      document.body.classList.remove('theme-neon');
    }
  }, [activeItems]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/store" element={<Store />} />
          <Route path="/focus" element={<Focus />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
