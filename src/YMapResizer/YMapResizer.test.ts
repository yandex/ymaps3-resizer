import type {LngLatBounds} from '@yandex/ymaps3-types/common/types';
import {YMap} from '@yandex/ymaps3-types';
import {YMapResizer} from './YMapResizer';

describe('YMap smoke test', () => {
    const LOCATION = {center: [0, 0], zoom: 9};

    let container: HTMLElement, map: YMap;
    beforeEach(() => {
        container = document.createElement('div');
        Object.assign(container.style, {width: `643px`, height: `856px`});
        document.body.appendChild(container);
        map = new ymaps3.YMap(container, {location: LOCATION}, [new ymaps3.YMapDefaultSchemeLayer({})]);
    });

    afterEach(() => {
        map.destroy();
        container.remove();
    });

    it('should make map', () => {
        map.addChild(
            new ymaps3.YMapControls({position: 'bottom'}, [
                new YMapResizer({
                    direction: 'both',
                    minWidth: 400,
                    maxWidth: 1000,
                    minHeight: 400,
                    maxHeight: 1000
                })
            ])
        );

        const tree = domToJson(map.container);
        expect(tree).toMatchSnapshot();
    });
});
