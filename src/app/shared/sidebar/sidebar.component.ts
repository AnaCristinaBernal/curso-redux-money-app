import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {

  constructor(
    private authService: AuthService,
    private router: Router
   ){}

  logout(): void {
    this.authService.logout().then(()=> this.router.navigate(['/login']));
  }
}
