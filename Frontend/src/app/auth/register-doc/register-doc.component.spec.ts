import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDocComponent } from './register-doc.component';

describe('RegisterDocComponent', () => {
  let component: RegisterDocComponent;
  let fixture: ComponentFixture<RegisterDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
