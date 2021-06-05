import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRunComponent } from './payment-run.component';

describe('PaymentRunComponent', () => {
  let component: PaymentRunComponent;
  let fixture: ComponentFixture<PaymentRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
