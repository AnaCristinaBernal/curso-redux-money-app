import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor (
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      pass: ['', Validators.required]
    })
  }

  loginUsuario(): void {
    if (this.loginForm.invalid) return;
      Swal.fire({
        title: "Espere por favor.....",
        didOpen: () => {
          Swal.showLoading();
        }
      });

    const {nombre, correo, pass} = this.loginForm.value;
    this.authService.login(correo, pass)
      .then( credenciales =>{
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch(error =>{
        Swal.hideLoading();
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
