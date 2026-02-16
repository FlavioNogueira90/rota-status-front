import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestoComponent } from './manifesto.component';

describe('ManifestoComponent', () => {
  let component: ManifestoComponent;
  let fixture: ComponentFixture<ManifestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManifestoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManifestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
