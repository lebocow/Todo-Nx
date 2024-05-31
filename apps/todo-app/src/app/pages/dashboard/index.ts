import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: async () =>
      await import('@pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    children: [
      {
        path: '',
        title: 'Recent Tasks',
        loadComponent: async () =>
          await import('./recent/recent.component').then(
            (m) => m.RecentComponent,
          ),
      },
      {
        path: 'done',
        title: 'Done Tasks',
        loadComponent: async () =>
          await import('./done/done.component').then((m) => m.DoneComponent),
      },
      {
        path: 'inbox',
        title: 'Inbox',
        loadComponent: async () =>
          await import('./inbox/inbox.component').then((m) => m.InboxComponent),
      },
    ],
  },
];
