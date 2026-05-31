import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceDashboard } from './attendance-dashboard/attendance-dashboard';

const routes: Routes = [
  { path: '', component: AttendanceDashboard }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceRoutingModule {}
