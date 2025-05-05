import { Component, DestroyRef, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements OnInit{

  name: string = '';
  email: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
   ){}

   ngOnInit(): void {
     this.store.select('auth')
       .pipe(
        takeUntilDestroyed(this.destroyRef))
       .subscribe(({user}) => {
        if (user){
          this.name = user.nombre;
          this.email = user.email;
        }
      });
   }
  logout(): void {
    this.authService.logout().then(()=> this.router.navigate(['/login']));
  }
}
