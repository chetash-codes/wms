import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { EmployeeList } from './employee-list/employee-list';
import { EmployeeForm } from './employee-form/employee-form';
import { SharedModule } from '../shared/shared-module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";

const routes: Routes = [
  { path: '', component: EmployeeList } // List view defaults as home chunk
];

@NgModule({
  declarations: [
    EmployeeList,
    EmployeeForm
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule
]
})
export class EmployeesModule { }