import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { Web3Service, MetaCoinService, IRMAService } from '../services/services'
import { AppRoutingModule } from './app-routing.module';
import { IdentityModule } from './identity/identity.module';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, AppRoutingModule, IdentityModule ],
      declarations: [ AppComponent ],
      providers: [Web3Service, MetaCoinService, IRMAService]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
