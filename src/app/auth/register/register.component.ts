import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent implements OnInit{

  registroForm!: FormGroup;
  cargando = false;
  counter = 3;

  constructor (private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
  ){}

  ngOnInit(): void {
    this.store.dispatch(ui.newUser());
    this.store.select('ui').pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(ui => {
      this.cargando = ui.isLoading;
      this.counter = ui.counter;
    });
    this.registroForm = this.fb.group({
      nombre: [`ana${this.counter}`, Validators.required],
      correo: [`ana${this.counter}@gmail.com`, [Validators.required, Validators.email]],
      pass: ['123456', Validators.required]
    })
  }

  crearUsuario(): void {
    if (this.registroForm.invalid) return;
    this.store.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: "Creando usuario....",
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });
    const {nombre, correo, pass} = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, pass)
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
    return this.registroForm.get(nombre)?.valid ?? false;
  }
}
