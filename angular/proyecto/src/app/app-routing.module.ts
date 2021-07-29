import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegisterComponent } from './components/register/register.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { TeamComponent } from './components/team/team.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  //{path:'/com',component:AppComponent},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent},
  {path:'team', component: TeamComponent},
  {path:'register', component: RegisterComponent},
  {path:'dashboard',component: DashboardComponent, canActivate:[AuthGuard]},
  {path:'resultados/:id',component: ResultadosComponent, canActivate:[AuthGuard]},
  {path:'perfil', component: PerfilComponent, canActivate:[AuthGuard] },
  {path:'admin', component:AdminComponent, canActivate:[RoleGuard], data:{expectRole:'admin'}},

  {path:'**',pathMatch:'full', redirectTo:'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
