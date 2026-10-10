import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/lazy';
import { Subscription, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Tarea, TareasService } from '../services/tareas.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  tareas: Tarea[] = [];
  cargando = true;
  nuevaTarea = '';
  email = '';
  private uid = '';
  private sub?: Subscription;

  constructor(
    private authService: AuthService,
    private tareasService: TareasService,
    private router: Router,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Ionic reutiliza esta vista entre sesiones, por lo que se reacciona al usuario en vez de leerlo una vez.
    this.sub = this.authService.user$
      .pipe(
        tap((user) => {
          this.cargando = !!user;
          this.uid = user?.uid ?? '';
          this.email = user?.email ?? '';
          this.cdr.markForCheck();
        }),
        switchMap((user) => (user ? this.tareasService.listar(user.uid) : of([] as Tarea[])))
      )
      .subscribe({
        next: (tareas) => {
          this.tareas = tareas;
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.cargando = false;
          this.cdr.markForCheck();
          this.mostrarError('No se pudieron cargar las tareas.');
        },
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async agregar() {
    const titulo = this.nuevaTarea.trim();
    if (!titulo) return;
    try {
      await this.tareasService.agregar(this.uid, titulo);
      this.nuevaTarea = '';
      this.cdr.markForCheck();
    } catch {
      this.mostrarError('No se pudo guardar la tarea.');
    }
  }

  async eliminar(tarea: Tarea) {
    try {
      await this.tareasService.eliminar(this.uid, tarea.id);
    } catch {
      this.mostrarError('No se pudo eliminar la tarea.');
    }
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  private async mostrarError(message: string) {
    const alert = await this.alertCtrl.create({ header: 'Error', message, buttons: ['OK'] });
    await alert.present();
  }
}
