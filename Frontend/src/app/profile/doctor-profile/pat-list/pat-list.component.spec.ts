import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatListComponent } from './pat-list.component';

describe('PatListComponent', () => {
  let component: PatListComponent;
  let fixture: ComponentFixture<PatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
