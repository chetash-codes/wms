import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AttendanceDashboard } from './attendance-dashboard/attendance-dashboard';
import { SharedModule } from '../shared/shared-module';
import { AttendanceHistory } from './attendance-history/attendance-history';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from "@angular/material/tabs";

const routes: Routes = [{ path: '', component: AttendanceDashboard }];

@NgModule({
  declarations: [AttendanceDashboard, AttendanceHistory],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule
],
})
export class AttendanceModule {}
