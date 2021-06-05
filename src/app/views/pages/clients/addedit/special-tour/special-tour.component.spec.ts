import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialTourComponent } from './special-tour.component';

describe('SpecialTourComponent', () => {
  let component: SpecialTourComponent;
  let fixture: ComponentFixture<SpecialTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
