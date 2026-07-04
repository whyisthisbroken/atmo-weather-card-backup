(function() {
"use strict";
/**
 * ATMOSPHERIC WEATHER CARD
 * Version: 5.0
 * https://github.com/shpongledsummer/atmospheric-weather-card
 */
console.info(
    "%c Atmospheric Weather Card ",
    "color: white; font-weight: 700; background: linear-gradient(90deg, #355C7D 0%, #6C5B7B 50%, #C06C84 100%); padding: 6px 12px; border-radius: 6px; font-family: sans-serif; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.2);"
);
try { CSS.registerProperty({ name: '--awc-ring-pct', syntax: '<percentage>', inherits: true, initialValue: '0%' }); } catch (_) {}
const ACTIVE_STATES = Object.freeze([
    'on', 'true', 'open', 'unlocked', 'home', 'active'
]);

const FALLBACK_WEATHER = Object.freeze({
    state: 'cloudy',
    attributes: {
        temperature: '--',
        temperature_unit: '',
        wind_speed: 0,
        wind_speed_unit: '',
        friendly_name: 'Weather Unavailable'
    }
});

const _h = s => [parseInt(s.slice(1,3),16)/255, parseInt(s.slice(3,5),16)/255, parseInt(s.slice(5,7),16)/255];

const SKY_HEX = {
    'sunny':           { day: ['#B0E8FF','#60B8FF','#4098F0','#3888E0'], night: ['#2E2480','#0F1247','#05081F','#000108'] },
    'clear-night':     { day: ['#B0E0FF','#80B8F0','#6098D8','#5080C8'], night: ['#264080','#262947','#0D0F1F','#030408'] },
    'partlycloudy':    { day: ['#B0E0FF','#80B8F0','#6098D8','#5080C8'], night: ['#404D80','#0D1433','#030514','#000004'] },
    'cloudy':          { day: ['#EDF7FB','#B9D5F1','#96BBDD','#8DA9D5'], night: ['#264080','#262947','#0D0F1F','#030408'] },
    'windy':           { day: ['#ECF7FE','#C5DDF5','#96B9E0','#7FA0D1'], night: ['#1A3359','#0D1A40','#050D26','#000314'] },
    'windy-variant':   { day: ['#ECF7FE','#C5DDF5','#96B9E0','#7FA0D1'], night: ['#1A3359','#0D1A40','#050D26','#000314'] },
    'exceptional':     { day: ['#B0ECFF','#60C0FF','#40A0F0','#3890E0'], night: ['#33758F','#1A3D80','#1A1457','#05051A'] },
    'default':         { day: ['#A8E4FF','#70B8F0','#4898E0','#3888D0'], night: ['#2D2474','#101141','#06081D','#000107'] },
    'fog':             { day: ['#E0F0F4','#C2D8E2','#A2B6C6','#8493A6'], night: ['#323F53','#141E35','#06080F','#010204'] },
    'snowy':           { day: ['#EDF4FC','#CADCF2','#AAC6E6','#93B2D6'], night: ['#1C374E','#0F1E33','#080F20','#040812'] },
    'snowy-rainy':     { day: ['#E6EDF7','#C0D4EC','#A2BEDC','#8AAAC9'], night: ['#1C374E','#0F1E33','#080F20','#040812'] },
    'hail':            { day: ['#7A94B8','#94B8D6','#B3DBED','#D6F2FA'], night: ['#263541','#0F1932','#080920','#01030A'] },
    'rainy':           { day: ['#D7E7F0','#A6C2D6','#5E7E9C','#39506E'], night: ['#193658','#192B45','#0F0A20','#04050A'] },
    'pouring':         { day: ['#BFD4E0','#85A2BB','#4E6B89','#2E445F'], night: ['#152E4A','#15253A','#0D081B','#040408'] },
    'lightning':       { day: ['#B6D0DA','#789AA6','#41607A','#243B54'], night: ['#263541','#0F1932','#080920','#01030A'] },
    'lightning-rainy': { day: ['#B6D0DA','#789AA6','#41607A','#243B54'], night: ['#263541','#0F1932','#080920','#01030A'] },
};

const SKY_COLORS = Object.fromEntries(Object.entries(SKY_HEX).map(
    ([k, v]) => [k, { skyDay: v.day.map(_h), skyNight: v.night.map(_h) }]
));

const VISUAL_DEFAULTS = Object.freeze({
    engine: 'sky',
    cloudCover: 0.00,
    cloudScale: 1.00,
    cloudShadow: 0.00,
    cloudThickness: 0.00,
    clearing: 0.42,
    cloudSpeed: 1.00,
    rain: 0.00,
    lightning: 0.00,
    snowfall: 0.00,
    flakeSize: 1.00,
    hail: 0.00,
    stars: false,
    starCount: 0,
    starsOpacity: 0.00,
    sunrays: false,
    skyDay: null,
    skyNight: null,
});

const WEATHER_VISUALS = Object.freeze({
    'sunny':            { engine: 'sky', cloudCover: 0.05, cloudScale: 1.85, cloudShadow: 0.12, cloudSpeed: 0.20, sunrays: true, stars: true, starsOpacity: 0.90, starCount: 700 },
    'clear-night':      { engine: 'sky', cloudCover: 0.05, cloudScale: 1.35, cloudShadow: 0.10, cloudSpeed: 0.10, stars: true, starsOpacity: 1.00, starCount: 800 },
    'partlycloudy':     { engine: 'sky', cloudCover: 0.28, cloudScale: 2.10, cloudShadow: 0.10, cloudThickness: 0.20, cloudSpeed: 0.45, sunrays: true, stars: true, starsOpacity: 0.70, starCount: 450 },
    'cloudy':           { engine: 'sky', cloudCover: 0.34, cloudScale: 2.20, cloudShadow: 0.35, cloudThickness: 0.25, cloudSpeed: 0.60, stars: true, starsOpacity: 0.50, starCount: 300 },
    'windy':            { engine: 'sky', cloudCover: 0.39, cloudScale: 2.30, cloudShadow: 0.22, cloudThickness: 0.25, cloudSpeed: 1.20, stars: true, starsOpacity: 0.80, starCount: 500 },
    'windy-variant':    { engine: 'sky', cloudCover: 0.34, cloudScale: 1.50, cloudShadow: 0.12, cloudSpeed: 1.20, stars: true, starsOpacity: 0.80, starCount: 600 },
    'exceptional':      { engine: 'sky', cloudCover: 0.01, cloudScale: 1.75, cloudShadow: 0.10, cloudSpeed: 0.10, sunrays: true, stars: true, starsOpacity: 1.00, starCount: 800 },
    'default':          { engine: 'sky', cloudCover: 0.30, cloudScale: 1.45, cloudSpeed: 1.00, stars: true, starsOpacity: 0.80, starCount: 800 },
    'fog':              { engine: 'sky', cloudCover: 0.15, cloudScale: 2.20, cloudShadow: 0.05, clearing: 0.00, cloudSpeed: 0.10, stars: true, starsOpacity: 0.35, starCount: 250 },
    'snowy':            { engine: 'sky', cloudCover: 0.33, cloudScale: 1.80, cloudShadow: 0.22, cloudSpeed: 0.35, snowfall: 1.00, flakeSize: 1.50, stars: true, starsOpacity: 0.40, starCount: 600 },
    'snowy-rainy':      { engine: 'sky', cloudCover: 0.38, cloudScale: 1.70, cloudShadow: 0.26, cloudSpeed: 0.45, snowfall: 0.70, flakeSize: 1.40, stars: true, starsOpacity: 0.30, starCount: 450 },
    'hail':             { engine: 'sky', cloudCover: 0.33, cloudScale: 1.60, cloudShadow: 0.34, cloudSpeed: 0.70, snowfall: 0.90, flakeSize: 2.00, hail: 1.00, stars: true, starsOpacity: 0.45, starCount: 350 },
    'rainy':            { engine: 'water', rain: 0.70 },
    'pouring':          { engine: 'water', rain: 1.00 },
    'lightning':        { engine: 'water', rain: 1.00, lightning: 1.00 },
    'lightning-rainy':  { engine: 'water', rain: 1.00, lightning: 1.00 },
});

function resolveVisuals(weatherState) {
    const key = WEATHER_VISUALS[weatherState] ? weatherState : 'default';
    return { ...VISUAL_DEFAULTS, ...WEATHER_VISUALS[key], ...SKY_COLORS[key] };
}
const WEATHER_ICONS = Object.freeze({
    'clear-night': 'mdi:weather-night',
    'cloudy': 'mdi:weather-cloudy',
    'fog': 'mdi:weather-fog',
    'hail': 'mdi:weather-hail',
    'lightning': 'mdi:weather-lightning',
    'lightning-rainy': 'mdi:weather-lightning-rainy',
    'partlycloudy': 'mdi:weather-partly-cloudy',
    'pouring': 'mdi:weather-pouring',
    'rainy': 'mdi:weather-rainy',
    'snowy': 'mdi:weather-snowy',
    'snowy-rainy': 'mdi:weather-snowy-rainy',
    'sunny': 'mdi:weather-sunny',
    'windy': 'mdi:weather-windy',
    'windy-variant': 'mdi:weather-windy-variant',
    'exceptional': 'mdi:weather-sunny',
    'default': 'mdi:weather-cloudy'
});
const WEATHER_ATTR_ICONS = Object.freeze({
    temperature:    'mdi:thermometer',
    apparent_temperature: 'mdi:thermometer-lines',
    humidity:       'mdi:water-percent',
    pressure:       'mdi:gauge',
    wind_speed:     'mdi:weather-windy',
    wind_bearing:   'mdi:compass-outline',
    wind_gust_speed:'mdi:weather-windy-variant',
    visibility:     'mdi:eye-outline',
    dew_point:      'mdi:thermometer-low',
    uv_index:       'mdi:weather-sunny-alert',
    cloud_coverage: 'mdi:cloud-outline',
    ozone:          'mdi:weather-hazy'
});
const FORECAST_ATTR_ICONS = Object.freeze({
    ...WEATHER_ATTR_ICONS,
    condition: 'mdi:weather-partly-cloudy', templow: 'mdi:thermometer-low',
    precipitation: 'mdi:weather-rainy', precipitation_probability: 'mdi:weather-rainy',
});
// Weather icon glyphs remixed from Lucide (https://lucide.dev), ISC License.
const AWC_BUILTIN_ICONS = Object.freeze({
    'clear-night':     '<g><animateTransform attributeName="transform" type="translate" values="0,0; -0.7,0.7; 0,0" dur="3.5s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" values="-4 12 12; 4 12 12; -4 12 12" dur="4s" repeatCount="indefinite" additive="sum"/><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" fill="currentColor" fill-opacity="0.12"><animate attributeName="fill-opacity" values="0.06;0.22;0.06" dur="4s" repeatCount="indefinite"/></path></g>',
    'cloudy':          '<g><animateTransform attributeName="transform" type="translate" values="0,0;0.6,0;0,0;-0.6,0;0,0" dur="6s" repeatCount="indefinite"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="currentColor" fill-opacity="0.08"/></g>',
    'fog':             '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" fill="currentColor" fill-opacity="0.08"/><path d="M16 17H7" stroke-dasharray="2 2.5"><animate attributeName="stroke-dashoffset" values="0;9" dur="3s" repeatCount="indefinite"/></path><path d="M17 21H9" stroke-dasharray="2 2.5"><animate attributeName="stroke-dashoffset" values="0;-9" dur="4s" repeatCount="indefinite"/></path>',
    'hail':            '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" fill="currentColor" fill-opacity="0.08"/><path d="M16 14v2" stroke-opacity="0.8"><animate attributeName="stroke-opacity" values="0.8;0.3;0.8" dur="0.8s" repeatCount="indefinite"/></path><path d="M8 14v2" stroke-opacity="0.8"><animate attributeName="stroke-opacity" values="0.8;0.3;0.8" dur="0.8s" begin="0.3s" repeatCount="indefinite"/></path><circle cx="16" cy="20" r="0.5" fill="currentColor" stroke="none"><animate attributeName="cy" values="18;20;19.2;20" dur="1s" repeatCount="indefinite"/></circle><circle cx="8" cy="20" r="0.5" fill="currentColor" stroke="none"><animate attributeName="cy" values="18;20;19.2;20" dur="1s" begin="0.35s" repeatCount="indefinite"/></circle><path d="M12 16v2" stroke-opacity="0.8"><animate attributeName="stroke-opacity" values="0.8;0.3;0.8" dur="0.8s" begin="0.15s" repeatCount="indefinite"/></path><circle cx="12" cy="22" r="0.5" fill="currentColor" stroke="none"><animate attributeName="cy" values="20;22;21.2;22" dur="1s" begin="0.2s" repeatCount="indefinite"/></circle>',
    'lightning':       '<path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" fill="currentColor" fill-opacity="0.08"/><path d="m13 12-3 5h4l-3 5" stroke-width="1.75"><animate attributeName="stroke-opacity" values="1;1;0.15;1;1;1;0.1;0.8;1;1;1;1;0.12;1" dur="4s" repeatCount="indefinite"/></path>',
    'lightning-rainy': '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" fill="currentColor" fill-opacity="0.06"><animate attributeName="fill-opacity" values="0.06;0.06;0.2;0.06;0.06;0.06;0.15;0.06" dur="3.5s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values="1;1;0.2;1;1;1;0.15;1" dur="3.5s" repeatCount="indefinite"/></path>',
    'partlycloudy':    '<g stroke-opacity="0.5"><animate attributeName="stroke-opacity" values="0.5;0.7;0.5" dur="3s" repeatCount="indefinite"/><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/></g><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><g><animateTransform attributeName="transform" type="translate" values="0,0;0.5,0;0,0;-0.5,0;0,0" dur="7s" repeatCount="indefinite"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" fill="currentColor" fill-opacity="0.08"/></g>',
    'partlycloudy-night': '<path d="M18.376 14.512a6 6 0 0 0 3.461-4.127c.148-.625-.659-.97-1.248-.714a4 4 0 0 1-5.259-5.26c.255-.589-.09-1.395-.716-1.248a6 6 0 0 0-4.594 5.36" fill="currentColor" fill-opacity="0.12"><animate attributeName="fill-opacity" values="0.06;0.22;0.06" dur="4s" repeatCount="indefinite"/></path><g><animateTransform attributeName="transform" type="translate" values="0,0;0.5,0;0,0;-0.5,0;0,0" dur="7s" repeatCount="indefinite"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" fill="currentColor" fill-opacity="0.08"/></g>',
    'pouring':         '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" fill="currentColor" fill-opacity="0.08"/><path d="m9.2 22 3-7" stroke-opacity="0.7"><animate attributeName="stroke-opacity" values="0.7;0.2;0.7" dur="0.7s" repeatCount="indefinite"/></path><path d="m9 13-3 7" stroke-opacity="0.7"><animate attributeName="stroke-opacity" values="0.7;0.2;0.7" dur="0.7s" begin="0.25s" repeatCount="indefinite"/></path><path d="m17 13-3 7" stroke-opacity="0.7"><animate attributeName="stroke-opacity" values="0.7;0.2;0.7" dur="0.7s" begin="0.5s" repeatCount="indefinite"/></path>',
    'rainy':           '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" fill="currentColor" fill-opacity="0.08"/><path d="M16 14v6" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" values="0;-5" dur="1s" repeatCount="indefinite"/></path><path d="M8 14v6" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" values="0;-5" dur="1s" begin="0.35s" repeatCount="indefinite"/></path><path d="M12 16v6" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" values="0;-5" dur="1s" begin="0.7s" repeatCount="indefinite"/></path>',
    'snowy':           '<g><animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="12s" repeatCount="indefinite"/><path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/><path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/><path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/><path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/></g>',
    'snowy-rainy':     '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" fill="currentColor" fill-opacity="0.08"/><circle cx="8" cy="15.5" r="0.5" fill="currentColor" stroke="none"><animate attributeName="cy" values="15;16.5;15" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/></circle><circle cx="8" cy="19.5" r="0.5" fill="currentColor" stroke="none"><animate attributeName="cy" values="19;20.5;19" dur="2.2s" begin="0.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="0.6s" repeatCount="indefinite"/></circle><circle cx="12" cy="17.5" r="0.5" fill="currentColor" stroke="none"><animate attributeName="cy" values="17;18.5;17" dur="1.8s" begin="0.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="1.8s" begin="0.3s" repeatCount="indefinite"/></circle><circle cx="12" cy="21.5" r="0.5" fill="currentColor" stroke="none"><animate attributeName="cy" values="21;22.5;21" dur="2.4s" begin="0.9s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2.4s" begin="0.9s" repeatCount="indefinite"/></circle><circle cx="16" cy="15.5" r="0.5" fill="currentColor" stroke="none"><animate attributeName="cy" values="15;16.5;15" dur="2.1s" begin="0.45s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2.1s" begin="0.45s" repeatCount="indefinite"/></circle><circle cx="16" cy="19.5" r="0.5" fill="currentColor" stroke="none"><animate attributeName="cy" values="19;20.5;19" dur="1.9s" begin="0.75s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="1.9s" begin="0.75s" repeatCount="indefinite"/></circle>',
    'sunny':           '<g><animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="30s" repeatCount="indefinite"/><circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.1"><animate attributeName="fill-opacity" values="0.1;0.18;0.1" dur="3s" repeatCount="indefinite"/><animate attributeName="r" values="4;4.25;4" dur="3s" repeatCount="indefinite"/></circle><g stroke-opacity="1"><animate attributeName="stroke-opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></g></g>',
    'windy':           '<path d="M12.8 19.6A2 2 0 1 0 14 16H2" stroke-dasharray="22" stroke-dashoffset="0"><animate attributeName="stroke-dashoffset" values="0;-3;0" dur="2.5s" repeatCount="indefinite"/></path><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" stroke-dasharray="26" stroke-dashoffset="0"><animate attributeName="stroke-dashoffset" values="0;-4;0" dur="3s" begin="0.3s" repeatCount="indefinite"/></path><path d="M9.8 4.4A2 2 0 1 1 11 8H2" stroke-dasharray="18" stroke-dashoffset="0"><animate attributeName="stroke-dashoffset" values="0;-3;0" dur="2s" begin="0.6s" repeatCount="indefinite"/></path>',
    'windy-variant':   '<path d="M10 2v8" stroke-opacity="0.5"/><path d="M12.8 21.6A2 2 0 1 0 14 18H2" stroke-dasharray="22" stroke-dashoffset="0"><animate attributeName="stroke-dashoffset" values="0;-3;0" dur="2.5s" repeatCount="indefinite"/></path><path d="M17.5 10a2.5 2.5 0 1 1 2 4H2" stroke-dasharray="26" stroke-dashoffset="0"><animate attributeName="stroke-dashoffset" values="0;-4;0" dur="3s" begin="0.3s" repeatCount="indefinite"/></path><g stroke-opacity="0.5"><animate attributeName="stroke-opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite"/><path d="m6 6 4 4 4-4"/></g>',
    'exceptional':     '<g><animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="30s" repeatCount="indefinite"/><circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.1"><animate attributeName="fill-opacity" values="0.1;0.18;0.1" dur="3s" repeatCount="indefinite"/><animate attributeName="r" values="4;4.25;4" dur="3s" repeatCount="indefinite"/></circle><g stroke-opacity="1"><animate attributeName="stroke-opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></g></g>',
    'default':         '<g><animateTransform attributeName="transform" type="translate" values="0,0;0.6,0;0,0;-0.6,0;0,0" dur="6s" repeatCount="indefinite"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="currentColor" fill-opacity="0.08"/></g>'
});
// Colored weather icon glyphs remixed from Meteocons by Bas Milius (https://github.com/basmilius/meteocons), MIT License.
const AWC_COLORED_ICONS = Object.freeze({
    'clear-night':        '<defs><linearGradient id="mo" x1="5" y1="3" x2="15" y2="20" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#86c3db"/><stop offset=".5" stop-color="#86c3db"/><stop offset="1" stop-color="#5eafcf"/></linearGradient></defs><path d="M20.6 13.5A8.6 8.6 0 0 1 11 3.9 8.5 8.5 0 1 0 20.6 13.5Z" fill="url(#mo)" stroke="#72b9d5" stroke-width="0.6" stroke-linejoin="round"><animateTransform attributeName="transform" type="rotate" values="-12 12 12;7 12 12;-12 12 12" dur="6s" repeatCount="indefinite"/></path>',
    'cloudy':             '<g><animateTransform attributeName="transform" type="translate" values="-1 0;1 0;-1 0" dur="6s" repeatCount="indefinite"/><defs><linearGradient id="cl1" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".55" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path d="M18.5 18.5H7a5 5 0 0 1-.4-9.98A7 7 0 0 1 19.6 11h.4a4 4 0 0 1-1.5 7.5Z" fill="url(#cl1)" stroke="#e6effc" stroke-width="0.5" stroke-miterlimit="10"/></g>',
    'fog':                '<defs><linearGradient id="fg" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d4d7dd"/><stop offset=".55" stop-color="#d4d7dd"/><stop offset="1" stop-color="#bec1c6"/></linearGradient></defs><path d="M17 19H8a4 4 0 0 1-.3-7.99A5.5 5.5 0 0 1 18 12.5a3.25 3.25 0 0 1-1 6.5Z" fill="url(#fg)" stroke="#cfd3d9" stroke-width="0.5" stroke-miterlimit="10"/><path d="M5 20.5h10" stroke="#a9aeb6" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="6 3"><animate attributeName="stroke-dashoffset" values="0;9" dur="3s" repeatCount="indefinite"/></path><path d="M8 22.7h10" stroke="#a9aeb6" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="6 3"><animate attributeName="stroke-dashoffset" values="0;-9" dur="4s" repeatCount="indefinite"/></path>',
    'hail':               '<defs><linearGradient id="ha" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".55" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path d="M17 19H8a4 4 0 0 1-.3-7.99A5.5 5.5 0 0 1 18 12.5a3.25 3.25 0 0 1-1 6.5Z" fill="url(#ha)" stroke="#e6effc" stroke-width="0.5" stroke-miterlimit="10"/><g fill="#86c3db" stroke="none"><circle cx="8" cy="21" r="1.1"><animate attributeName="cy" values="19.6;21.4;20.6;21.4" dur="1s" begin="0.0s" repeatCount="indefinite"/></circle><circle cx="12" cy="21" r="1.1"><animate attributeName="cy" values="19.6;21.4;20.6;21.4" dur="1s" begin="0.25s" repeatCount="indefinite"/></circle><circle cx="16" cy="21" r="1.1"><animate attributeName="cy" values="19.6;21.4;20.6;21.4" dur="1s" begin="0.5s" repeatCount="indefinite"/></circle></g>',
    'lightning':          '<defs><linearGradient id="li" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".55" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path d="M17 19H8a4 4 0 0 1-.3-7.99A5.5 5.5 0 0 1 18 12.5a3.25 3.25 0 0 1-1 6.5Z" fill="url(#li)" stroke="#e6effc" stroke-width="0.5" stroke-miterlimit="10"/><defs><linearGradient id="bo" x1="10" y1="13" x2="14" y2="23" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f7b23b"/><stop offset=".5" stop-color="#f7b23b"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><path d="M13.4 13 9.5 18.7h2.7l-2.2 4.6 6.3-7.1h-3.2l2.1-3.2z" fill="url(#bo)" stroke="#f6a823" stroke-width="0.4" stroke-linejoin="round"><animate attributeName="opacity" values="1;1;0.2;1;0.4;1;1" dur="3s" repeatCount="indefinite"/></path>',
    'lightning-rainy':    '<defs><linearGradient id="lr" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".55" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path d="M17 19H8a4 4 0 0 1-.3-7.99A5.5 5.5 0 0 1 18 12.5a3.25 3.25 0 0 1-1 6.5Z" fill="url(#lr)" stroke="#e6effc" stroke-width="0.5" stroke-miterlimit="10"/><g fill="none" stroke="#0b65ed" stroke-width="1.5" stroke-linecap="round"><path d="M8 19.4 8 21.8"><animate attributeName="opacity" values="1;0.2;1" dur="0.9s" begin="0.0s" repeatCount="indefinite"/></path><path d="M16 19.4 16 21.8"><animate attributeName="opacity" values="1;0.2;1" dur="0.9s" begin="0.3s" repeatCount="indefinite"/></path></g><defs><linearGradient id="bo" x1="10" y1="13" x2="14" y2="23" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f7b23b"/><stop offset=".5" stop-color="#f7b23b"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><path d="M13.4 13 9.5 18.7h2.7l-2.2 4.6 6.3-7.1h-3.2l2.1-3.2z" fill="url(#bo)" stroke="#f6a823" stroke-width="0.4" stroke-linejoin="round"><animate attributeName="opacity" values="1;1;0.2;1;0.4;1;1" dur="3s" repeatCount="indefinite"/></path>',
    'partlycloudy':       '<defs><linearGradient id="su2" x1="6" y1="3" x2="11" y2="12" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fbbf24"/><stop offset=".5" stop-color="#fbbf24"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><g><animateTransform attributeName="transform" type="rotate" values="0 9 8;45 9 8" dur="6s" repeatCount="indefinite"/><path d="M9 1.8v1.6M9 12.6v1.6M14.2 8h1.6M2.2 8h1.6M12.7 4.3l1.1-1.1M4.2 11.8l1.1-1.1M5.3 4.3 4.2 3.2M13.8 11.8l-1.1-1.1" fill="none" stroke="#fbbf24" stroke-width="1.3" stroke-linecap="round"/><circle cx="9" cy="8" r="3" fill="url(#su2)" stroke="#f8af18" stroke-width="0.5"/></g><g><animateTransform attributeName="transform" type="translate" values="-0.8 0;0.8 0;-0.8 0" dur="7s" repeatCount="indefinite"/><defs><linearGradient id="cl2" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".55" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path d="M17 19H8a4 4 0 0 1-.3-7.99A5.5 5.5 0 0 1 18 12.5a3.25 3.25 0 0 1-1 6.5Z" fill="url(#cl2)" stroke="#e6effc" stroke-width="0.5" stroke-miterlimit="10"/></g>',
    'partlycloudy-night': '<defs><linearGradient id="mo2" x1="4" y1="2" x2="12" y2="14" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#86c3db"/><stop offset=".5" stop-color="#86c3db"/><stop offset="1" stop-color="#5eafcf"/></linearGradient></defs><path d="M13.8 8.8A5.5 5.5 0 0 1 8.3 3.3 5.4 5.4 0 1 0 13.8 8.8Z" fill="url(#mo2)" stroke="#72b9d5" stroke-width="0.5" stroke-linejoin="round"><animateTransform attributeName="transform" type="rotate" values="-10 9 7;6 9 7;-10 9 7" dur="6s" repeatCount="indefinite"/></path><g><animateTransform attributeName="transform" type="translate" values="-0.8 0;0.8 0;-0.8 0" dur="7s" repeatCount="indefinite"/><defs><linearGradient id="cl3" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".55" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path d="M17 19H8a4 4 0 0 1-.3-7.99A5.5 5.5 0 0 1 18 12.5a3.25 3.25 0 0 1-1 6.5Z" fill="url(#cl3)" stroke="#e6effc" stroke-width="0.5" stroke-miterlimit="10"/></g>',
    'pouring':            '<defs><linearGradient id="po" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".55" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path d="M17 19H8a4 4 0 0 1-.3-7.99A5.5 5.5 0 0 1 18 12.5a3.25 3.25 0 0 1-1 6.5Z" fill="url(#po)" stroke="#e6effc" stroke-width="0.5" stroke-miterlimit="10"/><g fill="none" stroke="#0b65ed" stroke-width="1.6" stroke-linecap="round"><path d="M8 18.8 6.8 22.6"><animate attributeName="opacity" values="1;0.2;1" dur="0.7s" begin="0.0s" repeatCount="indefinite"/></path><path d="M11 18.8 9.8 22.6"><animate attributeName="opacity" values="1;0.2;1" dur="0.7s" begin="0.18s" repeatCount="indefinite"/></path><path d="M14 18.8 12.8 22.6"><animate attributeName="opacity" values="1;0.2;1" dur="0.7s" begin="0.36s" repeatCount="indefinite"/></path><path d="M17 18.8 15.8 22.6"><animate attributeName="opacity" values="1;0.2;1" dur="0.7s" begin="0.54s" repeatCount="indefinite"/></path></g>',
    'rainy':              '<defs><linearGradient id="rn" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".55" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path d="M17 19H8a4 4 0 0 1-.3-7.99A5.5 5.5 0 0 1 18 12.5a3.25 3.25 0 0 1-1 6.5Z" fill="url(#rn)" stroke="#e6effc" stroke-width="0.5" stroke-miterlimit="10"/><g fill="none" stroke="#0b65ed" stroke-width="1.6" stroke-linecap="round"><path d="M8 19.4 8 22.2"><animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.0s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 -1;0 1;0 -1" dur="1s" begin="0.0s" repeatCount="indefinite" additive="sum"/></path><path d="M12 19.4 12 22.2"><animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.3s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 -1;0 1;0 -1" dur="1s" begin="0.3s" repeatCount="indefinite" additive="sum"/></path><path d="M16 19.4 16 22.2"><animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.6s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 -1;0 1;0 -1" dur="1s" begin="0.6s" repeatCount="indefinite" additive="sum"/></path></g>',
    'snowy':              '<defs><linearGradient id="sn" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".55" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path d="M17 19H8a4 4 0 0 1-.3-7.99A5.5 5.5 0 0 1 18 12.5a3.25 3.25 0 0 1-1 6.5Z" fill="url(#sn)" stroke="#e6effc" stroke-width="0.5" stroke-miterlimit="10"/><g fill="#86c3db" stroke="none"><circle cx="8" cy="20.6" r="1"><animate attributeName="cy" values="19.8;21.400000000000002;19.8" dur="2.2s" begin="0.0s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="0.0s" repeatCount="indefinite"/></circle><circle cx="12" cy="21.8" r="1"><animate attributeName="cy" values="21.0;22.6;21.0" dur="2.2s" begin="0.35s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="0.35s" repeatCount="indefinite"/></circle><circle cx="16" cy="20.6" r="1"><animate attributeName="cy" values="19.8;21.400000000000002;19.8" dur="2.2s" begin="0.7s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="0.7s" repeatCount="indefinite"/></circle><circle cx="10" cy="22.8" r="1"><animate attributeName="cy" values="22.0;23.6;22.0" dur="2.2s" begin="1.05s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="1.05s" repeatCount="indefinite"/></circle><circle cx="14" cy="22.8" r="1"><animate attributeName="cy" values="22.0;23.6;22.0" dur="2.2s" begin="1.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="1.4s" repeatCount="indefinite"/></circle></g>',
    'snowy-rainy':        '<defs><linearGradient id="sr" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".55" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path d="M17 19H8a4 4 0 0 1-.3-7.99A5.5 5.5 0 0 1 18 12.5a3.25 3.25 0 0 1-1 6.5Z" fill="url(#sr)" stroke="#e6effc" stroke-width="0.5" stroke-miterlimit="10"/><g fill="#86c3db" stroke="none"><circle cx="8" cy="20.6" r="1"><animate attributeName="cy" values="19.8;21.4;19.8" dur="2.2s" begin="0.0s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="0.0s" repeatCount="indefinite"/></circle><circle cx="14" cy="20.6" r="1"><animate attributeName="cy" values="19.8;21.4;19.8" dur="2.2s" begin="0.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2.2s" begin="0.4s" repeatCount="indefinite"/></circle></g><g fill="none" stroke="#0b65ed" stroke-width="1.5" stroke-linecap="round"><path d="M11 19.8 11 22.4"><animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.0s" repeatCount="indefinite"/></path><path d="M17 19.8 17 22.4"><animate attributeName="opacity" values="1;0.2;1" dur="1s" begin="0.3s" repeatCount="indefinite"/></path></g>',
    'sunny':              '<defs><linearGradient id="su" x1="8" y1="6" x2="14" y2="17" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fbbf24"/><stop offset=".5" stop-color="#fbbf24"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><g><animateTransform attributeName="transform" type="rotate" values="0 12 12;45 12 12" dur="6s" repeatCount="indefinite"/><path d="M12 2.5v2M12 19.5v2M19.5 12h2M2.5 12h2M17.3 6.7l1.4-1.4M5.3 18.7l1.4-1.4M6.7 6.7 5.3 5.3M18.7 18.7l-1.4-1.4" fill="none" stroke="#fbbf24" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="4.2" fill="url(#su)" stroke="#f8af18" stroke-width="0.6"/></g>',
    'windy':              '<g fill="none" stroke="#9aa3ae" stroke-width="1.7" stroke-linecap="round"><path d="M3 9h11a2.4 2.4 0 1 0-2.4-2.4"><animate attributeName="stroke-dashoffset" values="0;-3;0" dur="3s" repeatCount="indefinite"/></path><path d="M3 13h15a2.6 2.6 0 1 1-2.6 2.6"><animate attributeName="stroke-dashoffset" values="0;-4;0" dur="2.6s" begin="0.3s" repeatCount="indefinite"/></path><path d="M3 17h9a2.2 2.2 0 1 0-2.2 2.2"><animate attributeName="stroke-dashoffset" values="0;-3;0" dur="2.2s" begin="0.6s" repeatCount="indefinite"/></path></g>',
    'windy-variant':      '<g fill="none" stroke="#9aa3ae" stroke-width="1.7" stroke-linecap="round"><path d="M3 9h11a2.4 2.4 0 1 0-2.4-2.4"><animate attributeName="stroke-dashoffset" values="0;-3;0" dur="3s" repeatCount="indefinite"/></path><path d="M3 13h15a2.6 2.6 0 1 1-2.6 2.6"><animate attributeName="stroke-dashoffset" values="0;-4;0" dur="2.6s" begin="0.3s" repeatCount="indefinite"/></path><path d="M3 17h9a2.2 2.2 0 1 0-2.2 2.2"><animate attributeName="stroke-dashoffset" values="0;-3;0" dur="2.2s" begin="0.6s" repeatCount="indefinite"/></path></g>',
    'exceptional':        '<defs><linearGradient id="su" x1="8" y1="6" x2="14" y2="17" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fbbf24"/><stop offset=".5" stop-color="#fbbf24"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><g><animateTransform attributeName="transform" type="rotate" values="0 12 12;45 12 12" dur="6s" repeatCount="indefinite"/><path d="M12 2.5v2M12 19.5v2M19.5 12h2M2.5 12h2M17.3 6.7l1.4-1.4M5.3 18.7l1.4-1.4M6.7 6.7 5.3 5.3M18.7 18.7l-1.4-1.4" fill="none" stroke="#fbbf24" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="4.2" fill="url(#su)" stroke="#f8af18" stroke-width="0.6"/></g>',
    'default':            '<g><animateTransform attributeName="transform" type="translate" values="-1 0;1 0;-1 0" dur="6s" repeatCount="indefinite"/><defs><linearGradient id="cl1" x1="7" y1="4" x2="14" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".55" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path d="M18.5 18.5H7a5 5 0 0 1-.4-9.98A7 7 0 0 1 19.6 11h.4a4 4 0 0 1-1.5 7.5Z" fill="url(#cl1)" stroke="#e6effc" stroke-width="0.5" stroke-miterlimit="10"/></g>'
});
function parseCSSVal(v) {
    const s = String(v).trim(); if (!s || s === '0') return '0px';
    return /[%a-z]/i.test(s) ? s : s + 'px';
}
function parseAnchor(anchor) {
    if (anchor === 'center') return ['center', 'center']; if (anchor === 'left') return ['center', 'left'];
    if (anchor === 'right') return ['center', 'right'];
    return anchor.includes('-') ? anchor.split('-') : ['top', anchor];
}
function computeGauge(rawVal, min, max, colorRaw, thresholds, mode) {
    const range = max - min || 1;
    const progress = isNaN(rawVal) ? 0 : Math.max(0, Math.min(1, (rawVal - min) / range));
    const pct = (progress * 100).toFixed(1);
    const baseColor = (colorRaw && colorRaw !== 'auto') ? colorRaw : '';
    const valid = thresholds.filter(t => t.value !== '' && t.value !== undefined && t.color);
    let gradient = '', barGradient = '', hasSegments = false, effectiveColor = baseColor;
    if (valid.length && !isNaN(rawVal) && (mode === 'segments' || mode === 'gradient')) {
        const sorted = [...valid].sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
        const toPct = (v) => (Math.max(0, Math.min(1, (parseFloat(v) - min) / range)) * 100).toFixed(1);
        const stops = [], barStops = [];
        for (let i = 0; i < sorted.length; i++) {
            const t = sorted[i], startPct = toPct(t.value);
            const endPct = i < sorted.length - 1 ? toPct(sorted[i + 1].value) : '100';
            if (mode === 'segments') {
                stops.push(`${t.color} ${startPct}%`, `${t.color} ${endPct}%`);
                if (progress > 0) {
                    const bStart = (parseFloat(startPct) / (progress * 100) * 100).toFixed(1);
                    const bEnd = (parseFloat(endPct) / (progress * 100) * 100).toFixed(1);
                    barStops.push(`${t.color} ${bStart}%`, `${t.color} ${bEnd}%`);
                }
            } else {
                stops.push(`${t.color} ${startPct}%`);
                if (progress > 0) {
                    const bStart = (parseFloat(startPct) / (progress * 100) * 100).toFixed(1);
                    barStops.push(`${t.color} ${bStart}%`);
                }
            }
        }
        if (stops.length) { hasSegments = true; gradient = stops.join(', '); }
        if (barStops.length) { barGradient = barStops.join(', '); }
    }
    if (valid.length && !isNaN(rawVal) && mode === 'solid') {
        const sorted = [...valid].sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
        for (const t of sorted) { if (rawVal >= parseFloat(t.value)) effectiveColor = t.color; }
    }
    return { pct, gradient, barGradient, hasSegments, effectiveColor };
}
function fcFilterPast(raw, daily) {
    const now = new Date(), cut = daily ? new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() : now.getTime();
    return raw.filter(f => Date.parse(f.datetime) >= cut);
}
function fcFingerprint(fc) {
    if (!fc || !fc.length) return ''; let s = '' + fc.length;
    for (const f of fc) s += `|${f.datetime}|${f.condition}|${f.temperature}|${f.templow != null ? f.templow : ''}|${f.precipitation_probability != null ? f.precipitation_probability : ''}`;
    return s;
}
function fcLabel(dt, daily, locale) {
    const d = new Date(dt);
    return daily ? d.toLocaleDateString(locale, { weekday: 'short' }) : d.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
}
const _AWC_FC_CACHE = new Map();
const _AWC_FC_CACHE_MAX = 50;
const _FC_UNIT_MAP = { temperature: 'temperature_unit', templow: 'temperature_unit', wind_speed: 'wind_speed_unit', precipitation: 'precipitation_unit', pressure: 'pressure_unit', visibility: 'visibility_unit', dew_point: 'temperature_unit' };
const _FC_UNIT_FALLBACK = { humidity: '%', precipitation_probability: '%', cloud_coverage: '%', wind_bearing: '°', uv_index: '' };
const POS_CLASSES = Object.freeze(['pos-top-left','pos-top-center','pos-top-right','pos-left','pos-center','pos-right','pos-bottom-left','pos-bottom-center','pos-bottom-right']);

class AtmosphericWeatherCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._animId = null;
        this._boundAnimate = this._animate.bind(this);
        this._lastFrameTime = 0;
        this._frameInterval = 1000 / 24;
        this._weatherState = 'default';
        this._isTimeNight = false;
        this._isThemeDark = false;
        this._lastState = null;
        this._stateInitialized = false;
        this._hasReceivedFirstHass = false;
        this._windKmh = 0;
        this._initialized = false;
        this._initializationComplete = false;
        this._isVisible = false;
        this._intersectionObserver = null;
        this._renderGate = { hasValidDimensions: false, hasFirstHass: false };
        this._resizeDebounceTimer = null;
        this._cachedDimensions = { width: 0, height: 0, dpr: 1 };
        this._lastInitWidth = 0;
        this._lastSnapshot = null;
        this._prevStyleSig = null;
        this._prevCcSig = null;
        this._prevWeatherClass = null;
        this._prevBottomFade = null;
        this._prevCardPadParsed = null;
        this._entityErrors = new Map();
        this._lastErrorLog = 0;
        this._hass = null;
        this._customCardElements = [];
        this._prevCustomCssClasses = null;
        this._boundVisibilityChange = this._handleVisibilityChange.bind(this);
        this._boundTap = this._handleTap.bind(this);
        this._boundDocVisibility = this._handleDocVisibility.bind(this);
        this._fcData = new Map();
        this._fcSubs = new Map();
        this._fcFmtCache = null;
        this._gl = null;
        this._glProg = null;
        this._glUniforms = null;
        this._shaderParams = null;
        this._shaderBank = null;
        this._activeShaderKey = null;
        this._glBuf = null;
        this._prevShaderParams = null;
        this._prevFxSpeed = null;
        this._glNoiseTex = null;
        this._glSeed = Math.random() * 1000;
        this._starHeroes = null;
        this._starDpr = 1;
        this._starMasterOpacity = 0;
        this._starBgCtx = null;
        this._starCtx = null;
        this._starBgPainted = false;
        this._currentBakedStarCount = 0;
        this._starsDirty = false;
        this._shootingStars = [];
        this._comets = [];
        this._weatherBgActive = false;
        this._weatherBgState = null;
        this._weatherBgDark = null;
        this._weatherBgResolved = null;
        this._simpleBgActive = false;
        this._simpleBgDark = null;
    }
    connectedCallback() {
        if (!this._resizeObserver) {
            this._resizeObserver = new ResizeObserver((entries) => {
                if (!entries.length) return;
                const entry = entries[0]; let w, h;
                if (entry.borderBoxSize && entry.borderBoxSize[0]) {
                    w = entry.borderBoxSize[0].inlineSize; h = entry.borderBoxSize[0].blockSize;
                } else {
                    w = entry.target.offsetWidth; h = entry.target.offsetHeight;
                }
                const changed = this._updateCanvasDimensions(w, h);
                if (!this._initializationComplete) {
                    this._tryInitialize();
                } else if (changed) {
                    this._scheduleResize();
                }
            });
        }
        if (!this._intersectionObserver) {
            this._intersectionObserver = new IntersectionObserver(this._boundVisibilityChange, { threshold: 0.01, rootMargin: '0px' });
        }
        if (this._elements && this._elements.root) {
            this._resizeObserver.observe(this._elements.root); this.addEventListener('click', this._boundTap);
            this._intersectionObserver.observe(this._elements.root);
        }
        document.addEventListener('visibilitychange', this._boundDocVisibility);
        if (this._initializationComplete) {
            this._startAnimation();
        } else if (this._renderGate.hasFirstHass) {
            this._tryInitialize();
        }
    }
    disconnectedCallback() {
        this._stopAnimation(); if (this._resizeObserver) this._resizeObserver.disconnect(); if (this._intersectionObserver) this._intersectionObserver.disconnect();
        if (this._marqueeObserver) this._marqueeObserver.disconnect(); this._marqueeObserver = null; for (const unsub of this._fcSubs.values()) unsub();
        this._fcSubs.clear();
        if (this._resizeDebounceTimer) {
            clearTimeout(this._resizeDebounceTimer); this._resizeDebounceTimer = null;
        }
        this._destroyGL();
        this._isVisible = false; this.removeEventListener('click', this._boundTap); document.removeEventListener('visibilitychange', this._boundDocVisibility); this._customCardElements = []; this._initializationComplete = false; this._lastSnapshot = null; this._starHeroes = null; this._starDpr = 1; this._starMasterOpacity = 0; this._starCtx = null; this._starBgCtx = null; this._starBgPainted = false; this._shootingStars = []; this._comets = [];
    }
    setConfig(config) {
        const prevAreaCount = this._areas ? this._areas.length : -1;
        this._config = config; this._areas = this._deriveAreas(this._config); this._allButtonsCache = null;
        if (this._areas.length !== prevAreaCount) this._areaRenderCache = null;
        this._initDOM();

        if (String(config.card_height).toLowerCase() === 'auto') {
            this.style.height = '100%'; this.style.minHeight = '0'; this.style.aspectRatio = 'auto';
        } else {
            const heightConfig = config.card_height || '200px';
            const cssHeight = typeof heightConfig === 'number' ? `${heightConfig}px` : heightConfig;
            this.style.height = cssHeight; this.style.minHeight = cssHeight; this.style.aspectRatio = 'auto';
        }
        if (this._elements && this._elements.imageSlot) {
            const slot = this._elements.imageSlot;
            const scale = config.image_scale !== undefined ? config.image_scale : 100;
            slot.style.height = `${scale}%`;
            const align = (config.image_alignment || 'top-right').toLowerCase(); slot.style.top = ''; slot.style.bottom = '';
            slot.style.left = ''; slot.style.right = ''; slot.style.transform = '';
            const padH = 'var(--_awc-pad-h, var(--awc-card-padding, var(--ha-space-4, 16px)))';
            const padV = 'var(--_awc-pad-v, var(--awc-card-padding, var(--ha-space-4, 16px)))';
            const [v, h] = align === 'center' ? ['center', 'center'] : align.split('-');
            const t = [];
            if (h === 'left') {
                slot.style.left = padH; slot.style.right = 'auto';
            } else if (h === 'center') {
                slot.style.left = '50%'; slot.style.right = 'auto'; t.push('translateX(-50%)');
            } else {
                slot.style.right = padH; slot.style.left = 'auto';
            }
            if (v === 'top') {
                slot.style.top = padV; slot.style.bottom = 'auto';
            } else if (v === 'center') {
                slot.style.top = '50%'; slot.style.bottom = 'auto'; t.push('translateY(-50%)');
            } else {
                slot.style.bottom = padV; slot.style.top = 'auto';
            }
            slot.style.transform = t.join(' ');
            const ox = config.image_x !== undefined ? String(config.image_x).trim() : '';
            const oy = config.image_y !== undefined ? String(config.image_y).trim() : '';
            if (ox || oy) {
                // Positive offset always increases the gap from the anchored edge.
                const flip = o => o.startsWith('-') ? o.slice(1) : `-${o}`;
                const unit = o => /[%a-z]/i.test(o) ? o : o + 'px';
                const oxe = ox && h === 'right' ? flip(ox) : ox;
                const oye = oy && v === 'bottom' ? flip(oy) : oy;
                const tx2 = oxe ? `translateX(${unit(oxe)})` : '';
                const ty2 = oye ? `translateY(${unit(oye)})` : '';
                const extra = [tx2, ty2].filter(Boolean).join(' ');
                slot.style.transform = t.length ? `${t.join(' ')} ${extra}` : extra;
            }
        }
        const root = this._elements.root;

        const hasTapAction = config.card_tap_action && config.card_tap_action.action && config.card_tap_action.action !== 'none';
        root.classList.toggle('clickable', !!hasTapAction);
        this._hasStatusFeature = !!(config.status_entity && (config.status_day || config.status_night)); this._customCardElements = []; this._prevCcSig = null;
        if (this._elements && this._elements.customCardsWrapper) {
            this._elements.customCardsWrapper.innerHTML = '';
            this._elements.customCardsWrapper.classList.toggle('has-cards', false);
            if (this._prevCustomCssClasses && this._prevCustomCssClasses.length) this._elements.customCardsWrapper.classList.remove(...this._prevCustomCssClasses);
            const userClasses = (config.custom_cards_css_class || '').split(' ').filter(Boolean);
            this._prevCustomCssClasses = userClasses.length ? userClasses : null;
            if (userClasses.length) this._elements.customCardsWrapper.classList.add(...userClasses);
        }
        const customCards = this._config.custom_cards;
        if (Array.isArray(customCards) && customCards.length > 0 && this._elements && this._elements.customCardsWrapper) {
            this._elements.customCardsWrapper.classList.add('has-cards'); const expectedConfig = this._config;
            window.loadCardHelpers().then(helpers => {
                const wrapper = this._elements && this._elements.customCardsWrapper; if (!wrapper) return; if (this._config !== expectedConfig) return;
                for (const cardConfig of customCards) {
                    if (!cardConfig || !cardConfig.type) continue; const el = helpers.createCardElement(cardConfig);
                    if (cardConfig.custom_width) {
                        el.style.width = cardConfig.custom_width; el.style.flex = 'none';
                    }
                    if (cardConfig.custom_height !== undefined) {
                        let ch = String(cardConfig.custom_height).trim(); if (!isNaN(ch) && ch !== '') ch += 'px'; el.style.height = ch;
                    }
                    this._customCardElements.push(el); wrapper.appendChild(el); if (this._hass) el.hass = this._hass;
                }
            });
        }
        this._lastSnapshot = null;
        this._prevCardPadParsed = null;
        this._nativeIconCache = null;
        this._areaStyleCache = null;
        for (const c of this._allButtons()) {
            if (c.forecast && c.entity) {
                const k = `${c.entity}|${c.forecast === 'hourly' ? 'hourly' : 'daily'}`;
                if (!this._fcData.has(k) && _AWC_FC_CACHE.has(k)) {
                    this._fcData.set(k, _AWC_FC_CACHE.get(k));
                }
            }
        }
        this._syncFc();
        this._weatherBgState = null;
        this._simpleBgDark = null;
        if (this._config.simple_background !== true && this._elements && this._elements.root) {
            this._elements.root.classList.remove('has-simple-bg');
            this._simpleBgActive = false;
        }
        this._applyConfigStyles();
        const disabled = this._areShadersDisabled();
        this._applyShaderDisabledState(disabled);
        if (disabled) { this._stopAnimation(); } else if (this._initializationComplete && this._isVisible) {
            if (!this._gl) this._initWebGL();
            this._startAnimation();
        }
    }
    set hass(hass) {
        if (!hass || !this._config) return; this._hass = hass;
        if (this._customCardElements.length > 0) { for (const child of this._customCardElements) child.hass = hass; }
        const cfg = this._config;
        const wObj = (cfg.weather_entity && hass.states[cfg.weather_entity]) || null;
        const sunObj = cfg.sun_entity ? hass.states[cfg.sun_entity] : null;
        const statusObj = cfg.status_entity ? hass.states[cfg.status_entity] : null;
        const themeObj = cfg.theme_entity ? hass.states[cfg.theme_entity] : null;
        if (this._lastSnapshot) {
            let changed = wObj !== this._refW || sunObj !== this._refSun
                || statusObj !== this._refStatus || themeObj !== this._refTheme;
            if (!changed) {
                const allButtons = this._allButtons();
                for (const s of allButtons) {
                    if (s.entity && hass.states[s.entity] !== (this._refButtonEntities ? this._refButtonEntities.get(s.entity) : undefined)) { changed = true; break; }
                    if (s.name_sensor && hass.states[s.name_sensor] !== (this._refButtonEntities ? this._refButtonEntities.get(s.name_sensor) : undefined)) { changed = true; break; }
                    if (s.sub_value_entity && hass.states[s.sub_value_entity] !== (this._refButtonEntities ? this._refButtonEntities.get(s.sub_value_entity) : undefined)) { changed = true; break; }
                    const condEntities = this._collectConditionEntities(s.visibility);
                    for (const ve of condEntities) { if (hass.states[ve] !== (this._refButtonEntities ? this._refButtonEntities.get(ve) : undefined)) { changed = true; break; } }
                    if (changed) break;
                }
            }
            if (!changed) return;
        }
        this._refW = wObj; this._refSun = sunObj; this._refStatus = statusObj; this._refTheme = themeObj;
        const refs = new Map(), allButtons = this._allButtons();
        for (const s of allButtons) {
            if (s.entity) refs.set(s.entity, hass.states[s.entity]);
            if (s.name_sensor) refs.set(s.name_sensor, hass.states[s.name_sensor]);
            if (s.sub_value_entity) refs.set(s.sub_value_entity, hass.states[s.sub_value_entity]);
            for (const ve of this._collectConditionEntities(s.visibility)) refs.set(ve, hass.states[ve]);
        }
        this._refButtonEntities = refs;
        const wEntity = wObj || FALLBACK_WEATHER;
        const sunEntity = sunObj;
        const statusEntity = statusObj;
        const themeEntity = themeObj;
        const haThemeDark = (hass.themes && hass.themes.darkMode) ? 'dark' : 'light';
        const botSig = allButtons.map(s => {
            if (!s.entity) return '';
            if (s.forecast) {
                const t = s.forecast === 'hourly' ? 'hourly' : 'daily';
                const fd = this._fcData.get(`${s.entity}|${t}`);
                return `fc:${s.entity}|${t}:${s.forecast_offset || 0}:${s.attribute || ''}:${(fd && fd.fp) || ''}`;
            }
            const e = hass.states[s.entity]; let sig; if (!e) sig = '|';
            else if (s.attribute) sig = `${e.attributes[s.attribute] != null ? e.attributes[s.attribute] : ''}|${e.attributes[`${s.attribute}_unit`] != null ? e.attributes[`${s.attribute}_unit`] : ''}`;
            else sig = `${e.state}|${e.attributes.unit_of_measurement || ''}`;
            if (s.name_sensor) {
                const ns = hass.states[s.name_sensor];
                if (ns) sig += `|ns:${s.name_attribute ? (ns.attributes[s.name_attribute] != null ? ns.attributes[s.name_attribute] : '') : ns.state}`;
            }
            if (s.sub_value_entity) {
                const sv = hass.states[s.sub_value_entity];
                if (sv) sig += `|sv:${s.sub_value_attribute ? (sv.attributes[s.sub_value_attribute] != null ? sv.attributes[s.sub_value_attribute] : '') : sv.state}`;
            }
            if (Array.isArray(s.visibility) && s.visibility.length) {
                for (const ve of this._collectConditionEntities(s.visibility)) {
                    const ves = hass.states[ve];
                    sig += `|vi:${ve}:${ves ? ves.state : ''}`;
                }
            }
            return sig;
        }).join('||');
        const lang = (hass.locale && hass.locale.language) || 'en';
        const snapshot = {
            weather: (wEntity && wEntity.state) || '',
            temp: (wEntity && wEntity.attributes && wEntity.attributes.temperature != null) ? wEntity.attributes.temperature : '',
            windSpeed: (wEntity && wEntity.attributes && wEntity.attributes.wind_speed != null) ? wEntity.attributes.wind_speed : '',
            windUnit: (wEntity && wEntity.attributes && wEntity.attributes.wind_speed_unit) || '',
            sun: (sunEntity && sunEntity.state) || '',
            sunElev: (sunEntity && sunEntity.attributes && sunEntity.attributes.elevation != null) ? sunEntity.attributes.elevation : '',
            theme: (themeEntity && themeEntity.state) || '',
            haThemeDark,
            status: (statusEntity && statusEntity.state) || '',
            botSig,
            lang
        };
        if (this._lastSnapshot && !this._hasSnapshotChanged(this._lastSnapshot, snapshot)) return;
        this._lastSnapshot = snapshot;
        if (!wEntity) return;
        const isNight = this._resolveAxes(sunEntity).isNight;
        const hasNightChanged = this._isTimeNight !== isNight;
        this._isTimeNight = isNight;
        const colorMode = (cfg.card_color_mode || '').toLowerCase();
        let themeDark;
        if (colorMode === 'light') {
            themeDark = false;
        } else if (colorMode === 'dark') {
            themeDark = true;
        } else if (colorMode === 'ha_theme') {
            themeDark = !!(hass.themes && hass.themes.darkMode);
        } else if (cfg.theme_entity) {
            const te = themeEntity || sunEntity;
            themeDark = te ? te.state.toLowerCase() === 'below_horizon' : isNight;
        } else {
            themeDark = isNight;
        }
        const hasDarkChanged = this._isThemeDark !== themeDark;
        this._isThemeDark = themeDark;
        const adaptEnabled = cfg.theme_adapt !== false;
        const dashDark = !!(hass.themes && hass.themes.darkMode);
        let adaptMode = '';
        if (adaptEnabled) {
            if (dashDark && !themeDark) adaptMode = 'dim';
            else if (!dashDark && themeDark) adaptMode = 'lift';
        }
        if (this._prevAdaptMode !== adaptMode) {
            this._prevAdaptMode = adaptMode;
            if (this._elements) {
                this._elements.root.classList.toggle('adapt-dim', adaptMode === 'dim');
                this._elements.root.classList.toggle('adapt-lift', adaptMode === 'lift');
            }
        }
        let weatherState = (wEntity.state || 'default').toLowerCase();
        if (isNight && weatherState === 'sunny') weatherState = 'clear-night';
        if (!isNight && weatherState === 'clear-night') weatherState = 'sunny';
        if (weatherState === 'exceptional' && isNight) weatherState = 'clear-night';
        this._weatherState = weatherState;
        this._updateSchemeStyles(isNight, weatherState); this._updateTextElements(hass, wEntity, lang, weatherState);
        const windSpeedRaw = this._getEntityAttribute(wEntity, 'wind_speed', 0);
        const windSpeed = typeof windSpeedRaw === 'number' ? windSpeedRaw : parseFloat(windSpeedRaw) || 0;
        const wsu = ((wEntity && wEntity.attributes && wEntity.attributes.wind_speed_unit) || 'km/h').toLowerCase();
        const toKmh = wsu.includes('m/s') ? 3.6 : wsu.includes('mph') ? 1.609 : wsu.includes('kn') ? 1.852 : 1;
        this._windKmh = windSpeed * toKmh;
        this._updateImage(hass, isNight, weatherState);
        this._updateStars(null, weatherState);
        this._updateWeatherBg(weatherState, themeDark);
        this._updateSimpleBg(themeDark);
        if (!this._hasReceivedFirstHass) {
            this._hasReceivedFirstHass = true; this._renderGate.hasFirstHass = true; this._lastState = weatherState;
            this._stateInitialized = true; this._shaderParams = this._weatherToUniforms();
            this._syncFc(); this._tryInitialize();
            return;
        }
        this._handleWeatherChange(weatherState, hasNightChanged || hasDarkChanged);
    }
    static async getConfigElement() {
        if (!customElements.get("atmospheric-weather-card-editor"))
        { await import("./atmospheric-weather-card-editor.js?v=AWC-28062026"); }
        return document.createElement("atmospheric-weather-card-editor");
    }
    static getStubConfig(hass) {
        const weatherEntity = hass ? Object.keys(hass.states).find(e => e.startsWith('weather.')) || '' : '';
        return {
            weather_entity: weatherEntity,
            sun_entity: 'sun.sun',
            theme_entity: 'sun.sun',
            card_height: '130px',
            button_areas: [
                {
                    position: 'top-left',
                    padding: '0 4px',
                    buttons: [
                        { entity: weatherEntity, text_size: '30px', hide_icon: true, padding: '0px 4px', fancy_unit: true }
                    ]
                },
                {
                    position: 'right',
                    padding: '0px 8px',
                    gap: '8px',
                    background: true,
                    buttons: [
                        {
                            entity: weatherEntity,
                            hide_value: true,
                            icon: 'weather',
                            icon_size: '34px',
                            type: 'ring',
                            ring_thresholds: [
                                { value: '0', color: 'rgba(128, 191, 172, 0.8)' },
                                { value: '1', color: 'rgba(145, 199, 163, 0.8)' },
                                { value: '2', color: 'rgba(163, 206, 155, 0.8)' },
                                { value: '3', color: 'rgba(195, 214, 141, 0.8)' },
                                { value: '4', color: 'rgba(224, 219, 129, 0.8)' },
                                { value: '5', color: 'rgba(235, 198, 113, 0.8)' },
                                { value: '6', color: 'rgba(235, 168, 103, 0.8)' },
                                { value: '7', color: 'rgba(230, 138, 99, 0.8)' },
                                { value: '8', color: 'rgba(219, 106, 99, 0.8)' },
                                { value: '9', color: 'rgba(201, 79, 100, 0.8)' },
                                { value: '10', color: 'rgba(168, 64, 115, 0.8)' }
                            ],
                            padding: '14px',
                            ring_gap: '10px',
                            ring_width: '4px',
                            ring_threshold_mode: 'gradient',
                            ring_max: '11',
                            attribute: 'uv_index'
                        }
                    ]
                },
                {
                    position: 'bottom-left',
                    background: true,
                    button_text_size: '14px',
                    align: 'center',
                    buttons: [
                        {
                            text_size: '12px',
                            sub_value_size: '12px',
                            label_size: '12px',
                            hide_icon: true,
                            padding: '8px 12px',
                            value_weight: '700',
                            text_gap: '5px',
                            entity: weatherEntity,
                            name: 'Today: ',
                            forecast: 'daily',
                            attribute: 'temperature',
                            forecast_precision: 0,
                            sub_value_attribute: 'templow',
                            text_order: 'label,sub,value',
                            sub_value_format: ' –',
                            sub_value_weight: '700'
                        }
                    ]
                }
            ],
            grid_options: { rows: 'auto' }
        };
    }
    getCardSize() { return 4; }
    getGridOptions() {
        return { columns: 12, rows: 'auto', min_columns: 2, min_rows: 2 };
    }
    _deriveAreas(config) {
        const arr = config && config.button_areas;
        if (Array.isArray(arr) && arr.length > 0) {
            return arr.map(a => {
                if (!a || typeof a !== 'object') return { buttons: [] };
                const buttons = Array.isArray(a.buttons)
                    ? a.buttons.map(s => {
                        if (!s || typeof s !== 'object') return {};
                        const c = { ...s };
                        c._ringThresholdsSig = JSON.stringify(s.ring_thresholds || '');
                        c._barThresholdsSig = JSON.stringify(s.bar_thresholds || '');
                        c._colorThresholdsSig = JSON.stringify(s.color_thresholds || '');
                        return c;
                    })
                    : [];
                return { ...a, buttons };
            });
        }
        return [];
    }
    _allButtons() {
        if (this._allButtonsCache) return this._allButtonsCache;
        const out = [];
        for (const area of this._areas) {
            for (const button of area.buttons) out.push(button);
        }
        this._allButtonsCache = out;
        return out;
    }
    _resolveAxes(sunEntity) {
        const sunState = sunEntity ? sunEntity.state.toLowerCase() : null;
        const isNight = sunState === 'below_horizon';
        return { isNight };
    }
    _getEntityState(hass, entityId, defaultValue = null) {
        if (!hass || !entityId) return defaultValue; const entity = hass.states[entityId];
        if (!entity) {
            this._trackEntityError(entityId, 'not_found');
            return defaultValue;
        }
        if (entity.state === 'unavailable' || entity.state === 'unknown') {
            this._trackEntityError(entityId, entity.state);
            return defaultValue;
        }
        this._entityErrors.delete(entityId);
        return entity;
    }
    _getEntityAttribute(entity, attribute, defaultValue = null) {
        if (!entity || !entity.attributes) return defaultValue; const value = entity.attributes[attribute];
        return value !== undefined && value !== null ? value : defaultValue;
    }
    _trackEntityError(entityId, errorType) {
        const now = Date.now(), existing = this._entityErrors.get(entityId);
        if (!existing || existing.type !== errorType) {
            this._entityErrors.set(entityId, { type: errorType, since: now });
            if (now - this._lastErrorLog > 60000) {
                console.warn(`AWC: Entity "${entityId}" is ${errorType}`);
                this._lastErrorLog = now;
            }
        }
    }
    _resolveSensorValue(hass, entityId, attribute) {
        let value, unit = '', haFormatted = false, rawNumeric = null; const sensor = hass.states[entityId];
        if (!sensor) {
            value = 'N/A';
        } else if (attribute) {
            const raw = sensor.attributes[attribute];
            if (raw === undefined || raw === null) {
                value = 'N/A';
            } else if (typeof hass.formatEntityAttributeValue === 'function') {
                value = hass.formatEntityAttributeValue(sensor, attribute); haFormatted = true; rawNumeric = raw;
            } else {
                value = raw;
                unit = sensor.attributes[`${attribute}_unit`] || sensor.attributes.unit_of_measurement || '';
            }
        } else if (typeof hass.formatEntityState === 'function') {
            value = hass.formatEntityState(sensor); haFormatted = true; rawNumeric = sensor.state;
        } else {
            value = sensor.state; unit = sensor.attributes.unit_of_measurement || '';
        }
        let formatted = value;
        if (!haFormatted) {
            formatted = this._formatNumber(value);
        }
        const isoSource = attribute
            ? (sensor && sensor.attributes && sensor.attributes[attribute])
            : (sensor && sensor.state);
        if (typeof isoSource === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(isoSource)) {
            const d = new Date(isoSource);
            if (!isNaN(d)) {
                const locale = (hass.locale && hass.locale.language) || undefined;
                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const targetStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                const dayDiff = Math.round((targetStart - todayStart) / 86400000);
                const timePart = d.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
                if (dayDiff === 0) {
                    formatted = timePart;
                } else if (dayDiff >= -1 && dayDiff <= 6) {
                    formatted = `${d.toLocaleDateString(locale, { weekday: 'short' })}, ${timePart}`;
                } else {
                    formatted = d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
                }
                haFormatted = true;
            }
        }
        return { formatted, unit, sensor, haFormatted, rawNumeric };
    }
    _syncFc() {
        if (!(this._hass && this._hass.connection)) return; const needed = new Set();
        for (const c of this._allButtons()) if (c.forecast && c.entity) needed.add(`${c.entity}|${c.forecast === 'hourly' ? 'hourly' : 'daily'}`);
        for (const [k, unsub] of this._fcSubs) if (!needed.has(k)) { unsub(); this._fcSubs.delete(k); this._fcData.delete(k); }
        for (const k of needed) if (!this._fcSubs.has(k)) this._startFcSub(k);
    }
    _startFcSub(key) {
        const [entity, type] = key.split('|'), hass = this._hass; if (!(hass && hass.connection)) return;
        if (!this._fcData.has(key) && _AWC_FC_CACHE.has(key)) {
            this._fcData.set(key, _AWC_FC_CACHE.get(key));
        }
        hass.connection.subscribeMessage(
            (msg) => this._onFcData(key, msg.forecast != null ? msg.forecast : [], type === 'daily'),
            { type: 'weather/subscribe_forecast', forecast_type: type, entity_id: entity }
        ).then(unsub => {
            if (!this.isConnected || (!this._fcSubs.has(key) && !this._allButtons().some(c => c.forecast && c.entity === entity))) { unsub(); return; }
            this._fcSubs.set(key, unsub);
        }).catch(() => {
            const poll = async () => {
                try {
                    const res = await this._hass.callWS({ type: 'call_service', domain: 'weather', service: 'get_forecasts', target: { entity_id: entity }, service_data: { type }, return_response: true });
                    const fcData = res && (res[entity] || (res.response && res.response[entity]));
                    this._onFcData(key, (fcData && fcData.forecast) != null ? fcData.forecast : [], type === 'daily');
                } catch (_) {}
            };
            poll(); const timer = setInterval(poll, 30 * 60_000); this._fcSubs.set(key, () => clearInterval(timer));
        });
    }
    _onFcData(key, raw, daily) {
        const processed = fcFilterPast(raw, daily), fp = fcFingerprint(processed);
        const _existing = this._fcData.get(key);
        if (_existing && _existing.fp === fp) return;
        const entry = { processed, fp };
        this._fcData.set(key, entry); this._lastSnapshot = null;
        _AWC_FC_CACHE.set(key, entry);
        if (_AWC_FC_CACHE.size > _AWC_FC_CACHE_MAX) {
            const oldest = _AWC_FC_CACHE.keys().next().value;
            _AWC_FC_CACHE.delete(oldest);
        }
    }
    _resolveFcValue(hass, button, lang) {
        const type = button.forecast === 'hourly' ? 'hourly' : 'daily', offset = Math.max(0, parseInt(button.forecast_offset, 10) || 0);
        const _fcEntry = this._fcData.get(`${button.entity}|${type}`);
        const fc = _fcEntry && _fcEntry.processed;
        if (!fc || !fc.length) return { formatted: '', unit: '', condition: null, datetime: null, loading: true };
        const entry = fc[Math.min(offset, fc.length - 1)];
        if (!entry) return { formatted: '', unit: '', condition: null, datetime: null, loading: true };
        const attr = button.attribute;
        if (!attr || attr === 'condition') {
            let label = entry.condition || '—';
            if (entry.condition && typeof hass.localize === 'function') label = hass.localize(`component.weather.entity_component._.state.${entry.condition}`) || label;
            return { formatted: label, unit: '', condition: entry.condition, datetime: entry.datetime, entry };
        }
        const raw = entry[attr];
        if (raw == null) return { formatted: 'N/A', unit: '', condition: entry.condition, datetime: entry.datetime, entry };
        const _buttonState = hass.states[button.entity];
        const w = _buttonState && _buttonState.attributes;
        const unit = (w && w[`${attr}_unit`]) || (_FC_UNIT_MAP[attr] && w && w[_FC_UNIT_MAP[attr]]) || _FC_UNIT_FALLBACK[attr] || '';
        let formatted = raw;
        const precision = button.forecast_precision !== undefined ? button.forecast_precision : 0;
        const fmt = (precision !== undefined && precision !== null)
            ? this._getFcFmt(lang, precision) : null;
        formatted = this._formatNumber(raw, fmt);
        return { formatted, unit, condition: entry.condition, datetime: entry.datetime, entry };
    }
    _getFcFmt(lang, precision) {
        const key = `${lang}|${precision}`;
        if ((this._fcFmtCache && this._fcFmtCache[0]) === key) return this._fcFmtCache[1];
        const fmt = new Intl.NumberFormat(lang, { maximumFractionDigits: precision, minimumFractionDigits: 0 });
        this._fcFmtCache = [key, fmt];
        return fmt;
    }
    _cssVar(el, prop, val, cacheKey) {
        if (!this._cssVarCache) this._cssVarCache = {};
        if (this._cssVarCache[cacheKey] === val) return;
        this._cssVarCache[cacheKey] = val;
        if (val) el.style.setProperty(prop, val);
        else el.style.removeProperty(prop);
    }
    _formatNumber(raw, fmt) {
        if (raw === null || raw === '' || isNaN(parseFloat(raw)) || !isFinite(raw)) return String(raw ?? '');
        const f = fmt || this._numFmt;
        return f ? f.format(raw) : String(raw);
    }
    _collectConditionEntities(conditions) {
        const out = [];
        if (!Array.isArray(conditions)) return out;
        for (const c of conditions) {
            if (!c) continue;
            if (c.entity) out.push(c.entity);
            if (c.condition === 'and' || c.condition === 'or' || c.condition === 'not') {
                out.push(...this._collectConditionEntities(c.conditions));
            }
        }
        return out;
    }
    _evaluateCondition(c, hass) {
        if (!c || !c.condition) return true;
        switch (c.condition) {
            case 'state': {
                if (!c.entity) return true;
                const stateObj = hass.states[c.entity];
                if (!stateObj) return false;
                const val = stateObj.state;
                if (c.state != null) {
                    const match = Array.isArray(c.state) ? c.state : [c.state];
                    return match.some(s => String(s) === val);
                }
                if (c.state_not != null) {
                    const match = Array.isArray(c.state_not) ? c.state_not : [c.state_not];
                    return match.every(s => String(s) !== val);
                }
                return true;
            }
            case 'numeric_state': {
                if (!c.entity) return true;
                const stateObj = hass.states[c.entity];
                if (!stateObj) return false;
                const raw = c.attribute ? stateObj.attributes[c.attribute] : stateObj.state;
                const val = parseFloat(raw);
                if (isNaN(val)) return false;
                if (c.above != null && val <= parseFloat(c.above)) return false;
                if (c.below != null && val >= parseFloat(c.below)) return false;
                return true;
            }
            case 'screen': {
                if (!c.media_query) return true;
                return window.matchMedia(c.media_query).matches;
            }
            case 'user': {
                if (!Array.isArray(c.users) || !hass.user) return true;
                return c.users.includes(hass.user.id);
            }
            case 'and': {
                if (!Array.isArray(c.conditions)) return true;
                return c.conditions.every(sub => this._evaluateCondition(sub, hass));
            }
            case 'or': {
                if (!Array.isArray(c.conditions)) return true;
                return c.conditions.some(sub => this._evaluateCondition(sub, hass));
            }
            case 'not': {
                if (!Array.isArray(c.conditions)) return true;
                return c.conditions.every(sub => !this._evaluateCondition(sub, hass));
            }
            default:
                return true;
        }
    }
    _checkButtonVisibility(button, hass) {
        return !Array.isArray(button.visibility) || !button.visibility.length || button.visibility.every(c => this._evaluateCondition(c, hass));
    }
    _checkAreaVisibility(area, hass) { return this._checkButtonVisibility(area, hass); }
    _hasSnapshotChanged(prev, next) {
        for (const k in next) if (prev[k] !== next[k]) return true;
        return false;
    }
    _calculateStatusImage(hass, isNight) {
        if (!this._hasStatusFeature) return null; const entityId = this._config.status_entity; const stateObj = this._getEntityState(hass, entityId);
        if (!stateObj || !stateObj.state) return null; const state = stateObj.state.toLowerCase();
        if (ACTIVE_STATES.includes(state)) {
            return isNight
                ? (this._config.status_night || this._config.status_day)
                : (this._config.status_day || this._config.status_night);
        }
        return null;
    }
    _handleWeatherChange(weatherState, hasNightChanged) {
        const stateChanged = this._lastState !== weatherState;
        this._lastState = weatherState;
        if (stateChanged || hasNightChanged) {
            this._shaderParams = this._weatherToUniforms();
            this._startAnimation();
        }
    }

    static _buildStyles() {
        return `
            :host { display: block; width: 100%; position: relative; background: transparent !important; min-height: 200px; }
            #card-root { position: relative; width: 100%; height: 100%; z-index: var(--awc-stack-order, 1); overflow: hidden; overflow: clip; background: transparent; display: block; transform: translateZ(0); will-change: transform; contain: layout style paint; border-radius: var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)); box-shadow: var(--ha-card-box-shadow, 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)); background-color: transparent; border-width: var(--awc-card-border-width, var(--ha-card-border-width, 0px)); border-style: solid; border-color: var(--ha-card-border-color, var(--divider-color, #e0e0e0)); box-sizing: border-box; }
            #card-root.clickable { cursor: pointer; -webkit-tap-highlight-color: transparent; }
            #card-root.clickable:active { transform: scale(0.98); transition: transform 0.15s cubic-bezier(0.2, 0, 0.2, 1); }
            #card-root.clickable:not(:active) { transition: transform 0.4s cubic-bezier(0.2, 0, 0.2, 1); }

            #card-root.scheme-day { --awc-text-color: var(--awc-text-day, #2c2c2e); --_button-shadow-avail: var(--awc-button-text-shadow, var(--awc-text-shadow-day, 0 1px 2px rgba(255, 255, 255, 0.85), 0 0 6px rgba(255, 255, 255, 0.5))); --_button-no-bg-shadow: none; --_text-bg: rgba(255, 255, 255, 0.25); --_text-bg-border: rgba(255, 255, 255, 0.2); }
            #card-root.scheme-day .contrast { --_text-bg: rgba(255,255,255,0.52); --_contrast-shadow: inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.08); }
            #card-root.scheme-day .frosted { --_text-bg: rgba(255,255,255,0.18); --_text-bg-border: rgba(255,255,255,0.32); --_frosted-inset: inset 0 1px 2px rgba(0,0,0,0.12), inset 0 -1px 1px rgba(0,0,0,0.06); }
            #card-root.scheme-day .has-icon-bg.with-bg.frosted { --_stacked-icon-border: 1px solid rgba(255,255,255,0.22); }
            #card-root.scheme-day .has-icon-bg.with-bg.contrast { --_stacked-icon-shadow: 0 2px 6px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.12); }
            #card-root.scheme-night { --awc-text-color: var(--awc-text-night, #ffffff); --_button-shadow-avail: var(--awc-button-text-shadow, var(--awc-text-shadow-night, 0 1px 3px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.6))); --_button-no-bg-shadow: none; --_text-bg: rgba(0, 0, 0, 0.35); --_text-bg-border: rgba(255, 255, 255, 0.08); }
            #card-root.scheme-night .contrast { --_text-bg: rgba(0,0,0,0.58); --_contrast-shadow: inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.3); }
            #card-root.scheme-night .frosted { --_text-bg: rgba(0,0,0,0.26); --_text-bg-border: rgba(255,255,255,0.10); --_frosted-inset: inset 0 1px 2px rgba(0,0,0,0.25), inset 0 -1px 1px rgba(0,0,0,0.15); }
            #card-root.scheme-night .has-icon-bg.with-bg.frosted { --_stacked-icon-border: 1px solid rgba(255,255,255,0.08); }
            #card-root.scheme-night .has-icon-bg.with-bg.contrast { --_stacked-icon-shadow: 0 2px 6px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.18); }
            #card-root.is-offscreen .awc-marquee-host .awc-marquee-track { animation-play-state: paused; }
            #gl-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; filter: brightness(var(--awc-bg-brightness, 1)) saturate(var(--awc-bg-saturation, 1)); border-radius: inherit; will-change: contents; z-index: 1; }
            #star-bg-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; border-radius: inherit; z-index: 2; }
            #star-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; border-radius: inherit; will-change: contents; z-index: 3; }

            #awc-sunrays { position: absolute; inset: 0; pointer-events: none; overflow: hidden; border-radius: inherit; z-index: 3; visibility: hidden; mix-blend-mode: screen; -webkit-mask-image: linear-gradient(135deg, white 20%, rgba(255,255,255,0.48) 60%, transparent 90%); mask-image: linear-gradient(135deg, white 20%, rgba(255,255,255,0.48) 60%, transparent 90%); }
            #card-root.has-sunrays #awc-sunrays { visibility: visible; }
            #awc-sunrays::before, #awc-sunrays::after { content: ''; }
            #awc-sunrays::before, #awc-sunrays::after, #awc-sunrays b { position: absolute; inset: -30%; display: block; font-weight: inherit; will-change: transform, opacity; }
            #awc-sunrays::before { background: linear-gradient(42deg, transparent 2%, rgba(255,247,205,0.48) 4%, rgba(255,250,220,0.12) 12%, transparent 16%, transparent 24%, rgba(255,250,215,0.36) 27%, rgba(255,252,230,0.10) 34%, transparent 38%, transparent 50%, rgba(255,245,200,0.54) 52%, rgba(255,250,220,0.24) 60%, rgba(255,252,230,0.06) 68%, transparent 72%, transparent 82%, rgba(255,250,220,0.26) 84%, transparent 92%); animation: awc-ray-a 3s ease-in-out infinite alternate; }
            #awc-sunrays::after { background: linear-gradient(48deg, transparent 0%, rgba(255,248,210,0.42) 3%, rgba(255,250,225,0.12) 18%, transparent 22%, transparent 36%, rgba(255,245,200,0.48) 39%, rgba(255,250,220,0.18) 52%, transparent 58%, transparent 70%, rgba(255,248,215,0.36) 73%, rgba(255,252,230,0.10) 84%, transparent 88%); animation: awc-ray-b 6s ease-in-out infinite alternate; }
            #awc-sunrays b { background: linear-gradient(36deg, transparent 6%, rgba(255,252,225,0.30) 9%, transparent 14%, transparent 30%, rgba(255,248,205,0.46) 33%, rgba(255,250,220,0.22) 44%, rgba(255,252,230,0.05) 52%, transparent 56%, transparent 66%, rgba(255,250,220,0.18) 69%, transparent 78%); animation: awc-ray-c 2s ease-in-out infinite alternate; }
            @keyframes awc-ray-a { from { transform: translate(-5%, -3%); opacity: 0.36; } to { transform: translate(3%, 2%); opacity: 1; } }
            @keyframes awc-ray-b { from { transform: translate(4%, -2%); opacity: 0.42; } to { transform: translate(-3%, 3%); opacity: 1; } }
            @keyframes awc-ray-c { from { transform: translate(-3%, 3%); opacity: 0.30; } to { transform: translate(3%, -2%); opacity: 1; } }
            #card-root.has-sunrays #awc-sunglow { visibility: visible; }

            #card-root.weather-partlycloudy #awc-sunglow { --awc-glow-core: 255, 240, 210; --awc-glow-warm: 255, 200, 125; }
            #awc-sunglow { position: absolute; inset: 0; pointer-events: none; overflow: hidden; border-radius: inherit; z-index: 4; visibility: hidden; --awc-glow-core: 255, 255, 240; --awc-glow-warm: 255, 225, 150; background: radial-gradient(circle at 0% 0%, rgba(var(--awc-glow-core), 0.18) 0%, rgba(var(--awc-glow-core), 0.11) 12%, rgba(var(--awc-glow-warm), 0.06) 28%, transparent 46%), radial-gradient(ellipse 130% 100% at 5% 8%, rgba(var(--awc-glow-warm), 0.10) 0%, rgba(var(--awc-glow-warm), 0.04) 32%, transparent 62%), linear-gradient(135deg, rgba(var(--awc-glow-warm), 0.06) 0%, rgba(var(--awc-glow-warm), 0.02) 32%, transparent 58%), radial-gradient(ellipse at 28% 22%, rgba(var(--awc-glow-warm), 0.04) 0%, rgba(var(--awc-glow-warm), 0.01) 38%, transparent 65%); }
            #awc-sunglow::before, #awc-sunglow::after { content: ''; position: absolute; }
            #awc-sunglow::before { top: -42%; left: -42%; width: 105%; height: 105%; background: radial-gradient(circle, rgba(var(--awc-glow-core), 0.14) 0%, rgba(var(--awc-glow-core), 0.07) 18%, rgba(var(--awc-glow-warm), 0.04) 38%, transparent 58%), radial-gradient(ellipse 75% 110%, rgba(var(--awc-glow-warm), 0.06) 0%, transparent 52%); animation: awc-glow-pulse 4s ease-in-out infinite alternate; }
            #awc-sunglow::after { top: -22%; left: -22%; width: 88%; height: 88%; background: radial-gradient(ellipse 115% 80%, rgba(var(--awc-glow-core), 0.08) 0%, rgba(var(--awc-glow-warm), 0.03) 28%, transparent 52%), radial-gradient(circle, rgba(var(--awc-glow-warm), 0.04) 0%, transparent 48%); animation: awc-glow-shift 7s ease-in-out infinite alternate; }
            @keyframes awc-glow-pulse { from { opacity: 0.09; transform: scale(1); } to { opacity: 0.20; transform: scale(1.18); } }
            @keyframes awc-glow-shift { from { transform: translate(-5%, -5%) scale(0.92); opacity: 0.10; } to { transform: translate(5%, 5%) scale(1.10); opacity: 0.20; } }

            #card-root.shaders-off { background: var(--ha-card-background, var(--card-background-color, var(--primary-background-color))); }
            #awc-bottom-fade { position: absolute; inset: 0; pointer-events: none; z-index: 4; display: none; background: linear-gradient(to bottom, transparent 0%, transparent var(--awc-fade-start, 30%), var(--awc-fade-color, var(--ha-card-background, var(--card-background-color, var(--primary-background-color)))) 100%); }
            #card-root.has-bottom-fade #awc-bottom-fade { display: block; }
            #awc-theme-adapt { position: absolute; inset: 0; pointer-events: none; z-index: 4; border-radius: inherit; }
            #card-root.adapt-dim #awc-theme-adapt { backdrop-filter: brightness(0.75) contrast(1.15) saturate(0.9); -webkit-backdrop-filter: brightness(0.75) contrast(1.15) saturate(0.9); }
            #card-root.adapt-lift #awc-theme-adapt { backdrop-filter: brightness(1.3) contrast(0.92) saturate(0.85); -webkit-backdrop-filter: brightness(1.12) contrast(0.92) saturate(1.05); }
            #awc-weather-bg { position: absolute; inset: 0; pointer-events: none; border-radius: inherit; z-index: 1; display: none; overflow: hidden; overflow: clip; }
            #awc-weather-bg > img, #awc-weather-bg > video { display: block; width: 100%; height: 100%; object-fit: cover; border: none; outline: none; filter: brightness(var(--awc-bg-brightness, 1)) saturate(var(--awc-bg-saturation, 1)); }
            #awc-weather-bg > video { muted: true; }
            #card-root.has-weather-bg #awc-weather-bg { display: block; }
            #card-root.has-weather-bg #gl-canvas { display: none; }
            #awc-simple-bg { position: absolute; inset: 0; pointer-events: none; border-radius: inherit; z-index: 1; display: none; overflow: hidden; overflow: clip; }
            #card-root.has-bg-filter #awc-simple-bg { filter: brightness(var(--awc-bg-brightness, 1)) saturate(var(--awc-bg-saturation, 1)); }
            .awc-sky-layer { position: absolute; inset: 0; border-radius: inherit; }
            #awc-sky-base { transition: background 1.5s ease; background: var(--_sky-base, var(--awc-simple-bg-day, linear-gradient(135deg, #B6CBD3 0%, #CDD4CB 50%, #E5DDC9 100%))); }
            #awc-sky-glow { will-change: background-position; background-image: var(--_sky-glow, none); background-repeat: no-repeat; background-size: 200% 200%; animation: awc-sky-glow 18s ease-in-out infinite; }
            @keyframes awc-sky-glow { 0%, 100% { background-position: 30% 25%; } 25% { background-position: 70% 18%; } 50% { background-position: 78% 70%; } 75% { background-position: 22% 78%; } }
            @media (prefers-reduced-motion: reduce) { #awc-sky-glow { animation: none; will-change: auto; } }
            #card-root.scheme-day.weather-sunny #awc-simple-bg { --_sky-base: var(--awc-simple-base-sunny-day, radial-gradient(ellipse 135% 118% at 19% 16%, #dbe8f0 0%, #cfdfeb 28%, #c2d7e7 55%, #b4cde3 80%, #a9c4df 100%)); --_sky-glow: var(--awc-simple-glow-sunny-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(251,248,239,0.55) 0%, rgba(251,248,239,0.34) 31%, rgba(251,248,239,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-sunny #awc-simple-bg { --_sky-base: var(--awc-simple-base-sunny-night, radial-gradient(ellipse 135% 118% at 19% 16%, #1b2e46 0%, #152138 28%, #10182c 55%, #0e1426 80%, #0c1122 100%)); --_sky-glow: var(--awc-simple-glow-sunny-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(46,85,112,0.80) 0%, rgba(46,85,112,0.52) 31%, rgba(46,85,112,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-clear-night #awc-simple-bg { --_sky-base: var(--awc-simple-base-clear-night-day, radial-gradient(ellipse 135% 118% at 19% 16%, #dbe8f0 0%, #cfdfeb 28%, #c2d7e7 55%, #b4cde3 80%, #a9c4df 100%)); --_sky-glow: var(--awc-simple-glow-clear-night-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(251,248,239,0.55) 0%, rgba(251,248,239,0.34) 31%, rgba(251,248,239,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-clear-night #awc-simple-bg { --_sky-base: var(--awc-simple-base-clear-night-night, radial-gradient(ellipse 135% 118% at 19% 16%, #192f48 0%, #13223a 28%, #0e172d 55%, #0c1225 80%, #0a0e1f 100%)); --_sky-glow: var(--awc-simple-glow-clear-night-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(44,91,114,0.80) 0%, rgba(44,91,114,0.52) 31%, rgba(44,91,114,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-partlycloudy #awc-simple-bg { --_sky-base: var(--awc-simple-base-partlycloudy-day, radial-gradient(ellipse 135% 118% at 19% 16%, #d4e4ed 0%, #c7dbe8 28%, #bad2e4 55%, #adc8e0 80%, #a2bfdd 100%)); --_sky-glow: var(--awc-simple-glow-partlycloudy-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(248,246,241,0.55) 0%, rgba(248,246,241,0.34) 31%, rgba(248,246,241,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-partlycloudy #awc-simple-bg { --_sky-base: var(--awc-simple-base-partlycloudy-night, radial-gradient(ellipse 135% 118% at 19% 16%, #1d2d44 0%, #172236 28%, #11192a 55%, #0f1525 80%, #0e1220 100%)); --_sky-glow: var(--awc-simple-glow-partlycloudy-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(52,79,106,0.80) 0%, rgba(52,79,106,0.52) 31%, rgba(52,79,106,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-cloudy #awc-simple-bg { --_sky-base: var(--awc-simple-base-cloudy-day, radial-gradient(ellipse 135% 118% at 19% 16%, #d2dee5 0%, #d1e0da 28%, #d2ddd0 55%, #dde1ce 80%, #e5decd 100%)); --_sky-glow: var(--awc-simple-glow-cloudy-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(248,247,241,0.55) 0%, rgba(248,247,241,0.34) 31%, rgba(248,247,241,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-cloudy #awc-simple-bg { --_sky-base: var(--awc-simple-base-cloudy-night, radial-gradient(ellipse 135% 118% at 19% 16%, #28323f 0%, #212a35 28%, #1a212b 55%, #161c24 80%, #13171e 100%)); --_sky-glow: var(--awc-simple-glow-cloudy-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(72,86,104,0.78) 0%, rgba(72,86,104,0.50) 31%, rgba(72,86,104,0.26) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-windy #awc-simple-bg { --_sky-base: var(--awc-simple-base-windy-day, radial-gradient(ellipse 135% 118% at 19% 16%, #d6e9eb 0%, #cae1e6 28%, #bdd7e2 55%, #b0cddd 80%, #a4c5da 100%)); --_sky-glow: var(--awc-simple-glow-windy-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(241,249,247,0.55) 0%, rgba(241,249,247,0.34) 31%, rgba(241,249,247,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-windy #awc-simple-bg { --_sky-base: var(--awc-simple-base-windy-night, radial-gradient(ellipse 135% 118% at 19% 16%, #1d333e 0%, #172734 28%, #121d2a 55%, #101824 80%, #0e1420 100%)); --_sky-glow: var(--awc-simple-glow-windy-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(50,94,103,0.80) 0%, rgba(50,94,103,0.52) 31%, rgba(50,94,103,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-windy-variant #awc-simple-bg { --_sky-base: var(--awc-simple-base-windy-variant-day, radial-gradient(ellipse 135% 118% at 19% 16%, #d6e6e3 0%, #cce1e2 28%, #c1d8de 55%, #b3cfd9 80%, #a8c5d6 100%)); --_sky-glow: var(--awc-simple-glow-windy-variant-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(242,248,244,0.55) 0%, rgba(242,248,244,0.34) 31%, rgba(242,248,244,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-windy-variant #awc-simple-bg { --_sky-base: var(--awc-simple-base-windy-variant-night, radial-gradient(ellipse 135% 118% at 19% 16%, #21363b 0%, #1a2a31 28%, #141f27 55%, #121a22 80%, #10151e 100%)); --_sky-glow: var(--awc-simple-glow-windy-variant-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(55,98,94,0.80) 0%, rgba(55,98,94,0.52) 31%, rgba(55,98,94,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-exceptional #awc-simple-bg { --_sky-base: var(--awc-simple-base-exceptional-day, radial-gradient(ellipse 135% 118% at 19% 16%, #cbe1ec 0%, #b9d5e7 28%, #a8c8e2 55%, #98bbde 80%, #8bb0da 100%)); --_sky-glow: var(--awc-simple-glow-exceptional-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(250,248,239,0.55) 0%, rgba(250,248,239,0.34) 31%, rgba(250,248,239,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-exceptional #awc-simple-bg { --_sky-base: var(--awc-simple-base-exceptional-night, radial-gradient(ellipse 135% 118% at 19% 16%, #182d49 0%, #12213b 28%, #0e172d 55%, #0c1225 80%, #0a0e1f 100%)); --_sky-glow: var(--awc-simple-glow-exceptional-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(41,92,117,0.80) 0%, rgba(41,92,117,0.52) 31%, rgba(41,92,117,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-default #awc-simple-bg { --_sky-base: var(--awc-simple-base-default-day, radial-gradient(ellipse 135% 118% at 19% 16%, #d9e5ec 0%, #cddce8 28%, #c1d3e3 55%, #b4c9de 80%, #a9c0da 100%)); --_sky-glow: var(--awc-simple-glow-default-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(247,246,242,0.55) 0%, rgba(247,246,242,0.34) 31%, rgba(247,246,242,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-default #awc-simple-bg { --_sky-base: var(--awc-simple-base-default-night, radial-gradient(ellipse 135% 118% at 19% 16%, #1d2e44 0%, #162237 28%, #11182b 55%, #0e1323 80%, #0c0f1d 100%)); --_sky-glow: var(--awc-simple-glow-default-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(49,85,109,0.80) 0%, rgba(49,85,109,0.52) 31%, rgba(49,85,109,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-fog #awc-simple-bg { --_sky-base: var(--awc-simple-base-fog-day, radial-gradient(ellipse 135% 118% at 19% 16%, #ece7df 0%, #dde8df 28%, #dae0e4 55%, #d2d9df 80%, #cbd3dc 100%)); --_sky-glow: var(--awc-simple-glow-fog-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(247,246,242,0.55) 0%, rgba(247,246,242,0.34) 31%, rgba(247,246,242,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-fog #awc-simple-bg { --_sky-base: var(--awc-simple-base-fog-night, radial-gradient(ellipse 135% 118% at 19% 16%, #2b333b 0%, #252c33 28%, #1f252b 55%, #1b2026 80%, #181c21 100%)); --_sky-glow: var(--awc-simple-glow-fog-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(86,97,108,0.74) 0%, rgba(86,97,108,0.48) 31%, rgba(86,97,108,0.24) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-snowy #awc-simple-bg { --_sky-base: var(--awc-simple-base-snowy-day, radial-gradient(ellipse 135% 118% at 19% 16%, #e4edf1 0%, #d7e2eb 28%, #c9d6e5 55%, #bdcadf 80%, #b3bfdb 100%)); --_sky-glow: var(--awc-simple-glow-snowy-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(241,246,248,0.55) 0%, rgba(241,246,248,0.34) 31%, rgba(241,246,248,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-snowy #awc-simple-bg { --_sky-base: var(--awc-simple-base-snowy-night, radial-gradient(ellipse 135% 118% at 19% 16%, #233443 0%, #1c2938 28%, #17202e 55%, #141a28 80%, #111522 100%)); --_sky-glow: var(--awc-simple-glow-snowy-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(54,91,109,0.80) 0%, rgba(54,91,109,0.52) 31%, rgba(54,91,109,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-snowy-rainy #awc-simple-bg { --_sky-base: var(--awc-simple-base-snowy-rainy-day, radial-gradient(ellipse 135% 118% at 19% 16%, #d9e2e8 0%, #cad6e0 28%, #bbc9d9 55%, #adbcd2 80%, #a2b2cd 100%)); --_sky-glow: var(--awc-simple-glow-snowy-rainy-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(242,246,247,0.55) 0%, rgba(242,246,247,0.34) 31%, rgba(242,246,247,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-snowy-rainy #awc-simple-bg { --_sky-base: var(--awc-simple-base-snowy-rainy-night, radial-gradient(ellipse 135% 118% at 19% 16%, #232f39 0%, #1c252f 28%, #151c26 55%, #131821 80%, #11141d 100%)); --_sky-glow: var(--awc-simple-glow-snowy-rainy-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(57,82,96,0.80) 0%, rgba(57,82,96,0.52) 31%, rgba(57,82,96,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-hail #awc-simple-bg { --_sky-base: var(--awc-simple-base-hail-day, radial-gradient(ellipse 135% 118% at 19% 16%, #d4dde2 0%, #c4cfd9 28%, #b3c2d1 55%, #a3b4ca 80%, #97a9c4 100%)); --_sky-glow: var(--awc-simple-glow-hail-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(243,246,247,0.55) 0%, rgba(243,246,247,0.34) 31%, rgba(243,246,247,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-hail #awc-simple-bg { --_sky-base: var(--awc-simple-base-hail-night, radial-gradient(ellipse 135% 118% at 19% 16%, #202932 0%, #1a212a 28%, #141a22 55%, #11161e 80%, #0f121a 100%)); --_sky-glow: var(--awc-simple-glow-hail-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(54,76,89,0.80) 0%, rgba(54,76,89,0.52) 31%, rgba(54,76,89,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-rainy #awc-simple-bg { --_sky-base: var(--awc-simple-base-rainy-day, radial-gradient(ellipse 135% 118% at 19% 16%, #d7e3e5 0%, #c8d9dd 28%, #b9ced6 55%, #adc4d0 80%, #a4bccc 100%)); --_sky-glow: var(--awc-simple-glow-rainy-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(242,247,247,0.55) 0%, rgba(242,247,247,0.34) 31%, rgba(242,247,247,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-rainy #awc-simple-bg { --_sky-base: var(--awc-simple-base-rainy-night, radial-gradient(ellipse 135% 118% at 19% 16%, #22343a 0%, #1b2930 28%, #152027 55%, #121b22 80%, #10171e 100%)); --_sky-glow: var(--awc-simple-glow-rainy-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(57,94,96,0.80) 0%, rgba(57,94,96,0.52) 31%, rgba(57,94,96,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-pouring #awc-simple-bg { --_sky-base: var(--awc-simple-base-pouring-day, radial-gradient(ellipse 135% 118% at 19% 16%, #c8dbdf 0%, #b5ced6 28%, #a3c0ce 55%, #95b4c7 80%, #89aac2 100%)); --_sky-glow: var(--awc-simple-glow-pouring-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(233,242,241,0.55) 0%, rgba(233,242,241,0.34) 31%, rgba(233,242,241,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-pouring #awc-simple-bg { --_sky-base: var(--awc-simple-base-pouring-night, radial-gradient(ellipse 135% 118% at 19% 16%, #1d2f34 0%, #17262c 28%, #121d24 55%, #10191f 80%, #0d151b 100%)); --_sky-glow: var(--awc-simple-glow-pouring-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(51,89,91,0.80) 0%, rgba(51,89,91,0.52) 31%, rgba(51,89,91,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-lightning #awc-simple-bg { --_sky-base: var(--awc-simple-base-lightning-day, radial-gradient(ellipse 135% 118% at 19% 16%, #dddbca 0%, #c9cdb8 28%, #afbea7 55%, #97b5ab 80%, #8a9cad 100%)); --_sky-glow: var(--awc-simple-glow-lightning-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(244,241,231,0.55) 0%, rgba(244,241,231,0.34) 31%, rgba(244,241,231,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-lightning #awc-simple-bg { --_sky-base: var(--awc-simple-base-lightning-night, radial-gradient(ellipse 135% 118% at 19% 16%, #232838 0%, #1c2230 28%, #161b27 55%, #131722 80%, #10131c 100%)); --_sky-glow: var(--awc-simple-glow-lightning-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(78,80,116,0.80) 0%, rgba(68,74,106,0.52) 31%, rgba(60,70,98,0.28) 57%, transparent 80%)); }
            #card-root.scheme-day.weather-lightning-rainy #awc-simple-bg { --_sky-base: var(--awc-simple-base-lightning-rainy-day, radial-gradient(ellipse 135% 118% at 19% 16%, #d3d2c0 0%, #b0c2ac 28%, #99b4a9 55%, #8baeb0 80%, #7f9aad 100%)); --_sky-glow: var(--awc-simple-glow-lightning-rainy-day, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(234,232,220,0.55) 0%, rgba(234,232,220,0.34) 31%, rgba(234,232,220,0.16) 57%, transparent 80%)); }
            #card-root.scheme-night.weather-lightning-rainy #awc-simple-bg { --_sky-base: var(--awc-simple-base-lightning-rainy-night, radial-gradient(ellipse 135% 118% at 19% 16%, #29281f 0%, #1d231b 28%, #181f1c 55%, #131b1c 80%, #101519 100%)); --_sky-glow: var(--awc-simple-glow-lightning-rainy-night, radial-gradient(ellipse 92% 82% at 23% 21%, rgba(80,76,53,0.80) 0%, rgba(80,76,53,0.52) 31%, rgba(80,76,53,0.28) 57%, transparent 80%)); }
            #card-root.has-simple-bg #awc-simple-bg { display: block; }
            #card-root.has-simple-bg #gl-canvas { display: none; }
            #image-slot { position: absolute; top: 0; height: 100%; width: auto; user-select: none; pointer-events: none; box-sizing: border-box; z-index: 3; }
            #image-slot > img { display: block; height: 100%; width: auto; max-width: 100%; object-fit: contain; border: none; outline: none; }
            #image-slot > img[src=""],
            #image-slot > img:not([src]) { display: none; visibility: hidden; }
            #text-wrapper { position: absolute; inset: 0; pointer-events: none; box-sizing: border-box; overflow: visible; z-index: 5; }
            .awc-pos-slot { position: absolute; left: var(--_awc-pad-h, var(--awc-card-padding, 16px)); display: flex; gap: var(--awc-slot-gap, 8px); pointer-events: none; width: calc(100% - var(--_awc-pad-h, var(--awc-card-padding, 16px)) * 2); max-height: calc(100% - var(--_awc-pad-v, var(--awc-card-padding, 16px)) * 2); box-sizing: border-box; flex-direction: column; align-items: var(--_sa-h, flex-start); justify-content: var(--_sa-v, flex-start); }
            .awc-pos-slot:empty { display: none; }
            .awc-pos-slot.pos-top-left { top: var(--_awc-pad-v, var(--awc-card-padding, 16px)); --_sa-h: flex-start; --_sa-v: flex-start; }
            .awc-pos-slot.pos-top-center { top: var(--_awc-pad-v, var(--awc-card-padding, 16px)); --_sa-h: center; --_sa-v: flex-start; }
            .awc-pos-slot.pos-top-right { top: var(--_awc-pad-v, var(--awc-card-padding, 16px)); --_sa-h: flex-end; --_sa-v: flex-start; }
            .awc-pos-slot.pos-left { top: 50%; transform: translateY(-50%); --_sa-h: flex-start; --_sa-v: center; }
            .awc-pos-slot.pos-center { top: 50%; transform: translateY(-50%); --_sa-h: center; --_sa-v: center; }
            .awc-pos-slot.pos-right { top: 50%; transform: translateY(-50%); --_sa-h: flex-end; --_sa-v: center; }
            .awc-pos-slot.pos-bottom-left { bottom: var(--_awc-pad-v, var(--awc-card-padding, 16px)); --_sa-h: flex-start; --_sa-v: flex-end; }
            .awc-pos-slot.pos-bottom-center { bottom: var(--_awc-pad-v, var(--awc-card-padding, 16px)); --_sa-h: center; --_sa-v: flex-end; }
            .awc-pos-slot.pos-bottom-right { bottom: var(--_awc-pad-v, var(--awc-card-padding, 16px)); --_sa-h: flex-end; --_sa-v: flex-end; }
            .awc-pos-slot.stack-v { flex-direction: column; align-items: var(--_sa-h, flex-start); justify-content: var(--_sa-v, flex-start); }
            .awc-pos-slot.stack-h { flex-direction: row; align-items: var(--_sa-v, flex-start); justify-content: var(--_sa-h, flex-start); }
            .buttons-group { pointer-events: none; font-family: var(--ha-font-family, var(--paper-font-body1_-_font-family, sans-serif)); transition: color 0.3s ease, text-shadow 0.3s ease; min-width: 0; box-sizing: border-box; }
            .buttons-row,
            .button-free { color: var(--awc-text-color); }
            .button-sub { display: block; font-size: var(--awc-sub-size, 0.78em); opacity: var(--awc-sub-opacity, 0.7); font-weight: var(--awc-sub-weight, 500); line-height: 1.2; white-space: var(--awc-sub-wrap, nowrap); overflow: var(--awc-sub-visible, hidden); text-overflow: var(--awc-sub-overflow, ellipsis); flex: 0 0 auto; min-width: 0; }
            .button-val .fancy-unit { font-size: 0.55em; font-weight: 500; opacity: 0.7; vertical-align: baseline; position: relative; top: -0.45em; margin-left: 3px; }
            .buttons-group { pointer-events: auto; width: var(--awc-row-width, auto); box-sizing: border-box; padding: var(--awc-container-padding, 0); }
            .buttons-group.has-row-wrap { width: var(--awc-row-width, auto); }
            .buttons-group.has-row-horizontal-scroll { height: var(--awc-row-height, auto); }
            .buttons-group.has-row-vertical-scroll { height: var(--awc-row-height, calc(100% - var(--_awc-pad-v, var(--awc-card-padding, 16px)) * 2)); }
            .buttons-group.grouped { border-radius: var(--awc-bottom-bg-radius, calc(var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)) - 5px)); }
            .buttons-group.grouped.with-bg { --_bg: var(--awc-container-bg-color, var(--awc-bottom-bg-color, var(--_text-bg))); }
            :where(.buttons-group.grouped, .button).with-bg.contrast { background: var(--_bg); box-shadow: var(--awc-bg-shadow, var(--_contrast-shadow)); }
            :where(.buttons-group.grouped, .button).with-bg.frosted { background: var(--_bg); border: var(--awc-bg-border, 1px solid var(--_text-bg-border)); box-shadow: var(--awc-bg-shadow, var(--_frosted-inset, none)); backdrop-filter: var(--awc-bottom-bg-filter, blur(10px)); -webkit-backdrop-filter: var(--awc-bottom-bg-filter, blur(10px)); }
            :where(.buttons-group.grouped, .button).with-bg.theme { background: var(--ha-card-background, var(--card-background-color, var(--primary-background-color))); border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color)); box-shadow: var(--ha-card-box-shadow, none); }
            .buttons-group.grouped.with-bg > .buttons-row .button.with-bg { background: none; border: none; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; border-radius: 0; padding: var(--awc-buttons-padding, 0); }
            :where(.buttons-group.grouped.with-bg >) .buttons-row.has-separator:not(.row-grid) > .button { position: relative; overflow: visible; }
            :where(.buttons-group.grouped.with-bg >) .buttons-row.has-separator:not(.row-grid) > .button + .button::before { content: ""; position: absolute; pointer-events: none; top: 0; bottom: 0; inset-inline-start: calc((var(--awc-bottom-gap, 8px) / -2) - (var(--awc-separator-width, 2px) / 2)); width: var(--awc-separator-width, 2px); background: var(--awc-separator-color, color-mix(in srgb, currentColor 10%, transparent)); }
            :where(.buttons-group.grouped.with-bg >) .buttons-row.has-separator:not(.row-grid).row-vertical-scroll > .button + .button::before { top: calc((var(--awc-bottom-gap, 8px) / -2) - (var(--awc-separator-width, 2px) / 2)); bottom: auto; left: 0; right: 0; inset-inline-start: 0; width: auto; height: var(--awc-separator-width, 2px); }
            .buttons-row.has-separator:not(.row-grid) > .button { position: relative; overflow: visible; }
            .buttons-row.has-separator:not(.row-grid) > .button + .button::before { content: ""; position: absolute; pointer-events: none; top: 0; bottom: 0; inset-inline-start: calc((var(--awc-bottom-gap, 8px) / -2) - (var(--awc-separator-width, 2px) / 2)); width: var(--awc-separator-width, 2px); background: var(--awc-separator-color, color-mix(in srgb, currentColor 10%, transparent)); }
            .buttons-row.has-separator:not(.row-grid).row-vertical-scroll > .button + .button::before { top: calc((var(--awc-bottom-gap, 8px) / -2) - (var(--awc-separator-width, 2px) / 2)); bottom: auto; left: 0; right: 0; inset-inline-start: 0; width: auto; height: var(--awc-separator-width, 2px); }
            .buttons-row { font-size: var(--awc-bottom-font-size, 16px); font-weight: var(--awc-bottom-font-weight, 500); display: flex; align-items: center; gap: var(--awc-bottom-gap, 8px); width: 100%; box-sizing: border-box; pointer-events: auto; border-radius: inherit; }
            .buttons-row.row-wrap { flex-wrap: wrap; }
            .buttons-row.row-wrap[class*="pos-top"] { align-items: flex-start; }
            .buttons-row.row-wrap[class*="pos-bottom"] { align-items: flex-end; }
            .buttons-row.row-wrap.pos-left,
            .buttons-row.row-wrap.pos-right { align-items: center; }
            .buttons-row.row-horizontal-scroll { flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; height: 100%; scroll-snap-type: x proximity; scrollbar-width: none; -ms-overflow-style: none; pointer-events: auto; }
            .buttons-row.row-horizontal-scroll::-webkit-scrollbar { display: none; }
            .buttons-row.row-horizontal-scroll.has-visible-count { display: grid; grid-auto-flow: column; grid-auto-columns: var(--awc-button-basis); scroll-snap-type: x mandatory; }
            .buttons-row.row-horizontal-scroll.has-visible-count > .button { width: 100%; scroll-snap-align: start; }
            .buttons-row.row-vertical-scroll { flex-direction: column; flex-wrap: nowrap; overflow-y: auto; overflow-x: hidden; height: 100%; max-height: var(--awc-row-max-height, none); scroll-snap-type: y proximity; scrollbar-width: none; -ms-overflow-style: none; pointer-events: auto; }
            .buttons-row.row-vertical-scroll::-webkit-scrollbar { display: none; }
            .buttons-row.row-vertical-scroll.has-visible-count { display: grid; grid-auto-flow: row; grid-auto-rows: var(--awc-button-basis-v, auto); max-height: none; scroll-snap-type: y mandatory; }
            .buttons-row.row-vertical-scroll.has-visible-count > .button { height: 100%; scroll-snap-align: start; }
            .buttons-row.row-vertical-scroll:not(.has-visible-count)[class*="pos-bottom"] > :first-child { margin-block-start: auto; }
            .buttons-row.row-vertical-scroll:not(.has-visible-count).pos-center > :first-child { margin-block-start: auto; }
            .buttons-row.row-vertical-scroll:not(.has-visible-count).pos-center > :last-child { margin-block-end: auto; }
            .buttons-row.row-vertical-scroll[class*="right"] { align-items: flex-end; }
            .buttons-row.row-vertical-scroll.pos-top-center,
            .buttons-row.row-vertical-scroll.pos-center,
            .buttons-row.row-vertical-scroll.pos-bottom-center { align-items: center; }
            .buttons-row.row-grid { display: grid; grid-template-columns: repeat(var(--awc-row-columns, 1), minmax(0, 1fr)); align-items: stretch; row-gap: var(--awc-bottom-gap, 8px); column-gap: var(--awc-bottom-gap, 8px); }
            .buttons-row.row-wrap[class*="right"] { justify-content: flex-end; }
            .buttons-row.row-wrap.pos-top-center,
            .buttons-row.row-wrap.pos-center,
            .buttons-row.row-wrap.pos-bottom-center { justify-content: center; }
            .buttons-row.row-grid,
            .buttons-row.has-visible-count { align-items: stretch; }
            .buttons-row.row-grid > .button,
            .buttons-row.has-visible-count > .button { overflow: hidden; }
            .buttons-row.row-grid > .button > .button-content > .button-val,
            .buttons-row.has-visible-count > .button > .button-content > .button-val { flex: 0 1 auto; }
            /* Area-level alignment → button (buttons without own .align-* inherit area alignment) */
            .buttons-row.align-start:where(.row-grid, .has-visible-count) > .button:not(.align-start, .align-center, .align-end, .align-spread) { justify-content: flex-start; text-align: start; }
            .buttons-row.align-center:where(.row-grid, .has-visible-count) > .button:not(.align-start, .align-center, .align-end, .align-spread) { justify-content: center; text-align: center; }
            .buttons-row.align-end:where(.row-grid, .has-visible-count) > .button:not(.align-start, .align-center, .align-end, .align-spread) { justify-content: flex-end; text-align: end; }
            /* Area-level → inline buttons (not stacked/vertical) */
            .buttons-row.align-end > .button:not(.format-stacked, .format-vertical, .align-start, .align-center, .align-end, .align-spread) .button-content { flex: unset; }
            .buttons-row.align-end > .button:not(.format-stacked, .format-vertical, .align-start, .align-center, .align-end, .align-spread) .button-val { flex: 0 0 auto; }
            .buttons-row.align-center > .button:not(.format-stacked, .format-vertical, .align-start, .align-center, .align-end, .align-spread) { justify-content: center; }
            .buttons-row.align-center > .button:not(.format-stacked, .format-vertical, .align-start, .align-center, .align-end, .align-spread) .button-content { flex: unset; }
            .buttons-row.align-center > .button:not(.format-stacked, .format-vertical, .align-start, .align-center, .align-end, .align-spread) .button-val { flex: 0 0 auto; }
            .buttons-row.align-spread > .button:not(.format-stacked, .format-vertical, .align-start, .align-center, .align-end, .align-spread) { flex: 1 1 0; }
            .buttons-row.align-spread > .button:not(.format-stacked, .format-vertical, .align-start, .align-center, .align-end, .align-spread) .button-content { justify-content: flex-start; }
            .buttons-row.align-spread > .button:not(.format-stacked, .format-vertical, .align-start, .align-center, .align-end, .align-spread) .button-content > .button-val { margin-left: auto; }
            .buttons-row.align-spread > .button.no-name:not(.format-stacked, .format-vertical, .align-start, .align-center, .align-end, .align-spread) { justify-content: space-between; }
            .buttons-row.align-spread > .button.no-name:not(.format-stacked, .format-vertical, .align-start, .align-center, .align-end, .align-spread) .button-content { flex: 0 1 auto; }
            /* Area-level → stacked buttons */
            .buttons-row.align-end > .button.format-stacked:not(.align-start, .align-center, .align-end, .align-spread) { flex-direction: row-reverse; }
            .buttons-row.align-end > .button.format-stacked:not(.align-start, .align-center, .align-end, .align-spread) .button-content { align-items: flex-end; text-align: end; }
            .buttons-row.align-end > .button.format-stacked:not(.align-start, .align-center, .align-end, .align-spread).with-bg { padding: var(--awc-buttons-padding, 6px 6px 6px 10px); }
            .buttons-row.align-spread > .button.format-stacked:not(.align-start, .align-center, .align-end, .align-spread) { flex: 1 1 0; }
            .buttons-row.align-spread > .button.format-stacked:not(.align-start, .align-center, .align-end, .align-spread) .button-content { flex: 1 1 auto; }
            /* Area-level → vertical buttons */
            .buttons-row.align-start > .button.format-vertical:not(.align-start, .align-center, .align-end, .align-spread) { align-items: flex-start; text-align: start; }
            .buttons-row.align-start > .button.format-vertical:not(.align-start, .align-center, .align-end, .align-spread) .button-content { align-items: flex-start; text-align: start; }
            .buttons-row.align-end > .button.format-vertical:not(.align-start, .align-center, .align-end, .align-spread) { align-items: flex-end; text-align: end; }
            .buttons-row.align-end > .button.format-vertical:not(.align-start, .align-center, .align-end, .align-spread) .button-content { align-items: flex-end; text-align: end; }
            /* Position-based vertical alignment for stacked/vertical in non-scroll rows */
            .buttons-row[class*="pos-bottom"]:not(.has-visible-count) > .button.format-stacked,
            .buttons-row[class*="pos-bottom"]:not(.has-visible-count) > .button.format-vertical { align-content: end; }
            .buttons-row[class*="pos-top"]:not(.has-visible-count) > .button.format-stacked,
            .buttons-row[class*="pos-top"]:not(.has-visible-count) > .button.format-vertical { align-content: start; }
            .buttons-row:where(.pos-center, .pos-left, .pos-right):not(.has-visible-count) > :where(.button.format-stacked, .button.format-vertical),
            .buttons-row.has-visible-count > :where(.button.format-stacked, .button.format-vertical) { align-content: center; }
            .buttons-row[class*="pos-bottom"]:not(.has-visible-count).has-enhanced-child { align-items: flex-end; }
            .buttons-row[class*="pos-top"]:not(.has-visible-count).has-enhanced-child { align-items: flex-start; }
            /* Button layout: button > [icon][content > name,val]; format sets flex direction, gap sets spacing */
            /* Base button (flex row) */
            .button { display: flex; align-items: center; gap: var(--awc-button-gap, 6px); flex: 0 0 auto; min-width: 0; max-width: 100%; white-space: nowrap; box-sizing: border-box; scroll-snap-align: start; padding: var(--awc-buttons-padding, 0); cursor: pointer; -webkit-tap-highlight-color: transparent; transition: transform 0.4s cubic-bezier(0.2, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.2, 0, 0.2, 1); }
            .button:active { transform: scale(0.94); opacity: 0.75; transition: transform 0.12s cubic-bezier(0.2, 0, 0.2, 1), opacity 0.12s cubic-bezier(0.2, 0, 0.2, 1); }
            /* Button icon */
            .button .button-icon { flex: 0 0 auto; display: flex; align-items: center; justify-content: center; padding: var(--awc-icon-padding, 0); }
            .button .button-icon ha-icon,
            .button .button-icon ha-state-icon { --mdc-icon-size: var(--awc-icon-size, 1.1em); opacity: 0.9; }
            .button .button-icon svg.awc-icon { display: block; width: var(--awc-icon-size, 1.1em); height: var(--awc-icon-size, 1.1em); opacity: 0.9; }
            .button .button-icon svg.awc-icon.awc-colored { opacity: 1; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15)); }
            .button .button-icon img.custom-bottom-icon { display: block; height: var(--awc-icon-size, 1.1em); width: var(--awc-icon-size, 1.1em); object-fit: contain; }
            /* Button content wrapper (holds name + val) */
            .button .button-content { display: flex; flex-direction: row; align-items: center; gap: var(--awc-button-text-gap, 0.35em); min-width: 0; flex: 1 1 auto; }
            /* Button name */
            .button .button-name { font-size: var(--awc-button-name-font-size, inherit); font-weight: var(--awc-button-name-weight, 500); opacity: var(--awc-button-name-opacity, 0.7); color: var(--awc-button-name-color, inherit); flex: 0 0 auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .button:not(.with-bg) .button-name { opacity: var(--awc-button-name-opacity, var(--awc-bottom-opacity, 0.7)); }
            .button.has-icon-bg.frosted:not(.with-bg) .button-name { opacity: var(--awc-button-name-opacity, var(--awc-bottom-opacity, 0.7)); }
            /* Button value */
            .button .button-val { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; display: inline-block; font-weight: var(--awc-button-value-weight, 700); opacity: var(--awc-button-value-opacity, 1); max-width: 100%; }
            .button .button-val,
            .button .button-name { text-shadow: var(--_button-no-bg-shadow, none); }
            .button .button-val .fancy-unit { font-size: 0.55em; font-weight: 500; opacity: 0.7; vertical-align: baseline; position: relative; top: -0.45em; margin-left: 3px; }
            /* Element-disabled states */
            .button.icon-only { gap: 0; }
            .button.no-icon .button-content { flex: 1 1 auto; }
            .button.no-name .button-content { flex: 1 1 auto; }
            /* When name is empty in stacked/vertical, value fills the space */
            .button.format-stacked .button-name:empty + .button-val,
            .button.format-vertical .button-name:empty + .button-val { flex: 1 1 auto; }
            /* Overflow modes */
            .button.overflow-clip .button-val { text-overflow: clip; }
            .button.overflow-wrap .button-val { white-space: normal; overflow: visible; text-overflow: clip; }
            .button.overflow-wrap:not(.format-stacked):not(.format-vertical) .button-val { display: inline; }
            /* Background styles */
            .button.with-bg { --_bg: var(--awc-bottom-bg-color, var(--_text-bg)); padding: var(--awc-buttons-padding, 5px 10px); text-shadow: none; border-radius: var(--awc-bottom-bg-radius, calc(var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)) - 5px)); align-items: center; }
            .button.with-bg .button-val,
            .button.with-bg .button-name { text-shadow: none; }
            /* Color tint */
            .button.has-tint { position: relative; }
            .button.has-tint::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: var(--awc-button-tint); opacity: 0.18; pointer-events: none; transition: background 0.4s ease; z-index: 0; }
            .button.has-tint > * { position: relative; z-index: 1; }
            /* Format: stacked — icon left, name and value in a column */
            .button.format-stacked .button-content { flex-direction: column; gap: var(--awc-button-text-gap, 4px); align-items: flex-start; }
            .button.format-stacked .button-icon { align-self: stretch; aspect-ratio: 1; overflow: visible; border-radius: var(--awc-stacked-icon-radius, calc(var(--awc-bottom-bg-radius, calc(var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)) - 5px)) - var(--awc-stacked-icon-inset, 3px))); padding: var(--awc-icon-padding, 4px); flex: 0 0 auto; }
            .button.format-stacked .button-icon ha-icon,
            .button.format-stacked .button-icon ha-state-icon { --mdc-icon-size: var(--awc-icon-size, 1.3em); opacity: 1; }
            .button.format-stacked .button-icon img.custom-bottom-icon { height: var(--awc-icon-size, 1.3em); width: var(--awc-icon-size, 1.3em); }
            .button.format-stacked .button-icon svg.awc-icon { width: var(--awc-icon-size, 1.3em); height: var(--awc-icon-size, 1.3em); opacity: 1; }
            .button.format-stacked .button-name { font-size: var(--awc-button-name-font-size, var(--awc-stacked-name-size, 0.85em)); opacity: var(--awc-stacked-name-opacity, 0.7); line-height: 1.2; margin: 0; }
            .button.format-stacked .button-name:empty { display: none; }
            .button.format-stacked .button-val { font-weight: var(--awc-stacked-value-weight, 700); line-height: 1.2; flex: 0 0 auto; }
            .button.format-stacked.with-bg { padding: var(--awc-buttons-padding, 6px 10px 6px 6px); }
            .button.format-stacked.empty-name .button-icon { background: none; border: none; box-shadow: none; aspect-ratio: unset; align-self: center; }
            .button.format-stacked.has-icon-bg.with-bg { display: grid; grid-template-columns: auto 1fr; }
            .button.format-stacked.has-icon-bg.with-bg > .button-bar { grid-column: 1 / -1; }
            /* Format: vertical — icon on top, name and value below */
            .button.format-vertical { flex-direction: column; align-items: center; text-align: center; gap: var(--awc-button-gap, 6px); }
            .button.format-vertical .button-content { flex-direction: column; gap: var(--awc-button-text-gap, 4px); align-items: center; text-align: center; flex: 0 0 auto; max-width: 100%; }
            .button.format-vertical .button-icon { aspect-ratio: 1; overflow: visible; border-radius: var(--awc-stacked-icon-radius, calc(var(--awc-bottom-bg-radius, calc(var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)) - 5px)) - var(--awc-stacked-icon-inset, 3px))); padding: var(--awc-icon-padding, 4px); }
            .button.format-vertical .button-icon ha-icon,
            .button.format-vertical .button-icon ha-state-icon { --mdc-icon-size: var(--awc-icon-size, 1.6em); }
            .button.format-vertical .button-icon img.custom-bottom-icon { height: var(--awc-icon-size, 1.6em); width: var(--awc-icon-size, 1.6em); }
            .button.format-vertical .button-icon svg.awc-icon { width: var(--awc-icon-size, 1.6em); height: var(--awc-icon-size, 1.6em); }
            .button.format-vertical .button-name { font-size: var(--awc-button-name-font-size, var(--awc-stacked-name-size, 0.85em)); opacity: var(--awc-stacked-name-opacity, 0.7); line-height: 1.2; margin: 0; }
            .button.format-vertical .button-name:empty { display: none; }
            .button.format-vertical .button-val { font-weight: var(--awc-stacked-value-weight, 700); line-height: 1.2; flex: 0 0 auto; max-width: 100%; }
            .button.format-vertical.with-bg { padding: var(--awc-buttons-padding, 6px 10px); }
            .button.format-vertical:not(.has-icon-bg) .button-icon { background: none; border: none; box-shadow: none; aspect-ratio: unset; border-radius: 0; overflow: visible; padding: var(--awc-icon-padding, 0); }
            .button.format-vertical.empty-name .button-icon { background: none; border: none; box-shadow: none; aspect-ratio: unset; }
            /* Per-button alignment (class on the button itself) */
            /* Inline: per-button */
            .button.align-center:not(.format-stacked):not(.format-vertical) { justify-content: center; }
            .button.align-center:not(.format-stacked):not(.format-vertical), .button.align-center:not(.format-stacked):not(.format-vertical) .button-content { flex: 0 0 auto; text-align: center; }
            .button.align-end:not(.format-stacked):not(.format-vertical) { flex-direction: row-reverse; }
            .button.align-end:not(.format-stacked):not(.format-vertical) .button-val { flex: 0 0 auto; }
            .button.overflow-marquee:not(.marquee-label).align-center .button-val,
            .button.overflow-marquee:not(.marquee-label).align-end .button-val { flex: 1 1 auto; min-width: 0; }
            .button.align-spread:not(.format-stacked):not(.format-vertical) { flex: 1 1 0; }
            .button.align-spread:not(.format-stacked):not(.format-vertical) .button-content { justify-content: space-between; }
            .button.align-spread.no-name:not(.format-stacked):not(.format-vertical) { justify-content: space-between; }
            .button.align-spread.no-name:not(.format-stacked):not(.format-vertical) .button-content { flex: 0 1 auto; }
            /* Stacked: per-button */
            .button.align-end.format-stacked { flex-direction: row-reverse; }
            .button.align-end.format-stacked .button-content { align-items: flex-end; text-align: end; }
            .button.align-end.format-stacked.with-bg { padding: var(--awc-buttons-padding, 6px 6px 6px 10px); }
            .button.align-spread.format-stacked { flex: 1 1 0; }
            .button.align-spread.format-stacked .button-content { flex: 1 1 auto; }
            .button.align-spread.format-stacked .button-val { text-align: right; align-self: flex-end; }
            /* Vertical: per-button */
            .button.align-start.format-vertical { align-items: flex-start; text-align: start; }
            .button.align-start.format-vertical .button-content { align-items: flex-start; text-align: start; }
            .button.align-center.format-vertical { align-items: center; text-align: center; }
            .button.align-center.format-vertical .button-content { align-items: center; text-align: center; }
            .button.align-end.format-vertical { align-items: flex-end; text-align: end; }
            .button.align-end .button-content { text-align: end; justify-content: flex-end; }
            /* Icon background (same rules for all formats) */
            .button.no-icon-bg .button-icon { background: none !important; border: none !important; box-shadow: none !important; aspect-ratio: unset !important; border-radius: 0 !important; overflow: visible !important; padding: var(--awc-icon-padding, 0) !important; }
            .button.has-icon-bg .button-icon { aspect-ratio: 1; overflow: visible; border-radius: var(--awc-stacked-icon-radius, calc(var(--awc-bottom-bg-radius, calc(var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)) - 5px)) - var(--awc-stacked-icon-inset, 3px))); padding: var(--awc-icon-padding, 4px); align-self: stretch; }
            .button.has-icon-bg:not(.with-bg) .button-icon { background: var(--_bg, var(--awc-bottom-bg-color, var(--_text-bg))); border: var(--awc-bg-border, 1px solid var(--_text-bg-border, transparent)); box-shadow: var(--awc-icon-bg-shadow, var(--_frosted-inset, none)); }
            .button.has-icon-bg:not(.with-bg).frosted .button-icon { backdrop-filter: var(--awc-bottom-bg-filter, blur(10px)); -webkit-backdrop-filter: var(--awc-bottom-bg-filter, blur(10px)); }
            .button.has-icon-bg:not(.with-bg).contrast .button-icon { box-shadow: var(--awc-icon-bg-shadow, var(--_contrast-shadow, none)); border: none; }
            .button.has-icon-bg:not(.with-bg).theme .button-icon { background: var(--ha-card-background, var(--card-background-color, var(--primary-background-color))); border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color)); box-shadow: var(--ha-card-box-shadow, none); }
            .button.has-icon-bg.with-bg .button-icon { background: var(--awc-stacked-icon-bg, color-mix(in srgb, var(--ha-card-background, var(--card-background-color, var(--primary-background-color))) 20%, transparent)); border: none; box-shadow: var(--awc-icon-bg-shadow, 0 2px 6px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.12)); }
            .button.has-icon-bg.with-bg.frosted .button-icon { border: var(--_stacked-icon-border, none); }
            .button.has-icon-bg.with-bg.contrast .button-icon { box-shadow: var(--awc-icon-bg-shadow, var(--_stacked-icon-shadow, 0 2px 6px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.12))); }
            .button.has-icon-bg.with-bg.theme .button-icon { border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color)); }
            .button-free { position: absolute; pointer-events: auto; z-index: 99; font-family: var(--ha-font-family, var(--paper-font-body1_-_font-family, sans-serif)); font-size: var(--awc-bottom-font-size, 16px); font-weight: var(--awc-bottom-font-weight, 500); max-width: calc(100% - var(--_awc-pad-h, var(--awc-card-padding, 16px)) * 2); box-sizing: border-box; text-shadow: var(--_button-no-bg-shadow, none); }
            .button.button-round.with-bg { border-radius: 999px; }
            .button.button-round .button-icon { border-radius: 999px; }
            .button.button-ring { position: relative; border-radius: 50%; aspect-ratio: 1; justify-content: center; align-content: center; z-index: 1; padding: var(--awc-buttons-padding, 10px); }
            .buttons-group.has-row-wrap .button.button-ring { height: 100%; }
            .button.button-ring.with-bg { border-radius: 50%; padding: var(--awc-buttons-padding, 10px); }
            .button-ring-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; scroll-snap-align: start; }
            .button-ring-wrap::before { content: ""; position: absolute; inset: 0; border-radius: 50%; background: var(--awc-ring-gradient, conic-gradient(var(--awc-ring-color, var(--primary-color, #03a9f4)) var(--awc-ring-pct, 0%), transparent 0)); -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); mask: radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); transition: --awc-ring-pct 0.6s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; z-index: 0; }
            .button-ring-wrap.has-segments::before { -webkit-mask: conic-gradient(#000 var(--awc-ring-pct, 0%), transparent 0), radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); mask: conic-gradient(#000 var(--awc-ring-pct, 0%), transparent 0), radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); -webkit-mask-composite: source-in; mask-composite: intersect; }
            .button-ring-track { position: absolute; inset: 0; border-radius: 50%; -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); mask: radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); background: currentColor; opacity: 0.10; pointer-events: none; }
            .button-ring-wrap > .button { margin: var(--awc-ring-gap, 3px); z-index: 1; }
            .buttons-row.row-grid > .button-ring-wrap > .button,
            .buttons-row.has-visible-count > .button-ring-wrap > .button { width: calc(100% - var(--awc-ring-gap, 3px) * 2); }
            .buttons-row.row-grid > .button-ring-wrap { aspect-ratio: 1; }
            .button-bar { --_bar-radius: calc(var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)) * 0.35); position: relative; width: 100%; height: var(--awc-bar-h, 4px); min-height: var(--awc-bar-h, 4px); border-radius: var(--_bar-radius); overflow: hidden; flex-shrink: 0; }
            .button-bar-track { position: absolute; inset: 0; border-radius: inherit; background: currentColor; opacity: 0.10; }
            .button-bar-fill { position: absolute; inset: 0; border-radius: inherit; background: var(--awc-bar-gradient, var(--awc-bar-color, var(--primary-color, #03a9f4))); transform-origin: left center; transform: scaleX(var(--awc-bar-scale, 0)); transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
            .button.button-bar-type { flex-wrap: wrap; }
            .button.button-bar-type.format-vertical { flex-wrap: nowrap; }
            .button.button-bar-type.format-vertical .button-bar { align-self: stretch; }
            .button.button-loading { position: relative; }
            .button.button-loading .button-icon,
            .button.button-loading .button-name,
            .button.button-loading .button-val,
            .button.button-loading .button-bar { visibility: hidden; }
            .button-ring-wrap.button-loading .button-ring-track,
            .button-ring-wrap.button-loading::before { visibility: hidden; }
            .button-loader { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 5px; pointer-events: none; }
            .button-loader span { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0.2; animation: awc-dot-pulse 1.2s ease-in-out infinite; }
            .button-loader span:nth-child(2) { animation-delay: 0.2s; }
            .button-loader span:nth-child(3) { animation-delay: 0.4s; }
@keyframes awc-dot-pulse {
                0%, 60%, 100% { opacity: 0.2; transform: scale(0.85); }
                30%           { opacity: 0.7; transform: scale(1); }
            }
            :where(.button .button-val, .button .button-name, .button-sub).awc-marquee-host { overflow: hidden; text-overflow: clip; contain: layout style; }
            .button.marquee-value .button-name { flex: 0 0 auto; }
            .button.marquee-label .button-name { flex: 1 1 auto; min-width: 0; }
            .button.marquee-label .button-val { flex: 0 0 auto; }
            .button.marquee-both .button-name { flex: 1 1 auto; min-width: 0; }
            .button.marquee-both .button-val { flex: 1 1 auto; min-width: 0; }
            :where(.button .button-val, .button .button-name, .button-sub).awc-marquee-host.is-animating { -webkit-mask-image: linear-gradient(to right, transparent 0, #000 var(--awc-marquee-fade, 12px), #000 calc(100% - var(--awc-marquee-fade, 12px)), transparent 100%); mask-image: linear-gradient(to right, transparent 0, #000 var(--awc-marquee-fade, 12px), #000 calc(100% - var(--awc-marquee-fade, 12px)), transparent 100%); }
            .awc-marquee-track { display: inline-block; white-space: nowrap; }
            .awc-marquee-text { display: inline; }
            .awc-marquee-sep { display: inline-block; padding: 0 var(--awc-marquee-sep-gap, 0.4em); opacity: 0.5; }
            .awc-marquee-sep::before { content: var(--awc-marquee-separator, "•"); }
            .awc-marquee-host.is-animating .awc-marquee-track { will-change: transform; animation: awc-marquee var(--awc-marquee-duration, 20s) linear infinite; }
            .awc-marquee-host.awc-marquee-rtl .awc-marquee-track { animation-direction: reverse; }
@keyframes awc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .awc-marquee-host.is-animating .awc-marquee-track { animation: none; will-change: auto; } }
            #custom-cards-wrapper { position: absolute; inset: 0; box-sizing: border-box; z-index: 10; display: none; flex-wrap: wrap; flex-direction: var(--awc-custom-cards-direction, row); gap: var(--awc-custom-cards-gap, 8px); justify-content: var(--awc-custom-cards-justify, flex-start); align-items: var(--awc-custom-cards-align, flex-start); padding: var(--awc-card-padding, var(--ha-space-4, 16px)); pointer-events: none; overflow: visible; }
            #custom-cards-wrapper.has-cards { display: flex; }
            #custom-cards-wrapper > * { pointer-events: auto; }
            #custom-cards-wrapper.cc-text-left { justify-content: flex-start; }
            #custom-cards-wrapper.cc-text-right { justify-content: flex-end; }
            #custom-cards-wrapper.cc-text-hcenter { justify-content: center; }
            #custom-cards-wrapper.cc-align-top { align-content: flex-start; }
            #custom-cards-wrapper.cc-align-center { align-content: center; }
            #custom-cards-wrapper.cc-align-bottom { align-content: flex-end; }

`;
    }
    _initDOM() {
        if (this._initialized) return; this._initialized = true;
        if (this._config.card_offset) this.style.margin = this._config.card_offset;
        const style = document.createElement('style'); style.textContent = AtmosphericWeatherCard._buildStyles();
        const root = document.createElement('div'); root.id = 'card-root';
        root.innerHTML = `<canvas id="star-bg-canvas"></canvas><canvas id="star-canvas"></canvas><canvas id="gl-canvas"></canvas><div id="awc-sunrays"><b></b></div><div id="awc-sunglow"></div><div id="awc-bottom-fade"></div><div id="awc-theme-adapt"></div><div id="awc-simple-bg"><div id="awc-sky-base" class="awc-sky-layer"></div><div id="awc-sky-glow" class="awc-sky-layer"></div></div><div id="awc-weather-bg"></div><div id="image-slot"><img /></div><div id="text-wrapper"></div><div id="custom-cards-wrapper"></div>`;
        this.shadowRoot.append(style, root); const q = (sel) => root.querySelector(sel);
        const glCanvas = q('#gl-canvas');
        glCanvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault(); this._stopAnimation(); this._destroyGL();
        }, false);
        glCanvas.addEventListener('webglcontextrestored', () => { this._initWebGL(); this._shaderParams = this._weatherToUniforms(); this._startAnimation(); }, false);
        const img = q('#image-slot > img');
        img.onerror = () => { img.style.opacity = '0'; };
        img.onload  = () => { img.style.opacity = '1'; };
        const textWrapper = q('#text-wrapper');
        textWrapper.addEventListener('click', (e) => this._handleButtonClick(e));
        const posSlots = {};
        for (const pos of ['top-left','top-center','top-right','left','center','right','bottom-left','bottom-center','bottom-right']) {
            const slot = document.createElement('div');
            slot.className = `awc-pos-slot pos-${pos}`;
            slot.dataset.pos = pos;
            textWrapper.appendChild(slot);
            posSlots[pos] = slot;
        }
        this._elements = {
            root, glCanvas, img, imageSlot: q('#image-slot'),
            starCanvas: q('#star-canvas'), starBgCanvas: q('#star-bg-canvas'),
            textWrapper,
            weatherBg: q('#awc-weather-bg'),
            simpleBg: q('#awc-simple-bg'),
            customCardsWrapper: q('#custom-cards-wrapper'),
            buttonAreaEls: [],
            posSlots,
        };
        this._syncButtonAreaDOM();
    }
    _syncButtonAreaDOM() {
        if (!this._elements || !this._elements.textWrapper) return;
        const wanted = this._areas.length, current = this._elements.buttonAreaEls;
        while (current.length > wanted) {
            const removed = current.pop();
            removed.group.remove();
        }
        while (current.length < wanted) {
            const idx = current.length;
            const group = document.createElement('div');
            group.className = 'buttons-group';
            group.dataset.area = String(idx);
            const row = document.createElement('div');
            row.className = 'buttons-row';
            group.appendChild(row);
            current.push({ group, row });
        }
        for (let i = 0; i < current.length; i++) {
            current[i].group.dataset.area = String(i);
        }
    }
    _applySlotDirections() {
        const slots = this._elements && this._elements.posSlots;
        if (!slots) return;
        const areas = this._areas || [];
        const slotPrefs = {};
        const slotCounts = {};
        for (const area of areas) {
            const pos = (area.position || 'bottom-left').toString().toLowerCase();
            slotCounts[pos] = (slotCounts[pos] || 0) + 1;
            if (!slotPrefs[pos] && area.stack_direction) {
                slotPrefs[pos] = area.stack_direction;
            }
        }
        for (const pos in slotCounts) {
            if (slotCounts[pos] > 1 && !slotPrefs[pos]) slotPrefs[pos] = 'vertical';
        }
        for (const [pos, slot] of Object.entries(slots)) {
            const pref = slotPrefs[pos];
            if (pref) {
                slot.classList.toggle('stack-h', pref === 'horizontal');
                slot.classList.toggle('stack-v', pref === 'vertical');
            } else {
                slot.classList.remove('stack-h', 'stack-v');
            }
        }
    }
    _updateSchemeStyles(isNight, weatherState) {
        const root = this._elements.root;
        const cfg = this._config || {};
        root.classList.toggle('scheme-night', this._isThemeDark);
        root.classList.toggle('scheme-day', !this._isThemeDark);
        const sunEnabled = cfg.sun_effects !== false;
        const styleSig = `${this._isThemeDark}_${weatherState}_${sunEnabled}`;
        if (this._prevStyleSig === styleSig) return; this._prevStyleSig = styleSig;
        if (this._prevWeatherClass) root.classList.remove(this._prevWeatherClass);
        const cls = `weather-${weatherState}`;
        root.classList.add(cls);
        this._prevWeatherClass = cls;
        const vis = WEATHER_VISUALS[weatherState] || WEATHER_VISUALS['default'];
        root.classList.toggle('has-sunrays', !!vis.sunrays && !isNight && sunEnabled);
    }
    _applyConfigStyles() {
        if (!this._elements || !this._elements.buttonAreaEls.length) return; const cfg = this._config;
        const root = this._elements.root;
        this._cssVar(root, '--awc-card-padding', cfg.card_padding || '', '_prevCardPadding');
        const bgB = cfg.bg_brightness != null ? String(cfg.bg_brightness) : '';
        const bgS = cfg.bg_saturation != null ? String(cfg.bg_saturation) : '';
        this._cssVar(root, '--awc-bg-brightness', bgB, '_prevBgBrightness');
        this._cssVar(root, '--awc-bg-saturation', bgS, '_prevBgSaturation');
        root.classList.toggle('has-bg-filter', !!bgB || !!bgS);
        const hasFade = cfg.bottom_fade === true;
        if (this._prevBottomFade !== hasFade) {
            this._prevBottomFade = hasFade;
            root.classList.toggle('has-bottom-fade', hasFade);
        }
        if (cfg.theme_adapt === false && this._prevAdaptMode) {
            root.classList.remove('adapt-dim', 'adapt-lift');
            this._prevAdaptMode = '';
        }
        const padRaw = (cfg.card_padding || '').toString().trim();
        if (padRaw && this._prevCardPadParsed !== padRaw) {
            this._prevCardPadParsed = padRaw; const parts = padRaw.split(/\s+/); root.style.setProperty('--_awc-pad-v', parts[0] || '');
            root.style.setProperty('--_awc-pad-h', parts[1] || parts[0] || '');
        } else if (!padRaw && this._prevCardPadParsed) {
            this._prevCardPadParsed = ''; root.style.removeProperty('--_awc-pad-v'); root.style.removeProperty('--_awc-pad-h');
        }
        if (!this._areaStyleCache) this._areaStyleCache = [];
        for (let ai = 0; ai < this._areas.length; ai++) {
            this._applyAreaStyles(ai, this._areas[ai]);
        }
    }
    _applyAreaStyles(ai, area) {
        const els = this._elements.buttonAreaEls[ai]; if (!els) return;
        const bt = els.row, cg = els.group;
        if (!this._areaStyleCache[ai]) this._areaStyleCache[ai] = {};
        const cache = this._areaStyleCache[ai];
        const showBottom = area.hide !== true;
        const showBottomBg = area.background === true;
        const bgStyle = ['contrast', 'frosted', 'theme'].includes((area.background_style || '').toLowerCase()) ? area.background_style.toLowerCase() : 'frosted';
        const configSig = `${showBottom}|${bgStyle}`;
        if (cache.configSig !== configSig) {
            cache.configSig = configSig;
            bt.style.display = showBottom ? '' : 'none'; cg.style.display = showBottom ? '' : 'none';
        }
        const cssVarArea = (el, prop, val, cacheKey) => {
            if (cache[cacheKey] !== val) { cache[cacheKey] = val; if (val) el.style.setProperty(prop, val); else el.style.removeProperty(prop); }
        };
        for (const [prop, key, ck] of [
            ['--awc-row-width', 'width', 'rowWidth'],
            ['--awc-row-height', 'height', 'rowHeight'],
            ['--awc-buttons-padding', 'button_padding', 'buttonPad'],
            ['--awc-container-padding', 'padding', 'containerPad'],
            ['--awc-container-bg-color', 'background_color', 'containerBgColor'],
            ['--awc-bottom-gap', 'gap', 'buttonsGap'],
            ['--awc-button-gap', 'button_gap', 'buttonGap'],
            ['--awc-button-text-gap', 'button_text_gap', 'buttonTextGap'],
            ['--awc-icon-size', 'button_icon_size', 'buttonIconWidth'],
            ['--awc-icon-padding', 'button_icon_padding', 'buttonIconPad'],
            ['--awc-bottom-font-size', 'button_text_size', 'bottomFS'],
            ['--awc-button-name-font-size', 'button_label_size', 'buttonNameFS'],
            ['--awc-sub-size', 'sub_value_size', 'subValueSize'],
            ['--awc-sub-weight', 'sub_value_weight', 'subValueWeight'],
        ]) cssVarArea(cg, prop, (area[key] || '').toString().trim(), ck);
        const cols = parseInt(area.columns, 10);
        cssVarArea(cg, '--awc-row-columns', Number.isFinite(cols) && cols > 0 ? String(cols) : '', 'rowCols');
        let rowLayout = (area.layout || 'wrap').toString().toLowerCase();
        const isGrouped = area.grouped === true;
        if (cache.rowOverflow !== rowLayout) {
            cache.rowOverflow = rowLayout;
            for (const m of ['horizontal-scroll', 'wrap', 'grid', 'vertical-scroll']) bt.classList.toggle('row-' + m, rowLayout === m);
            for (const m of ['horizontal-scroll', 'wrap', 'vertical-scroll']) cg.classList.toggle('has-row-' + m, rowLayout === m);
        }
        const visCount = parseInt(area.scroll_count, 10), hasVis = Number.isFinite(visCount) && visCount > 0;
        const visKey = `${hasVis}|${visCount}|${rowLayout}`;
        if (cache.visKey !== visKey) {
            cache.visKey = visKey; bt.classList.toggle('has-visible-count', hasVis);
            if (hasVis) {
                const gapVal = (area.gap || '8px').toString().trim() || '8px';
                bt.style.setProperty('--awc-button-basis', `calc((100% - ${visCount - 1} * ${gapVal}) / ${visCount})`);
                if (rowLayout === 'vertical-scroll') {
                    bt.style.setProperty('--awc-button-basis-v', `calc((100% - ${visCount - 1} * ${gapVal}) / ${visCount})`);
                } else {
                    bt.style.removeProperty('--awc-button-basis-v');
                }
            } else {
                bt.style.removeProperty('--awc-button-basis'); bt.style.removeProperty('--awc-button-basis-v');
            }
            if (!hasVis && rowLayout === 'vertical-scroll') {
                requestAnimationFrame(() => this._computeVerticalVisHeight(ai));
            } else if (rowLayout !== 'vertical-scroll' || hasVis) {
                bt.style.removeProperty('--awc-row-max-height');
            }
        }
        const hasSeparator = area.separator === true;
        const groupedKey = `${isGrouped}|${showBottomBg}|${bgStyle}|${hasSeparator}`;
        if (cache.grouped !== groupedKey) {
            cache.grouped = groupedKey; cg.classList.toggle('grouped', isGrouped); bt.classList.toggle('has-separator', hasSeparator);
            if (isGrouped && showBottomBg) {
                cg.classList.add('with-bg');
                for (const s of ['contrast', 'frosted', 'theme']) cg.classList.toggle(s, bgStyle === s);
            } else {
                cg.classList.remove('with-bg', 'contrast', 'frosted', 'theme');
            }
        }
        const gridSepKey = `${hasSeparator}|${rowLayout}|${cols}`;
        if (cache.gridSepKey !== gridSepKey) {
            cache.gridSepKey = gridSepKey;
            let existingSepStyle = cg.querySelector('.awc-grid-sep-style');
            if (hasSeparator && rowLayout === 'grid' && Number.isFinite(cols) && cols > 0) {
                const sel = `.buttons-row.row-grid.has-separator`;
                const sepCss = `
${sel} > .button { position: relative; overflow: visible; }
${sel} > .button::before { content: ""; position: absolute; pointer-events: none; top: 0; bottom: 0; inset-inline-start: calc((var(--awc-bottom-gap, 8px) / -2) - (var(--awc-separator-width, 2px) / 2)); width: var(--awc-separator-width, 2px); background: var(--awc-separator-color, color-mix(in srgb, currentColor 10%, transparent)); }
${sel} > .button::after { content: ""; position: absolute; pointer-events: none; left: 0; right: 0; top: calc((var(--awc-bottom-gap, 8px) / -2) - (var(--awc-separator-width, 2px) / 2)); height: var(--awc-separator-width, 2px); background: var(--awc-separator-color, color-mix(in srgb, currentColor 10%, transparent)); }
${sel} > .button:nth-child(${cols}n+1)::before { content: none; }
${sel} > .button:nth-child(-n+${cols})::after { content: none; }`;
                if (existingSepStyle) {
                    existingSepStyle.textContent = sepCss;
                } else {
                    const styleEl = document.createElement('style');
                    styleEl.className = 'awc-grid-sep-style';
                    styleEl.textContent = sepCss;
                    cg.prepend(styleEl);
                }
            } else {
                if (existingSepStyle) existingSepStyle.remove();
            }
        }
        const align = (area.align || 'start').toString().toLowerCase();
        if (cache.buttonAlign !== align) {
            cache.buttonAlign = align;
            for (const a of ['start', 'center', 'end', 'spread']) bt.classList.toggle(`align-${a}`, align === a);
        }
    }
    _updateTextElements(hass, wEntity, lang, weatherState = 'default') {
        if (!wEntity) return; if (!this._elements || !this._elements.buttonAreaEls.length) return;
        this._syncButtonAreaDOM();
        this._applyConfigStyles();
        if (this._numFmtLang !== lang) {
            this._numFmtLang = lang;
            this._numFmt = new Intl.NumberFormat(lang, { maximumFractionDigits: 1, minimumFractionDigits: 0 });
        }
        if (!this._areaRenderCache) this._areaRenderCache = [];
        let anyRowRebuilt = false, anyFreeRebuilt = false;
        const allRendered = [];
        for (let ai = 0; ai < this._areas.length; ai++) {
            const area = this._areas[ai];
            const els = this._elements.buttonAreaEls[ai]; if (!els) continue;
            const bt = els.row;
            const areaVisible = this._checkAreaVisibility(area, hass);
            els.group.style.display = areaVisible ? '' : 'none';
            if (!areaVisible) continue;
            const showBottomBg = area.background === true;
            const bgStyle = ['contrast', 'frosted', 'theme'].includes((area.background_style || '').toLowerCase()) ? area.background_style.toLowerCase() : 'frosted';
            const buttonFormatRaw = (area.button_style || 'inline').toLowerCase();
            const buttonFormat = buttonFormatRaw === 'stacked' ? 'stacked' : buttonFormatRaw === 'vertical' ? 'vertical' : 'inline';
            const rowLayout = (area.layout || 'wrap').toString().toLowerCase();
            const visCount = parseInt(area.scroll_count, 10), hasVis = Number.isFinite(visCount) && visCount > 0;
            const areaCtx = { button_icon_background: area.button_icon_background, button_background_color: area.button_background_color || '', button_icon_background_color: area.button_icon_background_color || '' };
            const rendered = area.buttons.map((button, idx) =>
                this._renderButton(button, idx, hass, weatherState, lang, showBottomBg, bgStyle, buttonFormat, ai, areaCtx)
            );
            allRendered.push(...rendered.filter(r => !r.hidden));
            if (!this._areaRenderCache[ai]) this._areaRenderCache[ai] = {};
            const ac = this._areaRenderCache[ai];
            const rowButtons = rendered.filter(r => !r.isFree), freeButtons = rendered.filter(r => r.isFree), rowSig = rowButtons.map(r => r.sig).join('§');
            const rowRebuilt = ac.lastLocStr !== rowSig;
            if (rowRebuilt) {
                ac.lastLocStr = rowSig; bt.innerHTML = rowButtons.map(r => r.html).join('');
                this._animateRings(bt, `a${ai}`);
                const hasEnhanced = rowButtons.some(r => r.html.includes('format-stacked') || r.html.includes('format-vertical'));
                bt.classList.toggle('has-enhanced-child', hasEnhanced);
                if (!hasVis && rowLayout === 'vertical-scroll') { requestAnimationFrame(() => this._computeVerticalVisHeight(ai)); }
                anyRowRebuilt = true;
            }
            if (rowLayout !== 'vertical-scroll' || hasVis) {
                if (ac.hadVertVis) { bt.style.removeProperty('--awc-row-max-height'); ac.hadVertVis = false; }
            } else {
                ac.hadVertVis = true;
            }
            const freeSig = freeButtons.map(r => r.sig).join('§'), freeRebuilt = ac.lastFreeSig !== freeSig;
            if (freeRebuilt) {
                ac.lastFreeSig = freeSig; const tw = this._elements.textWrapper;
                tw.querySelectorAll(`.button-free[data-area="${ai}"]`).forEach(el => el.remove());
                for (const r of freeButtons) {
                    const wrapper = document.createElement('div'); wrapper.className = 'button-free';
                    wrapper.dataset.area = String(ai);
                    const [anchorV, anchorH] = parseAnchor(r.posAnchor || 'top-left'); const padH = 'var(--_awc-pad-h, var(--awc-card-padding, 16px))';
                    const padV = 'var(--_awc-pad-v, var(--awc-card-padding, 16px))', ox = r.posX === 'pad' ? padH : parseCSSVal(r.posX);
                    const oy = r.posY === 'pad' ? padV : parseCSSVal(r.posY), tx = [];
                    if (anchorH === 'left') wrapper.style.left = ox;
                    else if (anchorH === 'right') wrapper.style.right = ox;
                    else { wrapper.style.left = '50%'; tx.push('translateX(-50%)'); }
                    if (anchorV === 'top') wrapper.style.top = oy;
                    else if (anchorV === 'bottom') wrapper.style.bottom = oy;
                    else { wrapper.style.top = '50%'; tx.push('translateY(-50%)'); }
                    if (tx.length) wrapper.style.transform = tx.join(' ');
                    if (r.width) { wrapper.style.width = `calc(${r.width})`; wrapper.style.maxWidth = `calc(100% - var(--_awc-pad-h, var(--awc-card-padding, 16px)) * 2)`; }
                    wrapper.innerHTML = r.html;
                    this._animateRings(wrapper, `f${ai}`);
                    tw.appendChild(wrapper);
                }
                anyFreeRebuilt = true;
            }
            const buttonsPos = (area.position || 'bottom-left').toString().toLowerCase();
            if (ac.prevPosSig !== buttonsPos) {
                ac.prevPosSig = buttonsPos;
                bt.classList.remove(...POS_CLASSES); els.group.classList.remove(...POS_CLASSES);
                bt.classList.add(`pos-${buttonsPos}`);
                els.group.classList.add(`pos-${buttonsPos}`);
                const slot = this._elements.posSlots && this._elements.posSlots[buttonsPos];
                if (slot && els.group.parentNode !== slot) {
                    slot.appendChild(els.group);
                }
            } else if (!els.group.parentNode) {
                const slot = this._elements.posSlots && this._elements.posSlots[buttonsPos];
                if (slot) slot.appendChild(els.group);
            }
        }
        this._applySlotDirections();
        if (anyRowRebuilt || anyFreeRebuilt) {
            this._nativeIconCache = null;
            this._refreshMarqueeObservation();
        }
        const hasNativeIcons = allRendered.some(r => r.showIcon && r.iconStrategy === 'native');
        if (hasNativeIcons) {
            if (!this._nativeIconCache || anyRowRebuilt || anyFreeRebuilt) {
                const allContainers = [...this._elements.buttonAreaEls.map(e => e.row), ...this._elements.textWrapper.querySelectorAll('.button-free')];
                this._nativeIconCache = [];
                for (let i = 0; i < allRendered.length; i++) {
                    const r = allRendered[i]; if (!r.showIcon || r.iconStrategy !== 'native') continue;
                    for (const container of allContainers) {
                        const iconEl = container.querySelector(`.button[data-idx="${r.buttonIdx}"][data-area="${r.areaIdx}"] ha-state-icon`);
                        if (iconEl) this._nativeIconCache.push({ rendered: r, el: iconEl });
                    }
                }
            }
            for (let j = 0; j < this._nativeIconCache.length; j++) {
                const entry = this._nativeIconCache[j], r = entry.rendered;
                if (entry.el.hass !== hass || entry.el.stateObj !== r.sensorObj) {
                    entry.el.hass = hass; entry.el.stateObj = r.sensorObj;
                }
            }
        }
        if (this._elements && this._elements.customCardsWrapper) {
            const firstAreaPos = this._areas.length > 0 ? (this._areas[0].position || 'bottom-left').toLowerCase() : 'bottom-left';
            const ccPos = (this._config.custom_cards_position || '').toLowerCase().trim();
            const ccSig = `${ccPos}|${firstAreaPos}`;
            if (this._prevCcSig !== ccSig) {
                this._prevCcSig = ccSig; const ccw = this._elements.customCardsWrapper;
                const allCcClasses = ['cc-text-left', 'cc-text-right', 'cc-text-hcenter', 'cc-align-top', 'cc-align-center', 'cc-align-bottom'];
                ccw.classList.remove(...allCcClasses);
                if (ccPos) {
                    const hClass = ccPos.includes('left') ? 'cc-text-left'
                                 : ccPos.includes('right') ? 'cc-text-right'
                                 : ccPos.includes('center') ? 'cc-text-hcenter'
                                 : null;
                    const vClass = ccPos.includes('top') ? 'cc-align-top'
                                 : ccPos.includes('bottom') ? 'cc-align-bottom'
                                 : ccPos.includes('center') ? 'cc-align-center'
                                 : 'cc-align-bottom';
                    if (hClass) ccw.classList.add(hClass); ccw.classList.add(vClass);
                } else {
                    ccw.classList.add('cc-align-bottom'); const buttonsIsLeft = firstAreaPos.includes('left'); const buttonsIsRight = firstAreaPos.includes('right');
                    ccw.classList.add(buttonsIsLeft ? 'cc-text-right' : buttonsIsRight ? 'cc-text-left' : 'cc-text-hcenter');
                }
            }
        }
    }
    _animateRings(container, prefix) {
        if (!this._ringPrevPct) this._ringPrevPct = new Map();
        const pfx = prefix || '';
        for (const wrap of container.querySelectorAll('.button-ring-wrap')) {
            const key = pfx + wrap.dataset.idx;
            const target = (wrap.style.getPropertyValue('--awc-ring-pct') || '0%').trim();
            const prev = this._ringPrevPct.get(key);
            wrap.style.setProperty('--awc-ring-pct', prev !== undefined ? prev : '0%');
            requestAnimationFrame(() => { wrap.style.setProperty('--awc-ring-pct', target); });
            this._ringPrevPct.set(key, target);
        }
        for (const fill of container.querySelectorAll('.button-bar-fill')) {
            const key = 'b' + pfx + fill.dataset.barIdx;
            const target = (fill.style.getPropertyValue('--awc-bar-scale') || '0').trim();
            const prev = this._ringPrevPct.get(key);
            fill.style.setProperty('--awc-bar-scale', prev !== undefined ? prev : '0');
            requestAnimationFrame(() => { fill.style.setProperty('--awc-bar-scale', target); });
            this._ringPrevPct.set(key, target);
        }
    }
    _renderButton(button, idx, hass, weatherState, lang, rowBg, bgStyle, buttonFormat, areaIdx, areaCtx) {
        if (!button.entity) return { html: '', sig: `skip-${idx}`, sensorObj: null, iconStrategy: 'static', showIcon: false, isFree: false, posAnchor: '', posX: '0', posY: '0', areaIdx, buttonIdx: idx, hidden: false };
        if (!this._checkButtonVisibility(button, hass)) {
            const visSig = JSON.stringify(button.visibility);
            return { html: '', sig: `hidden-${idx}-${visSig}`, sensorObj: null, iconStrategy: 'static', showIcon: false, isFree: false, posAnchor: '', posX: '0', posY: '0', areaIdx, buttonIdx: idx, hidden: true };
        }
        const showIcon = button.hide_icon !== true, showLabel = button.hide_label !== true, showValue = button.hide_value !== true;
        const effectiveFormat = button.style ? button.style : buttonFormat;
        const isEnhanced = effectiveFormat === 'stacked' || effectiveFormat === 'vertical';
        const isRingType = button.type === 'ring';
        let sensorObj = null, iconStrategy = 'static', iconValue = 'mdi:information-outline', formatted, unit;
        const isForecast = !!button.forecast; let fcCondition = null, fcDatetime = null, fcLoading = false, fcEntry = null;
        if (isForecast) {
            const fc = this._resolveFcValue(hass, button, lang);
            formatted = fc.formatted; unit = fc.unit; fcCondition = fc.condition; fcDatetime = fc.datetime;
            fcLoading = !!fc.loading; fcEntry = fc.entry || null;
            iconValue = fcCondition ? (WEATHER_ICONS[fcCondition] || WEATHER_ICONS['default']) : iconValue;
            if (button.attribute && button.attribute !== 'condition') iconValue = FORECAST_ATTR_ICONS[button.attribute] || iconValue;
        } else {
            const resolved = this._resolveSensorValue(hass, button.entity, button.attribute);
            formatted = resolved.formatted; unit = resolved.unit;
            if (resolved.haFormatted && button.unit_format !== undefined && resolved.rawNumeric != null) {
                formatted = this._formatNumber(resolved.rawNumeric);
            }
            const sensor = hass.states[button.entity];
            if (sensor) { if (button.attribute) iconValue = WEATHER_ATTR_ICONS[button.attribute] || 'mdi:information-outline'; else { sensorObj = sensor; iconStrategy = 'native'; } }
        }
        const configIcon = button.icon, configPath = button.icon_path || (configIcon === 'weather' && this._config && this._config.icon_path ? this._config.icon_path : '');
        if (configIcon) {
            const resolvedBase = (configIcon === 'weather') ? (isForecast && fcCondition ? fcCondition : weatherState) : configIcon;
            if (configPath) {
                iconStrategy = 'image';
                const basePath = configPath.endsWith('/') ? configPath : configPath + '/';
                const ext = resolvedBase.includes('.') ? '' : '.svg';
                iconValue = `${basePath}${resolvedBase}${ext}`;
            } else {
                if (configIcon === 'weather' && AWC_BUILTIN_ICONS[resolvedBase]) {
                    iconStrategy = 'builtin';
                    iconValue = (!isForecast && this._isTimeNight && AWC_BUILTIN_ICONS[`${resolvedBase}-night`]) ? `${resolvedBase}-night` : resolvedBase;
                } else {
                    iconStrategy = 'static';
                    iconValue = (configIcon === 'weather') ? (WEATHER_ICONS[resolvedBase] || WEATHER_ICONS['default']) : configIcon;
                }
            }
        }
        const hasUnitFormat = button.unit_format !== undefined; if (hasUnitFormat) unit = button.unit_format;
        const overflowMode = (button.overflow || 'ellipsis').toString().toLowerCase().trim();
        const labelOverflow = (button.label_overflow || 'ellipsis').toString().toLowerCase().trim();
        const isValueMarquee = overflowMode === 'marquee', isLabelMarquee = labelOverflow === 'marquee';
        const subOverflow = (button.sub_value_overflow || 'ellipsis').toString().toLowerCase().trim();
        const isSubMarquee = subOverflow === 'marquee';
        const hasAnyMarquee = isValueMarquee || isLabelMarquee || isSubMarquee;
        const marqueeSpeed = Math.max(5, parseFloat(button.marquee_speed) || 30);
        const marqueeRtl = button.marquee_rtl === true, width = (button.width || '').toString().trim(), height = (button.height || '').toString().trim();
        let name = (button.name || '').toString().trim(), nameSig = name;
        if (!name && !button.name_sensor && isForecast && fcDatetime) {
            name = fcLabel(fcDatetime, button.forecast !== 'hourly', lang);
            nameSig = `fc:${fcDatetime}`;
        }
        if (name && !button.name_sensor && button.name_format !== undefined) {
            name = `${name}${button.name_format}`;
            nameSig = `${nameSig}|nf:${button.name_format}`;
        }
        if (button.name_sensor) {
            const nameResolved = this._resolveSensorValue(hass, button.name_sensor, button.name_attribute);
            const hasNameFormat = button.name_format !== undefined;
            const nameUnit = hasNameFormat ? button.name_format : nameResolved.unit;
            name = hasNameFormat ? `${nameResolved.formatted}${nameUnit}` : (nameUnit ? `${nameResolved.formatted} ${nameUnit}` : `${nameResolved.formatted}`);
            nameSig = `ns:${button.name_sensor}|${button.name_attribute || ''}|${button.name_format != null ? button.name_format : ''}|${name}`;
        } else if (isForecast && button.name_attribute && fcEntry) {
            const nRaw = fcEntry[button.name_attribute];
            if (nRaw != null) {
                if (button.name_attribute === 'condition' && typeof nRaw === 'string') {
                    name = (typeof hass.localize === 'function' && hass.localize(`component.weather.entity_component._.state.${nRaw}`)) || nRaw;
                    if (button.name_format !== undefined) name = `${name}${button.name_format}`;
                } else if (nRaw !== '' && !isNaN(parseFloat(nRaw)) && isFinite(nRaw)) {
                    const _cs = hass.states[button.entity], _w = _cs && _cs.attributes;
                    const hasNameFormat = button.name_format !== undefined;
                    const nUnit = hasNameFormat ? button.name_format : ((_w && _w[`${button.name_attribute}_unit`]) || (_FC_UNIT_MAP[button.name_attribute] && _w && _w[_FC_UNIT_MAP[button.name_attribute]]) || _FC_UNIT_FALLBACK[button.name_attribute] || '');
                    const _nPrec = button.forecast_precision !== undefined ? button.forecast_precision : 0;
                    const _nFmtFn = (_nPrec !== undefined && _nPrec !== null) ? this._getFcFmt(lang, _nPrec) : null;
                    const nFmt = this._formatNumber(nRaw, _nFmtFn);
                    name = hasNameFormat ? `${nFmt}${nUnit}` : (nUnit ? `${nFmt} ${nUnit}` : `${nFmt}`);
                } else {
                    name = String(nRaw);
                    if (button.name_format !== undefined) name = `${name}${button.name_format}`;
                }
                nameSig = `ns-fc:${button.name_attribute}|${button.name_format != null ? button.name_format : ''}|${name}`;
            }
        }
        const showSubValue = button.hide_sub_value !== true && (button.sub_value_entity || button.sub_value_attribute);
        let subValue = '', subValueSig = '';
        if (showSubValue) {
            const hasSubFormat = button.sub_value_format !== undefined;
            if (button.sub_value_entity) {
                const svResolved = this._resolveSensorValue(hass, button.sub_value_entity, button.sub_value_attribute);
                const svUnit = hasSubFormat ? button.sub_value_format : svResolved.unit;
                subValue = hasSubFormat ? `${svResolved.formatted}${svUnit}` : (svUnit ? `${svResolved.formatted} ${svUnit}` : `${svResolved.formatted}`);
                subValueSig = `sv:${button.sub_value_entity}|${button.sub_value_attribute || ''}|${subValue}`;
            } else if (isForecast && button.sub_value_attribute && fcEntry) {
                const svRaw = fcEntry[button.sub_value_attribute];
                if (svRaw != null) {
                    let svFmt = svRaw;
                    if (button.sub_value_attribute === 'condition' && typeof svRaw === 'string') {
                        svFmt = (typeof hass.localize === 'function' && hass.localize(`component.weather.entity_component._.state.${svRaw}`)) || svRaw;
                    } else if (svRaw !== '' && !isNaN(parseFloat(svRaw)) && isFinite(svRaw)) {
                        const precision = button.forecast_precision !== undefined ? button.forecast_precision : 0;
                        const fmt = (precision !== undefined && precision !== null)
                            ? this._getFcFmt(lang, precision) : null;
                        svFmt = this._formatNumber(svRaw, fmt);
                    }
                    if (hasSubFormat) {
                        subValue = `${svFmt}${button.sub_value_format}`;
                    } else {
                        const _buttonState = hass.states[button.entity];
                        const w = _buttonState && _buttonState.attributes;
                        const svUnit = (w && w[`${button.sub_value_attribute}_unit`]) || (_FC_UNIT_MAP[button.sub_value_attribute] && w && w[_FC_UNIT_MAP[button.sub_value_attribute]]) || _FC_UNIT_FALLBACK[button.sub_value_attribute] || '';
                        subValue = svUnit ? `${svFmt} ${svUnit}` : `${svFmt}`;
                    }
                    subValueSig = `sv-fc:${button.sub_value_attribute}|${subValue}`;
                }
            }
        }
        let iconHtml = '';
        if (showIcon) {
            let inner;
            if (iconStrategy === 'native') {
                inner = '<ha-state-icon></ha-state-icon>';
            } else if (iconStrategy === 'image') {
                inner = `<img src="${iconValue}" class="custom-bottom-icon" />`;
            } else if (iconStrategy === 'builtin') {
                const useColored = (this._config && this._config.icon_set === 'colored');
                const iconLib = useColored ? AWC_COLORED_ICONS : AWC_BUILTIN_ICONS;
                const svgAttrs = useColored
                    ? 'fill="none" stroke="none"'
                    : 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
                inner = `<svg class="awc-icon${useColored ? ' awc-colored' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ${svgAttrs}>${iconLib[iconValue] || iconLib['default']}</svg>`;
            } else {
                inner = `<ha-icon icon="${iconValue}"></ha-icon>`;
            }
            iconHtml = `<span class="button-icon">${inner}</span>`;
        }
        const nameHtml = showLabel && (name || isEnhanced)
            ? (isLabelMarquee
                ? `<span class="button-name awc-marquee-host" data-speed="${marqueeSpeed}" data-rtl="${marqueeRtl ? 1 : 0}"><span class="awc-marquee-track"><span class="awc-marquee-text">${name}</span></span></span>`
                : `<span class="button-name">${name}</span>`)
            : '';
        const useFancyUnit = button.fancy_unit === true; let inner;
        if (useFancyUnit) {
            let fancyVal = formatted;
            let fancyUnitStr = unit;
            if (!isForecast) {
                const sensor = hass.states[button.entity];
                const isWeather = sensor && sensor.attributes && sensor.attributes.temperature !== undefined;
                if (!button.attribute || button.attribute === 'temperature') {
                    const rawTemp = isWeather ? sensor.attributes.temperature : (sensor && sensor.state);
                    const rawUnit = isWeather ? (sensor.attributes.temperature_unit || '') : (sensor && sensor.attributes && sensor.attributes.unit_of_measurement || '');
                    fancyVal = (rawTemp != null && this._numFmt) ? this._numFmt.format(rawTemp) : (rawTemp != null ? rawTemp : formatted);
                    if (!hasUnitFormat) fancyUnitStr = rawUnit;
                }
            }
            inner = `${fancyVal}<span class="fancy-unit">${fancyUnitStr}</span>`;
        } else {
            inner = hasUnitFormat ? `${formatted}${unit}` : (unit ? `${formatted} ${unit}` : `${formatted}`);
        }
        let subBelowHtml = '';
        if (subValue) {
            if (isSubMarquee) {
                subBelowHtml = `<span class="button-sub awc-marquee-host" data-speed="${marqueeSpeed}" data-rtl="${marqueeRtl ? 1 : 0}"><span class="awc-marquee-track"><span class="awc-marquee-text">${subValue}</span></span></span>`;
            } else {
                subBelowHtml = `<span class="button-sub">${subValue}</span>`;
            }
        }
        const valHtml = !showValue ? ''
            : isValueMarquee
            ? `<span class="button-val awc-marquee-host" data-speed="${marqueeSpeed}" data-rtl="${marqueeRtl ? 1 : 0}"><span class="awc-marquee-track"><span class="awc-marquee-text">${inner}</span></span></span>`
            : `<span class="button-val">${inner}</span>`;
        const isFree = (button.position || '').toString().toLowerCase() === 'custom';
        const posAnchor = isFree ? (button.position_anchor || 'top-left') : '', posX = isFree ? String(button.position_x || 0).trim() : '0';
        const posY = isFree ? String(button.position_y || 0).trim() : '0';
        const effectiveBg = button.background !== undefined ? button.background : rowBg;
        const classes = ['button', `overflow-${overflowMode}`];
        if (hasAnyMarquee) {
            classes.push('overflow-marquee'); if (isLabelMarquee && isValueMarquee) classes.push('marquee-both');
            else if (isLabelMarquee) classes.push('marquee-label');
            else if (isValueMarquee) classes.push('marquee-value');
        }
        if (fcLoading) classes.push('button-loading');
        if (subValue) classes.push('has-sub');
        if (!showIcon) classes.push('no-icon');
        if (!nameHtml) classes.push('no-name');
        else if (isEnhanced && !name) classes.push('empty-name');
        if (!showLabel && !showValue) classes.push('icon-only'); if (effectiveFormat === 'stacked') classes.push('format-stacked');
        else if (effectiveFormat === 'vertical') classes.push('format-vertical');
        if (isRingType) classes.push('button-ring');
        const iconBg = button.icon_background !== undefined ? button.icon_background : areaCtx.button_icon_background;
        if (iconBg === true) classes.push('has-icon-bg');
        else if (iconBg === false) classes.push('no-icon-bg');
        if (effectiveBg) {
            classes.push('with-bg');
            if (bgStyle === 'contrast' || bgStyle === 'frosted' || bgStyle === 'theme') classes.push(bgStyle);
        } else if (iconBg === true || (iconBg !== false && areaCtx.button_icon_background === true)) {
            if (bgStyle === 'contrast' || bgStyle === 'frosted' || bgStyle === 'theme') classes.push(bgStyle);
        }
        const effectiveBgColor = button.background_color || areaCtx.button_background_color || '';
        const effectiveIconBgColor = button.icon_background_color || areaCtx.button_icon_background_color || '';
        let buttonTintColor = '';
        if (Array.isArray(button.color_thresholds) && button.color_thresholds.length) {
            const ctEntity = button.color_threshold_entity || button.entity;
            const ctAttr = button.color_threshold_attribute || button.attribute;
            let ctVal;
            if (isForecast && fcEntry) {
                const fca = button.color_threshold_entity ? button.color_threshold_attribute : (ctAttr || button.attribute);
                if (button.color_threshold_entity) {
                    const ctr = this._resolveSensorValue(hass, button.color_threshold_entity, button.color_threshold_attribute);
                    ctVal = parseFloat(ctr.rawNumeric != null ? ctr.rawNumeric : ctr.formatted);
                } else {
                    ctVal = parseFloat(fcEntry[fca]);
                }
            } else if (ctEntity) {
                const ctr = this._resolveSensorValue(hass, ctEntity, ctAttr);
                ctVal = parseFloat(ctr.rawNumeric != null ? ctr.rawNumeric : ctr.formatted);
            }
            if (!isNaN(ctVal)) {
                const sorted = [...button.color_thresholds].filter(t => t.value !== '' && t.value !== undefined && t.color).sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
                for (const t of sorted) { if (ctVal >= parseFloat(t.value)) buttonTintColor = t.color; }
            }
        }
        const inlineStyles = [];
        if (width) inlineStyles.push(isFree ? 'width:100%;max-width:100%' : `width:${width};max-width:${width}`);
        if (height) inlineStyles.push(`height:${height}`);
        if (effectiveBgColor) inlineStyles.push(`--awc-bottom-bg-color:${effectiveBgColor}`);
        if (effectiveIconBgColor) inlineStyles.push(`--awc-stacked-icon-bg:${effectiveIconBgColor}`);
        if (buttonTintColor) { inlineStyles.push(`--awc-button-tint:${buttonTintColor}`); classes.push('has-tint'); }
        if (button.padding !== undefined && button.padding !== '') inlineStyles.push(`padding:${button.padding}`);
        const _wOp = (w) => { const n = parseFloat(w); if (isNaN(n)) return ''; return Math.min(1, Math.max(0.4, 0.4 + (n - 100) * 0.6 / 800)).toFixed(2); };
        for (const [k, v, v2] of [
            ['text_size','--awc-bottom-font-size'], ['label_size','--awc-button-name-font-size'], ['inner_gap','--awc-button-gap'],
            ['text_gap','--awc-button-text-gap'], ['icon_size','--awc-icon-size'], ['icon_padding','--awc-icon-padding'],
            ['value_weight','--awc-button-value-weight','--awc-stacked-value-weight'], ['label_weight','--awc-button-name-weight'],
            ['sub_value_size','--awc-sub-size'], ['sub_value_weight','--awc-sub-weight'],
        ]) { if (button[k]) { inlineStyles.push(`${v}:${button[k]}`); if (v2) inlineStyles.push(`${v2}:${button[k]}`); } }
        if (button.label_weight) { const o = _wOp(button.label_weight); if (o) { inlineStyles.push(`--awc-button-name-opacity:${o}`); inlineStyles.push(`--awc-stacked-name-opacity:${o}`); } }
        if (button.value_weight) { const o = _wOp(button.value_weight); if (o) inlineStyles.push(`--awc-button-value-opacity:${o}`); }
        if (button.sub_value_weight) { const o = _wOp(button.sub_value_weight); if (o) inlineStyles.push(`--awc-sub-opacity:${o}`); }
        if (button.text_size) inlineStyles.push(`font-size:${button.text_size}`);
        if (button.text_shadow === true) inlineStyles.push('--_button-no-bg-shadow:var(--_button-shadow-avail)');
        if (subOverflow === 'clip') inlineStyles.push('--awc-sub-overflow:clip');
        else if (subOverflow === 'wrap') inlineStyles.push('--awc-sub-overflow:clip;--awc-sub-wrap:normal;--awc-sub-visible:visible');
        const isBarType = button.type === 'bar';
        let gaugeVal = parseFloat(formatted), gaugeSig = '';
        if ((isRingType || isBarType) && button.gauge_entity) {
            const gr = this._resolveSensorValue(hass, button.gauge_entity, button.gauge_attribute);
            gaugeVal = parseFloat(gr.rawNumeric != null ? gr.rawNumeric : gr.formatted);
            gaugeSig = `${button.gauge_entity}|${button.gauge_attribute || ''}|${gaugeVal}`;
        } else if ((isRingType || isBarType) && !button.gauge_entity && isForecast && button.gauge_attribute && fcEntry) {
            const gRaw = fcEntry[button.gauge_attribute];
            if (gRaw != null) gaugeVal = parseFloat(gRaw);
            gaugeSig = `fc-g:${button.gauge_attribute}|${gaugeVal}`;
        }
        let ringHtml = '', ringWrapStyle = '', hasSegments = false, barHtml = '';
        if (isRingType) {
            const ringMin = parseFloat(button.ring_min) || 0, ringMax = parseFloat(button.ring_max) || 100;
            const ringW = parseFloat(button.ring_width) || 4, ringGap = parseFloat(button.ring_gap) || 3;
            const g = computeGauge(gaugeVal, ringMin, ringMax, (button.ring_color || '').trim(), Array.isArray(button.ring_thresholds) ? button.ring_thresholds : [], button.ring_threshold_mode || 'solid');
            hasSegments = g.hasSegments;
            ringHtml = '<div class="button-ring-track"></div>';
            const styleParts = [`--awc-ring-pct:${g.pct}%`, `--awc-ring-w:${ringW}px`, `--awc-ring-gap:${ringGap}px`];
            if (g.gradient) styleParts.push(`--awc-ring-gradient:conic-gradient(${g.gradient})`);
            else if (g.effectiveColor) styleParts.push(`--awc-ring-color:${g.effectiveColor}`);
            ringWrapStyle = styleParts.join(';');
        }
        if (isBarType) {
            const barMin = parseFloat(button.bar_min) || 0, barMax = parseFloat(button.bar_max) || 100;
            const barH = parseFloat(button.bar_height) || 4;
            const g = computeGauge(gaugeVal, barMin, barMax, (button.bar_color || '').trim(), Array.isArray(button.bar_thresholds) ? button.bar_thresholds : [], button.bar_threshold_mode || 'solid');
            classes.push('button-bar-type');
            const scale = (parseFloat(g.pct) / 100).toFixed(4);
            const fillStyles = [`--awc-bar-scale:${scale}`];
            if (g.barGradient) fillStyles.push(`--awc-bar-gradient:linear-gradient(to right, ${g.barGradient})`);
            else if (g.effectiveColor) fillStyles.push(`--awc-bar-color:${g.effectiveColor}`);
            barHtml = `<div class="button-bar" style="--awc-bar-h:${barH}px"><div class="button-bar-track"></div><div class="button-bar-fill" data-bar-idx="${idx}" style="${fillStyles.join(';')}"></div></div>`;
        }
        const buttonAlignClass = button.align || '';
        if (buttonAlignClass) classes.push(`align-${buttonAlignClass}`);
        if (button.button_round === true) classes.push('button-round');
        const loaderHtml = fcLoading ? '<div class="button-loader"><span></span><span></span><span></span></div>' : '';
        const elOrder = button.element_order ? button.element_order.toString().split(',').map(s => s.trim().toLowerCase()) : null;
        let iconOrder = '', contentOrder = '', barOrder = '';
        if (elOrder && elOrder.length >= 2) {
            const textIdx = elOrder.indexOf('text');
            const iconIdx = elOrder.indexOf('icon');
            const barIdx = elOrder.indexOf('bar');
            if (iconIdx >= 0) iconOrder = ` style="order:${iconIdx}"`;
            if (textIdx >= 0) contentOrder = ` style="order:${textIdx}"`;
            else {
                const textEls = [elOrder.indexOf('label'), elOrder.indexOf('value'), elOrder.indexOf('sub')].filter(i => i >= 0);
                if (textEls.length) contentOrder = ` style="order:${Math.min(...textEls)}"`;
            }
            if (barIdx >= 0) barOrder = ` style="order:${barIdx}"`;
        }
        let txtOrder = button.text_order ? button.text_order.toString().split(',').map(s => s.trim().toLowerCase()) : null;
        // Derive text order from element_order when text_order is absent
        if (!txtOrder && elOrder) {
            const legacyTxts = ['label','value','sub'].filter(t => elOrder.indexOf(t) >= 0);
            if (legacyTxts.length >= 2) {
                legacyTxts.sort((a, b) => elOrder.indexOf(a) - elOrder.indexOf(b));
                txtOrder = legacyTxts;
            }
        }
        let nameOrder = '', valOrder = '', subOrder = '';
        if (txtOrder && txtOrder.length >= 2) {
            const li = txtOrder.indexOf('label');
            const vi = txtOrder.indexOf('value');
            const si = txtOrder.indexOf('sub');
            if (li >= 0) nameOrder = ` style="order:${li}"`;
            if (vi >= 0) valOrder = ` style="order:${vi}"`;
            if (si >= 0) subOrder = ` style="order:${si}"`;
        }
        const nameHtmlOrdered = nameHtml ? nameHtml.replace('<span class="button-name', `<span${nameOrder} class="button-name`) : '';
        const valHtmlOrdered = valHtml ? valHtml.replace('<span class="button-val', `<span${valOrder} class="button-val`) : '';
        const subHtmlOrdered = subBelowHtml ? (subOrder ? subBelowHtml.replace('<span class="button-sub', `<span${subOrder} class="button-sub`) : subBelowHtml) : '';
        const contentHtml = (nameHtmlOrdered || valHtmlOrdered || subHtmlOrdered) ? `<span class="button-content"${contentOrder}>${nameHtmlOrdered}${valHtmlOrdered}${subHtmlOrdered}</span>` : '';
        const iconHtmlOrdered = iconHtml && iconOrder ? iconHtml.replace('<span class="button-icon', `<span${iconOrder} class="button-icon`) : (iconHtml || '');
        const barHtmlOrdered = barHtml && barOrder ? barHtml.replace('class="button-bar" style="', `class="button-bar" style="order:${elOrder.indexOf('bar')};`) : (barHtml || '');
        const style = inlineStyles.length ? ` style="${inlineStyles.join(';')}"` : '';
        let buttonHtml = `<div class="${classes.join(' ')}" data-idx="${idx}" data-area="${areaIdx}"${style}>${loaderHtml}${iconHtmlOrdered}${contentHtml}${barHtmlOrdered}</div>`;
        if (isRingType) {
            buttonHtml = `<div class="button-ring-wrap${hasSegments ? ' has-segments' : ''}${fcLoading ? ' button-loading' : ''}" data-idx="${idx}" data-area="${areaIdx}" style="${ringWrapStyle}">${ringHtml}${buttonHtml}</div>`;
        }
        const _n = (v) => v != null ? v : '';
        const sig = [idx, formatted, unit, iconValue, iconStrategy, showIcon, showLabel, showValue, overflowMode, labelOverflow, marqueeSpeed, marqueeRtl, width, height, nameSig, effectiveBg, bgStyle, effectiveFormat, _n(iconBg), isFree, posAnchor, posX, posY, effectiveBgColor, effectiveIconBgColor, _n(button.padding), button.text_size||'', button.label_size||'', button.inner_gap||'', button.text_gap||'', button.icon_size||'', button.icon_padding||'', buttonAlignClass, subValueSig, _n(button.sub_value_format), button.sub_value_size||'', button.sub_value_weight||'', button.sub_value_overflow||'', button.hide_sub_value||'', useFancyUnit, button.value_weight||'', button.label_weight||'', button.button_round||'', button.type||'', _n(button.ring_min), _n(button.ring_max), button.ring_color||'', button.ring_width||'', button.ring_gap||'', button.ring_threshold_mode||'', button._ringThresholdsSig||'', _n(button.bar_min), _n(button.bar_max), button.bar_color||'', button.bar_height||'', button.bar_threshold_mode||'', button._barThresholdsSig||'', gaugeSig, buttonTintColor, button.element_order||'', button.text_order||''].join('|');
        return { html: buttonHtml, sig, sensorObj, iconStrategy, showIcon, isFree, posAnchor, posX, posY, width, areaIdx, buttonIdx: idx, hidden: false };
    }
    _updateImage(hass, isNight, weatherState = 'default') {
        if (!this._elements || !this._elements.imageSlot) return; const img = this._elements.img; const slot = this._elements.imageSlot;
        const statusSrc = this._calculateStatusImage(hass, isNight);
        const baseSrc = isNight ? this._config.image_night : this._config.image_day;
        const src = statusSrc || baseSrc || this._config.image_day || '';
        if (src) {
            if (img.getAttribute('src') !== src) img.src = src;
        } else {
            img.removeAttribute('src');
        }
        slot.hidden = !img.getAttribute('src');
    }
    _updateWeatherBg(weatherState, themeDark) {
        const container = this._elements && this._elements.weatherBg;
        const root = this._elements && this._elements.root;
        if (!container || !root) return;
        const cfg = this._config || {};
        const dayPath = (cfg.weather_image_path || '').trim();
        const nightPath = (cfg.weather_image_path_night || '').trim();
        // Off when no day folder is set.
        if (!dayPath) {
            if (this._weatherBgActive) {
                container.innerHTML = '';
                root.classList.remove('has-weather-bg');
                this._weatherBgActive = false;
                this._weatherBgState = null;
                this._weatherBgDark = null;
                this._weatherBgResolved = null;
                this._restoreShaderAfterBg();
            }
            return;
        }
        // Day folder only → use for both; both set → follow color mode.
        const useNight = !!(themeDark && nightPath);
        const basePath = useNight ? nightPath : dayPath;
        if (this._weatherBgState === weatherState && this._weatherBgDark === useNight) return;
        this._weatherBgState = weatherState;
        this._weatherBgDark = useNight;
        const folder = basePath.endsWith('/') ? basePath : basePath + '/';
        const exts = ['', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.mp4'];
        container.innerHTML = '';
        this._weatherBgResolved = null;
        this._probeWeatherMedia(container, root, folder, weatherState, exts, 0);
    }
    _probeWeatherMedia(container, root, folder, state, exts, idx) {
        if (idx >= exts.length) {
            root.classList.remove('has-weather-bg');
            const wasActive = this._weatherBgActive;
            this._weatherBgActive = false;
            this._weatherBgResolved = null;
            if (wasActive) {
                this._restoreShaderAfterBg();
            }
            return;
        }
        const url = `${folder}${state}${exts[idx]}`;
        if (exts[idx] === '.mp4') {
            const video = document.createElement('video');
            video.autoplay = true; video.loop = true; video.muted = true; video.playsInline = true;
            video.setAttribute('muted', '');
            video.src = url;
            video.onloadeddata = () => {
                container.innerHTML = '';
                container.appendChild(video);
                root.classList.add('has-weather-bg');
                this._weatherBgActive = true;
                this._weatherBgResolved = url;
                this._applyWeatherBgActive();
            };
            video.onerror = () => {
                this._probeWeatherMedia(container, root, folder, state, exts, idx + 1);
            };
        } else {
            const img = new Image();
            img.onload = () => {
                container.innerHTML = '';
                container.appendChild(img);
                root.classList.add('has-weather-bg');
                this._weatherBgActive = true;
                this._weatherBgResolved = url;
                this._applyWeatherBgActive();
            };
            img.onerror = () => {
                this._probeWeatherMedia(container, root, folder, state, exts, idx + 1);
            };
            img.src = url;
        }
    }
    _applyWeatherBgActive() {
        this._teardownShaderForBg();
        if (!this._isEffectivelyDisabled()) this._startAnimation();
    }
    _teardownShaderForBg() {
        const canvas = this._elements && this._elements.glCanvas;
        if (canvas) canvas.style.display = 'none';
        if (this._gl) this._destroyGL();
    }
    _restoreShaderAfterBg() {
        const disabled = this._areShadersDisabled();
        this._applyShaderDisabledState(disabled);
        if (!disabled) {
            if (this._initializationComplete && this._isVisible && !this._gl) {
                this._initWebGL();
                this._shaderParams = this._weatherToUniforms();
            }
            this._startAnimation();
        } else {
            this._stopAnimation();
        }
    }
    _updateSimpleBg(themeDark) {
        const container = this._elements && this._elements.simpleBg;
        const root = this._elements && this._elements.root;
        if (!container || !root) return;
        const cfg = this._config || {};
        const on = cfg.simple_background === true;
        const useNight = !!themeDark;
        if (!on) {
            if (this._simpleBgActive) {
                root.classList.remove('has-simple-bg');
                this._simpleBgActive = false;
                this._simpleBgDark = null;
            }
            return;
        }
        if (this._simpleBgActive && this._simpleBgDark === useNight) return;
        const wasActive = this._simpleBgActive;
        this._simpleBgActive = true;
        this._simpleBgDark = useNight;
        root.classList.add('has-simple-bg');
        if (!wasActive) this._applyWeatherBgActive();
    }
    _refreshMarqueeObservation() {
        if (!this._marqueeObserver) {
            this._marqueeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    entry.target.querySelectorAll('.awc-marquee-host')
                        .forEach(host => this._measureMarqueeOne(host));
                }
            });
        }
        this._marqueeObserver.disconnect();
        for (const els of (this._elements && this._elements.buttonAreaEls) || []) {
            if (els.row) {
                els.row.querySelectorAll('.button.overflow-marquee')
                  .forEach(button => this._marqueeObserver.observe(button));
            }
        }
        const tw = this._elements && this._elements.textWrapper;
        if (tw) {
            tw.querySelectorAll('.button-free .button.overflow-marquee')
              .forEach(button => this._marqueeObserver.observe(button));
        }
    }
    _measureMarqueeOne(host) {
        const track = host.querySelector('.awc-marquee-track'); if (!track) return; const rtl = host.dataset.rtl === '1';
        host.classList.toggle('awc-marquee-rtl', rtl); if (host.clientWidth === 0) return; const firstText = track.querySelector('.awc-marquee-text');
        if (!firstText) return; const naturalWidth = firstText.offsetWidth; const hostWidth = host.clientWidth;
        const shouldAnimate = naturalWidth > hostWidth + 1;
        if (shouldAnimate) {
            if (track.childElementCount === 1) {
                const sep1 = document.createElement('span'); sep1.className = 'awc-marquee-sep'; const text2 = firstText.cloneNode(true);
                const sep2 = document.createElement('span'); sep2.className = 'awc-marquee-sep'; track.append(sep1, text2, sep2);
            }
            const loopWidth = track.scrollWidth / 2, speed = Math.max(5, parseFloat(host.dataset.speed) || 30), duration = Math.max(2, loopWidth / speed);
            host.style.setProperty('--awc-marquee-duration', `${duration.toFixed(2)}s`);
            host.classList.add('is-animating');
        } else {
            while (track.childElementCount > 1) track.lastElementChild.remove(); host.classList.remove('is-animating');
            host.style.removeProperty('--awc-marquee-duration');
        }
    }
    _computeVerticalVisHeight(areaIdx) {
        const els = this._elements && this._elements.buttonAreaEls && this._elements.buttonAreaEls[areaIdx];
        const bt = els && els.row; if (!bt || !bt.children.length) return;
        const area = this._areas[areaIdx]; if (!area) return;
        const visCount = parseInt(area.scroll_count, 10);
        if (!Number.isFinite(visCount) || visCount < 1) return; const firstButton = bt.children[0]; if (!firstButton || firstButton.offsetHeight < 1) return;
        const gap = parseFloat(getComputedStyle(bt).gap) || 8;
        bt.style.setProperty('--awc-row-max-height', `${firstButton.offsetHeight * visCount + gap * (visCount - 1)}px`);
    }
    _handleVisibilityChange(entries) {
        const entry = entries[0], wasVisible = this._isVisible;
        this._isVisible = entry.isIntersecting;
        if (this._elements && this._elements.root) this._elements.root.classList.toggle('is-offscreen', !this._isVisible);
        if (this._isVisible && !wasVisible) {
            this._shaderParams = this._weatherToUniforms();
            this._startAnimation();
        } else if (!this._isVisible && wasVisible) {
            this._stopAnimation();
        }
    }
    _handleDocVisibility() {
        if (document.hidden) {
            this._stopAnimation();
        } else if (this._isVisible) {
            this._startAnimation();
        }
    }
    _handleTap(e) {
        e.stopPropagation(); const cfg = this._config;
        this.dispatchEvent(new CustomEvent('hass-action', { bubbles: true, composed: true, detail: { config: { entity: cfg.weather_entity, tap_action: cfg.card_tap_action }, action: 'tap' } }));
    }
    _handleButtonClick(e) {
        const buttonEl = e.target.closest('.button'); if (!buttonEl) return; const idx = parseInt(buttonEl.dataset.idx, 10);
        const areaIdx = parseInt(buttonEl.dataset.area, 10);
        const area = this._areas && this._areas[areaIdx]; if (!area) return;
        const button = area.buttons && area.buttons[idx]; if (!button || !button.entity) return; e.stopPropagation();
        const tapAction = button.tap_action || { action: 'more-info' };
        this.dispatchEvent(new CustomEvent('hass-action', { bubbles: true, composed: true, detail: { config: { entity: button.entity, tap_action: tapAction }, action: 'tap' } }));
    }
    _tryInitialize() {
        if (this._initializationComplete) return; if (!this._renderGate.hasFirstHass) return; if (!this._renderGate.hasValidDimensions) return;
        if (!this._cachedDimensions.width || !this._cachedDimensions.height) return;
        this._initializationComplete = true; const w = this._cachedDimensions.width / this._cachedDimensions.dpr;
        const h = this._cachedDimensions.height / this._cachedDimensions.dpr; this._width = w; this._lastInitWidth = w;
        requestAnimationFrame(() => {
            if (!this.isConnected) return;
            if (this._areShadersDisabled()) {
                this._applyShaderDisabledState(true);
                return;
            }
            if (this._gl && !this._gl.isContextLost() && this._shaderBank) {
                this._prevShaderParams = null; this._prevFxSpeed = null;
            } else {
                this._gl = null; this._glProg = null; this._glUniforms = null;
                this._initWebGL();
            }
            this._shaderParams = this._weatherToUniforms();
            this._startAnimation();
        });
    }
    _areShadersDisabled() {
        const cfg = this._config || {};
        if (this._weatherBgActive) return true;
        if ((cfg.weather_image_path || '').trim()) return true;
        if (cfg.simple_background === true) return true;
        return cfg.disable_background === true;
    }
    _applyShaderDisabledState(disabled) {
        const canvas = this._elements && this._elements.glCanvas;
        const root = this._elements && this._elements.root;
        if (canvas) canvas.style.display = disabled ? 'none' : '';
        if (root) root.classList.toggle('shaders-off', disabled);
        if (disabled && this._gl) this._destroyGL();
    }
    _updateCanvasDimensions(forceW = null, forceH = null) {
        if (!this._elements || !this._elements.root) return false;
        let rawW = forceW !== null ? forceW : this._elements.root.clientWidth;
        let rawH = forceH !== null ? forceH : this._elements.root.clientHeight;
        if (rawW === 0 || rawH === 0) return false;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let scaledWidth = Math.floor(rawW * dpr), scaledHeight = Math.floor(rawH * dpr);
        const maxPx = 1200 * 800;
        if (scaledWidth * scaledHeight > maxPx) {
            const s = Math.sqrt(maxPx / (scaledWidth * scaledHeight));
            scaledWidth = Math.floor(scaledWidth * s);
            scaledHeight = Math.floor(scaledHeight * s);
        }
        const widthChanged = this._cachedDimensions.width !== scaledWidth;
        const heightDiff = Math.abs(this._cachedDimensions.height - scaledHeight);
        if (!widthChanged && heightDiff < 100) return false;
        this._cachedDimensions = { width: scaledWidth, height: scaledHeight, dpr };
        const canvas = this._elements.glCanvas;
        if (canvas) {
            canvas.width = scaledWidth;
            canvas.height = scaledHeight;
            canvas.style.width = `${rawW}px`;
            canvas.style.height = `${rawH}px`;
        }
        const sc = this._elements && this._elements.starCanvas;
        const sbg = this._elements && this._elements.starBgCanvas;
        if (sc) {
            const sw = Math.floor(rawW * dpr);
            const sh = Math.floor(rawH * dpr);
            sc.width = sw; sc.height = sh;
            sc.style.width = `${rawW}px`;
            sc.style.height = `${rawH}px`;
            this._starCtx = null;
            if (sbg) {
                sbg.width = sw; sbg.height = sh;
                sbg.style.width = `${rawW}px`;
                sbg.style.height = `${rawH}px`;
                this._starBgCtx = null;
                this._starBgPainted = false;
            }
        }
        if (scaledWidth > 0 && scaledHeight > 0) {
            this._renderGate.hasValidDimensions = true;
        }
        return true;
    }
    _scheduleResize() {
        if (this._resizeDebounceTimer) clearTimeout(this._resizeDebounceTimer);
        this._resizeDebounceTimer = setTimeout(() => {
            this._resizeDebounceTimer = null;
            if (this._gl) {
                const canvas = this._elements.glCanvas;
                if (canvas) this._gl.viewport(0, 0, canvas.width, canvas.height);
            }
        }, 300);
    }
    _bakeStarLayers(baseCount = 1000) {
        const seed = this._glSeed;
        let s0 = ((seed * 1667.3) | 0) >>> 0;
        const rng = () => { s0 = (s0 * 16807 + 0) % 2147483647; return (s0 & 0x7fffffff) / 0x7fffffff; };
        const sbg = this._elements && this._elements.starBgCanvas;
        if (!sbg || sbg.width === 0 || sbg.height === 0) return;
        const W = sbg.width, H = sbg.height;
        const bgCtx = this._starBgCtx || (this._starBgCtx = sbg.getContext('2d', { alpha: true }));
        if (!bgCtx) return;
        bgCtx.clearRect(0, 0, W, H);

        const palettes = [
            [190, 210, 255],
            [210, 225, 255],
            [255, 250, 245],
            [255, 235, 200],
        ];
        const pickColor = (v) => v < 0.15 ? palettes[0] : v < 0.60 ? palettes[1] : v < 0.85 ? palettes[2] : palettes[3];
        const batches = new Map();
        const addToBatch = (rgb, alpha, x, y, r) => {
            const qA = ((alpha * 15 + 0.5) | 0) / 15;
            const key = `${rgb[0]},${rgb[1]},${rgb[2]}|${qA}`;
            let b = batches.get(key);
            if (!b) { b = { rgb, alpha: qA, pts: [] }; batches.set(key, b); }
            b.pts.push(x, y, r);
        };

        const tinyCount = Math.floor(baseCount * 1.1);
        const smallCount = Math.floor(baseCount * 0.35);
        const clusterCount = Math.floor(baseCount * 0.045);

        const mwActive = baseCount > 750;
        let mwCosA, mwSinA, mwPerpX, mwPerpY, mwCx, mwCy, mwBandW;
        if (mwActive) {
            const mAngle = -0.35 + (rng() - 0.5) * 0.45;
            mwCosA = Math.cos(mAngle); mwSinA = Math.sin(mAngle); mwPerpX = -mwSinA; mwPerpY = mwCosA;
            mwBandW = H * 0.18;
            mwCx = W * 0.5 + (rng() - 0.5) * W * 0.15;
            mwCy = H * 0.42 + (rng() - 0.5) * H * 0.12;
        }

        for (let i = 0; i < tinyCount; i++) {
            let x = rng() * W;
            let y = rng() * H;
            if (mwActive && i % 3 === 0) {
                const bx = mwCx + mwCosA * ((x / W - 0.5) * W * 1.2) + mwPerpX * ((y / H - 0.5) * mwBandW);
                const by = mwCy + mwSinA * ((x / W - 0.5) * W * 1.2) + mwPerpY * ((y / H - 0.5) * mwBandW);
                if (bx >= 0 && bx <= W && by >= 0 && by <= H) { x = bx; y = by; }
            }
            let r = 0.6 + rng() * 0.6;
            if (i % 8 === 0) r *= 1.8;
            r = Math.min(r, 2.5);
            const alpha = 0.35 + rng() * 0.35;
            addToBatch(pickColor(rng()), alpha, x, y, r);
        }

        for (let i = 0; i < smallCount; i++) {
            let x = rng() * W;
            let y = rng() * H;
            if (mwActive && i % 3 === 0) {
                const bx = mwCx + mwCosA * ((x / W - 0.5) * W * 1.2) + mwPerpX * ((y / H - 0.5) * mwBandW * 0.8);
                const by = mwCy + mwSinA * ((x / W - 0.5) * W * 1.2) + mwPerpY * ((y / H - 0.5) * mwBandW * 0.8);
                if (bx >= 0 && bx <= W && by >= 0 && by <= H) { x = bx; y = by; }
            }
            let r = 0.8 + rng() * 0.8;
            if (i % 8 === 0) r *= 1.8;
            r = Math.min(r, 2.5);
            const alpha = 0.55 + rng() * 0.35;
            const rgb = pickColor(rng());
            addToBatch(rgb, alpha, x, y, r);
            if (i % 8 === 0) {
                const glowR = r * 3.0;
                bgCtx.globalAlpha = alpha * 0.12;
                const g = bgCtx.createRadialGradient(x, y, r * 0.5, x, y, glowR);
                g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`);
                g.addColorStop(0.4, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.2)`);
                g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
                bgCtx.fillStyle = g;
                bgCtx.beginPath();
                bgCtx.arc(x, y, glowR, 0, 6.2832);
                bgCtx.fill();
            }
        }

        for (let c = 0; c < clusterCount; c++) {
            const cx = 0.15 * W + rng() * 0.7 * W;
            const cy = rng() * H;
            const count = 5 + Math.floor(rng() * 6);
            for (let j = 0; j < count; j++) {
                const x = cx + (rng() - 0.5) * 25;
                const y = cy + (rng() - 0.5) * 18;
                let r = 0.5 + rng() * 0.5;
                if (j % 8 === 0) r *= 1.8;
                r = Math.min(r, 2.5);
                addToBatch(palettes[1], 0.30 + rng() * 0.20, x, y, r);
            }
        }

        for (const batch of batches.values()) {
            bgCtx.globalAlpha = batch.alpha;
            bgCtx.fillStyle = `rgb(${batch.rgb[0]},${batch.rgb[1]},${batch.rgb[2]})`;
            bgCtx.beginPath();
            const pts = batch.pts;
            for (let j = 0; j < pts.length; j += 3) {
                bgCtx.moveTo(pts[j] + pts[j + 2], pts[j + 1]);
                bgCtx.arc(pts[j], pts[j + 1], pts[j + 2], 0, 6.2832);
            }
            bgCtx.fill();
        }
        bgCtx.globalAlpha = 1;
        this._starBgPainted = true;

        const HERO_COUNT = 8;
        const heroes = [];
        const dpr = Math.min(window.devicePixelRatio || 1, 1.4);
        const useOC = typeof OffscreenCanvas !== 'undefined';
        for (let i = 0; i < HERO_COUNT; i++) {
            const isFeature = i < 2;
            const size = Math.min(isFeature ? (1.8 + rng() * 0.4) : (1.3 + rng() * 0.4), 1.8);
            const haloOuterR = isFeature ? 3.8 : 2.8;
            const brightness = 0.85 + rng() * 0.15;
            const rgb = pickColor(rng());
            const texPx = Math.ceil(size * haloOuterR * 2 + 4) * dpr;
            const hc = useOC ? new OffscreenCanvas(texPx, texPx) : document.createElement('canvas');
            if (!useOC) { hc.width = texPx; hc.height = texPx; }
            const hCtx = hc.getContext('2d', { alpha: true });
            const mid = texPx / 2;
            const refSz = size * dpr;
            const haloA = isFeature ? 0.60 : 0.35;
            const hg = hCtx.createRadialGradient(mid, mid, refSz * 0.5, mid, mid, refSz * haloOuterR);
            hg.addColorStop(0, `rgba(255,255,255,${haloA})`);
            hg.addColorStop(0.15, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(haloA * 0.8).toFixed(3)})`);
            hg.addColorStop(0.4, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(haloA * 0.25).toFixed(3)})`);
            hg.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
            hCtx.fillStyle = hg;
            hCtx.beginPath();
            hCtx.arc(mid, mid, refSz * haloOuterR, 0, 6.2832);
            hCtx.fill();

            if (isFeature) {
                const rayLen = refSz * 3.5;
                const rayW = refSz * 0.4;
                hCtx.save();
                hCtx.translate(mid, mid);
                for (let r = 0; r < 4; r++) {
                    hCtx.rotate(Math.PI / 4);
                    const rg = hCtx.createLinearGradient(0, 0, rayLen, 0);
                    rg.addColorStop(0, `rgba(255,255,255,${(haloA * 0.9).toFixed(3)})`);
                    rg.addColorStop(0.15, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(haloA * 0.7).toFixed(3)})`);
                    rg.addColorStop(0.5, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(haloA * 0.2).toFixed(3)})`);
                    rg.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
                    hCtx.fillStyle = rg;
                    hCtx.fillRect(0, -rayW / 2, rayLen, rayW);
                    const rg2 = hCtx.createLinearGradient(0, 0, -rayLen, 0);
                    rg2.addColorStop(0, `rgba(255,255,255,${(haloA * 0.9).toFixed(3)})`);
                    rg2.addColorStop(0.15, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(haloA * 0.7).toFixed(3)})`);
                    rg2.addColorStop(0.5, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(haloA * 0.2).toFixed(3)})`);
                    rg2.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
                    hCtx.fillStyle = rg2;
                    hCtx.fillRect(-rayLen, -rayW / 2, rayLen, rayW);
                }
                hCtx.restore();
            }

            heroes.push({
                x: 0.06 + rng() * 0.88,
                y: 0.06 + rng() * 0.82,
                size, brightness, bodyR: 0.75,
                haloTex: hc, haloTexSize: texPx, haloOuterR, refSize: refSz,
                rgb, fillStr: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`,
                phase: rng() * 6.2832,
                rate: 0.015 + rng() * 0.035,
                isFeature,
            });
        }
        this._starHeroes = heroes;
        this._starDpr = dpr;
    }
    _updateStars(sunEntity, weatherState) {
        const cfg = this._config || {};
        const isNight = this._isTimeNight;
        const vis = resolveVisuals(weatherState);
        if (!isNight || !vis.stars || cfg.night_sky_effects === false) {
            this._starMasterOpacity = 0;
            return;
        }

        const targetStarCount = vis.starCount;

        if (this._currentBakedStarCount !== targetStarCount) {
            this._currentBakedStarCount = targetStarCount;
            this._starBgPainted = false;
        }
        if (this._starMasterOpacity !== vis.starsOpacity) this._starBgPainted = false;
        this._starMasterOpacity = vis.starsOpacity;
    }
    _renderStars(timestamp) {
        const sc = this._elements && this._elements.starCanvas;
        const sbg = this._elements && this._elements.starBgCanvas;
        if (!sc || this._starMasterOpacity <= 0) {
            if (this._starsDirty && sc && sc.width > 0) {
                const ctx = this._starCtx || (this._starCtx = sc.getContext('2d', { alpha: true }));
                if (ctx) ctx.clearRect(0, 0, sc.width, sc.height);
                this._starsDirty = false;
            }
            if (sbg) sbg.style.opacity = '0';
            return;
        }
        const ctx = this._starCtx || (this._starCtx = sc.getContext('2d', { alpha: true }));
        if (!ctx) return;
        const cw = sc.width; const ch = sc.height;
        const master = this._starMasterOpacity;
        const dpr = this._starDpr || 1;

        if (sbg) sbg.style.opacity = master;

        if (!this._starBgPainted && sbg && sbg.width > 0) {
            this._bakeStarLayers(this._currentBakedStarCount || 800);
        }

        ctx.clearRect(0, 0, cw, ch);
        const heroes = this._starHeroes;
        if (!heroes) { ctx.globalAlpha = 1; this._starsDirty = true; return; }
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.globalCompositeOperation = 'lighter';
        const cssW = cw / dpr;
        const cssH = ch / dpr;
        for (let i = 0; i < heroes.length; i++) {
            const h = heroes[i];
            h.phase += h.rate;
            const twinkle = Math.sin(h.phase) + Math.sin(h.phase * 2.7) * 0.5 + Math.sin(h.phase * 0.4) * 0.3;
            const size = h.size * (1 + twinkle * 0.35);
            const op = Math.min(1, Math.max(0, h.brightness * (1 + twinkle * 0.40))) * master;
            if (op < 0.05) continue;
            const px = h.x * cssW;
            const py = h.y * cssH;
            if (h.haloTex) {
                ctx.globalAlpha = op;
                const scale = size / h.refSize;
                const drawSize = h.haloTexSize * scale / dpr;
                ctx.drawImage(h.haloTex, px - drawSize * 0.5, py - drawSize * 0.5, drawSize, drawSize);
            }
            ctx.globalAlpha = Math.min(1, op * 1.1);
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(px, py, size * h.bodyR, 0, 6.2832);
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        this._drawShootingStars(ctx, cssW, cssH);
        ctx.restore();
        ctx.globalAlpha = 1;
        this._starsDirty = true;
    }
    _drawShootingStars(ctx, w, h) {
        const m = this._starMasterOpacity, S = this._shootingStars, K = this._comets;
        if (Math.random() < 0.00429 && S.length < 2) {
            const sx = Math.random() < 0.7 ? Math.random() * w * 0.6 : w * 0.6 + Math.random() * w * 0.4;
            const dx = Math.random() < 0.3 ? -1 : 1, bl = Math.random() < 0.18;
            const sp = bl ? 3.5 + Math.random() * 2 : 5 + Math.random() * 5, cr = Math.random();
            const [hr, tr] = cr < 0.55 ? ['rgb(255,255,255)', 'rgb(255,255,240)']
                : cr < 0.75 ? ['rgb(255,245,210)', 'rgb(255,230,180)']
                : cr < 0.92 ? ['rgb(210,255,225)', 'rgb(180,240,200)']
                : ['rgb(255,210,160)', 'rgb(255,185,130)'];
            S.push({ x: sx, y: Math.random() * h * 0.5, vx: sp * dx, vy: 2 + Math.random() * 2,
                life: 1, dc: bl ? 0.032 : 0.045, sz: bl ? 2.5 + Math.random() * 1.5 : 1.5 + Math.random() * 1.5,
                bl, hr, tr, tb: new Float32Array(44), th: 0, tl: 0 });
        }
        ctx.lineCap = 'round';
        for (let i = S.length - 1; i >= 0; i--) {
            const s = S[i]; s.x += s.vx; s.vy += 0.045; s.y += s.vy; s.life -= s.dc;
            s.tb[s.th * 2] = s.x; s.tb[s.th * 2 + 1] = s.y; s.th = (s.th + 1) % 22; if (s.tl < 22) s.tl++;
            if (s.life <= 0) { S.splice(i, 1); continue; }
            const op = s.life * m; ctx.globalAlpha = op; ctx.fillStyle = s.hr;
            const fl = s.bl && s.life < 0.15 ? 1 + (0.15 - s.life) * 8 : 1;
            const hs = s.sz * (0.3 + s.life * 0.7) * fl;
            ctx.beginPath(); ctx.arc(s.x, s.y, hs, 0, 6.2832); ctx.fill();
            ctx.lineWidth = hs * 0.8; ctx.strokeStyle = s.tr;
            const segs = s.tl - 1;
            for (let b = 0; b < 4; b++) {
                const j0 = b * segs >> 2, j1 = (b + 1) * segs >> 2;
                if (j0 >= j1) continue;
                ctx.globalAlpha = op * (1 - (j0 + j1) * 0.5 / s.tl); ctx.beginPath();
                for (let j = j0; j <= j1; j++) {
                    const idx = (((s.th - 1 - j) % 22) + 22) % 22;
                    j === j0 ? ctx.moveTo(s.tb[idx * 2], s.tb[idx * 2 + 1]) : ctx.lineTo(s.tb[idx * 2], s.tb[idx * 2 + 1]);
                }
                ctx.stroke();
            }
        }
        if (!K.length && Math.random() < 0.0005456) {
            const sx = Math.random() < 0.5 ? -60 : w + 60, dir = sx < 0 ? 1 : -1, sp = 2.2 + Math.random() * 1.3, cr = Math.random();
            const [co, gl, tr] = cr < 0.50 ? ['220,240,255', '100,200,255', 'rgb(160,210,255)']
                : cr < 0.78 ? ['200,255,220', '120,220,160', 'rgb(150,230,180)']
                : ['255,240,200', '230,190,100', 'rgb(240,210,150)'];
            K.push({ x: sx, y: Math.random() * h * 0.4, vx: sp * dir, vy: sp * 0.15, sz: 1.5 + Math.random(),
                life: 1.2, co, gl, tr, tb: new Float32Array(200), th: 0, tl: 0, _g: null });
        }
        for (let i = K.length - 1; i >= 0; i--) {
            const c = K[i]; c.x += c.vx; c.y += c.vy; c.life -= 0.005;
            if (c.life <= 0) { K.splice(i, 1); continue; }
            c.tb[c.th * 2] = c.x; c.tb[c.th * 2 + 1] = c.y; c.th = (c.th + 1) % 100; if (c.tl < 100) c.tl++;
            if (c.tl > 2) {
                const ni = (((c.th - 1) % 100) + 100) % 100, oi = (((c.th - c.tl) % 100) + 100) % 100;
                const dx = c.tb[ni * 2] - c.tb[oi * 2], dy = c.tb[ni * 2 + 1] - c.tb[oi * 2 + 1];
                if (dx * dx + dy * dy > 28900) c.tl--;
            }
            const op = Math.min(1, c.life) * m;
            if (!c._g) {
                const r = c.sz * 4, g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
                g.addColorStop(0, `rgba(${c.co},1)`); g.addColorStop(0.4, `rgba(${c.gl},0.4)`); g.addColorStop(1, `rgba(${c.gl},0)`);
                c._g = g;
            }
            ctx.globalAlpha = op; ctx.save(); ctx.translate(c.x, c.y); ctx.fillStyle = c._g;
            ctx.beginPath(); ctx.arc(0, 0, c.sz * 4, 0, 6.2832); ctx.fill(); ctx.restore();
            ctx.lineCap = 'butt'; ctx.strokeStyle = c.tr; const segs = c.tl - 1;
            for (let b = 0; b < 8; b++) {
                const j0 = (b * segs / 8) | 0, j1 = ((b + 1) * segs / 8) | 0;
                if (j0 >= j1) continue; const mp = (j0 + j1) * 0.5 / c.tl;
                ctx.lineWidth = c.sz * (1 - mp * 0.8); ctx.globalAlpha = op * (1 - mp) * 0.6; ctx.beginPath();
                for (let j = j0; j <= j1; j++) {
                    const idx = (((c.th - 1 - j) % 100) + 100) % 100;
                    j === j0 ? ctx.moveTo(c.tb[idx * 2], c.tb[idx * 2 + 1]) : ctx.lineTo(c.tb[idx * 2], c.tb[idx * 2 + 1]);
                }
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1;
    }
    _glslVert() {
        return `#version 300 es
precision mediump float;
in vec2 a_pos;
out vec2 v_uv;
void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
}`;
    }
    _glslClouds() {
        return `
float awc_hash(vec2 p){
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}
float awc_noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(awc_hash(i), awc_hash(i+vec2(1.0,0.0)), u.x),
               mix(awc_hash(i+vec2(0.0,1.0)), awc_hash(i+vec2(1.0,1.0)), u.x), u.y);
}
const mat2 AWC_ROT = mat2(0.80, 0.60, -0.60, 0.80);
float awc_fbm(vec2 p){
    float v = 0.0, a = 0.5, tot = 0.0;
    for (int i = 0; i < 3; i++){ v += a * awc_noise(p); tot += a; p = AWC_ROT * p * 2.0; a *= 0.5; }
    return v / tot;
}`;
    }
    _glslFrag(variant = 'sky') {
        const snow = variant === 'snow';
        const snowUniforms = snow ? 'uniform float u_density;\nuniform float u_hail;\nuniform float u_grain;\n' : '';
        const overlay = snow ? `
float awcIce(vec2 FC, float time) {
    vec2 r = u_resolution.xy;
    float fall = mix(1.0, 7.0, u_hail);
    float wob  = mix(1.0, 0.0, u_hail);
    float tilt = mix(0.0, 0.5, u_hail);
    float t = time * fall;
    float acc = 0.0;
    for (float i = 1.0; i < 14.0; i += 1.5) {
        float s = -0.4 + i;
        float v = (2.0 + sin(i)) * s / i;
        vec2 p = (FC / r.x) * s + vec2(sin(t + i) * wob + t * v * tilt, t * v);
        float h = fract(sin(dot(floor(p), floor(p) + i)) * 4e3);
        float rad = 0.024 * (1.0 + 1.6 / i) * u_grain * mix(1.0, 0.7, u_hail);
        acc += smoothstep(rad, -0.5 * rad, length(fract(p) - 0.5 + (h - 0.5) * 0.7));
    }
    return acc;
}
// Snow flakes over the cloud field, with a faint day-only contact rim.
vec3 awcOverlay(vec3 col, vec2 fc, float T){
    float sn = clamp(awcIce(fc, T * 0.5), 0.0, 1.0) * u_density;
    float rim = sn * (1.0 - sn) * 4.0;
    col = mix(col, col * 0.84, rim * (1.0 - u_dark) * 0.5);
    vec3 flake = mix(vec3(1.0), vec3(0.96, 0.98, 1.0), u_dark);
    flake = mix(flake, flake * vec3(0.95, 0.98, 1.0), u_hail);
    col = mix(col, flake, sn * mix(0.90, 1.0, u_dark));
    return col;
}` : `
vec3 awcOverlay(vec3 col, vec2 fc, float T){ return col; }`;
        return `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform float u_time;
uniform vec2  u_resolution;
uniform float u_dark;
uniform float u_wind;
uniform float u_cloud_density;
uniform float u_cloud_shade;
uniform float u_cloud_base;
uniform float u_cloud_size;
uniform float u_cloud_gap;
uniform float u_fx_speed;
uniform vec3 u_sky_top;
uniform vec3 u_sky_mid;
uniform vec3 u_sky_low;
uniform vec3 u_sky_base;
uniform sampler2D u_noise;
${snowUniforms}vec4 vnoise4(vec2 p) {
    vec2 i = floor(p);
    vec2 f = p - i;
    f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return texture(u_noise, (i + f + 0.5) / 256.0);
}
// 2-octave multichannel value-fbm; the four channels drive the sky-gradient warp.
vec4 fbm4(vec2 p) {
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    vec4 value = vec4(0.0);
    float amp = 0.5, norm = 0.0;
    for (int i = 0; i < 2; i++) {
        value += amp * vnoise4(p);
        norm += amp;
        p = rot * p * 2.02 + vec2(float(i) * 1.7, float(i) * 3.1);
        amp *= 0.5;
    }
    return value / norm;
}

const float AWC_CLOUD_FREQ = 3.0;

float vnoiseS(vec2 p){
    vec2 i = floor(p);
    vec2 f = p - i;
    f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return textureLod(u_noise, (i + f + 0.5) / 256.0, 0.0).r;
}

float cFbmT(vec2 d, float freq, float gain, int oct, float ev){
    vec2 p = d * freq;
    float v = 0.0, a = 1.0, tot = 0.0;
    for (int i = 0; i < 6; i++){
        if (i >= oct) break;
        vec2 dir = vec2(cos(float(i) * 2.4), sin(float(i) * 2.4));
        v   += a * vnoiseS(p + dir * (ev * (0.3 + float(i) * 0.25)));
        tot += a;
        p    = p * 2.5 + vec2(float(i) * 1.7, float(i) * 2.3);
        a   *= gain;
    }
    return v / tot;
}


float cloudTexture(vec2 dm, float gain, float ev){
    float macroFreq = AWC_CLOUD_FREQ / u_cloud_size;
    float macro  = cFbmT(dm, macroFreq, gain, 4, ev);
    float detail = cFbmT(dm, 9.0, 0.5, 3, ev * 1.3);
    return macro + (detail - 0.5) * 0.26;
}

float coverageMask(vec2 dm, float ev){
    return cFbmT(dm, (AWC_CLOUD_FREQ / u_cloud_size) * 0.34, 0.55, 2, ev * 0.7);
}

vec2 awcFlow(vec2 d, float ev){
    float n1 = vnoiseS(d * 0.4 + vec2(ev * 0.11, -ev * 0.0880));
    float n2 = vnoiseS(d * 0.4 + vec2(5.2 - ev * 0.0990, 1.7 + ev * 0.11));
    vec2 flow = (vec2(n1, n2) - 0.5);
    float ang = (n1 - 0.5) * 6.2831853 + ev * 0.35;
    vec2 swirl = vec2(cos(ang), sin(ang)) * (n2 - 0.5);
    return (flow * 0.14 + swirl * 0.10);
}
vec3 cloudField(vec2 d, float t, float ev, float gain, float thr, float maskAmt){
    vec2 q  = d - vec2(t * 0.07, t * 0.028);
    q += awcFlow(q, ev);
    float tex  = cloudTexture(q, gain, ev);
    float mask = coverageMask(q, ev);
    float localThr = thr - (mask - 0.5) * maskAmt;
    float texUp = cloudTexture(q + vec2(0.0, 0.0800), gain, ev);
    float occ = texUp - localThr;
    return vec3(tex, localThr, occ);
}

vec4 awcClouds(vec2 p){
    float gain  = mix(0.5, 0.56, smoothstep(0.8, 1.3, u_fx_speed));
    float speed = max(u_fx_speed, 0.15);
    float t     = u_time * speed;
    float wind  = u_time * u_wind * 0.05;
    float ev = u_time * (0.065 + u_fx_speed * 0.16);

    vec3 skyAvg = (u_sky_top + u_sky_mid + u_sky_low + u_sky_base) * 0.25;

    vec3 litDay     = mix(vec3(0.99, 0.99, 0.96), u_sky_top, 0.18);
    vec3 litNight   = vec3(0.55, 0.62, 0.79);
    vec3 lit        = mix(litDay, litNight, u_dark);
    vec3 shadeDay   = mix(vec3(0.86, 0.88, 0.92), mix(u_sky_mid, u_sky_low, 0.5), mix(0.45, 0.85, u_cloud_shade));
    vec3 shadeNight = mix(u_sky_mid, vec3(0.10, 0.15, 0.32), 0.62);
    vec3 shade      = mix(shadeDay, shadeNight, u_dark);

    float thr0    = mix(0.56, 0.32, u_cloud_density) - u_cloud_base * 0.06;
    float maskAmt = mix(0.3, 0.42, u_cloud_density);

    vec3 front = cloudField((p - vec2(wind, 0.0)) * 1.30, t, ev, gain, thr0, maskAmt);

    float fd = front.x - front.y;
    float occ = front.z;
    float arv = u_resolution.x / u_resolution.y;
    vec2 seedOff = textureLod(u_noise, vec2(0.137, 0.519), 0.0).rg - 0.5;
    vec2 vigCen = vec2(arv * 0.5, 0.5) + seedOff * vec2(arv * 0.3, 0.26) + vec2(sin(u_time * 0.011) * arv * 0.1, cos(u_time * 0.013) * 0.09);
    vec2 vrel = (p - vigCen) / vec2(arv * 0.6, 0.6);
    fd -= max(0.0, 0.55 - dot(vrel, vrel)) * u_cloud_gap;

    vec3 hilite   = lit + vec3(0.05, 0.05, 0.03) * (1.0 - u_dark) + vec3(0.03, 0.05, 0.1) * u_dark;
    float fCov    = smoothstep(0.0, 0.03, fd);
    float fSoft   = smoothstep(mix(-0.09, -0.045, u_dark), 0.04, fd);
    float form    = smoothstep(-0.04, mix(0.34, 0.46, u_dark), fd);
    float core    = smoothstep(0.2, 0.44, fd);
    vec3 frontCol = mix(shade, lit, form);
    frontCol      = mix(frontCol, hilite, core * mix(0.5, 0.18, u_dark));
    float shadow  = smoothstep(0.0, 0.33, occ) * (1.0 - core * 0.5);
    vec3 shadowCol = mix(frontCol * vec3(0.9, 0.91, 0.93), mix(frontCol, vec3(0.10, 0.14, 0.30), 0.6), u_dark);
    frontCol      = mix(frontCol, shadowCol, shadow);
    float thinness = 1.0 - smoothstep(-0.02, 0.08, fd);
    vec3 thinTarget = mix(skyAvg, mix(skyAvg, litNight, 0.5), u_dark);
    frontCol       = mix(frontCol, thinTarget, thinness * mix(0.22, 0.17, u_dark));
    float rimBand  = smoothstep(0.0, 0.04, fd) * (1.0 - smoothstep(0.04, 0.11, fd));
    vec3 rimDark   = mix(skyAvg, vec3(0.05, 0.06, 0.11), 0.45);
    frontCol       = mix(frontCol, rimDark, rimBand * u_dark * 0.18);
    frontCol       = mix(frontCol, frontCol * 0.82, rimBand * (1.0 - u_dark) * 0.35);
    float frontA   = max(fCov, fSoft * 0.78);

    vec3 col = mix(skyAvg, frontCol, frontA);
    float alpha = frontA;
    float dh = fract(sin(dot(p * 511.0 + u_time, vec2(12.9898, 78.233))) * 43758.5453);
    col += (dh - 0.5) * (1.5 / 255.0);
    return vec4(col, min(alpha, 1.0));
}
${overlay}
void main() {
    vec2 uv = v_uv;
    float ar = u_resolution.x / u_resolution.y;
    vec2 p = vec2(uv.x * ar, uv.y);
    float skyClock = u_time * 0.44 * 0.27;
    float warpClock = u_time * 0.576 * 0.27;
    vec2 warpSeed = vec2(warpClock * 0.34, -warpClock * 0.26);
    vec4 warpA = fbm4(uv * 1.3 + warpSeed);
    vec4 warpB = fbm4(uv * 0.9 - warpSeed * 1.4 + warpA.rg * 1.7);
    vec2 skyWarp = (warpB.rg - 0.5) * 1.7 + (warpA.ba - 0.5) * 0.7;

    vec2 lightCenter = vec2(
        0.18 + sin(skyClock * 0.6) * 0.28 + cos(skyClock * 0.21) * 0.15,
        0.82 + cos(skyClock * 0.45) * 0.22 + sin(skyClock * 0.17) * 0.12
    );
    vec2 warpedUV = uv + skyWarp;
    float radialDist = length(warpedUV - lightCenter);
    float skyGrad = clamp(radialDist * 0.62, 0.0, 1.0);

    float split1 = 0.33 + sin(skyClock * 0.8) * 0.14 + warpA.r * 0.08;
    float split2 = 0.66 + cos(skyClock * 0.65 + 1.7) * 0.14 + warpB.g * 0.08;
    split1 = clamp(split1, 0.08, split2 - 0.08);
    split2 = clamp(split2, split1 + 0.08, 0.92);

    vec3 sky = u_sky_top;
    sky = mix(sky, u_sky_mid, smoothstep(0.0, split2, skyGrad));
    sky = mix(sky, u_sky_low, smoothstep(split1, 1.0, skyGrad));
    sky = mix(sky, u_sky_base, smoothstep(split2, 1.0, skyGrad));

    float breathe = sin(skyClock * 1.1 + warpB.b * 3.0) * 0.5 + 0.5;
    vec3 breatheTint = mix(vec3(-0.030, -0.010, 0.030), vec3(0.030, 0.012, -0.025), breathe);
    sky += breatheTint * (1.0 - u_dark * 0.6);
    sky *= (1.0 - u_cloud_shade * 0.12);
    vec4 clouds = awcClouds(p);
    vec3 final = mix(sky, clouds.rgb, clouds.a);
    final = awcOverlay(final, gl_FragCoord.xy, u_time);
    fragColor = vec4(final, 1.0);
}`;
    }
    // Header, uniforms and helpers for the water (rain-on-glass) shader.
    _glslGlassPreamble(extraUniforms) {
        return `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform float u_time, u_dark;
uniform vec2 u_resolution;
uniform vec3 u_sky_top, u_sky_mid, u_sky_low, u_sky_base;
uniform float u_ref_height;
${extraUniforms}
${this._glslClouds()}
#define S(a,b,t) smoothstep(a,b,t)
${this._glslSkyRefract()}`;
    }
    _glslSkyRefract() {
        return `
vec3 skyRefract(vec2 rUV, float T) {
    float td = T * 0.4;
    vec2 lc = vec2(0.2 + sin(td * 0.7) * 0.35, 0.5 + cos(td * 0.5) * 0.35);
    float breath = 0.40 + sin(T * 0.5) * 0.15 + sin(T * 0.31) * 0.10;
    float nz = awc_fbm(rUV * 3.0 + T * 0.12);
    float rd = length(rUV - lc) + (nz - 0.5) * 0.50;
    float g = clamp(rd * breath + (nz - 0.5) * 0.25, 0.0, 1.0);
    float gSplit1 = clamp(0.33 + sin(T * 0.35) * 0.14 + (nz - 0.5) * 0.16, 0.08, 0.84);
    float gSplit2 = clamp(0.66 + cos(T * 0.28 + 1.7) * 0.14 + (nz - 0.5) * 0.14, gSplit1 + 0.08, 0.92);
    vec3 sky = u_sky_top;
    sky = mix(sky, u_sky_mid, smoothstep(0.0, gSplit2, g));
    sky = mix(sky, u_sky_low, smoothstep(gSplit1, 1.0, g));
    sky = mix(sky, u_sky_base, smoothstep(gSplit2, 1.0, g));
    return sky;
}`;
    }
    // Rain-on-glass remixed from "Heartfelt" https://www.shadertoy.com/view/ltffzl — CC BY-NC-SA 3.0.
    _glslFragWater() {
        return `${this._glslGlassPreamble('uniform float u_fx_speed, u_rain_intensity, u_lightning;')}
