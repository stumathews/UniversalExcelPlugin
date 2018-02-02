import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionTestComponent } from './selection-test.component';

describe('SelectionTestComponent', () => {
  let component: SelectionTestComponent;
  let fixture: ComponentFixture<SelectionTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
