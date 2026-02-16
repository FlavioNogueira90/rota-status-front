import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoManifestoComponent } from './novo-manifesto.component';

describe('NovoManifestoComponent', () => {
  let component: NovoManifestoComponent;
  let fixture: ComponentFixture<NovoManifestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoManifestoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NovoManifestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
