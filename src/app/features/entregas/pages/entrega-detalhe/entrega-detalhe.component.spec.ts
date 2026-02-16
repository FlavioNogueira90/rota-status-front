import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaDetalheComponent } from './entrega-detalhe.component';

describe('EntregaDetalheComponent', () => {
  let component: EntregaDetalheComponent;
  let fixture: ComponentFixture<EntregaDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregaDetalheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntregaDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
