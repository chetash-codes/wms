import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule),
    canActivate: [authGuard],
  },
  {
    path: 'employees',
    loadChildren: () => import('./employees/employees-module').then(m => m.EmployeesModule),
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Manager'] }
  },
  {
    path: 'attendance',
    loadChildren: () => import('./attendance/attendance-module').then(m => m.AttendanceModule),
    canActivate: [authGuard]
  },
  {
    path: 'departments',
    loadChildren: () => import('./department/department-module').then(m => m.DepartmentModule),
    canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'leaves',
    loadChildren: () => import('./leaves/leaves-module').then(m => m.LeavesModule),
    canActivate: [authGuard]
  },
  {
    path: 'projects',
    loadChildren: () => import('./project/project-module').then(m => m.ProjectModule),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];
