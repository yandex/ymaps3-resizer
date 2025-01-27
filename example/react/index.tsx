import {LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = reactify.module(ymaps3);

    const {YMapResizer} = reactify.module(await ymaps3.import('ymaps3-resizer'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        return (
            <YMap location={LOCATION} ref={(x) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapResizer minWidth={400} maxWidth={1000} minHeight={400} maxHeight={600}/>
            </YMap>
        );
    }
}
