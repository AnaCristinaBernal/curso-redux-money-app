import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styles: ``
})
export class AppComponent {
  title = 'money-app';

  constructor(private authService: AuthService
  ) {
    authService.initAuthListener();
  }

}
