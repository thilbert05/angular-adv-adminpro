import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public formSubmitted = false;

  public regForm = this.fb.group(
    {
      nombre: ['Tomas', [Validators.required, Validators.minLength(3)]],
      email: ['test100@gmail.com', [Validators.required, Validators.email]],
      password: ['12345', [Validators.required]],
      password2: ['12345', [Validators.required]],
      terminos: [true, [Validators.required]],
    },
    {
      validators: this.passwordsIguales('password', 'password2'),
    }
  );

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  crearUsuario() {
    this.formSubmitted = true;
    // console.log(this.regForm.value);

    if (this.regForm.invalid) {
      return;
    }

    this.usuarioService.crearUsuario(this.regForm.value)
    .subscribe(
      (response: any) => {
        //Si la respuesta está bien
        Swal.fire({
          icon: 'success',
          title: response.msg,
          confirmButtonText: 'Iniciar Sesión'
        }).then(result => {
          if (result.isConfirmed) {
            this.router.navigate(['/']);
          }
        });
      },
      (error) => {
        // Si sucede un error;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.error
        })
      }
    );

  }

  campoNoValido(campo: string): boolean {
    if (this.regForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  aceptaTerminos() {
    if (!this.regForm.get('terminos').value && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  constrasenasNoValidas() {
    const pass1 = this.regForm.get('password').value;
    const pass2 = this.regForm.get('password2').value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formgroup: FormGroup) => {
      const pass1Control = formgroup.get(pass1Name);
      const pass2Control = formgroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    };
  }
}
