import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { DashboardHome } from './dashboard-home/dashboard-home';
import { SharedModule } from '../shared/shared-module';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";

@NgModule({
  declarations: [DashboardHome],
  imports: [CommonModule, DashboardRoutingModule, SharedModule, MatIconModule, MatCardModule],
  exports: [DashboardHome]
})
export class DashboardModule {}
