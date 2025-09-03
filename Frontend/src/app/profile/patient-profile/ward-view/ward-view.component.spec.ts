import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardViewComponent } from './ward-view.component';

describe('WardViewComponent', () => {
  let component: WardViewComponent;
  let fixture: ComponentFixture<WardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
