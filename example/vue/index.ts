import {LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = vuefy.module(ymaps3);

    const {YMapResizer} = vuefy.module(await ymaps3.import('@yandex/ymaps3-resizer'));

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapResizer
        },
        setup() {
            const refMap = (ref) => {
                window.map = ref?.entity;
            };
            const onClick = () => alert('Click!');
            return {LOCATION, refMap, onClick};
        },
        template: `
            <YMap :location="LOCATION" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapResizer :minWidth="400" :maxWidth="1000" :minHeight="400" :maxHeight="600" />
            </YMap>`
    });
    app.mount('#app');
}
