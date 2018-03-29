import { Widget } from "./widget";
import { SVGSelection } from "../models/types";
import { GraphLayout } from "./graph-layout";
import { Layer } from "../models/layer";


export class LayersWidget implements Widget {
  public graphLayout: GraphLayout;

  public draw(view: SVGSelection, layers: Layer[]) {

    const layers_selection = view
      .selectAll<SVGGElement, Layer>('g.layer')
        .data(layers, (l: Layer) => {
          return l.index.toString();
        });

    const layers_enter = layers_selection
      .enter()
        .append<SVGGElement>('g')
        .attr('class', 'layer')
        .attr('data-index', (layer: Layer) => layer.index);

    const merge = layers_selection.merge(layers_enter);

    layers_selection
      .exit()
        .remove();

    this.graphLayout
      .getLinksWidget()
      .draw(merge);

    this.graphLayout
      .getNodesWidget()
      .draw(merge);

    this.graphLayout
      .getDrawingsWidget()
      .draw(merge);

  }
}
