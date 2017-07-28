import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHuntPrizeComponent } from './add-hunt-prize.component';

describe('AddHuntPrizeComponent', () => {
  let component: AddHuntPrizeComponent;
  let fixture: ComponentFixture<AddHuntPrizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHuntPrizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHuntPrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
