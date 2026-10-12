
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-visualizador-evidencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizador-evidencia.component.html',
  styleUrls: ['./visualizador-evidencia.component.scss']
})
export class VisualizadorEvidenciaComponent {
  @Input() visualizandoAnexo = false;
  @Input() carregandoVisualizacao = false;
  @Input() nomeVisualizacaoAnexo = '';
  @Input() tipoVisualizacaoAnexo: 'imagem' | 'pdf' | null = null;
  @Input() urlVisualizacaoAnexo: string | null = null;
  @Input() urlVisualizacaoPdf: SafeResourceUrl | null = null;

  @Output() fechar = new EventEmitter<void>();

  fecharVisualizacaoAnexo(): void {
    this.fechar.emit();
  }
}