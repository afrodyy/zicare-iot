<script>
    import KML from 'ol/format/KML.js';
    import Map from 'ol/Map.js';
    import StadiaMaps from 'ol/source/StadiaMaps.js';
    import VectorSource from 'ol/source/Vector.js';
    import View from 'ol/View.js';
    import {Heatmap as HeatmapLayer, Tile as TileLayer} from 'ol/layer.js';
    import {OGCMapTile} from 'ol/source.js'
	import { onMount } from 'svelte';
    import {fromLonLat} from 'ol/proj.js';


    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
        }
        return result;
    }
    const MapsId = makeid(5);
    
    onMount(async () => {
        console.log('Heatmaps===================================',MapsId);
        
            const vector = new HeatmapLayer({
                source: new VectorSource({
                    url: 'data/kml/2012_Earthquakes_Mag5.kml',
                    format: new KML({
                    extractStyles: false,
                    }),
                }),
                // source: new OGCMapTile({
                //         url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad',
                //         crossOrigin: '',
                //     }),
                blur: parseInt(1000, 10),
                radius: parseInt(1005, 10),
                weight: function (feature) {
                    // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
                    // standards-violating <magnitude> tag in each Placemark.  We extract it from
                    // the Placemark's name instead.
                    const name = feature.get('name');
                    const magnitude = parseFloat(name.substr(2));
                    return magnitude - 5;
                },
            });
        
            const raster = new TileLayer({
            source: new StadiaMaps({
                layer: 'stamen_toner',
            }),
            });
        
            new Map({
            layers: [raster, vector],
            target: '' + MapsId,
            view: new View({
                // center: [0,0 ],
                // center: [109.625429, -6.929699],
                center:fromLonLat([109.625429,-6.929699]),
                zoom: 4.5,
            }),
            });
            vector.setBlur(parseInt(100, 10));
            vector.setRadius(parseInt(999, 10));

    });
</script>

<!-- <div class="min-w-[155px] min-h-100 min-h-max h-[155px] m-2 rounded-md "> -->
    <div id="{MapsId}" class="min-w-full min-h-100 min-h-max h-[155px] bg-white" ></div>
<!-- </div> -->