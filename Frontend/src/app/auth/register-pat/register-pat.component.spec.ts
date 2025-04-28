import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPatComponent } from './register-pat.component';

describe('RegisterPatComponent', () => {
  let component: RegisterPatComponent;
  let fixture: ComponentFixture<RegisterPatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
