import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingPersonComponent } from './existing-person.component';

describe('ExistingPersonComponent', () => {
  let component: ExistingPersonComponent;
  let fixture: ComponentFixture<ExistingPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
