import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent implements OnInit{

  registroForm!: FormGroup;

  constructor (private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      pass: ['', Validators.required]
    })
  }

  crearUsuario(): void {
    if (this.registroForm.invalid) return;
    Swal.fire({
      title: "Creando usuario....",
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const {nombre, correo, pass} = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, pass)
      .then( credenciales =>{
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch(error =>{
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
