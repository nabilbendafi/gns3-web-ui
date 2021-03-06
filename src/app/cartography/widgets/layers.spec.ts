import { instance, mock, when } from "ts-mockito";

import { TestSVGCanvas } from "../testing";
import { LayersWidget } from "./layers";
import { Layer } from "../models/layer";
import { LinksWidget } from "./links";
import { NodesWidget } from "./nodes";
import { DrawingsWidget } from "./drawings";
import { GraphLayout } from "./graph-layout";


describe('LayersWidget', () => {
  let svg: TestSVGCanvas;
  let widget: LayersWidget;
  let mockedGraphLayout: GraphLayout;
  let mockedLinksWidget: LinksWidget;
  let mockedNodesWidget: NodesWidget;
  let mockedDrawingsWidget: DrawingsWidget;
  let layers: Layer[];

  beforeEach(() => {
    svg = new TestSVGCanvas();
    widget = new LayersWidget();
    mockedGraphLayout = mock(GraphLayout);
    mockedLinksWidget = mock(LinksWidget);
    mockedNodesWidget = mock(NodesWidget);
    mockedDrawingsWidget = mock(DrawingsWidget);
    when(mockedGraphLayout.getLinksWidget()).thenReturn(instance(mockedLinksWidget));
    when(mockedGraphLayout.getNodesWidget()).thenReturn(instance(mockedNodesWidget));
    when(mockedGraphLayout.getDrawingsWidget()).thenReturn(instance(mockedDrawingsWidget));

    widget.graphLayout = instance(mockedGraphLayout);

    const layer_1 = new Layer();
    layer_1.index = 1;
    const layer_2 = new Layer();
    layer_2.index = 2;
    layers = [layer_1, layer_2];
  });

  afterEach(() => {
    svg.destroy();
  });

  it('should draw layers', () => {
    widget.draw(svg.canvas, layers);

    const drew = svg.canvas.selectAll<SVGGElement, Layer>('g.layer');
    expect(drew.size()).toEqual(2);
    expect(drew.nodes()[0].getAttribute('data-index')).toEqual('1');
    expect(drew.nodes()[1].getAttribute('data-index')).toEqual('2');
  });

  it('should draw links container', () => {
    widget.draw(svg.canvas, layers);

    const drew = svg.canvas.selectAll<SVGGElement, Layer>('g.links');
    expect(drew.size()).toEqual(2);
  });

  it('should draw nodes container', () => {
    widget.draw(svg.canvas, layers);

    const drew = svg.canvas.selectAll<SVGGElement, Layer>('g.nodes');
    expect(drew.size()).toEqual(2);
  });

  it('should draw drawings container', () => {
    widget.draw(svg.canvas, layers);

    const drew = svg.canvas.selectAll<SVGGElement, Layer>('g.drawings');
    expect(drew.size()).toEqual(2);
  });

  it('should redraw on layers change', () => {
    widget.draw(svg.canvas, layers);
    layers[0].index = 3;
    widget.draw(svg.canvas, layers);

    const drew = svg.canvas.selectAll<SVGGElement, Layer>('g.layer');
    expect(drew.size()).toEqual(2);
    expect(drew.nodes()[0].getAttribute('data-index')).toEqual('3');
    expect(drew.nodes()[1].getAttribute('data-index')).toEqual('2');
  });

});
