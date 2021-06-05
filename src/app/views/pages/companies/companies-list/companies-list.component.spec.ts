import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesListComponent } from './companies-list.component';

describe('CompaniesListComponent', () => {
  let component: CompaniesListComponent;
  let fixture: ComponentFixture<CompaniesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
