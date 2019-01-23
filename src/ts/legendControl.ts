module powerbi.extensibility.visual {

    export type ColorStops = {colorStop: string, color: string}[];

    export class LegendControl implements mapboxgl.IControl {
        private map: mapboxgl.Map;
        private legendContainer: HTMLElement;
        private legends: { [key: string] : HTMLElement } = {};

        removeLegends() {
            if (this.legendContainer) {
                Object.keys(this.legends).forEach(key => {
                    if (this.legends[key]) {
                        this.legendContainer.removeChild(this.legends[key])
                    }
                })
            }
            this.legends = {}
        }

        addLegend(key: string, title: string, data: ColorStops) {
            if (this.legends[key]) {
                if (this.legendContainer) {
                    this.legendContainer.removeChild(this.legends[key])
                }
            }

            if (data) {
                this.legends[key] = this.createLegendElement(title, data)
                if (this.legendContainer) {
                    this.legendContainer.appendChild(this.legends[key])
                }
            }
        }

        onAdd(map: mapboxgl.Map): HTMLElement {
            this.map = map;
            if (!this.legendContainer) {
                this.legendContainer = document.createElement('div')
                this.legendContainer.className = 'mapboxgl-ctrl'
                this.legendContainer.id="mapbox-legend-container"
            }

            Object.keys(this.legends).forEach(key => {
                if (this.legends[key]) {
                    this.legendContainer.appendChild(this.legends[key])
                }
            })

            return this.legendContainer;
        }

        onRemove(map: mapboxgl.Map) {
            this.removeLegends()
            if (this.legendContainer) {
                this.legendContainer.parentNode.removeChild(this.legendContainer);
            }

            this.map = undefined;
            this.legendContainer = undefined;
        }

        getDefaultPosition(): string {
            return 'bottom-right';
        }

        createLegendElement(title: string, data: ColorStops): HTMLElement {
            const legend = document.createElement('div')
            legend.className = "mapbox-legend mapboxgl-ctrl-group"

            const titleElement = document.createElement('div');
            titleElement.innerHTML = title
            legend.appendChild(titleElement)

            data.forEach(({colorStop, color}) => {
                const item = document.createElement('div');
                const colorElement = document.createElement('span');
                colorElement.className = 'mapbox-legend-color';
                colorElement.style.backgroundColor = color;

                const valueElement = document.createElement('span');
                valueElement.innerHTML = colorStop.toString()

                item.appendChild(colorElement);
                item.appendChild(valueElement);
                legend.appendChild(item)
            })

            return legend
        }
    }
}
