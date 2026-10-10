import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular/lazy';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  modoRegistro = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async enviar() {
    const loading = await this.loadingCtrl.create({ message: 'Procesando...' });
    await loading.present();
    try {
      if (this.modoRegistro) {
        await this.authService.register(this.email.trim(), this.password);
      } else {
        await this.authService.login(this.email.trim(), this.password);
      }
      this.password = '';
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (e: any) {
      await this.mostrarError(this.traducirError(e?.code));
    } finally {
      await loading.dismiss();
    }
  }

  private traducirError(code?: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Ese correo ya está registrado.';
      case 'auth/invalid-email':
        return 'El correo no es válido.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Correo o contraseña incorrectos.';
      default:
        return 'No se pudo completar la operación.';
    }
  }

  private async mostrarError(message: string) {
    const alert = await this.alertCtrl.create({ header: 'Error', message, buttons: ['OK'] });
    await alert.present();
  }
}
