// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Highmaps Demo</title>
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js"></script>
//     <script src="https://code.highcharts.com/maps/highmaps.js"></script>
//     <script src="https://code.highcharts.com/maps/modules/exporting.js"></script>
//     <script src="https://code.highcharts.com/maps/modules/offline-exporting.js"></script>
//     <script src="https://code.highcharts.com/maps/modules/accessibility.js"></script>
// </head>
// <body>

// <div id="container"></div>
// </body>
// </html>

// #container {
//     height: 680px;
//     min-width: 310px;
//     max-width: 800px;
//     margin: 0 auto;
// }

// .loading {
//     margin-top: 10em;
//     text-align: center;
//     color: gray;
// }

// (async () => {

// const mapData = await fetch(
//     'https://code.highcharts.com/mapdata/countries/no/no-all.topo.json'
// ).then(response => response.json());

// const areasGeoJson = {
//     "type": "FeatureCollection",
//     "features": [
//     {
// "type": "Feature",
// "properties": { "name": "Svenskegrensen til Jæren" },
// "geometry": {
// "type": "Polygon",
// "coordinates": [[
// [5.4899995526, 58.7099996192],
// [5.5200003504, 58.6599998608],
// [5.57000062, 58.5999991088],
// [5.6299995383, 58.5499995288],
// [5.6600001384, 58.5299995963],
// [5.7699996108, 58.469999793],
// [5.8399995187, 58.4199996103],
// [5.9100009943, 58.3899999822],
// [5.9900001868, 58.37000008],
// [6.290000697, 58.270000201],
// [6.4100003538, 58.1900001972],
// [6.4200005396, 58.1899997742],
// [6.5500008183, 58.0899997039],
// [6.5700003053, 58.0799996061],
// [6.5899996771, 58.0699995141],
// [6.6200008518, 58.0499996438],
// [6.6400002203, 58.0499994687],
// [6.680000771, 58.039999869],
// [6.8400000407, 57.9999997965],
// [7.1000002771, 57.9599998332],
// [7.379999653, 57.9400000149],
// [7.6000005156, 57.9400002579],
// [7.6400002617, 57.9499997256],
// [7.6799998958, 57.9500003347],
// [7.8800003481, 57.9999996617],
// [8.0699995228, 58.0399997699],
// [8.2499992688, 58.089999552],
// [8.3900007347, 58.1500000703],
// [8.6000004551, 58.2499999286],
// [8.7300000216, 58.3199999668],
// [8.8600007198, 58.4000000094],
// [8.9999996058, 58.4900002501],
// [9.1300000262, 58.5800000993],
// [9.4100002889, 58.7400004537],
// [9.7899999805, 58.8800003979],
// [10.0399995589, 58.9299999202],
// [10.2399998949, 58.9600003011],
// [10.4100004735, 58.9500000994],
// [10.6199996583, 58.9399995643],
// [10.6499992658, 58.9399999361],
// [10.7600007055, 58.9400004646],
// [10.8799997403, 58.9399998687],
// [10.9199992487, 58.9399997449],
// [10.9499993756, 58.9499996854],
// [10.980000512, 58.9600004215],
// [11.070000284, 58.9799997031],
// [11.079999532, 58.9899995416],
// [11.0900001621, 58.9900002044],
// [11.1200001678, 59.0200000231],
// [11.1300004101, 59.0299999803],
// [11.1499999721, 59.0799999639],
// [11.2279991983, 59.088000149],
// [11.2520001498, 59.0939995555],
// [10.9999995305, 59.9999999643],
// [10.0000005873, 59.9999996551],
// [7.9999999168, 58.7499997051],
// [5.4900006389, 58.7499997054],
// [5.4600005362, 58.7299994744],
// [5.4899995526, 58.7099996192]
// ]
// ]
// }
// },
//        {
// "type": "Feature",
// "properties": { "name": "Ryfylke" },
// "geometry": {
// "type": "Polygon",
// "coordinates": [[
// [4.8339998529, 59.2099992893],
// [4.9400003102, 59.1499987258],
// [5.2900011836, 58.8799992847],
// [5.3400002787, 58.7999992659],
// [5.4000005504, 58.6899993258],
// [5.4900006389, 58.7499997054],
// [7.9999999168, 58.7499997051],
// [6.9999995227, 59.9999996238],
// [5.9100010722, 59.6099993435],
// [5.3400011989, 59.4299995482],
// [5.2960000866, 59.3749993237],
// [5.2600000306, 59.3499989107],
// [5.269999663, 59.1799994821],
// [5.1929998938, 59.1479996275],
// [4.8339998529, 59.2099992893]
// ]
// ]
// }
// }
//     ]
// };

// const areasMap = Highcharts.geojson(areasGeoJson, 'map');

// // Initialize the chart
// const chart = Highcharts.mapChart('container', {

//     title: {
//         text: 'Highmaps simple demo',
//         align: 'left'
//     },

//     legend: {
//         align: 'left',
//         layout: 'vertical',
//         floating: true
//     },

//     accessibility: {
//         point: {
//             valueDescriptionFormat: '{xDescription}.'
//         }
//     },

//     mapNavigation: {
//         enabled: true
//     },

//     tooltip: {
//         headerFormat: '',
//         pointFormat: '{point.name}'
//     },

//     series: [{
//         // Use the no-all map with no data as a basemap
//         mapData,
//         name: 'Norway',
//         borderColor: '#707070',
//         nullColor: 'rgba(200, 200, 200, 0.3)',
//         showInLegend: false
//     }, {
//         // Add a series of polygons for Svenskegrensen til Jæren and Ryfylke
//         type: 'map',
//         name: 'Production Areas',
//         data: areasMap,
//         joinBy: 'name',
//         states: {
//             hover: {
//                 color: Highcharts.getOptions().colors[2]
//             }
//         }
//     }]
// });
// })();
