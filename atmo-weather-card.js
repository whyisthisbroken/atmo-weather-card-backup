/**
 * ATMO WEATHER CARD
 * Version: 6
 */
console.info(
    "%c ATMO WEATHER CARD ",
    "color: white; font-weight: 700; background: linear-gradient(90deg, #355C7D 0%, #6C5B7B 50%, #C06C84 100%); padding: 6px 12px; border-radius: 6px; font-family: sans-serif; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.2);"
);
try { CSS.registerProperty({ name: '--awc-ring-pct', syntax: '<percentage>', inherits: true, initialValue: '0%' }); } catch (_) {}
// CONSTANTS & CONFIGURATION
const NIGHT_MODES = Object.freeze([
    'dark', 'night', 'evening', 'on', 'true', 'below_horizon'
]);
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
// WEATHER CONFIGURATION
const WEATHER_MAP = Object.freeze({
    'clear-night': Object.freeze({
        type: 'stars', count: 280, cloud: 0, wind: 0.1, sunCloudWarm: false, atmosphere: 'night', stars: 420, vapor: 6, vaporScale: 0.4,
        celestial: null, glow: null, types: null
    }),
    'cloudy': Object.freeze({
        type: 'cloud', count: 0, cloud: 24, wind: 0.3, dark: false, sunCloudWarm: false, atmosphere: 'overcast', stars: 140, scale: 1.2, vapor: 28, vaporScale: 0.6,
        celestial: Object.freeze({ count: 7, baseScale: 0.70, baseOpacity: 0.8 }),
        glow: Object.freeze([255, 248, 220, 1.10, 0.5, 1.7, 1.3]),
        types: Object.freeze([['cumulus','cirrus','organic','cumulus','cumulus','cumulus','organic','cirrus','organic']])
    }),
    'fog': Object.freeze({
        type: 'fog', count: 0, cloud: 18, wind: 0.2, sunCloudWarm: false, atmosphere: 'mist', foggy: true, stars: 125, scale: 1.2, vapor: 12, vaporScale: 1.1,
        celestial: Object.freeze({ count: 3, baseScale: 0.74, baseOpacity: 0.60 }),
        glow: Object.freeze([250, 240, 215, 0.80, 0.4, 2.0, 1.05]),
        types: Object.freeze([['organic','cumulus','organic','cumulus','organic'], ['organic','cumulus','organic','organic','cumulus']])
    }),
    'hail': Object.freeze({
        type: 'hail', count: 150, cloud: 18, wind: 0.8, dark: true, sunCloudWarm: false, atmosphere: 'storm', stars: 50, scale: 1.5, vapor: 20, vaporScale: 1.1,
        celestial: Object.freeze({ count: 4, baseScale: 0.63, baseOpacity: 0.58 }),
        glow: Object.freeze([232, 222, 200, 0.18, 0.1, 3.0, 1.0]),
        types: Object.freeze([['organic','organic','cumulus','organic','organic','stratus','cumulus'], ['organic','cumulus','organic','organic','cumulus','organic','stratus'], ['organic','organic','organic','cumulus','stratus','cumulus','organic']])
    }),
    'lightning': Object.freeze({
        type: 'rain', count: 200, cloud: 24, wind: 1.0, thunder: true, dark: true, sunCloudWarm: false, atmosphere: 'storm', stars: 50, scale: 1.4, vapor: 22, vaporScale: 1.1,
        celestial: Object.freeze({ count: 4, baseScale: 0.63, baseOpacity: 0.58 }),
        glow: Object.freeze([232, 222, 200, 0.18, 0.1, 3.0, 1.0]),
        types: Object.freeze([['cumulus', 'organic', 'cumulus', 'organic', 'cumulus', 'cumulus', 'cumulus']])
    }),
    'lightning-rainy': Object.freeze({
        type: 'rain', count: 150, cloud: 18, wind: 1.0, thunder: true, dark: true, sunCloudWarm: false, atmosphere: 'storm', stars: 50, scale: 1.4, vapor: 22, vaporScale: 1.1,
        celestial: Object.freeze({ count: 4, baseScale: 0.63, baseOpacity: 0.58 }),
        glow: Object.freeze([232, 222, 200, 0.18, 0.1, 3.0, 1.0]),
        types: Object.freeze([['organic','organic','cumulus','organic','organic','stratus','cumulus'], ['organic','cumulus','organic','organic','cumulus','organic','cumulus'], ['organic','organic','organic','cumulus','cumulus','cumulus','organic']])
    }),
    'pouring': Object.freeze({
        type: 'rain', count: 220, cloud: 24, wind: 0.6, dark: true, sunCloudWarm: false, atmosphere: 'pouring', stars: 40, scale: 1.4, vapor: 20, vaporScale: 1.0,
        celestial: Object.freeze({ count: 4, baseScale: 0.58, baseOpacity: 0.55 }),
        glow: Object.freeze([240, 225, 195, 0.40, 0.2, 2.2, 1.0]),
        types: Object.freeze([['cumulus', 'cumulus', 'cumulus', 'cumulus', 'cumulus', 'cumulus', 'cumulus']])
    }),
    'rainy': Object.freeze({
        type: 'rain', count: 120, cloud: 24, wind: 0.3, sunCloudWarm: false, atmosphere: 'rain', stars: 60, scale: 1.2, vapor: 16, vaporScale: 0.9,
        celestial: Object.freeze({ count: 5, baseScale: 0.70, baseOpacity: 0.65 }),
        glow: Object.freeze([250, 238, 210, 0.55, 0.3, 2.0, 1.0]),
        types: Object.freeze([['cumulus', 'organic', 'cumulus', 'organic', 'cumulus', 'organic', 'cumulus']])
    }),
    'snowy': Object.freeze({
        type: 'snow', count: 60, cloud: 24, wind: 0.3, sunCloudWarm: false, atmosphere: 'snow', stars: 90, scale: 1.2, vapor: 14, vaporScale: 0.8,
        celestial: Object.freeze({ count: 6, baseScale: 0.66, baseOpacity: 0.68 }),
        glow: Object.freeze([248, 244, 230, 0.70, 0.3, 1.8, 1.0]),
        types: Object.freeze([['cumulus', 'organic', 'cumulus', 'organic', 'cumulus', 'cumulus', 'cumulus']])
    }),
    'snowy-rainy': Object.freeze({
        type: 'mix', count: 100, cloud: 16, wind: 0.4, sunCloudWarm: false, atmosphere: 'snow', stars: 125, scale: 1.4, vapor: 14, vaporScale: 0.8,
        celestial: Object.freeze({ count: 6, baseScale: 0.66, baseOpacity: 0.68 }),
        glow: Object.freeze([248, 244, 230, 0.70, 0.3, 1.8, 1.0]),
        types: Object.freeze([['organic','organic','cumulus','organic','stratus','cumulus','cirrus'], ['organic','cumulus','organic','cirrus','stratus','organic'], ['organic','organic','organic','stratus','cumulus','cumulus','cirrus']])
    }),
    'partlycloudy': Object.freeze({
        type: 'cloud', count: 0, cloud: 18, wind: 0.2, sunCloudWarm: true, atmosphere: 'fair', stars: 160, scale: 1.2, vapor: 18, vaporScale: 0.8,
        celestial: null, glow: Object.freeze([255, 240, 200, 0.95, 1.0, 1.1, 1.0]),
        types: Object.freeze([['cumulus','cirrus','cumulus','cumulus','organic','organic','cirrus'], ['cumulus','cumulus','cumulus','organic','cirrus','cirrus','organic'], ['cumulus','cumulus','cumulus','organic','organic','cumulus','stratus'], ['cumulus','organic','cirrus','cirrus','cirrus','organic','cumulus']])
    }),
    'windy': Object.freeze({
        type: 'cloud', count: 0, cloud: 22, wind: 2.2, windVapor: true, sunCloudWarm: false, atmosphere: 'windy', stars: 125, scale: 1.3, vapor: 28, vaporScale: 1.2,
        celestial: Object.freeze({ count: 3, baseScale: 0.52, baseOpacity: 0.55 }),
        glow: Object.freeze([252, 248, 225, 0.95, 0.6, 1.4, 1.0]),
        types: Object.freeze([['cumulus','cumulus','organic','cumulus','cumulus','cumulus','organic','organic','organic']])
    }),
    'windy-variant': Object.freeze({
        type: 'cloud', count: 0, cloud: 15, wind: 2.4, dark: false, windVapor: true, sunCloudWarm: false, atmosphere: 'windy', stars: 125, scale: 1.2, vapor: 26, vaporScale: 1.1,
        celestial: Object.freeze({ count: 3, baseScale: 0.52, baseOpacity: 0.55 }),
        glow: Object.freeze([252, 248, 225, 0.95, 0.6, 1.4, 1.0]),
        types: Object.freeze([['organic','cumulus','cumulus','organic','organic','cumulus','organic'], ['cumulus','organic','cumulus','organic','cumulus','organic','organic'], ['cumulus','organic','organic','cumulus','organic','cumulus','organic']])
    }),
    'sunny': Object.freeze({
        type: 'sun', count: 0, cloud: 18, wind: 0.1, sunCloudWarm: true, atmosphere: 'clear', stars: 0, vapor: 26, vaporScale: 0.9,
        celestial: null, glow: Object.freeze([255, 244, 210, 1.00, 1.0, 1.0, 1.0]),
        types: Object.freeze([['cirrus','stratus','cirrus','organic','cirrus'], ['cirrus','cirrus','organic','cirrus','organic'], ['cirrus','cirrus','cirrus','cirrus','organic']])
    }),
    'exceptional': Object.freeze({
        type: 'sun', count: 0, cloud: 12, wind: 0.1, sunCloudWarm: false, atmosphere: 'exceptional', stars: 420, vapor: 24, vaporScale: 0.8,
        celestial: null, glow: Object.freeze([255, 246, 215, 1.00, 1.0, 1.0, 1.0]),
        types: Object.freeze([['cirrus','cirrus'], ['cirrus','cirrus'], ['stratus','cirrus']])
    }),
    'default': Object.freeze({
        type: 'none', count: 0, cloud: 6, wind: 0.1, sunCloudWarm: false, atmosphere: 'fair', stars: 260, vapor: 12, vaporScale: 0.7,
        celestial: null, glow: Object.freeze([255, 240, 200, 0.95, 1.0, 1.1, 1.0]),
        types: Object.freeze([['cumulus','cumulus','organic','organic','stratus','cirrus'], ['organic','organic','cumulus','cumulus','stratus','stratus'], ['cirrus','cirrus','cumulus','organic','stratus','stratus']])
    })
});
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
    'exceptional': 'mdi:weather-sunny-alert',
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
const MOON_PHASES = Object.freeze({
    'new_moon':         { illumination: 0.0,  direction: 'right' },
    'waxing_crescent':  { illumination: 0.25, direction: 'right' },
    'first_quarter':    { illumination: 0.5,  direction: 'right' },
    'waxing_gibbous':   { illumination: 0.75, direction: 'right' },
    'full_moon':        { illumination: 1.0,  direction: 'none' },
    'waning_gibbous':   { illumination: 0.75, direction: 'left' },
    'last_quarter':     { illumination: 0.5,  direction: 'left' },
    'waning_crescent':  { illumination: 0.25, direction: 'left' }
});
const LIMITS = Object.freeze({
    MAX_SHOOTING_STARS: 2,
    MAX_BOLTS: 4
});
const PARTICLE_ARRAYS = Object.freeze([
    '_rain', '_snow', '_hail', '_clouds', '_fgClouds', '_stars',
    '_bolts', '_fogBanks', '_windVapor', '_shootingStars',
    '_planes', '_birds', '_comets', '_celestialClouds'
]);
// GEOMETRY TABLES — named pixel offsets for icon glyph positions
const MOON_CRATERS = Object.freeze({
    maria: [
        { dx: -9, dy:  2, rx: 7, ry: 9, rot:  0.2 },
        { dx:  8, dy: -6, rx: 6, ry: 4, rot: -0.3 },
        { dx: -2, dy: 10, rx: 5, ry: 3, rot:  0.1 }
    ],
    mariaInner: [
        { dx: -9, dy:  2, rx: 4, ry: 6, rot:  0.2 },
        { dx:  8, dy: -6, rx: 3, ry: 2, rot: -0.3 },
        { dx: -2, dy: 10, rx: 2.5, ry: 1.5, rot: 0.1 }
    ],
    detail: [
        { dx:  6, dy:  5, r: 2.2 },
        { dx: -5, dy: -8, r: 1.8 },
        { dx:  3, dy: -12, r: 1.6 },
        { dx: -13, dy: -3, r: 1.5 },
        { dx: 11, dy:  4, r: 1.5 }
    ],
    rimHighlights: [
        { dx: -12, dy: -1, r: 1.0 },
        { dx:  5,  dy: -9, r: 1.0 },
        { dx:  4,  dy:  3, r: 0.9 }
    ]
});
const MOON_STYLE_COLORS = Object.freeze({
    newMoon: {
        yellow: [{ rgb: '210,205,190', op: 0.10 }],
        blue:   [{ rgb: '140,155,180', op: 0.10 }],
        purple: [{ rgb: '155,140,170', op: 0.10 }],
        grey:   [{ rgb: '145,148,155', op: 0.10 }],
        light:  [{ rgb: '200,210,225', op: 0.20 }],
        dark:   [{ rgb: '40,45,55', op: 0.80 }, { rgb: '80,90,110', op: 0.15 }]
    },
    darkSide: {
        yellow: { rgb: '210,205,190', op: 0.15 },
        blue:   { rgb: '120,135,165', op: 0.14 },
        purple: { rgb: '138,125,155', op: 0.14 },
        grey:   { rgb: '130,132,140', op: 0.14 },
        light:  { rgb: '175,188,208', op: 0.55 },
        dark:   { rgb: '35,40,50', op: 0.90 }
    },
    ringStroke: {
        blue:   { rgb: '100,125,168', op: 0.22 },
        purple: { rgb: '140,118,165', op: 0.22 },
        grey:   { rgb: '110,112,122', op: 0.22 },
        yellow: { rgb: '155,182,228', op: 0.28 }
    },
    glow: {
        yellow: { peak: 1.10, stops: [[0,'255,220,80',1.10],[0.35,'255,180,40',0.60],[0.65,'255,140,0',0.22],[1,'255,140,0',0]] },
        blue:   { peak: 0.75, stops: [[0,'90,115,170',0.75],[0.30,'100,125,175',0.35],[0.60,'115,138,180',0.12],[1,'130,150,190',0]] },
        purple: { peak: 0.75, stops: [[0,'140,115,170',0.75],[0.30,'148,125,172',0.35],[0.60,'155,138,175',0.12],[1,'165,150,180',0]] },
        grey:   { peak: 0.70, stops: [[0,'105,110,120',0.70],[0.30,'115,118,128',0.32],[0.60,'125,128,138',0.10],[1,'140,142,150',0]] },
        light:  { peak: 1.10, stops: [[0,'140,175,255',1.10],[0.35,'155,190,255',0.60],[0.65,'175,205,255',0.22],[1,'200,220,255',0]] }
    },
    fullDisc: {
        yellow: { peak: 0.95, stops: [[0,'245,230,140',0.95],[0.5,'240,210,80',0.85],[1,'235,180,40',0.75]] },
        blue:   { peak: 0.88, stops: [[0,'165,180,210',0.88],[0.5,'125,145,185',0.80],[1,'95,115,160',0.70]] },
        purple: { peak: 0.88, stops: [[0,'185,170,200',0.88],[0.5,'155,138,175',0.80],[1,'125,108,150',0.70]] },
        grey:   { peak: 0.88, stops: [[0,'175,178,185',0.88],[0.5,'140,142,150',0.80],[1,'110,112,120',0.70]] },
        light:  { peak: 0.85, stops: [[0,'255,255,255',0.85],[0.5,'238,242,250',0.78],[1,'210,220,238',0.65]] },
        dark:   { peak: 0.95, stops: [[0,'255,255,250',0.95],[0.7,'230,235,245',0.90],[1,'200,210,230',0.85]] }
    },
    partDisc: {
        yellow: { peak: 0.90, stops: [[0,'245,230,140',0.90],[0.6,'240,210,80',0.80],[1,'235,180,40',0.70]] },
        blue:   { peak: 0.85, stops: [[0,'165,180,210',0.85],[0.6,'125,145,185',0.75],[1,'95,115,160',0.65]] },
        purple: { peak: 0.85, stops: [[0,'185,170,200',0.85],[0.6,'155,138,175',0.75],[1,'125,108,150',0.65]] },
        grey:   { peak: 0.85, stops: [[0,'175,178,185',0.85],[0.6,'140,142,150',0.75],[1,'110,112,120',0.65]] },
        light:  { peak: 0.82, stops: [[0,'255,255,255',0.82],[0.6,'240,244,252',0.72],[1,'218,228,242',0.58]] },
        dark:   { peak: 0.95, stops: [[0,'255,255,250',0.95],[0.6,'235,240,248',0.90],[1,'210,220,235',0.85]] }
    },
    lightDisc: {
        yellow: 'rgb(250,245,225)',
        blue:   'rgb(225,232,248)',
        purple: 'rgb(235,228,245)',
        grey:   'rgb(232,233,238)',
        light:  'rgb(228,234,248)'
    }
});
const PLANE_PATH = Object.freeze([
    [  6, 0, -6,  0 ],
    [ -5, 0, -8, -4 ],
    [  1, 0, -2,  2 ]
]);
const TWO_PI = Math.PI * 2;
function fillCircle(ctx, x, y, r) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, TWO_PI); ctx.fill();
}
function parseCSSVal(v) {
    const s = String(v).trim(); if (!s || s === '0') return '0px';
    return /[%a-z]/i.test(s) ? s : s + 'px';
}
function parseAnchor(anchor) {
    if (anchor === 'center') return ['center', 'center']; if (anchor === 'left') return ['center', 'left'];
    if (anchor === 'right') return ['center', 'right'];
    return anchor.includes('-') ? anchor.split('-') : ['top', anchor];
}
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function escapeHtmlAttr(value) {
    return escapeHtml(value);
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
// Forecast helpers
const _fcCache = new Map(); // module-level: survives HA editor destroy/recreate cycles
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
const _FC_UNIT_MAP = { temperature: 'temperature_unit', templow: 'temperature_unit', wind_speed: 'wind_speed_unit', precipitation: 'precipitation_unit', pressure: 'pressure_unit', visibility: 'visibility_unit', dew_point: 'temperature_unit' };
const _FC_UNIT_FALLBACK = { humidity: '%', precipitation_probability: '%', cloud_coverage: '%', wind_bearing: '°', uv_index: '' };
const STAR_TIER_PROPS = Object.freeze({
    bg:   [1.2, 0.4, 0.35, 0.2, 0.04, 0.04],
    mid:  [1.8, 0.6, 0.60, 0.25, 0.02, 0.02],
    hero: [2.2, 0.8, 0.85, 0.15, 0.005, 0.01]
});
const STAR_PALETTE_GOLDEN = Object.freeze([
    [0.3,  42, 90, 42],
    [0.85, 36, 85, 46],
    [1,    28, 90, 38]
]);
const STAR_PALETTE_GLOW = Object.freeze([
    [0.3, 215, 30, 88],
    [0.85, 200, 5, 95],
    [1, 35, 35, 85]
]);
function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100; let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q; if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
    }
    return [(r * 255 + 0.5) | 0, (g * 255 + 0.5) | 0, (b * 255 + 0.5) | 0];
}
const CONTRAIL_OFFSETS = Object.freeze([3, -3]);
const BAD_WEATHER_TYPES = Object.freeze(new Set([
    'rain', 'hail', 'fog', 'lightning', 'lightning-rainy', 'pouring', 'rainy', 'snowy-rainy'
]));
const STORM_TYPES = Object.freeze(new Set([
    'lightning', 'lightning-rainy', 'pouring'
]));
const LIGHT_BAD_BOOST_TYPES = Object.freeze(new Set([
    'rain', 'rainy', 'hail', 'snowy-rainy', 'fog'
]));
const CLOUD_PALETTES = Object.freeze({
    darkNight:    [215,225,245,  58, 72,112,  15, 22, 45,  0.72, 0.66, 0.05],
    darkDay:      [218,228,250, 110,128,176,  52, 66,114,  0.86, 0.62, 0.07],
    lightStorm:   [255,255,255, 198,208,228, 114,129,165,  1.00, 0.89, 0.15],
    lightRain:    [255,255,255, 202,212,232, 120,136,174,  1.00, 0.88, 0.14],
    lightFair:    [255,255,255, 222,228,240, 138,152,190,  1.00, 0.76, 0.14],
    lightOvercast:[255,255,255, 222,228,240, 138,152,190,  1.00, 0.76, 0.14],
    lightDefault: [252,254,255, 210,218,234, 118,134,174,  1.00, 0.77, 0.14]
});
// Cloud type specs: shape, placement, bake profile, and palette tint unified.
// layers: [lo,hi] depth tier. jitterX/Y: [base,range] puff scatter. stretch: [base,range] horizontal.
// flattenMul: vCompress multiplier. yBand: [min, max] — negative max = heightLimit offset.
// profile: [shadowCut, surfaceCut, hlMul, shadowRadMul, surfaceRadMul] for gradient baking.
// tint: [litR,litG,litB, midR,midG,midB, shadR,shadG,shadB] additive palette offset per type.
// uncinus (cirrus only): [probability, hStretch_base, hStretch_range, flattenMul].
const CLOUD_TYPES = Object.freeze({
    cumulus:  Object.freeze({ layers:[1,2], jitterX:[0.92,0.20],  jitterY:[0.88,0.22],  stretch:[1.12,0.12], flattenMul:1.35, yBand:[0.20,-0.06], profile:[0.25,0.68,1.15,1.12,0.90], tint:[0,0,-3, 0,2,4, -6,0,10] }),
    organic: Object.freeze({ layers:[1,2], jitterX:[0.855,0.18], jitterY:[0.945,0.21], stretch:[1.0,0],     flattenMul:1.15, yBand:[0.12,-0.04], profile:[0.26,0.72,0.90,1.04,0.92], tint:[0,0,0, 0,0,0, 0,0,0] }),
    stratus: Object.freeze({ layers:[2,3], jitterX:[0.95,0.15],  jitterY:[0.92,0.12],  stretch:[1.15,0.25], flattenMul:1.0,  yBand:[0.10,0.42],  profile:[0.15,0.85,0.75,1.18,0.95], tint:[0,-2,0, -8,-6,6, -2,-2,4] }),
    cirrus:  Object.freeze({ layers:[3,4], jitterX:[0.95,0.15],  jitterY:[0.92,0.12],  stretch:[1.35,0.35], flattenMul:0.82, yBand:[0.04,0.22],  profile:[0.12,0.40,0.62,1.00,0.88], tint:[0,0,-6, 4,2,-4, 4,4,-2], uncinus:[0.60,1.15,0.20,0.85] }),
    storm:   Object.freeze({ layers:[1,2], jitterX:[0.855,0.18], jitterY:[0.945,0.21], stretch:[1.0,0],     flattenMul:1.0,  yBand:[0.12,-0.04], profile:[0.40,0.78,1.05,1.15,0.88], tint:[0,0,0, 0,0,0, -3,0,4] }),
    scud:    Object.freeze({ layers:[5,5], jitterX:[1.0,0],      jitterY:[1.0,0],      stretch:[1.0,0],     flattenMul:1.0,  yBand:[0,0.75],     profile:[0.20,0.65,1.00,1.08,0.93], tint:[0,0,0, -6,-4,8, -4,-2,6] }),
});
const CELESTIAL_CLOUD_PALETTES = Object.freeze({
    warm: Object.freeze({
        litR: 255, litG: 252, litB: 235,
        midR: 252, midG: 230, midB: 188,
        shadowR: 220, shadowG: 188, shadowB: 142
    }),
    cool: Object.freeze({
        litR: 255, litG: 255, litB: 255,
        midR: 215, midG: 224, midB: 240,
        shadowR: 148, shadowG: 162, shadowB: 192
    }),
    moon: Object.freeze({
        litR: 218, litG: 228, litB: 250,
        midR: 65, midG: 80, midB: 125,
        shadowR: 18, shadowG: 26, shadowB: 52
    }),
    moonLight: Object.freeze({
        litR: 248, litG: 250, litB: 255,
        midR: 218, midG: 226, midB: 242,
        shadowR: 142, shadowG: 156, shadowB: 196
    }),
    darkDay: Object.freeze({
        litR: 222, litG: 232, litB: 252,
        midR: 148, midG: 165, midB: 208,
        shadowR: 60, shadowG: 76, shadowB: 122
    })
});
const TRAIL_CAP_SHOOTING_STAR = 22, TRAIL_CAP_COMET = 100, TRAIL_CAP_PLANE = 500, CLOUD_ATLAS_SIZE_DEFAULT = 2048;
const CLOUD_ATLAS_MAX = 4;
const PERFORMANCE_CONFIG = Object.freeze({
    RESIZE_DEBOUNCE_MS: 150,
    VISIBILITY_THRESHOLD: 0.01,
    REVEAL_TRANSITION_MS: 0,
    MAX_DPR: 2.0,
    MAX_PIXELS: 2073600
});
const PERF_PRESETS = Object.freeze({
    low:     { perf_fps: 24, perf_cloud_quality: 0.5, perf_effects: 0, perf_fauna: 0, perf_dpr: 1.0 },
    default: { perf_fps: 30, perf_cloud_quality: 1.5, perf_effects: 1, perf_fauna: 2, perf_dpr: 2.0 },
    ultra:   { perf_fps: 60, perf_cloud_quality: 2.0, perf_effects: 2, perf_fauna: 2, perf_dpr: 2.0 }
});
const FILTER_PRESETS = Object.freeze({
    'darken':  'brightness(0.72) contrast(1.1)',
    'vivid':   'saturate(1.5) contrast(1.12) brightness(1.02)',
    'muted':   'saturate(0.55) brightness(1.08)',
    'warm':    'sepia(0.25) saturate(1.15) brightness(1.0)'
});
const WEATHER_CLASSES = Object.freeze([
    'weather-overcast','weather-rainy','weather-storm',
    'weather-snow','weather-partly','weather-fog','weather-exceptional','weather-pouring'
]);
const POS_CLASSES = Object.freeze(['pos-top-left','pos-top-center','pos-top-right','pos-left','pos-center','pos-right','pos-bottom-left','pos-bottom-center','pos-bottom-right']);
const ATMOSPHERE_CSS = Object.freeze({
    mist:'weather-fog', fog:'weather-fog', overcast:'weather-overcast', windy:'weather-overcast',
    fair:'weather-partly', rain:'weather-rainy', pouring:'weather-pouring',
    storm:'weather-storm', snow:'weather-snow', exceptional:'weather-exceptional'
});
// CLOUD SHAPE GENERATOR
class CloudShapeGenerator {
    static generateOrganicPuffs(isStorm, seed, baseUnit = 100, quality = 1.0) {
        const puffs = [], seededRandom = this._seededRandom(seed), s = baseUnit / 100, puffCount = Math.max(4, Math.round((isStorm ? 14 : 12) * quality));
        const baseWidth = (isStorm ? 110 : 105) * s, baseHeight = (isStorm ? 60 : 42) * s;
        for (let i = 0; i < puffCount; i++) {
            const angle = (i / puffCount) * TWO_PI + seededRandom() * 0.5, distFromCenter = seededRandom() * 0.6 + 0.2;
            let dx = Math.cos(angle) * (baseWidth / 2) * distFromCenter, dy = Math.sin(angle) * (baseHeight / 2) * distFromCenter * 0.6;
            if (isStorm) {
                if (dy > 0) {
                    dy *= 0.4;
                } else if (Math.abs(dx) < baseWidth * 0.4) {
                    dy -= (seededRandom() * 28 * s);
                }
            }
            const centerDist = Math.sqrt(dx * dx + dy * dy) / (baseWidth / 2), baseRad = (isStorm ? 62 : 50) * s, radVariation = (isStorm ? 22 : 16) * s;
            const rad = baseRad + seededRandom() * radVariation - centerDist * 12 * s;
            const verticalShade = 0.4 + (1 - (dy + baseHeight / 2) / baseHeight) * 0.4;
            const shade = verticalShade + seededRandom() * 0.05, softness = 0.3 + seededRandom() * 0.4, squash = 0.75 + seededRandom() * 0.25;
            const rotation = (seededRandom() - 0.5) * 0.60;
            puffs.push({ offsetX: dx, offsetY: dy, rad: Math.max(15 * s, rad), shade: Math.min(1, shade), softness, squash, rotation, depth: seededRandom() });
        }
        const detailCount = Math.max(1, Math.round((isStorm ? 8 : 6) * quality));
        for (let i = 0; i < detailCount; i++) {
            const angle = seededRandom() * TWO_PI, dist = 0.3 + seededRandom() * 0.45;
            puffs.push({ offsetX: Math.cos(angle) * (baseWidth / 2) * dist, offsetY: Math.sin(angle) * (baseHeight / 2) * dist * 0.5 - 10 * s, rad: (14 + seededRandom() * 16) * s, shade: 0.5 + seededRandom() * 0.3, softness: 0.5 + seededRandom() * 0.3, squash: 0.6 + seededRandom() * 0.3, rotation: (seededRandom() - 0.5) * 0.80, depth: 0.8 + seededRandom() * 0.2 });
        }
        puffs.sort((a, b) => a.depth - b.depth);
        return puffs;
    }
    static generateWispyPuffs(seed, baseUnit = 100, quality = 1.0) {
        const puffs = [], seededRandom = this._seededRandom(seed), s = baseUnit / 100, puffCount = Math.max(3, Math.round((8 + Math.floor(seededRandom() * 4)) * quality));
        // Per-cloud aspect variance: 1.3x-1.8x horizontal. Real clouds vary in shape;
        // fixed aspect produces uniform blobs that read as fake.
        const aspectH = 30 + seededRandom() * 10, aspectV = 20 + seededRandom() * 6;
        for (let i = 0; i < puffCount; i++) {
            const angle = (i / puffCount) * TWO_PI + seededRandom() * 0.8, dist = 0.05 + seededRandom() * 0.85;
            puffs.push({ offsetX: Math.cos(angle) * aspectH * s * dist, offsetY: Math.sin(angle) * aspectV * s * dist, rad: (15 + seededRandom() * 18) * s, shade: 0.5 + seededRandom() * 0.4, softness: 0.4 + seededRandom() * 0.4, squash: 0.85 + seededRandom() * 0.18, rotation: seededRandom() * 0.5, depth: seededRandom() });
        }
        puffs.sort((a, b) => a.depth - b.depth);
        return puffs;
    }
    static generateSunDecorationPuffs(seed, baseUnit = 100, quality = 1.0) {
        const puffs = [], seededRandom = this._seededRandom(seed), s = baseUnit / 100, halfWidth = (54 + seededRandom() * 16) * s;
        const baselineY = (10 + seededRandom() * 4) * s, totalSpan = halfWidth * 2, bottomCount = Math.max(2, Math.round((6 + Math.floor(seededRandom() * 2)) * quality));
        for (let i = 0; i < bottomCount; i++) {
            const t = bottomCount === 1 ? 0.5 : i / (bottomCount - 1);
            const x = -halfWidth + totalSpan * t + (seededRandom() - 0.5) * 22 * s;
            const edge = Math.abs(x) / (halfWidth + 1), taper = 1 - Math.pow(edge, 1.6) * 0.30, rad = (20 + seededRandom() * 14) * s * taper;
            const y = baselineY - rad * (0.70 + seededRandom() * 0.25) + (seededRandom() - 0.5) * 10 * s;
            puffs.push({ offsetX: x, offsetY: y, rad, shade: 0.42 + seededRandom() * 0.14, softness: 0.38 + seededRandom() * 0.14, squash: 0.62 + seededRandom() * 0.18, rotation: (seededRandom() - 0.5) * 0.55, depth: seededRandom() * 0.28 });
        }
        const bodyCount = Math.max(2, Math.round((6 + Math.floor(seededRandom() * 3)) * quality));
        for (let i = 0; i < bodyCount; i++) {
            const t = bodyCount === 1 ? 0.5 : i / (bodyCount - 1);
            const x = -halfWidth * 0.85 + totalSpan * 0.85 * t + (seededRandom() - 0.5) * 26 * s;
            const edge = Math.abs(x) / (halfWidth + 1), taper = 1 - Math.pow(edge, 1.6) * 0.35, rad = (16 + seededRandom() * 18) * s * taper;
            const y = baselineY - rad - (6 + seededRandom() * 14) * s + (seededRandom() - 0.5) * 12 * s;
            puffs.push({ offsetX: x, offsetY: y, rad, shade: 0.58 + seededRandom() * 0.18, softness: 0.32 + seededRandom() * 0.14, squash: 0.68 + seededRandom() * 0.18, rotation: (seededRandom() - 0.5) * 0.45, depth: 0.32 + seededRandom() * 0.30 });
        }
        const crownCount = Math.max(1, Math.round((3 + Math.floor(seededRandom() * 3)) * quality));
        for (let i = 0; i < crownCount; i++) {
            const t = crownCount === 1 ? 0.5 : i / (crownCount - 1);
            const x = -halfWidth * 0.55 + totalSpan * 0.55 * t + (seededRandom() - 0.5) * 24 * s;
            const edge = Math.abs(x) / (halfWidth + 1), taper = 1 - Math.pow(edge, 1.8) * 0.35, rad = (12 + seededRandom() * 14) * s * taper;
            const y = baselineY - (26 + seededRandom() * 16) * s - rad * 0.5 + (seededRandom() - 0.5) * 10 * s;
            puffs.push({ offsetX: x, offsetY: y, rad, shade: 0.74 + seededRandom() * 0.18, softness: 0.28 + seededRandom() * 0.14, squash: 0.70 + seededRandom() * 0.18, rotation: (seededRandom() - 0.5) * 0.50, depth: 0.70 + seededRandom() * 0.30 });
        }
        puffs.sort((a, b) => a.depth - b.depth);
        return puffs;
    }
    static generateCirrusLayeredPuffs(seed, baseUnit = 100, quality = 1.0) {
        const puffs = [], seededRandom = this._seededRandom(seed), s = baseUnit / 100, layerCount = 2 + Math.floor(seededRandom() * 2);
        const layerSpan = 90 * s;
        for (let L = 0; L < layerCount; L++) {
            const layerY = (seededRandom() - 0.5) * 14 * s, layerOpacity = 0.65 + seededRandom() * 0.35, puffsInLayer = Math.max(3, Math.round((7 + Math.floor(seededRandom() * 3)) * quality));
            const spacing = layerSpan / (puffsInLayer - 1);
            for (let i = 0; i < puffsInLayer; i++) {
                const x = -layerSpan / 2 + i * spacing + (seededRandom() - 0.5) * spacing * 0.45;
                const yJitter = (seededRandom() - 0.5) * 8 * s;
                const taper = Math.max(0.60, 1 - Math.pow(Math.abs(x) / (layerSpan / 2 + 1), 1.6) * 0.40);
                puffs.push({ offsetX: x, offsetY: layerY + yJitter, rad: (14 + seededRandom() * 10) * s * taper, shade: (0.55 + seededRandom() * 0.30) * layerOpacity, softness: 0.45 + seededRandom() * 0.30, squash: 0.70 + seededRandom() * 0.20, rotation: (seededRandom() - 0.5) * 0.25, depth: L * 0.3 + seededRandom() * 0.3 });
            }
        }
        puffs.sort((a, b) => a.depth - b.depth);
        return puffs;
    }
    static generateCirrusUncinusPuffs(seed, baseUnit = 100, quality = 1.0) {
        const puffs = [], seededRandom = this._seededRandom(seed), s = baseUnit / 100, length = (170 + seededRandom() * 80) * s;
        const waveAmp = (14 + seededRandom() * 10) * s, waveFreq = 0.7 + seededRandom() * 0.5, hookStart = 0.70 + seededRandom() * 0.10;
        const hookDir = seededRandom() < 0.5 ? -1 : 1, hookAmp = (24 + seededRandom() * 18) * s, strokeCount = seededRandom() < 0.55 ? 2 : 1;
        const sampleCurve = (t) => {
            const x = -length / 2 + t * length; let y = Math.sin(t * waveFreq * TWO_PI) * waveAmp;
            if (t > hookStart) {
                const h = (t - hookStart) / (1 - hookStart); y += hookDir * hookAmp * h * h;
            }
            return { x, y };
        };
        for (let stroke = 0; stroke < strokeCount; stroke++) {
            const echoOffsetY = stroke === 0 ? 0 : (9 + seededRandom() * 9) * s, echoOpacity = stroke === 0 ? 1.0 : 0.55 + seededRandom() * 0.20;
            const startT = stroke === 0 ? 0 : 0.15 + seededRandom() * 0.20, endT   = stroke === 0 ? 1 : 0.70 + seededRandom() * 0.20;
            const puffCount = Math.max(4, Math.round((13 + Math.floor(seededRandom() * 5)) * quality));
            for (let i = 0; i < puffCount; i++) {
                const tNorm = i / (puffCount - 1), t = startT + (endT - startT) * tNorm, p = sampleCurve(t), pNext = sampleCurve(Math.min(1, t + 0.004));
                const rawTangent = Math.atan2(pNext.y - p.y, pNext.x - p.x), tangent = Math.max(-0.38, Math.min(0.38, rawTangent));
                const edge = Math.min(tNorm, 1 - tNorm) * 2, taper = 0.65 + edge * 0.35;
                puffs.push({ offsetX: p.x + (seededRandom() - 0.5) * 4 * s, offsetY: p.y + echoOffsetY + (seededRandom() - 0.5) * 3 * s, rad: (12 + seededRandom() * 7) * s * taper, shade: (0.50 + seededRandom() * 0.28) * echoOpacity, softness: 0.45 + seededRandom() * 0.22, squash: 0.55 + seededRandom() * 0.15, rotation: tangent + (seededRandom() - 0.5) * 0.12, depth: stroke * 0.35 + seededRandom() * 0.55 });
            }
        }
        puffs.sort((a, b) => a.depth - b.depth);
        return puffs;
    }
    static generateMixedPuffs(seed, variety = 'cumulus', baseUnit = 100, quality = 1.0) {
        const puffs = [], seededRandom = this._seededRandom(seed), s = baseUnit / 100;
        if (variety === 'cumulus') {
            const baseWidth   = 110 * s, towerFactor = 0.5 + seededRandom() * 0.9, asymShift   = (seededRandom() - 0.5) * 22 * s;
            const baseCount = Math.max(2, Math.round((4 + Math.floor(seededRandom() * 2)) * quality));
            for (let i = 0; i < baseCount; i++) {
                const t = baseCount > 1 ? (i / (baseCount - 1)) - 0.5 : 0;
                puffs.push({ offsetX: t * baseWidth * 0.88 + (seededRandom() - 0.5) * 15 * s, offsetY: (6 + seededRandom() * 10) * s, rad: (26 + seededRandom() * 18) * s, shade: 0.38 + seededRandom() * 0.05, softness: 0.35, squash: 1.0, rotation: 0, depth: seededRandom() * 0.25 });
            }
            const bodyCount = Math.max(2, Math.round((8 + Math.floor(seededRandom() * 4)) * quality));
            for (let i = 0; i < bodyCount; i++) {
                puffs.push({ offsetX: (seededRandom() - 0.5) * baseWidth * (0.40 + seededRandom() * 0.25) + asymShift * 0.35, offsetY: -(20 + seededRandom() * 58) * s, rad: (22 + seededRandom() * 20) * s, shade: 0.62 + seededRandom() * 0.08, softness: 0.28, squash: 1.0, rotation: 0, depth: 0.22 + seededRandom() * 0.48 });
            }
            const crownCount = Math.max(1, Math.round((4 + Math.floor(seededRandom() * 2 + towerFactor * 1.5)) * quality));
            for (let i = 0; i < crownCount; i++) {
                puffs.push({ offsetX: (seededRandom() - 0.5) * baseWidth * 0.42 + asymShift * 0.60, offsetY: -(82 + towerFactor * 54 + seededRandom() * 52) * s, rad: (16 + seededRandom() * 18) * s, shade: 0.80 + seededRandom() * 0.05, softness: 0.22, squash: 1.0, rotation: 0, depth: 0.68 + seededRandom() * 0.32 });
            }
            const detailMixed = Math.max(0, Math.round(3 * quality));
            for (let i = 0; i < detailMixed; i++) {
                const a = seededRandom() * TWO_PI;
                puffs.push({ offsetX: Math.cos(a) * (baseWidth * 0.35 + seededRandom() * 10 * s), offsetY: -(28 + seededRandom() * 48) * s, rad: (14 + seededRandom() * 15) * s, shade: 0.60 + seededRandom() * 0.10, softness: 0.38, squash: 1.0, rotation: 0, depth: seededRandom() });
            }
        } else if (variety === 'stratus') {
            const puffCount = Math.max(4, Math.round((14 + Math.floor(seededRandom() * 6)) * quality));
            for (let i = 0; i < puffCount; i++) {
                const spreadX = (i - puffCount / 2) * 18 * s + (seededRandom() - 0.5) * 10 * s;
                const spreadY = (seededRandom() - 0.5) * 14 * s, normalY = (spreadY + 7 * s) / (14 * s);
                puffs.push({ offsetX: spreadX, offsetY: spreadY, rad: (16 + seededRandom() * 14) * s, shade: 0.48 + (1 - normalY) * 0.30 + seededRandom() * 0.06, softness: 0.2 + seededRandom() * 0.3, squash: 0.55, rotation: 0, depth: seededRandom() });
            }
            const coreCount = Math.max(1, Math.round((4 + Math.floor(seededRandom() * 3)) * quality));
            for (let i = 0; i < coreCount; i++) {
                const spreadX = (i - coreCount / 2) * 26 * s + (seededRandom() - 0.5) * 12 * s;
                puffs.push({ offsetX: spreadX, offsetY: (seededRandom() - 0.5) * 6 * s, rad: (18 + seededRandom() * 12) * s, shade: 0.60 + seededRandom() * 0.15, softness: 0.25 + seededRandom() * 0.2, squash: 0.6, rotation: 0, depth: 0.4 + seededRandom() * 0.3 });
            }
        } else if (variety === 'cirrus') {
            const layerCount = 2 + Math.floor(seededRandom() * 2), layerGap = 11 * s, layerSpan = 95 * s, baseY = -((layerCount - 1) * layerGap) / 2;
            for (let L = 0; L < layerCount; L++) {
                const layerY = baseY + L * layerGap + (seededRandom() - 0.5) * 5 * s, layerOpacity = 0.65 + seededRandom() * 0.35;
                const puffsInLayer = Math.max(3, Math.round((13 + Math.floor(seededRandom() * 4)) * quality)), stepX = layerSpan / (puffsInLayer - 1);
                for (let i = 0; i < puffsInLayer; i++) {
                    const x = -layerSpan / 2 + i * stepX + (seededRandom() - 0.5) * stepX * 0.40;
                    const taper = 1 - Math.pow(Math.abs(x) / (layerSpan / 2 + 1), 1.6) * 0.45;
                    const rad = (15 + seededRandom() * 9) * s * taper;
                    puffs.push({ offsetX: x, offsetY: layerY + (seededRandom() - 0.5) * 4 * s, rad, shade: (0.50 + seededRandom() * 0.30) * layerOpacity, softness: 0.50 + seededRandom() * 0.25, squash: 0.50 + seededRandom() * 0.20, rotation: (seededRandom() - 0.5) * 0.20, depth: seededRandom() });
                }
            }
        }
        puffs.sort((a, b) => a.depth - b.depth);
        return puffs;
    }
    static _seededRandom(seed) {
        let s = seed;
        return () => {
            s = (s * 9301 + 49297) % 233280;
            return s / 233280;
        };
    }
}
// ── MIGRATION BLOCK ─────────────────────────
function _migrateConfig(raw) {
    const c = { ...raw };
    const rename = (oldKey, newKey) => {
        if (c[oldKey] !== undefined && c[newKey] === undefined) c[newKey] = c[oldKey];
        delete c[oldKey];
    };
    rename('offset',              'card_offset'); rename('square',              'card_square'); rename('stack_order',         'card_stack_order');
    rename('full_width',          'card_full_width'); rename('filter',              'card_filter');
    rename('css_mask_vertical',   'card_mask_vertical'); rename('css_mask_horizontal', 'card_mask_horizontal');
    rename('disable_text',        'card_hide_text'); rename('tap_action',          'card_tap_action');
    rename('background_style',    'card_background_style'); rename('day',                 'image_day'); rename('night',               'image_night');
    rename('theme',               'card_color_mode'); rename('sun_moon_size', 'celestial_size'); rename('moon_style',    'celestial_moon_style');
    if (c.celestial_alignment === undefined) {
        const oldX = c.sun_moon_x_position != null ? c.sun_moon_x_position : c.celestial_x, oldY = c.sun_moon_y_position != null ? c.sun_moon_y_position : c.celestial_y;
        if (oldX !== undefined || oldY !== undefined) {
            const xStr = String(oldX != null ? oldX : '').trim().toLowerCase(), yStr = String(oldY != null ? oldY : '').trim().toLowerCase(), xIsCenter = xStr === 'center';
            const yIsCenter = yStr === 'center', xVal = xIsCenter ? 0 : parseInt(xStr, 10) || 0, yVal = yIsCenter ? 0 : parseInt(yStr, 10) || 0;
            const hSide = xIsCenter ? 'center' : (xVal < 0 ? 'right' : 'left'), vSide = yIsCenter ? 'center' : 'top';
            if (hSide === 'center' && vSide === 'center') {
                c.celestial_alignment = 'center';
            } else if (vSide === 'center') {
                c.celestial_alignment = hSide;
            } else {
                c.celestial_alignment = `${vSide}-${hSide}`;
            }
            c.celestial_x = xIsCenter ? 0 : Math.max(0, Math.abs(xVal) - 31); c.celestial_y = yIsCenter ? 0 : Math.max(0, Math.abs(yVal) - 31);
        }
    }
    delete c.sun_moon_x_position; delete c.sun_moon_y_position; rename('image_offset_x',     'image_x');
    rename('image_offset_y',     'image_y'); rename('status_image_day',   'status_day'); rename('status_image_night', 'status_night');
    rename('disable_top_text',        'top_text_hide'); rename('top_text_sensor',         'top_text_entity');
    rename('top_position',            'top_text_position'); rename('top_font_size',           'top_text_size');
    rename('top_unit_format',         'top_text_unit'); rename('top_text_behind_weather', 'top_text_behind');
    const hasTopTextKeys = c.top_text_hide !== undefined || c.top_text_entity !== undefined
        || c.top_text_position !== undefined || c.top_text_size !== undefined
        || c.top_text_unit !== undefined || c.top_text_padding !== undefined
        || c.top_text_background !== undefined || c.top_text_behind !== undefined;
    if (hasTopTextKeys && c.top_text_hide !== true) {
        const topChip = {
            entity: c.top_text_entity || c.weather_entity || 'weather.home',
            position: 'custom',
            position_anchor: c.top_text_position || 'top-left',
            position_x: 'pad', position_y: 'pad',
            text_size: c.top_text_size || 'clamp(24px, 11cqw, 52px)',
            padding: c.top_text_padding || '0px 4px',
            background: false, hide_icon: true, hide_label: true,
        };
        if (!c.top_text_entity) { topChip.attribute = 'temperature'; topChip.fancy_unit = true; }
        if (c.top_text_unit !== undefined) topChip.unit_format = c.top_text_unit;
        if (c.top_text_background === true) topChip.background = true; if (c.top_text_behind === true) topChip.behind_effects = true;
        c.chips = [topChip, ...(Array.isArray(c.chips) ? c.chips : [])];
    }
    delete c.top_text_hide; delete c.top_text_entity; delete c.top_text_position;
    delete c.top_text_size; delete c.top_text_unit; delete c.top_text_padding;
    delete c.top_text_background; delete c.top_text_behind; rename('disable_chips',           'chip_area_hide');
    rename('chips_position',          'chip_area_position'); rename('chips_layout',            'chip_area_layout');
    rename('chips_columns',           'chip_area_columns'); rename('chips_visible',           'chip_area_scroll_count');
    rename('chips_width',             'chip_area_width'); rename('chips_height',            'chip_area_height');
    rename('chips_align',             'chip_area_align'); rename('chips_grouped',           'chip_area_grouped');
    rename('chips_separator',         'chip_area_separator'); rename('chips_full_width',        'chip_area_full_width');
    rename('chips_container_padding', 'chip_area_padding'); rename('chips_container_bg_color','chip_area_background_color');
    rename('chips_background',        'chip_area_background');
    if (c.chip_inner_gap !== undefined) {
        if (c.chip_area_gap === undefined && c.chip_gap !== undefined) c.chip_area_gap = c.chip_gap;
        c.chip_gap = c.chip_inner_gap; delete c.chip_inner_gap;
    } else if (c.chip_gap !== undefined && c.chip_area_gap === undefined) {
        const hasAnyOldKey = c.chips_position !== undefined || c.chips_layout !== undefined ||
            c.chips_background !== undefined || c.disable_chips !== undefined;
        if (hasAnyOldKey) {
            c.chip_area_gap = c.chip_gap; delete c.chip_gap;
        }
    }
    rename('chip_format',         'chip_style'); rename('chips_font_size',     'chip_text_size'); rename('chips_name_font_size','chip_label_size');
    rename('chips_padding',       'chip_padding'); rename('chip_icon_width',     'chip_icon_size');
    rename('chip_icon_bg',        'chip_icon_background'); rename('chips_bg_color',      'chip_background_color');
    rename('chips_icon_bg_color', 'chip_icon_background_color'); rename('chip_bg_color',            'chip_background_color');
    rename('chip_icon_bg_color',       'chip_icon_background_color'); rename('chip_area_bg_color',       'chip_area_background_color');
    if (c.chip_area_layout === 'scroll') c.chip_area_layout = 'horizontal-scroll';
    if (Array.isArray(c.chips)) {
        c.chips = c.chips.map(chip => {
            if (!chip || typeof chip !== 'object') return chip;
            const s = { ...chip };
            const r = (o, n) => {
                if (s[o] !== undefined && s[n] === undefined) s[n] = s[o]; delete s[o];
            };
            r('chip_format',       'style'); r('chip_align',        'align'); r('chip_background',   'background');
            r('chip_bg_color',     'background_color'); r('bg_color',          'background_color'); r('chip_icon_bg_color','icon_background_color');
            r('icon_bg_color',     'icon_background_color'); r('icon_bg',           'icon_background'); r('chip_padding',      'padding');
            r('disable_icon',      'hide_icon'); r('font_size',         'text_size'); r('name_font_size',    'label_size');
            r('behind',            'behind_effects');
            r('card_tap_action',   'tap_action');
            if (s.forecast_show_min && s.forecast && s.attribute === 'temperature') {
                if (!s.sub_value_attribute) s.sub_value_attribute = 'templow';
                if (s.forecast_low_position !== 'below') s.sub_value_position = 'beside';
            }
            delete s.forecast_show_min; delete s.forecast_low_position;
            return s;
        });
    }
    return c;
}
// ── END MIGRATION BLOCK ─────────────────────────────────────────────────
// MAIN CARD CLASS
class AtmosphericWeatherCard extends HTMLElement {
    // CONSTRUCTOR & LIFECYCLE
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._animID = null; this._lastFrameTime = 0; this._boundAnimate = this._animate.bind(this);
        for (const key of PARTICLE_ARRAYS) this[key] = []; this._aurora = null; this._params = WEATHER_MAP['default'];
        this._flashOpacity = 0; this._flashHold = 0; this._isTimeNight = false;
        this._isThemeDark = false; this._lastState = null; this._stateInitialized = false;
        this._hasReceivedFirstHass = false; this._renderState = null; this._celestialSize = null;
        this._moonPhaseState = 'full_moon'; this._moonPhaseConfig = MOON_PHASES['full_moon'];
        this._windGust = 0; this._gustPhase = 0; this._windSpeed = 0.1; this._windKmh = 0; this._microGustPhase = 0;
        this._layerFadeProgress = { stars: 1, clouds: 1, precipitation: 1, effects: 1 };
        this._sunPulsePhase = 0; this._initialized = false; this._initializationComplete = false;
        this._isVisible = false; this._intersectionObserver = null;
        this._renderGate = { hasValidDimensions: false, hasFirstHass: false, isRevealed: false };
        this._resizeDebounceTimer = null; this._pendingResize = false; this._needsReinit = false;
        this._cachedDimensions = { width: 0, height: 0, dpr: 1 };
        this._perfCloudRes = CLOUD_ATLAS_SIZE_DEFAULT;
        this._perfFps = 30; this._perfCloudQuality = 1.5; this._perfEffects = 1; this._perfFauna = 2; this._perfDpr = PERFORMANCE_CONFIG.MAX_DPR;
        this._lastInitWidth = 0; this._lastLocStr = null; this._lastSnapshot = null; this._prevStyleSig = this._prevPosSig = this._prevCcSig = null;
        this._lastRowSigs = null;
        this._entityErrors = new Map(); this._lastErrorLog = 0;
        this._customCardElements = []; this._hass = null; this._prevCustomCssClasses = null;
        this._boundVisibilityChange = this._handleVisibilityChange.bind(this); this._boundTap = this._handleTap.bind(this);
        this._fcData = new Map(_fcCache); this._fcSubs = new Map(); this._fcFmtCache = null;
    }
    get _isLightBackground() { return !this._isThemeDark; }
    get _isNight()           { return this._isTimeNight; }
    get _isImmersive()       { return this._config.card_style !== 'standalone'; }
    get _isDarkDayImmersive(){ return this._isImmersive && this._isThemeDark && !this._isTimeNight; }
    // HOME ASSISTANT LIFECYCLE
    connectedCallback() {
        if (!this._resizeObserver) {
            this._resizeObserver = new ResizeObserver((entries) => {
                if (!entries.length) return;
                // Use borderBoxSize to capture the full visual dimension including
                // padding. contentRect strips padding, which breaks full-width mode
                // where negative margins + positive padding create edge-to-edge bleed.
                // borderBoxSize is layout-free (no forced reflow). Fallback to
                // offsetWidth/Height for older Safari WebViews that lack borderBoxSize.
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
                    this._scheduleParticleReinit();
                }
            });
        }
        if (!this._intersectionObserver) {
            this._intersectionObserver = new IntersectionObserver(
                this._boundVisibilityChange,
                {
                    threshold: PERFORMANCE_CONFIG.VISIBILITY_THRESHOLD,
                    rootMargin: '200px'
                }
            );
        }
        if (this._elements && this._elements.root) {
            this._resizeObserver.observe(this._elements.root); this.addEventListener('click', this._boundTap);
            this._intersectionObserver.observe(this._elements.root);
        }
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
        this._isVisible = false; this.removeEventListener('click', this._boundTap); this._clearAllParticles();
        this._customCardElements = []; this._initializationComplete = false;
    }
    setConfig(config) {
        config = _migrateConfig(config); this._config = config; this._chips = this._deriveChips(this._config);
        this._initDOM();
        if (config.card_stack_order !== undefined) {
            this.style.setProperty('--awc-stack-order', config.card_stack_order);
        } else {
            this.style.removeProperty('--awc-stack-order');
        }
        if (config.card_square) {
            this.style.height = 'auto'; this.style.minHeight = '0'; this.style.aspectRatio = '1 / 1';
        } else if (String(config.card_height).toLowerCase() === 'auto') {
            this.style.height = '100%'; this.style.minHeight = '0'; this.style.aspectRatio = 'auto';
        } else {
            const heightConfig = config.card_height;
            const rawHeight = (heightConfig == null || String(heightConfig).trim() === '') ? '200px' : String(heightConfig).trim();
            const cssHeight = /^-?\d+(?:\.\d+)?$/.test(rawHeight)
                ? `${rawHeight}px`
                : rawHeight;
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
                const tx2 = ox ? `translateX(${/[%a-z]/i.test(ox) ? ox : ox + 'px'})` : '';
                let oyEffective = oy;
                if (oy && v === 'bottom') {
                    oyEffective = oy.startsWith('-') ? oy.slice(1) : `-${oy}`;
                }
                const ty2 = oyEffective ? `translateY(${/[%a-z]/i.test(oyEffective) ? oyEffective : oyEffective + 'px'})` : '';
                const extra = [tx2, ty2].filter(Boolean).join(' ');
                slot.style.transform = t.length ? `${t.join(' ')} ${extra}` : extra;
            }
        }
        const root = this._elements.root;
        root.classList.toggle('no-mask-v', config.card_mask_vertical === false);
        root.classList.toggle('no-mask-h', config.card_mask_horizontal === false);
        const hasTapAction = config.card_tap_action && config.card_tap_action.action && config.card_tap_action.action !== 'none';
        root.classList.toggle('clickable', !!hasTapAction);
        const filterVal = FILTER_PRESETS[(config.card_filter || '').toLowerCase()] || '';
        root.style.setProperty('--_canvas-filter', filterVal || 'none');
        this._hasStatusFeature = !!(config.status_entity && (config.status_day || config.status_night));
        const csz = config.celestial_size != null ? parseInt(config.celestial_size, 10) : null;
        this._celestialSize = (csz && csz > 0) ? csz : null; this._customCardElements = []; this._prevCcSig = null;
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
        this._lastSnapshot = this._prevRowOverflow = this._prevRowWidth =
            this._prevRowHeight = this._prevFullWidth = this._prevChipPad = this._prevContainerPad =
            this._prevChipsGap = this._prevChipGap = this._prevRowCols = this._prevChipAlign =
            this._prevConfigSig = this._prevGrouped = this._prevVisKey =
            this._lastFreeSig = this._prevCardPadding = this._prevCardPadParsed =
            this._prevBottomFS = this._prevChipNameFS =
            this._prevChipIconWidth = this._prevChipIconPad = this._prevImageOffset =
            this._prevContainerBgColor = this._prevChipTextGap = null;
        this._nativeIconCache = null; this._prevHadVertVis = false; this._syncFc();
        const preset = PERF_PRESETS[config.perf_mode] || PERF_PRESETS.default;
        const rawFps = config.perf_fps != null ? config.perf_fps : preset.perf_fps;
        const parsedFps = parseInt(rawFps, 10);
        this._perfFps = Number.isFinite(parsedFps) ? Math.max(15, Math.min(120, parsedFps)) : 30;
        const rawCloudQuality = config.perf_cloud_quality != null ? config.perf_cloud_quality : preset.perf_cloud_quality;
        const parsedCloudQuality = parseFloat(rawCloudQuality);
        this._perfCloudQuality = Number.isFinite(parsedCloudQuality) ? Math.max(0.5, Math.min(2.0, parsedCloudQuality)) : preset.perf_cloud_quality;
        this._perfCloudRes = this._perfCloudQuality <= 1.0 ? 1024 : CLOUD_ATLAS_SIZE_DEFAULT;
        const rawEffects = config.perf_effects != null ? config.perf_effects : preset.perf_effects;
        this._perfEffects = (rawEffects === true) ? 2 : (rawEffects === false) ? 0 : (parseInt(rawEffects, 10) || 0);
        const rawFauna = config.perf_fauna != null ? config.perf_fauna : preset.perf_fauna;
        this._perfFauna = (rawFauna === true) ? 2 : (rawFauna === false) ? 0 : (parseInt(rawFauna, 10) || 0);
        const rawDpr = config.perf_dpr != null ? config.perf_dpr : preset.perf_dpr;
        const parsedDpr = parseFloat(rawDpr);
        this._perfDpr = Number.isFinite(parsedDpr) ? Math.max(0.5, Math.min(PERFORMANCE_CONFIG.MAX_DPR, parsedDpr)) : preset.perf_dpr;
        this._applyConfigStyles();
    }
    set hass(hass) {
        if (!hass || !this._config) return; this._hass = hass;
        if (this._customCardElements.length > 0) { for (const child of this._customCardElements) child.hass = hass; }
        const cfg = this._config;
        const wObj = (cfg.weather_entity && hass.states[cfg.weather_entity]) || null;
        const sunObj = cfg.sun_entity ? hass.states[cfg.sun_entity] : null;
        const moonObj = cfg.moon_phase_entity ? hass.states[cfg.moon_phase_entity] : null;
        const themeObj = cfg.theme_entity ? hass.states[cfg.theme_entity] : null;
        const statusObj = cfg.status_entity ? hass.states[cfg.status_entity] : null;
        if (this._lastSnapshot) {
            let changed = wObj !== this._refW || sunObj !== this._refSun || moonObj !== this._refMoon
                || themeObj !== this._refTheme || statusObj !== this._refStatus
                || (hass.themes && hass.themes.darkMode) !== this._refSysDark;
            if (!changed) {
                for (const s of this._chips) {
                    if (s.entity && hass.states[s.entity] !== (this._refChipEnts ? this._refChipEnts.get(s.entity) : undefined)) { changed = true; break; }
                    if (s.name_sensor && hass.states[s.name_sensor] !== (this._refChipEnts ? this._refChipEnts.get(s.name_sensor) : undefined)) { changed = true; break; }
                    if (s.sub_value_entity && hass.states[s.sub_value_entity] !== (this._refChipEnts ? this._refChipEnts.get(s.sub_value_entity) : undefined)) { changed = true; break; }
                }
            }
            if (!changed) return;
        }
        this._refW = wObj; this._refSun = sunObj; this._refMoon = moonObj; this._refTheme = themeObj; this._refStatus = statusObj;
        this._refSysDark = (hass.themes && hass.themes.darkMode); const refs = new Map();
        for (const s of this._chips) {
            if (s.entity) refs.set(s.entity, hass.states[s.entity]);
            if (s.name_sensor) refs.set(s.name_sensor, hass.states[s.name_sensor]);
            if (s.sub_value_entity) refs.set(s.sub_value_entity, hass.states[s.sub_value_entity]);
        }
        this._refChipEnts = refs;
        if (this._moonRotationRad === undefined && (hass.config && hass.config.latitude) !== undefined) { this._moonRotationRad = (51 - hass.config.latitude) * (Math.PI / 180); }
        const wEntity = wObj || FALLBACK_WEATHER;
        const sunEntity = this._config.sun_entity ? hass.states[this._config.sun_entity] : null;
        const moonEntity = this._config.moon_phase_entity ? hass.states[this._config.moon_phase_entity] : null;
        const themeEntity = this._config.theme_entity ? hass.states[this._config.theme_entity] : null;
        const statusEntity = this._config.status_entity ? hass.states[this._config.status_entity] : null;
        const botSig = this._chips.map(s => {
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
            return sig;
        }).join('||');
        const sysDark = (hass.themes && hass.themes.darkMode), lang = (hass.locale && hass.locale.language) || 'en';
        const snapshot = {
            weather: (wEntity && wEntity.state) || '',
            temp: (wEntity && wEntity.attributes && wEntity.attributes.temperature != null) ? wEntity.attributes.temperature : '',
            windSpeed: (wEntity && wEntity.attributes && wEntity.attributes.wind_speed != null) ? wEntity.attributes.wind_speed : '',
            windUnit: (wEntity && wEntity.attributes && wEntity.attributes.wind_speed_unit) || '',
            sun: (sunEntity && sunEntity.state) || '',
            sunElev: (sunEntity && sunEntity.attributes && sunEntity.attributes.elevation != null) ? sunEntity.attributes.elevation : '',
            moon: (moonEntity && moonEntity.state) || '',
            theme: (themeEntity && themeEntity.state) || '',
            status: (statusEntity && statusEntity.state) || '',
            botSig,
            sysDark: !!sysDark,
            lang
        };
        if (this._lastSnapshot && !this._hasSnapshotChanged(this._lastSnapshot, snapshot)) return;
        this._lastSnapshot = snapshot;
        if (this._elements && this._elements.root) this._elements.root.classList.toggle('full-width', this._config.card_full_width === true);
        if (!wEntity) return;
        if (moonEntity && moonEntity.state !== this._moonPhaseState) {
            this._moonPhaseState = moonEntity.state;
            this._moonPhaseConfig = MOON_PHASES[moonEntity.state] || MOON_PHASES['full_moon'];
        }
        const axes = this._resolveAxes(sunEntity, themeEntity, sysDark), isTimeNight = axes.isTimeNight, isThemeDark = axes.isThemeDark;
        const hasNightChanged = this._isTimeNight !== isTimeNight || this._isThemeDark !== isThemeDark;
        this._isTimeNight = isTimeNight; this._isThemeDark = isThemeDark; let weatherState = (wEntity.state || 'default').toLowerCase();
        if (isTimeNight && weatherState === 'sunny') weatherState = 'clear-night';
        if (!isTimeNight && weatherState === 'clear-night') weatherState = 'sunny';
        let newParams = { ...(WEATHER_MAP[weatherState] || WEATHER_MAP['default']) };
        if (isTimeNight && (weatherState === 'sunny' || weatherState === 'clear-night')) {
            newParams.type = 'stars'; newParams.count = 280;
        }
        this._updateStandaloneStyles(isTimeNight, newParams); this._updateTextElements(hass, wEntity, lang, weatherState);
        const windSpeedRaw = this._getEntityAttribute(wEntity, 'wind_speed', 0);
        const windSpeed = typeof windSpeedRaw === 'number' ? windSpeedRaw : parseFloat(windSpeedRaw) || 0;
        this._windSpeed = Math.min(Math.max(windSpeed / 10, 0), 2);
        const wsu = ((wEntity && wEntity.attributes && wEntity.attributes.wind_speed_unit) || 'km/h').toLowerCase();
        const toKmh = wsu.includes('m/s') ? 3.6 : wsu.includes('mph') ? 1.609 : wsu.includes('kn') ? 1.852 : 1;
        this._windKmh = windSpeed * toKmh; const imageNight = axes.isImageNight; this._updateImage(hass, imageNight, weatherState);
        // Golden hour: warm glow + ambient wash (after base styles are set)
        this._applyGoldenHour(sunEntity || hass.states['sun.sun'], newParams);
        if (!this._hasReceivedFirstHass) {
            this._hasReceivedFirstHass = true; this._renderGate.hasFirstHass = true; this._lastState = weatherState;
            this._params = newParams; this._stateInitialized = true; this._buildRenderState();
            this._syncFc(); this._tryInitialize();
            return;
        }
        this._handleWeatherChange(weatherState, newParams, hasNightChanged);
    }
    static async getConfigElement() {
        if (!customElements.get("atmo-weather-card-editor")) 
        { await import("./atmo-weather-card-editor.js"); }
        return document.createElement("atmo-weather-card-editor");
    }
    static getStubConfig(hass) {
        const weatherEntity = hass ? Object.keys(hass.states).find(e => e.startsWith('weather.')) || '' : '';
        return {
            weather_entity: weatherEntity, sun_entity: 'sun.sun', theme_entity: 'sun.sun',
            card_style: 'standalone', card_height: 130, card_padding: '16px',
            celestial_size: '50px', celestial_position: 'fixed', celestial_alignment: 'right',
            celestial_x: 45, celestial_y: 'center',
            chip_area_position: 'bottom-left', chip_text_size: '12px', chip_padding: '6px 10px',
            chip_gap: '8px', chip_area_background: true,
            chips: [
                { entity: weatherEntity, attribute: 'temperature', position: 'custom', position_anchor: 'top-left', position_x: '16px', position_y: '16px', text_size: '34px', background: false, padding: '0px 4px', hide_icon: true, hide_label: true, fancy_unit: true, value_weight: '600', behind_effects: true },
                { entity: weatherEntity, attribute: 'humidity', name: 'HMD' },
                { entity: weatherEntity, attribute: 'wind_speed', name: 'Wind' }
            ],
            grid_options: { rows: 'auto' }
        };
    }
    getCardSize() { return 4; }
    getGridOptions() {
        return {
            columns: 12, rows: 'auto',
            min_columns: 2, min_rows: 2,
        };
    }
    // CONFIGURATION HELPERS
    _deriveChips(config) {
        const arr = config && config.chips;
        if (Array.isArray(arr) && arr.length > 0) {
            return arr.map(s => (s && typeof s === 'object') ? s : {});
        }
        return [{}];
    }
    _resolveChipPosition() {
        return (this._config && this._config.chip_area_position) || 'bottom-left';
    }
    _resolveAxes(sunEntity, themeEntity, sysDark) {
        const mode = this._config.card_color_mode ? this._config.card_color_mode.toLowerCase() : null;
            const themeValid = themeEntity &&
            themeEntity.state !== 'unavailable' &&
            themeEntity.state !== 'unknown';
        const themeIsNight = themeValid &&
            NIGHT_MODES.includes(themeEntity.state.toLowerCase());
        const sunState = sunEntity ? sunEntity.state.toLowerCase() : null, sunIsBelowHorizon = sunState === 'below_horizon';
        const sunIsNight = sunIsBelowHorizon || (sunState !== null && NIGHT_MODES.includes(sunState));
            const isTimeNight = mode === 'night' ? true
            : mode === 'day' ? false
            : sunEntity ? sunIsBelowHorizon
            : themeValid ? themeIsNight : false;
            // sysDark (hass.themes.darkMode) outranks sun so the card respects
        // the HA system/profile dark-mode setting. Sun is the fallback
        // for setups where hass.themes is unavailable.
        const isThemeDark = mode === 'dark' ? true
            : mode === 'light' ? false
            : themeValid ? themeIsNight
            : sysDark !== undefined ? !!sysDark
            : sunEntity ? sunIsNight : false;
            const isImageNight = (mode === 'dark' || mode === 'night') ? true
            : (mode === 'light' || mode === 'day') ? false
            : themeValid ? themeIsNight
            : sysDark !== undefined ? !!sysDark
            : sunEntity ? sunIsNight : false;
        return { isTimeNight, isThemeDark, isImageNight };
    }
    // ENTITY & STATE HELPERS
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
                console.warn(`HOME-CARD: Entity "${entityId}" is ${errorType}`);
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
            const isNumeric = value !== null && value !== '' && !isNaN(parseFloat(value)) && isFinite(value);
            if (isNumeric && this._numFmt) formatted = this._numFmt.format(value);
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
    // FORECAST DATA LAYER
    _syncFc() {
        if (!(this._hass && this._hass.connection)) return; const needed = new Set();
        for (const c of this._chips) if (c.forecast && c.entity) needed.add(`${c.entity}|${c.forecast === 'hourly' ? 'hourly' : 'daily'}`);
        for (const [k, unsub] of this._fcSubs) if (!needed.has(k)) { unsub(); this._fcSubs.delete(k); this._fcData.delete(k); _fcCache.delete(k); }
        for (const k of needed) if (!this._fcSubs.has(k)) this._startFcSub(k);
    }
    _startFcSub(key) {
        const [entity, type] = key.split('|'), hass = this._hass; if (!(hass && hass.connection)) return;
        hass.connection.subscribeMessage(
            (msg) => this._onFcData(key, msg.forecast != null ? msg.forecast : [], type === 'daily'),
            { type: 'weather/subscribe_forecast', forecast_type: type, entity_id: entity }
        ).then(unsub => {
            if (!this.isConnected || (!this._fcSubs.has(key) && !this._chips.some(c => c.forecast && c.entity === entity))) { unsub(); return; }
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
        this._fcData.set(key, entry); _fcCache.set(key, entry); this._lastSnapshot = null;
    }
    _resolveFcValue(hass, chip, lang) {
        const type = chip.forecast === 'hourly' ? 'hourly' : 'daily', offset = Math.max(0, parseInt(chip.forecast_offset, 10) || 0);
        const _fcEntry = this._fcData.get(`${chip.entity}|${type}`);
        const fc = _fcEntry && _fcEntry.processed;
        if (!fc || !fc.length) return { formatted: '', unit: '', condition: null, datetime: null, loading: true };
        const entry = fc[Math.min(offset, fc.length - 1)];
        if (!entry) return { formatted: '', unit: '', condition: null, datetime: null, loading: true };
        const attr = chip.attribute;
        if (!attr || attr === 'condition') {
            let label = entry.condition || '—';
            if (entry.condition && typeof hass.localize === 'function') label = hass.localize(`component.weather.entity_component._.state.${entry.condition}`) || label;
            return { formatted: label, unit: '', condition: entry.condition, datetime: entry.datetime, entry };
        }
        const raw = entry[attr];
        if (raw == null) return { formatted: 'N/A', unit: '', condition: entry.condition, datetime: entry.datetime, entry };
        const _chipState = hass.states[chip.entity];
        const w = _chipState && _chipState.attributes;
        const unit = (w && w[`${attr}_unit`]) || (_FC_UNIT_MAP[attr] && w && w[_FC_UNIT_MAP[attr]]) || _FC_UNIT_FALLBACK[attr] || '';
        let formatted = raw;
        if (raw !== '' && !isNaN(parseFloat(raw)) && isFinite(raw)) {
            const precision = chip.forecast_precision;
            const fmt = (precision !== undefined && precision !== null)
                ? this._getFcFmt(lang, precision)
                : this._numFmt;
            if (fmt) formatted = fmt.format(raw);
        }
        return { formatted, unit, condition: entry.condition, datetime: entry.datetime, entry };
    }
    _getFcFmt(lang, precision) {
        const key = `${lang}|${precision}`;
        if ((this._fcFmtCache && this._fcFmtCache[0]) === key) return this._fcFmtCache[1];
        const fmt = new Intl.NumberFormat(lang, { maximumFractionDigits: precision, minimumFractionDigits: 0 });
        this._fcFmtCache = [key, fmt];
        return fmt;
    }
    _cssVar(el, prop, val, key) {
        if (this[key] === val) return; this[key] = val; if (val) el.style.setProperty(prop, val);
        else el.style.removeProperty(prop);
    }
    _hasSnapshotChanged(prev, next) {
        return prev.weather    !== next.weather
            || prev.temp       !== next.temp
            || prev.windSpeed  !== next.windSpeed
            || prev.windUnit   !== next.windUnit
            || prev.sun        !== next.sun
            || prev.sunElev    !== next.sunElev
            || prev.moon       !== next.moon
            || prev.theme      !== next.theme
            || prev.status     !== next.status
            || prev.botSig     !== next.botSig
            || prev.sysDark    !== next.sysDark
            || prev.lang       !== next.lang;
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
    // STATE COMPUTATION
    _buildRenderState() {
        const p = this._params, isDark  = this._isThemeDark, isNight = this._isTimeNight;
        const isLight = !isDark; // === this._isLightBackground
        const type    = (p && p.type) || 'none', atm     = (p && p.atmosphere) || '', state   = (this._lastState || '').toLowerCase();
        const isBadWeatherForComets =
            type === 'rain' || type === 'hail' || type === 'lightning' ||
            type === 'pouring' || type === 'snowy' || type === 'snowy-rainy';
        const isSevereWeather = !!((p && p.thunder)) || type === 'hail' || type === 'pouring';
        const goodWeather = state === 'sunny' || state === 'partlycloudy' ||
                            state === 'clear-night' || state === 'exceptional';
            const isStandalone = this._config.card_style === 'standalone';
        const isDarkDayImmersive = this._isDarkDayImmersive;
        const glow = this._computeGlowParams(
            state, type, atm, p, goodWeather,
            isDark, isNight, isStandalone, isDarkDayImmersive
        );
        const rainRgb = isLight ? '58, 72, 100' : '210, 225, 255';
            let starMode = 'hidden';
        if (isNight) {
            if (isDark) {
                starMode = 'glow';
            } else if (!isStandalone) {
                starMode = 'golden';
            }
        }
            const cp = this._computeCloudPalette(isDark, isNight, isLight, p, type, atm, isStandalone);
        const cloudGlobalOp = isDark ? 0.70 : 0.84;
            let celestialCloudPalette;
        if (isNight) celestialCloudPalette = isDark ? 'moon' : 'moonLight';
        else if (isDark) celestialCloudPalette = isStandalone ? 'darkDay' : 'moon';
        else celestialCloudPalette = (p && p.sunCloudWarm) ? 'warm' : 'cool';
        this._sunDiscGrad = this._sunDiscGradR = null; this._haloGrad = this._haloGradR = this._haloGradColor = null;
        this._diffuseGlowCache = null; this._breathGlowCache = null; this._moonCache = this._rainGrad = null;
        this._renderState = { isBadWeatherForComets, isSevereWeather, glow, rainRgb, cloudGlobalOp, starMode, celestialCloudPalette, cp };
        this._buildTextures();
    }
    _computeGlowParams(state, type, atm, p, goodWeather, isDark, isNight, isStandalone, isDarkDayImmersive) {
        if (isNight) return null;  // moon system handles night
        const isBad = !!((p && p.dark)) || BAD_WEATHER_TYPES.has(type);
        const isOvercastType = state === 'cloudy' || state === 'windy' ||
                               state === 'windy-variant' || state === 'fog';
        let active, showDisc, showHalo, drawPhase;
        if (goodWeather) {
            active = true; showDisc = true; showHalo = true; drawPhase = 'bg';
        } else if (isStandalone) {
            active = !isDark && isOvercastType && !isBad; showDisc = false; showHalo = false; drawPhase = 'mid-post';
        } else {
            active = true; showDisc = false; showHalo = false; drawPhase = isDark ? 'mid-pre' : 'mid-post';
        }
        if (!active) return null; const prof = p.glow || WEATHER_MAP['default'].glow; let color = [prof[0], prof[1], prof[2]];
        let intensity = prof[3]; const breathAmp = prof[4]; const breathPeriodMul = prof[5];
        let sizeMul = prof[6], glowBoost = 1.0;
            if (isDarkDayImmersive) {
                    color = [225, 200, 150];
            intensity *= 0.7; sizeMul *= 1.7;
        } else if (isStandalone && isDark && !isNight && goodWeather) {
            color = [225, 200, 150];
                    intensity *= 0.70;
        } else if (!isStandalone && !isDark && goodWeather) {
                    color = [255, 195, 105];
            intensity *= 1.3; glowBoost = 1.30;
        } else if (!isStandalone && !showDisc) {
                    intensity *= 1.4;
        }
            const compOp = showDisc ? null : (isDark ? 'screen' : 'source-over');
            const cacheKey = showDisc ? null
            : `${color[0]}_${color[1]}_${color[2]}_${sizeMul.toFixed(2)}`;
        return { active: true, showDisc, showHalo, drawPhase, color, intensity, breathAmp, breathPeriodMul, sizeMul, compOp, cacheKey, glowBoost };
    }
    _computeCloudPalette(isDark, isNight, isLight, p, type, atm, isStandalone) {
            let mood;
        if (isDark && isNight) {
            mood = 'darkNight';
        } else if (isDark) {
                    mood = isStandalone ? 'darkDay' : 'darkNight';
        } else if ((p && p.dark) || BAD_WEATHER_TYPES.has(type) || (p && p.foggy)) {
            mood = ((p && p.thunder) || STORM_TYPES.has(type)) ? 'lightStorm' : 'lightRain';
        } else if (atm === 'fair' || atm === 'clear') {
            mood = 'lightFair';
        } else if (atm === 'overcast' || atm === 'cloudy') {
            mood = 'lightOvercast';
        } else {
            mood = 'lightDefault';
        }
            const pal = CLOUD_PALETTES[mood];
        const litR = pal[0], litG = pal[1], litB = pal[2], midR = pal[3], midG = pal[4], midB = pal[5];
        const shadowR = pal[6], shadowG = pal[7], shadowB = pal[8], ambient = pal[9], highlightOffsetBase = pal[10], hOffset = pal[11];
            const isBadType = LIGHT_BAD_BOOST_TYPES.has(type) || (p && p.foggy);
        const isRainyBoost = isLight && !isDark && isBadType;
        const isStormOverride = isRainyBoost && ((p && p.thunder) || STORM_TYPES.has(type));
            const rainyOpacityMul = (isRainyBoost && !isStormOverride && !this._isImmersive) ? 1.10 : 1.0;
        return {
            litR, litG, litB,
            midR, midG, midB,
            shadowR, shadowG, shadowB,
            ambient,
            highlightOffsetBase,
            hOffset,
            rainyOpacityMul
        };
    }
    _handleWeatherChange(weatherState, newParams, hasNightChanged) {
        const oldParams = this._params, typeChanged = !oldParams || oldParams.type !== newParams.type, stateChanged = this._lastState !== weatherState;
        this._lastState = weatherState;
        if (typeChanged || stateChanged || hasNightChanged) {
            this._params = newParams; this._buildRenderState();
            if (this.isConnected) {
                // Defer heavy _initParticles (includes _bakeAllClouds) when the
                // card is off-screen. The dirty flag is consumed by
                // _handleVisibilityChange when the card scrolls into view.
                if (this._isVisible) {
                    setTimeout(() => {
                        this._initParticles(); if (this._width > 0) this._lastInitWidth = this._width; this._startAnimation();
                    }, 0);
                } else {
                    this._needsReinit = true;
                }
            }
        } else {
            this._params = newParams;
        }
    }
    _applyGoldenHour(sunEntity, params) {
        if (!(this._elements && this._elements.root)) return; const root = this._elements.root; const atm = (params && params.atmosphere) || '';
            const inactive = this._isTimeNight || (atm !== 'clear' && atm !== 'fair' && atm !== 'exceptional');
        if (inactive) {
            this._cssVar(root, '--gh-wash', '0', '_prevGhWash'); this._cssVar(root, '--ambient-dim', '0', '_prevAmbDim');
            return;
        }
            let t = 0;
        if (sunEntity && sunEntity.attributes && sunEntity.attributes.elevation !== undefined) {
            const e = parseFloat(sunEntity.attributes.elevation);
            if (e <= 18 && e > 2) {
                const s = 1 - ((e - 2) / 16); t = s * s * s;
            }
            else if (e <= 2 && e >= -6) {
                t = (e + 6) / 8;
            }
        }
        if (t < 0.01) {
            root.style.setProperty('--gh-wash', '0'); root.style.setProperty('--ambient-dim', '0');
            return;
        }
        const i = Math.min(1, t);
        const ghRgb = `255, ${Math.round(250 - 60 * i)}, ${Math.round(240 - 160 * i)}`;
        this._cssVar(root, '--g-rgb', ghRgb, '_prevGRgb'); const baseOp = parseFloat(this._prevGOp || '0.45') || 0.45;
        this._cssVar(root, '--g-op', Math.min(0.95, baseOp + 0.25 * i).toFixed(3), '_prevGOp');
        const cw = this._cachedDimensions.width  / (this._cachedDimensions.dpr || 1);
        const ch = this._cachedDimensions.height / (this._cachedDimensions.dpr || 1);
        if (cw > 0 && ch > 0) {
            const cel = this._getCelestialPosition(cw, ch), dx = Math.max(cel.x, cw - cel.x), dy = Math.max(cel.y, ch - cel.y);
            const baseR = Math.ceil(Math.sqrt(dx * dx + dy * dy) * 0.3);
            this._cssVar(root, '--c-r', `${Math.round(baseR * (1 + 0.8 * i))}px`, '_prevCr');
        }
        this._cssVar(root, '--gh-wash', (0.34 * i).toFixed(3), '_prevGhWash');
        this._cssVar(root, '--ambient-dim', (0.14 * i).toFixed(3), '_prevAmbDim');
    }
    _getCelestialPosition(w, h) {
        const mode = this._config.celestial_position;
        if (mode === 'dynamic_sun' || mode === 'dynamic_both') {
            const dyn = this._computeDynamicCelestial(mode);
            if (dyn) {
                const bodyR = this._celestialSize ? this._celestialSize / 2 : 31;
                return { x: bodyR + (w - 2 * bodyR) * dyn.t, y: bodyR + (h * 0.85 - bodyR) * (1 - dyn.y01) };
            }
        }
        const align = (this._config.celestial_alignment || 'top-left').toLowerCase();
        const [vSide, hSide] = parseAnchor(align); const ox = parseInt(this._config.celestial_x, 10) || 0;
        const oy = parseInt(this._config.celestial_y, 10) || 0, bodyR = this._celestialSize ? this._celestialSize / 2 : 31;
        let x, y; if (hSide === 'center') x = w / 2 + ox;
        else if (hSide === 'right') x = w - ox - bodyR;
        else x = ox + bodyR;
        if (vSide === 'center') y = h / 2 + oy;
        else if (vSide === 'bottom') y = h - oy - bodyR;
        else y = oy + bodyR;
        return { x, y };
    }
    _computeDynamicCelestial(mode) {
        const isNight = this._isTimeNight; if (mode === 'dynamic_sun' && isNight) return null;
        const _hassStates = this._hass && this._hass.states;
        const sunEntity = _hassStates && _hassStates[this._config.sun_entity || 'sun.sun'];
        const attrs = sunEntity && sunEntity.attributes; if (!attrs) return null; const nextRise = Date.parse(attrs.next_rising);
        const nextSet  = Date.parse(attrs.next_setting); if (!isFinite(nextRise) || !isFinite(nextSet)) return null; const now = Date.now();
        const dayMs = 86400000; let t;
        if (isNight) {
            const thisSet = nextSet - dayMs; t = (now - thisSet) / (nextRise - thisSet);
        } else {
            const thisRise = nextRise - dayMs; t = (now - thisRise) / (nextSet - thisRise);
        }
        if (!isFinite(t)) return null; if (t < 0) t = 0; else if (t > 1) t = 1; let y01;
        if (isNight) {
            y01 = Math.sin(Math.PI * t);
        } else {
            const elev = parseFloat(attrs.elevation);
            y01 = isFinite(elev) ? Math.max(0, Math.min(1, elev / 60)) : Math.sin(Math.PI * t);
        }
        return { t, y01 };
    }
    // DOM & STYLES
    static _buildStyles() {
        return `
            :host { display: block; width: 100%; position: relative; background: transparent !important; min-height: 200px; }
            #card-root { position: relative; width: 100%; height: 100%; container-type: size; z-index: var(--awc-stack-order, 1); overflow: hidden; background: transparent; display: block; transform: translateZ(0); will-change: transform, opacity; opacity: 0; }
            #card-root.clickable { cursor: pointer; }
            #card-root.clickable:active { transform: scale(0.98); transition: scale 0.3s ease-in-out; }
            #card-root.standalone { border-radius: var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)); }
            #card-root.revealed { opacity: 1; }
            #card-root.full-width { margin: 0px calc(var(--ha-view-sections-narrow-column-gap, var(--ha-card-margin, 8px)) * -1) !important; padding: 0px var(--ha-view-sections-narrow-column-gap, var(--ha-card-margin, 8px)) !important; }
            #card-root.no-mask-v canvas { --mask-v: linear-gradient(#000, #000); }
            #card-root.no-mask-h canvas { --mask-h: linear-gradient(#000, #000); }
            #card-root.standalone canvas,
            #card-root.no-mask canvas { -webkit-mask-image: none !important; mask-image: none !important; }
            #card-root.standalone { box-shadow: var(--ha-card-box-shadow, 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)); background-color: transparent; overflow: hidden; background-size: 100% 100%; border-width: var(--awc-card-border-width, var(--ha-card-border-width, 0px)); border-style: solid; border-color: var(--ha-card-border-color, var(--divider-color, #e0e0e0)); box-sizing: border-box; }
            #card-root.standalone.scheme-day { --bg-hl: 255,248,228; --bg-a1: 0.38; --bg-a2: 0.05; --bg-s2: 18%; --bg-s3: 42%; --bg-c1: #164FA6; --bg-c2: #4480C8; --bg-c3: #8CB9DD; --bg-hz: 255,222,172; --bg-hz-a: 0.10; background-image:
                            radial-gradient(ellipse 160% 42% at 50% -18%, rgba(var(--bg-hl), var(--bg-a1)) 0%, rgba(var(--bg-hl), 0) 80%),
                            linear-gradient(0deg, rgba(var(--bg-hz, 255,200,150), var(--bg-hz-a, 0)) 0%, transparent 30%),
                            radial-gradient(circle farthest-corner at var(--c-x, 65%) var(--c-y, 35%), var(--bg-c3) 10%, var(--bg-c2) 75%, var(--bg-c1) 100%); }
            #card-root.standalone.scheme-day.weather-exceptional { --bg-hl:255,244,210; --bg-a1:0.48; --bg-a2:0.08; --bg-c1:#0D4194; --bg-c2:#3470BD; --bg-c3:#7CB0DC; --bg-hz:255,228,162; --bg-hz-a:0.16; }
            #card-root.standalone.scheme-day.weather-partly { --bg-hl:250,248,236; --bg-a1:0.36; --bg-a2:0.05; --bg-s2:20%; --bg-s3:45%; --bg-c1:#1955A7; --bg-c2:#4683C8; --bg-c3:#90B8DD; --bg-hz:255,226,182; --bg-hz-a:0.08; }
            #card-root.standalone.scheme-day.weather-overcast { --bg-hl:248,248,244; --bg-a1:0.35; --bg-a2:0.05; --bg-s2:22%; --bg-s3:48%; --bg-c1:#2560A0; --bg-c2:#5088BD; --bg-c3:#9FBEDB; --bg-hz:248,228,196; --bg-hz-a:0.07; }
            #card-root.standalone.scheme-day.weather-rainy { --bg-hl:225,240,245; --bg-a1:0.35; --bg-a2:0.05; --bg-s2:20%; --bg-s3:45%; --bg-c1:#426A93; --bg-c2:#658FBA; --bg-c3:#B3D6E1; --bg-hz:190,210,225; --bg-hz-a:0.10; }
            #card-root.standalone.scheme-day.weather-pouring { --bg-hl:210,225,235; --bg-a1:0.32; --bg-a2:0.05; --bg-s2:20%; --bg-s3:45%; --bg-c1:#325478; --bg-c2:#527A9E; --bg-c3:#92B8C6; --bg-hz:170,190,210; --bg-hz-a:0.08; }
            #card-root.standalone.scheme-day.weather-storm { --bg-hl:212,224,238; --bg-a1:0.30; --bg-a2:0.05; --bg-s2:22%; --bg-s3:48%; --bg-c1:#3D5A82; --bg-c2:#587DA6; --bg-c3:#95C7CC; --bg-hz:175,190,212; --bg-hz-a:0.07; }
            #card-root.standalone.scheme-day.weather-snow { --bg-hl:234,240,252; --bg-a1:0.36; --bg-a2:0.06; --bg-s2:20%; --bg-s3:45%; --bg-c1:#4887AB; --bg-c2:#77A4C1; --bg-c3:#ABC4D4; --bg-hz:226,234,250; --bg-hz-a:0.10; }
            #card-root.standalone.scheme-day.weather-fog { --bg-hl:235,240,245; --bg-a1:0.38; --bg-a2:0.05; --bg-s2:20%; --bg-s3:45%; --bg-c1:#3C5E78; --bg-c2:#5F84A0; --bg-c3:#A3BDCD; --bg-hz:205,215,225; --bg-hz-a:0.15; }
            #card-root.standalone.scheme-night { --bg-hl: 155,185,252; --bg-a1: 0.14; --bg-a2: 0.04; --bg-s2: 40%; --bg-s3: 70%; --bg-c1: #000000; --bg-c2: #050E1A; --bg-c3: #122438; background-image:
                            radial-gradient(ellipse 160% 42% at 50% -18%, rgba(var(--bg-hl), var(--bg-a1)) 0%, rgba(var(--bg-hl), 0) 80%),
                            linear-gradient(0deg, rgba(var(--bg-hz, 155,168,200), var(--bg-hz-a, 0)) 0%, transparent 30%),
                            radial-gradient(circle farthest-corner at var(--c-x, 35%) var(--c-y, 25%), var(--bg-c3) 0%, var(--bg-c2) 75%, var(--bg-c1) 100%); }
            #card-root.standalone.scheme-night.weather-exceptional { --bg-a1:0.17; --bg-a2:0.05; --bg-c1:#000000; --bg-c2:#050E1A; --bg-c3:#10223A; }
            #card-root.standalone.scheme-night.weather-partly { --bg-a1:0.12; --bg-a2:0.03; --bg-s2:45%; --bg-s3:75%; --bg-c1:#010204; --bg-c2:#091420; --bg-c3:#182A3E; }
            #card-root.standalone.scheme-night.weather-overcast { --bg-hl:135,155,188; --bg-a1:0.10; --bg-a2:0.02; --bg-s2:50%; --bg-s3:80%; --bg-c1:#020304; --bg-c2:#0C1016; --bg-c3:#1A2028; }
            #card-root.standalone.scheme-night.weather-rainy { --bg-hl:130,145,168; --bg-a1:0.11; --bg-a2:0.03; --bg-s2:45%; --bg-s3:75%; --bg-c1:#020406; --bg-c2:#0C141C; --bg-c3:#1A2630; }
            #card-root.standalone.scheme-night.weather-pouring { --bg-hl:112,132,162; --bg-a1:0.09; --bg-a2:0.02; --bg-s2:45%; --bg-s3:75%; --bg-c1:#010203; --bg-c2:#060C14; --bg-c3:#0E1822; }
            #card-root.standalone.scheme-night.weather-storm { --bg-hl:95,108,148; --bg-a1:0.07; --bg-a2:0.02; --bg-s2:45%; --bg-s3:75%; --bg-c1:#000000; --bg-c2:#030508; --bg-c3:#0A1018; }
            #card-root.standalone.scheme-night.weather-snow { --bg-hl:175,198,232; --bg-a1:0.14; --bg-a2:0.04; --bg-s2:45%; --bg-s3:75%; --bg-c1:#030508; --bg-c2:#0E1822; --bg-c3:#1E2C3A; }
            #card-root.standalone.scheme-night.weather-fog { --bg-hl:145,155,178; --bg-a1:0.14; --bg-a2:0.04; --bg-s2:50%; --bg-s3:85%; --bg-c1:#040506; --bg-c2:#101216; --bg-c3:#1E2228; }
            #card-root.standalone.scheme-night.time-day { --bg-hl: 148,184,242; --bg-a1: 0.22; --bg-a2: 0.06; --bg-s2: 20%; --bg-s3: 48%; --bg-c1: #0A1C42; --bg-c2: #1A3268; --bg-c3: #2E5090; --bg-hz: 130,160,215; --bg-hz-a: 0.05; background-image:
                                radial-gradient(ellipse 160% 42% at 50% -18%, rgba(var(--bg-hl), var(--bg-a1)) 0%, rgba(var(--bg-hl), 0) 80%),
                                linear-gradient(0deg, rgba(var(--bg-hz, 140,160,210), var(--bg-hz-a, 0)) 0%, transparent 30%),
                                radial-gradient(circle farthest-corner at var(--c-x, 65%) var(--c-y, 35%), var(--bg-c3) 0%, var(--bg-c2) 75%, var(--bg-c1) 100%); }
            #card-root.standalone.scheme-night.time-day.weather-exceptional { --bg-hl:141,175,230; --bg-a1:0.22; --bg-a2:0.06; --bg-s2:20%; --bg-s3:48%; --bg-c1:#091A3F; --bg-c2:#182F63; --bg-c3:#2B4C89; --bg-hz:124,152,205; --bg-hz-a:0.05; }
            #card-root.standalone.scheme-night.time-day.weather-partly { --bg-hl:150,184,240; --bg-a1:0.20; --bg-a2:0.06; --bg-s2:22%; --bg-s3:50%; --bg-c1:#0C2048; --bg-c2:#1C386A; --bg-c3:#305692; --bg-hz:128,158,214; --bg-hz-a:0.04; }
            #card-root.standalone.scheme-night.time-day.weather-overcast { --bg-hl:148,172,210; --bg-a1:0.18; --bg-a2:0.05; --bg-s2:22%; --bg-s3:50%; --bg-c1:#0B1D40; --bg-c2:#19325A; --bg-c3:#2B4B7C; --bg-hz-a:0; }
            #card-root.standalone.scheme-night.time-day.weather-rainy { --bg-hl:130,160,185; --bg-a1:0.17; --bg-a2:0.05; --bg-s2:24%; --bg-s3:55%; --bg-c1:#081C28; --bg-c2:#16344A; --bg-c3:#285270; --bg-hz-a:0; }
            #card-root.standalone.scheme-night.time-day.weather-pouring { --bg-hl:110,135,165; --bg-a1:0.15; --bg-a2:0.04; --bg-s2:24%; --bg-s3:55%; --bg-c1:#061822; --bg-c2:#122E40; --bg-c3:#224C66; --bg-hz-a:0; }
            #card-root.standalone.scheme-night.time-day.weather-storm { --bg-hl:130,138,185; --bg-a1:0.17; --bg-a2:0.05; --bg-s2:22%; --bg-s3:52%; --bg-c1:#0C1028; --bg-c2:#1A1E48; --bg-c3:#42506E; --bg-hz:105,112,160; --bg-hz-a:0.04; }
            #card-root.standalone.scheme-night.time-day.weather-snow { --bg-hl:165,195,235; --bg-a1:0.22; --bg-a2:0.06; --bg-s2:20%; --bg-s3:48%; --bg-c1:#0C1C38; --bg-c2:#1E3656; --bg-c3:#405C82; --bg-hz:140,160,208; --bg-hz-a:0.06; }
            #card-root.standalone.scheme-night.time-day.weather-fog { --bg-hl:140,142,170; --bg-a1:0.18; --bg-a2:0.05; --bg-s2:28%; --bg-s3:60%; --bg-c1:#14162A; --bg-c2:#262A44; --bg-c3:#42466A; --bg-hz-a:0; }
            #card-root::after { content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none; background-image:
                        radial-gradient(circle var(--c-r, 10cqmax) at var(--c-x, 60%) var(--c-y, 40%), rgba(var(--g-rgb, 245,245,240), 0.88) 0%, rgba(var(--g-rgb, 245,245,240), 0.45) 18%, rgba(var(--g-rgb, 245,245,240), 0.12) 48%, rgba(var(--g-rgb, 245,245,240), 0) 100%),
                        radial-gradient(ellipse 140% 80% at var(--c-x, 60%) 100%, rgba(255, 160, 60, var(--gh-wash, 0)) 0%, rgba(255, 130, 45, var(--gh-wash, 0)) 30%, transparent 72%),
                        linear-gradient(rgba(25, 16, 10, var(--ambient-dim, 0)), rgba(25, 16, 10, var(--ambient-dim, 0))); opacity: var(--g-op, 0); }
            #card-root:not(.standalone)::after { background-image:
                        radial-gradient(circle calc(var(--c-r, 10cqmax) * 0.5) at var(--c-x, 60%) var(--c-y, 40%), rgba(var(--g-rgb, 245,245,240), 0.88) 0%, rgba(var(--g-rgb, 245,245,240), 0.45) 18%, rgba(var(--g-rgb, 245,245,240), 0.12) 48%, rgba(var(--g-rgb, 245,245,240), 0) 100%),
                        radial-gradient(circle calc(var(--c-r, 10cqmax) * 0.5) at var(--c-x, 60%) var(--c-y, 40%), rgba(255, 160, 60, var(--gh-wash, 0)) 0%, rgba(255, 130, 45, var(--gh-wash, 0)) 50%, transparent 100%); }
            #card-root.scheme-day { --awc-text-color: var(--awc-text-day, #2c2c2e); --awc-text-shadow-active: var(--awc-text-shadow-day, 0 1px 2px rgba(255, 255, 255, 0.9), 0 0 8px rgba(255, 255, 255, 0.7), 0 0 14px rgba(255, 255, 255, 0.5)); --_chip-no-bg-shadow: var(--awc-chip-text-shadow, var(--awc-text-shadow-day, 0 1px 2px rgba(255, 255, 255, 0.85), 0 0 6px rgba(255, 255, 255, 0.5))); --_text-bg: rgba(255, 255, 255, 0.25); --_text-bg-border: rgba(255, 255, 255, 0.2); }
            #card-root.scheme-day .contrast { --_text-bg: rgba(255,255,255,0.52); --_contrast-shadow: inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.08); }
            #card-root.scheme-day .frosted { --_text-bg: rgba(255,255,255,0.18); --_text-bg-border: rgba(255,255,255,0.32); --_frosted-inset: inset 0 1px 2px rgba(0,0,0,0.12), inset 0 -1px 1px rgba(0,0,0,0.06); }
            #card-root.scheme-day .has-icon-bg.with-bg.frosted { --_stacked-icon-border: 1px solid rgba(255,255,255,0.22); }
            #card-root.scheme-day .has-icon-bg.with-bg.contrast { --_stacked-icon-shadow: 0 2px 6px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.12); }
            #card-root.scheme-night { --awc-text-color: var(--awc-text-night, #ffffff); --awc-text-shadow-active: var(--awc-text-shadow-night, 0 1px 3px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.7), 0 0 16px rgba(0, 0, 0, 0.5)); --_chip-no-bg-shadow: var(--awc-chip-text-shadow, var(--awc-text-shadow-night, 0 1px 3px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.6))); --_text-bg: rgba(0, 0, 0, 0.35); --_text-bg-border: rgba(255, 255, 255, 0.08); }
            #card-root.scheme-night .contrast { --_text-bg: rgba(0,0,0,0.58); --_contrast-shadow: inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.3); }
            #card-root.scheme-night .frosted { --_text-bg: rgba(0,0,0,0.26); --_text-bg-border: rgba(255,255,255,0.10); --_frosted-inset: inset 0 1px 2px rgba(0,0,0,0.25), inset 0 -1px 1px rgba(0,0,0,0.15); }
            #card-root.scheme-night .has-icon-bg.with-bg.frosted { --_stacked-icon-border: 1px solid rgba(255,255,255,0.08); }
            #card-root.scheme-night .has-icon-bg.with-bg.contrast { --_stacked-icon-shadow: 0 2px 6px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.18); }
            #card-root.is-offscreen .awc-marquee-host .awc-marquee-track { animation-play-state: paused; }
            canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; filter: var(--awc-canvas-filter, var(--_canvas-filter, none)); --mask-v: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); --mask-h: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: var(--mask-v), var(--mask-h); mask-image: var(--mask-v), var(--mask-h); -webkit-mask-composite: source-in; mask-composite: intersect; }
            #fg-canvas { -webkit-mask-image: none !important; mask-image: none !important; }
            #image-slot { position: absolute; top: 0; height: 100%; width: auto; user-select: none; pointer-events: none; box-sizing: border-box; }
            #image-slot > img { display: block; height: 100%; width: auto; max-width: 100%; object-fit: contain; border: none; outline: none; }
            #image-slot > img[src=""],
            #image-slot > img:not([src]) { display: none; visibility: hidden; }
            #text-wrapper { position: absolute; inset: 0; pointer-events: none; box-sizing: border-box; overflow: visible; }
            #text-wrapper > .pos-top-left { top: var(--_awc-pad-v, var(--awc-card-padding, 16px)); left: var(--_awc-pad-h, var(--awc-card-padding, 16px)); }
            #text-wrapper > .pos-top-center { top: var(--_awc-pad-v, var(--awc-card-padding, 16px)); left: 50%; transform: translateX(-50%); }
            #text-wrapper > .pos-top-right { top: var(--_awc-pad-v, var(--awc-card-padding, 16px)); right: var(--_awc-pad-h, var(--awc-card-padding, 16px)); }
            #text-wrapper > .pos-left { top: 50%; left: var(--_awc-pad-h, var(--awc-card-padding, 16px)); transform: translateY(-50%); }
            #text-wrapper > .pos-center { top: 50%; left: 50%; transform: translate(-50%, -50%); }
            #text-wrapper > .pos-right { top: 50%; right: var(--_awc-pad-h, var(--awc-card-padding, 16px)); transform: translateY(-50%); }
            #text-wrapper > .pos-bottom-left { bottom: var(--_awc-pad-v, var(--awc-card-padding, 16px)); left: var(--_awc-pad-h, var(--awc-card-padding, 16px)); }
            #text-wrapper > .pos-bottom-center { bottom: var(--_awc-pad-v, var(--awc-card-padding, 16px)); left: 50%; transform: translateX(-50%); }
            #text-wrapper > .pos-bottom-right { bottom: var(--_awc-pad-v, var(--awc-card-padding, 16px)); right: var(--_awc-pad-h, var(--awc-card-padding, 16px)); }
            #chips-group { position: absolute; pointer-events: none; font-family: var(--ha-font-family, var(--paper-font-body1_-_font-family, sans-serif)); transition: color 0.3s ease, text-shadow 0.3s ease; min-width: 0; max-width: calc(100% - var(--_awc-pad-h, var(--awc-card-padding, 16px)) * 2); box-sizing: border-box; }
            #chips-row,
            .chip-free { color: var(--awc-text-color); }
            .chip-sub { display: block; font-size: var(--awc-sub-size, 0.78em); opacity: 0.65; font-weight: var(--awc-sub-weight, 500); line-height: 1.2; white-space: var(--awc-sub-wrap, nowrap); overflow: var(--awc-sub-visible, hidden); text-overflow: var(--awc-sub-overflow, ellipsis); }
            .chip-val .fancy-unit { font-size: 0.55em; font-weight: 500; opacity: 0.85; vertical-align: baseline; position: relative; top: -0.45em; margin-left: 3px; }
            .chip.has-sub:not(.format-stacked):not(.format-vertical) { align-items: flex-start; }
            .chip.has-sub:not(.format-stacked):not(.format-vertical) .chip-icon { align-self: center; }
            .chip.has-sub:not(.format-stacked):not(.format-vertical) .chip-val { display: flex; flex-direction: column; }
            .chip.has-sub.format-stacked .chip-val,
            .chip.has-sub.format-vertical .chip-val { white-space: normal; overflow: visible; }
            #chips-group { pointer-events: auto; width: var(--awc-row-width, auto); box-sizing: border-box; padding: var(--awc-container-padding, 0); max-height: calc(100% - var(--_awc-pad-v, var(--awc-card-padding, 16px)) * 2); }
            #chips-group.has-row-wrap { --_pad-h: var(--_awc-pad-h, var(--awc-card-padding, 16px)); width: var(--awc-row-width, auto); }
            #chips-group.has-row-wrap.pos-top-left,
            #chips-group.has-row-wrap.pos-left,
            #chips-group.has-row-wrap.pos-bottom-left { left: var(--_pad-h); right: var(--_pad-h); width: var(--awc-row-width, auto); }
            #chips-group.has-row-wrap.pos-top-right,
            #chips-group.has-row-wrap.pos-right,
            #chips-group.has-row-wrap.pos-bottom-right { right: var(--_pad-h); left: auto; }
            #chips-group.has-row-wrap.pos-top-center,
            #chips-group.has-row-wrap.pos-bottom-center { left: 50%; transform: translateX(-50%); }
            #chips-group.has-row-wrap.pos-center { left: 50%; transform: translate(-50%, -50%); }
            #chips-group.has-row-wrap.pos-left { transform: translateY(-50%); }
            #chips-group.has-row-wrap.pos-right { transform: translateY(-50%); }
            #chips-group.has-row-horizontal-scroll { height: var(--awc-row-height, auto); }
            #chips-group.has-row-vertical-scroll { height: var(--awc-row-height, calc(100% - var(--_awc-pad-v, var(--awc-card-padding, 16px)) * 2)); }
            #chips-group.grouped { border-radius: var(--awc-bottom-bg-radius, calc(var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)) - 5px)); }
            #chips-group.grouped.with-bg { --_bg: var(--awc-container-bg-color, var(--awc-bottom-bg-color, var(--_text-bg))); }
            #chips-group.grouped.with-bg.contrast { background: var(--_bg); box-shadow: var(--awc-bg-shadow, var(--_contrast-shadow)); }
            #chips-group.grouped.with-bg.frosted { background: var(--_bg); border: var(--awc-bg-border, 1px solid var(--_text-bg-border)); box-shadow: var(--awc-bg-shadow, var(--_frosted-inset, none)); backdrop-filter: var(--awc-bottom-bg-filter, blur(10px)); -webkit-backdrop-filter: var(--awc-bottom-bg-filter, blur(10px)); }
            #chips-group.grouped.with-bg.theme { background: var(--ha-card-background, var(--card-background-color, var(--primary-background-color))); border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color)); box-shadow: var(--ha-card-box-shadow, none); }
            #chips-group.grouped.with-bg > #chips-row .chip.with-bg { background: none; border: none; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; border-radius: 0; padding: var(--awc-chips-padding, 0); }
            #chips-group.grouped.with-bg > #chips-row.has-separator > .chip { position: relative; overflow: visible; }
            #chips-group.grouped.with-bg > #chips-row.has-separator > .chip + .chip::before { content: ""; position: absolute; pointer-events: none; top: 0; bottom: 0; inset-inline-start: calc((var(--awc-bottom-gap, 8px) / -2) - (var(--awc-separator-width, 2px) / 2)); width: var(--awc-separator-width, 2px); background: var(--awc-separator-color, color-mix(in srgb, currentColor 10%, transparent)); }
            #chips-group.grouped.with-bg > #chips-row.has-separator.row-vertical-scroll > .chip + .chip::before { top: calc((var(--awc-bottom-gap, 8px) / -2) - (var(--awc-separator-width, 2px) / 2)); bottom: auto; left: 0; right: 0; inset-inline-start: 0; width: auto; height: var(--awc-separator-width, 2px); }
            #chips-row { font-size: var(--awc-bottom-font-size, clamp(15px, 5cqmin, 26px)); font-weight: var(--awc-bottom-font-weight, 500); display: flex; align-items: center; gap: var(--awc-bottom-gap, 8px); width: 100%; box-sizing: border-box; pointer-events: auto; border-radius: inherit; }
            #chips-row.has-separator > .chip { position: relative; overflow: visible; }
            #chips-row.has-separator > .chip + .chip::before { content: ""; position: absolute; pointer-events: none; top: 0; bottom: 0; inset-inline-start: calc((var(--awc-bottom-gap, 8px) / -2) - (var(--awc-separator-width, 2px) / 2)); width: var(--awc-separator-width, 2px); background: var(--awc-separator-color, color-mix(in srgb, currentColor 10%, transparent)); }
            #chips-row.has-separator.row-vertical-scroll > .chip + .chip::before { top: calc((var(--awc-bottom-gap, 8px) / -2) - (var(--awc-separator-width, 2px) / 2)); bottom: auto; left: 0; right: 0; inset-inline-start: 0; width: auto; height: var(--awc-separator-width, 2px); }
            #chips-row.row-wrap { flex-wrap: wrap; }
            #chips-row.row-horizontal-scroll { flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; height: 100%; scroll-snap-type: x proximity; scrollbar-width: none; -ms-overflow-style: none; pointer-events: auto; }
            #chips-row.row-horizontal-scroll::-webkit-scrollbar { display: none; }
            #chips-row.row-horizontal-scroll.has-visible-count { display: grid; grid-auto-flow: column; grid-auto-columns: var(--awc-chip-basis); scroll-snap-type: x mandatory; }
            #chips-row.row-horizontal-scroll.has-visible-count > .chip { width: 100%; overflow: hidden; scroll-snap-align: start; }
            #chips-row.row-vertical-scroll { flex-direction: column; flex-wrap: nowrap; overflow-y: auto; overflow-x: hidden; height: 100%; max-height: var(--awc-row-max-height, none); scroll-snap-type: y proximity; scrollbar-width: none; -ms-overflow-style: none; pointer-events: auto; }
            #chips-row.row-vertical-scroll::-webkit-scrollbar { display: none; }
            #chips-row.row-vertical-scroll.has-visible-count { display: grid; grid-auto-flow: row; grid-auto-rows: var(--awc-chip-basis-v, auto); max-height: none; scroll-snap-type: y mandatory; }
            #chips-row.row-vertical-scroll.has-visible-count > .chip { height: 100%; overflow: hidden; scroll-snap-align: start; }
            #chips-row.row-vertical-scroll:not(.has-visible-count)[class*="pos-bottom"] > :first-child { margin-block-start: auto; }
            #chips-row.row-vertical-scroll:not(.has-visible-count).pos-center > :first-child { margin-block-start: auto; }
            #chips-row.row-vertical-scroll:not(.has-visible-count).pos-center > :last-child { margin-block-end: auto; }
            #chips-row.row-vertical-scroll[class*="right"] { align-items: flex-end; }
            #chips-row.row-vertical-scroll.pos-top-center,
            #chips-row.row-vertical-scroll.pos-center,
            #chips-row.row-vertical-scroll.pos-bottom-center { align-items: center; }
            #chips-row.row-grid { display: grid; grid-template-columns: repeat(var(--awc-row-columns, 1), minmax(0, 1fr)); align-items: stretch; row-gap: var(--awc-bottom-gap, 8px); column-gap: var(--awc-bottom-gap, 8px); }
            #chips-row.row-wrap[class*="right"] { justify-content: flex-end; }
            #chips-row.row-wrap.pos-top-center,
            #chips-row.row-wrap.pos-center,
            #chips-row.row-wrap.pos-bottom-center { justify-content: center; }
            #chips-row.row-grid,
            #chips-row.full-width,
            #chips-row.has-visible-count { align-items: stretch; }
            #chips-row.row-grid > .chip,
            #chips-row.full-width > .chip,
            #chips-row.has-visible-count > .chip { width: 100%; overflow: hidden; }
            #chips-row.row-grid > .chip > .chip-val,
            #chips-row.full-width > .chip > .chip-val,
            #chips-row.has-visible-count > .chip > .chip-val { flex: 0 1 auto; }
            #chips-row.align-center.row-grid > .chip,
            #chips-row.align-center.full-width > .chip,
            #chips-row.align-center.has-visible-count > .chip { justify-content: center; text-align: center; }
            #chips-row.align-end.row-grid > .chip,
            #chips-row.align-end.full-width > .chip,
            #chips-row.align-end.has-visible-count > .chip { justify-content: flex-start; text-align: end; }
            #chips-row.align-center .chip.format-stacked,
            #chips-row.align-center .chip.format-vertical { justify-content: center; }
            #chips-row.align-center .chip.format-stacked { grid-template-columns: auto minmax(0, auto); }
            #chips-row.align-center .chip.format-stacked .chip-name,
            #chips-row.align-center .chip.format-vertical .chip-name,
            #chips-row.align-center .chip.format-stacked .chip-val,
            #chips-row.align-center .chip.format-vertical .chip-val { align-self: auto; justify-self: start; text-align: start; }
            #chips-row.align-center .chip.format-vertical .chip-name,
            #chips-row.align-center .chip.format-vertical .chip-val { justify-self: center; text-align: center; display: flex; flex-direction: column; gap: 2px; }
            #chips-row.align-center .chip.format-stacked.no-icon,
            #chips-row.align-center .chip.format-vertical.no-icon { justify-items: center; }
            #chips-row.align-center .chip.format-stacked.no-icon .chip-name,
            #chips-row.align-center .chip.format-vertical.no-icon .chip-name,
            #chips-row.align-center .chip.format-stacked.no-icon .chip-val,
            #chips-row.align-center .chip.format-vertical.no-icon .chip-val { justify-self: center; text-align: center; }
            #chips-row.align-end .chip:not(.format-stacked):not(.format-vertical) { flex-direction: row-reverse; }
            #chips-row.align-end .chip:not(.format-stacked):not(.format-vertical) .chip-icon { margin-right: 0; margin-left: var(--awc-chip-gap, 6px); }
            #chips-row.align-end .chip:not(.format-stacked):not(.format-vertical) .chip-name { margin-right: 0; margin-left: var(--awc-chip-text-gap, 0.35em); }
            #chips-row.align-end .chip.format-stacked { grid-template: "name icon" auto "value icon" auto / minmax(0, auto) auto; justify-content: end; }
            #chips-row.align-end .chip.format-vertical { justify-items: end; text-align: end; }
            #chips-row.align-end .chip.format-stacked.with-bg,
            #chips-row.align-end .chip.format-vertical.with-bg { padding: var(--awc-chips-padding, 6px 6px 6px 10px); }
            #chips-row.align-end .chip.format-stacked .chip-name,
            #chips-row.align-end .chip.format-vertical .chip-name,
            #chips-row.align-end .chip.format-stacked .chip-val,
            #chips-row.align-end .chip.format-vertical .chip-val { justify-self: end; text-align: end; }
            #chips-row.align-spread .chip:not(.format-stacked):not(.format-vertical) { flex: 1 1 0; }
            #chips-row.align-spread .chip:not(.format-stacked):not(.format-vertical) .chip-val { margin-left: auto; text-align: right; }
            #chips-row.align-spread .chip.format-stacked { flex: 1 1 0; grid-template-columns: auto 1fr; }
            #chips-row.align-spread .chip.format-stacked .chip-val { text-align: right; justify-self: end; }
            #chips-row[class*="pos-bottom"]:not(.has-visible-count) > .chip.format-stacked,
            #chips-row[class*="pos-bottom"]:not(.has-visible-count) > .chip.format-vertical { align-content: end; }
            #chips-row[class*="pos-top"]:not(.has-visible-count) > .chip.format-stacked,
            #chips-row[class*="pos-top"]:not(.has-visible-count) > .chip.format-vertical { align-content: start; }
            #chips-row.pos-center:not(.has-visible-count) > .chip.format-stacked,
            #chips-row.pos-center:not(.has-visible-count) > .chip.format-vertical,
            #chips-row.pos-left:not(.has-visible-count) > .chip.format-stacked,
            #chips-row.pos-left:not(.has-visible-count) > .chip.format-vertical,
            #chips-row.pos-right:not(.has-visible-count) > .chip.format-stacked,
            #chips-row.pos-right:not(.has-visible-count) > .chip.format-vertical { align-content: center; }
            #chips-row.has-visible-count > .chip.format-stacked,
            #chips-row.has-visible-count > .chip.format-vertical { align-content: center; }
            #chips-row[class*="pos-bottom"]:not(.has-visible-count).has-enhanced-child { align-items: flex-end; }
            #chips-row[class*="pos-top"]:not(.has-visible-count).has-enhanced-child { align-items: flex-start; }
            .chip { display: flex; align-items: center; gap: 0; flex: 0 0 auto; min-width: 0; max-width: 100%; white-space: nowrap; box-sizing: border-box; scroll-snap-align: start; padding: var(--awc-chips-padding, 0); cursor: pointer; }
            .chip:not(.with-bg) .chip-name { opacity: var(--awc-bottom-opacity, 0.7); }
            .chip.has-icon-bg.frosted:not(.with-bg) .chip-name { opacity: var(--awc-bottom-opacity, 0.7); }
            .chip .chip-icon { flex: 0 0 auto; display: flex; align-items: center; justify-content: center; margin-right: var(--awc-chip-gap, 6px); padding: var(--awc-icon-padding, 0); }
            .chip .chip-icon ha-icon,
            .chip .chip-icon ha-state-icon { --mdc-icon-size: var(--awc-icon-size, 1.1em); opacity: 0.9; }
            .chip .chip-icon img.custom-bottom-icon { display: block; height: var(--awc-icon-size, 1.1em); width: var(--awc-icon-size, 1.1em); object-fit: contain; }
            .chip .chip-name { font-size: var(--awc-chip-name-font-size, inherit); font-weight: var(--awc-chip-name-weight, 500); opacity: var(--awc-chip-name-opacity, 0.7); color: var(--awc-chip-name-color, inherit); flex: 0 0 auto; margin-right: var(--awc-chip-text-gap, 0.35em); }
            .chip .chip-val { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; display: inline-block; font-weight: var(--awc-chip-value-weight, 700); }
            .chip.no-name:not(.format-stacked):not(.format-vertical) .chip-val { font-weight: var(--awc-chip-value-weight, 700); }
            .chip .chip-val,
            .chip .chip-name { text-shadow: var(--_chip-no-bg-shadow, 0 1px 2px rgba(0, 0, 0, 0.35)); }
            .chip.overflow-clip .chip-val { text-overflow: clip; }
            .chip.overflow-wrap .chip-val { white-space: normal; overflow: visible; text-overflow: clip; }
            .chip.overflow-wrap:not(.format-stacked):not(.format-vertical) .chip-val { display: inline; }
            .chip.with-bg { --_bg: var(--awc-bottom-bg-color, var(--_text-bg)); padding: var(--awc-chips-padding, 5px 10px); border-radius: var(--awc-bottom-bg-radius, calc(var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)) - 5px)); align-items: center; }
            .chip.with-bg .chip-val,
            .chip.with-bg .chip-name { text-shadow: none; }
            .chip.with-bg.contrast { background: var(--_bg); box-shadow: var(--awc-bg-shadow, var(--_contrast-shadow)); }
            .chip.with-bg.frosted { background: var(--_bg); border: var(--awc-bg-border, 1px solid var(--_text-bg-border)); box-shadow: var(--awc-bg-shadow, var(--_frosted-inset, none)); backdrop-filter: var(--awc-bottom-bg-filter, blur(10px)); -webkit-backdrop-filter: var(--awc-bottom-bg-filter, blur(10px)); }
            .chip.with-bg.theme { background: var(--ha-card-background, var(--card-background-color, var(--primary-background-color))); border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color)); box-shadow: var(--ha-card-box-shadow, none); }
            .chip.format-stacked,
            .chip.format-vertical { display: grid; align-items: center; }
            .chip.format-stacked .chip-icon,
            .chip.format-vertical .chip-icon { grid-area: icon; margin: 0; aspect-ratio: 1; overflow: visible; border-radius: var(--awc-stacked-icon-radius, calc(var(--awc-bottom-bg-radius, calc(var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)) - 5px)) - var(--awc-stacked-icon-inset, 3px))); padding: var(--awc-icon-padding, 4px); }
            .chip.format-stacked .chip-icon ha-icon,
            .chip.format-stacked .chip-icon ha-state-icon,
            .chip.format-vertical .chip-icon ha-icon,
            .chip.format-vertical .chip-icon ha-state-icon { --mdc-icon-size: var(--awc-icon-size, 1.3em); opacity: 1; }
            .chip.format-stacked .chip-icon img.custom-bottom-icon,
            .chip.format-vertical .chip-icon img.custom-bottom-icon { height: var(--awc-icon-size, 1.3em); width: var(--awc-icon-size, 1.3em); }
            .chip.format-stacked .chip-name,
            .chip.format-vertical .chip-name { grid-area: name; max-width: 100%; font-size: var(--awc-chip-name-font-size, var(--awc-stacked-name-size, 0.85em)); font-weight: var(--awc-chip-name-weight, 500); opacity: var(--awc-stacked-name-opacity, 0.6); color: var(--awc-stacked-name-color, inherit); line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0; }
            .chip.format-stacked .chip-name:empty,
            .chip.format-vertical .chip-name:empty { display: none; }
            .chip.format-stacked:not(.chip-bar-type) .chip-name:empty + .chip-val,
            .chip.format-vertical:not(.chip-bar-type) .chip-name:empty + .chip-val { grid-row: 1 / -1; align-self: center; }
            .chip.format-stacked.empty-name .chip-icon,
            .chip.format-vertical.empty-name .chip-icon { background: none; border: none; box-shadow: none; aspect-ratio: unset; align-self: center; }
            .chip.format-stacked .chip-val,
            .chip.format-vertical .chip-val { grid-area: value; font-weight: var(--awc-stacked-value-weight, 700); min-width: 0; max-width: 100%; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .chip.format-stacked { grid-template: "icon name" auto "icon value" auto / auto 1fr; column-gap: var(--awc-stacked-column-gap, var(--awc-chip-gap, 10px)); row-gap: var(--awc-stacked-row-gap, var(--awc-chip-text-gap, 4px)); }
            .chip.format-stacked .chip-icon { align-self: stretch; }
            .chip.format-stacked .chip-name { align-self: end; }
            .chip.format-stacked .chip-val { align-self: start; }
            .chip.format-stacked.no-icon { grid-template: "name" auto "value" auto / 1fr; column-gap: 0; }
            .chip.format-stacked.with-bg { padding: var(--awc-chips-padding, 6px 10px 6px 6px); }
            .chip.format-vertical { grid-template: "icon" auto "name" auto "value" auto / 1fr; row-gap: 0; justify-items: center; text-align: center; }
            .chip.format-vertical .chip-name:empty + .chip-val { grid-row: value; align-self: center; }
            .chip.format-vertical .chip-icon { align-self: center; justify-self: center; margin: 0 0 var(--awc-vertical-icon-gap, var(--awc-chip-gap, 6px)) 0; }
            .chip.format-vertical .chip-icon ha-icon,
            .chip.format-vertical .chip-icon ha-state-icon { --mdc-icon-size: var(--awc-icon-size, 1.6em); }
            .chip.format-vertical .chip-icon img.custom-bottom-icon { height: var(--awc-icon-size, 1.6em); width: var(--awc-icon-size, 1.6em); }
            .chip.format-vertical .chip-name { align-self: auto; margin: 0 0 var(--awc-chip-text-gap, 4px) 0; }
            .chip.format-vertical .chip-val { align-self: auto; }
            .chip.format-vertical.with-bg { padding: var(--awc-chips-padding, 6px 10px); }
            .chip.format-vertical:not(.has-icon-bg) .chip-icon { background: none; border: none; box-shadow: none; aspect-ratio: unset; border-radius: 0; overflow: visible; padding: var(--awc-icon-padding, 0); }
            .chip.no-icon-bg .chip-icon { background: none !important; border: none !important; box-shadow: none !important; aspect-ratio: unset !important; border-radius: 0 !important; overflow: visible !important; padding: var(--awc-icon-padding, 0) !important; }
            .chip.icon-only .chip-icon { margin: 0 !important; }
            .chip.align-center:not(.format-stacked):not(.format-vertical) { justify-content: center; }
            .chip.align-center:not(.format-stacked):not(.format-vertical) .chip-val { flex: 0 0 auto; text-align: center; }
            .chip.align-end:not(.format-stacked):not(.format-vertical) { flex-direction: row-reverse; }
            .chip.align-end:not(.format-stacked):not(.format-vertical) .chip-icon { margin-right: 0; margin-left: var(--awc-chip-gap, 6px); }
            .chip.align-end:not(.format-stacked):not(.format-vertical) .chip-name { margin-right: 0; margin-left: var(--awc-chip-text-gap, 0.35em); }
            .chip.align-end:not(.format-stacked):not(.format-vertical) .chip-val { flex: 0 0 auto; }
            .chip.overflow-marquee:not(.marquee-label).align-center .chip-val,
            .chip.overflow-marquee:not(.marquee-label).align-end .chip-val { flex: 1 1 auto; min-width: 0; }
            .chip.align-spread:not(.format-stacked):not(.format-vertical) .chip-val { margin-left: auto; }
            .chip.align-start.format-stacked .chip-name,
            .chip.align-start.format-stacked .chip-val { justify-self: start; text-align: start; }
            .chip.align-center.format-stacked { grid-template-columns: auto minmax(0, auto); justify-content: center; }
            .chip.align-center.format-stacked .chip-name,
            .chip.align-center.format-stacked .chip-val { align-self: auto; justify-self: start; text-align: start; }
            .chip.align-end.format-stacked { grid-template: "name icon" auto "value icon" auto / minmax(0, auto) auto; justify-content: end; }
            .chip.align-end.format-stacked .chip-name,
            .chip.align-end.format-stacked .chip-val { justify-self: end; text-align: end; }
            .chip.align-end.format-stacked.with-bg { padding: var(--awc-chips-padding, 6px 6px 6px 10px); }
            .chip.align-start.format-vertical { justify-items: start; text-align: start; }
            .chip.align-center.format-vertical { justify-items: center; text-align: center; }
            .chip.align-end.format-vertical { justify-items: end; text-align: end; }
            .chip.has-icon-bg .chip-icon { aspect-ratio: 1; overflow: visible; border-radius: var(--awc-stacked-icon-radius, calc(var(--awc-bottom-bg-radius, calc(var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)) - 5px)) - var(--awc-stacked-icon-inset, 3px))); padding: var(--awc-icon-padding, 4px); }
            .chip.has-icon-bg:not(.format-stacked):not(.format-vertical) .chip-icon { align-self: stretch; }
            .chip.has-icon-bg.format-stacked .chip-icon { align-self: stretch; }
            .chip.has-icon-bg:not(.with-bg) .chip-icon { background: var(--_bg, var(--awc-bottom-bg-color, var(--_text-bg))); border: var(--awc-bg-border, 1px solid var(--_text-bg-border, transparent)); box-shadow: var(--awc-icon-bg-shadow, var(--_frosted-inset, none)); }
            .chip.has-icon-bg:not(.with-bg).frosted .chip-icon { backdrop-filter: var(--awc-bottom-bg-filter, blur(10px)); -webkit-backdrop-filter: var(--awc-bottom-bg-filter, blur(10px)); }
            .chip.has-icon-bg:not(.with-bg).contrast .chip-icon { box-shadow: var(--awc-icon-bg-shadow, var(--_contrast-shadow, none)); border: none; }
            .chip.has-icon-bg:not(.with-bg).theme .chip-icon { background: var(--ha-card-background, var(--card-background-color, var(--primary-background-color))); border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color)); box-shadow: var(--ha-card-box-shadow, none); }
            .chip.has-icon-bg.with-bg .chip-icon { background: var(--awc-stacked-icon-bg, color-mix(in srgb, var(--ha-card-background, var(--card-background-color, var(--primary-background-color))) 20%, transparent)); border: none; box-shadow: var(--awc-icon-bg-shadow, 0 2px 6px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.12)); }
            .chip.has-icon-bg.with-bg.frosted .chip-icon { border: var(--_stacked-icon-border, none); }
            .chip.has-icon-bg.with-bg.contrast .chip-icon { box-shadow: var(--awc-icon-bg-shadow, var(--_stacked-icon-shadow, 0 2px 6px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.12))); }
            .chip.has-icon-bg.with-bg.theme .chip-icon { border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color)); }
            .chip-free { position: absolute; pointer-events: auto; z-index: 99; font-family: var(--ha-font-family, var(--paper-font-body1_-_font-family, sans-serif)); font-size: var(--awc-bottom-font-size, clamp(15px, 5cqmin, 26px)); font-weight: var(--awc-bottom-font-weight, 500); max-width: calc(100% - var(--_awc-pad-h, var(--awc-card-padding, 16px)) * 2); box-sizing: border-box; text-shadow: var(--awc-text-shadow-active); }
            .chip-free.behind { z-index: -1; }
            .chip.behind { position: relative; z-index: -1; }
            .chip.chip-round.with-bg { border-radius: 999px; }
            .chip.chip-round .chip-icon { border-radius: 999px; }
            .chip.chip-ring { position: relative; border-radius: 50%; aspect-ratio: 1; justify-content: center; align-content: center; z-index: 1; padding: var(--awc-chips-padding, 10px); }
            .chip.chip-ring.with-bg { border-radius: 50%; padding: var(--awc-chips-padding, 10px); }
            .chip.chip-ring.format-vertical .chip-icon { margin-bottom: var(--awc-vertical-icon-gap, var(--awc-chip-gap, 4px)); }
            .chip.chip-ring.format-vertical .chip-name { margin-bottom: var(--awc-chip-text-gap, 2px); }
            .chip-ring-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; scroll-snap-align: start; }
            .chip-ring-wrap::before { content: ""; position: absolute; inset: 0; border-radius: 50%; background: var(--awc-ring-gradient, conic-gradient(var(--awc-ring-color, var(--primary-color, #03a9f4)) var(--awc-ring-pct, 0%), transparent 0)); -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); mask: radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); transition: --awc-ring-pct 0.6s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; z-index: 0; }
            .chip-ring-wrap.has-segments::before { -webkit-mask: conic-gradient(#000 var(--awc-ring-pct, 0%), transparent 0), radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); mask: conic-gradient(#000 var(--awc-ring-pct, 0%), transparent 0), radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); -webkit-mask-composite: source-in; mask-composite: intersect; }
            .chip-ring-track { position: absolute; inset: 0; border-radius: 50%; -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); mask: radial-gradient(farthest-side, transparent calc(100% - var(--awc-ring-w, 4px) - 0.5px), #000 calc(100% - var(--awc-ring-w, 4px))); background: currentColor; opacity: 0.10; pointer-events: none; }
            .chip-ring-wrap > .chip { margin: var(--awc-ring-gap, 3px); z-index: 1; }
            #chips-row.row-grid > .chip-ring-wrap > .chip,
            #chips-row.full-width > .chip-ring-wrap > .chip,
            #chips-row.has-visible-count > .chip-ring-wrap > .chip { width: calc(100% - var(--awc-ring-gap, 3px) * 2); }
            #chips-row.row-grid > .chip-ring-wrap { aspect-ratio: 1; }
            .chip-bar { --_bar-radius: calc(var(--awc-card-border-radius, var(--ha-card-border-radius, 12px)) * 0.35); position: relative; width: 100%; height: var(--awc-bar-h, 4px); border-radius: var(--_bar-radius); overflow: hidden; margin-top: var(--awc-bar-gap, 4px); flex-shrink: 0; }
            .chip-bar-track { position: absolute; inset: 0; border-radius: inherit; background: currentColor; opacity: 0.10; }
            .chip-bar-fill { position: absolute; inset: 0; border-radius: inherit; background: var(--awc-bar-gradient, var(--awc-bar-color, var(--primary-color, #03a9f4))); transform-origin: left center; transform: scaleX(var(--awc-bar-scale, 0)); transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
            .chip.chip-bar-type { flex-wrap: wrap; }
            .chip.chip-bar-type.format-stacked { grid-template: "icon name" auto "icon value" auto "bar bar" auto / auto 1fr; }
            .chip.chip-bar-type.format-stacked .chip-bar { grid-area: bar; }
            .chip.chip-bar-type.format-stacked.no-icon { grid-template: "name" auto "value" auto "bar" auto / 1fr; }
            .chip.chip-bar-type.format-vertical { grid-template: "icon" auto "name" auto "value" auto "bar" auto / 1fr; }
            .chip.chip-bar-type.format-vertical .chip-bar { grid-area: bar; justify-self: stretch; }
            .chip.chip-loading { position: relative; }
            .chip.chip-loading .chip-icon,
            .chip.chip-loading .chip-name,
            .chip.chip-loading .chip-val,
            .chip.chip-loading .chip-bar { visibility: hidden; }
            .chip-ring-wrap.chip-loading .chip-ring-track,
            .chip-ring-wrap.chip-loading::before { visibility: hidden; }
            .chip-loader { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 5px; pointer-events: none; }
            .chip-loader span { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0.2; animation: awc-dot-pulse 1.2s ease-in-out infinite; }
            .chip-loader span:nth-child(2) { animation-delay: 0.2s; }
            .chip-loader span:nth-child(3) { animation-delay: 0.4s; }
@keyframes awc-dot-pulse {
                0%, 60%, 100% { opacity: 0.2; transform: scale(0.85); }
                30%           { opacity: 0.7; transform: scale(1); }
            }
            .chip .chip-val.awc-marquee-host { overflow: hidden; text-overflow: clip; contain: layout style; }
            .chip .chip-name.awc-marquee-host { overflow: hidden; text-overflow: clip; contain: layout style; margin-right: var(--awc-chip-text-gap, 0.35em); }
            .chip.marquee-value .chip-name { flex: 0 0 auto; }
            .chip.marquee-label .chip-name { flex: 1 1 auto; min-width: 0; }
            .chip.marquee-label .chip-val { flex: 0 0 auto; }
            .chip.marquee-both .chip-name { flex: 1 1 auto; min-width: 0; }
            .chip.marquee-both .chip-val { flex: 1 1 auto; min-width: 0; }
            .chip .chip-val.awc-marquee-host.is-animating { -webkit-mask-image: linear-gradient(to right, transparent 0, #000 var(--awc-marquee-fade, 12px), #000 calc(100% - var(--awc-marquee-fade, 12px)), transparent 100%); mask-image: linear-gradient(to right, transparent 0, #000 var(--awc-marquee-fade, 12px), #000 calc(100% - var(--awc-marquee-fade, 12px)), transparent 100%); }
            .chip .chip-name.awc-marquee-host.is-animating { -webkit-mask-image: linear-gradient(to right, transparent 0, #000 var(--awc-marquee-fade, 12px), #000 calc(100% - var(--awc-marquee-fade, 12px)), transparent 100%); mask-image: linear-gradient(to right, transparent 0, #000 var(--awc-marquee-fade, 12px), #000 calc(100% - var(--awc-marquee-fade, 12px)), transparent 100%); }
            .chip-sub.awc-marquee-host { overflow: hidden; text-overflow: clip; contain: layout style; }
            .chip-sub.awc-marquee-host.is-animating { -webkit-mask-image: linear-gradient(to right, transparent 0, #000 var(--awc-marquee-fade, 12px), #000 calc(100% - var(--awc-marquee-fade, 12px)), transparent 100%); mask-image: linear-gradient(to right, transparent 0, #000 var(--awc-marquee-fade, 12px), #000 calc(100% - var(--awc-marquee-fade, 12px)), transparent 100%); }
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
        root.innerHTML = `<canvas id="bg-canvas"></canvas><canvas id="mid-canvas"></canvas><div id="image-slot"><img /></div><canvas id="fg-canvas"></canvas><div id="text-wrapper"><div id="chips-group"><div id="chips-row"></div></div></div><div id="custom-cards-wrapper"></div>`;
        this.shadowRoot.append(style, root); const q = (sel) => root.querySelector(sel);
        const bg = q('#bg-canvas'), mid = q('#mid-canvas'), fg = q('#fg-canvas');
        const img = q('#image-slot > img');
        img.onerror = () => { img.style.opacity = '0'; };
        img.onload  = () => { img.style.opacity = '1'; };
        const chipsRow = q('#chips-row'); chipsRow.addEventListener('click', (e) => this._handleChipClick(e));
        this._elements = {
            root, bg, mid, fg, img, imageSlot: q('#image-slot'),
            chipsGroup: q('#chips-group'), chipsRow,
            textWrapper: q('#text-wrapper'),
            customCardsWrapper: q('#custom-cards-wrapper'),
        };
        const ctxOpts = { alpha: true, willReadFrequently: false };
        const bgCtx = bg.getContext('2d', ctxOpts), midCtx = mid.getContext('2d', ctxOpts), fgCtx = fg.getContext('2d', ctxOpts);
        if (!bgCtx || !midCtx || !fgCtx) {
            console.error('ATMO-WEATHER-CARD: Failed to get canvas context');
            return;
        }
        bgCtx.imageSmoothingQuality = midCtx.imageSmoothingQuality = fgCtx.imageSmoothingQuality = 'high';
        this._ctxs = { bg: bgCtx, mid: midCtx, fg: fgCtx };
    }
    _clearAllParticles() {
        if (this._cloudAtlases) {
            for (let i = 0; i < this._cloudAtlases.length; i++) {
                const a = this._cloudAtlases[i]; a.canvas.width = 0; a.canvas.height = 0;
            }
            this._cloudAtlases = null;
        }
        for (const key of PARTICLE_ARRAYS) this[key] = []; this._flashHold = 0; this._aurora = null;
        if (this._milkyWay) { this._milkyWay.width = 0; this._milkyWay = null; }
    }
    // DOM UPDATES
    _updateStandaloneStyles(isNight, newParams) {
        const root = this._elements.root, atm = newParams.atmosphere || '';
        const w = this._cachedDimensions.width / (this._cachedDimensions.dpr || 1);
        // === GLOW VARIABLES — all modes (standalone + immersive) ===
        // Default --g-op: 0 in CSS; nothing shows until JS sets values.
        if (w > 0) {
            const h = this._cachedDimensions.height / (this._cachedDimensions.dpr || 1);
            const celestial = this._getCelestialPosition(w, h);
            this._cssVar(root, '--c-x', `${celestial.x}px`, '_prevCx');
            this._cssVar(root, '--c-y', `${celestial.y}px`, '_prevCy');
            if (h > 0) {
                const dx = Math.max(celestial.x, w - celestial.x), dy = Math.max(celestial.y, h - celestial.y);
                this._cssVar(root, '--c-r', `${Math.ceil(Math.sqrt(dx * dx + dy * dy) * 0.3)}px`, '_prevCr');
            }
        }
        if (this._isTimeNight) {
            const _mpcIllum = this._moonPhaseConfig && this._moonPhaseConfig.illumination;
            const illum = _mpcIllum != null ? _mpcIllum : 1.0;
            const nightWeatherOp = { storm: 0.08, pouring: 0.10, rain: 0.14, snow: 0.22, overcast: 0.28, windy: 0.28, mist: 0.20, fog: 0.20, fair: 0.80 };
            const weatherFactor = nightWeatherOp[atm] != null ? nightWeatherOp[atm] : 1.0, nightOp = (0.20 + illum * 0.30) * weatherFactor, forcedLight = !this._isThemeDark;
            // Colored moon_style drives the glow tint in both modes. Unset or
            // unknown values fall back to the original per-theme defaults.
            const rawStyle = (this._config.celestial_moon_style || '').toLowerCase();
            const coloredRgbMap = { yellow: '255,200,50', blue: '100,125,175', purple: '140,115,175', grey: '105,110,120' };
            let moonRgb;
            if (coloredRgbMap[rawStyle]) {
                moonRgb = coloredRgbMap[rawStyle];
            } else if (forcedLight) {
                moonRgb = '100,125,175';
            } else {
                moonRgb = this._isLightBackground ? '218,228,255' : '190,210,255';
            }
            this._cssVar(root, '--g-rgb', moonRgb, '_prevGRgb'); this._cssVar(root, '--g-op', nightOp.toFixed(3), '_prevGOp');
        } else {
            const dayWeatherOp = { storm: 0.06, pouring: 0.08, rain: 0.10, snow: 0.16, mist: 0.16, fog: 0.16, overcast: 0.26, windy: 0.24, fair: 0.38, clear: 0.55, exceptional: 0.55 };
            const dayOp = dayWeatherOp[atm] != null ? dayWeatherOp[atm] : 0.45;
            const coolGlow = atm === 'overcast' || atm === 'mist' || atm === 'windy' || atm === 'fog';
            const badGlow = atm === 'storm' || atm === 'pouring' || atm === 'rain' || atm === 'snow';
            const dayRgb = badGlow ? '232, 240, 252' : coolGlow ? '240, 245, 255' : '255, 248, 232';
            this._cssVar(root, '--g-rgb', dayRgb, '_prevGRgb'); this._cssVar(root, '--g-op', dayOp.toFixed(3), '_prevGOp');
        }
            const isDarkScheme = this._isThemeDark;
        root.classList.toggle('scheme-night', isDarkScheme); root.classList.toggle('scheme-day', !isDarkScheme);
        root.classList.toggle('time-day', !this._isTimeNight);
            if (this._isImmersive) {
            if (this._prevStyleSig !== null) {
                root.classList.remove('standalone', ...WEATHER_CLASSES); this._prevStyleSig = null;
            }
            return;
        }
        const styleSig = `${isDarkScheme}_${this._isTimeNight}_${atm}_${this._moonPhaseState}`;
        if (this._prevStyleSig === styleSig) return; this._prevStyleSig = styleSig; root.classList.add('standalone');
        root.classList.remove(...WEATHER_CLASSES); const weatherClass = ATMOSPHERE_CSS[atm]; if (weatherClass) root.classList.add(weatherClass);
    }
    _applyConfigStyles() {
        if (!this._elements || !this._elements.chipsRow) return; const cfg = this._config; const showText = cfg.card_hide_text !== true;
        const showBottom = cfg.chip_area_hide !== true, showBottomBg = cfg.chip_area_background === true;
        const bgStyle = ['contrast', 'frosted', 'theme'].includes((cfg.card_background_style || '').toLowerCase()) ? cfg.card_background_style.toLowerCase() : 'frosted';
        const root = this._elements.root;
        this._cssVar(root, '--awc-bottom-font-size', cfg.chip_text_size || '', '_prevBottomFS');
        this._cssVar(root, '--awc-chip-name-font-size', cfg.chip_label_size || '', '_prevChipNameFS');
        this._cssVar(root, '--awc-card-padding', cfg.card_padding || '', '_prevCardPadding');
        const padRaw = (cfg.card_padding || '').toString().trim();
        if (padRaw && this._prevCardPadParsed !== padRaw) {
            this._prevCardPadParsed = padRaw; const parts = padRaw.split(/\s+/); root.style.setProperty('--_awc-pad-v', parts[0] || '');
            root.style.setProperty('--_awc-pad-h', parts[1] || parts[0] || '');
        } else if (!padRaw && this._prevCardPadParsed) {
            this._prevCardPadParsed = ''; root.style.removeProperty('--_awc-pad-v'); root.style.removeProperty('--_awc-pad-h');
        }
        const configSig = `${showText}|${showBottom}|${bgStyle}`;
        if (this._prevConfigSig !== configSig) {
            this._prevConfigSig = configSig; this._elements.textWrapper.style.display = showText ? '' : 'none';
            this._elements.chipsRow.style.display = showBottom ? '' : 'none'; this._elements.chipsGroup.style.display = showBottom ? '' : 'none';
        }
        for (const [prop, key, cache] of [
            ['--awc-row-width', 'chip_area_width', '_prevRowWidth'],
            ['--awc-row-height', 'chip_area_height', '_prevRowHeight'],
            ['--awc-chips-padding', 'chip_padding', '_prevChipPad'],
            ['--awc-container-padding', 'chip_area_padding', '_prevContainerPad'],
            ['--awc-container-bg-color', 'chip_area_background_color', '_prevContainerBgColor'],
            ['--awc-bottom-gap', 'chip_area_gap', '_prevChipsGap'],
            ['--awc-chip-gap', 'chip_gap', '_prevChipGap'],
            ['--awc-chip-text-gap', 'chip_text_gap', '_prevChipTextGap'],
            ['--awc-icon-size', 'chip_icon_size', '_prevChipIconWidth'],
            ['--awc-icon-padding', 'chip_icon_padding', '_prevChipIconPad'],
        ]) this._cssVar(root, prop, (cfg[key] || '').toString().trim(), cache);
        const cols = parseInt(cfg.chip_area_columns, 10);
        this._cssVar(root, '--awc-row-columns', Number.isFinite(cols) && cols > 0 ? String(cols) : '', '_prevRowCols');
        let rowLayout = (cfg.chip_area_layout || 'wrap').toString().toLowerCase();
        const isGrouped = cfg.chip_area_grouped === true, bt = this._elements.chipsRow, cg = this._elements.chipsGroup;
        if (this._prevRowOverflow !== rowLayout) {
            this._prevRowOverflow = rowLayout;
            for (const m of ['horizontal-scroll', 'wrap', 'grid', 'vertical-scroll']) bt.classList.toggle('row-' + m, rowLayout === m);
            for (const m of ['horizontal-scroll', 'wrap', 'vertical-scroll']) cg.classList.toggle('has-row-' + m, rowLayout === m);
        }
        const visCount = parseInt(cfg.chip_area_scroll_count, 10), hasVis = Number.isFinite(visCount) && visCount > 0;
        const visKey = `${hasVis}|${visCount}|${rowLayout}`;
        if (this._prevVisKey !== visKey) {
            this._prevVisKey = visKey; bt.classList.toggle('has-visible-count', hasVis);
            if (hasVis) {
                const gapVal = (cfg.chip_area_gap || '8px').toString().trim() || '8px';
                bt.style.setProperty('--awc-chip-basis', `calc((100% - ${visCount - 1} * ${gapVal}) / ${visCount})`);
                if (rowLayout === 'vertical-scroll') {
                    bt.style.setProperty('--awc-chip-basis-v', `calc((100% - ${visCount - 1} * ${gapVal}) / ${visCount})`);
                } else {
                    bt.style.removeProperty('--awc-chip-basis-v');
                }
            } else {
                bt.style.removeProperty('--awc-chip-basis'); bt.style.removeProperty('--awc-chip-basis-v');
            }
            if (!hasVis && rowLayout === 'vertical-scroll') {
                requestAnimationFrame(() => this._computeVerticalVisHeight());
            } else if (rowLayout !== 'vertical-scroll' || hasVis) {
                bt.style.removeProperty('--awc-row-max-height');
            }
        }
        const hasSeparator = cfg.chip_area_separator === true;
        const groupedKey = `${isGrouped}|${showBottomBg}|${bgStyle}|${hasSeparator}`;
        if (this._prevGrouped !== groupedKey) {
            this._prevGrouped = groupedKey; cg.classList.toggle('grouped', isGrouped); bt.classList.toggle('has-separator', hasSeparator);
            if (isGrouped && showBottomBg) {
                cg.classList.add('with-bg');
                for (const s of ['contrast', 'frosted', 'theme']) cg.classList.toggle(s, bgStyle === s);
            } else {
                cg.classList.remove('with-bg', 'contrast', 'frosted', 'theme');
            }
        }
        const fullWidth = cfg.chip_area_full_width === true;
        if (this._prevFullWidth !== fullWidth) {
            this._prevFullWidth = fullWidth; bt.classList.toggle('full-width', fullWidth);
        }
        const align = (cfg.chip_area_align || 'start').toString().toLowerCase();
        if (this._prevChipAlign !== align) {
            this._prevChipAlign = align;
            for (const a of ['start', 'center', 'end', 'spread']) bt.classList.toggle(`align-${a}`, align === a);
        }
    }
    _patchRowChipsIncremental(container, rowChips) {
        const nextSigs = rowChips.map((r) => r.sig);
        const prevSigs = this._lastRowSigs;
        const canPatch = Array.isArray(prevSigs)
            && prevSigs.length === nextSigs.length
            && container.children.length === nextSigs.length;
        if (!canPatch) {
            container.innerHTML = rowChips.map((r) => r.html).join('');
            this._lastRowSigs = nextSigs;
            return true;
        }
        let changed = false;
        for (let i = 0; i < nextSigs.length; i++) {
            if (prevSigs[i] === nextSigs[i]) continue;
            const tpl = document.createElement('template');
            tpl.innerHTML = rowChips[i].html;
            const nextEl = tpl.content.firstElementChild;
            const prevEl = container.children[i];
            if (!nextEl || !prevEl) {
                container.innerHTML = rowChips.map((r) => r.html).join('');
                this._lastRowSigs = nextSigs;
                return true;
            }
            container.replaceChild(nextEl, prevEl);
            changed = true;
        }
        this._lastRowSigs = nextSigs;
        return changed;
    }
    _updateTextElements(hass, wEntity, lang, weatherState = 'default') {
        if (!wEntity) return; if (!this._elements || !this._elements.chipsRow) return; this._applyConfigStyles();
        const cfg = this._config, showBottomBg = cfg.chip_area_background === true;
        const bgStyle = ['contrast', 'frosted', 'theme'].includes((cfg.card_background_style || '').toLowerCase()) ? cfg.card_background_style.toLowerCase() : 'frosted';
        const chipFormatRaw = (cfg.chip_style || 'inline').toLowerCase();
        const chipFormat = chipFormatRaw === 'stacked' ? 'stacked' : chipFormatRaw === 'vertical' ? 'vertical' : 'inline';
        let rowLayout = (cfg.chip_area_layout || 'wrap').toString().toLowerCase();
        const visCount = parseInt(cfg.chip_area_scroll_count, 10), hasVis = Number.isFinite(visCount) && visCount > 0, bt = this._elements.chipsRow;
        if (this._numFmtLang !== lang) {
            this._numFmtLang = lang;
            this._numFmt = new Intl.NumberFormat(lang, { maximumFractionDigits: 1, minimumFractionDigits: 0 });
        }
        const rendered = this._chips.map((chip, idx) =>
            this._renderChip(chip, idx, hass, weatherState, lang, showBottomBg, bgStyle, chipFormat)
        );
        const rowChips = rendered.filter(r => !r.isFree), freeChips = rendered.filter(r => r.isFree), rowSig = rowChips.map(r => r.sig).join('§');
        const rowRebuilt = this._lastLocStr !== rowSig;
        if (rowRebuilt) {
            this._lastLocStr = rowSig;
            this._patchRowChipsIncremental(bt, rowChips);
            this._animateRings(bt);
            const hasEnhanced = rowChips.some(r => r.html.includes('format-stacked') || r.html.includes('format-vertical'));
            bt.classList.toggle('has-enhanced-child', hasEnhanced);
            if (!hasVis && rowLayout === 'vertical-scroll') { requestAnimationFrame(() => this._computeVerticalVisHeight()); }
            this._nativeIconCache = null;
        }
        if (rowLayout !== 'vertical-scroll' || hasVis) {
            if (this._prevHadVertVis) { bt.style.removeProperty('--awc-row-max-height'); this._prevHadVertVis = false; }
        } else {
            this._prevHadVertVis = true;
        }
        const freeSig = freeChips.map(r => r.sig).join('§'), freeRebuilt = this._lastFreeSig !== freeSig;
        if (freeRebuilt) {
            this._lastFreeSig = freeSig; const tw = this._elements.textWrapper; tw.querySelectorAll('.chip-free').forEach(el => el.remove());
            for (const r of freeChips) {
                const wrapper = document.createElement('div'); wrapper.className = r.isBehind ? 'chip-free behind' : 'chip-free';
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
                this._animateRings(wrapper, 'f');
                wrapper.addEventListener('click', (e) => this._handleChipClick(e)); tw.appendChild(wrapper);
            }
            this._nativeIconCache = null;
        }
        if (rowRebuilt || freeRebuilt) this._refreshMarqueeObservation();
        const hasNativeIcons = rendered.some(r => r.showIcon && r.iconStrategy === 'native');
        if (hasNativeIcons) {
            if (!this._nativeIconCache || rowRebuilt || freeRebuilt) {
                const allContainers = [bt, ...this._elements.textWrapper.querySelectorAll('.chip-free')];
                this._nativeIconCache = [];
                for (let i = 0; i < rendered.length; i++) {
                    const r = rendered[i]; if (!r.showIcon || r.iconStrategy !== 'native') continue;
                    for (const container of allContainers) {
                        const iconEl = container.querySelector(`.chip[data-idx="${i}"] ha-state-icon`);
                        if (iconEl) this._nativeIconCache.push({ idx: i, el: iconEl });
                    }
                }
            }
            for (let j = 0; j < this._nativeIconCache.length; j++) {
                const entry = this._nativeIconCache[j], r = rendered[entry.idx];
                if (entry.el.hass !== hass || entry.el.stateObj !== r.sensorObj) {
                    entry.el.hass = hass; entry.el.stateObj = r.sensorObj;
                }
            }
        }
        const chipsPos = this._resolveChipPosition();
        if (this._prevPosSig !== chipsPos) {
            this._prevPosSig = chipsPos; const bt2 = this._elements.chipsRow; const cg2 = this._elements.chipsGroup;
            bt2.classList.remove(...POS_CLASSES); cg2.classList.remove(...POS_CLASSES);
            bt2.classList.add(`pos-${chipsPos}`);
            cg2.classList.add(`pos-${chipsPos}`);
        }
        if (this._elements && this._elements.customCardsWrapper) {
            const ccPos = (this._config.custom_cards_position || '').toLowerCase().trim();
            const ccSig = `${ccPos}|${chipsPos}`;
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
                    ccw.classList.add('cc-align-bottom'); const chipsIsLeft = chipsPos.includes('left'); const chipsIsRight = chipsPos.includes('right');
                    ccw.classList.add(chipsIsLeft ? 'cc-text-right' : chipsIsRight ? 'cc-text-left' : 'cc-text-hcenter');
                }
            }
        }
    }
    _animateRings(container, prefix) {
        if (!this._ringPrevPct) this._ringPrevPct = new Map();
        const pfx = prefix || '';
        for (const wrap of container.querySelectorAll('.chip-ring-wrap')) {
            const key = pfx + wrap.dataset.idx;
            const target = (wrap.style.getPropertyValue('--awc-ring-pct') || '0%').trim();
            const prev = this._ringPrevPct.get(key);
            wrap.style.setProperty('--awc-ring-pct', prev !== undefined ? prev : '0%');
            requestAnimationFrame(() => { wrap.style.setProperty('--awc-ring-pct', target); });
            this._ringPrevPct.set(key, target);
        }
        for (const fill of container.querySelectorAll('.chip-bar-fill')) {
            const key = 'b' + pfx + fill.dataset.barIdx;
            const target = (fill.style.getPropertyValue('--awc-bar-scale') || '0').trim();
            const prev = this._ringPrevPct.get(key);
            fill.style.setProperty('--awc-bar-scale', prev !== undefined ? prev : '0');
            requestAnimationFrame(() => { fill.style.setProperty('--awc-bar-scale', target); });
            this._ringPrevPct.set(key, target);
        }
    }
    _renderChip(chip, idx, hass, weatherState, lang, rowBg, bgStyle, chipFormat) {
        if (!chip.entity) return { html: '', sig: `skip-${idx}`, sensorObj: null, iconStrategy: 'static', showIcon: false, isFree: false, posAnchor: '', posX: '0', posY: '0' };
        const showIcon = chip.hide_icon !== true, showLabel = chip.hide_label !== true, showValue = chip.hide_value !== true;
        const effectiveFormatRaw = (chip.style ? chip.style : chipFormat).toString().toLowerCase().trim();
        const effectiveFormat = ['inline', 'stacked', 'vertical'].includes(effectiveFormatRaw) ? effectiveFormatRaw : 'inline';
        const isEnhanced = effectiveFormat === 'stacked' || effectiveFormat === 'vertical';
        const isRingType = chip.type === 'ring';
        let sensorObj = null, iconStrategy = 'static', iconValue = 'mdi:information-outline', formatted, unit;
        const isForecast = !!chip.forecast; let fcCondition = null, fcDatetime = null, fcLoading = false, fcEntry = null;
        if (isForecast) {
            const fc = this._resolveFcValue(hass, chip, lang);
            formatted = fc.formatted; unit = fc.unit; fcCondition = fc.condition; fcDatetime = fc.datetime;
            fcLoading = !!fc.loading; fcEntry = fc.entry || null;
            iconValue = fcCondition ? (WEATHER_ICONS[fcCondition] || WEATHER_ICONS['default']) : iconValue;
            if (chip.attribute && chip.attribute !== 'condition') iconValue = FORECAST_ATTR_ICONS[chip.attribute] || iconValue;
        } else {
            const resolved = this._resolveSensorValue(hass, chip.entity, chip.attribute);
            formatted = resolved.formatted; unit = resolved.unit;
            if (resolved.haFormatted && chip.unit_format !== undefined && resolved.rawNumeric != null) {
                const rawVal = resolved.rawNumeric;
                const isNum = rawVal !== '' && !isNaN(parseFloat(rawVal)) && isFinite(rawVal);
                if (isNum) formatted = this._numFmt ? this._numFmt.format(rawVal) : String(rawVal);
            }
            const sensor = hass.states[chip.entity];
            if (sensor) { if (chip.attribute) iconValue = WEATHER_ATTR_ICONS[chip.attribute] || 'mdi:information-outline'; else { sensorObj = sensor; iconStrategy = 'native'; } }
        }
        const configIcon = chip.icon, configPath = chip.icon_path;
        if (configIcon) {
            const resolvedBase = (configIcon === 'weather') ? (isForecast && fcCondition ? fcCondition : weatherState) : configIcon;
            if (configPath) {
                iconStrategy = 'image';
                const basePath = configPath.endsWith('/') ? configPath : configPath + '/';
                const ext = resolvedBase.includes('.') ? '' : '.svg';
                iconValue = `${basePath}${resolvedBase}${ext}`;
            } else {
                iconStrategy = 'static';
                iconValue = (configIcon === 'weather') ? (WEATHER_ICONS[resolvedBase] || WEATHER_ICONS['default']) : configIcon;
            }
        }
        const hasUnitFormat = chip.unit_format !== undefined; if (hasUnitFormat) unit = chip.unit_format;
        const overflowRaw = (chip.overflow || 'ellipsis').toString().toLowerCase().trim();
        const labelOverflowRaw = (chip.label_overflow || 'ellipsis').toString().toLowerCase().trim();
        const overflowMode = ['ellipsis', 'marquee', 'clip', 'wrap'].includes(overflowRaw) ? overflowRaw : 'ellipsis';
        const labelOverflow = ['ellipsis', 'marquee', 'clip', 'wrap'].includes(labelOverflowRaw) ? labelOverflowRaw : 'ellipsis';
        const isValueMarquee = overflowMode === 'marquee', isLabelMarquee = labelOverflow === 'marquee';
        const subOverflowRaw = (chip.sub_value_overflow || 'ellipsis').toString().toLowerCase().trim();
        const subOverflow = ['ellipsis', 'marquee', 'clip', 'wrap'].includes(subOverflowRaw) ? subOverflowRaw : 'ellipsis';
        const isSubMarquee = subOverflow === 'marquee';
        const hasAnyMarquee = isValueMarquee || isLabelMarquee || isSubMarquee;
        const marqueeSpeed = Math.max(5, parseFloat(chip.marquee_speed) || 30);
        const normalizeCssSize = (v) => {
            if (v === null || v === undefined) return '';
            const raw = String(v).trim();
            if (!raw) return '';
            if (/^-?\d+(?:\.\d+)?$/.test(raw)) return `${raw}px`;
            return raw;
        };
        const marqueeRtl = chip.marquee_rtl === true, width = normalizeCssSize(chip.width), height = normalizeCssSize(chip.height);
        let name = (chip.name || '').toString().trim(), nameSig = name;
        if (!name && !chip.name_sensor && isForecast && fcDatetime) {
            name = fcLabel(fcDatetime, chip.forecast !== 'hourly', lang);
            nameSig = `fc:${fcDatetime}`;
        }
        if (chip.name_sensor) {
            const nameResolved = this._resolveSensorValue(hass, chip.name_sensor, chip.name_attribute);
            const nameUnit = nameResolved.unit;
            name = nameUnit ? `${nameResolved.formatted} ${nameUnit}` : `${nameResolved.formatted}`;
            nameSig = `ns:${chip.name_sensor}|${chip.name_attribute || ''}|${name}`;
        } else if (isForecast && chip.name_attribute && fcEntry) {
            const nRaw = fcEntry[chip.name_attribute];
            if (nRaw != null) {
                if (nRaw !== '' && !isNaN(parseFloat(nRaw)) && isFinite(nRaw)) {
                    const _cs = hass.states[chip.entity], _w = _cs && _cs.attributes;
                    const nUnit = (_w && _w[`${chip.name_attribute}_unit`]) || (_FC_UNIT_MAP[chip.name_attribute] && _w && _w[_FC_UNIT_MAP[chip.name_attribute]]) || _FC_UNIT_FALLBACK[chip.name_attribute] || '';
                    const nFmt = this._numFmt ? this._numFmt.format(nRaw) : String(nRaw);
                    name = nUnit ? `${nFmt} ${nUnit}` : `${nFmt}`;
                } else { name = String(nRaw); }
                nameSig = `ns-fc:${chip.name_attribute}|${name}`;
            }
        }
        const showSubValue = chip.hide_sub_value !== true && (chip.sub_value_entity || chip.sub_value_attribute);
        let subValue = '', subValueSig = '';
        if (showSubValue) {
            const hasSubFormat = chip.sub_value_format !== undefined;
            if (chip.sub_value_entity) {
                const svResolved = this._resolveSensorValue(hass, chip.sub_value_entity, chip.sub_value_attribute);
                const svUnit = hasSubFormat ? chip.sub_value_format : svResolved.unit;
                subValue = hasSubFormat ? `${svResolved.formatted}${svUnit}` : (svUnit ? `${svResolved.formatted} ${svUnit}` : `${svResolved.formatted}`);
                subValueSig = `sv:${chip.sub_value_entity}|${chip.sub_value_attribute || ''}|${subValue}`;
            } else if (isForecast && chip.sub_value_attribute && fcEntry) {
                const svRaw = fcEntry[chip.sub_value_attribute];
                if (svRaw != null) {
                    let svFmt = svRaw;
                    if (svRaw !== '' && !isNaN(parseFloat(svRaw)) && isFinite(svRaw)) {
                        const precision = chip.forecast_precision;
                        const fmt = (precision !== undefined && precision !== null)
                            ? this._getFcFmt(lang, precision) : this._numFmt;
                        if (fmt) svFmt = fmt.format(svRaw);
                    }
                    if (hasSubFormat) {
                        subValue = `${svFmt}${chip.sub_value_format}`;
                    } else {
                        const _chipState = hass.states[chip.entity];
                        const w = _chipState && _chipState.attributes;
                        const svUnit = (w && w[`${chip.sub_value_attribute}_unit`]) || (_FC_UNIT_MAP[chip.sub_value_attribute] && w && w[_FC_UNIT_MAP[chip.sub_value_attribute]]) || _FC_UNIT_FALLBACK[chip.sub_value_attribute] || '';
                        subValue = svUnit ? `${svFmt} ${svUnit}` : `${svFmt}`;
                    }
                    subValueSig = `sv-fc:${chip.sub_value_attribute}|${subValue}`;
                }
            }
        }
        const subValueBeside = chip.sub_value_position === 'beside';
        let iconHtml = '';
        const safeIconValue = escapeHtmlAttr(iconValue);
        if (showIcon) {
            let inner;
            if (iconStrategy === 'native') {
                inner = '<ha-state-icon></ha-state-icon>';
            } else if (iconStrategy === 'image') {
                inner = `<img src="${safeIconValue}" class="custom-bottom-icon" />`;
            } else {
                inner = `<ha-icon icon="${safeIconValue}"></ha-icon>`;
            }
            iconHtml = `<span class="chip-icon">${inner}</span>`;
        }
        const safeName = escapeHtml(name);
        const nameHtml = showLabel && (name || isEnhanced)
            ? (isLabelMarquee
                ? `<span class="chip-name awc-marquee-host" data-speed="${marqueeSpeed}" data-rtl="${marqueeRtl ? 1 : 0}"><span class="awc-marquee-track"><span class="awc-marquee-text">${safeName}</span></span></span>`
                : `<span class="chip-name">${safeName}</span>`)
            : '';
        const useFancyUnit = !isForecast && chip.fancy_unit === true && (!chip.attribute || chip.attribute === 'temperature'); let inner;
        const safeFormatted = escapeHtml(formatted);
        const safeUnit = escapeHtml(unit);
        const safeSubValue = escapeHtml(subValue);
        if (useFancyUnit) {
            const sensor = hass.states[chip.entity];
            const isWeather = sensor && sensor.attributes && sensor.attributes.temperature !== undefined;
            const rawTemp = isWeather ? sensor.attributes.temperature : (sensor && sensor.state);
            const rawUnit = isWeather ? (sensor.attributes.temperature_unit || '') : (sensor && sensor.attributes && sensor.attributes.unit_of_measurement || '');
            const fancyVal = (rawTemp != null && this._numFmt) ? this._numFmt.format(rawTemp) : (rawTemp != null ? rawTemp : formatted);
            const fancyUnitStr = hasUnitFormat ? unit : rawUnit;
            inner = `${escapeHtml(fancyVal)}<span class="fancy-unit">${escapeHtml(fancyUnitStr)}</span>`;
        } else {
            inner = hasUnitFormat ? `${safeFormatted}${safeUnit}` : (unit ? `${safeFormatted} ${safeUnit}` : `${safeFormatted}`);
        }
        if (subValue && subValueBeside) {
            inner = `${safeSubValue} - ${inner}`;
        }
        let subBelowHtml = '';
        if (showValue && subValue && !subValueBeside) {
            if (isSubMarquee) {
                subBelowHtml = `<span class="chip-sub awc-marquee-host" data-speed="${marqueeSpeed}" data-rtl="${marqueeRtl ? 1 : 0}"><span class="awc-marquee-track"><span class="awc-marquee-text">${safeSubValue}</span></span></span>`;
            } else {
                subBelowHtml = `<span class="chip-sub">${safeSubValue}</span>`;
            }
        }
        const valHtml = !showValue ? ''
            : isValueMarquee
            ? `<span class="chip-val awc-marquee-host" data-speed="${marqueeSpeed}" data-rtl="${marqueeRtl ? 1 : 0}"><span class="awc-marquee-track"><span class="awc-marquee-text">${inner}</span></span></span>`
            : `<span class="chip-val">${inner}${subBelowHtml}</span>`;
        const isFree = (chip.position || '').toString().toLowerCase() === 'custom';
        const posAnchor = isFree ? (chip.position_anchor || 'top-left') : '', posX = isFree ? String(chip.position_x || 0).trim() : '0';
        const posY = isFree ? String(chip.position_y || 0).trim() : '0';
        const effectiveBg = chip.background !== undefined ? chip.background : rowBg;
        const classes = ['chip', `overflow-${overflowMode}`];
        if (hasAnyMarquee) {
            classes.push('overflow-marquee'); if (isLabelMarquee && isValueMarquee) classes.push('marquee-both');
            else if (isLabelMarquee) classes.push('marquee-label');
            else if (isValueMarquee) classes.push('marquee-value');
        }
        if (fcLoading) classes.push('chip-loading');
        if (subValue && !subValueBeside && showValue) classes.push('has-sub');
        if (!showIcon) classes.push('no-icon');
        if (!nameHtml) classes.push('no-name');
        else if (isEnhanced && !name) classes.push('empty-name');
        if (!showLabel && !showValue) classes.push('icon-only'); if (effectiveFormat === 'stacked') classes.push('format-stacked');
        else if (effectiveFormat === 'vertical') classes.push('format-vertical');
        if (isRingType) classes.push('chip-ring');
        const iconBg = chip.icon_background !== undefined ? chip.icon_background : this._config.chip_icon_background;
        if (iconBg === true) classes.push('has-icon-bg');
        else if (iconBg === false) classes.push('no-icon-bg');
        if (effectiveBg) {
            classes.push('with-bg');
            if (bgStyle === 'contrast' || bgStyle === 'frosted' || bgStyle === 'theme') classes.push(bgStyle);
        } else if (iconBg === true || (iconBg !== false && this._config.chip_icon_background === true)) {
            if (bgStyle === 'contrast' || bgStyle === 'frosted' || bgStyle === 'theme') classes.push(bgStyle);
        }
        const effectiveBgColor = chip.background_color || this._config.chip_background_color || '';
        const effectiveIconBgColor = chip.icon_background_color || this._config.chip_icon_background_color || '';
        const inlineStyles = [];
        if (width && !isFree) { inlineStyles.push(`width:${width};max-width:${width}`); }
        if (width && isFree) { inlineStyles.push(`width:100%;max-width:100%`); }
        if (height) { inlineStyles.push(`height:${height}`); }
        if (effectiveBgColor) inlineStyles.push(`--awc-bottom-bg-color:${effectiveBgColor}`);
        if (effectiveIconBgColor) inlineStyles.push(`--awc-stacked-icon-bg:${effectiveIconBgColor}`);
        if (chip.padding !== undefined && chip.padding !== '') inlineStyles.push(`padding:${chip.padding}`);
        if (chip.text_size) inlineStyles.push(`font-size:${chip.text_size};--awc-bottom-font-size:${chip.text_size}`);
        if (chip.label_size) inlineStyles.push(`--awc-chip-name-font-size:${chip.label_size}`);
        if (chip.inner_gap) inlineStyles.push(`--awc-chip-gap:${chip.inner_gap}`);
        if (chip.text_gap) inlineStyles.push(`--awc-chip-text-gap:${chip.text_gap}`);
        if (chip.icon_size) inlineStyles.push(`--awc-icon-size:${chip.icon_size}`);
        if (chip.icon_padding) inlineStyles.push(`--awc-icon-padding:${chip.icon_padding}`);
        if (chip.value_weight) inlineStyles.push(`--awc-chip-value-weight:${chip.value_weight};--awc-stacked-value-weight:${chip.value_weight}`);
        if (chip.label_weight) inlineStyles.push(`--awc-chip-name-weight:${chip.label_weight}`);
        if (chip.sub_value_size) inlineStyles.push(`--awc-sub-size:${chip.sub_value_size}`);
        if (chip.sub_value_weight) inlineStyles.push(`--awc-sub-weight:${chip.sub_value_weight}`);
        if (subOverflow === 'clip') inlineStyles.push('--awc-sub-overflow:clip');
        else if (subOverflow === 'wrap') inlineStyles.push('--awc-sub-overflow:clip;--awc-sub-wrap:normal;--awc-sub-visible:visible');
        const isBarType = chip.type === 'bar';
        let gaugeVal = parseFloat(formatted), gaugeSig = '';
        if ((isRingType || isBarType) && chip.gauge_entity) {
            const gr = this._resolveSensorValue(hass, chip.gauge_entity, chip.gauge_attribute);
            gaugeVal = parseFloat(gr.rawNumeric != null ? gr.rawNumeric : gr.formatted);
            gaugeSig = `${chip.gauge_entity}|${chip.gauge_attribute || ''}|${gaugeVal}`;
        } else if ((isRingType || isBarType) && !chip.gauge_entity && isForecast && chip.gauge_attribute && fcEntry) {
            const gRaw = fcEntry[chip.gauge_attribute];
            if (gRaw != null) gaugeVal = parseFloat(gRaw);
            gaugeSig = `fc-g:${chip.gauge_attribute}|${gaugeVal}`;
        }
        let ringHtml = '', ringWrapStyle = '', hasSegments = false, barHtml = '';
        if (isRingType) {
            const ringMin = parseFloat(chip.ring_min) || 0, ringMax = parseFloat(chip.ring_max) || 100;
            const ringW = parseFloat(chip.ring_width) || 4, ringGap = parseFloat(chip.ring_gap) || 3;
            const g = computeGauge(gaugeVal, ringMin, ringMax, (chip.ring_color || '').trim(), Array.isArray(chip.ring_thresholds) ? chip.ring_thresholds : [], chip.ring_threshold_mode || 'solid');
            hasSegments = g.hasSegments;
            ringHtml = '<div class="chip-ring-track"></div>';
            const styleParts = [`--awc-ring-pct:${g.pct}%`, `--awc-ring-w:${ringW}px`, `--awc-ring-gap:${ringGap}px`];
            if (g.gradient) styleParts.push(`--awc-ring-gradient:conic-gradient(${g.gradient})`);
            else if (g.effectiveColor) styleParts.push(`--awc-ring-color:${g.effectiveColor}`);
            ringWrapStyle = styleParts.join(';');
        }
        if (isBarType) {
            const barMin = parseFloat(chip.bar_min) || 0, barMax = parseFloat(chip.bar_max) || 100;
            const barH = parseFloat(chip.bar_height) || 4, barGap = parseFloat(chip.bar_gap) || 4;
            const g = computeGauge(gaugeVal, barMin, barMax, (chip.bar_color || '').trim(), Array.isArray(chip.bar_thresholds) ? chip.bar_thresholds : [], chip.bar_threshold_mode || 'solid');
            classes.push('chip-bar-type');
            const scale = (parseFloat(g.pct) / 100).toFixed(4);
            const fillStyles = [`--awc-bar-scale:${scale}`];
            if (g.barGradient) fillStyles.push(`--awc-bar-gradient:linear-gradient(to right, ${g.barGradient})`);
            else if (g.effectiveColor) fillStyles.push(`--awc-bar-color:${g.effectiveColor}`);
            barHtml = `<div class="chip-bar" style="--awc-bar-h:${barH}px;--awc-bar-gap:${barGap}px"><div class="chip-bar-track"></div><div class="chip-bar-fill" data-bar-idx="${idx}" style="${fillStyles.join(';')}"></div></div>`;
        }
        const chipAlignRaw = (chip.align || '').toString().toLowerCase().trim();
        const chipAlignClass = ['start', 'center', 'end', 'spread'].includes(chipAlignRaw) ? chipAlignRaw : '';
        if (chipAlignClass) classes.push(`align-${chipAlignClass}`);
        const isBehind = chip.behind_effects === true; if (isBehind) classes.push('behind');
        if (chip.chip_round === true) classes.push('chip-round');
        const style = inlineStyles.length ? ` style="${escapeHtmlAttr(inlineStyles.join(';'))}"` : '';
        const loaderHtml = fcLoading ? '<div class="chip-loader"><span></span><span></span><span></span></div>' : '';
        let chipHtml = `<div class="${classes.join(' ')}" data-idx="${idx}"${style}>${loaderHtml}${iconHtml}${nameHtml}${valHtml}${barHtml}</div>`;
        if (isRingType) {
            chipHtml = `<div class="chip-ring-wrap${hasSegments ? ' has-segments' : ''}${fcLoading ? ' chip-loading' : ''}" data-idx="${idx}" style="${escapeHtmlAttr(ringWrapStyle)}">${ringHtml}${chipHtml}</div>`;
        }
        const sig = `${idx}|${formatted}|${unit}|${iconValue}|${iconStrategy}|${showIcon}|${showLabel}|${showValue}|${overflowMode}|${labelOverflow}|${marqueeSpeed}|${marqueeRtl}|${width}|${height}|${nameSig}|${effectiveBg}|${bgStyle}|${effectiveFormat}|${iconBg != null ? iconBg : ''}|${isFree}|${posAnchor}|${posX}|${posY}|${effectiveBgColor}|${effectiveIconBgColor}|${chip.padding != null ? chip.padding : ''}|${chip.text_size || ''}|${chip.label_size || ''}|${chip.inner_gap || ''}|${chip.text_gap || ''}|${chip.icon_size || ''}|${chip.icon_padding || ''}|${chipAlignClass}|${subValueSig}|${chip.sub_value_position || ''}|${chip.sub_value_format != null ? chip.sub_value_format : ''}|${chip.sub_value_size || ''}|${chip.sub_value_weight || ''}|${chip.sub_value_overflow || ''}|${chip.hide_sub_value || ''}|${isBehind}|${useFancyUnit}|${chip.value_weight || ''}|${chip.label_weight || ''}|${chip.chip_round || ''}|${chip.type || ''}|${chip.ring_min != null ? chip.ring_min : ''}|${chip.ring_max != null ? chip.ring_max : ''}|${chip.ring_color || ''}|${chip.ring_width || ''}|${chip.ring_gap || ''}|${chip.ring_threshold_mode || ''}|${JSON.stringify(chip.ring_thresholds || '')}|${chip.bar_min != null ? chip.bar_min : ''}|${chip.bar_max != null ? chip.bar_max : ''}|${chip.bar_color || ''}|${chip.bar_height || ''}|${chip.bar_gap || ''}|${chip.bar_threshold_mode || ''}|${JSON.stringify(chip.bar_thresholds || '')}|${gaugeSig}`;
        return { html: chipHtml, sig, sensorObj, iconStrategy, showIcon, isFree, isBehind, posAnchor, posX, posY, width };
    }
    _updateImage(hass, isNight, weatherState = 'default') {
        if (!this._elements || !this._elements.img || !this._elements.imageSlot) return; const img = this._elements.img; const slot = this._elements.imageSlot;
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
    _refreshMarqueeObservation() {
        if (!this._marqueeObserver) {
            this._marqueeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    entry.target.querySelectorAll('.awc-marquee-host')
                        .forEach(host => this._measureMarqueeOne(host));
                }
            });
        }
        this._marqueeObserver.disconnect(); const bt = this._elements && this._elements.chipsRow;
        if (bt) {
            bt.querySelectorAll('.chip.overflow-marquee')
              .forEach(chip => this._marqueeObserver.observe(chip));
        }
        const tw = this._elements && this._elements.textWrapper;
        if (tw) {
            tw.querySelectorAll('.chip-free .chip.overflow-marquee')
              .forEach(chip => this._marqueeObserver.observe(chip));
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
    _computeVerticalVisHeight() {
        const bt = this._elements && this._elements.chipsRow; if (!bt || !bt.children.length) return; const visCount = parseInt(this._config.chip_area_scroll_count, 10);
        if (!Number.isFinite(visCount) || visCount < 1) return; const firstChip = bt.children[0]; if (!firstChip || firstChip.offsetHeight < 1) return;
        const gap = parseFloat(getComputedStyle(bt).gap) || 8;
        bt.style.setProperty('--awc-row-max-height', `${firstChip.offsetHeight * visCount + gap * (visCount - 1)}px`);
    }
    // VISIBILITY, EVENTS & INITIALIZATION
    _handleVisibilityChange(entries) {
        const entry = entries[0], wasVisible = this._isVisible;
        this._isVisible = entry.isIntersecting;
        if (this._elements && this._elements.root) this._elements.root.classList.toggle('is-offscreen', !this._isVisible);
        if (this._isVisible && !wasVisible) {
            if (this._needsReinit) {
                this._needsReinit = false; this._initParticles(); if (this._width > 0) this._lastInitWidth = this._width;
            }
            this._startAnimation();
        } else if (!this._isVisible && wasVisible) {
            this._stopAnimation();
        }
    }
    _handleTap(e) {
        e.stopPropagation(); const cfg = this._config;
        const event = new CustomEvent('hass-action', {
            bubbles: true,
            composed: true,
            detail: {
                config: { entity: cfg.weather_entity, tap_action: cfg.card_tap_action },
                action: 'tap',
            },
        });
        this.dispatchEvent(event);
    }
    _handleChipClick(e) {
        const chipEl = e.target.closest('.chip'); if (!chipEl) return; const idx = parseInt(chipEl.dataset.idx, 10);
        const chip = this._chips && this._chips[idx]; if (!chip || !chip.entity) return; e.stopPropagation();
        const tapAction = chip.tap_action || { action: 'more-info' };
        const event = new CustomEvent('hass-action', {
            bubbles: true,
            composed: true,
            detail: {
                config: { entity: chip.entity, tap_action: tapAction },
                action: 'tap',
            },
        });
        this.dispatchEvent(event);
    }
    _tryInitialize() {
        if (this._initializationComplete) return; if (!this._renderGate.hasFirstHass) return; if (!this._renderGate.hasValidDimensions) return;
        if (!this._cachedDimensions.width || !this._cachedDimensions.height) return;
        this._initializationComplete = true; const w = this._cachedDimensions.width / this._cachedDimensions.dpr;
        const h = this._cachedDimensions.height / this._cachedDimensions.dpr; this._width = w; this._lastInitWidth = w;
        requestAnimationFrame(() => {
            if (!this.isConnected) return; this._initParticles(w, h); this._checkRenderGate();
        });
    }
    _updateCanvasDimensions(forceW = null, forceH = null) {
        if (!this._elements || !this._elements.root || !this._ctxs) return false;
        if (this._config.card_square && forceW === null) {
            const currentW = this._elements.root.clientWidth;
            if (currentW > 0 && Math.abs(this.clientHeight - currentW) > 1) this.style.height = `${currentW}px`;
        }
        let scaledWidth, scaledHeight, dpr, rawW = forceW !== null ? forceW : this._elements.root.clientWidth;
        let rawH = forceH !== null ? forceH : this._elements.root.clientHeight;
        if (rawW === 0 || rawH === 0) return false;
        dpr = Math.min(window.devicePixelRatio || 1, this._perfDpr);
        scaledWidth = rawW * dpr; scaledHeight = rawH * dpr; const totalPixels = scaledWidth * scaledHeight;
        if (totalPixels > PERFORMANCE_CONFIG.MAX_PIXELS) {
            const scaleDown = Math.sqrt(PERFORMANCE_CONFIG.MAX_PIXELS / totalPixels);
            scaledWidth *= scaleDown; scaledHeight *= scaleDown;
            dpr *= scaleDown; // Lowers internal render res while keeping physical CSS size accurate
        }
        scaledWidth = Math.floor(scaledWidth); scaledHeight = Math.floor(scaledHeight);
        const widthChanged = this._cachedDimensions.width !== scaledWidth, dprChanged = this._cachedDimensions.dpr !== dpr;
        const heightDiff = Math.abs(this._cachedDimensions.height - scaledHeight);
        if (!widthChanged && !dprChanged && heightDiff < 150 * dpr) return false;
        this._cachedDimensions = { width: scaledWidth, height: scaledHeight, dpr };
        for (const k of ['bg', 'mid', 'fg']) {
            const canvas = this._elements[k], ctx = this._ctxs[k];
            if (!canvas || !ctx || (canvas.width === scaledWidth && canvas.height === scaledHeight)) continue;
            canvas.width = scaledWidth; canvas.height = scaledHeight;
            canvas.style.width = `${forceW !== null ? forceW : scaledWidth / dpr}px`;
            canvas.style.height = `${forceH !== null ? forceH : scaledHeight / dpr}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr); ctx.imageSmoothingQuality = 'high';
        }
        if (scaledWidth > 0 && scaledHeight > 0) {
            const cssW = scaledWidth / dpr, cssH = scaledHeight / dpr, celestial = this._getCelestialPosition(cssW, cssH);
            const dx2 = Math.max(celestial.x, cssW - celestial.x), dy2 = Math.max(celestial.y, cssH - celestial.y);
            const glowRadius = Math.ceil(Math.sqrt(dx2 * dx2 + dy2 * dy2) * 0.3);
            this._elements.root.style.setProperty('--c-x', `${celestial.x}px`);
            this._elements.root.style.setProperty('--c-y', `${celestial.y}px`);
            this._elements.root.style.setProperty('--c-r', `${glowRadius}px`);
            this._renderGate.hasValidDimensions = true; this._checkRenderGate();
        }
        return true;
    }
    _scheduleParticleReinit() {
        this._pendingResize = true;
        if (this._resizeDebounceTimer) clearTimeout(this._resizeDebounceTimer);
        this._resizeDebounceTimer = setTimeout(() => {
            this._resizeDebounceTimer = null;
            if (this._lastInitWidth > 0 && this._cachedDimensions.width > 0) {
                const currentCSSWidth = this._cachedDimensions.width / this._cachedDimensions.dpr;
                const diff = Math.abs(currentCSSWidth - this._lastInitWidth);
                if (diff < 100) {
                    this._pendingResize = false;
                    return;
                }
            }
            if (this._pendingResize && this._stateInitialized) {
                this._pendingResize = false;
                if (this._elements && this._elements.root) this._lastInitWidth = this._elements.root.clientWidth;
                this._initParticles();
            }
        }, PERFORMANCE_CONFIG.RESIZE_DEBOUNCE_MS);
    }
    _checkRenderGate() {
        if (this._renderGate.isRevealed) return;
        const canReveal =
            this._renderGate.hasValidDimensions &&
            this._renderGate.hasFirstHass &&
            this._stateInitialized;
        if (canReveal) {
            this._renderGate.isRevealed = true;
            requestAnimationFrame(() => {
                if (this._elements && this._elements.root) this._elements.root.classList.add('revealed');
            });
        }
    }
    // TEXTURE BUILDING
    _buildTextures() {
        const isLight = this._isLightBackground, rs = this._renderState;
        if (!rs) return;
        // --- Rain sprite (64x4 gradient streak) ---
        const rainRgb = rs.rainRgb;
        if (!this._rainTex || this._rainTexRgb !== rainRgb) {
            this._rainTexRgb = rainRgb; const rc = document.createElement('canvas'); rc.width = 64; rc.height = 4;
            const rCtx = rc.getContext('2d', { willReadFrequently: false });
            const g = rCtx.createLinearGradient(64, 0, 0, 0);
            g.addColorStop(0,   `rgba(${rainRgb}, 0.85)`);
            g.addColorStop(0.5, `rgba(${rainRgb}, 0.2)`);
            g.addColorStop(1,   `rgba(${rainRgb}, 0)`);
            rCtx.fillStyle = g; rCtx.fillRect(0, 0, 64, 4); this._rainTex = rc;
        }
        // --- Snow sprites (foreground 32x32, background 16x16) ---
        if (!this._snowTexFg || this._snowTexLight !== isLight) {
            this._snowTexLight = isLight; const sf = document.createElement('canvas'); sf.width = 32; sf.height = 32;
            const sfCtx = sf.getContext('2d', { willReadFrequently: false });
            const sg = sfCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
            if (isLight) {
                sg.addColorStop(0, 'rgba(255,255,255,1)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.786)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
            } else {
                sg.addColorStop(0, 'rgba(255,255,255,1)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.55)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
            }
            sfCtx.fillStyle = sg;
            sfCtx.beginPath(); sfCtx.arc(16, 16, 16, 0, Math.PI * 2); sfCtx.fill();
            this._snowTexFg = sf; const sb = document.createElement('canvas'); sb.width = 16; sb.height = 16;
            const sbCtx = sb.getContext('2d', { willReadFrequently: false });
            if (isLight) {
                const sbg = sbCtx.createRadialGradient(8, 8, 0, 8, 8, 8); sbg.addColorStop(0, 'rgba(255,255,255,1)'); sbg.addColorStop(1, 'rgba(255,255,255,0)');
                sbCtx.fillStyle = sbg;
            } else {
                sbCtx.fillStyle = 'rgba(255,255,255,1)';
            }
            sbCtx.beginPath(); sbCtx.arc(8, 8, 8, 0, Math.PI * 2); sbCtx.fill(); this._snowTexBg = sb;
        }
        // --- Hail sprite (32x32 hexagonal ice pellet) ---
        if (!this._hailTex || this._hailTexLight !== isLight) {
            this._hailTexLight = isLight; const hc = document.createElement('canvas'); hc.width = 32; hc.height = 32;
            const hcCtx = hc.getContext('2d', { willReadFrequently: false });
            const center = 16, size = 14;
            const iceGradient = hcCtx.createRadialGradient(center, center - size * 0.3, 0, center, center, size);
            if (isLight) {
                iceGradient.addColorStop(0, 'rgba(240,250,255,1)'); iceGradient.addColorStop(0.5, 'rgba(210,230,250,0.85)');
                iceGradient.addColorStop(1, 'rgba(170,200,240,0.5)');
            } else {
                iceGradient.addColorStop(0, 'rgba(255,255,255,1)'); iceGradient.addColorStop(0.5, 'rgba(230,245,255,0.85)');
                iceGradient.addColorStop(1, 'rgba(200,225,250,0.5)');
            }
            hcCtx.fillStyle = iceGradient; hcCtx.beginPath();
            for (let j = 0; j < 6; j++) {
                const angle = (Math.PI * 2 * j) / 6, x = center + Math.cos(angle) * size, y = center + Math.sin(angle) * size;
                if (j === 0) hcCtx.moveTo(x, y);
                else hcCtx.lineTo(x, y);
            }
            hcCtx.closePath(); hcCtx.fill(); hcCtx.fillStyle = 'rgba(255,255,255,0.6)';
            hcCtx.beginPath();
            hcCtx.arc(center - size * 0.3, center - size * 0.3, size * 0.3, 0, Math.PI * 2);
            hcCtx.fill(); this._hailTex = hc;
        }
        // --- Wind vapor sprite (128x24 streaked wisp) ---
        const isDark = this._isThemeDark, cp = rs.cp;
        const colorKey = isDark ? `${cp.litR},${cp.litG},${cp.litB}` : `${cp.midR},${cp.midG},${cp.midB}`;
        if (!this._vaporTex || this._vaporTexColor !== colorKey || this._vaporTexDark !== isDark) {
            this._vaporTexColor = colorKey; this._vaporTexDark = isDark; const vc = document.createElement('canvas');
            vc.width = 128; vc.height = 24;
            const vCtx = vc.getContext('2d', { willReadFrequently: false });
            const peakAlpha = isDark ? 0.40 : 0.55, hGrad = vCtx.createLinearGradient(0, 12, 128, 12);
            hGrad.addColorStop(0,    `rgba(${colorKey}, 0)`);
            hGrad.addColorStop(0.04, `rgba(${colorKey}, ${peakAlpha * 0.18})`);
            hGrad.addColorStop(0.10, `rgba(${colorKey}, ${peakAlpha * 0.88})`);
            hGrad.addColorStop(0.16, `rgba(${colorKey}, ${peakAlpha})`);
            hGrad.addColorStop(0.26, `rgba(${colorKey}, ${peakAlpha * 0.82})`);
            hGrad.addColorStop(0.40, `rgba(${colorKey}, ${peakAlpha * 0.52})`);
            hGrad.addColorStop(0.58, `rgba(${colorKey}, ${peakAlpha * 0.26})`);
            hGrad.addColorStop(0.76, `rgba(${colorKey}, ${peakAlpha * 0.10})`);
            hGrad.addColorStop(0.92, `rgba(${colorKey}, ${peakAlpha * 0.02})`);
            hGrad.addColorStop(1,    `rgba(${colorKey}, 0)`);
            vCtx.fillStyle = hGrad; vCtx.fillRect(0, 0, 128, 24); vCtx.globalCompositeOperation = 'destination-in';
            const vGrad = vCtx.createLinearGradient(0, 0, 0, 24); vGrad.addColorStop(0,    'rgba(255,255,255,0)');
            vGrad.addColorStop(0.30, 'rgba(255,255,255,0.75)'); vGrad.addColorStop(0.42, 'rgba(255,255,255,1)');
            vGrad.addColorStop(0.58, 'rgba(255,255,255,1)'); vGrad.addColorStop(0.70, 'rgba(255,255,255,0.75)');
            vGrad.addColorStop(1,    'rgba(255,255,255,0)'); vCtx.fillStyle = vGrad; vCtx.fillRect(0, 0, 128, 24);
            this._vaporTex = vc;
        }
    }
    // PARTICLE FACTORY
    _initParticles(forceW = null, forceH = null) {
        if (!this._elements || !this._elements.root) return; let w, h;
        if (forceW !== null && forceH !== null) {
            w = forceW; h = forceH;
        } else {
            w = this._elements.root.clientWidth; h = this._elements.root.clientHeight;
        }
        const p = this._params; if (w === 0 || h === 0 || !p) return; this._clearAllParticles();
        const fx = this._perfEffects, isUltra = fx >= 2;
        if (fx >= 1 && this._isThemeDark && this._isTimeNight && (p.type === 'stars' || p.type === 'cloud') && (p.cloud || 0) <= 5 && Math.random() < 0.04) this._initAurora(w, h);
        if (fx >= 1 && this._isNight && p.type === 'stars' && Math.random() < (isUltra ? 0.002 : 0.0011)) this._comets.push(this._createComet(w, h));
        if (this._perfFauna >= 2 && Math.random() < 0.25) this._planes.push(this._createPlane(w, h)); if (p.type === 'fog' || p.foggy) this._initFogBanks(w, h);
        if ((p.count || 0) > 0 && p.type !== 'stars' && p.type !== 'fog') this._initPrecipitation(w, h, p);
        if ((p.cloud || 0) > 0) this._initClouds(w, h, p); if (this._isNight && (p.cloud || 0) < 5) this._initNightClouds(w, h);
            const celestialDecor = !this._isNight ? p.celestial : null;
        const wantsCelestialClouds = fx >= 1 && (p.sunCloudWarm || celestialDecor
            || (this._isNight && !p.thunder && p.type !== 'hail' && p.atmosphere !== 'night'));
        if (wantsCelestialClouds) this._initCelestialClouds(w, h, p.sunCloudWarm ? null : celestialDecor);
        const starBase = (this._renderState && this._renderState.starMode !== 'hidden') ? (p.stars || 0) : 0;
        const starCount = starBase;
        if (starCount > 0) this._initStars(w, h, starCount); const ws = (this._lastState || '').toLowerCase();
        if (fx >= 1 && starCount > 150 && (ws === 'clear-night' || ws === 'sunny' || ws === 'exceptional')) { this._bakeMilkyWay(w, h); }
        const vaporFlat = p.windVapor === true || (this._windKmh || 0) >= 20;
        if (fx >= 1) this._initWindVapor(w, h, p.vapor || 24, p.vaporScale || 1.0, vaporFlat);
        this._bakeAllClouds();
    }
    _initAurora(w, h) {
        const _auroraColors = ['rgba(80, 255, 160, 0.22)', 'rgba(100, 200, 255, 0.22)', 'rgba(180, 100, 255, 0.18)', 'rgba(255, 120, 200, 0.15)'];
        this._aurora = { phase: 0, waves: Array(6).fill().map((_, i) => ({ y: h * 0.12 + i * 10, speed: 0.006 + Math.random() * 0.012, amplitude: 6 + Math.random() * 8, wavelength: 0.01 + Math.random() * 0.008, color: _auroraColors[Math.floor(Math.random() * 4)], offset: Math.random() * TWO_PI })) };
    }
    _createComet(w, h) {
        return { x: w * 0.15, y: h * 0.08, vx: -2.2 - Math.random() * 1.2, vy: 0.8 + Math.random() * 0.4, life: 1.0, tailBuf: new Float32Array(TRAIL_CAP_COMET * 2), tailHead: 0, tailLen: 0, size: 3 + Math.random() * 2 };
    }
    _createPlane(w, h) {
        const goingRight = Math.random() > 0.5, baseSpeed = 0.6 + Math.random() * 0.5, dir = goingRight ? 1 : -1;
        const climbAngle = Math.random() < 0.33 ? (1 + Math.random() * 4) * (Math.PI / 180) : 0;
        return { x: goingRight ? -100 : w + 100, y: h * 0.15 + Math.random() * (h * 0.52), vx: dir * Math.cos(climbAngle) * baseSpeed, vy: -Math.sin(climbAngle) * baseSpeed, climbAngle, scale: 0.5 + Math.random() * 0.4, blinkPhase: Math.random() * 10, histBuf: new Float32Array(TRAIL_CAP_PLANE * 3), histHead: 0, histLen: 0, gapTimer: 0, _lastRecX: -9999, _lastRecY: -9999 };
    }
    _initFogBanks(w, h) {
        for (let i = 0; i < 10; i++) {
            const layer = i / 10;
            this._fogBanks.push({ x: Math.random() * w, y: h - (Math.random() * (h * 0.7)), w: w * (1.2 + Math.random() * 0.8), h: 40 + Math.random() * 50, speed: (Math.random() * 0.15 + 0.03) * (Math.random() > 0.5 ? 1 : -1), opacity: this._isLightBackground ? (0.35 + layer * 0.2 + Math.random() * 0.1) : (0.12 + layer * 0.1 + Math.random() * 0.08), layer: layer, phase: Math.random() * TWO_PI });
        }
    }
    _initPrecipitation(w, h, p) {
        const count = p.count || 0;
        for (let i = 0; i < count; i++) {
            let type = p.type;
            if (p.type === 'mix') {
                type = Math.random() > 0.5 ? 'rain' : 'snow';
            } else if (p.type === 'hail') {
                type = Math.random() > 0.55 ? 'hail' : 'rain';
            }
            const z = 0.5 + Math.random();
            const particle = { type, x: Math.random() * w, y: Math.random() * h, z, turbulence: Math.random() * TWO_PI, _fadeIn: 1 };
            if (type === 'hail') {
                Object.assign(particle, { speedY: (12 + Math.random() * 8) * z, size: (2 + Math.random() * 2) * z, rotation: Math.random() * TWO_PI, rotationSpeed: (Math.random() - 0.5) * 0.25, op: this._isLightBackground ? 0.5 + Math.random() * 0.4 : 0.4 + Math.random() * 0.4 });
            } else if (type === 'rain') {
                Object.assign(particle, { speedY: (6 + Math.random() * 4) * z, len: (14 + Math.random() * 14) * z, op: this._isLightBackground ? 0.35 + Math.random() * 0.35 : 0.25 + Math.random() * 0.35 });
            } else {
                // Wide size variance: tiny specks to large soft flakes
                const sizeRoll = Math.random(); let flakeSize; if (sizeRoll < 0.25)      flakeSize = (0.5 + Math.random() * 0.7) * z;
                else if (sizeRoll < 0.65)  flakeSize = (1.5 + Math.random() * 1.5) * z;
                else                        flakeSize = (2.8 + Math.random() * 2.7) * z;
                Object.assign(particle, { speedY: (0.4 + Math.random() * 0.8) * z * (flakeSize / 3), size: flakeSize, wobblePhase: Math.random() * TWO_PI, wobbleSpeed: 0.02 + Math.random() * 0.02, rotation: Math.random() * TWO_PI, rotationSpeed: (Math.random() - 0.5) * 0.03, op: 0.5 + Math.random() * 0.4 });
            }
            if (particle.type === 'rain') this._rain.push(particle);
            else if (particle.type === 'snow') this._snow.push(particle);
            else if (particle.type === 'hail') this._hail.push(particle);
        }
    }
    _initClouds(w, h, p) {
        const isStandalone = !this._isImmersive;
        // Immersive dark-day has no sky layer, so clouds must cover more vertical space.
        const isDarkDayImmersive = this._isDarkDayImmersive;
        const heightLimit  = isStandalone ? 0.75 : (isDarkDayImmersive ? 0.72 : 0.55);
        const totalClouds  = p.cloud || 0; if (totalClouds <= 0) return; const configScale = p.scale || 1.0;
        const isHeavy     = totalClouds >= 18;
        const pq = Math.max(0.3, this._perfCloudQuality / 1.5);
        // Per-session size bias (~±0.13). Shifts rollLarge/rollMedium so reloads
        // yield visibly different size mixes.
        this._sessionSizeBias = (Math.random() - 0.5) * 0.26;
        // Height-proportional puff anatomy — sub-linear so short cards aren't dominated
        const REFERENCE_HEIGHT = 350;
        const baseUnit = 100 * Math.pow(Math.max(h, 80) / REFERENCE_HEIGHT, 0.7);
        // Silhouette compression — wide+flat shape, puffs stay round
        const baseVCompress = 0.55;
        // Cluster placement — fewer clusters = visible banks with open sky gaps
        const clusterCount = isHeavy ? Math.max(3, Math.floor(totalClouds / 6)) : (2 + Math.floor(Math.random() * 2));
        const clusters = [];
        for (let c = 0; c < clusterCount; c++) {
            const baseX = w * ((c + 0.5) / clusterCount);
            clusters.push({ x: baseX + (Math.random() - 0.5) * w * 0.6, y: h * (0.11 + Math.random() * (heightLimit - 0.16)), spreadX: w * (0.12 + Math.random() * 0.18), spreadY: h * (0.06 + Math.random() * 0.10), weight: 0.5 + Math.random() });
        }
        const totalWeight = clusters.reduce((sum, c) => sum + c.weight, 0);
        // Weighted cluster picker (closure reused per cloud)
        const pickCluster = () => {
            let roll = Math.random() * totalWeight;
            for (let c = 0; c < clusters.length; c++) {
                roll -= clusters[c].weight; if (roll <= 0) return clusters[c];
            }
            return clusters[clusters.length - 1];
        };
        // Approximate Gaussian via Irwin-Hall (sum of 3 uniforms)
        const gaussRand = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        // ── Filler wisps (background haze) ──
        const fillerRatio = isHeavy ? 0.12 : 0.06, fillerCount = Math.floor(totalClouds * fillerRatio);
        for (let i = 0; i < fillerCount; i++) {
            const seed = Math.random() * 10000;
            this._clouds.push({ x: Math.random() * w, y: h * (0.08 + Math.random() * (heightLimit * 0.6 - 0.08)), scale: (0.55 + Math.random() * 0.40) * configScale * 1.6, speed: 0.002 + Math.random() * 0.002, puffs: CloudShapeGenerator.generateWispyPuffs(seed, baseUnit, pq), cloudType: 'stratus', layer: 0, opacity: 0.30 + Math.random() * 0.18, seed, breathPhase: Math.random() * TWO_PI, breathSpeed: 0.001, _hStretch: 1.0, _vCompress: baseVCompress });
        }
        // ── Main clouds ──
        const mainCount  = totalClouds - fillerCount, companions = [];
        // Pick a sky composition for this session — drives variety across reloads
        const compositions = p.types || WEATHER_MAP['default'].types;
        const typePool = compositions[Math.floor(Math.random() * compositions.length)];
        for (let i = 0; i < mainCount; i++) {
            const seed  = Math.random() * 10000, type = typePool[Math.floor(Math.random() * typePool.length)];
            // ── Cluster-based X/Y with type-aware loner escape ──
            // Cumulus/cirrus have enough internal structure to stand alone.
            // Organic/stratus/storm are blobs — they need neighbors to look volumetric.
            let xPos, yPos; const hasStructure = type === 'cumulus' || type === 'cirrus';
            const lonerChance = hasStructure ? (isHeavy ? 0.40 : 0.20) : (isHeavy ? 0.12 : 0.08);
            const isLoner = Math.random() < lonerChance, cluster = pickCluster();
            if (isLoner) {
                xPos = Math.random() * w;
            } else {
                xPos = cluster.x + gaussRand() * cluster.spreadX;
            }
            let layer; const spec = CLOUD_TYPES[type] || CLOUD_TYPES.organic; layer = Math.random() < 0.5 ? spec.layers[0] : spec.layers[1];
            // Puff generation
            let puffs, isUncinus = false;
            if (type === 'storm')        puffs = CloudShapeGenerator.generateOrganicPuffs(true, seed, baseUnit, pq);
            else if (type === 'organic') puffs = CloudShapeGenerator.generateOrganicPuffs(false, seed, baseUnit, pq);
            else if (type === 'cirrus') {
                isUncinus = spec.uncinus && Math.random() < spec.uncinus[0];
                puffs = isUncinus
                    ? CloudShapeGenerator.generateCirrusUncinusPuffs(seed, baseUnit, pq)
                    : CloudShapeGenerator.generateCirrusLayeredPuffs(seed, baseUnit, pq);
            } else {
                puffs = CloudShapeGenerator.generateMixedPuffs(seed, type === 'stratus' ? 'stratus' : 'cumulus', baseUnit, pq);
            }
                    const scaleX = spec.jitterX[0] + Math.random() * spec.jitterX[1];
            const scaleY = spec.jitterY[0] + Math.random() * spec.jitterY[1];
            if (puffs) {
                for (let k = 0; k < puffs.length; k++) {
                    puffs[k].offsetX *= scaleX; puffs[k].offsetY *= scaleY;
                }
            }
                    let hStretch, vCompress;
            if (isUncinus) {
                hStretch  = spec.uncinus[1] + Math.random() * spec.uncinus[2]; vCompress = baseVCompress * spec.uncinus[3];
            } else {
                hStretch  = spec.stretch[0] + Math.random() * spec.stretch[1]; vCompress = baseVCompress * spec.flattenMul;
            }
            let cloudScale; const sizeRoll = Math.random(); const layerSizeBias = 0.85 + layer * 0.05;
            const rollLarge = isHeavy ? (0.40 + this._sessionSizeBias) : (0.25 + this._sessionSizeBias);
            const rollMedium = isHeavy ? (0.88 + this._sessionSizeBias * 0.5) : (0.50 + this._sessionSizeBias * 0.5);
            if (sizeRoll < rollLarge) {
                cloudScale = (1.2 + Math.random() * 0.90) * configScale * layerSizeBias;
            } else if (sizeRoll < rollMedium) {
                const base = isHeavy ? 0.70 : 0.50, range = isHeavy ? 0.35 : 0.22;
                cloudScale = (base + Math.random() * range) * configScale * layerSizeBias;
            } else {
                const base = isHeavy ? 0.62 : 0.40, range = isHeavy ? 0.14 : 0.18;
                cloudScale = (base + Math.random() * range) * configScale * layerSizeBias;
            }
            cloudScale = Math.min(cloudScale, 2.8);
                    let yMin = spec.yBand[0];
            let yMax = spec.yBand[1] < 0 ? heightLimit + spec.yBand[1] : spec.yBand[1];
            if (isDarkDayImmersive) {
                if (type === 'stratus')      yMax = 0.48;
                else if (type === 'cirrus')  yMax = 0.35;
            }
                    if (isLoner) {
                yPos = h * (yMin + Math.random() * (yMax - yMin));
            } else {
                const typeY = h * (yMin + Math.random() * (yMax - yMin)), clusterBias = cluster.y + gaussRand() * cluster.spreadY * 0.3;
                const clamped = Math.max(h * yMin, Math.min(h * yMax, clusterBias)); yPos = typeY * 0.6 + clamped * 0.4;
            }
            yPos = Math.max(h * 0.08, yPos);
            this._clouds.push({ x: xPos, y: yPos, scale: cloudScale, speed: (0.02 + Math.random() * 0.03) * (layer * 0.4 + 1), puffs, cloudType: type, layer, opacity: 1 - (layer * 0.12), seed, breathPhase: Math.random() * TWO_PI, breathSpeed: 0.002 + Math.random() * 0.004, _hStretch: hStretch, _vCompress: vCompress });
                    if (!p.dark && (type === 'cumulus' || type === 'organic') &&
                cloudScale > 0.75 * configScale && Math.random() < 0.15) {
                const cSeed = Math.random() * 10000;
                const cPuffs = CloudShapeGenerator.generateMixedPuffs(cSeed, 'stratus', baseUnit, pq);
                const cScaleX = 0.95 + Math.random() * 0.15, cScaleY = 0.92 + Math.random() * 0.12;
                for (let k = 0; k < cPuffs.length; k++) {
                    cPuffs[k].offsetX *= cScaleX; cPuffs[k].offsetY *= cScaleY; cPuffs[k].rad *= 0.75;
                }
                const compOffX = baseUnit * 0.60, compOffY = baseUnit * 0.20;
                companions.push({ x: xPos + (Math.random() - 0.5) * compOffX, y: yPos + (Math.random() - 0.5) * compOffY, scale: cloudScale * (0.7 + Math.random() * 0.3), speed: 0.01 + Math.random() * 0.02, puffs: cPuffs, cloudType: 'stratus', layer: Math.max(0, layer - 1), opacity: 0.45 + Math.random() * 0.20, seed: cSeed, breathPhase: Math.random() * TWO_PI, breathSpeed: 0.002, _hStretch: 1.4 + Math.random() * 0.5, _vCompress: baseVCompress * 0.85 });
            }
        }
        for (let c = 0; c < companions.length; c++) { this._clouds.push(companions[c]); }
        const cirrusAtmos = p.atmosphere === 'fair' || p.atmosphere === 'clear' || p.atmosphere === 'windy';
        if (!p.dark && totalClouds >= 12 && cirrusAtmos) {
            const accentCount = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < accentCount; i++) {
                const seed = Math.random() * 10000, cSpec = CLOUD_TYPES.cirrus, useUncinus = cSpec.uncinus && Math.random() < cSpec.uncinus[0];
                const cPuffs = useUncinus
                    ? CloudShapeGenerator.generateCirrusUncinusPuffs(seed, baseUnit, pq)
                    : CloudShapeGenerator.generateCirrusLayeredPuffs(seed, baseUnit, pq);
                const cScaleX = cSpec.jitterX[0] + Math.random() * cSpec.jitterX[1], cScaleY = cSpec.jitterY[0] + Math.random() * cSpec.jitterY[1];
                for (let k = 0; k < cPuffs.length; k++) {
                    cPuffs[k].offsetX *= cScaleX; cPuffs[k].offsetY *= cScaleY;
                }
                const aHStretch = useUncinus
                    ? cSpec.uncinus[1] + Math.random() * cSpec.uncinus[2]
                    : cSpec.stretch[0] + Math.random() * cSpec.stretch[1];
                const aVCompress = baseVCompress * (useUncinus ? cSpec.uncinus[3] : cSpec.flattenMul);
                this._clouds.push({ x: Math.random() * w, y: h * (0.05 + Math.random() * 0.12), scale: (1.0 + Math.random() * 0.4) * configScale, speed: 0.015 + Math.random() * 0.01, puffs: cPuffs, cloudType: 'cirrus', layer: Math.floor(Math.random() * 2), opacity: 0.55 + Math.random() * 0.20, seed, breathPhase: Math.random() * TWO_PI, breathSpeed: 0.002, _hStretch: aHStretch, _vCompress: aVCompress });
            }
        }
            if (!p.dark && p.atmosphere === 'overcast') {
            const seed = Math.random() * 10000;
            const puffs = CloudShapeGenerator.generateMixedPuffs(seed, 'cumulus', baseUnit, pq);
            const scX = 0.92 + Math.random() * 0.12, scY = 0.90 + Math.random() * 0.14;
            for (let k = 0; k < puffs.length; k++) {
                puffs[k].offsetX *= scX; puffs[k].offsetY *= scY;
            }
            this._clouds.push({ x: w * (0.20 + Math.random() * 0.60), y: h * (0.18 + Math.random() * 0.22), scale: 2.0 + Math.random() * 0.5, speed: 0.015 + Math.random() * 0.015, puffs, cloudType: 'cumulus', layer: 2, opacity: 0.90, seed, breathPhase: Math.random() * TWO_PI, breathSpeed: 0.002 + Math.random() * 0.002, _hStretch: 1.0, _vCompress: baseVCompress * 1.20 });
        }
        this._clouds.sort((a, b) => a.layer - b.layer);
        if (totalClouds > 0) {
                    const scudCount = isDarkDayImmersive
                ? 4 + Math.floor(Math.random() * 3)
                : 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < scudCount; i++) {
                const seed = Math.random() * 10000;
                this._fgClouds.push({ x: Math.random() * w, y: isDarkDayImmersive ? h * 0.30 + Math.random() * (h * 0.45) : Math.random() * (h * heightLimit) - 40, scale: (0.8 + Math.random() * 0.4) * configScale * 1.8, speed: 0.1 + Math.random() * 0.06, puffs: CloudShapeGenerator.generateMixedPuffs(seed, 'cumulus', baseUnit, pq), cloudType: 'scud', layer: 5, opacity: isDarkDayImmersive ? 0.45 : 0.65, seed, breathPhase: Math.random() * TWO_PI, breathSpeed: 0.004, _hStretch: 1.0, _vCompress: baseVCompress });
            }
        }
    }
    _initNightClouds(w, h) {
        const pq = Math.max(0.3, this._perfCloudQuality / 1.5);
        for (let i = 0; i < 4; i++) {
            const seed = Math.random() * 10000, puffs = CloudShapeGenerator.generateMixedPuffs(seed, 'stratus', 100, pq);
            this._clouds.push({ x: Math.random() * w, y: Math.random() * (h * 0.35), scale: 0.85 + Math.random() * 0.3, speed: 0.02 + Math.random() * 0.02, puffs, cloudType: 'stratus', layer: 4, opacity: 0.35, seed, breathPhase: Math.random() * TWO_PI, breathSpeed: 0.002 });
        }
    }
    _initCelestialClouds(w, h, decorStyle = null) {
        const celestial = this._getCelestialPosition(w, h), cx = celestial.x, cy = celestial.y, isExceptional = (this._params.cloud || 0) === 0;
        const isNight = this._isNight, isDarkDay = !isNight && this._isThemeDark, isDarkDayImmersive = this._isDarkDayImmersive;
        const pq = Math.max(0.3, this._perfCloudQuality / 1.5);
        const opMul = isNight
            ? (this._isThemeDark ? 0.40 : 0.62)
            : (isDarkDayImmersive ? 0.75 : (isDarkDay ? 0.45 : 1.0));
        // Sun-proportional unit so cluster scales with sun_moon_size, not card size.
        // Default sun (r=31) → sunUnit=1.0, celestialBaseUnit≈100 (generator default).
        const sunBaseR = this._celestialSize ? this._celestialSize / 2 : 31, sunUnit = sunBaseR / 31, celestialBaseUnit = sunBaseR * 3.2;
            if (!isNight) {
            this._celestialClouds.push({ x: cx, y: cy, scale: decorStyle ? 2.2 : 1.8, speed: 0.002, puffs: CloudShapeGenerator.generateWispyPuffs(Math.random() * 10000, celestialBaseUnit, pq), opacity: isDarkDayImmersive ? 0.22 : (isDarkDay ? 0.10 : (decorStyle ? 0.20 : 0.15)), seed: Math.random(), breathPhase: 0, breathSpeed: 0.001, baseX: cx, baseY: cy, driftPhase: 0, _vSquash: 1.0, _sunUnit: sunUnit });
        }
        const scatterBase = decorStyle ? Math.max(3, decorStyle.count) : 7;
        const scatterCount = isExceptional ? 2 : (isNight ? 5 : (isDarkDay ? 4 : scatterBase));
        const scatterOpMul = decorStyle ? opMul * 0.70 : opMul, isWarm = !decorStyle && !isNight && !isDarkDay;
            const heroCount = scatterCount >= 5 ? 2 : 1;
        const topCount = isExceptional ? 1 : Math.max(1, Math.floor(scatterCount * 0.28));
        const sideCount = Math.max(1, scatterCount - heroCount - topCount);
        const pushCelestial = (ox, oy, scale, vSquash, opBase) => {
            this._celestialClouds.push({ x: cx + ox, y: cy + oy, scale, speed: 0.004 + Math.random() * 0.004, puffs: CloudShapeGenerator.generateSunDecorationPuffs(Math.random() * 10000, celestialBaseUnit, pq), opacity: opBase * scatterOpMul, seed: Math.random(), breathPhase: Math.random() * TWO_PI, breathSpeed: 0.002 + Math.random() * 0.002, baseX: cx + ox, baseY: cy + oy, driftPhase: Math.random() * TWO_PI, _vSquash: vSquash, _sunUnit: sunUnit });
        };
        for (let i = 0; i < heroCount; i++) {
            const side = heroCount === 1 ? (Math.random() < 0.5 ? -1 : 1) : (i === 0 ? -1 : 1);
            const ox = side * (20 + Math.random() * 40) * sunUnit, oy = (35 + Math.random() * 45) * sunUnit;
                    const heroScale = isWarm ? (0.85 + Math.random() * 0.45) : (1.0 + Math.random() * 0.60);
            pushCelestial(ox, oy, heroScale, 0.70 + Math.random() * 0.08, 0.55 + Math.random() * 0.20);
        }
        for (let i = 0; i < sideCount; i++) {
            const angleBias = (Math.random() < 0.5 ? -1 : 1) * (0.9 + Math.random() * 0.6);
            const radBase = isWarm ? 42 : 55, radRange = isWarm ? 28 : 35;
            const ox = Math.cos(angleBias) * (radBase + Math.random() * radRange) * sunUnit;
            const oy = (Math.abs(Math.sin(angleBias)) * (20 + Math.random() * 40) - 5) * sunUnit;
            const sideScale = isWarm ? (0.60 + Math.random() * 0.40) : (0.48 + Math.random() * 0.40);
            pushCelestial(ox, oy, sideScale, 0.74 + Math.random() * 0.10, 0.40 + Math.random() * 0.25);
        }
        for (let i = 0; i < topCount; i++) {
            const spread = isWarm ? 100 : 130, ox = (Math.random() - 0.5) * spread * sunUnit, oy = (-30 - Math.random() * 28) * sunUnit;
            const topScale = isWarm ? (0.42 + Math.random() * 0.28) : (0.32 + Math.random() * 0.25);
            pushCelestial(ox, oy, topScale, 0.70 + Math.random() * 0.10, 0.32 + Math.random() * 0.18);
        }
    }
    _initStars(w, h, count) {
        const tier1Count = Math.floor(count * 0.70), tier2Count = Math.floor(count * 0.285);
        const isUltra = this._perfEffects >= 2;
        const isGolden = this._renderState && this._renderState.starMode === 'golden';
        const palette = isGolden ? STAR_PALETTE_GOLDEN : STAR_PALETTE_GLOW;
        for (let i = 0; i < count; i++) {
            const isCluster = Math.random() < 0.3; let x = Math.random() * w; let y = Math.random() * h * 0.85;
            if (isCluster) {
                x += (Math.random() - 0.5) * 90; y += (Math.random() - 0.5) * 60;
            }
            const tier = i < tier1Count ? 'bg' : i < tier1Count + tier2Count ? 'mid' : 'hero';
            const tp = STAR_TIER_PROPS[tier], size = tp[0] + Math.random() * tp[1], brightness = tp[2] + Math.random() * tp[3];
            const twinkleSpeed = tp[4] + Math.random() * tp[5], k = Math.random();
            const pc = k < palette[0][0] ? palette[0] : k > palette[1][0] ? palette[2] : palette[1];
                    const rgb = hslToRgb(pc[1], pc[2], pc[3]);
            const fillStr = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
            const star = { x, y, baseSize: size, phase: Math.random() * TWO_PI, rate: twinkleSpeed, brightness, tier, _fill: fillStr, _stroke: fillStr, _r: rgb[0], _g: rgb[1], _b: rgb[2] };
            if (tier === 'hero') {
                const isFeature = i >= count - 2;
                if (isGolden) {
                    star._bodyAlphaRatio = 0.85; star._haloInnerR = 0.6; star._haloOuterR = isFeature ? 2.8 : 2.2; star._bodyR = 0.65; star._spikeRatio = isFeature ? 0.28 : 0.22; star._spikeLen = isFeature ? 2.0 : 1.4;
                } else {
                    const haloBoost = isUltra ? 1.25 : 1.0;
                    star._bodyAlphaRatio = 1.0; star._haloInnerR = 0.6; star._haloOuterR = (isFeature ? 3.8 : 3.0) * haloBoost; star._bodyR = 0.6; star._spikeRatio = isFeature ? 0.38 : 0.3; star._spikeLen = (isFeature ? 2.8 : 2.0) * haloBoost; star._crownRatio = isFeature ? 0.34 : 0.28; star._crownLen = (isFeature ? 3.2 : 2.5) * haloBoost;
                }
                const haloDpr = isUltra ? 2 : 1;
                const haloSize = Math.ceil(size * star._haloOuterR * 2 + 2) * haloDpr, hc = document.createElement('canvas');
                hc.width = haloSize; hc.height = haloSize;
                const hCtx = hc.getContext('2d', { willReadFrequently: false });
                const cx = haloSize / 2; const refSize = size * haloDpr;
                const haloAlpha = isGolden ? (isFeature ? 0.45 : 0.35) : (isFeature ? 0.35 : 0.25);
                const hg = hCtx.createRadialGradient(cx, cx, refSize * star._haloInnerR, cx, cx, refSize * star._haloOuterR);
                if (isUltra && !isGolden) {
                    hg.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${haloAlpha})`);
                    hg.addColorStop(0.25, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${haloAlpha * 0.6})`);
                    hg.addColorStop(0.55, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${haloAlpha * 0.2})`);
                    hg.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
                } else {
                    hg.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${haloAlpha})`);
                    hg.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
                }
                hCtx.fillStyle = hg; hCtx.beginPath(); hCtx.arc(cx, cx, refSize * star._haloOuterR, 0, TWO_PI);
                hCtx.fill(); star._haloTex = hc; star._haloTexSize = haloSize;
                star._haloRefSize = refSize;
            }
            this._stars.push(star);
        }
    }
    _bakeMilkyWay(w, h) {
        const isGolden = this._renderState && this._renderState.starMode === 'golden';
        const palette = isGolden ? STAR_PALETTE_GOLDEN : STAR_PALETTE_GLOW, c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d', { willReadFrequently: false });
        const lat = (this._hass && this._hass.config) ? this._hass.config.latitude : 50;
        const angle = -0.35 - Math.abs(lat) * 0.004 + (Math.random() - 0.5) * 0.45;
        const cosA = Math.cos(angle), sinA = Math.sin(angle), perpX = -sinA, perpY = cosA, scale = 0.25 + Math.random() * 1.05;
        const diag = Math.sqrt(w * w + h * h), bandW = h * 0.14 * scale, moon = this._getCelestialPosition(w, h);
        let cx = w * 0.5, cy = h * 0.42; const dxM = cx - moon.x, dyM = cy - moon.y;
        if (Math.sqrt(dxM * dxM + dyM * dyM) < h * 0.3) {
            cx += perpX * h * 0.18 * (moon.x < w * 0.5 ? 1 : -1); cy += perpY * h * 0.18 * (moon.x < w * 0.5 ? 1 : -1);
        }
        cx += (Math.random() - 0.5) * w * 0.15; cy += (Math.random() - 0.5) * h * 0.12; const hazeRgb = isGolden ? '180,140,50' : '160,175,210';
        const hazeSpan = diag * 0.35 * scale;
        for (let n = 0; n < 6; n++) {
            const along = (n - 2.5) * hazeSpan * 0.4, hx = cx + cosA * along, hy = cy + sinA * along;
            if (hy < -bandW || hy > h + bandW) continue; const hr = bandW * (1.4 + Math.random() * 0.8);
            const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr), hazeOp = 0.06 + Math.random() * 0.04;
            hg.addColorStop(0, `rgba(${hazeRgb},${hazeOp})`);
            hg.addColorStop(0.5, `rgba(${hazeRgb},${hazeOp * 0.45})`);
            hg.addColorStop(1, `rgba(${hazeRgb},0)`);
            ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, TWO_PI);
            ctx.fill();
        }
        const dustCount = Math.floor((350 + Math.random() * 150) * scale), dustBatches = new Map();
        for (let i = 0; i < dustCount; i++) {
            const along = (Math.random() - 0.5) * diag * 1.1 * scale;
            const spread = (Math.random() + Math.random() + Math.random() + Math.random()) / 4 - 0.5;
            const across = spread * bandW * 1.6, dx = cx + cosA * along + perpX * across, dy = cy + sinA * along + perpY * across;
            if (dx < -1 || dx > w + 1 || dy < 0 || dy > h * 0.90) continue; const dist = Math.abs(spread) * 2; const falloff = Math.max(0, 1 - dist * dist);
            const op = (0.22 + falloff * 0.28) * (0.7 + Math.random() * 0.3), qOp = ((op * 20 + 0.5) | 0) / 20, k = Math.random();
            const pc = k < palette[0][0] ? palette[0] : k > palette[1][0] ? palette[2] : palette[1];
            const rgb = hslToRgb(pc[1], pc[2], pc[3]);
            const fillStr = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
            const key = fillStr + '|' + qOp; let batch = dustBatches.get(key);
            if (!batch) { batch = { fill: fillStr, op: qOp, items: [] }; dustBatches.set(key, batch); }
            batch.items.push(dx, dy, 0.45 + Math.random() * 0.4);
        }
        for (const batch of dustBatches.values()) {
            ctx.globalAlpha = batch.op; ctx.fillStyle = batch.fill; ctx.beginPath();
            const items = batch.items;
            for (let j = 0; j < items.length; j += 3) {
                ctx.moveTo(items[j] + items[j + 2], items[j + 1]); ctx.arc(items[j], items[j + 1], items[j + 2], 0, TWO_PI);
            }
            ctx.fill();
        }
        const dotR = isGolden ? 0.55 : 0.5, count = Math.floor((180 + Math.random() * 50) * scale), batches = new Map();
        for (let i = 0; i < count; i++) {
            const along = (Math.random() - 0.5) * diag * 1.2 * scale;
            const spread = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
            const across = spread * bandW * 2, dx = cx + cosA * along + perpX * across, dy = cy + sinA * along + perpY * across;
            if (dx < -2 || dx > w + 2 || dy < 0 || dy > h * 0.90) continue; const dist = Math.abs(spread) * 2; const falloff = Math.max(0, 1 - dist * dist);
            const k = Math.random();
            const pc = k < palette[0][0] ? palette[0] : k > palette[1][0] ? palette[2] : palette[1];
            const rgb = hslToRgb(pc[1], pc[2], pc[3]);
            const fillStr = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
            const size = 0.8 + Math.random() * 0.6 + falloff * 0.6;
            const op = Math.min(1, (0.45 + falloff * 0.40) * (0.8 + Math.random() * 0.2));
            const qOp = ((op * 20 + 0.5) | 0) / 20, key = fillStr + '|' + qOp;
            let batch = batches.get(key);
            if (!batch) { batch = { fill: fillStr, op: qOp, items: [] }; batches.set(key, batch); }
            batch.items.push(dx, dy, size * dotR);
        }
        for (const batch of batches.values()) {
            ctx.globalAlpha = batch.op; ctx.fillStyle = batch.fill; ctx.beginPath();
            const items = batch.items;
            for (let j = 0; j < items.length; j += 3) {
                ctx.moveTo(items[j] + items[j + 2], items[j + 1]); ctx.arc(items[j], items[j + 1], items[j + 2], 0, TWO_PI);
            }
            ctx.fill();
        }
        this._milkyWay = c;
    }
    _initWindVapor(w, h, count = 24, scale = 1.0, flat = false) {
        const isImm = this._isDarkDayImmersive, yTop    = h * (isImm ? 0.18 : 0.25), yBottom = h * (isImm ? 0.78 : 0.65);
        const yBand   = Math.max(16, yBottom - yTop), sibGap  = Math.max(8, yBand * 0.12), rotLimit = flat ? 0.008 : 1.0;
        let placed = 0;
        while (placed < count) {
            const gSize = Math.min(2 + Math.floor(Math.random() * 2), count - placed);
            const gY = yTop + Math.random() * yBand, gX = Math.random() * w, gRot = (Math.random() - 0.5) * 0.06 * rotLimit;
            for (let k = 0; k < gSize; k++) {
                const yOff = (k - (gSize - 1) * 0.5) * sibGap + (Math.random() - 0.5) * 2;
                const finalY = Math.min(yBottom, Math.max(yTop, gY + yOff)), yNorm = yBand > 0 ? (finalY - yTop) / yBand : 0.5;
                const tier = yNorm < 0.33 ? 0 : (yNorm < 0.66 ? 1 : 2), depthScale = 0.5 + tier * 0.25, sizeRoll = Math.random(), isHero = sizeRoll > 0.92;
                const isThin = sizeRoll < 0.15, thickMul = isHero ? 1.5 : (isThin ? 0.7 : 1.0), isOrganic = flat ? false : Math.random() < 0.20;
                const vw = w * (0.18 + Math.random() * 0.45) * scale * depthScale * (isHero ? 1.3 : (isOrganic ? 0.75 : 1.0));
                this._windVapor.push({ x: gX + (Math.random() - 0.5) * w * 0.15, y: finalY, w: vw, speed: (0.8 + Math.random() * 1.4) * depthScale, tier, phase: Math.random() * TWO_PI, phaseSpeed: 0.005 + Math.random() * 0.005, drift: flat ? 0.5 + Math.random() * 1.0 : 1.5 + Math.random() * 2.5, gustWeight: 0.5 + Math.random() * 0.5, squash: (0.038 + Math.random() * 0.025) * thickMul * (isOrganic ? 1.35 : 1.0), baseRotation: (gRot + (Math.random() - 0.5) * (isOrganic ? 0.06 : 0.02)) * rotLimit, taperDir: Math.random() < 0.5 ? -1 : 1, depthNorm: yNorm, curvature: isOrganic ? (Math.random() - 0.5) * 0.15 : 0 });
                placed++;
            }
        }
    }
    _createBolt(w, h) {
        const x = Math.random() * (w * 0.7) + (w * 0.15), segments = [];
        let curX = x, curY = 0, iter = 0; const mainBias = (Math.random() - 0.5) * 15;
        while (curY < h && iter < 80) {
            const nextY = curY + 12 + Math.random() * 20, nextX = curX + mainBias + (Math.random() * 30 - 15);
            segments.push({ x: curX, y: curY, nx: nextX, ny: nextY, branch: false });
            if (Math.random() < (this._perfEffects >= 2 ? 0.25 : 0.18) && curY > 20) {
                const branchDir = Math.random() > 0.5 ? 1 : -1;
                const branchLen = this._perfEffects >= 2 ? (18 + Math.random() * 38) : (15 + Math.random() * 30);
                segments.push({ x: curX, y: curY, nx: curX + branchDir * branchLen, ny: curY + 15 + Math.random() * 25, branch: true });
            }
            curX = nextX; curY = nextY; iter++;
        }
        return {
            segments, life: 1.0, alpha: 1.0, glow: 1.0,
            _outerStroke: 'rgb(160, 190, 255)',
            _glowStroke: 'rgb(180, 210, 255)',
            _coreStroke: 'rgb(255, 255, 255)',
            _branchStroke: 'rgb(200, 220, 255)'
        };
    }
    // CLOUD & MOON BAKING
    _allocCloudAtlas() {
        let canvas;
        try {
            canvas = new OffscreenCanvas(this._perfCloudRes, this._perfCloudRes);
        } catch (e) {
            canvas = document.createElement('canvas'); canvas.width = this._perfCloudRes; canvas.height = this._perfCloudRes;
        }
        return { canvas, ctx: canvas.getContext('2d', { willReadFrequently: false }) };
    }
    _bakeAllClouds() {
        const rs = this._renderState; if (!rs) return; if (!this._cloudAtlases) this._cloudAtlases = [];
        if (this._cloudAtlases.length === 0) this._cloudAtlases.push(this._allocCloudAtlas());
        for (let i = 0; i < this._cloudAtlases.length; i++) { this._cloudAtlases[i].ctx.clearRect(0, 0, this._perfCloudRes, this._perfCloudRes); }
        const atlases = this._cloudAtlases, alloc = () => this._allocCloudAtlas();
        const packer = {
            atlases,
            index: 0,
            x: 0, y: 0, rowHeight: 0,
            get ctx()    { return atlases[this.index].ctx; },
            get canvas() { return atlases[this.index].canvas; },
            advance() {
                if (this.index + 1 >= atlases.length) {
                    if (atlases.length >= CLOUD_ATLAS_MAX) return false; atlases.push(alloc());
                }
                this.index++; this.x = 0; this.y = 0; this.rowHeight = 0;
                return true;
            }
        };
        for (let i = 0; i < this._clouds.length; i++) this._bakeCloud(this._clouds[i], packer);
        for (let i = 0; i < this._fgClouds.length; i++) this._bakeCloud(this._fgClouds[i], packer);
        const palette = rs.celestialCloudPalette;
        const cpCelestial = CELESTIAL_CLOUD_PALETTES[palette] || CELESTIAL_CLOUD_PALETTES.cool;
        for (let i = 0; i < this._celestialClouds.length; i++) { this._bakeCelestialCloud(this._celestialClouds[i], cpCelestial); }
    }
    _bakeCloud(cloud, packer) {
        const puffs = cloud.puffs; if (!puffs || puffs.length === 0) return; const rs = this._renderState;
        const cp = rs.cp, isLightBg = this._isLightBackground, isThemeDark = this._isThemeDark, isTimeNight = this._isTimeNight;
        const dpr = Math.min(this._perfCloudQuality, this._cachedDimensions.dpr), globalOpacity = rs.cloudGlobalOp, highlightOffsetBase = cp.highlightOffsetBase;
        const hOffset = cp.hOffset, rainyOpacityMul = cp.rainyOpacityMul, ambient = cp.ambient;
        const hStretch  = cloud._hStretch  !== undefined ? cloud._hStretch  : 1.0;
        const vCompress = cloud._vCompress !== undefined ? cloud._vCompress : 0.55;
        const layerHighlightOffset = (cloud.layer === 5 && !isThemeDark) ? 0.50 : highlightOffsetBase;
        const spec = CLOUD_TYPES[cloud.cloudType] || CLOUD_TYPES.organic, prof = spec.profile;
        const shadowCut = prof[0], surfaceCut = prof[1], hlMul = prof[2], shadowRad = prof[3], surfaceRad = prof[4];
        const maxRadMul = Math.max(shadowRad, surfaceRad, 1.0);
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (let j = 0; j < puffs.length; j++) {
            const p = puffs[j], px = p.offsetX * hStretch, py = p.offsetY * vCompress, sq = p.squash !== undefined ? p.squash : 1.0;
            const radH = p.rad * hStretch * maxRadMul, radV = p.rad * sq * vCompress * maxRadMul;
            if (px - radH < minX) minX = px - radH; if (px + radH > maxX) maxX = px + radH; if (py - radV < minY) minY = py - radV;
            if (py + radV > maxY) maxY = py + radV;
        }
        const margin = 6; minX -= margin; minY -= margin; maxX += margin; maxY += margin;
        const bakeW = Math.ceil(maxX - minX), bakeH = Math.ceil(maxY - minY);
        if (bakeW <= 0 || bakeH <= 0) return; const physW = Math.ceil(bakeW * dpr); const physH = Math.ceil(bakeH * dpr);
        if (physW > this._perfCloudRes || physH > this._perfCloudRes) return;
        if (packer.x + physW + 2 > this._perfCloudRes) {
            packer.x = 0; packer.y += packer.rowHeight + 2; packer.rowHeight = 0;
        }
        if (packer.y + physH > this._perfCloudRes) { if (!packer.advance()) return; }
        const atlasX = packer.x, atlasY = packer.y;
        packer.x += physW + 2; if (physH > packer.rowHeight) packer.rowHeight = physH; const oc = packer.ctx;
        oc.save(); oc.translate(atlasX, atlasY); oc.scale(dpr, dpr);
        const t = spec.tint;
        const litR = cp.litR + t[0], litG = cp.litG + t[1], litB = cp.litB + t[2];
        const midR = cp.midR + t[3], midG = cp.midG + t[4], midB = cp.midB + t[5];
        const shadowR = cp.shadowR + t[6], shadowG = cp.shadowG + t[7], shadowB = cp.shadowB + t[8];
        const shadeH = bakeH || 1, bodyHlScale = hlMul * 0.50 + 0.10, baseOpacity = globalOpacity * cloud.opacity * ambient;
        // Immersive-light differentiation: inner gradient stops pull in tighter (see below)
        // and a quadratic bottom-fade is applied post-modifier to prevent stacked-halo mush.
        const isImmersiveLight = isLightBg && this._isImmersive;
        const simpleGrad = this._perfCloudQuality <= 1.0;
        for (let j = 0; j < puffs.length; j++) {
            const puff = puffs[j], sq = puff.squash !== undefined ? puff.squash : 1.0, drawX = puff.offsetX * hStretch  - minX;
            const drawY = puff.offsetY * vCompress - minY, normalizedY = drawY / shadeH, posFactor = Math.max(0.20, 1 - normalizedY * 0.68);
            const depth = puff.depth, isShadow  = depth < shadowCut, isSurface = !isShadow && depth > surfaceCut;
            let pR, pG, pB, finalOpacity, pRadius, pHlX = 0, pHlY = 0;
            if (isShadow) {
                const sf = posFactor * 0.30; pR = (midR * sf + shadowR * (1 - sf)) | 0; pG = (midG * sf + shadowG * (1 - sf)) | 0;
                pB = (midB * sf + shadowB * (1 - sf)) | 0; finalOpacity = baseOpacity * 0.72; pRadius = puff.rad * shadowRad;
                pHlY = -puff.rad * layerHighlightOffset * 0.15;
            } else if (isSurface) {
                const sf = posFactor * (0.55 + puff.shade * 0.45); pR = (litR * sf + midR * (1 - sf)) | 0; pG = (litG * sf + midG * (1 - sf)) | 0;
                pB = (litB * sf + midB * (1 - sf)) | 0; finalOpacity = baseOpacity * (0.68 + puff.shade * 0.30); pRadius = puff.rad * surfaceRad;
                const diffuse = normalizedY * normalizedY * 0.65; pHlX = -puff.rad * hOffset * hlMul * (1 - diffuse);
                pHlY = -puff.rad * layerHighlightOffset * hlMul * (1 - diffuse * 0.5);
            } else {
                const sf = posFactor * (0.40 + puff.shade * 0.50); pR = (litR * sf + midR * (1 - sf)) | 0; pG = (litG * sf + midG * (1 - sf)) | 0;
                pB = (litB * sf + midB * (1 - sf)) | 0; finalOpacity = baseOpacity * (0.55 + puff.shade * 0.35); pRadius = puff.rad;
                const diffuse = normalizedY * normalizedY * 0.65; pHlX = -puff.rad * hOffset * bodyHlScale * (1 - diffuse);
                pHlY = -puff.rad * layerHighlightOffset * bodyHlScale * (1 - diffuse * 0.5);
            }
            if (rainyOpacityMul !== 1.0) finalOpacity = Math.min(1.0, finalOpacity * rainyOpacityMul);
            if (isLightBg) {
                const bottomFade = isImmersiveLight ? 0.50 : 0.30; finalOpacity *= 1 - normalizedY * normalizedY * bottomFade;
            }
            let dR = pR, dG = pG, dB = pB, dMidR = midR, dMidG = midG, dMidB = midB, dShadR = shadowR, dShadG = shadowG, dShadB = shadowB;
            if (isThemeDark && finalOpacity < 0.20) {
                const dim = isTimeNight ? 0.40 : 0.75;
                finalOpacity = Math.min(1.0, finalOpacity * (isTimeNight ? 2.5 : 2.0));
                dR = (dR * dim) | 0; dG = (dG * dim) | 0; dB = (dB * dim) | 0;
                dMidR = (dMidR * dim) | 0; dMidG = (dMidG * dim) | 0; dMidB = (dMidB * dim) | 0;
                dShadR = (dShadR * dim) | 0; dShadG = (dShadG * dim) | 0; dShadB = (dShadB * dim) | 0;
            }
            if (finalOpacity < 0.005) continue; oc.save(); oc.translate(drawX, drawY);
            if (puff.rotation) oc.rotate(puff.rotation); oc.scale(hStretch, sq * vCompress);
            const grad = oc.createRadialGradient(pHlX, pHlY, 0, 0, 0, pRadius);
            if (simpleGrad) {
                grad.addColorStop(0, `rgba(${dR},${dG},${dB},${finalOpacity})`);
                grad.addColorStop(1, `rgba(${dShadR},${dShadG},${dShadB},0)`);
            } else if (isShadow) {
                grad.addColorStop(0,    `rgba(${dR},${dG},${dB},${finalOpacity})`);
                grad.addColorStop(0.45, `rgba(${dShadR},${dShadG},${dShadB},${finalOpacity * 0.55})`);
                grad.addColorStop(1.0,  `rgba(${dShadR},${dShadG},${dShadB},0)`);
            } else if (isSurface) {
                grad.addColorStop(0,    `rgba(${dR},${dG},${dB},${finalOpacity})`);
                grad.addColorStop(0.22, `rgba(${dR},${dG},${dB},${finalOpacity * 0.90})`);
                if (isLightBg) {
                    grad.addColorStop(0.45, `rgba(${dMidR},${dMidG},${dMidB},${finalOpacity * (isImmersiveLight ? 0.52 : 0.46)})`);
                    grad.addColorStop(isImmersiveLight ? 0.62 : 0.70, `rgba(${dShadR},${dShadG},${dShadB},${finalOpacity * (isImmersiveLight ? 0.09 : 0.12)})`);
                    grad.addColorStop(isImmersiveLight ? 0.82 : 0.90, `rgba(${dShadR},${dShadG},${dShadB},${finalOpacity * 0.01})`);
                } else {
                    grad.addColorStop(0.40, `rgba(${dMidR},${dMidG},${dMidB},${finalOpacity * 0.42})`);
                    grad.addColorStop(0.65, `rgba(${dShadR},${dShadG},${dShadB},${finalOpacity * 0.10})`);
                }
                grad.addColorStop(1.0, `rgba(${dShadR},${dShadG},${dShadB},0)`);
            } else {
                const midStop = 0.28 + puff.softness * 0.22;
                grad.addColorStop(0, `rgba(${dR},${dG},${dB},${finalOpacity})`);
                if (isLightBg) {
                    grad.addColorStop(midStop, `rgba(${dMidR},${dMidG},${dMidB},${finalOpacity * (isImmersiveLight ? 0.74 : 0.68)})`);
                    const shelf = midStop + (1.0 - midStop) * 0.42;
                    grad.addColorStop(shelf, `rgba(${dShadR},${dShadG},${dShadB},${finalOpacity * (isImmersiveLight ? 0.14 : 0.18)})`);
                    grad.addColorStop(shelf + (1.0 - shelf) * (isImmersiveLight ? 0.42 : 0.55), `rgba(${dShadR},${dShadG},${dShadB},${finalOpacity * 0.02})`);
                    grad.addColorStop(1.0, `rgba(${dShadR},${dShadG},${dShadB},0)`);
                } else {
                    grad.addColorStop(midStop, `rgba(${dMidR},${dMidG},${dMidB},${finalOpacity * 0.78})`);
                    grad.addColorStop(0.65, `rgba(${dShadR},${dShadG},${dShadB},${finalOpacity * 0.28})`);
                    grad.addColorStop(0.85, `rgba(${dShadR},${dShadG},${dShadB},0)`);
                }
            }
            oc.fillStyle = grad; oc.beginPath(); oc.arc(0, 0, pRadius, 0, TWO_PI);
            oc.fill(); oc.restore();
        }
        oc.restore(); cloud._bakedCanvas  = packer.canvas; cloud._atlasX       = atlasX;
        cloud._atlasY       = atlasY; cloud._atlasW       = physW; cloud._atlasH       = physH;
        cloud._bakeOffX     = minX; cloud._bakeOffY     = minY; cloud._bakeLogicalW = bakeW;
        cloud._bakeLogicalH = bakeH;
    }
    _bakeCelestialCloud(cloud, cp) {
        const puffs = cloud.puffs; if (!puffs || puffs.length === 0) return;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (let j = 0; j < puffs.length; j++) {
            const p = puffs[j], r = p.rad * 1.08;
            if (p.offsetX - r < minX) minX = p.offsetX - r; if (p.offsetX + r > maxX) maxX = p.offsetX + r; if (p.offsetY - r < minY) minY = p.offsetY - r;
            if (p.offsetY + r > maxY) maxY = p.offsetY + r;
        }
        const pad = 5; minX -= pad; minY -= pad; maxX += pad; maxY += pad; const bakeW = Math.ceil(maxX - minX);
        const bakeH = Math.ceil(maxY - minY); if (bakeW <= 0 || bakeH <= 0) return; const shadeH = bakeH || 1;
        const oc = document.createElement('canvas'); oc.width = bakeW; oc.height = bakeH;
        const oCtx = oc.getContext('2d', { willReadFrequently: false });
        for (let j = 0; j < puffs.length; j++) {
            const puff = puffs[j], drawX = puff.offsetX - minX, drawY = puff.offsetY - minY, normY = drawY / shadeH;
            const posFactor = Math.max(0.20, 1 - normY * 0.55), depth = puff.depth, isShadow  = depth < 0.30, isSurface = depth > 0.65;
            let pR, pG, pB, opMul, radMul, hlYOff;
            if (isShadow) {
                const sf = posFactor * 0.30; pR = (cp.midR * sf + cp.shadowR * (1 - sf)) | 0; pG = (cp.midG * sf + cp.shadowG * (1 - sf)) | 0;
                pB = (cp.midB * sf + cp.shadowB * (1 - sf)) | 0; opMul = 0.72; radMul = 0.88;
                hlYOff = 0;
            } else if (isSurface) {
                const sf = posFactor * (0.55 + puff.shade * 0.45); pR = (cp.litR * sf + cp.midR * (1 - sf)) | 0; pG = (cp.litG * sf + cp.midG * (1 - sf)) | 0;
                pB = (cp.litB * sf + cp.midB * (1 - sf)) | 0; opMul = 0.70 + puff.shade * 0.28; radMul = 1.05;
                hlYOff = -puff.rad * 0.42;
            } else {
                const sf = posFactor * (0.42 + puff.shade * 0.48); pR = (cp.litR * sf + cp.midR * (1 - sf)) | 0; pG = (cp.litG * sf + cp.midG * (1 - sf)) | 0;
                pB = (cp.litB * sf + cp.midB * (1 - sf)) | 0; opMul = 0.58 + puff.shade * 0.32; radMul = 1.0;
                hlYOff = -puff.rad * 0.22;
            }
            const finalOp = cloud.opacity * puff.shade * opMul; if (finalOp < 0.005) continue; const pRadius = puff.rad * radMul;
            const grad = oCtx.createRadialGradient(0, hlYOff, 0, 0, 0, pRadius);
            if (isShadow) {
                grad.addColorStop(0,    `rgba(${pR},${pG},${pB},${finalOp})`);
                grad.addColorStop(0.45, `rgba(${cp.shadowR},${cp.shadowG},${cp.shadowB},${finalOp * 0.55})`);
                grad.addColorStop(1.0,  `rgba(${cp.shadowR},${cp.shadowG},${cp.shadowB},0)`);
            } else if (isSurface) {
                grad.addColorStop(0,    `rgba(${pR},${pG},${pB},${finalOp})`);
                grad.addColorStop(0.22, `rgba(${pR},${pG},${pB},${finalOp * 0.90})`);
                grad.addColorStop(0.48, `rgba(${cp.midR},${cp.midG},${cp.midB},${finalOp * 0.52})`);
                grad.addColorStop(0.72, `rgba(${cp.shadowR},${cp.shadowG},${cp.shadowB},${finalOp * 0.14})`);
                grad.addColorStop(1.0,  `rgba(${cp.shadowR},${cp.shadowG},${cp.shadowB},0)`);
            } else {
                const midStop = 0.30 + puff.softness * 0.18;
                grad.addColorStop(0,             `rgba(${pR},${pG},${pB},${finalOp})`);
                grad.addColorStop(midStop,       `rgba(${cp.midR},${cp.midG},${cp.midB},${finalOp * 0.72})`);
                grad.addColorStop(midStop + 0.30,`rgba(${cp.shadowR},${cp.shadowG},${cp.shadowB},${finalOp * 0.20})`);
                grad.addColorStop(1.0,           `rgba(${cp.shadowR},${cp.shadowG},${cp.shadowB},0)`);
            }
            oCtx.save(); oCtx.translate(drawX, drawY); if (puff.rotation) oCtx.rotate(puff.rotation);
            if (puff.squash !== 1.0) oCtx.scale(1, puff.squash); oCtx.fillStyle = grad; oCtx.beginPath();
            oCtx.arc(0, 0, pRadius, 0, TWO_PI); oCtx.fill(); oCtx.restore();
        }
        cloud._bakedCanvas = oc; cloud._bakeOffX = minX; cloud._bakeOffY = minY;
        cloud._bakeW = bakeW; cloud._bakeH = bakeH;
    }
    _buildMoonCache(ctx, moonRadius, moonScale, w, h, useLightColors, styleKey) {
        const mc = {};
            const applyStops = (grad, cfg, peak) => {
            for (let si = 0; si < cfg.length; si++) {
                const stop = cfg[si];
                grad.addColorStop(stop[0], stop[2] === 0 ? `rgba(${stop[1]}, 0)` : `rgba(${stop[1]}, ${stop[2] / peak})`);
            }
        };
            if (useLightColors) {
            const lightGlowR = Math.min(h, w) * 0.336 * moonScale, glow = ctx.createRadialGradient(0, 0, 0, 0, 0, lightGlowR);
            const cfg = MOON_STYLE_COLORS.glow[styleKey]; applyStops(glow, cfg.stops, cfg.peak); mc.glow = glow;
            mc.glowR = lightGlowR; mc.glowPeak = cfg.peak;
        }
            {
            const g = ctx.createRadialGradient(-moonRadius * 0.3, -moonRadius * 0.3, 0, 0, 0, moonRadius);
            const cfg = MOON_STYLE_COLORS.fullDisc[styleKey]; applyStops(g, cfg.stops, cfg.peak); mc.fullDisc = g;
            mc.fullDiscPeak = cfg.peak;
        }
            {
            const g = ctx.createRadialGradient(-moonRadius * 0.2, -moonRadius * 0.2, 0, 0, 0, moonRadius);
            const cfg = MOON_STYLE_COLORS.partDisc[styleKey]; applyStops(g, cfg.stops, cfg.peak); mc.partDisc = g;
            mc.partDiscPeak = cfg.peak;
        }
        {
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, moonRadius), limbAlpha = useLightColors ? 0.12 : 0.22;
            g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.55, 'rgba(0,0,0,0)');
            g.addColorStop(1, `rgba(0,0,0,${limbAlpha})`);
            mc.limbDark = g;
        }
        return mc;
    }
    // RENDERING (PER-FRAME)
    _drawCelestialGlow(ctx, w, h) {
        const glow = this._renderState.glow; if (!glow) return; const fadeOpacity = this._layerFadeProgress.effects;
        const { x: cx, y: cy } = this._getCelestialPosition(w, h);
        const sunBaseR = this._celestialSize ? this._celestialSize / 2 : 31, sizeCap = Math.min(w, h) * 0.9;
            const t = (Math.sin(this._sunPulsePhase * 2.8 / glow.breathPeriodMul) + 1) / 2;
        const [gR, gG, gB] = glow.color; ctx.save(); if (glow.compOp) ctx.globalCompositeOperation = glow.compOp;
        ctx.translate(cx, cy);
        if (glow.showDisc) {
                    const edgeLimit = Math.min(cx, cy, w - cx, h - cy);
            const ringFull = sunBaseR * 5.8, ringScale = Math.min(1, edgeLimit / ringFull), ringOk = glow.showHalo && ringScale >= 0.75;
            const breathBoost = glow.showHalo && !ringOk ? 1.8 : 1.0, gb = glow.glowBoost || 1.0;
            const breathOuterR = Math.min(sunBaseR * (1.5 + t * 0.9 * glow.breathAmp), sizeCap);
            const bodyStop = Math.min(sunBaseR / breathOuterR, 0.72), peakStop = bodyStop + (1 - bodyStop) * 0.45;
            const peakAlpha = (Math.min(0.62, (0.15 + t * 0.27 * glow.breathAmp) * gb)).toFixed(3);
            const boostedPeakAlpha = (Math.min(0.62, (0.15 + t * 0.27 * glow.breathAmp) * breathBoost * gb)).toFixed(3);
            const usedPeakAlpha = breathBoost === 1.0 ? peakAlpha : boostedPeakAlpha;
            const roundedR = Math.round(breathOuterR);
            if (!this._breathGlowCache ||
                this._breathGlowCache.r !== roundedR ||
                this._breathGlowCache.pa !== usedPeakAlpha ||
                this._breathGlowCache.colorKey !== `${gR}_${gG}_${gB}`) {
                const bg = ctx.createRadialGradient(0, 0, 0, 0, 0, breathOuterR);
                bg.addColorStop(0,        `rgba(${gR},${gG},${gB},0)`);
                bg.addColorStop(bodyStop, `rgba(${gR},${gG},${gB},0)`);
                bg.addColorStop(peakStop, `rgba(${gR},${gG},${gB},${usedPeakAlpha})`);
                bg.addColorStop(1,        `rgba(${gR},${gG},${gB},0)`);
                this._breathGlowCache = { grad: bg, r: roundedR, pa: usedPeakAlpha, colorKey: `${gR}_${gG}_${gB}` };
            }
            ctx.globalAlpha = fadeOpacity; ctx.fillStyle = this._breathGlowCache.grad; fillCircle(ctx, 0, 0, breathOuterR);
                    if (!this._sunDiscGrad || this._sunDiscGradR !== sunBaseR) {
                const g = ctx.createRadialGradient(0, 0, 0, 0, 0, sunBaseR * 3.0);
                if (this._isLightBackground) {
                    g.addColorStop(0.00, 'rgba(255, 255, 255, 1)'); g.addColorStop(0.10, 'rgba(255, 255, 240, 0.98)');
                    g.addColorStop(0.28, 'rgba(255, 242, 170, 0.94)'); g.addColorStop(0.33, 'rgba(255, 210, 90, 0.82)');
                    g.addColorStop(0.36, 'rgba(255, 198, 65, 0.60)'); g.addColorStop(0.42, 'rgba(255, 188, 52, 0.38)');
                    g.addColorStop(0.70, 'rgba(255, 178, 42, 0.20)'); g.addColorStop(1.00, 'rgba(255, 162, 32, 0)');
                } else {
                    g.addColorStop(0.00, 'rgba(255, 238, 200, 1)'); g.addColorStop(0.10, 'rgba(255, 230, 178, 0.96)');
                    g.addColorStop(0.28, 'rgba(255, 214, 130, 0.90)'); g.addColorStop(0.33, 'rgba(255, 188, 72, 0.78)');
                    g.addColorStop(0.36, 'rgba(255, 176, 54, 0.56)'); g.addColorStop(0.42, 'rgba(255, 188, 52, 0.38)');
                    g.addColorStop(0.70, 'rgba(255, 178, 42, 0.20)'); g.addColorStop(1.00, 'rgba(255, 162, 32, 0)');
                }
                this._sunDiscGrad = g; this._sunDiscGradR = sunBaseR;
            }
            ctx.fillStyle = this._sunDiscGrad; fillCircle(ctx, 0, 0, sunBaseR * 3.0);
            // ---- HALO RINGS (same glow.color as annulus; skipped when rings can't fit) ----
            if (ringOk) {
                const r1Inner = sunBaseR * 2.0 * ringScale, r1Outer = sunBaseR * 3.6 * ringScale, r2Inner = sunBaseR * 3.8 * ringScale;
                const r2Outer = sunBaseR * 5.8 * ringScale;
                const colorKey = `${gR}_${gG}_${gB}`;
                if (!this._haloGrad || this._haloGradR !== r2Outer || this._haloGradColor !== colorKey) {
                    const g1 = ctx.createRadialGradient(0, 0, r1Inner, 0, 0, r1Outer);
                    g1.addColorStop(0,    `rgba(${gR},${gG},${gB},0)`);
                    g1.addColorStop(0.25, `rgba(${gR},${gG},${gB},0.10)`);
                    g1.addColorStop(0.45, `rgba(${gR},${gG},${gB},0.18)`);
                    g1.addColorStop(0.65, `rgba(${gR},${gG},${gB},0.11)`);
                    g1.addColorStop(1,    `rgba(${gR},${gG},${gB},0)`);
                    const g2 = ctx.createRadialGradient(0, 0, r2Inner, 0, 0, r2Outer);
                    g2.addColorStop(0,   `rgba(${gR},${gG},${gB},0)`);
                    g2.addColorStop(0.3, `rgba(${gR},${gG},${gB},0.06)`);
                    g2.addColorStop(0.5, `rgba(${gR},${gG},${gB},0.10)`);
                    g2.addColorStop(0.7, `rgba(${gR},${gG},${gB},0.055)`);
                    g2.addColorStop(1,   `rgba(${gR},${gG},${gB},0)`);
                    this._haloGrad = { g1, g2, r1: r1Outer, r2: r2Outer };
                    this._haloGradR = r2Outer; this._haloGradColor = colorKey;
                }
                ctx.globalAlpha = fadeOpacity * Math.min(1.0, (0.45 + t * 0.65) * gb); ctx.fillStyle = this._haloGrad.g1;
                fillCircle(ctx, 0, 0, this._haloGrad.r1); ctx.fillStyle = this._haloGrad.g2; fillCircle(ctx, 0, 0, this._haloGrad.r2);
            }
        } else {
            // ---- DIFFUSE MODE (sun-behind-clouds backlight) ----
            const csGlowScale = sunBaseR / 26, outerR = Math.min(92 * csGlowScale * glow.sizeMul, sizeCap);
            const coreR  = Math.min(42 * csGlowScale * glow.sizeMul, sizeCap * 0.45);
            if (!this._diffuseGlowCache ||
                this._diffuseGlowCache.key !== glow.cacheKey ||
                this._diffuseGlowCache.outerR !== outerR) {
                const outer = ctx.createRadialGradient(0, 0, 0, 0, 0, outerR);
                outer.addColorStop(0,    `rgba(${gR},${gG},${gB},0.58)`);
                outer.addColorStop(0.14, `rgba(${gR},${gG},${gB},0.32)`);
                outer.addColorStop(0.32, `rgba(${gR},${gG},${gB},0.12)`);
                outer.addColorStop(0.60, `rgba(${gR},${gG},${gB},0.025)`);
                outer.addColorStop(1,    `rgba(${gR},${gG},${gB},0)`);
                const core = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
                core.addColorStop(0,    `rgba(${gR},${gG},${gB},0.48)`);
                core.addColorStop(0.35, `rgba(${gR},${gG},${gB},0.18)`);
                core.addColorStop(1,    `rgba(${gR},${gG},${gB},0)`);
                this._diffuseGlowCache = { outer, core, outerR, coreR, key: glow.cacheKey };
            }
            // Subtle opacity breath — slow pulse matches heavy atmosphere
            const breathMod = 1.0 + (t - 0.5) * 0.20 * glow.breathAmp, dc = this._diffuseGlowCache;
            ctx.globalAlpha = Math.min(1.0, fadeOpacity * glow.intensity * breathMod);
            ctx.fillStyle = dc.outer; fillCircle(ctx, 0, 0, dc.outerR); ctx.fillStyle = dc.core;
            fillCircle(ctx, 0, 0, dc.coreR);
        }
        ctx.restore();
    }
    _drawCelestialClouds(ctx, w, h, effectiveWind) {
        const fadeOpacity = this._layerFadeProgress.clouds; if (fadeOpacity <= 0) return; const len = this._celestialClouds.length;
        ctx.globalAlpha = fadeOpacity;
        for (let i = 0; i < len; i++) {
            const cloud = this._celestialClouds[i]; if (!cloud._bakedCanvas) continue; const sunUnit = cloud._sunUnit !== undefined ? cloud._sunUnit : 1.0;
            cloud.driftPhase += 0.008; cloud.breathPhase += cloud.breathSpeed; const driftX = Math.sin(cloud.driftPhase) * 12 * sunUnit;
            const driftY = Math.cos(cloud.driftPhase * 0.7) * 4 * sunUnit; cloud.x = cloud.baseX + driftX + effectiveWind * 0.3;
            cloud.y = cloud.baseY + driftY; const driftClamp = 60 * sunUnit;
            if (cloud.x > cloud.baseX + driftClamp) cloud.x = cloud.baseX + driftClamp;
            if (cloud.x < cloud.baseX - driftClamp) cloud.x = cloud.baseX - driftClamp;
            const breathScale = 1 + Math.sin(cloud.breathPhase) * 0.02, vSquash = cloud._vSquash !== undefined ? cloud._vSquash : 0.55;
            const scaleX = cloud.scale * breathScale, scaleY = cloud.scale * vSquash * breathScale, drawX = cloud.x + cloud._bakeOffX * scaleX;
            const drawY = cloud.y + cloud._bakeOffY * scaleY, drawW = cloud._bakeW * scaleX, drawH = cloud._bakeH * scaleY;
            if (drawX + drawW < 0 || drawX > w || drawY + drawH < 0 || drawY > h) continue;
            ctx.drawImage(cloud._bakedCanvas, drawX, drawY, drawW, drawH);
        }
        ctx.globalAlpha = 1;
    }
    _drawClouds(ctx, cloudList, w, h, effectiveWind, globalOpacity) {
        if (cloudList.length === 0) return; const fadeOpacity = this._layerFadeProgress.clouds; if (fadeOpacity <= 0) return;
        const rs = this._renderState; if (!rs) return; const yLift = h * 0.06;
        ctx.globalAlpha = fadeOpacity;
        for (let i = 0; i < cloudList.length; i++) {
            const cloud = cloudList[i], depthFactor = 1 + cloud.layer * 0.2;
            cloud.x += cloud.speed * effectiveWind * depthFactor; if (cloud.x > w + 280) cloud.x = -280; if (cloud.x < -280) cloud.x = w + 280;
            cloud.breathPhase += cloud.breathSpeed; if (!cloud._bakedCanvas) continue; const breathScale = 1 + Math.sin(cloud.breathPhase) * 0.022;
            const drawScale = cloud.scale * breathScale, yDrift = Math.sin(cloud.breathPhase * 2.4) * 3.5, destX = cloud.x + cloud._bakeOffX * drawScale;
            const destY = (cloud.y - yLift + yDrift) + cloud._bakeOffY * drawScale;
            const destW = cloud._bakeLogicalW * drawScale, destH = cloud._bakeLogicalH * drawScale;
                    if (destX + destW < 0 || destX > w || destY + destH < 0 || destY > h) continue;
            ctx.drawImage(
                cloud._bakedCanvas,
                cloud._atlasX, cloud._atlasY, cloud._atlasW, cloud._atlasH,
                destX, destY, destW, destH
            );
        }
        ctx.globalAlpha = 1;
    }
    _drawStars(ctx, w, h, dpr) {
        const starFade = this._layerFadeProgress.stars, starMode = this._renderState.starMode;
        if (starFade <= 0.01 || starMode === 'hidden') return; const len = this._stars.length; const isGolden = starMode === 'golden';
        const immH = this._isImmersive ? h * 0.95 : 0, dotR = isGolden ? 0.55 : 0.5, batches = new Map();
        if (this._milkyWay) {
            ctx.globalAlpha = starFade; ctx.drawImage(this._milkyWay, 0, 0); ctx.globalAlpha = 1;
        }
        for (let i = 0; i < len; i++) {
            const s = this._stars[i]; s.phase += s.rate;
            const twinkle = Math.sin(s.phase) + Math.sin(s.phase * 3) * 0.5 + Math.sin(s.phase * 0.3) * 0.25;
            const size = s.baseSize * (1 + twinkle * 0.30), horizFade = immH > 0 ? (1 - Math.pow(s.y / immH, 3)) : 1.0;
            const op = Math.min(1, Math.max(0, s.brightness * (1 + twinkle * 0.22) * starFade * horizFade));
            if (op <= 0.05) continue;
            if (s.tier === 'hero') {
                ctx.globalCompositeOperation = isGolden ? 'source-over' : 'lighter'; ctx.globalAlpha = isGolden ? op * s._bodyAlphaRatio : op;
                ctx.fillStyle = s._fill; fillCircle(ctx, s.x, s.y, size * s._bodyR);
                if (s._haloTex) {
                    ctx.globalAlpha = op; const scale = size / s._haloRefSize; const drawSize = s._haloTexSize * scale;
                    ctx.drawImage(s._haloTex, s.x - drawSize * 0.5, s.y - drawSize * 0.5, drawSize, drawSize);
                }
                const spike = size * s._spikeLen; ctx.globalAlpha = op * s._spikeRatio; ctx.strokeStyle = s._stroke;
                ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(s.x - spike, s.y); ctx.lineTo(s.x + spike, s.y);
                ctx.moveTo(s.x, s.y - spike); ctx.lineTo(s.x, s.y + spike); ctx.stroke();
                if (!isGolden && s._crownLen) {
                    const crown = size * s._crownLen; ctx.globalAlpha = op * s._crownRatio; ctx.translate(s.x, s.y);
                    ctx.rotate(s.phase * 0.18); ctx.strokeStyle = s._stroke; ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    for (let r = 0; r < 4; r++) {
                        const a = (r / 4) * TWO_PI + Math.PI / 4; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * crown, Math.sin(a) * crown);
                    }
                    ctx.stroke(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                }
                ctx.globalCompositeOperation = 'source-over';
            } else {
                        const qOp = ((op * 20 + 0.5) | 0) / 20;
                const key = s._fill + '|' + qOp; let batch = batches.get(key);
                if (!batch) {
                    batch = { fill: s._fill, op: qOp, items: [] };
                    batches.set(key, batch);
                }
                batch.items.push(s.x, s.y, size * dotR);
            }
        }
        for (const batch of batches.values()) {
            if (isGolden) ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = batch.op; ctx.fillStyle = batch.fill;
            ctx.beginPath(); const items = batch.items;
            for (let j = 0; j < items.length; j += 3) {
                ctx.moveTo(items[j] + items[j + 2], items[j + 1]); ctx.arc(items[j], items[j + 1], items[j + 2], 0, TWO_PI);
            }
            ctx.fill(); if (isGolden) ctx.globalCompositeOperation = 'source-over';
        }
        ctx.globalAlpha = 1;
    }
    _drawShootingStars(ctx, w, h) {
        const fadeOpacity = this._layerFadeProgress.stars, dpr = this._cachedDimensions.dpr;
        const isUltra = this._perfEffects >= 2;
        const trailCap = isUltra ? 36 : TRAIL_CAP_SHOOTING_STAR;
        if (Math.random() < 0.002145 && this._shootingStars.length < LIMITS.MAX_SHOOTING_STARS) {
            let spawnX;
            if (Math.random() < 0.70) {
                spawnX = Math.random() * (w * 0.6);
            } else {
                spawnX = (w * 0.6) + Math.random() * (w * 0.4);
            }
            const dirX = Math.random() < 0.3 ? -1 : 1, bolide = Math.random() < 0.18;
            const speed = bolide ? 3.5 + Math.random() * 2.0 : 5.0 + Math.random() * 5.0;
            const isInk = !this._isThemeDark, colorRoll = Math.random();
            let headRgb, tailRgb;
            if (isInk) {
                headRgb = 'rgb(50,55,65)'; tailRgb = 'rgb(60,65,80)';
            } else if (colorRoll < 0.55) {
                headRgb = 'rgb(255,255,255)'; tailRgb = 'rgb(255,255,240)';
            } else if (colorRoll < 0.75) {
                headRgb = 'rgb(255,245,210)'; tailRgb = 'rgb(255,230,180)';
            } else if (colorRoll < 0.92) {
                headRgb = 'rgb(210,255,225)'; tailRgb = 'rgb(180,240,200)';
            } else {
                headRgb = 'rgb(255,210,160)'; tailRgb = 'rgb(255,185,130)';
            }
            this._shootingStars.push({ x: spawnX, y: Math.random() * (h * 0.5), vx: speed * dirX, vy: 2.0 + Math.random() * 2.0, life: 1.0, decay: bolide ? 0.032 : 0.045, size: bolide ? 2.5 + Math.random() * 1.5 : 1.5 + Math.random() * 1.5, _bolide: bolide, _headRgb: headRgb, _tailRgb: tailRgb, tailBuf: new Float32Array(trailCap * 2), tailHead: 0, tailLen: 0, _trailCap: trailCap });
        }
        ctx.lineCap = 'round';
        for (let i = this._shootingStars.length - 1; i >= 0; i--) {
            const s = this._shootingStars[i]; s.x += s.vx; s.vy += 0.045;
            s.y += s.vy; s.life -= s.decay; const sCap = s._trailCap || TRAIL_CAP_SHOOTING_STAR; s.tailBuf[s.tailHead * 2] = s.x;
            s.tailBuf[s.tailHead * 2 + 1] = s.y; s.tailHead = (s.tailHead + 1) % sCap;
            if (s.tailLen < sCap) s.tailLen++;
            if (s.life <= 0) {
                this._shootingStars.splice(i, 1);
                continue;
            }
            const opacity = s.life * fadeOpacity; ctx.globalAlpha = opacity; ctx.fillStyle = s._headRgb;
            const flare = s._bolide && s.life < 0.15 ? 1 + (0.15 - s.life) * 8 : 1;
            const headSize = s.size * (0.3 + s.life * 0.7) * flare; fillCircle(ctx, s.x, s.y, headSize); ctx.lineWidth = headSize * 0.8;
            ctx.strokeStyle = s._tailRgb;
            // Alpha-banded shooting star tail: 4 bands (22 segments → 4 strokes).
            // Linear alpha fade approximated at band midpoints.
            const tailSegs = s.tailLen - 1;
            const tailBands = isUltra ? 8 : 4;
            for (let band = 0; band < tailBands; band++) {
                const jStart = (band * tailSegs / tailBands) | 0, jEnd = ((band + 1) * tailSegs / tailBands) | 0;
                if (jStart >= jEnd) continue; const midJ = (jStart + jEnd) * 0.5; ctx.globalAlpha = opacity * (1 - midJ / s.tailLen);
                ctx.beginPath();
                for (let j = jStart; j <= jEnd; j++) {
                    const idx = (((s.tailHead - 1 - j) % sCap) + sCap) % sCap;
                    const px = s.tailBuf[idx * 2], py = s.tailBuf[idx * 2 + 1]; if (j === jStart) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.stroke();
            }
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 1;
    }
    _drawComets(ctx, w, h) {
        const badWeather = this._renderState.isBadWeatherForComets, dpr = this._cachedDimensions.dpr;
        if (this._isNight && !badWeather && this._comets.length === 0 && Math.random() < (this._perfEffects >= 2 ? 0.0005 : 0.0002728)) {
            const startX = Math.random() < 0.5 ? -60 : w + 60, dir = startX < 0 ? 1 : -1, speed = 2.2 + Math.random() * 1.3, isInk = !this._isThemeDark;
            const colorRoll = Math.random(); let coreRgb, glowRgb, tailRgb;
            if (isInk) {
                coreRgb = '50,60,75'; glowRgb = '70,85,105'; tailRgb = 'rgb(65,80,100)';
            } else if (colorRoll < 0.50) {
                coreRgb = '220,240,255'; glowRgb = '100,200,255'; tailRgb = 'rgb(160,210,255)';
            } else if (colorRoll < 0.78) {
                coreRgb = '200,255,220'; glowRgb = '120,220,160'; tailRgb = 'rgb(150,230,180)';
            } else {
                coreRgb = '255,240,200'; glowRgb = '230,190,100'; tailRgb = 'rgb(240,210,150)';
            }
            this._comets.push({ x: startX, y: Math.random() * (h * 0.4), vx: speed * dir, vy: speed * 0.15, size: 1.5 + Math.random(), life: 1.2, _coreRgb: coreRgb, _glowRgb: glowRgb, _tailRgb: tailRgb, tailBuf: new Float32Array(TRAIL_CAP_COMET * 2), tailHead: 0, tailLen: 0 });
        }
        const fadeOpacity = this._layerFadeProgress.stars; if (fadeOpacity <= 0) return;
        for (let i = this._comets.length - 1; i >= 0; i--) {
            const c = this._comets[i]; c.x += c.vx; c.y += c.vy;
            c.life -= 0.005;
            if (c.life <= 0) {
                this._comets.splice(i, 1);
                continue;
            }
            c.tailBuf[c.tailHead * 2] = c.x; c.tailBuf[c.tailHead * 2 + 1] = c.y; c.tailHead = (c.tailHead + 1) % TRAIL_CAP_COMET;
            if (c.tailLen < TRAIL_CAP_COMET) c.tailLen++;
                    if (c.tailLen > 2) {
                const newestIdx = (((c.tailHead - 1) % TRAIL_CAP_COMET) + TRAIL_CAP_COMET) % TRAIL_CAP_COMET;
                const oldestIdx = (((c.tailHead - c.tailLen) % TRAIL_CAP_COMET) + TRAIL_CAP_COMET) % TRAIL_CAP_COMET;
                const hx = c.tailBuf[newestIdx * 2], hy = c.tailBuf[newestIdx * 2 + 1];
                const tx = c.tailBuf[oldestIdx * 2], ty = c.tailBuf[oldestIdx * 2 + 1];
                const currentDist = Math.sqrt((hx - tx) ** 2 + (hy - ty) ** 2); if (currentDist > 170) c.tailLen--;
            }
            const opacity = Math.min(1, c.life) * fadeOpacity;
            if (!c._g) {
                const r = c.size * 4, g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
                g.addColorStop(0, `rgba(${c._coreRgb},1)`);
                g.addColorStop(0.4, `rgba(${c._glowRgb},0.4)`);
                g.addColorStop(1, `rgba(${c._glowRgb},0)`);
                c._g = g;
            }
            ctx.globalAlpha = opacity; ctx.translate(c.x, c.y); ctx.fillStyle = c._g;
            fillCircle(ctx, 0, 0, c.size * 4); ctx.translate(-c.x, -c.y); ctx.lineCap = 'butt';
            ctx.lineJoin = 'round'; ctx.strokeStyle = c._tailRgb; const tailSegs = c.tailLen - 1;
            for (let band = 0; band < 8; band++) {
                const jStart = (band * tailSegs / 8) | 0, jEnd = ((band + 1) * tailSegs / 8) | 0;
                if (jStart >= jEnd) continue; const midP = (jStart + jEnd) * 0.5 / c.tailLen; ctx.lineWidth = c.size * (1 - midP * 0.8);
                ctx.globalAlpha = opacity * (1 - midP) * 0.6; ctx.beginPath();
                for (let j = jStart; j <= jEnd; j++) {
                    const idx = (((c.tailHead - 1 - j) % TRAIL_CAP_COMET) + TRAIL_CAP_COMET) % TRAIL_CAP_COMET;
                    const px = c.tailBuf[idx * 2], py = c.tailBuf[idx * 2 + 1]; if (j === jStart) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    _drawMoon(ctx, w, h) {
        if (!this._isTimeNight) return; if (!this._stateInitialized || !this._renderGate.isRevealed) return;
        const fadeOpacity = this._layerFadeProgress.stars; if (fadeOpacity <= 0.05) return; const celestial = this._getCelestialPosition(w, h);
        const moonX = celestial.x, moonY = celestial.y;
            const sunBaseR = this._celestialSize ? this._celestialSize / 2 : 31;
        const moonRadius = sunBaseR * 0.85;
        const moonScale = moonRadius / 18; // crater geometry authored at r=18
        const useLightColors = !this._isThemeDark;
            const rawMoonStyle = (this._config.celestial_moon_style || '').toLowerCase();
        const isColoredStyle = rawMoonStyle === 'yellow' || rawMoonStyle === 'blue'
            || rawMoonStyle === 'purple' || rawMoonStyle === 'grey';
        const mStyleKey = isColoredStyle ? rawMoonStyle : (useLightColors ? 'blue' : 'dark');
        ctx.save();
        if (this._moonRotationRad) {
            ctx.translate(moonX, moonY); ctx.rotate(this._moonRotationRad); ctx.translate(-moonX, -moonY);
        }
            const cloudCover = (this._params && this._params.cloud) || 0;
        const glowWeatherScale = cloudCover > 30 ? 0.4 : cloudCover > 20 ? 0.6 : cloudCover > 10 ? 0.8 : 1;
        const glowIntensity = 0.23 + this._moonPhaseConfig.illumination * 0.18;
        const atmScale = (!useLightColors && (this._params && this._params.atmosphere) === 'fair') ? 0.79 : 1.0;
        let effectiveGlow = glowIntensity * fadeOpacity * glowWeatherScale * atmScale;
        if (useLightColors) effectiveGlow *= 0.85;
            const cacheKey = mStyleKey + (useLightColors ? 'L' : 'D');
        if (!this._moonCache || this._moonCache.key !== cacheKey || this._moonCache.mr !== moonRadius) {
            this._moonCache = this._buildMoonCache(ctx, moonRadius, moonScale, w, h,
                useLightColors, mStyleKey);
            this._moonCache.key = cacheKey; this._moonCache.mr = moonRadius;
        }
        const mc = this._moonCache;
        if (useLightColors) {
            ctx.globalCompositeOperation = 'source-over'; const lightGlowR = mc.glowR; ctx.save();
            ctx.translate(moonX, moonY); ctx.globalAlpha = effectiveGlow * mc.glowPeak; ctx.fillStyle = mc.glow;
            fillCircle(ctx, 0, 0, lightGlowR); ctx.restore(); ctx.beginPath();
            ctx.arc(moonX, moonY, moonRadius + 1.5, 0, TWO_PI);
            const rsKey = MOON_STYLE_COLORS.ringStroke[mStyleKey] ? mStyleKey : 'yellow';
            const ringCfg = MOON_STYLE_COLORS.ringStroke[rsKey]; ctx.globalAlpha = ringCfg.op * fadeOpacity;
            ctx.strokeStyle = ringCfg._rgb || (ringCfg._rgb = `rgb(${ringCfg.rgb})`);
            ctx.lineWidth = 1.5; ctx.stroke(); ctx.globalAlpha = 1;
        } else {
                    const maxR = Math.min(
                Math.min(h, w) * 0.28 * moonScale,
                moonX, w - moonX, moonY, h - moonY
            );
                    if (!mc.darkGlow || mc.darkGlowR !== maxR) {
                const g = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR); g.addColorStop(0,   'rgba(180, 200, 255, 1)');
                g.addColorStop(0.5, 'rgba(165, 195, 245, 0.4)'); g.addColorStop(1,   'rgba(150, 180, 220, 0)'); mc.darkGlow = g;
                mc.darkGlowR = maxR;
            }
            ctx.globalCompositeOperation = 'screen'; ctx.save(); ctx.translate(moonX, moonY);
            ctx.globalAlpha = effectiveGlow; ctx.fillStyle = mc.darkGlow; fillCircle(ctx, 0, 0, maxR);
            ctx.restore();
        }
        ctx.globalCompositeOperation = 'source-over';
            if (!useLightColors) {
            ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            fillCircle(ctx, moonX, moonY, moonRadius - 0.5); ctx.restore();
        } else {
            ctx.save(); ctx.globalAlpha = fadeOpacity;
            ctx.fillStyle = MOON_STYLE_COLORS.lightDisc[mStyleKey] || 'rgb(228,234,248)';
            fillCircle(ctx, moonX, moonY, moonRadius - 0.5); ctx.restore();
        }
        ctx.save(); ctx.beginPath(); ctx.arc(moonX, moonY, moonRadius, 0, TWO_PI);
        ctx.clip(); const illumination = this._moonPhaseConfig.illumination; const direction = this._moonPhaseConfig.direction;
        if (illumination <= 0) {
            const nmKey = mStyleKey, nmFills = MOON_STYLE_COLORS.newMoon[nmKey];
            for (let fi = 0; fi < nmFills.length; fi++) {
                const fill = nmFills[fi]; ctx.globalAlpha = fill.op * fadeOpacity;
                ctx.fillStyle = fill._rgb || (fill._rgb = `rgb(${fill.rgb})`);
                fillCircle(ctx, moonX, moonY, moonRadius);
            }
            ctx.globalAlpha = 1;
        } else if (illumination >= 1) {
                    ctx.save();
            ctx.translate(moonX, moonY); ctx.globalAlpha = fadeOpacity * mc.fullDiscPeak; ctx.fillStyle = mc.fullDisc;
            fillCircle(ctx, 0, 0, moonRadius); ctx.restore();
        } else {
                    const dsKey = mStyleKey;
            const ds = MOON_STYLE_COLORS.darkSide[dsKey]; ctx.globalAlpha = ds.op * fadeOpacity;
            ctx.fillStyle = ds._rgb || (ds._rgb = `rgb(${ds.rgb})`);
            fillCircle(ctx, moonX, moonY, moonRadius); ctx.globalAlpha = 1;
            if (!useLightColors) {
                const earthshineOp = (1 - illumination) * 0.08 * fadeOpacity; ctx.globalAlpha = earthshineOp; ctx.fillStyle = 'rgb(100, 115, 145)';
                fillCircle(ctx, moonX, moonY, moonRadius); ctx.globalAlpha = 1;
            }
            const terminatorWidth = Math.abs(1 - illumination * 2) * moonRadius, isGibbous = illumination > 0.5;
            ctx.beginPath();
            if (direction === 'right') {
                ctx.arc(moonX, moonY, moonRadius, -Math.PI / 2, Math.PI / 2, false);
                ctx.ellipse(moonX, moonY, terminatorWidth, moonRadius, 0, Math.PI / 2, -Math.PI / 2, !isGibbous);
            } else {
                ctx.arc(moonX, moonY, moonRadius, Math.PI / 2, -Math.PI / 2, false);
                ctx.ellipse(moonX, moonY, terminatorWidth, moonRadius, 0, -Math.PI / 2, Math.PI / 2, !isGibbous);
            }
            ctx.closePath();
                    ctx.save();
            ctx.translate(moonX, moonY); ctx.globalAlpha = fadeOpacity * mc.partDiscPeak; ctx.fillStyle = mc.partDisc;
            ctx.fill(); ctx.restore();
        }
        ctx.save(); ctx.translate(moonX, moonY); ctx.globalAlpha = fadeOpacity;
        ctx.fillStyle = mc.limbDark; fillCircle(ctx, 0, 0, moonRadius); ctx.restore();
        ctx.restore();
        // Craters — drawn from MOON_CRATERS geometry table, scaled with moon size.
        // Unrolled: avoids per-frame array allocation in hot path.
        if (illumination > 0.05) {
            const op = fadeOpacity * Math.min(1, illumination * 4.0), ms = moonScale, lc = useLightColors;
            ctx.save(); ctx.beginPath(); ctx.arc(moonX, moonY, moonRadius, 0, TWO_PI);
            ctx.clip(); ctx.shadowOffsetX = 0.8 * ms; ctx.shadowOffsetY = 0.8 * ms;
            ctx.shadowBlur = 2.0 * ms; ctx.shadowColor = lc ? 'rgba(100,110,140,0.25)' : 'rgba(0,0,0,0.45)'; ctx.globalAlpha = op * (lc ? 0.12 : 0.13);
            ctx.fillStyle = lc ? 'rgb(180,190,210)' : 'rgb(30,35,50)';
            for (let m = 0; m < MOON_CRATERS.maria.length; m++) {
                const c = MOON_CRATERS.maria[m]; ctx.beginPath();
                ctx.ellipse(moonX + c.dx * ms, moonY + c.dy * ms, c.rx * ms, c.ry * ms, c.rot, 0, TWO_PI);
                ctx.fill();
            }
            ctx.globalAlpha = op * (lc ? 0.16 : 0.22); ctx.fillStyle = lc ? 'rgb(170,180,200)' : 'rgb(25,30,45)';
            for (let m = 0; m < MOON_CRATERS.mariaInner.length; m++) {
                const c = MOON_CRATERS.mariaInner[m]; ctx.beginPath();
                ctx.ellipse(moonX + c.dx * ms, moonY + c.dy * ms, c.rx * ms, c.ry * ms, c.rot, 0, TWO_PI);
                ctx.fill();
            }
            ctx.shadowColor = 'transparent'; ctx.globalAlpha = op * (lc ? 0.10 : 0.13); ctx.fillStyle = lc ? 'rgb(175,185,205)' : 'rgb(25,30,45)';
            for (let m = 0; m < MOON_CRATERS.detail.length; m++) {
                const c = MOON_CRATERS.detail[m]; fillCircle(ctx, moonX + c.dx * ms, moonY + c.dy * ms, c.r * ms);
            }
            ctx.globalAlpha = op * (lc ? 0.10 : 0.12); ctx.fillStyle = lc ? 'rgb(255,255,255)' : 'rgb(200,210,230)';
            for (let m = 0; m < MOON_CRATERS.rimHighlights.length; m++) {
                const c = MOON_CRATERS.rimHighlights[m]; fillCircle(ctx, moonX + c.dx * ms, moonY + c.dy * ms, c.r * ms);
            }
            ctx.globalAlpha = 1; ctx.restore();
        }
        ctx.restore();
    }
    _drawRain(ctx, w, h, effectiveWind) {
        const fadeOpacity = this._layerFadeProgress.precipitation; if (fadeOpacity <= 0) return; const isDay = this._isLightBackground;
        const rgbBase = this._renderState.rainRgb, len = this._rain.length, dpr = this._cachedDimensions.dpr;
        if (!this._rainTex) return;
        for (let i = 0; i < len; i++) {
            const pt = this._rain[i]; pt.turbulence += 0.025; const turbX = Math.sin(pt.turbulence) * 0.4;
            const speedFactor = (1 + this._windSpeed * 0.25) * (pt.z * 0.8 + 0.2), moveX = (effectiveWind * 1.8 + turbX) * (pt.z * 0.65 + 0.35);
            const moveY = (pt.speedY * speedFactor); pt.x += moveX; pt.y += moveY;
            if (pt.y > h + 10) {
                pt.y = -40 - (Math.random() * 20); pt.x = Math.random() * w;
            }
            if (pt.x > w + 20) pt.x = -20;
            else if (pt.x < -20) pt.x = w + 20;
            const baseOp = isDay ? 0.75 : 0.60, finalOp = (pt.z * baseOp) * fadeOpacity * pt.op;
            if (finalOp < 0.02) continue; const dropLen = pt.len * (1.0 + (this._windSpeed * 0.3)); const width = Math.max(0.6, pt.z * 1.2);
            ctx.translate(pt.x, pt.y); ctx.rotate(Math.atan2(moveY, moveX)); ctx.globalAlpha = finalOp;
            ctx.drawImage(this._rainTex, -dropLen, -width / 2, dropLen, width); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        ctx.globalAlpha = 1;
    }
    _drawSnow(ctx, w, h, effectiveWind) {
        const fadeOpacity = this._layerFadeProgress.precipitation; if (fadeOpacity <= 0) return; const len = this._snow.length;
        const isLight = this._isLightBackground; if (!this._snowTexFg) return;
        for (let i = 0; i < len; i++) {
            const pt = this._snow[i]; pt.wobblePhase += pt.wobbleSpeed; const wobble = Math.sin(pt.wobblePhase) * 1.5;
            pt.turbulence += 0.01; const turbX = Math.sin(pt.turbulence) * 0.5; pt.y += pt.speedY;
            pt.x += (wobble + turbX + effectiveWind * 0.8) * (pt.z * 0.65 + 0.35);
            if (pt.y > h + 5) {
                pt.y = -5; pt.x = Math.random() * w;
            }
            if (pt.x > w + 10) pt.x = -10;
            else if (pt.x < -10) pt.x = w + 10;
            const shimmer = 0.92 + Math.sin(pt.wobblePhase * 2.5) * 0.08, glimmer = 0.8 + Math.sin(pt.wobblePhase * 3) * 0.2;
            const finalOpacity = pt.op * fadeOpacity * glimmer, drawSize = pt.size * shimmer;
            if (pt.z > 0.7) {
                        const gMul = isLight ? 1.4 : 1.0;
                const gRad = isLight ? 0.9 : 1.5, r = drawSize * gRad;
                ctx.globalAlpha = Math.min(1, finalOpacity * gMul); ctx.drawImage(this._snowTexFg, pt.x - r, pt.y - r, r * 2, r * 2);
            } else {
                        const smallR = drawSize * 0.75;
                const alphaOp = isLight ? 1.3 : 0.8; ctx.globalAlpha = Math.min(1, finalOpacity * alphaOp);
                ctx.drawImage(this._snowTexBg, pt.x - smallR, pt.y - smallR, smallR * 2, smallR * 2);
            }
        }
        ctx.globalAlpha = 1;
    }
    _drawHail(ctx, w, h, effectiveWind) {
        const fadeOpacity = this._layerFadeProgress.precipitation; if (fadeOpacity <= 0) return; const len = this._hail.length;
        const isLight = this._isLightBackground, dpr = this._cachedDimensions.dpr;
        if (!this._hailTex) return;
        for (let i = 0; i < len; i++) {
            const pt = this._hail[i]; pt.turbulence += 0.035; const turbX = Math.sin(pt.turbulence) * 1.2;
            pt.y += pt.speedY * (1 + this._windSpeed * 0.35); pt.x += (effectiveWind * 2.5 + turbX) * (pt.z * 0.65 + 0.35); pt.rotation += pt.rotationSpeed;
            if (pt.y > h + 10) {
                pt.y = -15 - (Math.random() * 20); pt.x = Math.random() * w;
            }
            const baseOp = pt.z > 1.1 ? pt.op * 1.1 : pt.op * 0.75; ctx.globalAlpha = baseOp * fadeOpacity; ctx.translate(pt.x, pt.y);
            ctx.rotate(pt.rotation);
            ctx.drawImage(this._hailTex, -pt.size, -pt.size, pt.size * 2, pt.size * 2);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        ctx.globalAlpha = 1;
    }
    _drawLightning(ctx, w, h) {
        if (!(this._params && this._params.thunder)) return; const fadeOpacity = this._layerFadeProgress.effects;
        const isStandalone = this._config.card_style === 'standalone';
        if (Math.random() < 0.0072 && this._bolts.length < LIMITS.MAX_BOLTS) {
            this._flashOpacity = 0.92; this._flashHold = this._isLightBackground ? 7 : 6; this._bolts.push(this._createBolt(w, h));
            if (Math.random() < 0.25 && this._bolts.length < LIMITS.MAX_BOLTS) { this._bolts.push(this._createBolt(w, h)); }
        }
        if (!this._isLightBackground && isStandalone) {
            ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 0.18 * fadeOpacity;
            ctx.fillStyle = 'rgb(0, 0, 10)'; ctx.fillRect(0, 0, w, h); ctx.restore();
        }
        if (this._flashOpacity > 0) {
            if (this._flashHold > 0) {
                this._flashHold--;
            } else {
                this._flashOpacity *= this._isLightBackground ? 0.72 : 0.62;
                if (this._flashOpacity > 0.08 && this._flashOpacity < 0.45 && Math.random() < 0.12) {
                    this._flashOpacity = 0.5 + Math.random() * 0.25; this._flashHold = 2;
                }
            }
            if (isStandalone) {
                ctx.save();
                ctx.globalCompositeOperation = this._isThemeDark ? 'screen' : 'source-over';
                ctx.globalAlpha = this._flashOpacity * fadeOpacity * (this._isLightBackground ? 0.80 : 0.50);
                ctx.fillStyle = this._isLightBackground ? 'rgb(255, 255, 255)' : 'rgb(220, 235, 255)';
                ctx.fillRect(0, 0, w, h); ctx.restore();
            }
            if (this._flashOpacity < 0.005) this._flashOpacity = 0;
        }
        if (this._bolts.length > 0) {
            ctx.save();
            ctx.globalCompositeOperation = this._isThemeDark ? 'lighter' : 'source-over';
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            for (let i = this._bolts.length - 1; i >= 0; i--) {
                const bolt = this._bolts[i], segs = bolt.segments, segLen = segs.length;
                // Build trunk path once, stroke multiple times for glow layers
                ctx.beginPath();
                for (let j = 0; j < segLen; j++) {
                    const seg = segs[j];
                    if (!seg.branch) {
                        if (seg.y === 0) ctx.moveTo(seg.x, seg.y); ctx.lineTo(seg.nx, seg.ny);
                    }
                }
                // Glow passes (skip when glow has decayed to zero)
                if (bolt.glow > 0) {
                    // Pass 1: Wide diffuse glow (replaces shadowBlur = 20)
                    ctx.globalAlpha = bolt.glow * fadeOpacity * 0.15; ctx.strokeStyle = bolt._glowStroke; ctx.lineWidth = 24;
                    ctx.stroke();
                    // Pass 2: Medium glow halo
                    ctx.globalAlpha = bolt.glow * fadeOpacity * 0.3; ctx.lineWidth = 14; ctx.stroke();
                }
                // Pass 3: Outer visible stroke (always active while bolt lives)
                ctx.globalAlpha = bolt.alpha * 0.35 * fadeOpacity; ctx.strokeStyle = bolt._outerStroke; ctx.lineWidth = 8;
                ctx.stroke();
                // Pass 4: Hot white core (re-strokes same trunk path)
                ctx.globalAlpha = bolt.alpha * fadeOpacity; ctx.strokeStyle = bolt._coreStroke; ctx.lineWidth = 2.5;
                ctx.stroke();
                // Branches — thin secondary forks
                ctx.globalAlpha = bolt.alpha * 0.6 * fadeOpacity; ctx.strokeStyle = bolt._branchStroke; ctx.lineWidth = 1.5;
                for (let j = 0; j < segLen; j++) {
                    const seg = segs[j];
                    if (seg.branch) {
                        ctx.beginPath(); ctx.moveTo(seg.x, seg.y); ctx.lineTo(seg.nx, seg.ny);
                        ctx.stroke();
                    }
                }
                bolt.alpha -= 0.05; if (bolt.glow > 0) bolt.glow -= 0.075; if (bolt.alpha <= 0) this._bolts.splice(i, 1);
            }
            ctx.restore();
        }
    }
    _drawAurora(ctx, w, h) {
        if (!this._aurora) return; const fadeOpacity = this._layerFadeProgress.effects; this._aurora.phase += 0.006;
        ctx.save();
        ctx.globalCompositeOperation = this._isThemeDark ? 'lighter' : 'source-over';
        ctx.globalAlpha = fadeOpacity; const waves = this._aurora.waves; const waveLen = waves.length;
        for (let wi = 0; wi < waveLen; wi++) {
            const wave = waves[wi];
            if (!wave._g) {
                const g = ctx.createLinearGradient(0, wave.y - 20, 0, wave.y + 50); g.addColorStop(0, 'rgba(0, 0, 0, 0)'); g.addColorStop(0.3, wave.color);
                g.addColorStop(0.6, wave.color.replace(/[\d.]+\)$/, '0.1)')); g.addColorStop(1, 'rgba(0, 0, 0, 0)'); wave._g = g;
            }
            ctx.fillStyle = wave._g; ctx.beginPath();
            for (let x = 0; x <= w; x += 6) {
                const y = wave.y + Math.sin(x * wave.wavelength + this._aurora.phase * wave.speed * 100 + wave.offset) * wave.amplitude;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.lineTo(w, wave.y + 60); ctx.lineTo(0, wave.y + 60); ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
    _drawFog(ctx, w, h) {
        const fadeOpacity = this._layerFadeProgress.effects, len = this._fogBanks.length, dpr = this._cachedDimensions.dpr;
        for (let i = 0; i < len; i++) {
            const f = this._fogBanks[i]; f.x += f.speed; f.phase += 0.008;
            if (f.x > w + f.w / 2) f.x = -f.w / 2; if (f.x < -f.w / 2) f.x = w + f.w / 2; const undulation = Math.sin(f.phase) * 5;
            if (!f._g) {
                const color = this._isLightBackground ? '190,200,215' : (this._isTimeNight ? '85,90,105' : '72,81,95');
                const g = ctx.createRadialGradient(0, 0, 0, 0, 0, f.w / 2);
                g.addColorStop(0, `rgba(${color},1)`);
                g.addColorStop(0.5, `rgba(${color},0.6)`);
                g.addColorStop(1, `rgba(${color},0)`);
                f._g = g;
                f._baseOp = f.opacity * (1 + f.layer * 0.2) *
                    (this._isLightBackground ? 0.60 : 1.0);
            }
            const vSquash = 0.1 + f.layer * 0.18; ctx.scale(1, vSquash); const drawY = (f.y + undulation) / vSquash;
            ctx.globalAlpha = f._baseOp * fadeOpacity; ctx.translate(f.x, drawY); ctx.fillStyle = f._g;
            ctx.beginPath(); ctx.ellipse(0, 0, f.w / 2, f.h, 0, 0, TWO_PI); ctx.fill();
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        ctx.globalAlpha = 1;
    }
    _drawWindVapor(ctx, w, h, effectiveWind) {
        const fadeOpacity = this._layerFadeProgress.effects; if (fadeOpacity <= 0) return; if (!this._vaporTex) return;
        const p = this._params, windKmh = this._windKmh || 0, dpr = this._cachedDimensions.dpr, windNorm = Math.min(1.0, Math.max(0, windKmh / 50));
        const windIntensity = windNorm * windNorm, isWindy = p.windVapor === true, pool = this._windVapor.length;
        let activeCount, vaporOp, baseHStretch, speedMul;
        if (isWindy) {
            activeCount = pool; vaporOp = 1.0; baseHStretch = 1.2 + 0.8 * windIntensity; speedMul = 0.12 + 0.35 * windIntensity;
        } else if (windKmh >= 15) {
            activeCount = Math.round(pool * 0.75); vaporOp = 0.90; baseHStretch = 1.0 + 0.4 * windIntensity; speedMul = 0.06 + 0.18 * windIntensity;
        } else {
            activeCount = Math.round(pool * 0.58); vaporOp = 0.92; baseHStretch = 1.0; speedMul = 0.03;
        }
        if (this._isDarkDayImmersive) {
            activeCount = Math.max(activeCount, Math.round(pool * 0.58)); vaporOp = Math.max(vaporOp, 1.05);
        }
        const len = Math.min(pool, activeCount); if (len <= 0) return; const gustVal = this._windGust * windIntensity;
        const isDark = this._isThemeDark;
        const rotFade = isWindy ? 0 : (windKmh >= 15 ? Math.max(0, 1 - windIntensity * 2.0) : 1.0);
        const windThin = 1.0 - windIntensity * 0.25, shear = windIntensity * 0.12;
        ctx.globalCompositeOperation = isDark ? 'screen' : 'source-over';
        for (let i = 0; i < len; i++) {
            const v = this._windVapor[i]; v.phase += v.phaseSpeed * Math.max(speedMul, 0.04); const gustBoost = Math.max(0, gustVal) * v.gustWeight * 1.2;
            const baseVelocity = (v.speed * speedMul) + effectiveWind * speedMul; v.x += (baseVelocity + gustBoost) * (1 + this._windSpeed * 0.15);
            const undulation = Math.sin(v.phase) * v.drift; if (v.x > w + v.w) v.x = -v.w; if (v.x < -v.w * 1.5) v.x = w + v.w;
            const tierOp = isDark ? (0.28 + v.tier * 0.24) : (0.45 + v.tier * 0.28);
            const depthFade = 0.40 + (v.depthNorm || 0.5) * 0.60, gustOpBump = Math.max(0, gustVal) * 0.15;
            const hStretch = baseHStretch + Math.max(0, gustVal) * 0.25, drawW = v.w * hStretch, drawH = Math.min(10, v.w * v.squash * windThin);
            ctx.globalAlpha = Math.min(1.0, (tierOp + gustOpBump) * depthFade * fadeOpacity * vaporOp * (isDark ? 0.85 : 1));
            const rot = v.baseRotation * rotFade + Math.sin(v.phase * 0.7) * 0.02, curve = v.curvature || 0, sh = shear * (v.tier * 0.5 + 0.5) + curve;
            ctx.setTransform(dpr, sh * dpr, 0, dpr, (v.x) * dpr, (v.y + undulation) * dpr);
            ctx.rotate(rot); if (v.taperDir < 0) ctx.scale(-1, 1);
            ctx.drawImage(this._vaporTex, -drawW * 0.5, -drawH * 0.5, drawW, drawH);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    _drawBirds(ctx, w, h) {
        for (let i = this._birds.length - 1; i >= 0; i--) {
            const b = this._birds[i]; b.x += b.vx; b.flapPhase += b.flapSpeed;
            b.y += (b.vy - Math.sin(b.flapPhase) * b.size * 0.04); const isOffRight = b.vx > 0 && b.x > w + 100; const isOffLeft = b.vx < 0 && b.x < -100;
            if (isOffRight || isOffLeft) this._birds.splice(i, 1);
        }
        const p = this._params, isSevereWeather = this._renderState.isSevereWeather;
            if (!isSevereWeather && this._birds.length === 0) {
            const dir = Math.random() > 0.5 ? 1 : -1, startX = dir === 1 ? -60 : w + 60, depthScale = 0.9 + Math.random() * 0.5;
            const baseSpeed = (0.9 + Math.random() * 0.5), finalSpeed = baseSpeed * depthScale * dir, isSingle = Math.random() < 0.3;
            const flockSize = isSingle ? 1 : 5 + Math.floor(Math.random() * 8), startY = h * 0.20 + Math.random() * (h * 0.47);
            this._birds.push({ x: startX, y: startY, vx: finalSpeed, vy: (Math.random() - 0.5) * 0.1, flapPhase: 0, flapSpeed: 0.15 + Math.random() * 0.05, size: 2.4 * depthScale });
            if (!isSingle) {
                const formation = Math.floor(Math.random() * 3), ySlope = Math.random() > 0.5 ? 1 : -1;
                for (let i = 1; i < flockSize; i++) {
                    let offX = 0, offY = 0;
                    if (formation === 0) {
                        const row = Math.floor((i + 1) / 2), side = i % 2 === 0 ? 1 : -1;
                        offX = -15 * row; offY = 8 * row * side;
                    } else if (formation === 1) {
                        offX = -18 * i; offY = 10 * i * ySlope;
                    } else {
                        offX = -15 * i + (Math.random() - 0.5) * 20; offY = (Math.random() - 0.5) * 40;
                    }
                    const scaledOffX = offX * depthScale, scaledOffY = offY * depthScale;
                    this._birds.push({ x: startX + (scaledOffX * dir), y: startY + scaledOffY, vx: finalSpeed, vy: (Math.random() - 0.5) * 0.05, flapPhase: i + Math.random(), flapSpeed: 0.15 + Math.random() * 0.05, size: (1.8 + Math.random() * 0.6) * depthScale });
                }
            }
        }
        if (this._birds.length === 0) return;
        const birdColor = this._isLightBackground ? 'rgba(40, 45, 50, 0.8)' : 'rgba(195, 203, 212, 0.55)';
        ctx.save(); ctx.strokeStyle = birdColor; ctx.lineJoin = 'round';
        ctx.lineCap = 'round'; const widthBuckets = new Map(); const len = this._birds.length;
        for (let i = 0; i < len; i++) {
            const b = this._birds[i], envelope = Math.sin(b.flapPhase * 0.35);
            const wingOffset = Math.sin(b.flapPhase) * b.size * Math.max(0, envelope);
            const dir = b.vx > 0 ? 1 : -1, lw = Math.max(0.8, b.size * 0.5), qw = Math.round(lw * 4) / 4;
            let bucket = widthBuckets.get(qw);
            if (!bucket) { bucket = []; widthBuckets.set(qw, bucket); }
            const halfSpan = b.size / 2.4;
            bucket.push(
                b.x - b.size * dir, b.y + wingOffset - halfSpan,
                b.x, b.y,
                b.x - b.size * dir, b.y + wingOffset + halfSpan
            );
        }
        for (const [lw, pts] of widthBuckets) {
            ctx.lineWidth = lw; ctx.beginPath();
            for (let j = 0; j < pts.length; j += 6) {
                ctx.moveTo(pts[j], pts[j + 1]); ctx.lineTo(pts[j + 2], pts[j + 3]); ctx.lineTo(pts[j + 4], pts[j + 5]);
            }
            ctx.stroke();
        }
        ctx.restore();
    }
    _drawPlanes(ctx, w, h) {
        const dpr = this._cachedDimensions.dpr;
        if (this._planes.length === 0 && Math.random() < 0.0025) this._planes.push(this._createPlane(w, h));
        for (let i = this._planes.length - 1; i >= 0; i--) {
            const plane = this._planes[i], dir = plane.vx > 0 ? 1 : -1;
            if (plane._sinA === undefined) {
                plane._sinA = Math.sin(plane.climbAngle); plane._cosA = Math.cos(plane.climbAngle);
            }
            const sinA = plane._sinA, cosA = plane._cosA;
            plane.x += plane.vx; plane.y += plane.vy;
            if (plane.gapTimer > 0) {
                plane.gapTimer -= 1;
            } else if (Math.random() < 0.005) {
                plane.gapTimer = 8 + Math.random() * 14;
            }
            const wi = plane.histHead; const dxR = plane.x - plane._lastRecX, dyR = plane.y - plane._lastRecY;
            if (dxR * dxR + dyR * dyR >= 1.0) {
                plane.histBuf[wi * 3] = plane.x; plane.histBuf[wi * 3 + 1] = plane.y + (Math.random() - 0.5) * 1.5;
                plane.histBuf[wi * 3 + 2] = plane.gapTimer > 0 ? 1 : 0; plane.histHead = (wi + 1) % TRAIL_CAP_PLANE;
                if (plane.histLen < TRAIL_CAP_PLANE) plane.histLen++;
                plane._lastRecX = plane.x; plane._lastRecY = plane.y;
            } const windShift = (this._windSpeed || 0) * 0.15;
            for (let j = 1; j < plane.histLen; j++) {
                const ridx = (((plane.histHead - 1 - j) % TRAIL_CAP_PLANE) + TRAIL_CAP_PLANE) % TRAIL_CAP_PLANE;
                plane.histBuf[ridx * 3] += windShift; plane.histBuf[ridx * 3 + 1] += 0.02;
            }
            if (plane.histLen > 2) {
                const baseOp = this._isThemeDark ? 0.12 : 0.23;
                const trailColor = this._isThemeDark ? 'rgb(210,220,240)' : 'rgb(255,255,255)';
                const histLen = plane.histLen; ctx.strokeStyle = trailColor; ctx.lineCap = 'butt';
                ctx.lineJoin = 'round'; const trailBaseW = 2.5 * plane.scale;
                // Draw contrail as alpha-banded polylines
                const trailSegs = histLen - 1;
                for (let oi = 0; oi < 2; oi++) {
                    const offset = CONTRAIL_OFFSETS[oi], oX = sinA * offset * plane.scale * dir, oY = cosA * offset * plane.scale;
                    for (let band = 0; band < 5; band++) {
                        const kStart = (band * trailSegs / 5) | 0, kEnd = ((band + 1) * trailSegs / 5) | 0;
                        if (kStart >= kEnd) continue;
                        // Alpha from the original 3-piece curve at band midpoint
                        const midP = (kStart + kEnd) * 0.5 / histLen; let bandAlpha; if (midP < 0.05) bandAlpha = (midP / 0.05) * baseOp;
                        else if (midP < 0.6) bandAlpha = baseOp * (1 - (midP - 0.05) * 0.727);
                        else bandAlpha = baseOp * 0.6 * (1 - (midP - 0.6) / 0.4);
                        if (bandAlpha < 0.005) continue; ctx.globalAlpha = bandAlpha; ctx.lineWidth = trailBaseW * (1 + midP * 1.2);
                        ctx.beginPath(); let drawing = false, segPts = 0;
                        for (let k = kStart; k <= kEnd; k++) {
                            const ridx = (((plane.histHead - 1 - k) % TRAIL_CAP_PLANE) + TRAIL_CAP_PLANE) % TRAIL_CAP_PLANE;
                            const gap = plane.histBuf[ridx * 3 + 2];
                            if (gap > 0.5) {
                                if (drawing && segPts < 2) { ctx.beginPath(); }
                                drawing = false; segPts = 0;
                            } else {
                                const px = plane.histBuf[ridx * 3] + oX, py = plane.histBuf[ridx * 3 + 1] + oY;
                                if (!drawing) { ctx.moveTo(px, py); drawing = true; segPts = 0; }
                                else { ctx.lineTo(px, py); segPts++; }
                            }
                        }
                        ctx.stroke();
                    }
                }
                ctx.globalAlpha = 1; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
            ctx.translate(plane.x, plane.y); ctx.scale(plane.scale, plane.scale); if (plane.climbAngle > 0) ctx.rotate(-plane.climbAngle * dir);
            ctx.globalAlpha = 0.9;
            ctx.strokeStyle = this._isThemeDark ? 'rgb(125, 135, 145)' : 'rgb(105, 110, 120)';
            ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.beginPath();
            for (let seg = 0; seg < PLANE_PATH.length; seg++) {
                const s = PLANE_PATH[seg]; ctx.moveTo(s[0] * dir, s[1]); ctx.lineTo(s[2] * dir, s[3]);
            }
            ctx.stroke(); ctx.globalAlpha = 1; plane.blinkPhase += 0.12;
            if (Math.sin(plane.blinkPhase) > 0.75) {
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = plane.vx > 0 ? (this._isThemeDark ? 'rgb(90, 255, 130)' : 'rgb(50, 255, 80)') : (this._isThemeDark ? 'rgb(255, 100, 100)' : 'rgb(255, 50, 50)');
                fillCircle(ctx, 0, 1, this._isThemeDark ? 1.5 : 1.8); ctx.globalAlpha = 1;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0); if (plane.x < -450 || plane.x > w + 450) this._planes.splice(i, 1);
        }
        ctx.globalAlpha = 1; ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
    }
    // ANIMATION LOOP
    _animate(timestamp) {
        if (!this.isConnected || this._animID === null || !this._isVisible) {
            this._stopAnimation();
            return;
        }
        const targetFps = Math.max(15, this._perfFps || 30);
        const targetInterval = 1000 / targetFps, deltaTime = timestamp - this._lastFrameTime;
        if (deltaTime < targetInterval * 0.85) {
            this._animID = requestAnimationFrame(this._boundAnimate);
            return;
        }
        this._lastFrameTime = timestamp;
        if (!this._ctxs) {
            this._animID = requestAnimationFrame(this._boundAnimate);
            return;
        }
        const { bg, mid, fg } = this._ctxs;
        const dpr = this._cachedDimensions.dpr || (window.devicePixelRatio || 1);
        const w = this._elements.bg.width / dpr, h = this._elements.bg.height / dpr, p = this._params;
        if (!p || w === 0 || h === 0) {
            this._animID = requestAnimationFrame(this._boundAnimate);
            return;
        }
        bg.clearRect(0, 0, w, h); mid.clearRect(0, 0, w, h); fg.clearRect(0, 0, w, h);
        if (!this._stateInitialized || !this._renderGate.isRevealed) {
            this._animID = requestAnimationFrame(this._boundAnimate);
            return;
        }
        this._gustPhase += 0.012; this._microGustPhase += 0.03;
        this._windGust = Math.sin(this._gustPhase) * 0.35 + Math.sin(this._gustPhase * 2.1) * 0.15 + Math.sin(this._microGustPhase) * 0.08;
        const effectiveWind = ((p.wind || 0.1) + this._windGust) * (1 + this._windSpeed);
        this._sunPulsePhase += 0.008;
        const cloudGlobalOp = this._renderState.cloudGlobalOp, rs = this._renderState;
        const fx = this._perfEffects, fauna = this._perfFauna;
        if (fx >= 1 && rs.glow && rs.glow.drawPhase === 'bg') this._drawCelestialGlow(bg, w, h);
        if (fx >= 1) this._drawAurora(mid, w, h); this._drawStars(bg, w, h, dpr); this._drawMoon(bg, w, h);
        if (fx >= 1 && this._isNight && this._isThemeDark && this._stars.length > 0) this._drawShootingStars(bg, w, h);
        if (fx >= 1 && this._isThemeDark) this._drawComets(bg, w, h);
        const glowActive = rs.glow;
            if (fx >= 1 && glowActive && glowActive.drawPhase === 'mid-pre') this._drawCelestialGlow(mid, w, h);
            if (fx >= 1 && this._celestialClouds.length > 0) this._drawCelestialClouds(mid, w, h, effectiveWind);
            if (fx >= 1 && this._windVapor.length > 0) this._drawWindVapor(mid, w, h, effectiveWind);
        if (fx >= 1 && this._fogBanks.length > 0) this._drawFog(mid, w, h);
        this._drawClouds(mid, this._clouds, w, h, effectiveWind, cloudGlobalOp);
            if (fx >= 1 && glowActive && glowActive.drawPhase === 'mid-post') this._drawCelestialGlow(mid, w, h);
            if (fauna >= 1) this._drawBirds(mid, w, h);
        this._drawClouds(mid, this._fgClouds, w, h, effectiveWind, cloudGlobalOp);
        if (fauna >= 2) this._drawPlanes(mid, w, h); this._drawLightning(fg, w, h);
        this._drawRain(fg, w, h, effectiveWind); this._drawHail(fg, w, h, effectiveWind); this._drawSnow(fg, w, h, effectiveWind);
        this._animID = requestAnimationFrame(this._boundAnimate);
    }
    _startAnimation() {
        if (this._animID === null && this._isVisible) {
            this._lastFrameTime = performance.now(); this._animID = requestAnimationFrame(this._boundAnimate);
        }
    }
    _stopAnimation() {
        if (this._animID !== null) {
            cancelAnimationFrame(this._animID); this._animID = null;
        }
    }
}
const CARD_NAME = 'atmo-weather-card';
window.customCards = window.customCards || [];

if (!customElements.get(CARD_NAME)) {
    customElements.define(CARD_NAME, AtmosphericWeatherCard);
    window.customCards.push({ type: CARD_NAME, name: 'Atmo Weather Card', description: 'Animated weather effects with rain, snow, clouds, stars and more' });
}
