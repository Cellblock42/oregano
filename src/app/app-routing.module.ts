import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdentityComponent } from './identity/main/main.component';
import { InitComponent } from './identity/init/init.component';
import { PollComponent } from './identity/poll/poll.component';
import { FinishComponent } from './identity/finish/finish.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/identity/init',
    pathMatch: 'full'
  },
  {
    path: 'identity',
    component: IdentityComponent,
    children: [
      {
        path: 'init',
        component: InitComponent
      },
      {
        path: 'poll',
        component: PollComponent
      },
      {
        path: 'finish',
        component: FinishComponent
      },
      // {
      //   path: 'step2',
      //   component: Step2Component
      // },
      // {
      //   path: 'success',
      //   component: SuccessComponent
      // }
    ]
  }
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: 'dashboard', component: DashboardComponent },
  // { path: 'detail/:id', component: HeroDetailComponent },
  // { path: 'heroes', component: HeroesComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }
