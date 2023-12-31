// let placesInRyfylkeCount2014 = 0;
// let placesInRyfylkeCount2015 = 0;
// let placesInRyfylkeCount2016 = 0;
// let placesInRyfylkeCount2017 = 0;
// let placesInRyfylkeCount2018 = 0;
// let placesInRyfylkeCount2019 = 0;
// let placesInRyfylkeCount2020 = 0;
// let placesInRyfylkeCount2021 = 0;
// let placesInRyfylkeCount2022 = 0;
// let placesInRyfylkeCount2023 = 0;

// let placesInRyfylkeCount = 0;

// // Define a simple point-in-polygon function
// function isPointInPolygon(
//   point: [number, number],
//   polygon: [number, number][]
// ): boolean {
//   const x = point[0];
//   const y = point[1];

//   let inside = false;
//   for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
//     const xi = polygon[i][0];
//     const yi = polygon[i][1];
//     const xj = polygon[j][0];
//     const yj = polygon[j][1];

//     const intersect =
//       yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
//     if (intersect) inside = !inside;
//   }

//   return inside;
// }

// //Per year:
// let placesInSvenskegrensenCount2019 = 0;
// let placesInSvenskegrensenCount2020 = 0;
// let placesInSvenskegrensenCount2021 = 0;
// let placesInSvenskegrensenCount2022 = 0;
// let placesInSvenskegrensenCount2023 = 0;

// let placesInSvenskegrensenCount = 0;

// const fetchDataAndLogProperties = async () => {
//   try {
//     const apiUrl =
//       "https://gis.fiskeridir.no/server/rest/services/Yggdrasil/R%C3%B8mming/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";

//     const response = await fetch(apiUrl);
//     const data = await response.json();

//     // Extract coordinates from the provided areasGeoJson for "Svenskegrensen til Jæren", "Ryfylke", and "Helgeland til Bodø"
//     const polygonCoordinatesSvenskegrensen: [number, number][] = [];
//     const polygonCoordinatesRyfylke: [number, number][] = [];
//     const polygonCoordinatesKarmoy: [number, number][] = [];
//     const polygonCoordinatesNordhordaland: [number, number][] = [];
//     const polygonCoordinatesStadtHustadVika: [number, number][] = [];
//     const polygonCoordinatesNordOgSor: [number, number][] = [];
//     const polygonCoordinatesNordMedBindal: [number, number][] = [];
//     const polygonCoordinatesHelgelandBodo: [number, number][] = [];
//     const polygonCoordinatesVestfjorden: [number, number][] = [];
//     const polygonCoordinatesSenja: [number, number][] = [];
//     const polygonCoordinatesLoppa: [number, number][] = [];
//     const polygonCoordinatesVestFinnmark: [number, number][] = [];
//     const polygonCoordinatesOstFinnmark: [number, number][] = [];

//     // Extract coordinates for "Svenskegrensen til Jæren"
//     const coordinatesSvenskegrensen =
//       areasGeoJson.features[0].geometry.coordinates;
//     const flattenCoordinatesSvenskegrensen = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesSvenskegrensen(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesSvenskegrensen.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesSvenskegrensen(coordinatesSvenskegrensen);

//     // Extract coordinates for "Ryfylke"
//     const coordinatesRyfylke = areasGeoJson.features[1].geometry.coordinates;
//     const flattenCoordinatesRyfylke = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesRyfylke(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesRyfylke.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesRyfylke(coordinatesRyfylke);

//     // Extract coordinates for "Karmøy"
//     const coordinatesKarmoy = areasGeoJson.features[2].geometry.coordinates;
//     const flattenCoordinatesKarmoy = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesKarmoy(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesKarmoy.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesKarmoy(coordinatesKarmoy);

//     // Extract coordinates for "Hordaland"
//     const coordinatesHordaland = areasGeoJson.features[3].geometry.coordinates;
//     const flattenCoordinatesHordaland = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesHordaland(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesNordhordaland.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesHordaland(coordinatesHordaland);

//     // Extract coordinates for "Stadt"
//     const coordinatesStadtHustadvika =
//       areasGeoJson.features[4].geometry.coordinates;
//     const flattenCoordinatesStadtHustadvika = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesStadtHustadvika(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesStadtHustadVika.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesStadtHustadvika(coordinatesStadtHustadvika);

//     // Extract coordinates for "Nord og Sør"
//     const coordinatesNordOgSor = areasGeoJson.features[5].geometry.coordinates;
//     const flattenCoordinatesNordOgSor = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesNordOgSor(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesNordOgSor.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesNordOgSor(coordinatesNordOgSor);

//     // Extract coordinates for "Bindal"
//     const coordinatesBindal = areasGeoJson.features[6].geometry.coordinates;
//     const flattenCoordinatesBindal = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesBindal(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesNordMedBindal.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesBindal(coordinatesBindal);

//     // Extract coordinates for "Helgeland til Bodø"
//     const coordinatesHelgelandBodo =
//       areasGeoJson.features[7].geometry.coordinates;
//     const flattenCoordinatesHelgelandBodo = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesHelgelandBodo(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesHelgelandBodo.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesHelgelandBodo(coordinatesHelgelandBodo);

//     // Extract coordinates for "Vestfjorden"
//     const coordinatesVestfjorden =
//       areasGeoJson.features[8].geometry.coordinates;
//     const flattenCoordinatesVestfjorden = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesVestfjorden(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesVestfjorden.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesVestfjorden(coordinatesVestfjorden);

//     // Extract coordinates for "Senja"
//     const coordinatesSenja = areasGeoJson.features[9].geometry.coordinates;
//     const flattenCoordinatesSenja = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesSenja(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesSenja.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesSenja(coordinatesSenja);

//     // Extract coordinates for "Loppa"
//     const coordinatesLoppa = areasGeoJson.features[10].geometry.coordinates;
//     const flattenCoordinatesLoppa = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesLoppa(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesLoppa.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesLoppa(coordinatesLoppa);

//     // Extract coordinates for "Vest-Finnmark"
//     const coordinatesVestFinnmark =
//       areasGeoJson.features[11].geometry.coordinates;
//     const flattenCoordinatesVestFinnmark = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesVestFinnmark(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesVestFinnmark.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesVestFinnmark(coordinatesVestFinnmark);

//     // Extract coordinates for "Øst-Finnmark"
//     const coordinatesOstFinnmark =
//       areasGeoJson.features[12].geometry.coordinates;
//     const flattenCoordinatesOstFinnmark = (coords: any): void => {
//       if (Array.isArray(coords[0])) {
//         coords.forEach((nestedCoord: [number, number][]) => {
//           flattenCoordinatesOstFinnmark(nestedCoord);
//         });
//       } else {
//         polygonCoordinatesOstFinnmark.push([coords[0], coords[1]]);
//       }
//     };
//     flattenCoordinatesOstFinnmark(coordinatesOstFinnmark);

//     // //Per year:
//     // let placesInSvenskegrensenCount2019 = 0;
//     // let placesInSvenskegrensenCount2020 = 0;
//     // let placesInSvenskegrensenCount2021 = 0;
//     // let placesInSvenskegrensenCount2022 = 0;
//     // let placesInSvenskegrensenCount2023 = 0;

//     // let placesInSvenskegrensenCount = 0;

//     // let placesInRyfylkeCount2014 = 0;
//     // let placesInRyfylkeCount2015 = 0;
//     // let placesInRyfylkeCount2016 = 0;
//     // let placesInRyfylkeCount2017 = 0;
//     // let placesInRyfylkeCount2018 = 0;
//     // let placesInRyfylkeCount2019 = 0;
//     // let placesInRyfylkeCount2020 = 0;
//     // let placesInRyfylkeCount2021 = 0;
//     // let placesInRyfylkeCount2022 = 0;
//     // let placesInRyfylkeCount2023 = 0;

//     // let placesInRyfylkeCount = 0;

//     let placesInKarmoyCount = 0;
//     let placesInNordtilStadt = 0;
//     let placesInStadtHustadvika = 0;
//     let placesInNordOgSor = 0;
//     let placesInBindal = 0;
//     let placesInHelgelandBodoCount = 0;
//     let placesInVestfjorden = 0;
//     let placesInSenja = 0;
//     let placesInLoppa = 0;
//     let placesInVestFinnmark = 0;
//     let placesInOstFinnmark = 0;

//     if (data.features) {
//       data.features.forEach((feature: { attributes: any }) => {
//         const attributes = feature.attributes;
//         const art = attributes.art;
//         const lat: number = attributes.lat;
//         const lon: number = attributes.lon;

//         const rommingdatoMilliseconds = attributes.rommingsdato;
//         const rommingdatoSeconds = rommingdatoMilliseconds / 1000; // Convert to seconds
//         const rommingDate = new Date(rommingdatoSeconds * 1000); // Convert to milliseconds

//         if (art === "Laks") {
//           const year = rommingDate.getFullYear();
//           // Check if the coordinates are within the "Svenskegrensen til Jæren" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesSvenskegrensen)) {
//             if (year === 2019)
//               placesInSvenskegrensenCount2019 += attributes.antall_romt;
//             else if (year === 2020)
//               placesInSvenskegrensenCount2020 += attributes.antall_romt;
//             else if (year === 2021)
//               placesInSvenskegrensenCount2021 += attributes.antall_romt;
//             else if (year === 2022)
//               placesInSvenskegrensenCount2022 += attributes.antall_romt;
//             else if (year === 2023)
//               placesInSvenskegrensenCount2023 += attributes.antall_romt;
//           }
//           // Check if the coordinates are within the "Svenskegrensen til Jæren" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesSvenskegrensen)) {
//             console.log(
//               "selskapsnavn (Svenskegrensen):",
//               attributes.selskapsnavn
//             );
//             console.log(
//               "antatt_romt (Svenskegrensen):",
//               attributes.antall_romt
//             );

//             console.log(
//               "Rømmingdato (Svenskegrensen):",
//               rommingDate.toUTCString()
//             );
//             console.log("Beskrivelse:", attributes.beskrivelse);

//             placesInSvenskegrensenCount += attributes.antall_romt; // Add to the total
//           }

//           // Check if the coordinates are within the "Ryfylke" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesRyfylke)) {
//             if (year === 2014)
//               placesInRyfylkeCount2014 += attributes.antall_romt;
//             else if (year === 2015)
//               placesInRyfylkeCount2015 += attributes.antall_romt;
//             else if (year === 2016)
//               placesInRyfylkeCount2016 += attributes.antall_romt;
//             else if (year === 2017)
//               placesInRyfylkeCount2017 += attributes.antall_romt;
//             else if (year === 2018)
//               placesInRyfylkeCount2018 += attributes.antall_romt;
//             else if (year === 2019)
//               placesInRyfylkeCount2019 += attributes.antall_romt;
//             else if (year === 2020)
//               placesInRyfylkeCount2020 += attributes.antall_romt;
//             else if (year === 2021)
//               placesInRyfylkeCount2021 += attributes.antall_romt;
//             else if (year === 2022)
//               placesInRyfylkeCount2022 += attributes.antall_romt;
//             else if (year === 2023)
//               placesInRyfylkeCount2023 += attributes.antall_romt;
//           }
//           // Check if the coordinates are within the "Svenskegrensen til Jæren" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesRyfylke)) {
//             console.log("selskapsnavn (Ryfylke):", attributes.selskapsnavn);
//             console.log("antatt_romt (Ryfylke):", attributes.antall_romt);

//             console.log("Rømmingdato (Ryfylke):", rommingDate.toUTCString());
//             console.log("Beskrivelse:", attributes.beskrivelse);

//             placesInRyfylkeCount += attributes.antall_romt; // Add to the total
//           }

//           // Check if the coordinates are within the "Karmøy til Sotra" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesKarmoy)) {
//             console.log(
//               "selskapsnavn (Karmøy til Sotra):",
//               attributes.selskapsnavn
//             );
//             console.log(
//               "antatt_romt (Karmøy til Sotra):",
//               attributes.antall_romt
//             );

//             placesInKarmoyCount += attributes.antall_romt; // Add to the total
//           }

//           // Check if the coordinates are within the "Nordhordaland til Stadt" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesNordhordaland)) {
//             console.log(
//               "selskapsnavn (Nordhordaland til Stadt):",
//               attributes.selskapsnavn
//             );
//             console.log(
//               "antatt_romt (Nordhordaland til Stadt):",
//               attributes.antall_romt
//             );

//             placesInNordtilStadt += attributes.antall_romt; // Add to the total
//           }

//           // Check if the coordinates are within the "Stadt til Hustadvika" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesStadtHustadVika)) {
//             console.log(
//               "selskapsnavn (Stadt til Hustadvika):",
//               attributes.selskapsnavn
//             );
//             console.log(
//               "antatt_romt (Stadt til Hustadvika):",
//               attributes.antall_romt
//             );

//             placesInStadtHustadvika += attributes.antall_romt; // Add to the total
//           }

//           // Check if the coordinates are within the "Nordmøre og Sør-trøndelag" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesNordOgSor)) {
//             console.log(
//               "selskapsnavn (Nordmøre og Sør-Trøndelag):",
//               attributes.selskapsnavn
//             );
//             console.log(
//               "antatt_romt (Nordmøre og Sør-Trøndelag):",
//               attributes.antall_romt
//             );

//             placesInNordOgSor += attributes.antall_romt; // Add to the total
//           }

//           // Check if the coordinates are within the "Nord-Trøndelag med Bindal" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesNordMedBindal)) {
//             console.log(
//               "selskapsnavn (Nord-Trøndelag med Bindal):",
//               attributes.selskapsnavn
//             );
//             console.log(
//               "antatt_romt (Nord-Trøndelag med Bindal):",
//               attributes.antall_romt
//             );

//             placesInBindal += attributes.antall_romt; // Add to the total
//           }

//           // Check if the coordinates are within the "Helgeland til Bodø" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesHelgelandBodo)) {
//             console.log(
//               "selskapsnavn (Helgeland til Bodø):",
//               attributes.selskapsnavn
//             );
//             console.log(
//               "antatt_romt (Helgeland til Bodø):",
//               attributes.antall_romt
//             );

//             placesInHelgelandBodoCount += attributes.antall_romt;
//           }

//           // Check if the coordinates are within the "Vestfjorden og Vesterålen" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesVestfjorden)) {
//             console.log(
//               "selskapsnavn (Vestfjorden og Vesterålen):",
//               attributes.selskapsnavn
//             );
//             console.log(
//               "antatt_romt (Vestfjorden og Vesterålen):",
//               attributes.antall_romt
//             );

//             placesInVestfjorden += attributes.antall_romt; // Add to the total
//           }

//           // Check if the coordinates are within the "Andøya til Senja" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesSenja)) {
//             console.log(
//               "selskapsnavn (Andøya til Senja):",
//               attributes.selskapsnavn
//             );
//             console.log(
//               "antatt_romt (Andøya til Senja):",
//               attributes.antall_romt
//             );

//             placesInSenja += attributes.antall_romt; // Add to the total
//           }

//           // Check if the coordinates are within the "Kvaløya til Loppa" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesLoppa)) {
//             console.log(
//               "selskapsnavn (Kvaløya til Loppa):",
//               attributes.selskapsnavn
//             );
//             console.log(
//               "antatt_romt (Kvaløya til Loppa):",
//               attributes.antall_romt
//             );

//             placesInLoppa += attributes.antall_romt; // Add to the total
//           }

//           // Check if the coordinates are within the "Vest-Finnmark" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesVestFinnmark)) {
//             console.log(
//               "selskapsnavn (Vest-Finnmark):",
//               attributes.selskapsnavn
//             );
//             console.log("antatt_romt (Vest-Finnmark):", attributes.antall_romt);

//             placesInVestFinnmark += attributes.antall_romt; // Add to the total
//           }

//           // Check if the coordinates are within the "Øst-Finnmark" area
//           if (isPointInPolygon([lon, lat], polygonCoordinatesOstFinnmark)) {
//             console.log(
//               "selskapsnavn (Øst-Finnmark):",
//               attributes.selskapsnavn
//             );
//             const antattRomt = attributes.antall_romt;
//             console.log("antatt_romt (Øst-Finnmark):", antattRomt);

//             placesInOstFinnmark += antattRomt; // Add to the total
//           }
//         }
//       });

//       console.log(
//         `Total amount escaped in
//         "Svenskegrensen til Jæren": ${placesInSvenskegrensenCount}`
//       );
//       console.log(
//         `Total amount escaped in
//         "Ryfylke": ${placesInRyfylkeCount}`
//       );

//       console.log(
//         `Total amount escaped in
//         "Karmøy til Sotra": ${placesInKarmoyCount}`
//       );
//       console.log(
//         `Total amount escaped in
//         "Nordhordaland til Stadt": ${placesInNordtilStadt}`
//       );
//       console.log(
//         `Total amount escaped in
//         "Stadt til Hustadvika": ${placesInStadtHustadvika}`
//       );
//       console.log(
//         `Total amount escaped in
//         "Nordmøre og Sør-Trøndelag": ${placesInNordOgSor}`
//       );
//       console.log(
//         `Total amount escaped in
//         "Nord-Trøndelag med Bindal": ${placesInBindal}`
//       );
//       console.log(
//         `Total amount escaped in
//         "Helgeland til Bodø": ${placesInHelgelandBodoCount}`
//       );
//       console.log(
//         `Total amount escaped in
//         "Vestfjorden og Vesterålen": ${placesInVestfjorden}`
//       );
//       console.log(
//         `Total amount escaped in
//         "Andøya til Senja": ${placesInSenja}`
//       );
//       console.log(
//         `Total amount escaped in
//         "Kvaløya til Loppa": ${placesInLoppa}`
//       );
//       console.log(
//         `Total amount escaped in
//         "Vest-Finnmark": ${placesInVestFinnmark}`
//       );
//       console.log(
//         `Total amount escaped in
//         "Øst-Finnmark": ${placesInOstFinnmark}`
//       );
//       console.log(
//         `Total amount escaped in "Svenskegrensen til Jæren":\n2019: ${placesInSvenskegrensenCount2019}\n2020: ${placesInSvenskegrensenCount2020}\n2021: ${placesInSvenskegrensenCount2021}\n2022: ${placesInSvenskegrensenCount2022}\n2023: ${placesInSvenskegrensenCount2023}`
//       );
//       console.log(
//         `Total amount escaped in "Ryfylke":\n` +
//           `2014: ${placesInRyfylkeCount2014}\n` +
//           `2015: ${placesInRyfylkeCount2015}\n` +
//           `2016: ${placesInRyfylkeCount2016}\n` +
//           `2017: ${placesInRyfylkeCount2017}\n` +
//           `2018: ${placesInRyfylkeCount2018}\n` +
//           `2019: ${placesInRyfylkeCount2019}\n` +
//           `2020: ${placesInRyfylkeCount2020}\n` +
//           `2021: ${placesInRyfylkeCount2021}\n` +
//           `2022: ${placesInRyfylkeCount2022}\n` +
//           `2023: ${placesInRyfylkeCount2023}`
//       );

//       // And similar logs for each area
//     } else {
//       console.error("No features found in the API response.");
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };

// fetchDataAndLogProperties();

// export const areasGeoJson = {
//   type: "FeatureCollection",
//   features: [
//     {
//       type: "Feature",
//       properties: {
//         name: "Svenskegrensen til Jæren",
//         biomasse: "10000 tonn",
//         temperatur: "10 ℃",
//         romming: placesInSvenskegrensenCount2020.toString(),
//       },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [5.4899995526, 58.7099996192],
//             [5.5200003504, 58.6599998608],
//             [5.57000062, 58.5999991088],
//             [5.6299995383, 58.5499995288],
//             [5.6600001384, 58.5299995963],
//             [5.7699996108, 58.469999793],
//             [5.8399995187, 58.4199996103],
//             [5.9100009943, 58.3899999822],
//             [5.9900001868, 58.37000008],
//             [6.290000697, 58.270000201],
//             [6.4100003538, 58.1900001972],
//             [6.4200005396, 58.1899997742],
//             [6.5500008183, 58.0899997039],
//             [6.5700003053, 58.0799996061],
//             [6.5899996771, 58.0699995141],
//             [6.6200008518, 58.0499996438],
//             [6.6400002203, 58.0499994687],
//             [6.680000771, 58.039999869],
//             [6.8400000407, 57.9999997965],
//             [7.1000002771, 57.9599998332],
//             [7.379999653, 57.9400000149],
//             [7.6000005156, 57.9400002579],
//             [7.6400002617, 57.9499997256],
//             [7.6799998958, 57.9500003347],
//             [7.8800003481, 57.9999996617],
//             [8.0699995228, 58.0399997699],
//             [8.2499992688, 58.089999552],
//             [8.3900007347, 58.1500000703],
//             [8.6000004551, 58.2499999286],
//             [8.7300000216, 58.3199999668],
//             [8.8600007198, 58.4000000094],
//             [8.9999996058, 58.4900002501],
//             [9.1300000262, 58.5800000993],
//             [9.4100002889, 58.7400004537],
//             [9.7899999805, 58.8800003979],
//             [10.0399995589, 58.9299999202],
//             [10.2399998949, 58.9600003011],
//             [10.4100004735, 58.9500000994],
//             [10.6199996583, 58.9399995643],
//             [10.6499992658, 58.9399999361],
//             [10.7600007055, 58.9400004646],
//             [10.8799997403, 58.9399998687],
//             [10.9199992487, 58.9399997449],
//             [10.9499993756, 58.9499996854],
//             [10.980000512, 58.9600004215],
//             [11.070000284, 58.9799997031],
//             [11.079999532, 58.9899995416],
//             [11.0900001621, 58.9900002044],
//             [11.1200001678, 59.0200000231],
//             [11.1300004101, 59.0299999803],
//             [11.1499999721, 59.0799999639],
//             [11.2279991983, 59.088000149],
//             [11.2520001498, 59.0939995555],
//             [10.9999995305, 59.9999999643],
//             [10.0000005873, 59.9999996551],
//             [7.9999999168, 58.7499997051],
//             [5.4900006389, 58.7499997054],
//             [5.4600005362, 58.7299994744],
//             [5.4899995526, 58.7099996192],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         name: "Ryfylke",
//         romming: placesInRyfylkeCount2015,
//       },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [4.8339998529, 59.2099992893],
//             [4.9400003102, 59.1499987258],
//             [5.2900011836, 58.8799992847],
//             [5.3400002787, 58.7999992659],
//             [5.4000005504, 58.6899993258],
//             [5.4900006389, 58.7499997054],
//             [7.9999999168, 58.7499997051],
//             [6.9999995227, 59.9999996238],
//             [5.9100010722, 59.6099993435],
//             [5.3400011989, 59.4299995482],
//             [5.2960000866, 59.3749993237],
//             [5.2600000306, 59.3499989107],
//             [5.269999663, 59.1799994821],
//             [5.1929998938, 59.1479996275],
//             [4.8339998529, 59.2099992893],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Karmøy til Sotra" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [4.5999885673, 59.2499899722],
//             [5.1929828747, 59.1479864355],
//             [5.2699818156, 59.1799856246],
//             [5.2599822026, 59.3499851737],
//             [5.295981852, 59.3749852722],
//             [5.3399824407, 59.4299851107],
//             [5.9099743843, 59.6099790539],
//             [6.9999478009, 59.999963045],
//             [7.9999066302, 60.6999396683],
//             [6.7999533887, 60.6999676447],
//             [5.7999751432, 60.4099806647],
//             [5.3299808051, 60.4099853461],
//             [5.3299813724, 60.4499853163],
//             [5.2719814367, 60.4599861515],
//             [5.2349821481, 60.4589864445],
//             [5.1399841961, 60.4899868682],
//             [5.0729844653, 60.4649869884],
//             [5.0369843308, 60.4589876354],
//             [4.9869846133, 60.456988278],
//             [4.999984217, 60.4299877213],
//             [4.9839844762, 60.4169875897],
//             [4.9659859568, 60.4409884777],
//             [4.9549851083, 60.4569879124],
//             [4.9379847576, 60.4649885175],
//             [4.933985776, 60.4579884306],
//             [4.92298632, 60.4539883201],
//             [4.9039867132, 60.4459881637],
//             [4.5399888566, 60.4599903947],
//             [4.5399894493, 60.4499904481],
//             [4.649988671, 60.2499903772],
//             [4.6999872755, 60.1099892656],
//             [4.7699863979, 59.8999894398],
//             [4.7499883638, 59.5599892417],
//             [4.7199878885, 59.5199897869],
//             [4.5999897717, 59.3199899301],
//             [4.5899882582, 59.2799905542],
//             [4.5999885673, 59.2499899722],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Nordhordaland til Stadt" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [4.6599888659, 60.455490009],
//             [4.9039867132, 60.4459881637],
//             [4.92298632, 60.4539883201],
//             [4.933985776, 60.4579884306],
//             [4.9379847576, 60.4649885175],
//             [4.9549851083, 60.4569879124],
//             [4.9659859568, 60.4409884777],
//             [4.9839844762, 60.4169875897],
//             [4.999984217, 60.4299877213],
//             [4.9869846133, 60.456988278],
//             [5.0369843308, 60.4589876354],
//             [5.0729844653, 60.4649869884],
//             [5.1399841961, 60.4899868682],
//             [5.2349821481, 60.4589864445],
//             [5.2719814367, 60.4599861515],
//             [5.3299813724, 60.4499853163],
//             [5.3299808051, 60.4099853461],
//             [5.7999751432, 60.4099806647],
//             [6.7999533887, 60.6999676447],
//             [7.9999066302, 60.6999396683],
//             [7.9999041687, 61.999941487],
//             [5.4399794145, 61.9999844219],
//             [5.4399780822, 62.0399849937],
//             [5.1009827869, 62.1939870446],
//             [5.0399842905, 62.299988239],
//             [4.849986648, 62.1299892139],
//             [4.7399861866, 62.0099898692],
//             [4.5599882883, 61.8199908227],
//             [4.3999900861, 61.3599912533],
//             [4.3699909157, 61.0599914961],
//             [4.3699908096, 61.0299918048],
//             [4.4799897826, 60.8199910325],
//             [4.6599888659, 60.455490009],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Stadt til Hustadvika" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [5.0399842905, 62.299988239],
//             [5.1009827869, 62.1939870446],
//             [5.4399780822, 62.0399849937],
//             [5.4399794145, 61.9999844219],
//             [7.9999041687, 61.999941487],
//             [8.5998653062, 62.49992291],
//             [7.9999012472, 62.8299424603],
//             [7.199937771, 62.8999612915],
//             [7.1049400411, 62.9879627613],
//             [6.9109471326, 63.1559671558],
//             [6.6199563286, 63.0199711969],
//             [6.0199695595, 62.7999795147],
//             [5.5299783483, 62.5599840718],
//             [5.0399842905, 62.299988239],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Nordmøre og Sør-Trøndelag" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [6.8729475867, 63.1889675877],
//             [7.1049400411, 62.9879627613],
//             [7.199937771, 62.8999612915],
//             [7.9999012472, 62.8299424603],
//             [8.5998653062, 62.49992291],
//             [12.2991334342, 63.8996291091],
//             [10.612604355, 64.3908171417],
//             [10.5096225868, 64.4288245168],
//             [9.8477275868, 64.5238687517],
//             [8.8478398415, 64.0799162094],
//             [8.6338574779, 63.9999237785],
//             [8.2328853915, 63.9999374817],
//             [8.2128858922, 63.9919377214],
//             [8.1268907451, 63.9399402914],
//             [7.8409076302, 63.7699476921],
//             [7.5269224359, 63.5769549007],
//             [7.3579309047, 63.4609582341],
//             [6.8729475867, 63.1889675877],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Nord-Trøndelag med Bindal" },
//       geometry: {
//         type: "MultiPolygon",
//         coordinates: [
//           [
//             [
//               [9.8489276352, 64.5236966374],
//               [9.8477275868, 64.5238687517],
//               [9.8482272179, 64.5233689486],
//               [9.8489276352, 64.5236966374],
//             ],
//           ],
//           [
//             [
//               [9.8489276352, 64.5236966374],
//               [10.5096225868, 64.4288245168],
//               [10.612604355, 64.3908171417],
//               [12.2991334342, 63.8996291091],
//               [13.198685805, 64.599481593],
//               [13.2986035699, 65.3494717387],
//               [12.5989753627, 65.3495962416],
//               [12.3290901067, 65.4096377023],
//               [12.199144659, 65.3296554476],
//               [12.0991849165, 65.2196679734],
//               [12.0372073026, 65.2166759527],
//               [11.9712308566, 65.229684837],
//               [11.962234311, 65.2306853529],
//               [11.0794896834, 65.4897824267],
//               [10.7795624974, 65.1898071958],
//               [10.5396117, 64.9598250162],
//               [10.3796434371, 64.7998356716],
//               [10.1396833733, 64.6598517093],
//               [9.8489276352, 64.5236966374],
//             ],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Helgeland til Bodø" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [11.0794896834, 65.4897824267],
//             [11.962234311, 65.2306853529],
//             [11.9712308566, 65.229684837],
//             [12.0372073026, 65.2166759527],
//             [12.0991849165, 65.2196679734],
//             [12.199144659, 65.3296554476],
//             [12.3290901067, 65.4096377023],
//             [12.5989753627, 65.3495962416],
//             [13.2986035699, 65.3494717387],
//             [14.1979112685, 66.09927368],
//             [15.5962051883, 67.0488326903],
//             [15.6960277618, 67.2987999775],
//             [15.0968788746, 67.3990317075],
//             [14.7972445918, 67.3491284179],
//             [14.307756721, 67.2632684223],
//             [13.3984746305, 67.4294820265],
//             [12.1991128399, 66.9896704605],
//             [12.3890379863, 66.7896431638],
//             [11.9692078602, 66.5996964802],
//             [11.5093676753, 66.1297444907],
//             [11.3694101589, 65.8897577841],
//             [11.0794896834, 65.4897824267],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Vestfjorden og Vesterålen" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [12.1991128399, 66.9896704605],
//             [13.3984746305, 67.4294820265],
//             [14.307756721, 67.2632684223],
//             [14.7972445918, 67.3491284179],
//             [15.0968788746, 67.3990317075],
//             [15.6960277618, 67.2987999775],
//             [15.9455942145, 67.498698913],
//             [16.5443843267, 67.7984167388],
//             [17.0431322759, 68.1981514597],
//             [17.7908837572, 68.0976251259],
//             [17.9900782697, 68.5975069304],
//             [16.5722302236, 68.6264440752],
//             [15.9954070737, 68.5987217032],
//             [15.9954154796, 68.4987175143],
//             [15.6959309032, 68.4988448244],
//             [15.7458335217, 68.6988322449],
//             [15.6489730193, 68.9598807541],
//             [15.6300034265, 68.9658882582],
//             [15.6459733985, 68.9988835996],
//             [16.1171127855, 69.3186998],
//             [16.0951507592, 69.3587113399],
//             [15.8855426205, 69.3087992157],
//             [15.4462717963, 69.18896584],
//             [15.2465661301, 69.1490350838],
//             [14.8870427465, 69.0091469317],
//             [14.4775144826, 68.829259584],
//             [14.2277661903, 68.7093215921],
//             [13.8980660386, 68.4993957832],
//             [13.3984473062, 68.2694950191],
//             [13.1286213663, 68.1995432722],
//             [13.0786525669, 68.1695516676],
//             [12.8887647358, 68.0495814169],
//             [12.6388984285, 67.8196176971],
//             [12.5389498477, 67.7096312428],
//             [12.2790667503, 67.6296663073],
//             [11.9691926944, 67.5397046255],
//             [11.8992182547, 67.5197122543],
//             [11.8092501694, 67.4597224495],
//             [11.7992560619, 67.4097231817],
//             [12.1091476284, 67.0796826256],
//             [12.1991128399, 66.9896704605],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Andøya til Senja" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [16.0951507592, 69.3587113399],
//             [16.1171127855, 69.3186998],
//             [15.6459733985, 68.9988835996],
//             [15.6300034265, 68.9658882582],
//             [15.6489730193, 68.9598807541],
//             [15.7458335217, 68.6988322449],
//             [15.6959309032, 68.4988448244],
//             [15.9954154796, 68.4987175143],
//             [15.9954070737, 68.5987217032],
//             [16.5722302236, 68.6264440752],
//             [17.9900782697, 68.5975069304],
//             [19.1844539347, 68.9963979334],
//             [19.1843657727, 69.2964358437],
//             [18.7665565958, 69.3968875217],
//             [18.7287084374, 69.5409412784],
//             [18.7207424825, 69.5549507285],
//             [18.6868976431, 69.5969874018],
//             [18.2887034006, 69.5473433685],
//             [18.0367061998, 69.6205580632],
//             [17.990877686, 69.6335950582],
//             [17.9629834472, 69.6346172193],
//             [17.939072804, 69.6416357781],
//             [17.740760739, 69.7977970274],
//             [17.6710088259, 69.7478431643],
//             [17.4517475039, 69.6179836532],
//             [16.544203711, 69.4385024518],
//             [16.0951507592, 69.3587113399],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Kvaløya til Loppa" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [17.740760739, 69.7977970274],
//             [17.939072804, 69.6416357781],
//             [17.9629834472, 69.6346172193],
//             [17.990877686, 69.6335950582],
//             [18.0367061998, 69.6205580632],
//             [18.2887034006, 69.5473433685],
//             [18.6868976431, 69.5969874018],
//             [18.7207424825, 69.5549507285],
//             [18.7287084374, 69.5409412784],
//             [18.7665565958, 69.3968875217],
//             [19.1843657727, 69.2964358437],
//             [19.1844539347, 68.9963979334],
//             [22.646957989, 69.6900048394],
//             [22.1549014729, 69.9914409802],
//             [22.0562810074, 70.1417326105],
//             [21.6618631681, 70.0926289188],
//             [21.4445657665, 70.1831135374],
//             [21.1677974692, 70.2166683466],
//             [20.9004876178, 70.5642361958],
//             [19.4723023305, 70.3762528105],
//             [18.835987648, 70.2769213302],
//             [18.6170821065, 70.2371240178],
//             [18.4677898517, 70.1672501652],
//             [17.740760739, 69.7977970274],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Vest-Finnmark" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [20.9004876178, 70.5642361958],
//             [21.1677974692, 70.2166683466],
//             [21.4445657665, 70.1831135374],
//             [21.6618631681, 70.0926289188],
//             [22.0562810074, 70.1417326105],
//             [22.1549014729, 69.9914409802],
//             [22.646957989, 69.6900048394],
//             [24.8872952291, 69.8811547792],
//             [26.8528660399, 70.2176821085],
//             [27.452309007, 70.772562703],
//             [27.7580290668, 71.0476323712],
//             [27.779635222, 71.0894540868],
//             [27.6430509249, 71.0909921814],
//             [26.4845041369, 71.1519083899],
//             [25.4987858376, 71.1787226763],
//             [25.0676161127, 71.1511335569],
//             [24.2953475784, 71.1148148646],
//             [23.9360488, 71.1062867734],
//             [23.292490839, 70.978537588],
//             [22.3117557822, 70.7713056444],
//             [21.8981936698, 70.6822737726],
//             [20.9004876178, 70.5642361958],
//           ],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: { name: "Øst-Finnmark" },
//       geometry: {
//         type: "Polygon",
//         coordinates: [
//           [
//             [27.779635222, 71.0894540868],
//             [27.7580290668, 71.0476323712],
//             [27.452309007, 70.772562703],
//             [26.8528660399, 70.2176821085],
//             [27.7112006626, 70.2088422353],
//             [29.2242638847, 69.4347207979],
//             [29.4782244852, 69.6000601136],
//             [29.6462003669, 69.60650137],
//             [30.1294798202, 69.6952055589],
//             [30.1534966311, 69.704605201],
//             [30.2709498067, 69.9020498782],
//             [30.2864574738, 69.931715544],
//             [30.2938929519, 69.9716338131],
//             [30.3247945483, 70.0309634864],
//             [30.3323160934, 70.0608470364],
//             [30.3399527727, 70.0806957949],
//             [30.3705590589, 70.1500561087],
//             [30.4549286898, 70.2780556202],
//             [30.4623215074, 70.3079384159],
//             [30.4466296487, 70.3184274288],
//             [30.0723622597, 70.4689219476],
//             [29.6363410144, 70.6293643229],
//             [29.2220334606, 70.7277501452],
//             [28.8416071256, 70.8144686154],
//             [28.3828840909, 70.9415774411],
//             [27.9338103304, 71.0676053277],
//             [27.779635222, 71.0894540868],
//           ],
//         ],
//       },
//     },
//   ],
// };