vec3 N13(float p){
    vec3 p3=fract(vec3(p)*vec3(.1031,.11369,.13787));
    p3+=dot(p3,p3.yzx+19.19);
    return fract(vec3((p3.x+p3.y)*p3.z,(p3.x+p3.z)*p3.y,(p3.y+p3.z)*p3.x));
}
float N(float t){return fract(sin(t*12345.564)*7658.76);}
float Saw(float b,float t){return S(0.,b,t)*S(1.,b,t);}
vec2 DropLayer2(vec2 uv,float t){
    vec2 UV=uv;
    uv.y+=t*0.75;
    float gridScale = mix(0.95, 0.78, u_rain_intensity);
    vec2 a=vec2(6.,1.) * gridScale;
    vec2 grid=a*2.;
    vec2 id=floor(uv*grid);
    float colShift=N(id.x);
    uv.y+=colShift;
    id=floor(uv*grid);
    vec3 n=N13(id.x*35.2+id.y*2376.1);
    vec2 st=fract(uv*grid)-vec2(.5,0.);
    float x=n.x-.5;
    float y=UV.y*20.;
    float wiggle=sin(y+sin(y));
    x+=wiggle*(.5-abs(x))*(n.z-.5);
    x*=.7;
    float ti=fract(t+n.z);
    y=(Saw(.85,ti)-.5)*.76+.5;
    vec2 p=vec2(x,y);
    float dropRadius = mix(0.44, 0.58, u_rain_intensity);
    float d=length((st-p)*a.yx);
    float mainDrop=S(dropRadius,.0,d);
    float r=sqrt(S(1.,y,st.y));
    float cd=abs(st.x-x);
    float trail=S(.23*r,.15*r*r,cd);
    float trailFront=S(-.02,.02,st.y-y);
    trail*=trailFront*r*r;
    y=UV.y;
    float trail2=S(.2*r,.0,cd);
    float droplets=max(0.,(sin(y*(1.-y)*120.)-st.y))*trail2*trailFront*n.z;
    y=fract(y*10.)+(st.y-.5);
    float dd=length(st-vec2(x,y));
    droplets=S(.3,0.,dd);
    float m=mainDrop+droplets*r*trailFront;
    return vec2(m,trail);
}
float StaticDrops(vec2 uv,float t){
    uv*=40.;
    vec2 id=floor(uv);
    uv=fract(uv)-.5;
    vec3 n=N13(id.x*107.45+id.y*3543.654);
    vec2 p=(n.xy-.5)*.7;
    float d=length(uv-p);
    float fade=Saw(.025,fract(t+n.z));
    float c=S(.3,0.,d)*fract(n.z*10.)*fade;
    return c;
}
vec2 Drops(vec2 uv,float t,float l0,float l1,float l2){
    float s=StaticDrops(uv,t)*l0;
    vec2 m1=DropLayer2(uv,t)*l1;
    vec2 m2 = vec2(0.0);
    if (l2 > 0.001) m2 = DropLayer2(uv*1.85,t)*l2;
    float c=s+m1.x+m2.x;
    c=S(.3,1.,c);
    return vec2(c,max(m1.y*l0,m2.y*l1));
}
void main(){
    vec2 UV = v_uv;
    float T = u_time;
    vec2 uv = (gl_FragCoord.xy - 0.5*u_resolution) / max(u_resolution.y, u_ref_height);
    float t = T * 0.2 * u_fx_speed;

    float sd = S(-.5,1.,u_rain_intensity)*2., l1 = S(.1,.75,u_rain_intensity), l2 = S(.2,.85,u_rain_intensity);
    vec2 c = Drops(uv, t, sd, l1, l2);
    vec2 e = vec2(.001, 0.);
    vec2 n = vec2(Drops(uv+e,t,sd,l1,l2).x - c.x, Drops(uv+e.yx,t,sd,l1,l2).x - c.x);
    vec2 rUV = UV + n * mix(6.0, 28.0, u_dark);
    vec3 col = skyRefract(rUV, T);
    if (u_lightning > 0.0) {
        float s = sin(T * 0.79) + sin(T * 1.49) + sin(T * 0.52);  // quasi-periodic -> irregular timing
        float strike = smoothstep(1.45, 2.35, s); strike *= strike; // sharp onset, fires more often
        strike *= 0.7 + 0.3 * sin(T * 33.0 + s * 5.0);            // gentle flicker while lit
        vec2 cellPos = vec2(0.50 + 0.34 * sin(T * 0.17 + 1.3), 0.70 + 0.12 * sin(T * 0.11 + 0.5));
        float rad    = 0.52 + 0.16 * sin(T * 0.13 + 2.1);        // breathing size
        float aspY   = 1.5 + 0.40 * sin(T * 0.09);
        float blob = smoothstep(rad, 0.0, length((rUV - cellPos) * vec2(1.1, aspY)));
        blob *= 0.55 + 0.45 * awc_fbm(rUV * 1.8 + T * 0.012);     // soft cloud shape
        vec3 cellCol = mix(vec3(0.60, 0.72, 1.0), vec3(0.78, 0.85, 1.0), u_dark);
        col += cellCol * u_lightning * strike * blob * 0.7;
    }
    col += min(c.y, 1.0) * mix(0.033, 0.055, u_dark);
    fragColor = vec4(col, 1.0);
}`;
    }
    _destroyGL() {
        const gl = this._gl;
        if (gl && !gl.isContextLost()) {
            if (this._glBuf) gl.deleteBuffer(this._glBuf);
            if (this._glNoiseTex) gl.deleteTexture(this._glNoiseTex);
            if (this._shaderBank) {
                for (const b of Object.values(this._shaderBank)) {
                    if (b.prog) gl.deleteProgram(b.prog);
                }
            }
        }
        this._gl = null; this._glProg = null; this._glUniforms = null;
        this._glBuf = null; this._shaderBank = null; this._glNoiseTex = null;
        this._activeShaderKey = null; this._prevShaderParams = null;
        this._prevFxSpeed = null;
    }
    _initWebGL() {
        const canvas = this._elements.glCanvas;
        if (!canvas) return;
        const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
        if (!gl || gl.isContextLost()) { console.warn('AWC: WebGL2 not available'); this._applyShaderDisabledState(true); return; }
        this._gl = gl;
        this._prevShaderParams = null; this._prevFxSpeed = null;
        this._activeShaderKey = null;
        const vertSrc = this._glslVert();
        const needed = this._shaderParams ? (this._shaderParams.shader || 'sky') : 'sky';
        const shaders = [{ key: 'sky', frag: this._glslFrag() }];
        if (needed !== 'sky') shaders.push({ key: needed, frag: this._glslFragFor(needed) });
        this._vertSrc = vertSrc;
        const compiled = shaders.map(s => {
            const vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, vertSrc); gl.compileShader(vs);
            const fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, s.frag); gl.compileShader(fs);
            return { key: s.key, vs, fs };
        });
        const ext = gl.getExtension('KHR_parallel_shader_compile');
        if (ext) {
            this._pollShaderCompile(gl, compiled, ext);
        } else {
            this._finalizeShaders(gl, compiled);
        }
    }
    _pollShaderCompile(gl, compiled, ext) {
        const COMPLETION = 0x91B1;
        const poll = () => {
            if (!this.isConnected) return;
            const allDone = compiled.every(c =>
                gl.getShaderParameter(c.vs, COMPLETION) && gl.getShaderParameter(c.fs, COMPLETION)
            );
            if (allDone) {
                this._finalizeShaders(gl, compiled);
            } else {
                requestAnimationFrame(poll);
            }
        };
        requestAnimationFrame(poll);
    }
    _glslFragFor(key) {
        if (key === 'water') return this._glslFragWater();
        if (key === 'snow') return this._glslFrag('snow');
        return this._glslFrag();
    }
    _uniformNamesFor(key) {
        const sky = ['u_time','u_resolution','u_dark','u_wind','u_cloud_density','u_cloud_shade','u_cloud_base','u_cloud_size','u_cloud_gap','u_fx_speed','u_sky_top','u_sky_mid','u_sky_low','u_sky_base','u_noise'];
        if (key === 'sky') return sky;
        if (key === 'snow') return [...sky, 'u_density','u_hail','u_grain'];
        const base = ['u_time','u_resolution','u_dark','u_fx_speed','u_sky_top','u_sky_mid','u_sky_low','u_sky_base','u_ref_height'];
        if (key === 'water') return [...base, 'u_rain_intensity', 'u_lightning'];
        return base;
    }
    _buildProgram(gl, key, vs, fs) {
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) { console.error(`AWC ${key} vertex:`, gl.getShaderInfoLog(vs)); gl.deleteShader(vs); gl.deleteShader(fs); return null; }
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) { console.error(`AWC ${key} fragment:`, gl.getShaderInfoLog(fs)); gl.deleteShader(vs); gl.deleteShader(fs); return null; }
        const prog = gl.createProgram();
        gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
        gl.deleteShader(vs); gl.deleteShader(fs);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(`AWC ${key} link:`, gl.getProgramInfoLog(prog)); gl.deleteProgram(prog); return null; }
        const uniformNames = this._uniformNamesFor(key);
        const uniforms = {};
        for (const n of uniformNames) uniforms[n] = gl.getUniformLocation(prog, n);
        return { prog, uniforms };
    }
    _finalizeShaders(gl, compiled) {
        if (!this._shaderBank) this._shaderBank = {};
        for (const c of compiled) {
            const built = this._buildProgram(gl, c.key, c.vs, c.fs);
            if (built) this._shaderBank[c.key] = built;
        }
        if (!this._shaderBank.sky) return;

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        this._glBuf = buf;
        const skyBank = this._shaderBank.sky;
        this._glProg = skyBank.prog;
        this._glUniforms = skyBank.uniforms;
        gl.useProgram(skyBank.prog);
        const loc = gl.getAttribLocation(skyBank.prog, 'a_pos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        this._activeShaderKey = 'sky';
        if (!this._glNoiseTex) {
            const NOISE_SIZE = 256;
            const noiseData = new Uint8Array(NOISE_SIZE * NOISE_SIZE * 4);
            const seed = this._glSeed || 0;
            for (let iy = 0; iy < NOISE_SIZE; iy++) {
                for (let ix = 0; ix < NOISE_SIZE; ix++) {
                    const idx = (iy * NOISE_SIZE + ix) * 4;
                    for (let ch = 0; ch < 4; ch++) {
                        const sx = ix + seed * 0.7127 + ch * 53.1;
                        const sy = iy + seed * 1.3517 + ch * 97.3;
                        let v = Math.sin(sx * 127.1 + sy * 311.7) * 43758.5453;
                        v = v - Math.floor(v);
                        noiseData[idx + ch] = v * 255.0;
                    }
                }
            }
            const noiseTex = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, noiseTex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, NOISE_SIZE, NOISE_SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, noiseData);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
            this._glNoiseTex = noiseTex;
        }
        if (this._glNoiseTex && this._glUniforms && this._glUniforms.u_noise != null) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._glNoiseTex);
            gl.uniform1i(this._glUniforms.u_noise, 0);
        }
        this._startAnimation();
    }
    _weatherToUniforms() {
        const key = WEATHER_VISUALS[this._weatherState] ? this._weatherState : 'default';
        const vis = { ...VISUAL_DEFAULTS, ...WEATHER_VISUALS[key] };
        const colors = SKY_COLORS[key] || SKY_COLORS['default'];
        const isDark = this._isThemeDark ? 1.0 : 0.0;
        const skyColors = isDark ? colors.skyNight : colors.skyDay;
        const WIND_FULL_KMH = 80;
        const wind = Math.min(1.0, (this._windKmh || 0) / WIND_FULL_KMH);
        const fxSpeed = vis.engine === 'water' ? (0.4 + vis.rain * 0.9) : vis.cloudSpeed;
        const program = vis.engine === 'water' ? 'water' : (vis.snowfall > 0 ? 'snow' : 'sky');
        const p = this._shaderParams;
        if (p && p.shader === program && p.dark === isDark && p.wind === wind
            && p.fxSpeed === fxSpeed
            && p.cloudDensity === vis.cloudCover && p.cloudShade === vis.cloudShadow && p.cloudBase === vis.cloudThickness && p.cloudSize === vis.cloudScale && p.cloudGap === vis.clearing
            && p.rainIntensity === vis.rain && p.density === vis.snowfall && p.grain === vis.flakeSize && p.hail === vis.hail
            && p.lightning === vis.lightning
            && p.skyColors === skyColors) return p;
        return {
            shader: program, dark: isDark, wind,
            fxSpeed,
            cloudDensity: vis.cloudCover, cloudShade: vis.cloudShadow, cloudBase: vis.cloudThickness, cloudSize: vis.cloudScale, cloudGap: vis.clearing,
            rainIntensity: vis.rain,
            lightning: vis.lightning,
            density: vis.snowfall,
            grain: vis.flakeSize,
            hail: vis.hail,
            skyColors,
        };
    }
    _renderShader(timestamp) {
        const gl = this._gl;
        if (!gl || !this._glProg) return;
        if (gl.isContextLost()) return;
        const canvas = this._elements.glCanvas;
        if (!canvas || canvas.width === 0 || canvas.height === 0) return;
        const s = this._shaderParams;
        if (!s) return;

        const targetKey = s.shader || 'sky';
        if (targetKey !== this._activeShaderKey && this._shaderBank) {
            if (!this._shaderBank[targetKey] && this._gl && this._vertSrc && targetKey !== 'sky') {
                const vs = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vs, this._vertSrc); gl.compileShader(vs);
                const fs = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fs, this._glslFragFor(targetKey)); gl.compileShader(fs);
                const built = this._buildProgram(gl, targetKey, vs, fs);
                if (built) this._shaderBank[targetKey] = built;
            }
            const bank = this._shaderBank[targetKey] || this._shaderBank.sky;
            if (bank && bank.prog !== this._glProg) {
                gl.useProgram(bank.prog);
                gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuf);
                const loc = gl.getAttribLocation(bank.prog, 'a_pos');
                gl.enableVertexAttribArray(loc);
                gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
                this._glProg = bank.prog;
                this._glUniforms = bank.uniforms;
                this._activeShaderKey = targetKey;
                this._prevShaderParams = null;
                this._prevFxSpeed = null;
                        if (this._glNoiseTex && bank.uniforms.u_noise != null) {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, this._glNoiseTex);
                    gl.uniform1i(bank.uniforms.u_noise, 0);
                }
            }
        }

        gl.viewport(0, 0, canvas.width, canvas.height);
        const u = this._glUniforms;
        const cfg = this._config || {};
        const fxSpeed = s.fxSpeed;
        gl.uniform1f(u.u_time, timestamp * 0.001);
        gl.uniform2f(u.u_resolution, canvas.width, canvas.height);
        if (u.u_ref_height != null) gl.uniform1f(u.u_ref_height, 300.0 * (this._cachedDimensions.dpr || 1));
        if (s !== this._prevShaderParams) {
            gl.uniform1f(u.u_dark, s.dark);
            if (u.u_wind != null) gl.uniform1f(u.u_wind, s.wind);
            if (u.u_cloud_density != null) gl.uniform1f(u.u_cloud_density, s.cloudDensity);
            if (u.u_cloud_shade != null) gl.uniform1f(u.u_cloud_shade, s.cloudShade);
            if (u.u_cloud_base != null) gl.uniform1f(u.u_cloud_base, s.cloudBase);
            if (u.u_cloud_size != null) gl.uniform1f(u.u_cloud_size, s.cloudSize);
            if (u.u_cloud_gap != null) gl.uniform1f(u.u_cloud_gap, s.cloudGap);
            if (u.u_rain_intensity != null) gl.uniform1f(u.u_rain_intensity, s.rainIntensity);
            if (u.u_lightning != null) gl.uniform1f(u.u_lightning, s.lightning);
            if (u.u_density != null) gl.uniform1f(u.u_density, s.density);
            if (u.u_grain != null) gl.uniform1f(u.u_grain, s.grain);
            if (u.u_hail != null) gl.uniform1f(u.u_hail, s.hail);
            if (s.skyColors) {
                const sc = s.skyColors;
                gl.uniform3f(u.u_sky_top, sc[0][0], sc[0][1], sc[0][2]);
                gl.uniform3f(u.u_sky_mid, sc[1][0], sc[1][1], sc[1][2]);
                gl.uniform3f(u.u_sky_low, sc[2][0], sc[2][1], sc[2][2]);
                gl.uniform3f(u.u_sky_base, sc[3][0], sc[3][1], sc[3][2]);
            }
            this._prevShaderParams = s;
        }
        if (fxSpeed !== this._prevFxSpeed) { if (u.u_fx_speed != null) gl.uniform1f(u.u_fx_speed, fxSpeed); this._prevFxSpeed = fxSpeed; }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    _animate(now) {
        if (!this.isConnected || this._animId === null || !this._isVisible) { this._stopAnimation(); return; }
        this._animId = requestAnimationFrame(this._boundAnimate);
        if (!this._stateInitialized) return;
        if (now - this._lastFrameTime < this._frameInterval) return;
        this._lastFrameTime = now;
        this._renderStars(now);
        this._renderShader(now);
    }
    _startAnimation() {
        if (this._animId === null && this._isVisible && !this._isEffectivelyDisabled()) {
            this._animId = requestAnimationFrame(this._boundAnimate);
        }
    }
    _stopAnimation() {
        if (this._animId !== null) { cancelAnimationFrame(this._animId); this._animId = null; }
    }
    _isEffectivelyDisabled() {
        const cfg = this._config || {};
        return cfg.disable_background === true;
    }
}
const CARD_NAME = 'atmospheric-weather-card';
if (!customElements.get(CARD_NAME)) {
    customElements.define(CARD_NAME, AtmosphericWeatherCard); window.customCards = window.customCards || [];
    window.customCards.push({ type: CARD_NAME, name: 'Atmospheric Weather Card', description: 'A detail-oriented Home Assistant Weather Card' });
} else {
    console.info(`%c ${CARD_NAME} already defined`, 'color: orange; font-weight: bold;');
}

})();
