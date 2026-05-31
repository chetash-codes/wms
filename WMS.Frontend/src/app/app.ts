import { Component, signal } from '@angular/core';
import { AuthModule } from './auth/auth-module';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [AuthModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('WMS.Frontend');
}
