import {LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = ymaps3;

    const {YMapResizer} = await ymaps3.import('@yandex/ymaps3-resizer');

    map = new YMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

    map.addChild(new YMapResizer({minWidth: 400, maxWidth: 1000, minHeight: 400, maxHeight: 600}));
}
