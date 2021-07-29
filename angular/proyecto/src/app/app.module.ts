import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import {TabMenuModule} from 'primeng/tabmenu';
import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';
import {PasswordModule} from 'primeng/password';
import { FormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';

import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { DashboardComponent } from './components/dashboard/dashboard.component'

//provider
import {JwtHelperService, JWT_OPTIONS} from '@auth0/angular-jwt';
import { AdminComponent } from './components/admin/admin.component'
import { TokenInterceptorService } from './services/token-interceptor.service';
import { RegisterComponent } from './components/register/register.component';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from 'primeng/toast';
import {ProgressBarModule} from 'primeng/progressbar';
import { ResultadosComponent } from './components/resultados/resultados.component';
import {TableModule} from 'primeng/table';
import {RatingModule} from 'primeng/rating';

import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

import {MenubarModule} from 'primeng/menubar';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { PerfilComponent } from './components/perfil/perfil.component';
import {DialogModule} from 'primeng/dialog';
import {RippleModule} from 'primeng/ripple';
import {AvatarModule} from 'primeng/avatar';
import {InputSwitchModule} from 'primeng/inputswitch';
import {DropdownModule} from 'primeng/dropdown';
import {PaginatorModule} from 'primeng/paginator';
import {ChartModule} from 'primeng/chart';
import {SplitterModule} from 'primeng/splitter';
import { ChipModule } from 'primeng/chip';
import {TooltipModule} from 'primeng/tooltip';
import {TimelineModule} from 'primeng/timeline';
import { FooterComponent } from './components/footer/footer.component';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { TeamComponent } from './components/team/team.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { InterceptorService } from './services/spinner/interceptor.service';
import { InterceptorHTTPService } from './services/interceptor-http.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    AdminComponent,
    RegisterComponent,
    ResultadosComponent,
    PerfilComponent,
    FooterComponent,
    TeamComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    TabMenuModule,
    PanelModule,
    CardModule,
    PasswordModule,
    FormsModule,
    InputTextModule,
    HttpClientModule,
    InputNumberModule,
    ToastModule,
    ProgressBarModule,
    TableModule,
    RatingModule,

    ConfirmPopupModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    CommonModule,
    OverlayPanelModule,
    MessagesModule,
    MessageModule,
    MenubarModule,
    ProgressSpinnerModule,
    DialogModule,
    RippleModule,
    AvatarModule,
    InputSwitchModule,
    DropdownModule,
    PaginatorModule,
    ChartModule,
    SplitterModule
    ,ChipModule,
    TooltipModule,
    TimelineModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    
    NgxSpinnerModule
    
    
  ],
  providers: [
    // JWT
    {provide :JWT_OPTIONS, useValue:JWT_OPTIONS },
    JwtHelperService, //permite decodificar y verificar tokens del lado del servidor 

    //Token Interceptor 
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass:InterceptorService, multi:true},
    //{provide: HTTP_INTERCEPTORS, useClass:InterceptorHTTPService, multi:true},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
