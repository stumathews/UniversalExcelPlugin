import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencePortfolioComponent } from './reference-portfolio.component';

describe('ReferencePortfolioComponent', () => {
  let component: ReferencePortfolioComponent;
  let fixture: ComponentFixture<ReferencePortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencePortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
