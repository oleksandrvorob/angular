import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillRunComponent } from './bill-run.component';

describe('BillRunComponent', () => {
  let component: BillRunComponent;
  let fixture: ComponentFixture<BillRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
