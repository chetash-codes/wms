import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material UI Imports
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DepartmentDashboard } from './department-dashboard/department-dashboard';
import { SharedModule } from '../shared/shared-module';

const routes: Routes = [
  { path: '', component: DepartmentDashboard }
];

@NgModule({
  declarations: [
    DepartmentDashboard
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Required for managing the add-department entry form
    SharedModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class DepartmentModule { }