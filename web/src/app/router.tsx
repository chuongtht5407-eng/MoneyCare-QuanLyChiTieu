import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MobileFrame } from '../components/MobileFrame';
import { ProtectedRoute } from './ProtectedRoute';

import { SplashPage } from '../pages/SplashPage';
import { Onboarding1Page } from '../pages/Onboarding1Page';
import { Onboarding2Page } from '../pages/Onboarding2Page';
import { Onboarding3Page } from '../pages/Onboarding3Page';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TransactionFormPage } from '../pages/TransactionFormPage';
import { TransactionHistoryPage } from '../pages/TransactionHistoryPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { BudgetPage } from '../pages/BudgetPage';
import { ProfilePage } from '../pages/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MobileFrame darkStatusBar={true}>
        <SplashPage />
      </MobileFrame>
    ),
  },
  {
    path: '/splash',
    element: (
      <MobileFrame darkStatusBar={true}>
        <SplashPage />
      </MobileFrame>
    ),
  },
  {
    path: '/onboarding/1',
    element: (
      <MobileFrame darkStatusBar={false}>
        <Onboarding1Page />
      </MobileFrame>
    ),
  },
  {
    path: '/onboarding/2',
    element: (
      <MobileFrame darkStatusBar={false}>
        <Onboarding2Page />
      </MobileFrame>
    ),
  },
  {
    path: '/onboarding/3',
    element: (
      <MobileFrame darkStatusBar={false}>
        <Onboarding3Page />
      </MobileFrame>
    ),
  },
  {
    path: '/login',
    element: (
      <MobileFrame darkStatusBar={false}>
        <LoginPage />
      </MobileFrame>
    ),
  },
  {
    path: '/register',
    element: (
      <MobileFrame darkStatusBar={false}>
        <RegisterPage />
      </MobileFrame>
    ),
  },
  {
    path: '/home',
    element: (
      <MobileFrame darkStatusBar={false}>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </MobileFrame>
    ),
  },
  {
    path: '/transactions',
    element: (
      <MobileFrame darkStatusBar={false}>
        <ProtectedRoute>
          <TransactionHistoryPage />
        </ProtectedRoute>
      </MobileFrame>
    ),
  },
  {
    path: '/transactions/new',
    element: (
      <MobileFrame darkStatusBar={false}>
        <ProtectedRoute>
          <TransactionFormPage />
        </ProtectedRoute>
      </MobileFrame>
    ),
  },
  {
    path: '/transactions/:id/edit',
    element: (
      <MobileFrame darkStatusBar={false}>
        <ProtectedRoute>
          <TransactionFormPage />
        </ProtectedRoute>
      </MobileFrame>
    ),
  },
  {
    path: '/analytics',
    element: (
      <MobileFrame darkStatusBar={false}>
        <ProtectedRoute>
          <AnalyticsPage />
        </ProtectedRoute>
      </MobileFrame>
    ),
  },
  {
    path: '/budget',
    element: (
      <MobileFrame darkStatusBar={false}>
        <ProtectedRoute>
          <BudgetPage />
        </ProtectedRoute>
      </MobileFrame>
    ),
  },
  {
    path: '/profile',
    element: (
      <MobileFrame darkStatusBar={false}>
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </MobileFrame>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);
