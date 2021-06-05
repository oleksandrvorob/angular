import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingTourComponent } from './existing-tour.component';

describe('ExistingTourComponent', () => {
  let component: ExistingTourComponent;
  let fixture: ComponentFixture<ExistingTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
