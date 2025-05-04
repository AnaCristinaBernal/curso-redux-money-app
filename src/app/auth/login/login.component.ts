import { Component, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  loginForm!: FormGroup;
  cargando = false;

  constructor (
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
  ){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['ana1@ana.com', [Validators.required, Validators.email]],
      pass: ['123456', Validators.required]
    });
    this.store.select('ui').pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(ui => this.cargando = ui.isLoading);
  }

  loginUsuario(): void {
    if (this.loginForm.invalid) return;

    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: "Espere por favor.....",
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    const {nombre, correo, pass} = this.loginForm.value;
    this.authService.login(correo, pass)
      .then( credenciales =>{
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch(error =>{
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        })
      }
    );
  }

  isValid(nombre: string): boolean {
    return this.loginForm.get(nombre)?.valid ?? false;
  }

}
