import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditComponent } from './addedit.component';

describe('AddeditComponent', () => {
  let component: AddeditComponent;
  let fixture: ComponentFixture<AddeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
