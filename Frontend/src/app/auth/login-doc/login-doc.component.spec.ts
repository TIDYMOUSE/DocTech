import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDocComponent } from './login-doc.component';

describe('LoginDocComponent', () => {
  let component: LoginDocComponent;
  let fixture: ComponentFixture<LoginDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
