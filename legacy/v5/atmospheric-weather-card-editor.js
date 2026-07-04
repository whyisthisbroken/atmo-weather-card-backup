/**
 * ATMOSPHERIC WEATHER CARD — VISUAL EDITOR
 * https://github.com/shpongledsummer/atmospheric-weather-card
 */
import { LitElement, html, css } from "https://esm.sh/lit@3.2.1";

const LABELS = Object.freeze({
    weather_entity: "", sun_entity: "", theme_entity: "",
    _color_mode: "Color Mode", card_height: "Card Height",
    _visual_mode: "Weather background",
    card_padding: "Card Padding", card_offset: "Card Offset", card_tap_action: "Tap Action",
    card_background_style: "Background Style",

    image_day: "Day Image URL", image_night: "Night Image URL",
    image_scale: "Image Scale (%)", image_alignment: "Image Position", image_x: "Horizontal Offset", image_y: "Vertical Offset",
    weather_image_path: "Day folder", weather_image_path_night: "Night folder",
    status_entity: "Status Entity", status_day: "Status Image (Day)", status_night: "Status Image (Night)", button_area_hide: "Disable Buttons",
    button_area_position: "Position", button_text_size: "Value text size", button_label_size: "Label text size", button_area_layout: "Layout",
    button_style: "Button style", button_area_columns: "Columns", button_area_scroll_count: "Show at once", button_area_align: "Align content",
    button_area_width: "Width", button_area_height: "Height", button_padding: "Button padding",
    button_area_padding: "Button Area padding", button_area_gap: "Gap between Buttons", button_gap: "Icon/text gap", button_text_gap: "Text gap", button_icon_size: "Icon size", button_area_background: "Background",
    button_area_grouped: "One shared background", button_area_separator: "Divider between buttons",
    button_icon_background: "Icon background", button_icon_padding: "Padding around icon",
    button_sub_value_size: "Sub value size", button_sub_value_weight: "Sub value weight",
    custom_cards_position: "Cards Position", button_area_background_color: "Container Background Color",
    icon_set: "Icon Set",
    icon_path: "Custom SVG Icon Folder",
    bg_brightness: "Background Brightness", bg_saturation: "Color Intensity", bg_blur: "Background Blur",
});
const HELPERS = Object.freeze({
    weather_entity: "", sun_entity: "",
    theme_entity: "",
    card_height: "In pixels, e.g. 220. Use 'auto' for dashboard grid layouts.", card_padding: "Inner padding, e.g. 16px or 12px 20px.", card_offset: "",
    card_tap_action: "What happens when the card is tapped.",
    image_night: "Shown at night. Falls back to the day image if left empty.",
    weather_image_path: "",
    image_scale: "", image_alignment: "",
    image_x: "Fine-tune horizontal position. Pixels or CSS, e.g. -20 or 10%.", image_y: "Fine-tune vertical position. Pixels or CSS, e.g. 10 or -5%.",
    status_entity: "Shows a different image when this entity is active, open, or home.", status_day: "Day image shown while the status entity is active.",
    status_night: "Night image shown while the status entity is active.", button_area_columns: "Number of equal-width columns in grid layout.",
    button_area_align: "Horizontal alignment of buttons within the container.",
    card_background_style: "Frosted: translucent glass effect. Contrast: solid and readable. Theme: follows your HA theme colours.",
    bg_brightness: "Makes all weather visuals lighter or darker.",
    bg_saturation: "Controls how vivid or muted the colors appear.",
    bg_blur: "Blurs the weather background image.",
    icon_path: "e.g. /local/weather-icons/. Replaces built-in icons for all weather buttons."});
const BUTTON_LABELS = Object.freeze({
    entity: "", attribute: "Attribute", name: "Label", name_sensor: "Label Entity",
    name_attribute: "Label Attribute", name_format: "Custom unit", sub_value_entity: "Sub Value Entity", sub_value_attribute: "Sub Value Attribute",
    gauge_entity: "Value Entity", gauge_attribute: "Value Attribute", width: "Width", overflow: "Value overflow", label_overflow: "Label overflow", sub_value_overflow: "Sub value overflow",
    marquee_speed: "Scroll speed", marquee_rtl: "Right-to-left", icon: "Icon", icon_path: "Icon folder",
    tap_action: "Tap Action", unit_format: "Custom unit", text_size: "Value text size", label_size: "Label text size",
    inner_gap: "Icon/text gap", text_gap: "Text gap", padding: "Button padding"});
const BUTTON_HELPERS = Object.freeze({
    name_sensor: "Use a sensor value as the label instead.", width: "e.g. 200px or 60%. Constrains the button width.",
    icon: "MDI icon, or type 'weather' for a dynamic icon.", icon_path: "e.g. /local/weather-icons/", forecast_offset: "0 = today/now, 1 = tomorrow/next hour, etc."});
const KEY_ORDER = Object.freeze([
    "type", "name", "entity", "weather_entity",
    "sun_entity", "color_mode", "card_color_mode", "theme_entity", "card_height", "card_padding",
    "disable_background",
    "simple_background",
    "image_day", "image_night", "image_scale", "image_alignment",
    "weather_image_path", "weather_image_path_night",
    "status_entity", "status_day", "status_night",
    "card_background_style",
    "card_tap_action", "hold_action", "double_tap_action", "card_offset", "theme_adapt", "bottom_fade",
    "icon_set",
    "icon_path",
    "custom_cards_position",
    "night_sky_effects", "sun_effects", "bg_brightness", "bg_saturation", "bg_blur",
    "button_areas", "custom_cards"]);
const DISPLAY_DEFAULTS = Object.freeze({
    card_color_mode: "auto", image_alignment: "top-right", card_background_style: "frosted",
    bg_brightness: 1.0, bg_saturation: 1.0, bg_blur: 0});
const OPT = Object.freeze({
    visual_mode: [
        { value: "visuals", label: "Animated weather visuals" }, { value: "images", label: "Custom weather images" },
        { value: "simple", label: "Simple weather background" }, { value: "none", label: "No background" }],
    color_mode: [
        { value: "ha_theme",    label: "Follow my Home Assistant theme" }, { value: "entity",      label: "Follow another entity (e.g. the sun)" },
        { value: "force_light", label: "Force light mode" }, { value: "force_dark",  label: "Force dark mode" }], button_overflow: [
        { value: "ellipsis", label: "Ellipsis (…)" }, { value: "marquee", label: "Scrolling text" }, { value: "clip", label: "Clip" }, { value: "wrap", label: "Wrap" }], button_area_layout: [
        { value: "wrap",              label: "Wrap" }, { value: "grid",              label: "Grid" },
        { value: "horizontal-scroll", label: "Scroll X" }, { value: "vertical-scroll",   label: "Scroll Y" }], button_area_align: [
        { value: "start",  label: "Left" }, { value: "center", label: "Center" }, { value: "end",    label: "Right" }, { value: "spread", label: "Spread" }]});
const FC_ATTRIBUTES = Object.freeze([
    { value: "condition",                  label: "Condition" }, { value: "temperature",                label: "Temperature (high)" },
    { value: "templow",                    label: "Temperature (low)" }, { value: "precipitation_probability",  label: "Rain probability" },
    { value: "precipitation",              label: "Precipitation" }, { value: "humidity",                   label: "Humidity" },
    { value: "wind_speed",                 label: "Wind speed" }, { value: "wind_bearing",               label: "Wind bearing" },
    { value: "pressure",                   label: "Pressure" }, { value: "cloud_coverage",             label: "Cloud coverage" }, { value: "uv_index",                   label: "UV index" }]);
const POSITION_GRIDS = Object.freeze({
    image_alignment: {
        cells: [
            ["top-left",    "top-center",    "top-right"], ["left",        "center",        "right"]       ,
            ["bottom-left", "bottom-center", "bottom-right"]], valueMap: { "left": "center-left", "right": "center-right" }}, custom_cards_position: {
        cells: [["top-left","top-center","top-right"],["left","center","right"],["bottom-left","bottom-center","bottom-right"]], valueMap: { "left": "center-left", "right": "center-right" }},
    button_area_position: { cells: [["top-left","top-center","top-right"],["left","center","right"],["bottom-left","bottom-center","bottom-right"]] }});
class AtmosphericWeatherCardEditor extends LitElement {
    static get properties() {
        return {
            _config: { type: Object, state: true }, _colorModeState: { type: String, state: true },
            _expandedCard: { type: Number, state: true }, _expandedButton: { type: Number, state: true },
            _expandedArea: { type: Number, state: true }, _openPanel: { type: String, state: true },};}
    set hass(val) {
        const old = this._hass; this._hass = val;
        if (!old && val) {
            this.requestUpdate();
        } else if (old && val) {
            if (!this._hassThrottle) {
                this._hassThrottle = true;
                setTimeout(() => { this._hassThrottle = false; this.requestUpdate(); }, 2000);}}}
    get hass() { return this._hass; }
    static get styles() {
        return css`
            :host {
                --awc-e-s1: 4px; --awc-e-s2: 8px; --awc-e-s3: 12px; --awc-e-s4: 16px; --awc-e-r-box: 10px; --awc-e-r-ctrl: 8px; --awc-e-r-inline: 6px;
                --awc-e-f-meta: 12px; --awc-e-f-label: 13px; --awc-e-f-body: 14px; --awc-e-f-header: 15px;
                --awc-e-t: 150ms ease;
                --mdc-text-field-fill-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
                --mdc-select-fill-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
                --mdc-typography-subtitle1-font-size: var(--awc-e-f-label); --mdc-typography-subtitle1-font-weight: 400;
                --mdc-typography-body2-font-size: var(--awc-e-f-meta);
                display: block;}
            /* Spacing */
            ha-form { display: block; }
            ha-expansion-panel {
                display: block; margin-top: var(--awc-e-s3); --ha-card-border-radius: var(--awc-e-r-box);
                & ha-form { margin-top: var(--awc-e-s2); }}
            ha-form + ha-form { margin-top: var(--awc-e-s1); }
            .button-accordion-body > * + *,
            .settings-group > * + *,
            .disclosure-body > * + * { margin-top: var(--awc-e-s2); }
            .button-accordion-body > :first-child,
            .settings-group > :first-child,
            .disclosure-body > :first-child { margin-top: 0; }
            .settings-group > .settings-group-label + *,
            .settings-group > .section-title + * { margin-top: 0; }
            /* Panel headers */
            .panel-header {
                display: flex; align-items: center; gap: var(--awc-e-s2);
                font-size: var(--awc-e-f-header); font-weight: 500; color: var(--primary-text-color);
                & ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }}
            /* Shared backgrounds */
            .info, .cards-empty, .card-row, details.disclosure {
                background: var(--secondary-background-color); border-radius: var(--awc-e-r-box);}
            details.disclosure details.disclosure,
            details.disclosure .card-row {
                background: linear-gradient(rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05), rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05)), var(--secondary-background-color);}
            .composite, .grid-picker {
                background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09); border-radius: var(--awc-e-r-box);}
            .composite:last-child, .grid-picker:last-child, .section-box:last-child { margin-bottom: 0; }
            .disclosure-body > :last-child { margin-bottom: 0; }
            /* Info blocks */
            .info {
                padding: var(--awc-e-s3) var(--awc-e-s4); margin: 0 0 var(--awc-e-s3) 0;
                font-size: var(--awc-e-f-label); line-height: 1.5; color: var(--secondary-text-color);
                & b { color: var(--primary-text-color); font-weight: 500; }
                & code { background: var(--primary-background-color); padding: 1px 6px; border-radius: 4px; font-size: var(--awc-e-f-meta); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
                &.inline-action { display: flex; align-items: center; gap: var(--awc-e-s3); justify-content: space-between; & > span { flex: 1; } }}
            .inline-action-btn {
                flex-shrink: 0; padding: var(--awc-e-s2) var(--awc-e-s3); border: 0;
                background: var(--primary-color); color: var(--text-primary-color, white);
                border-radius: var(--awc-e-r-ctrl); font-size: var(--awc-e-f-label); font-weight: 500;
                cursor: pointer; white-space: nowrap; transition: opacity var(--awc-e-t);
                &:hover { opacity: 0.85; }}
            /* Labels & helpers */
            .grid-picker-label, .composite-label {
                display: block; font-size: var(--awc-e-f-label); font-weight: 500;
                margin-bottom: var(--awc-e-s2); color: var(--primary-text-color);}
            .grid-helper, .composite-helper {
                margin-top: var(--awc-e-s2); font-size: var(--awc-e-f-meta);
                color: var(--secondary-text-color); line-height: 1.5;}
            .scope-note {
                font-size: var(--awc-e-f-meta); color: var(--secondary-text-color);
                display: flex; align-items: center; gap: var(--awc-e-s1);
                & ha-icon { --mdc-icon-size: 14px; }}
            /* Grid layouts */
            .card-size-row {
                display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: var(--awc-e-s2);
                & ha-textfield { display: block; width: 100%; min-width: 0; }}
            .grid-picker { margin: var(--awc-e-s3) 0 var(--awc-e-s4) 0; padding: var(--awc-e-s3) var(--awc-e-s4); }
            .section-box .grid-picker { margin: var(--awc-e-s2) 0 0 0; background: transparent; padding: 0; }
            .field-group .grid-picker { margin: 0; background: transparent; padding: 0; }
            .buttons-pos-align-row .grid-picker { margin: 0; padding: 0; background: transparent; flex-shrink: 0; }
            .grid-3x3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--awc-e-s1); width: 144px; aspect-ratio: 1; }
            .grid-cell {
                border: 0; background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.16);
                border-radius: var(--awc-e-r-inline); cursor: pointer; padding: 0; transition: background var(--awc-e-t);
                &:hover:not(.disabled):not(.active) { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.28); }
                &.active { background: var(--primary-color); }
                &.empty { visibility: hidden; pointer-events: none; }
                &.disabled { opacity: 0.4; cursor: not-allowed; background: repeating-linear-gradient(45deg, rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.16) 0 6px, var(--divider-color) 6px 7px); }}
            .grid-extras { display: flex; gap: var(--awc-e-s1); margin-top: var(--awc-e-s2); flex-wrap: wrap; }
            .grid-extra {
                flex: 1; min-width: 100px; padding: var(--awc-e-s2) var(--awc-e-s3); border: 0;
                background: var(--secondary-background-color); border-radius: var(--awc-e-r-inline);
                color: var(--primary-text-color); font-size: var(--awc-e-f-label); cursor: pointer;
                transition: background var(--awc-e-t), color var(--awc-e-t);
                &:hover:not(.active) { background: var(--divider-color); }
                &.active { background: var(--primary-color); color: var(--text-primary-color, white); }}
            .grid-with-side { display: flex; gap: var(--awc-e-s4); align-items: flex-start; flex-wrap: wrap; }
            .grid-side { flex: 1 1 150px; min-width: 150px; }
            .img-offset-grid {
                display: grid; grid-template-columns: 1fr 1fr; gap: var(--awc-e-s2);
                & label { display: flex; flex-direction: column; gap: var(--awc-e-s1); font-size: var(--awc-e-f-meta); color: var(--secondary-text-color); }
                & input {
                    width: 100%; min-width: 0; box-sizing: border-box; padding: var(--awc-e-s2) var(--awc-e-s3);
                    border: 1px solid transparent; background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07);
                    color: var(--primary-text-color); border-radius: var(--awc-e-r-ctrl);
                    font-size: var(--awc-e-f-body); transition: border-color var(--awc-e-t); }
                & input:focus { outline: none; border-color: var(--primary-color); }}
            /* Composite field groups */
            .composite { margin: var(--awc-e-s3) 0 var(--awc-e-s4) 0; padding: var(--awc-e-s3) var(--awc-e-s4); }
            .composite-row { display: flex; align-items: center; gap: var(--awc-e-s2); flex-wrap: wrap; }
            .composite-unit { font-size: var(--awc-e-f-label); color: var(--secondary-text-color); }
            .composite-number, .composite-grid-4 input {
                flex: 1; min-width: 120px; padding: var(--awc-e-s2) var(--awc-e-s3);
                border: 1px solid transparent; background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07);
                color: var(--primary-text-color); border-radius: var(--awc-e-r-ctrl);
                font-size: var(--awc-e-f-body); box-sizing: border-box; transition: border-color var(--awc-e-t);
                &:focus { outline: none; border-color: var(--primary-color); }}
            .composite-number:disabled { opacity: 0.5; cursor: not-allowed; }
            .composite-grid-4 {
                display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--awc-e-s2);
                & label { display: flex; flex-direction: column; gap: var(--awc-e-s1); font-size: var(--awc-e-f-meta); color: var(--secondary-text-color); }
                & input { flex: none; min-width: 0; width: 100%; }}
            .composite-textfield { flex: 1; min-width: 0; }
            /* Segmented controls */
            .segmented {
                display: flex; flex-wrap: wrap; width: 100%; background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07);
                border-radius: var(--awc-e-r-ctrl); padding: 0; gap: 1px; box-sizing: border-box;
                & button {
                    flex: 1 1 auto; min-width: 52px; padding: var(--awc-e-s2) var(--awc-e-s3); border: 0;
                    background: transparent; color: var(--primary-text-color); font-size: var(--awc-e-f-body);
                    cursor: pointer; transition: background var(--awc-e-t), color var(--awc-e-t);
                    text-align: center; border-radius: var(--awc-e-r-ctrl);
                    &:hover:not(.active) { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07); }
                    &.active { background: var(--primary-color); color: var(--text-primary-color, white); }}
                &.segmented-2col { display: grid; grid-template-columns: 1fr 1fr; }}
            .composite-row .segmented { flex: 1; min-width: 0; }
            .segmented.segmented-compact { & button { min-width: 0; padding: var(--awc-e-s2) var(--awc-e-s1); font-size: var(--awc-e-f-meta); } }
            /* Disclosure / details */
            details.disclosure {
                margin-top: var(--awc-e-s3); overflow: hidden;
                & > summary {
                    list-style: none; cursor: pointer; display: flex; align-items: center; gap: var(--awc-e-s2); padding: var(--awc-e-s3) var(--awc-e-s4);
                    font-size: var(--awc-e-f-label); font-weight: 500; color: var(--primary-text-color);
                    user-select: none; transition: background var(--awc-e-t);
                    &::-webkit-details-marker { display: none; }
                    &:hover { background: var(--divider-color); }
                    & ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); }
                    & .chevron { transition: transform var(--awc-e-t); }}
                &[open] > summary .chevron { transform: rotate(90deg); }
                & > .disclosure-body { padding: var(--awc-e-s4) var(--awc-e-s4) var(--awc-e-s3) var(--awc-e-s4); }}
            details.sub-disclosure {
                border-top: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
                & > summary {
                    list-style: none; cursor: pointer; display: flex; align-items: center; gap: var(--awc-e-s2); padding: 8px 0 2px;
                    font-size: var(--awc-e-f-label); font-weight: 500; color: var(--primary-text-color);
                    user-select: none; transition: background var(--awc-e-t);
                    &::-webkit-details-marker { display: none; }
                    & ha-icon { --mdc-icon-size: 16px; color: var(--secondary-text-color); }
                    & .chevron { transition: transform var(--awc-e-t); }}
                &[open] > summary .chevron { transform: rotate(90deg); }
                & > .disclosure-body { padding: var(--awc-e-s2) 0 var(--awc-e-s3); }}
            /* Card rows (cards editor) */
            .cards-empty {
                padding: var(--awc-e-s4); text-align: center;
                font-size: var(--awc-e-f-label); color: var(--secondary-text-color); margin-bottom: var(--awc-e-s3);}
            .card-row {
                margin-bottom: var(--awc-e-s2); overflow: hidden;
                & .card-row-head {
                    display: flex; align-items: center; gap: var(--awc-e-s2);
                    padding: var(--awc-e-s3) var(--awc-e-s4); cursor: pointer; user-select: none;
                    transition: background var(--awc-e-t);
                    &:hover { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05); }
                    & > .chevron { --mdc-icon-size: 20px; color: var(--secondary-text-color); transition: transform var(--awc-e-t); }}
                &.expanded .card-row-head > .chevron { transform: rotate(90deg); }
                & .card-row-title {
                    flex: 1; font-size: var(--awc-e-f-body); font-weight: 500; color: var(--primary-text-color);
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
                & .card-row-actions {
                    display: flex; gap: 2px;
                    & button {
                        width: 32px; height: 32px; border: 0; background: transparent;
                        color: var(--secondary-text-color); border-radius: var(--awc-e-r-inline);
                        cursor: pointer; display: flex; align-items: center; justify-content: center;
                        transition: background var(--awc-e-t), color var(--awc-e-t);
                        &:hover:not(:disabled) { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07); color: var(--primary-text-color); }
                        &:disabled { opacity: 0.3; cursor: not-allowed; }}
                    & ha-icon { --mdc-icon-size: 18px; }}
                & .card-row-body { padding: var(--awc-e-s3) var(--awc-e-s4) var(--awc-e-s4); background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.03); }}
            /* Add buttons */
            .add-card-btn, .add-button-btn {
                display: flex; align-items: center; justify-content: center; gap: var(--awc-e-s2);
                width: 100%; padding: var(--awc-e-s3); border: 1.5px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.4);
                background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.06); color: var(--primary-color); border-radius: var(--awc-e-r-box);
                font-size: var(--awc-e-f-body); font-weight: 500; cursor: pointer; transition: background var(--awc-e-t), border-color var(--awc-e-t);
                &:hover { background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.12); border-color: var(--primary-color); }
                & ha-icon { --mdc-icon-size: 20px; }}
            .sensor-list { margin-top: 0; &:empty { display: none; } }
            /* Compact fields */
            .compact-fields {
                display: grid; grid-template-columns: 1fr 1fr; gap: var(--awc-e-s2); margin: var(--awc-e-s3) 0;}
            .compact-field {
                display: flex; flex-direction: column; gap: 2px;
                & .compact-field-label { font-size: var(--awc-e-f-meta); color: var(--secondary-text-color); padding-left: 2px; }
                & input, & ha-textfield { width: 100%; min-width: 0; box-sizing: border-box; }
                & input {
                    padding: var(--awc-e-s2) var(--awc-e-s3); border: 1px solid transparent;
                    background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07); color: var(--primary-text-color);
                    border-radius: var(--awc-e-r-ctrl); font-size: var(--awc-e-f-body); transition: border-color var(--awc-e-t);
                    &:focus { outline: none; border-color: var(--primary-color); }}}
            /* Toggle groups */
            .toggle-group {
                background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
                border-radius: var(--awc-e-r-box); overflow: hidden; margin: var(--awc-e-s2) 0;}
            .toggle-row {
                display: flex; align-items: center; justify-content: space-between; gap: var(--awc-e-s3); padding: 10px var(--awc-e-s2) 10px var(--awc-e-s3);
                cursor: pointer; box-sizing: border-box;
                & + .toggle-row { border-top: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06); }
                & > span { font-size: var(--awc-e-f-body); color: var(--primary-text-color); }
                & ha-switch { flex-shrink: 0; margin: 0; padding: 0;
                    --ha-switch-background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.12);
                    --ha-switch-thumb-background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.35);
                    --ha-switch-border-color: transparent;
                    --ha-switch-thumb-border-color: transparent;
                    --ha-switch-checked-border-color: transparent;
                    --ha-switch-checked-thumb-border-color: transparent;
                    --ha-switch-checked-background-color: var(--primary-color);
                    --ha-switch-checked-thumb-background-color: var(--text-primary-color, #fff);
                    --switch-unchecked-track-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.12);
                    --switch-unchecked-button-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.35);
                    --switch-checked-track-color: var(--primary-color);
                    --switch-checked-button-color: var(--text-primary-color, #fff); }}
            /* Section boxes */
            .section-box {
                background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09); border-radius: var(--awc-e-r-box); overflow: hidden;
                margin: var(--awc-e-s3) 0 var(--awc-e-s4) 0; padding: var(--awc-e-s3) var(--awc-e-s4);}
            .section-box.no-pad { padding: var(--awc-e-s4); }
            .section-box.no-pad > .sensor-list { margin-top: 0; }
            .section-box .compact-fields { margin: 0; }
            .fc-box {
                margin: var(--awc-e-s3) 0; padding: var(--awc-e-s3) var(--awc-e-s4); background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.08);
                border: 1px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.18);
                border-radius: var(--awc-e-r-box);}
            .fc-box ha-form { margin-top: var(--awc-e-s2); }
            /* Icon combo & weather icon */
            .icon-combo {
                display: flex; align-items: center; gap: var(--awc-e-s1);
                & ha-icon-picker { flex: 1; min-width: 0; }
                & .icon-weather-btn {
                    flex-shrink: 0; padding: var(--awc-e-s2) var(--awc-e-s3); border: 0;
                    border-radius: var(--awc-e-r-ctrl); font-size: var(--awc-e-f-meta); cursor: pointer;
                    transition: background var(--awc-e-t), color var(--awc-e-t);
                    &.active { background: var(--primary-color); color: var(--text-primary-color, white); }
                    &:not(.active) { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09); color: var(--primary-text-color); }
                    &:hover:not(.active) { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.16); }}}
            .weather-icon-active {
                display: flex; align-items: center; gap: var(--awc-e-s2); padding: var(--awc-e-s2) var(--awc-e-s3);
                background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.07); border: 1px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.18);
                border-radius: var(--awc-e-r-ctrl);}
            .weather-icon-active-text {
                flex: 1; display: flex; flex-direction: column; gap: 1px;
                & span:first-child { font-size: var(--awc-e-f-label); font-weight: 500; color: var(--primary-text-color); }}
            .weather-icon-active-sub { font-size: var(--awc-e-f-meta); color: var(--secondary-text-color); }
            .weather-icon-active .icon-weather-btn {
                flex-shrink: 0; padding: var(--awc-e-s1) var(--awc-e-s2); border: 0;
                border-radius: var(--awc-e-r-ctrl); font-size: var(--awc-e-f-meta); cursor: pointer;
                background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09); color: var(--primary-text-color);
                transition: background var(--awc-e-t);
                &:hover { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.16); }}
            /* Button type picker */
            .button-type-picker { display: grid; grid-template-columns: 1fr 1fr; gap: var(--awc-e-s2); margin: 0 0 var(--awc-e-s3) 0; }
            .button-type-btn { display: flex; align-items: center; gap: var(--awc-e-s2); padding: var(--awc-e-s2) var(--awc-e-s3); border: 1.5px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.12); border-radius: var(--awc-e-r-box); background: transparent; color: var(--primary-text-color); text-align: left; cursor: pointer; transition: border-color var(--awc-e-t), background var(--awc-e-t); &:hover { border-color: var(--primary-color); background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.05); } &.active { border-color: var(--primary-color); background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.08); } & .button-type-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); flex-shrink: 0; } & .button-type-icon.active-icon { color: var(--primary-color); } & .button-type-text { display: flex; flex-direction: column; gap: 1px; } & .button-type-name { font-size: var(--awc-e-f-label); font-weight: 500; line-height: 1.2; } & .button-type-desc { font-size: var(--awc-e-f-meta); color: var(--secondary-text-color); line-height: 1.2; } }
            /* Button header badges */
            .button-badge-row { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 4px; background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.10); color: var(--secondary-text-color); flex-shrink: 0; & ha-icon { --mdc-icon-size: 13px; } }
            .button-badge-free { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 4px; background: var(--primary-color, rgba(76, 140, 110, 0.85)); color: #fff; flex-shrink: 0; & ha-icon { --mdc-icon-size: 13px; } }
            /* Position grid + align */
            .buttons-pos-align-row { display: flex; gap: var(--awc-e-s3); align-items: flex-start; }
            /* CSS value fields */
            .css-field-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: var(--awc-e-s2); margin-top: var(--awc-e-s2); }
            .css-field-row.cols-2 { grid-template-columns: 1fr 1fr; }
            .css-field { display: flex; flex-direction: column; gap: 3px; & .css-field-label { font-size: var(--awc-e-f-meta); color: var(--secondary-text-color); font-weight: 500; padding-left: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } & input { width: 100%; box-sizing: border-box; height: 36px; padding: 0 10px; border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.18); background: var(--mdc-text-field-fill-color, rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06)); color: var(--primary-text-color); border-radius: var(--awc-e-r-ctrl); font-size: var(--awc-e-f-body); font-family: inherit; transition: border-color var(--awc-e-t); &:focus { outline: none; border-color: var(--primary-color); } &::placeholder { color: var(--secondary-text-color); opacity: 0.7; } } }
            /* Section headings */
            .settings-group { margin-top: 16px; }
            .settings-group:first-child { margin-top: 0; }
            .settings-group-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--secondary-text-color); margin-bottom: var(--awc-e-s2); display: flex; align-items: center; gap: var(--awc-e-s1); }
            .section-title { font-size: var(--awc-e-f-label); font-weight: 600; color: var(--primary-text-color); margin-bottom: var(--awc-e-s2); display: flex; align-items: center; gap: var(--awc-e-s1); }
            .field-group {
                background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05);
                border-radius: var(--awc-e-r-box); padding: var(--awc-e-s3);
                margin-top: var(--awc-e-s2);}
            .field-group > .toggle-group:first-child { margin-top: 0; }
            .field-group > .toggle-group:last-child { margin-bottom: 0; }
            .field-group-label {
                font-size: var(--awc-e-f-meta); font-weight: 500; color: var(--secondary-text-color);
                margin-bottom: var(--awc-e-s2);}
            /* Button accordions */
            .button-accordion { border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09); border-radius: var(--awc-e-r-box); overflow: hidden; margin-top: var(--awc-e-s2); background: var(--secondary-background-color); }
            .button-accordion + .button-accordion { margin-top: var(--awc-e-s1); }
            .button-accordion-head { display: flex; align-items: center; gap: var(--awc-e-s2); padding: var(--awc-e-s2) var(--awc-e-s3); cursor: pointer; background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.03); user-select: none; -webkit-user-select: none; & .button-accordion-title { flex: 1; font-size: var(--awc-e-f-label); font-weight: 500; color: var(--primary-text-color); } & .button-accordion-icon { --mdc-icon-size: 15px; color: var(--secondary-text-color); flex-shrink: 0; } & ha-icon.chevron { --mdc-icon-size: 16px; color: var(--secondary-text-color); transition: transform var(--awc-e-t); flex-shrink: 0; } &.open ha-icon.chevron { transform: rotate(90deg); } &:hover { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06); } }
            .button-accordion-body { padding: var(--awc-e-s3); border-top: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09); }
            .button-accordion-body > .settings-group:first-child { margin-top: 0; }
            .button-accordion-body .settings-group + .settings-group { margin-top: var(--awc-e-s3); }
            /* Button nudge strips */
            .button-nudge { display: flex; align-items: flex-start; gap: var(--awc-e-s2); padding: var(--awc-e-s2) var(--awc-e-s3); margin: var(--awc-e-s1) 0; border-radius: var(--awc-e-r-ctrl); font-size: var(--awc-e-f-meta); color: var(--secondary-text-color); line-height: 1.5; & code { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08); padding: 0 4px; border-radius: 3px; } }
            .button-nudge.warning { background: rgba(var(--rgb-warning-color, 255, 152, 0), 0.10); border: 1px solid rgba(var(--rgb-warning-color, 255, 152, 0), 0.25); }
            .button-nudge.info { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04); border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09); }
            /* Button color picker */
            .button-color-box { margin-top: var(--awc-e-s2); padding: var(--awc-e-s2) var(--awc-e-s3); border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.10); border-radius: var(--awc-e-r-ctrl); background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.03); }
            .button-color-row { display: flex; align-items: center; gap: var(--awc-e-s2); }
            .button-color-label { flex: 1; font-size: var(--awc-e-f-label); color: var(--primary-text-color); }
            .button-color-swatch { width: 36px; height: 28px; border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.18); border-radius: var(--awc-e-r-inline); padding: 1px 2px; background: none; cursor: pointer; flex-shrink: 0; }
            .button-color-clear { width: 24px; height: 24px; border: 0; border-radius: 50%; padding: 0; background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08); color: var(--secondary-text-color); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background var(--awc-e-t); &:hover { background: rgba(var(--rgb-error-color, 211, 47, 47), 0.15); color: var(--error-color); } }
            .button-color-opacity-row { display: flex; align-items: center; gap: var(--awc-e-s2); margin-top: var(--awc-e-s2); }
            .button-color-opacity-label { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; }
            .button-color-opacity { flex: 1; height: 4px; accent-color: var(--primary-color); cursor: pointer; }
            .button-color-opacity-val { font-size: 11px; color: var(--secondary-text-color); width: 32px; text-align: right; flex-shrink: 0; }
            /* Sliders */
            .awc-slider {
                display: flex; flex-direction: column; gap: var(--awc-e-s1); padding: var(--awc-e-s3);
                background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05);
                border-radius: var(--awc-e-r-box);}
            .awc-slider-head { display: flex; align-items: center; justify-content: space-between; gap: var(--awc-e-s2); margin-bottom: var(--awc-e-s1); }
            .awc-slider-label { font-size: var(--awc-e-f-label); color: var(--primary-text-color); font-weight: 400; flex: 1; }
            .awc-slider-num {
                width: 48px; flex-shrink: 0; text-align: right; border: none; background: none;
                color: var(--primary-color); font-size: var(--awc-e-f-label); font-weight: 600;
                font-family: inherit; padding: 0; outline: none; -moz-appearance: textfield;
                &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { -webkit-appearance: none; }}
            .awc-slider-range {
                width: 100%; height: 4px; accent-color: var(--primary-color); cursor: pointer;
                appearance: none; -webkit-appearance: none; display: block;
                background: linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) var(--awc-slider-pct, 50%), rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.18) var(--awc-slider-pct, 50%));
                border-radius: 2px; border: none; outline: none;
                &::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--primary-color); cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }
                &::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: var(--primary-color); cursor: pointer; border: none; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }}
            .awc-slider-helper { font-size: var(--awc-e-f-meta); color: var(--secondary-text-color); margin-top: var(--awc-e-s1); line-height: 1.4; }
            .awc-slider-status { font-size: var(--awc-e-f-meta); color: var(--primary-color); margin-top: 2px; line-height: 1.4; font-weight: 500; }
            /* Free button positioning */
            .free-pos-layout { display: grid; grid-template-columns: auto 1fr; gap: var(--awc-e-s3); align-items: start; }
            .offset-fields { display: grid; grid-template-columns: 1fr 1fr; gap: var(--awc-e-s2); }
            .offset-field { display: flex; flex-direction: column; gap: 3px; & .offset-field-label { font-size: 11px; color: var(--secondary-text-color); font-weight: 500; padding-left: 2px; } & input { width: 100%; box-sizing: border-box; height: 36px; padding: 0 10px; border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.18); background: var(--mdc-text-field-fill-color, rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06)); color: var(--primary-text-color); border-radius: var(--awc-e-r-ctrl); font-size: var(--awc-e-f-body); font-family: inherit; &:focus { outline: none; border-color: var(--primary-color); } &::placeholder { color: var(--secondary-text-color); opacity: 0.7; } } }
            .free-mode-box {
                background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.05);
                border: 1px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.14);
                border-radius: var(--awc-e-r-box); overflow: hidden;}
            .free-mode-row { display: flex; align-items: center; justify-content: space-between; padding: var(--awc-e-s2) var(--awc-e-s3); }
            .free-mode-label { font-size: var(--awc-e-f-label); font-weight: 500; color: var(--primary-text-color); display: flex; align-items: center; gap: var(--awc-e-s1); }
            .free-pos-subpanel { padding: 0 var(--awc-e-s3) var(--awc-e-s3); }
            .free-pos-subpanel::before { content: ""; display: block; height: 10px; }
            .anchor-grid { display: grid; grid-template-columns: repeat(3, 30px); grid-template-rows: repeat(3, 30px); gap: 4px; }
            .anchor-cell { width: 30px; height: 30px; border: 1.5px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.15); border-radius: var(--awc-e-r-ctrl); background: transparent; cursor: pointer; transition: border-color var(--awc-e-t), background var(--awc-e-t); &:hover:not(.active) { border-color: var(--primary-color); background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.07); } &.active { border-color: var(--primary-color); background: var(--primary-color); } }
            .clearable-field { position: relative; & ha-form { padding-right: 0; } & .clear-btn { position: absolute; top: 8px; right: 4px; width: 24px; height: 24px; padding: 0; margin: 0; border: none; background: transparent; color: var(--secondary-text-color); cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; opacity: 0.6; transition: opacity var(--awc-e-t), color var(--awc-e-t); z-index: 1; &:hover { opacity: 1; color: var(--error-color); } & ha-icon { --mdc-icon-size: 16px; } } }
            /* Forecast special box */
            .button-forecast-box {
                border: 1px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.18);
                border-radius: var(--awc-e-r-box); overflow: hidden; margin-top: var(--awc-e-s3); }
            .button-forecast-header {
                display: flex; align-items: center; gap: var(--awc-e-s1); padding: var(--awc-e-s1) var(--awc-e-s3) 0;
                font-size: 11px; font-weight: 600; color: var(--primary-color); text-transform: uppercase; letter-spacing: 0.04em; }
            .button-forecast-header ha-icon { --mdc-icon-size: 13px; }
            .button-forecast-body { padding: var(--awc-e-s2) var(--awc-e-s3) var(--awc-e-s3); }
            .button-forecast-body > * + * { margin-top: var(--awc-e-s2); }
            /* Ring threshold rows */
            .ring-threshold-row {
                display: flex; align-items: center; gap: var(--awc-e-s2); padding: var(--awc-e-s2) 0;
                & + .ring-threshold-row { border-top: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06); padding-top: var(--awc-e-s2); } }
            .ring-threshold-row .button-color-swatch { width: 28px; height: 22px; flex-shrink: 0; }
            .ring-threshold-row input[type="text"] {
                flex: 1; min-width: 0; height: 30px; padding: 0 8px; border: 1px solid transparent;
                background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07); color: var(--primary-text-color);
                border-radius: var(--awc-e-r-ctrl); font-size: var(--awc-e-f-body); font-family: inherit;
                &:focus { outline: none; border-color: var(--primary-color); } }
            .ring-threshold-row .threshold-label { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; }
            .ring-threshold-del {
                width: 22px; height: 22px; border: 0; border-radius: 50%; padding: 0;
                background: transparent; color: var(--secondary-text-color); cursor: pointer;
                display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                transition: background var(--awc-e-t), color var(--awc-e-t);
                &:hover { background: rgba(var(--rgb-error-color, 211, 47, 47), 0.12); color: var(--error-color); } }
            .ring-threshold-add {
                display: flex; align-items: center; justify-content: center; gap: var(--awc-e-s2);
                width: 100%; padding: var(--awc-e-s2); margin-top: var(--awc-e-s2); border: 1.5px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.4);
                border-radius: var(--awc-e-r-ctrl); background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.06); color: var(--primary-color);
                font-size: var(--awc-e-f-label); font-weight: 500; cursor: pointer; transition: background var(--awc-e-t), border-color var(--awc-e-t);
                &:hover { background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.12); border-color: var(--primary-color); }
                & ha-icon { --mdc-icon-size: 16px; }}
            /* Visual Button Builder */
            .vcb { display: flex; flex-direction: column; gap: var(--awc-e-s2); }
            /* Format picker: refined mini diagrams */
            .vcb-format-row { display: flex; gap: var(--awc-e-s2); }
            .vcb-format-card { flex: 1; border: 1.5px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.10); border-radius: var(--awc-e-r-box); padding: 8px 6px 6px; cursor: pointer; background: transparent; transition: border-color 0.12s, background 0.12s; display: flex; flex-direction: column; align-items: center; gap: 5px; list-style: none; }
            .vcb-format-card::before, .vcb-format-card::marker { content: none; display: none; }
            .vcb-format-card:hover { border-color: rgba(var(--rgb-primary-color, 0, 120, 212), 0.4); background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.03); }
            .vcb-format-card.active { border-color: var(--primary-color); background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.08); }
            .vcb-fmt { display: flex; gap: 4px; align-items: center; height: 24px; }
            .vcb-fmt.stacked { gap: 5px; }
            .vcb-fmt.stacked .vcb-fmt-col { display: flex; flex-direction: column; gap: 2px; }
            .vcb-fmt.vertical { flex-direction: column; gap: 3px; align-items: center; height: auto; }
            .vcb-fmt-sq { width: 12px; height: 12px; border-radius: 3px; background: var(--primary-color); opacity: 0.35; }
            .vcb-format-card.active .vcb-fmt-sq { opacity: 0.55; }
            .vcb-fmt-bar { height: 3px; border-radius: 1.5px; }
            .vcb-fmt-bar.sm { width: 14px; background: var(--secondary-text-color); opacity: 0.25; }
            .vcb-fmt-bar.lg { width: 18px; background: var(--primary-text-color); opacity: 0.4; }
            .vcb-format-card.active .vcb-fmt-bar.sm { opacity: 0.35; }
            .vcb-format-card.active .vcb-fmt-bar.lg { opacity: 0.55; }
            .vcb-format-name { font-size: 10px; color: var(--secondary-text-color); font-weight: 500; }
            .vcb-format-card.active .vcb-format-name { color: var(--primary-color); font-weight: 600; }
            .vcb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--awc-e-s2); }
            .vcb-section { border-top: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06); }
            .vcb-section-head { display: flex; align-items: center; gap: var(--awc-e-s2); padding: 8px 0 2px; cursor: pointer; user-select: none; }
            .vcb-section-head ha-icon { --mdc-icon-size: 16px; color: var(--secondary-text-color); }
            .vcb-section-head ha-icon.chevron { transition: transform 0.12s; }
            .vcb-section-head.open ha-icon.chevron { transform: rotate(90deg); }
            .vcb-section-title { font-size: var(--awc-e-f-label); font-weight: 500; color: var(--primary-text-color); flex: 1; }
            .vcb-section-body { padding: var(--awc-e-s2) 0 var(--awc-e-s3); }
            .vcb-section-body > * + * { margin-top: 6px; }
            .vcb-section-head .vcb-reorder { display: flex; gap: 2px; margin-left: auto; }
            .vcb-section-head .vcb-reorder button { width: 22px; height: 20px; border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.10); border-radius: 4px; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--secondary-text-color); padding: 0; transition: background 0.12s, color 0.12s; }
            .vcb-section-head .vcb-reorder button:hover { background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.12); color: var(--primary-color); }
            .vcb-section-head .vcb-reorder button:disabled { opacity: 0.15; cursor: default; pointer-events: none; }
            .vcb-section-head .vcb-reorder button ha-icon { --mdc-icon-size: 13px; }
            .vcb-section.dimmed > .vcb-section-head { opacity: 0.45; }
            .vcb-section.dimmed > .vcb-section-head:hover { opacity: 0.7; }
            .vcb-nested-group { margin-left: 12px; padding-left: 10px; border-left: 2px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06); }
        `;}
    setConfig(config) {
        const c = { ...(config || {}) };
        if (c.disable_weather_visuals === true && c.disable_background == null) c.disable_background = true;
        delete c.disable_weather_visuals;
        delete c.disable_sky_gradient;
        let autofilled = false;
        if (!c.weather_entity && this.hass && this.hass.states) {
            const firstWeather = Object.keys(this.hass.states).find((id) => id.startsWith("weather."));
            if (firstWeather) { c.weather_entity = firstWeather; autofilled = true; }}
        if (!c.sun_entity && this.hass && this.hass.states && this.hass.states["sun.sun"]) {
            c.sun_entity = "sun.sun";
            autofilled = true;}
        this._config = this._cleanConfig(c);
        if (c.card_color_mode === "light")      this._colorModeState = "force_light";
        else if (c.card_color_mode === "dark")  this._colorModeState = "force_dark";
        else if (c.theme_entity)                this._colorModeState = "entity";
        else                                    this._colorModeState = "ha_theme";
        if (autofilled) Promise.resolve().then(() => this._emit());}
    get _formData() {
        if (this._cachedFormData && this._cachedFormConfig === this._config && this._cachedFormColorMode === this._colorModeState) {
            return this._cachedFormData;}
        const c = { ...DISPLAY_DEFAULTS, ...(this._config || {}) };
        c._color_mode = this._colorModeState || ( c.card_color_mode === "light" ? "force_light" :
            c.card_color_mode === "dark"  ? "force_dark"  :
            c.theme_entity      ? "entity"      : "ha_theme");
        c._visual_mode = c.disable_background === true ? "none"
            : (c.weather_image_path || c.weather_image_path_night) ? "images"
            : c.simple_background === true ? "simple"
            : "visuals";
        this._cachedFormData = c; this._cachedFormConfig = this._config; this._cachedFormColorMode = this._colorModeState;
        return c;}
    _colorModeSchema() {
        const c = this._formData, showThemeEntity = c._color_mode === "entity";
        return [
            {
                name: "_color_mode", selector: { select: { mode: "dropdown", options: OPT.color_mode } }},
            ...(showThemeEntity ? [{ name: "theme_entity", selector: { entity: {} } }] : [])];}
    _setVisualMode(mode) {
        const clear = ["disable_background", "simple_background", "weather_image_path", "weather_image_path_night", "disable_weather_visuals", "disable_sky_gradient"];
        if (mode === "none") {
            this._patch({ disable_background: true, night_sky_effects: false, sun_effects: false, theme_adapt: false }, { strip: clear.filter(k => k !== "disable_background") });
        } else if (mode === "simple") {
            this._patch({ simple_background: true }, { strip: clear.filter(k => k !== "simple_background") });
        } else if (mode === "images") {
            this._patch({ weather_image_path: "/local/weather-images/day" }, { strip: clear.filter(k => k !== "weather_image_path") });
        } else {
            this._patch({}, { strip: clear });
        }}
    _getAreas() {
        const areas = (this._config || {}).button_areas;
        return Array.isArray(areas) && areas.length > 0
            ? areas.map(a => (a && typeof a === "object") ? a : {})
            : [];
    }
    _getButtonsForArea(areaIdx) {
        const area = this._getAreas()[areaIdx];
        const buttons = area && area.buttons;
        return Array.isArray(buttons) && buttons.length > 0
            ? buttons.map(s => (s && typeof s === "object") ? s : {})
            : [];
    }
    _commitAreas(list) {
        if (!Array.isArray(list) || list.length === 0) {
            this._patch({}, { strip: ["button_areas"] });
            return;
        }
        this._patch({ button_areas: list });
    }
    _updateAreaAt(idx, newArea) {
        const list = this._getAreas().map((a, i) => i === idx ? newArea : a);
        this._commitAreas(list);
    }
    _commitButtonsInArea(areaIdx, buttons) {
        const areas = [...this._getAreas()];
        const area = { ...areas[areaIdx] };
        if (!buttons || buttons.length === 0) delete area.buttons;
        else area.buttons = buttons;
        areas[areaIdx] = area;
        this._commitAreas(areas);
    }
    _updateAreaField(areaIdx, key, value) {
        const area = { ...(this._getAreas()[areaIdx] || {}) };
        const isEmpty = value === null || value === undefined || value === "";
        if (isEmpty) delete area[key];
        else area[key] = value;
        this._updateAreaAt(areaIdx, area);
    }
    _areaTitle(area, idx) {
        const pos = (area.position || "bottom-left").toString();
        const hasVis = Array.isArray(area.visibility) && area.visibility.length > 0;
        return `${pos}${hasVis ? " · conditional" : ""}`;
    }
    _imageStatusSchema() {
        const c = this._formData, hasStatus = !!c.status_entity;
        return [
            { name: "status_entity", selector: { entity: {} } }, ...(hasStatus ? [
                {
                    type: "grid", name: "", schema: [
                        { name: "status_day",   selector: { text: {} } }, { name: "status_night", selector: { text: {} } }]
                }] : [])];}
    _computeLabel = (schema) => {
        if (!schema || !schema.name) return "";
        if (schema.name in LABELS) return LABELS[schema.name];
        return schema.name;};
    _computeHelper = (schema) => {
        if (!schema || !schema.name) return undefined;
        return HELPERS[schema.name] || undefined;};
    _valueChanged(ev) {
        ev.stopPropagation(); if (!this._config) return; const prev = this._config;
        const incoming = { ...((ev.detail && ev.detail.value) || {}) };
        const strip = [];
        if (incoming._color_mode !== undefined) {
            this._colorModeState = incoming._color_mode;
            switch (incoming._color_mode) {
                case "ha_theme":
                    strip.push("theme_entity"); incoming.card_color_mode = "ha_theme";
                    break;
                case "entity":
                    strip.push("card_color_mode");
                    if (!incoming.theme_entity) {
                        incoming.theme_entity = incoming.sun_entity
                            || (this.hass && this.hass.states && this.hass.states["sun.sun"] ? "sun.sun" : "");}
                    break;
                case "force_light":
                    strip.push("theme_entity"); incoming.card_color_mode = "light";
                    break;
                case "force_dark":
                    strip.push("theme_entity"); incoming.card_color_mode = "dark";
                    break;}}
        delete incoming._color_mode;
        if (incoming.status_entity && !prev.status_entity) {
            if (!incoming.status_day && incoming.image_day) incoming.status_day = incoming.image_day;
            if (!incoming.status_night && incoming.image_night) incoming.status_night = incoming.image_night;}
            this._patch(incoming, { replace: true, strip });}
    _patch(changes, opts) {
        const options = opts || {};
        const base = options.replace ? {} : { ...(this._config || {}) };
        const next = { ...base, ...changes };
        if (Array.isArray(options.strip)) {
            for (const k of options.strip) delete next[k];}
        this._config = this._cleanConfig(next);
        this._emit();}
    _computeInactiveKeys(c) {
        const out = new Set();
        if (c.card_color_mode === "light" || c.card_color_mode === "dark") out.add("theme_entity");
        return out;}
    _cleanConfig(config) {
        const out = { ...config };
        for (const key of Object.keys(out)) {
            if (key === "button_areas") continue;
            const v = out[key];
            if (v === "" || v === null || v === undefined) {
                delete out[key];
                continue;}
            if (Array.isArray(v) && v.length === 0) {
                delete out[key];
                continue;}
            if (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0) delete out[key];}
        for (const [k, defVal] of Object.entries(DISPLAY_DEFAULTS)) {
            if (out[k] === defVal) delete out[k];}
        const inactive = this._computeInactiveKeys(out); for (const k of inactive) delete out[k]; delete out._color_mode; delete out._visual_mode;
        const ordered = {};
        for (const k of KEY_ORDER) {
            if (k === "custom_cards" || k === "button_areas") continue;
            if (k in out) ordered[k] = out[k];}
        for (const k of Object.keys(out)) {
            if (k === "custom_cards" || k === "button_areas") continue;
            if (!(k in ordered)) ordered[k] = out[k];}
        if ("button_areas" in out) ordered.button_areas = out.button_areas;
        if ("custom_cards" in out) ordered.custom_cards = out.custom_cards;
        return ordered;}
    _emit() {
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: { ...(this._config || {}) } }, bubbles: true, composed: true}));}
    _renderForm(schema) {
        if (!schema || schema.length === 0) return "";
        return html`<ha-form
                .hass=${this.hass}
                .data=${this._formData}
                .schema=${schema}
                .computeLabel=${this._computeLabel}
                .computeHelper=${this._computeHelper}
                @value-changed=${this._valueChanged}
            ></ha-form>`;}
    _renderClearableText(name) {
        const val = (this._formData || {})[name];
        return html`<div class="clearable-field">
            ${this._renderForm([{ name, selector: { text: {} } }])}
            ${val ? html`<button type="button" class="clear-btn" title="Clear" @click=${() => this._updateField(name, "")}><ha-icon icon="mdi:close"></ha-icon></button>` : ""}
        </div>`;}
    _renderDisclosure(label, content) {
        const isAdvanced = label === "Advanced options";
        return html`<details class="disclosure" @toggle=${this._onDisclosureToggle}>
                <summary>
                    <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                    ${isAdvanced ? html`<ha-icon icon="mdi:cog-outline"></ha-icon>` : ""}
                    <span>${label}</span></summary>
                <div class="disclosure-body">${content}</div></details>`;}
    _renderSubDisclosure(label, content) {
        return html`<details class="sub-disclosure" @toggle=${this._onSubDisclosureToggle}>
                <summary>
                    <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                    <span>${label}</span></summary>
                <div class="disclosure-body">${content}</div></details>`;}
    _onSubDisclosureToggle(e) {
        const el = e.currentTarget; if (!el.open) return; const parent = el.parentElement;
        if (!parent) return;
        parent.querySelectorAll(":scope > details.sub-disclosure[open]").forEach((d) => {
            if (d !== el) d.open = false;});}
    _onDisclosureToggle(e) {
        const el = e.currentTarget; if (!el.open) return; const parent = el.parentElement;
        if (!parent) return;
        parent.querySelectorAll(":scope > details.disclosure[open]").forEach((d) => {
            if (d !== el) d.open = false;});}
    _renderPositionGrid(field, gridDef, noBox, sideContent) {
        const valueMap = gridDef.valueMap || {};
        const reverseMap = Object.fromEntries(Object.entries(valueMap).map(([k, v]) => [v, k]));
        const stored = this._formData[field] || "", value = reverseMap[stored] || stored, cells = gridDef.cells.flat();
        const disabledSet = new Set(gridDef.disabled || []), helper = HELPERS[field], labelText = LABELS[field] || field;
        const grid = html`<div class="grid-3x3" role="radiogroup" aria-label=${labelText}>
                    ${cells.map((val) => { if (val === null) return html`<div class="grid-cell empty"></div>`; const isDisabled = disabledSet.has(val); return html`<button type="button"
                                role="radio"
                                class="grid-cell ${value === val ? "active" : ""} ${isDisabled ? "disabled" : ""}"
                                ?disabled=${isDisabled}
                                title=${isDisabled ? `${val} (not supported here)` : val}
                                aria-label=${val}
                                @click=${isDisabled ? null : () => this._setField(field, valueMap[val] || val)}
                            ></button>`;
                    })}</div>`;
        const inner = html`<div class="${noBox ? 'settings-group-label' : 'grid-picker-label'}">${labelText}</div>
                ${sideContent ? html`<div class="grid-with-side">${grid}<div class="grid-side">${sideContent}</div></div>` : grid}
                ${gridDef.extras ? html`<div class="grid-extras"> ${gridDef.extras.map( (ex) => html`<button type="button"
                                          class="grid-extra ${value === ex.value ? "active" : ""}"
                                          aria-pressed=${value === ex.value ? "true" : "false"}
                                          @click=${() => this._setField(field, ex.value)}
                                      >
                                          ${ex.label}</button>`)}
                          </div>`: ""}
                ${helper ? html`<div class="grid-helper">${helper}</div>` : ""}`;
        return noBox ? inner : html`<div class="grid-picker">${inner}</div>`;}
    _setField(field, value) {
        const current = this._config || {};
        if (current[field] === value) {
            this._patch({}, { strip: [field] });
            return;}
        this._patch({ [field]: value });}
    _updateField(field, value) {
        const isEmpty = value === null || value === undefined || value === "";
        if (isEmpty) { this._patch({}, { strip: [field] }); return; }
        this._patch({ [field]: value });}
    _onPanelToggle(id, expanded) {
        if (expanded) this._openPanel = id;
        else if (this._openPanel === id) this._openPanel = null;}
    _renderCardStyleSegmented() {
        return html`<div class="compact-fields">
                    ${this._renderCompactField("card_height", "e.g. 220 or auto")}
                    ${this._renderCompactField("card_padding", "e.g. 16px")}</div>`;}    _parseOffset(raw) {
        if (!raw || typeof raw !== "string") return [0, 0, 0, 0];
        const parts = raw.trim().split(/\s+/).map((p) => parseInt(p, 10) || 0);
        switch (parts.length) {
            case 0:  return [0, 0, 0, 0]; case 1:  return [parts[0], parts[0], parts[0], parts[0]]; case 2:  return [parts[0], parts[1], parts[0], parts[1]];
            case 3:  return [parts[0], parts[1], parts[2], parts[1]];
            default: return [parts[0], parts[1], parts[2], parts[3]];}}
    _serializeOffset(arr) {
        if (arr.every((v) => v === 0)) return "";
        return arr.map((v) => `${v}px`).join(" ");}
    _setOffsetPart(index, rawValue) {
        const parts = this._parseOffset(this._formData.card_offset); parts[index] = parseInt(rawValue, 10) || 0;
        this._updateField("card_offset", this._serializeOffset(parts));}
    _renderImageOffsetInline() {
        const c = this._formData; if (!c.image_day && !c.image_night) return "";
        return html`<div class="grid-picker-label">Image Offset</div>
                <div class="img-offset-grid">
                    <label><span>X</span><input type="text" inputmode="numeric" placeholder="0"
                        .value=${String(c.image_x || "")}
                        @change=${(e) => this._updateField("image_x", e.target.value.trim())}></label>
                    <label><span>Y</span><input type="text" inputmode="numeric" placeholder="0"
                        .value=${String(c.image_y || "")}
                        @change=${(e) => this._updateField("image_y", e.target.value.trim())}></label></div>`;}
    _renderOffsetPicker() {
        const parts = this._parseOffset(this._formData.card_offset), edges = ["Top", "Right", "Bottom", "Left"];
        return html`<div class="settings-group-label">${LABELS.card_offset}</div>
                <div class="composite-grid-4">
                    ${edges.map( (label, i) => html`<label> <span>${label}</span> <input
                                    type="number"
                                    step="1"
                                    .value=${String(parts[i])}
                                    @change=${(e) =>
                                        this._setOffsetPart(i, e.target.value)}
                                ></label>`)}</div>
                ${HELPERS.card_offset
                    ? html`<div class="composite-helper">${HELPERS.card_offset}</div>`: ""}`;}
    _renderCustomCardsEditor() {
        const cards = Array.isArray(this._config && this._config.custom_cards)
            ? this._config.custom_cards
            : [];
        return html`${cards.length === 0
                ? html`<div class="cards-empty">No cards yet.</div>`
                : cards.map((card, idx) => this._renderCardRow(card, idx, cards.length))}
            <button type="button" class="add-card-btn" @click=${this._addBlankCard}>
                <ha-icon icon="mdi:plus"></ha-icon>
                <span>Add card</span></button>`;}
    _renderListRow({ idx, total, expanded, title, badge, onToggle, onMoveUp, onMoveDown, onRemove, onDuplicate, body }) {
        return html`<div class="card-row ${expanded ? "expanded" : ""}">
                <div class="card-row-head" @click=${onToggle}>
                    <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                    ${badge ? badge : ""}
                    <span class="card-row-title">${title}</span>
                    <div class="card-row-actions" @click=${(e) => e.stopPropagation()}>
                        <button type="button" title="Move up" ?disabled=${idx === 0} @click=${onMoveUp}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
                        <button type="button" title="Move down" ?disabled=${idx === total - 1} @click=${onMoveDown}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
                        ${onDuplicate ? html`<button type="button" title="Duplicate" @click=${onDuplicate}><ha-icon icon="mdi:content-copy"></ha-icon></button>` : ""}
                        <button type="button" title="Delete" @click=${onRemove}><ha-icon icon="mdi:delete-outline"></ha-icon></button></div></div>
                ${expanded ? html`<div class="card-row-body">${body}</div>` : ""}</div>`;}
    _renderCardRow(card, idx, total) {
        const expanded = this._expandedCard === idx;
        const title = (card && card.type) ? String(card.type).replace(/^custom:/, "") : "card";
        const body = html`<div class="card-size-row">
                <div class="offset-field">
                    <span class="offset-field-label">Custom Width</span>
                    <input type="text"
                        placeholder="e.g. 140px or 60%"
                        .value=${card.custom_width || ""}
                        @change=${(e)=>{const v=e.target.value.trim(); const nc={...card}; if(v) nc.custom_width=v; else delete nc.custom_width; this._updateCardAt(idx,nc);}}
                    ></div>
                <div class="offset-field">
                    <span class="offset-field-label">Custom Height</span>
                    <input type="text"
                        placeholder="e.g. 110px"
                        .value=${card.custom_height || ""}
                        @change=${(e)=>{const v=e.target.value.trim(); const nc={...card}; if(v) nc.custom_height=v; else delete nc.custom_height; this._updateCardAt(idx,nc);}}
                    ></div></div>
            <ha-form
                .hass=${this.hass}
                .data=${{ _card: card }}
                .schema=${[{ name: "_card", selector: { object: {} } }]}
                .computeLabel=${() => ""}
                @value-changed=${(e) => {
                    e.stopPropagation();
                    this._updateCardAt(idx, (e.detail && e.detail.value && e.detail.value._card) || {});}}
            ></ha-form>`;
        return this._renderListRow({
            idx, total, expanded, title, body, onToggle:   () => this._toggleCardExpanded(idx),
            onMoveUp:   () => this._moveCard(idx, -1), onMoveDown: () => this._moveCard(idx, 1), onRemove:   () => this._removeCard(idx),});}
    _toggleCardExpanded(idx) {
        this._expandedCard = this._expandedCard === idx ? null : idx;}
    _moveCard(idx, delta) {
        const cards = [...((this._config && this._config.custom_cards) || [])];
        const target = idx + delta; if (target < 0 || target >= cards.length) return; [cards[idx], cards[target]] = [cards[target], cards[idx]];
        if (this._expandedCard === idx) this._expandedCard = target;
        else if (this._expandedCard === target) this._expandedCard = idx;
        this._updateField("custom_cards", cards);}
    _removeCard(idx) {
        const cards = [...((this._config && this._config.custom_cards) || [])];
        cards.splice(idx, 1); if (this._expandedCard === idx) this._expandedCard = null;
        else if (typeof this._expandedCard === "number" && this._expandedCard > idx) {
            this._expandedCard = this._expandedCard - 1;}
        this._updateField("custom_cards", cards);}
    _updateCardAt(idx, newCard) {
        const cards = [...((this._config && this._config.custom_cards) || [])];
        cards[idx] = newCard;
        this._updateField("custom_cards", cards);}
    _addBlankCard = () => {
        const cards = [...((this._config && this._config.custom_cards) || []), { type: "entity", entity: "", custom_width: "100%" }];
        this._expandedCard = cards.length - 1;
        this._updateField("custom_cards", cards);};
    _buttonTitle(button) {
        const name = (button && button.name || "").toString().trim(), entity = (button && button.entity || "").toString().trim();
        const attribute = (button && button.attribute || "").toString().trim();
        if (!entity) return name ? `${name} — (no entity)` : "(choose an entity)";
        const st = this.hass && this.hass.states && this.hass.states[entity], friendly = st && st.attributes && st.attributes.friendly_name;
        const label = friendly || entity;
        if (button.forecast) {
            const type = button.forecast === "hourly" ? "Hourly" : "Daily", offset = parseInt(button.forecast_offset, 10) || 0;
            const offsetLabel = button.forecast === "hourly"
                ? (offset === 0 ? "now" : `+${offset}h`)
                : (offset === 0 ? "today" : offset === 1 ? "tomorrow" : `+${offset}d`);
            const attrLabel = attribute || "condition";
            const base = `${label} · ${type} ${offsetLabel} [${attrLabel}]`;
            return name ? `${name} — ${base}` : base;}
        const withAttr = attribute ? `${label} [${attribute}]` : label;
        return name ? `${name} — ${withAttr}` : withAttr;}
    _cleanButton(button) {
        const out = { ...button };
        if (!out.entity) { delete out.attribute; delete out.forecast; delete out.forecast_offset; }
        if (!out.forecast) { delete out.forecast_offset; delete out.forecast_precision; }
        if (out.forecast_offset === 0) delete out.forecast_offset;
        if (!out.sub_value_entity && !out.sub_value_attribute) { delete out.sub_value_format; delete out.sub_value_size; delete out.sub_value_weight; delete out.hide_sub_value; }
        if (out.type !== 'ring' && out.type !== 'bar') { delete out.gauge_entity; delete out.gauge_attribute; }
        if (out.type !== 'ring') { delete out.ring_min; delete out.ring_max; delete out.ring_color; delete out.ring_width; delete out.ring_gap; delete out.ring_thresholds; delete out.ring_threshold_mode; }
        if (out.type !== 'bar') { delete out.bar_min; delete out.bar_max; delete out.bar_color; delete out.bar_height; delete out.bar_thresholds; delete out.bar_threshold_mode; }
        if (out.type !== 'sun-arc') { delete out.arc_body_size; delete out.arc_text_size; delete out.arc_stroke_width; delete out.arc_color_start; delete out.arc_color_end; }
        if (!Array.isArray(out.color_thresholds) || out.color_thresholds.length === 0) { delete out.color_thresholds; delete out.color_threshold_entity; delete out.color_threshold_attribute; }
        for (const k of Object.keys(out)) {
            const v = out[k];
            if (k === 'unit_format' || k === 'name_format' || k === 'sub_value_format' || k === 'ring_min' || k === 'bar_min') { if (v === null || v === undefined) delete out[k]; continue; }
            if (k === 'background' && v === false) continue; if (k === 'icon_background' && v === false) continue;
            if (v === "" || v === null || v === undefined || v === false) delete out[k];}
        return out;}
    _updateButtonAt(areaIdx, idx, newButton) {
        const list = this._getButtonsForArea(areaIdx).map((c, i) => i === idx ? this._cleanButton(newButton) : c);
        this._commitButtonsInArea(areaIdx, list);}
    _addButton = (areaIdx) => {
        const list = this._getButtonsForArea(areaIdx);
        const weatherEntity = (this._config && this._config.weather_entity) || "";
        const newButton = weatherEntity ? { entity: weatherEntity } : {};
        const next = [...list, newButton];
        this._expandedButton = next.length - 1;
        this._commitButtonsInArea(areaIdx, next);};
    _moveButton(areaIdx, idx, delta) {
        const list = [...this._getButtonsForArea(areaIdx)], target = idx + delta;
        if (target < 0 || target >= list.length) return; [list[idx], list[target]] = [list[target], list[idx]];
        if (this._expandedButton === idx) this._expandedButton = target;
        else if (this._expandedButton === target) this._expandedButton = idx;
        this._commitButtonsInArea(areaIdx, list);}
    _removeButton(areaIdx, idx) {
        const list = [...this._getButtonsForArea(areaIdx)]; list.splice(idx, 1);
        delete this[`_acc_open_${areaIdx}_${idx}`]; delete this[`_text_acc_${areaIdx}_${idx}`];
        for (let i = idx; i < list.length; i++) {
            this[`_acc_open_${areaIdx}_${i}`] = this[`_acc_open_${areaIdx}_${i + 1}`] || null;
            this[`_text_acc_${areaIdx}_${i}`] = this[`_text_acc_${areaIdx}_${i + 1}`] || null;}
        delete this[`_acc_open_${areaIdx}_${list.length}`]; delete this[`_text_acc_${areaIdx}_${list.length}`];
        if (this._expandedButton === idx) this._expandedButton = null;
        else if (typeof this._expandedButton === "number" && this._expandedButton > idx) {
            this._expandedButton = this._expandedButton - 1;}
        this._commitButtonsInArea(areaIdx, list);}
    _duplicateButton(areaIdx, idx) {
        const list = [...this._getButtonsForArea(areaIdx)];
        list.splice(idx + 1, 0, { ...list[idx] });
        this._expandedButton = idx + 1;
        this._commitButtonsInArea(areaIdx, list);}
    _toggleButtonExpanded(idx) {
        this._expandedButton = this._expandedButton === idx ? null : idx; this.requestUpdate();}

    _buttonLabel = (schema) => {
        if (!schema || !schema.name) return "";
        if (schema.name in BUTTON_LABELS) return BUTTON_LABELS[schema.name];
        return schema.name;};
    _buttonHelper = (schema) => {
        if (!schema || !schema.name) return undefined;
        return BUTTON_HELPERS[schema.name] || undefined;};
    _renderButtonRow(button, idx, total, areaIdx) {
        const expanded = this._expandedButton === idx;
        const isFree = (button.position || "").toString().toLowerCase() === "custom";
        const isFc = !!button.forecast;
        const buttonType = button.type || "";
        const posBadge = isFree
            ? html`<span class="button-badge-free"><ha-icon icon="mdi:cursor-move"></ha-icon></span>`
            : html`<span class="button-badge-row"><ha-icon icon="mdi:view-grid-outline"></ha-icon></span>`;
        if (!expanded) {
            return this._renderListRow({
                idx, total, expanded, body: "", badge: posBadge, title: this._buttonTitle(button),
                onToggle: () => this._toggleButtonExpanded(idx), onMoveUp: () => this._moveButton(areaIdx, idx, -1),
                onMoveDown: () => this._moveButton(areaIdx, idx, 1), onDuplicate: () => this._duplicateButton(areaIdx, idx), onRemove: () => this._removeButton(areaIdx, idx)});}
        /* Helpers */
        const entityId = (button.entity || "").toString().trim();
        const hasEntity = !!entityId;
        const nameSensorId = (button.name_sensor || "").toString().trim();
        const fcEntityMissing = isFc && entityId && !entityId.startsWith("weather.");
        const cardWeatherEntity = (this._config && this._config.weather_entity) || "";
        const update = (next) => this._updateButtonAt(areaIdx, idx, next);
        const buttonForm = (schema) => html`<ha-form .hass=${this.hass} .data=${button}
                .schema=${schema} .computeLabel=${this._buttonLabel} .computeHelper=${this._buttonHelper}
                @value-changed=${(e) => { e.stopPropagation(); update((e.detail && e.detail.value) || {}); }}></ha-form>`;
        const cssField = (key, label, placeholder) => html`<div class="css-field">
                <span class="css-field-label">${label}</span>
                <input type="text" placeholder=${placeholder}
                    .value=${button[key] !== undefined ? String(button[key]) : ""}
                    @change=${(e) => { const v = e.target.value; const next = { ...button };
                        if (key === "unit_format" || key === "sub_value_format" || key === "name_format") { next[key] = v; }
                        else if (v.trim()) next[key] = v.trim(); else delete next[key]; update(next); }}></div>`;
        /* State — resolve with area fallback */
        const area = this._getAreas()[areaIdx] || {};
        const _r = (buttonKey, areaKey) => button[buttonKey] !== undefined ? button[buttonKey] : (area[areaKey] !== undefined ? area[areaKey] : undefined);
        const fmt = (_r("style", "button_style") || "inline").toString().toLowerCase();
        const showIcon = button.hide_icon !== true;
        const showLabel = button.hide_label !== true;
        const showValue = button.hide_value !== true;
        const hasSubValue = !!(button.sub_value_entity || button.sub_value_attribute);
        const showSub = hasSubValue && button.hide_sub_value !== true;
        const subEntityId = (button.sub_value_entity || "").toString().trim();
        const isWeatherIcon = (button.icon || "").toString().trim().toLowerCase() === "weather";
        const fcAttr = button.attribute || "condition";
        const fcOff = parseInt(button.forecast_offset, 10) || 0;
        /* Entity state for fancy_unit check */
        const st = this.hass && this.hass.states && this.hass.states[entityId];
        const stAttr = st && st.attributes;
        const isBarType = buttonType === 'bar';
        const elOrder = button.element_order ? button.element_order.toString().split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];
        const BASE_ELS = ['icon', 'text'];
        const getOrderedEls = () => {
            const pool = [...BASE_ELS, 'bar'];
            if (!elOrder.length) return pool;
            const o = elOrder.filter(e => pool.includes(e));
            pool.forEach(e => { if (!o.includes(e)) o.push(e); });
            return o;
        };
        const elements = getOrderedEls();
        const isElHidden = (el) => {
            if (el === 'icon') return !showIcon;
            if (el === 'text') return !showLabel && !showValue;
            return false;
        };
        const moveEl = (el, dir) => {
            const cur = [...elements];
            const i = cur.indexOf(el);
            if (i < 0) return;
            const ni = i + dir;
            if (ni < 0 || ni >= cur.length) return;
            [cur[i], cur[ni]] = [cur[ni], cur[i]];
            const defaultEls = [...BASE_ELS, 'bar'];
            const isDefault = cur.every((e, j) => e === defaultEls[j]);
            const n = { ...button }; if (isDefault) delete n.element_order; else n.element_order = cur.join(','); update(n);
        };
        /* Format picker */
        const formatPicker = html`<div class="vcb-format-row">
            ${[{v:"inline",l:"Inline"},{v:"stacked",l:"Stacked"},{v:"vertical",l:"Vertical"}].map(o => {
                const areaFmt = (area.button_style || "inline").toString().toLowerCase();
                const effectiveFmt = button.style || areaFmt;
                const a = effectiveFmt === o.v;
                const isAreaDefault = o.v === areaFmt;
                const hasOverride = button.style !== undefined;
                return html`<button type="button" class="vcb-format-card ${a ? 'active' : ''}"
                    @click=${() => { const n = { ...button }; if (a && hasOverride) delete n.style; else if (isAreaDefault) delete n.style; else n.style = o.v; update(n); }}>
                    <div class="vcb-fmt ${o.v}">
                        ${o.v === "stacked" ? html`<div class="vcb-fmt-sq"></div><div class="vcb-fmt-col"><div class="vcb-fmt-bar sm"></div><div class="vcb-fmt-bar lg"></div></div>`
                        : o.v === "vertical" ? html`<div class="vcb-fmt-sq"></div><div class="vcb-fmt-bar sm"></div><div class="vcb-fmt-bar lg"></div>`
                        : html`<div class="vcb-fmt-sq"></div><div class="vcb-fmt-bar sm"></div><div class="vcb-fmt-bar lg"></div>`}</div>
                    <span class="vcb-format-name">${o.l}</span></button>`; })}</div>`;
        /* Button element sections (accordions) */
        const elIdx = (name) => elements.indexOf(name);
        const reorderBtns = (name) => { const i = elIdx(name); if (i < 0) return ""; return html`<span class="vcb-reorder" @click=${(e) => e.stopPropagation()}>
            <button type="button" ?disabled=${i === 0} @click=${() => moveEl(name, -1)} title="Move up"><ha-icon icon="mdi:chevron-up"></ha-icon></button>
            <button type="button" ?disabled=${i === elements.length - 1} @click=${() => moveEl(name, 1)} title="Move down"><ha-icon icon="mdi:chevron-down"></ha-icon></button></span>`; };
        const iconContent = html`<div class="toggle-group"><label class="toggle-row"><span>Hide</span>
                <ha-switch .checked=${!showIcon} @change=${(e) => { const n = { ...button }; if (e.target.checked) n.hide_icon = true; else delete n.hide_icon; update(n); }}></ha-switch></label></div>
            ${showIcon ? html`${isWeatherIcon ? html`<div class="weather-icon-active">
                    <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px;color:var(--primary-color)"></ha-icon>
                    <div class="weather-icon-active-text"><span>Weather icon</span><span class="weather-icon-active-sub">${isFc ? "Matches forecast" : "Matches weather"}</span></div>
                    <button type="button" class="icon-weather-btn" @click=${() => { const n = { ...button }; delete n.icon; update(n); }}>Remove</button></div>`
                : html`<div class="icon-combo">
                    <ha-form style="flex:1;min-width:0" .hass=${this.hass} .data=${{ icon: button.icon || "" }}
                        .schema=${[{ name: "icon", selector: { icon: {} } }]} .computeLabel=${() => ""}
                        @value-changed=${(e) => { e.stopPropagation(); update({ ...button, icon: (e.detail && e.detail.value && e.detail.value.icon) || "" }); }}></ha-form>
                    <button type="button" class="icon-weather-btn" title="Weather icon" @click=${() => update({ ...button, icon: "weather" })}><ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:18px"></ha-icon></button></div>`}
                <div class="clearable-field">
                    ${buttonForm([{ name: "icon_path", selector: { text: {} } }])}
                    ${button.icon_path ? html`<button type="button" class="clear-btn" title="Clear" @click=${() => { const n = { ...button }; delete n.icon_path; update(n); }}><ha-icon icon="mdi:close"></ha-icon></button>` : ""}</div>
                <div class="vcb-grid">${cssField("icon_size", "Size", "auto")}${cssField("icon_padding", "Padding", "auto")}</div>
                <div class="toggle-group"><label class="toggle-row"><span>Background</span>
                    <ha-switch .checked=${button.icon_background === true}
                        @change=${(e) => { const n = { ...button }; if (e.target.checked) n.icon_background = true; else { if (button.icon_background !== undefined) n.icon_background = false; else delete n.icon_background; } update(n); }}></ha-switch></label></div>
                ${button.icon_background === true ? this._renderColorPicker("Color", button.icon_background_color || "", (h, o) => { const next = { ...button }; if (!h) delete next.icon_background_color; else next.icon_background_color = this._serializeColor(h, o); update(next); }) : ""}` : ""}`;
        const labelContent = html`<div class="toggle-group"><label class="toggle-row"><span>Hide</span>
                <ha-switch .checked=${!showLabel} @change=${(e) => { const n = { ...button }; if (e.target.checked) n.hide_label = true; else delete n.hide_label; update(n); }}></ha-switch></label></div>
            ${showLabel ? html`${buttonForm([{ name: "name", selector: { text: {} } }])}
                ${buttonForm([{ name: "name_sensor", selector: { entity: {} } }])}
                ${nameSensorId ? buttonForm([{ name: "name_attribute", selector: { attribute: { entity_id: nameSensorId } } }])
                    : isFc && !button.name ? html`<ha-form .hass=${this.hass} .data=${{ name_attribute: button.name_attribute || "" }}
                        .schema=${[{ name: "name_attribute", selector: { select: { mode: "dropdown", options: FC_ATTRIBUTES } } }]}
                        .computeLabel=${() => "Forecast attribute"}
                        @value-changed=${(e) => { e.stopPropagation(); const v = e.detail && e.detail.value && e.detail.value.name_attribute; const n = { ...button }; if (v) n.name_attribute = v; else delete n.name_attribute; update(n); }}></ha-form>` : ""}
                ${nameSensorId ? buttonForm([{ name: "name_format", selector: { text: {} } }]) : cssField("name_format", "Custom unit", "")}
                ${cssField("label_size", "Size", "auto")}
                <div class="segmented segmented-compact" role="radiogroup">
                    ${[{v:"",l:"Normal"},{v:"500",l:"Light"},{v:"600",l:"Medium"},{v:"700",l:"Bold"}].map(o => html`<button type="button" role="radio" class=${(button.label_weight||"")===o.v?"active":""}
                        @click=${()=>{const n={...button};if(o.v)n.label_weight=o.v;else delete n.label_weight;update(n);}}>${o.l}</button>`)}</div>
                ${buttonForm([{ name: "label_overflow", selector: { select: { mode: "dropdown", options: OPT.button_overflow } } }])}` : ""}`;
        const entitySection = isFc
            ? buttonForm([{ name: "entity", selector: { entity: { domain: "weather" } } }])
            : buttonForm([{ name: "entity", selector: { entity: {} } }, ...(entityId ? [{ name: "attribute", selector: { attribute: { entity_id: entityId } } }] : [])]);
        const emptyNudge = !hasEntity ? html`<div class="button-nudge info"><ha-icon icon="mdi:information-outline" style="--mdc-icon-size:14px;flex-shrink:0"></ha-icon> Pick an entity.</div>` : "";
        const fcWarning = fcEntityMissing ? html`<div class="button-nudge warning"><ha-icon icon="mdi:alert-circle-outline" style="--mdc-icon-size:14px;flex-shrink:0"></ha-icon> Forecast needs a weather entity.</div>` : "";
        const valueContent = html`<div class="toggle-group"><label class="toggle-row"><span>Hide</span>
                <ha-switch .checked=${!showValue} @change=${(e) => { const n = { ...button }; if (e.target.checked) n.hide_value = true; else delete n.hide_value; update(n); }}></ha-switch></label>
                ${showValue || isFc ? html`<label class="toggle-row"><span>Fancy unit</span>
                    <ha-switch .checked=${button.fancy_unit === true} @change=${(e) => { const n = { ...button }; if (e.target.checked) n.fancy_unit = true; else delete n.fancy_unit; update(n); }}></ha-switch></label>` : ""}</div>
            ${showValue ? html`${buttonForm([{ name: "unit_format", selector: { text: {} } }])}
                ${cssField("text_size", "Size", "auto")}
                <div class="segmented segmented-compact" role="radiogroup">
                    ${[{v:"",l:"Normal"},{v:"500",l:"Light"},{v:"600",l:"Medium"},{v:"700",l:"Bold"}].map(o => html`<button type="button" role="radio" class=${(button.value_weight||"")===o.v?"active":""}
                        @click=${()=>{const n={...button};if(o.v)n.value_weight=o.v;else delete n.value_weight;update(n);}}>${o.l}</button>`)}</div>
                ${buttonForm([{ name: "overflow", selector: { select: { mode: "dropdown", options: OPT.button_overflow } } }])}` : ""}`;
        const subContent = html`<div class="toggle-group"><label class="toggle-row"><span>Hide</span>
                <ha-switch .checked=${button.hide_sub_value === true}
                    @change=${(e) => { const n = { ...button }; if (e.target.checked) n.hide_sub_value = true; else delete n.hide_sub_value; update(n); }}></ha-switch></label></div>
            ${button.hide_sub_value !== true ? html`${buttonForm([{ name: "sub_value_entity", selector: { entity: {} } }])}
                ${subEntityId ? buttonForm([{ name: "sub_value_attribute", selector: { attribute: { entity_id: subEntityId } } }])
                    : isFc ? html`<ha-form .hass=${this.hass} .data=${{ sub_value_attribute: button.sub_value_attribute || "" }}
                        .schema=${[{ name: "sub_value_attribute", selector: { select: { mode: "dropdown", options: FC_ATTRIBUTES } } }]}
                        .computeLabel=${() => "Forecast attribute"}
                        @value-changed=${(e) => { e.stopPropagation(); const v = e.detail && e.detail.value && e.detail.value.sub_value_attribute; const n = { ...button }; if (v) n.sub_value_attribute = v; else delete n.sub_value_attribute; update(n); }}></ha-form>` : ""}
                ${hasSubValue ? html`<div class="vcb-grid">${cssField("sub_value_format", "Unit", "")}${cssField("sub_value_size", "Size", "auto")}</div>
                    <div class="segmented segmented-compact" role="radiogroup">
                        ${[{v:"",l:"Normal"},{v:"500",l:"Light"},{v:"600",l:"Medium"},{v:"700",l:"Bold"}].map(o => html`<button type="button" role="radio" class=${(button.sub_value_weight||"")===o.v?"active":""}
                            @click=${()=>{const n={...button};if(o.v)n.sub_value_weight=o.v;else delete n.sub_value_weight;update(n);}}>${o.l}</button>`)}</div>
                    ${buttonForm([{ name: "sub_value_overflow", selector: { select: { mode: "dropdown", options: OPT.button_overflow } } }])}` : ""}` : ""}`;
        /* Accordion section helpers */
        const sk = `_vcbs_${areaIdx}_${idx}`;
        const nk = `_vcbn_${areaIdx}_${idx}`;
        const secOpen = this[sk] || null;
        const nestedOpen = this[nk] || null;
        /* Text order (label / value / sub within button-content) */
        const txtOrder = button.text_order ? button.text_order.toString().split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];
        const BASE_TXTS = ['label', 'value', 'sub'];
        const getOrderedTxts = () => {
            if (!txtOrder.length) return [...BASE_TXTS];
            const o = txtOrder.filter(e => BASE_TXTS.includes(e));
            BASE_TXTS.forEach(e => { if (!o.includes(e)) o.push(e); });
            return o;
        };
        const textElements = getOrderedTxts();
        const isTxtHidden = (el) => {
            if (el === 'label') return !showLabel;
            if (el === 'value') return !showValue;
            if (el === 'sub') return button.hide_sub_value === true || !hasSubValue;
            return false;
        };
        const moveTxt = (el, dir) => {
            const cur = [...textElements];
            const i = cur.indexOf(el);
            if (i < 0) return;
            const ni = i + dir;
            if (ni < 0 || ni >= cur.length) return;
            [cur[i], cur[ni]] = [cur[ni], cur[i]];
            const isDefault = cur.every((e, j) => e === BASE_TXTS[j]);
            const n = { ...button }; if (isDefault) delete n.text_order; else n.text_order = cur.join(','); update(n);
        };
        const txtElIdx = (name) => textElements.indexOf(name);
        const txtReorderBtns = (name) => { const i = txtElIdx(name); if (i < 0) return ""; return html`<span class="vcb-reorder" @click=${(e) => e.stopPropagation()}>
            <button type="button" ?disabled=${i === 0} @click=${() => moveTxt(name, -1)} title="Move up"><ha-icon icon="mdi:chevron-up"></ha-icon></button>
            <button type="button" ?disabled=${i === textElements.length - 1} @click=${() => moveTxt(name, 1)} title="Move down"><ha-icon icon="mdi:chevron-down"></ha-icon></button></span>`; };
        const nestedElSection = (key, icon, title, content, hidden) => {
            const isOpen = nestedOpen === key;
            return html`<div class="vcb-section ${hidden ? 'dimmed' : ''}">
                <div class="vcb-section-head ${isOpen ? 'open' : ''}" @click=${() => { this[nk] = isOpen ? null : key; this.requestUpdate(); }}>
                    <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                    <ha-icon icon=${icon}></ha-icon>
                    <span class="vcb-section-title">${title}</span>
                    ${txtReorderBtns(key)}</div>
                ${isOpen ? html`<div class="vcb-section-body">${content}</div>` : ""}</div>`;};
        const nestedSection = (key, icon, title, content) => {
            const isOpen = nestedOpen === key;
            return html`<div class="vcb-section">
                <div class="vcb-section-head ${isOpen ? 'open' : ''}" @click=${() => { this[nk] = isOpen ? null : key; this.requestUpdate(); }}>
                    <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                    <ha-icon icon=${icon}></ha-icon>
                    <span class="vcb-section-title">${title}</span></div>
                ${isOpen ? html`<div class="vcb-section-body">${content}</div>` : ""}</div>`;};
        const section = (key, icon, title, content, hidden) => {
            const isOpen = secOpen === key;
            return html`<div class="vcb-section ${hidden ? 'dimmed' : ''}">
                <div class="vcb-section-head ${isOpen ? 'open' : ''}" @click=${() => { this[sk] = isOpen ? null : key; this.requestUpdate(); }}>
                    <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                    <ha-icon icon=${icon}></ha-icon>
                    <span class="vcb-section-title">${title}</span></div>
                ${isOpen ? html`<div class="vcb-section-body">${content}</div>` : ""}</div>`;};
        /* Element sections with reorder arrows */
        const elSection = (key, icon, title, content, hidden) => {
            const isOpen = secOpen === key;
            return html`<div class="vcb-section ${hidden ? 'dimmed' : ''}">
                <div class="vcb-section-head ${isOpen ? 'open' : ''}" @click=${() => { this[sk] = isOpen ? null : key; this.requestUpdate(); }}>
                    <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
                    <ha-icon icon=${icon}></ha-icon>
                    <span class="vcb-section-title">${title}</span>
                    ${reorderBtns(key)}</div>
                ${isOpen ? html`<div class="vcb-section-body">${content}</div>` : ""}</div>`;};
        /* Button source / type picker */
        const typePicker = html`<div class="button-type-picker">
            <button type="button" class="button-type-btn ${!isFc ? "active" : ""}"
                @click=${() => { const n = { ...button }; delete n.forecast; delete n.forecast_offset; delete n.forecast_precision; update(n); }}
            ><ha-icon class="button-type-icon ${!isFc ? "active-icon" : ""}" icon="mdi:gauge"></ha-icon>
                <div class="button-type-text"><span class="button-type-name">Sensor</span><span class="button-type-desc">Live entity</span></div></button>
            <button type="button" class="button-type-btn ${isFc ? "active" : ""}"
                @click=${() => { const cur = entityId; const ent = (cur && cur.startsWith("weather.")) ? cur : (cardWeatherEntity || cur);
                    const n = { ...button, forecast: "daily", attribute: "temperature", forecast_offset: 0, icon: "weather" }; if (ent) n.entity = ent; update(n); }}
            ><ha-icon class="button-type-icon ${isFc ? "active-icon" : ""}" icon="mdi:calendar-clock"></ha-icon>
                <div class="button-type-text"><span class="button-type-name">Forecast</span><span class="button-type-desc">Weather</span></div></button></div>`;
        const forecastContent = isFc && !fcEntityMissing ? html`<div class="segmented" role="radiogroup">
                    ${[{v:"daily",l:"Daily"},{v:"hourly",l:"Hourly"}].map(o=>html`<button type="button" role="radio" class=${button.forecast===o.v?"active":""}
                        @click=${()=>update({...button,forecast:o.v,forecast_offset:0})}>${o.l}</button>`)}</div>
                ${(()=>{const mx=button.forecast==="hourly"?23:6,lb=button.forecast==="hourly"?"Hours ahead":"Days ahead",
                    hp=button.forecast==="hourly"?(fcOff===0?"Now":`+${fcOff}h`):(fcOff===0?"Today":fcOff===1?"Tomorrow":`+${fcOff} days`),
                    pc=Math.round((fcOff/mx)*100);
                    return html`<div class="awc-slider"><div class="awc-slider-head"><span class="awc-slider-label">${lb}</span>
                        <input type="number" class="awc-slider-num" min="0" max=${mx} step="1" .value=${String(fcOff)}
                            @change=${(e)=>{const v=Math.min(mx,Math.max(0,parseInt(e.target.value,10)||0));const r=e.target.closest('.awc-slider').querySelector('.awc-slider-range');if(r){r.value=v;r.style.setProperty('--awc-slider-pct',Math.round((v/mx)*100)+'%');}update({...button,forecast_offset:v});}}></div>
                        <input type="range" class="awc-slider-range" min="0" max=${mx} step="1" .value=${String(fcOff)} style="--awc-slider-pct:${pc}%"
                            @input=${(e)=>{const v=parseInt(e.target.value,10);e.target.style.setProperty('--awc-slider-pct',Math.round((v/mx)*100)+'%');const n=e.target.closest('.awc-slider').querySelector('.awc-slider-num');if(n)n.value=v;}}
                            @change=${(e)=>update({...button,forecast_offset:parseInt(e.target.value,10)})}><div class="awc-slider-helper">${hp}</div></div>`;})()}
                <ha-form .hass=${this.hass} .data=${{attribute:fcAttr}}
                    .schema=${[{name:"attribute",selector:{select:{mode:"dropdown",options:FC_ATTRIBUTES}}}]}
                    .computeLabel=${()=>"Show"}
                    @value-changed=${(e)=>{e.stopPropagation();const v=e.detail&&e.detail.value&&e.detail.value.attribute;if(v!==undefined)update({...button,attribute:v});}}></ha-form>
                ${fcAttr !== "condition" && showValue ? html`${(()=>{const prec=button.forecast_precision!==undefined?button.forecast_precision:0,pc=Math.round((prec/2)*100);
                    return html`<div class="awc-slider"><div class="awc-slider-head"><span class="awc-slider-label">Decimals</span>
                        <input type="number" class="awc-slider-num" min="0" max="2" step="1" .value=${String(prec)}
                            @change=${(e)=>{const v=Math.min(2,Math.max(0,parseInt(e.target.value,10)||0));const r=e.target.closest('.awc-slider').querySelector('.awc-slider-range');if(r){r.value=v;r.style.setProperty('--awc-slider-pct',Math.round((v/2)*100)+'%');}update({...button,forecast_precision:v});}}></div>
                        <input type="range" class="awc-slider-range" min="0" max="2" step="1" .value=${String(prec)} style="--awc-slider-pct:${pc}%"
                            @input=${(e)=>{const v=parseInt(e.target.value,10);e.target.style.setProperty('--awc-slider-pct',Math.round((v/2)*100)+'%');const n=e.target.closest('.awc-slider').querySelector('.awc-slider-num');if(n)n.value=v;}}
                            @change=${(e)=>update({...button,forecast_precision:parseInt(e.target.value,10)})}></div>`;})()}` : ""}` : null;
        /* Scrolling */
        const isValueMarquee = (button.overflow || "").toLowerCase() === "marquee";
        const isLabelMarquee = (button.label_overflow || "").toLowerCase() === "marquee";
        const isSubMarquee = (button.sub_value_overflow || "").toLowerCase() === "marquee";
        const marqueeContent = (isValueMarquee || isLabelMarquee || isSubMarquee) ? html`<div class="toggle-group"><label class="toggle-row"><span>Right-to-left</span>
                <ha-switch .checked=${button.marquee_rtl === true} @change=${(e) => { const n = { ...button }; if (e.target.checked) n.marquee_rtl = true; else delete n.marquee_rtl; update(n); }}></ha-switch></label></div>
            ${(() => { const spd = parseFloat(button.marquee_speed) || 30, pc = Math.round(((spd - 5) / 95) * 100);
                return html`<div class="awc-slider"><div class="awc-slider-head"><span class="awc-slider-label">Speed</span>
                    <input type="number" class="awc-slider-num" min="5" max="100" step="5" .value=${String(spd)}
                        @change=${(e)=>{const v=Math.min(100,Math.max(5,parseInt(e.target.value,10)||30));const r=e.target.closest('.awc-slider').querySelector('.awc-slider-range');if(r){r.value=v;r.style.setProperty('--awc-slider-pct',Math.round(((v-5)/95)*100)+'%');}update({...button,marquee_speed:v});}}></div>
                    <input type="range" class="awc-slider-range" min="5" max="100" step="5" .value=${String(spd)} style="--awc-slider-pct:${pc}%"
                        @input=${(e)=>{const v=parseInt(e.target.value,10);e.target.style.setProperty('--awc-slider-pct',Math.round(((v-5)/95)*100)+'%');const n=e.target.closest('.awc-slider').querySelector('.awc-slider-num');if(n)n.value=v;}}
                        @change=${(e)=>update({...button,marquee_speed:parseInt(e.target.value,10)})}></div>`;})()}` : null;
        /* Appearance */
        const appearContent = html`${formatPicker}
            <div class="toggle-group">
                <label class="toggle-row"><span>Round shape</span><ha-switch .checked=${button.button_round === true}
                    @change=${(e) => { const n = { ...button }; if (e.target.checked) n.button_round = true; else delete n.button_round; update(n); }}></ha-switch></label>
                <label class="toggle-row"><span>Background</span><ha-switch .checked=${button.background !== false}
                    @change=${(e) => { const n = { ...button }; if (!e.target.checked) n.background = false; else delete n.background; update(n); }}></ha-switch></label></div>
            ${button.background !== false ? this._renderColorPicker("Background color", button.background_color || "", (h, o) => { const next = { ...button }; if (!h) delete next.background_color; else next.background_color = this._serializeColor(h, o); update(next); }) : ""}
            <div class="segmented" role="radiogroup">
                ${[{v:"start",l:"Left"},{v:"center",l:"Center"},{v:"end",l:"Right"},{v:"spread",l:"Spread"}].map(o => html`<button type="button" role="radio" class=${button.align===o.v?"active":""}
                    @click=${()=>{const n={...button};if(button.align===o.v)delete n.align;else n.align=o.v;update(n);}}>${o.l}</button>`)}</div>
            <div class="vcb-grid">${cssField("width", "Width", "auto")}${cssField("height", "Height", "auto")}</div>
            ${cssField("padding", "Padding", "auto")}
            <div class="vcb-grid">${cssField("inner_gap", "Button gap", "6px")}${cssField("text_gap", "Text gap", fmt === "inline" ? "0.35em" : "4px")}</div>
            <div class="toggle-group"><label class="toggle-row"><span>Text shadow</span>
                <ha-switch .checked=${button.text_shadow === true}
                    @change=${(e) => { const n = { ...button }; if (e.target.checked) n.text_shadow = true; else delete n.text_shadow; update(n); }}></ha-switch></label></div>
            <div class="toggle-group"><label class="toggle-row"><span>Color thresholds</span>
                <ha-switch .checked=${Array.isArray(button.color_thresholds) && button.color_thresholds.length > 0}
                    @change=${(e) => { const n = { ...button }; if (e.target.checked) n.color_thresholds = [{ value: "", color: "#ff9800" }]; else { delete n.color_thresholds; delete n.color_threshold_entity; delete n.color_threshold_attribute; } update(n); }}></ha-switch></label></div>
            ${Array.isArray(button.color_thresholds) && button.color_thresholds.length > 0 ? html`<div class="field-group">
                <details class="disclosure" @toggle=${this._onDisclosureToggle}><summary><ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon><ha-icon icon="mdi:cog-outline"></ha-icon><span>Threshold entity</span></summary>
                    <div class="disclosure-body">
                        <ha-form .hass=${this.hass} .data=${{color_threshold_entity:button.color_threshold_entity||""}} .schema=${[{name:"color_threshold_entity",selector:{entity:{}}}]} .computeLabel=${()=>"Entity"}
                            @value-changed=${(e)=>{e.stopPropagation();const v=e.detail&&e.detail.value&&e.detail.value.color_threshold_entity;const n={...button};if(v)n.color_threshold_entity=v;else delete n.color_threshold_entity;update(n);}}></ha-form>
                        ${(button.color_threshold_entity||"").trim()?html`<ha-form .hass=${this.hass} .data=${{color_threshold_attribute:button.color_threshold_attribute||""}} .schema=${[{name:"color_threshold_attribute",selector:{attribute:{entity_id:button.color_threshold_entity}}}]} .computeLabel=${()=>"Attribute"}
                            @value-changed=${(e)=>{e.stopPropagation();const v=e.detail&&e.detail.value&&e.detail.value.color_threshold_attribute;const n={...button};if(v)n.color_threshold_attribute=v;else delete n.color_threshold_attribute;update(n);}}></ha-form>`:""}</div></details>
                ${button.color_thresholds.map((t,ti)=>html`<div class="ring-threshold-row"><span class="threshold-label">≥</span>
                    <input type="text" placeholder="value" .value=${String(t.value!=null?t.value:"")} @change=${(e)=>{const arr=[...button.color_thresholds];arr[ti]={...arr[ti],value:e.target.value.trim()};update({...button,color_thresholds:arr});}}>
                    <input type="color" class="button-color-swatch" .value=${t.color||"#ff9800"} @input=${(e)=>{const arr=[...button.color_thresholds];arr[ti]={...arr[ti],color:e.target.value};update({...button,color_thresholds:arr});}}>
                    <button type="button" class="ring-threshold-del" title="Remove" @click=${()=>{const arr=[...button.color_thresholds];arr.splice(ti,1);update({...button,color_thresholds:arr.length?arr:undefined});}}><ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon></button></div>`)}
                <button type="button" class="ring-threshold-add" @click=${()=>update({...button,color_thresholds:[...button.color_thresholds,{value:"",color:"#ff9800"}]})}><ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon> Add threshold</button></div>` : ""}`;
        /* Gauge */
        const GAUGE_SUFFIXES = ["min","max","color","thresholds","threshold_mode"];
        const gaugeFields = (prefix) => { const p = prefix + "_", label = prefix === "ring" ? "Ring" : "Bar",
            thresholds = Array.isArray(button[p+"thresholds"]) ? button[p+"thresholds"] : [];
            const gaugeEntityId = (button.gauge_entity || "").toString().trim();
            return html`<div class="vcb-grid">${cssField(p+"min","Min","0")}${cssField(p+"max","Max","100")}</div>
                <div class="vcb-grid">${prefix==="ring"?html`${cssField("ring_width","Thickness","4")}${cssField("ring_gap","Gap","3")}`:html`${cssField("bar_height","Thickness","4")}`}</div>
                ${this._renderColorPicker(`${label} color`,button[p+"color"]||"",(h,o)=>{const next={...button};if(!h)delete next[p+"color"];else next[p+"color"]=this._serializeColor(h,o);update(next);})}
                <details class="disclosure" @toggle=${this._onDisclosureToggle}><summary><ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon><ha-icon icon="mdi:cog-outline"></ha-icon><span>${label} entity</span></summary>
                    <div class="disclosure-body">${buttonForm([{name:"gauge_entity",selector:{entity:{}}}])}
                        ${gaugeEntityId?buttonForm([{name:"gauge_attribute",selector:{attribute:{entity_id:gaugeEntityId}}}])
                            :isFc?html`<ha-form .hass=${this.hass} .data=${{gauge_attribute:button.gauge_attribute||""}} .schema=${[{name:"gauge_attribute",selector:{select:{mode:"dropdown",options:FC_ATTRIBUTES}}}]} .computeLabel=${()=>"Forecast attribute"}
                                @value-changed=${(e)=>{e.stopPropagation();const v=e.detail&&e.detail.value&&e.detail.value.gauge_attribute;const n={...button};if(v)n.gauge_attribute=v;else delete n.gauge_attribute;update(n);}}></ha-form>`:""}</div></details>
                <details class="disclosure" @toggle=${this._onDisclosureToggle}><summary><ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon><ha-icon icon="mdi:cog-outline"></ha-icon><span>Thresholds</span></summary>
                    <div class="disclosure-body">
                        <div class="segmented" role="radiogroup">${[{v:"solid",l:"Solid"},{v:"segments",l:"Segments"},{v:"gradient",l:"Gradient"}].map(o=>html`<button type="button" role="radio" class=${(button[p+"threshold_mode"]||"solid")===o.v?"active":""}
                            @click=${()=>{const n={...button};if(o.v==="solid")delete n[p+"threshold_mode"];else n[p+"threshold_mode"]=o.v;update(n);}}>${o.l}</button>`)}</div>
                        ${thresholds.map((t,ti)=>html`<div class="ring-threshold-row"><span class="threshold-label">≥</span>
                            <input type="text" placeholder="value" .value=${String(t.value!=null?t.value:"")} @change=${(e)=>{const arr=[...thresholds];arr[ti]={...arr[ti],value:e.target.value.trim()};update({...button,[p+"thresholds"]:arr});}}>
                            <input type="color" class="button-color-swatch" .value=${t.color||"#ff0000"} @input=${(e)=>{const arr=[...thresholds];arr[ti]={...arr[ti],color:e.target.value};update({...button,[p+"thresholds"]:arr});}}>
                            <button type="button" class="ring-threshold-del" @click=${()=>{const arr=[...thresholds];arr.splice(ti,1);update({...button,[p+"thresholds"]:arr.length?arr:undefined});}}><ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon></button></div>`)}
                        <button type="button" class="ring-threshold-add" @click=${()=>update({...button,[p+"thresholds"]:[...thresholds,{value:"",color:"#ff9800"}]})}><ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon> Add</button></div></details>`;};
        const isRingType = buttonType === 'ring';
        const ringContent = html`<div class="toggle-group"><label class="toggle-row"><span>Enable</span>
            <ha-switch .checked=${isRingType} @change=${(e) => { const n = { ...button };
                if (e.target.checked) { n.type = 'ring';
                    if (buttonType === 'bar') for (const s of GAUGE_SUFFIXES) { const src = 'bar_' + s, dst = 'ring_' + s; if (n[src] !== undefined && n[dst] === undefined) n[dst] = n[src]; }
                } else { delete n.type; } update(n); }}></ha-switch></label></div>
            ${isRingType ? gaugeFields("ring") : ""}`;
        const barContent = html`<div class="toggle-group"><label class="toggle-row"><span>Enable</span>
            <ha-switch .checked=${isBarType} @change=${(e) => { const n = { ...button };
                if (e.target.checked) { n.type = 'bar';
                    if (buttonType === 'ring') for (const s of GAUGE_SUFFIXES) { const src = 'ring_' + s, dst = 'bar_' + s; if (n[src] !== undefined && n[dst] === undefined) n[dst] = n[src]; }
                } else { delete n.type; } update(n); }}></ha-switch></label></div>
            ${isBarType ? gaugeFields("bar") : ""}`;
        /* Sun Arc */
        const isSunArc = buttonType === 'sun-arc';
        const sunArcContent = html`<div class="toggle-group"><label class="toggle-row"><span>Enable</span>
            <ha-switch .checked=${isSunArc} @change=${(e) => { const n = { ...button };
                if (e.target.checked) {
                    n.type = 'sun-arc';
                    if (!n.entity) n.entity = 'sun.sun';
                    n.hide_icon = true; n.hide_value = true; n.hide_label = true;
                } else { delete n.type; delete n.hide_icon; delete n.hide_value; delete n.hide_label;
                    delete n.arc_body_size; delete n.arc_text_size; delete n.arc_stroke_width;
                    delete n.arc_color_start; delete n.arc_color_end; } update(n); }}></ha-switch></label></div>
            ${isSunArc ? html`<div class="fc-box" style="background:rgba(var(--rgb-primary-text-color,0,0,0),0.03)">
                <div style="display:flex;align-items:center;gap:var(--awc-e-s2);font-size:var(--awc-e-f-meta);color:var(--secondary-text-color)">
                    <ha-icon icon="mdi:lightbulb-outline" style="--mdc-icon-size:16px;flex-shrink:0"></ha-icon>
                    <span>Draws a sun/moon arc using the built-in weather icons. Set the entity to <b>sun.sun</b>.</span>
                </div></div>
                <div class="vcb-grid">
                    ${cssField("arc_body_size", "Icon size", "6")}
                    ${cssField("arc_text_size", "Time text", "0.75em")}
                </div>
                ${cssField("arc_stroke_width", "Stroke width", "1.8")}
                ${this._renderColorPicker("Stroke start", button.arc_color_start || "", (h, o) => { const next = { ...button }; if (!h) delete next.arc_color_start; else next.arc_color_start = this._serializeColor(h, o); update(next); })}
                ${this._renderColorPicker("Stroke end", button.arc_color_end || "", (h, o) => { const next = { ...button }; if (!h) delete next.arc_color_end; else next.arc_color_end = this._serializeColor(h, o); update(next); })}` : ""}`;
        /* Position */
        const ANCHORS = ["top-left","top-center","top-right","left","center","right","bottom-left","bottom-center","bottom-right"];
        const currentAnchor = button.position_anchor || "top-left";
        const posContent = html`<div class="toggle-group"><label class="toggle-row"><span>Free positioning</span>
            <ha-switch .checked=${isFree} @change=${(e)=>{const n={...button};if(e.target.checked){n.position="custom";if(!n.position_anchor)n.position_anchor="top-left";}else{["position","position_anchor","position_x","position_y"].forEach(k=>delete n[k]);}update(n);}}></ha-switch></label></div>
            ${isFree ? html`<div class="free-pos-layout"><div><div class="settings-group-label">Anchor</div>
                <div class="anchor-grid" role="radiogroup">${ANCHORS.map(v=>html`<button type="button" role="radio" class="anchor-cell ${currentAnchor===v?"active":""}" title=${v}
                    @click=${()=>update({...button,position_anchor:v})}></button>`)}</div></div>
                <div><div class="settings-group-label">Offset</div><div class="offset-fields">
                    <div class="offset-field"><span class="offset-field-label">X</span><input type="text" placeholder="0" .value=${String(button.position_x||"")}
                        @change=${(e)=>{const n={...button},v=e.target.value.trim();if(v)n.position_x=v;else delete n.position_x;update(n);}}></div>
                    <div class="offset-field"><span class="offset-field-label">Y</span><input type="text" placeholder="0" .value=${String(button.position_y||"")}
                        @change=${(e)=>{const n={...button},v=e.target.value.trim();if(v)n.position_y=v;else delete n.position_y;update(n);}}></div></div></div></div>` : ""}`;
        const tapContent = buttonForm([{ name: "tap_action", selector: { ui_action: {} } }]);
        /* Sub value access for buttons without one yet */
        const subSetupContent = html`${buttonForm([{ name: "sub_value_entity", selector: { entity: {} } }])}
            ${isFc ? html`<ha-form .hass=${this.hass} .data=${{ sub_value_attribute: button.sub_value_attribute || "" }}
                .schema=${[{ name: "sub_value_attribute", selector: { select: { mode: "dropdown", options: FC_ATTRIBUTES } } }]}
                .computeLabel=${() => "Forecast attribute"}
                @value-changed=${(e) => { e.stopPropagation(); const v = e.detail && e.detail.value && e.detail.value.sub_value_attribute; const n = { ...button }; if (v) n.sub_value_attribute = v; else delete n.sub_value_attribute; update(n); }}></ha-form>` : ""}`;
        /* Reset */
        const BUTTON_STYLE_KEYS = ["style","align","background","icon_background","background_color","icon_background_color","padding","text_size","label_size","inner_gap","text_gap","icon_size","icon_padding","width","height","value_weight","label_weight","button_round","sub_value_size","sub_value_weight","color_thresholds","color_threshold_entity","color_threshold_attribute","element_order","text_order","text_shadow"];
        const hasStyleOverrides = BUTTON_STYLE_KEYS.some(k => button[k] !== undefined && button[k] !== "");
        /* Body assembly */
        const isWeatherEntity = entityId.startsWith("weather.");
        const textContent = html`<div class="vcb-nested-group">${textElements.map(el =>
                    el === 'label' ? nestedElSection("label", "mdi:tag-outline", "Label", labelContent, isTxtHidden('label'))
                    : el === 'value' ? nestedElSection("value", "mdi:numeric", "Value", valueContent, isTxtHidden('value'))
                    : el === 'sub' ? nestedElSection("sub", "mdi:text-box-outline", "Sub Value", hasSubValue ? subContent : subSetupContent, isTxtHidden('sub'))
                    : "")}</div>`;
        const body = html`<div class="vcb">
            ${typePicker}
            ${entitySection}
            ${emptyNudge}${fcWarning}
            ${isFc && isWeatherEntity && forecastContent ? section("forecast", "mdi:calendar-clock", "Forecast", forecastContent) : ""}
            ${elements.map(el => el === 'icon' ? elSection("icon", "mdi:image-outline", "Icon", iconContent, isElHidden('icon'))
                : el === 'text' ? elSection("text", "mdi:text-box-outline", "Text", textContent, isElHidden('text'))
                : el === 'bar' ? elSection("bar", "mdi:chart-bar", "Bar", barContent, !isBarType)
                : "")}
            ${section("ring", "mdi:circle-outline", "Ring", ringContent, !isRingType)}
            ${section("sun-arc", "mdi:weather-sunset-up", "Sun Arc", sunArcContent, !isSunArc)}
            ${this._renderDisclosure("Settings", html`<div class="vcb">
                ${section("appear", "mdi:palette-outline", "Appearance", appearContent)}
                ${marqueeContent ? section("marquee", "mdi:motion-play-outline", "Scrolling", marqueeContent) : ""}
                ${section("pos", "mdi:arrow-all", "Position", posContent)}
                ${section("tap", "mdi:gesture-tap", "Tap Action", tapContent)}
                ${section("vis", "mdi:eye-outline", "Visibility", this._renderButtonVisibility(button, areaIdx, idx, update))}
                ${hasStyleOverrides ? html`<button type="button" class="add-card-btn" style="border-style:solid;border-color:rgba(var(--rgb-error-color,211,47,47),0.35);color:var(--error-color);margin-top:var(--awc-e-s3)"
                    @click=${() => { const n = { ...button }; for (const k of BUTTON_STYLE_KEYS) delete n[k]; update(n); }}><ha-icon icon="mdi:restore"></ha-icon><span>Reset all styles</span></button>` : ""}
            </div>`)}
        </div>`;
        return this._renderListRow({ idx, total, expanded, body, badge: posBadge, title: this._buttonTitle(button),
            onToggle: () => this._toggleButtonExpanded(idx), onMoveUp: () => this._moveButton(areaIdx, idx, -1),
            onMoveDown: () => this._moveButton(areaIdx, idx, 1), onDuplicate: () => this._duplicateButton(areaIdx, idx), onRemove: () => this._removeButton(areaIdx, idx)});}

    _parseColor(raw) {
        const s = (raw || "").toString().trim();
        const m = s.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i);
        if (m) {
            const hex = `#${parseInt(m[1]).toString(16).padStart(2,"0")}${parseInt(m[2]).toString(16).padStart(2,"0")}${parseInt(m[3]).toString(16).padStart(2,"0")}`;
            return { hex, opacity: m[4] !== undefined ? parseFloat(m[4]) : 1, hasColor: true };}
        if (/^#[0-9a-f]{3,8}$/i.test(s)) return { hex: s.slice(0,7), opacity: 1, hasColor: true };
        return { hex: "#ffffff", opacity: 0, hasColor: false };}
    _serializeColor(hex, opacity) {
        if (opacity >= 1) return hex;
        const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
        return `rgba(${r},${g},${b},${parseFloat(opacity.toFixed(2))})`;}
    _renderColorPicker(label, raw, onWrite) {
        const { hex, opacity, hasColor } = this._parseColor(raw);
        return html`<div class="button-color-box">
                <div class="button-color-row">
                    <ha-icon icon="mdi:palette-outline" style="--mdc-icon-size:15px;color:var(--secondary-text-color);flex-shrink:0"></ha-icon>
                    <span class="button-color-label">${label}</span>
                    <input type="color" class="button-color-swatch" .value=${hex}
                        @input=${(e) => onWrite(e.target.value, opacity || 1)}
                    >
                    ${hasColor ? html`<button type="button" class="button-color-clear" title="Clear color" @click=${() => onWrite("", 1)}
                    ><ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon></button>` : ""}</div>
                ${hasColor ? html`<div class="button-color-opacity-row"> <span class="button-color-opacity-label">Opacity</span> <input type="range" min="0" max="1" step="0.05" class="button-color-opacity"
                            .value=${String(opacity)}
                            @input=${(e) => onWrite(hex, parseFloat(e.target.value))}
                        >
                        <span class="button-color-opacity-val">${Math.round(opacity*100)}%</span></div>
                ` : ""}</div>`;}
    _renderSlider(field, label, min, max, step, helper, statusFn) {
        const val = parseFloat(this._formData[field] != null ? this._formData[field] : min) || min, pct = Math.round(((val - min) / (max - min)) * 100);
        const onRange = (e) => {
            const v = parseFloat(e.target.value), p = Math.round(((v - min) / (max - min)) * 100);
            e.target.style.setProperty('--awc-slider-pct', p + '%');
            const numInput = e.target.closest('.awc-slider').querySelector('.awc-slider-num');
            if (numInput) numInput.value = v;
            const statusEl = e.target.closest('.awc-slider').querySelector('.awc-slider-status');
            if (statusEl && statusFn) statusEl.textContent = statusFn(v);};
        const onCommit = (e) => this._updateField(field, parseFloat(e.target.value));
        const onNumInput = (e) => {
            const v = Math.min(max, Math.max(min, parseFloat(e.target.value) || min));
            const range = e.target.closest('.awc-slider').querySelector('.awc-slider-range');
            if (range) { range.value = v; const p = Math.round(((v - min) / (max - min)) * 100); range.style.setProperty('--awc-slider-pct', p + '%'); }
            this._updateField(field, v);};
        const statusText = statusFn ? statusFn(val) : null;
        return html`<div class="awc-slider">
                <div class="awc-slider-head">
                    <span class="awc-slider-label">${label}</span>
                    <input type="number" class="awc-slider-num"
                        min=${min} max=${max} step=${step}
                        .value=${String(val)}
                        @change=${onNumInput}
                    ></div>
                <input type="range" class="awc-slider-range"
                    min=${min} max=${max} step=${step}
                    .value=${String(val)}
                    style="--awc-slider-pct:${pct}%"
                    @input=${onRange}
                    @change=${onCommit}
                >
                ${statusText != null ? html`<div class="awc-slider-status">${statusText}</div>` : ""}
                ${helper ? html`<div class="awc-slider-helper">${helper}</div>` : ""}</div>`;}
    _renderCompactField(field, placeholder) {
        const current = String(this._formData[field] || ""), label = LABELS[field] || field;
        return html`<div class="compact-field">
                <span class="compact-field-label">${label}</span>
                <input
                    type="text"
                    placeholder=${placeholder}
                    .value=${current}
                    @change=${(e) => this._updateField(field, e.target.value || "")}
                ></div>`;}
    _renderButtonAreasEditor() {
        const areas = this._getAreas();
        return html`
            <div class="sensor-list">
                ${areas.map((area, ai) => {
                    const expanded = this._expandedArea === ai;
                    const title = this._areaTitle(area, ai);
                    const body = expanded ? this._renderButtonAreaBody(area, ai) : "";
                    return this._renderListRow({
                        idx: ai, total: areas.length, expanded, body,
                        title: html`<span>Button Area ${ai + 1}</span><span style="font-weight:400;color:var(--secondary-text-color);margin-left:var(--awc-e-s2);font-size:var(--awc-e-f-meta)">${title}</span>`,
                        onToggle:    () => { this._expandedArea = this._expandedArea === ai ? null : ai; this._expandedButton = null; },
                        onMoveUp:    () => this._moveArea(ai, -1),
                        onMoveDown:  () => this._moveArea(ai, 1),
                        onDuplicate: () => this._duplicateArea(ai),
                        onRemove:    () => this._removeArea(ai),
                    });
                })}
            </div>
            <button type="button" class="add-button-btn" @click=${() => this._addArea()}>
                <ha-icon icon="mdi:plus"></ha-icon>
                <span>Add Button Area</span></button>`;
    }
    _addArea() {
        const areas = [...this._getAreas(), { position: "bottom-left" }];
        this._expandedArea = areas.length - 1;
        this._expandedButton = null;
        this._commitAreas(areas);
    }
    _moveArea(idx, delta) {
        const areas = [...this._getAreas()], target = idx + delta;
        if (target < 0 || target >= areas.length) return;
        [areas[idx], areas[target]] = [areas[target], areas[idx]];
        if (this._expandedArea === idx) this._expandedArea = target;
        else if (this._expandedArea === target) this._expandedArea = idx;
        this._commitAreas(areas);
    }
    _removeArea(idx) {
        const areas = [...this._getAreas()]; areas.splice(idx, 1);
        if (this._expandedArea === idx) this._expandedArea = null;
        else if (typeof this._expandedArea === "number" && this._expandedArea > idx) this._expandedArea--;
        this._expandedButton = null;
        this._commitAreas(areas);
    }
    _duplicateArea(idx) {
        const areas = [...this._getAreas()];
        const clone = JSON.parse(JSON.stringify(areas[idx]));
        areas.splice(idx + 1, 0, clone);
        this._expandedArea = idx + 1;
        this._expandedButton = null;
        this._commitAreas(areas);
    }
    _renderAreaColorPicker(areaIdx, key, label) {
        const area = this._getAreas()[areaIdx] || {};
        const raw = (area[key] || "").toString().trim();
        return this._renderColorPicker(label, raw, (h, o) => {
            this._updateAreaField(areaIdx, key, h ? this._serializeColor(h, o) : "");
        });
    }
    _renderButtonAreaBody(area, areaIdx) {
        const list = this._getButtonsForArea(areaIdx);
        const uf = (key, value) => this._updateAreaField(areaIdx, key, value);
        let layout = (area.layout || "wrap").toString().toLowerCase();
        const isGrid   = layout === "grid";
        const isScroll = layout === "horizontal-scroll" || layout === "vertical-scroll";
        const align    = (area.align || "start").toString().toLowerCase();
        const buttonFormat = (area.button_style || "inline").toString().toLowerCase();
        const bgStyle = area.background_style || "frosted", bgActive = !!area.background;
        const sf = (key, label, placeholder) => html`<div class="css-field">
                <span class="css-field-label">${label}</span>
                <input type="text" placeholder=${placeholder}
                    .value=${String(area[key] || "")}
                    @change=${(e) => uf(key, e.target.value || "")}
                ></div>`;
        const areaSlider = (key, label, min, max, step, helper) => {
            const val = parseFloat(area[key] != null ? area[key] : min) || min, pct = Math.round(((val - min) / (max - min)) * 100);
            return html`<div class="awc-slider">
                <div class="awc-slider-head">
                    <span class="awc-slider-label">${label}</span>
                    <input type="number" class="awc-slider-num" min=${min} max=${max} step=${step} .value=${String(val)}
                        @change=${(e) => { const v = Math.min(max, Math.max(min, parseFloat(e.target.value) || min)); const range = e.target.closest('.awc-slider').querySelector('.awc-slider-range'); if (range) { range.value = v; const p = Math.round(((v - min) / (max - min)) * 100); range.style.setProperty('--awc-slider-pct', p + '%'); } uf(key, v); }}
                    ></div>
                <input type="range" class="awc-slider-range" min=${min} max=${max} step=${step} .value=${String(val)} style="--awc-slider-pct:${pct}%"
                    @input=${(e) => { const v = parseFloat(e.target.value), p = Math.round(((v - min) / (max - min)) * 100); e.target.style.setProperty('--awc-slider-pct', p + '%'); const n = e.target.closest('.awc-slider').querySelector('.awc-slider-num'); if (n) n.value = v; }}
                    @change=${(e) => uf(key, parseFloat(e.target.value))}
                >
                ${helper ? html`<div class="awc-slider-helper">${helper}</div>` : ""}</div>`;
        };
        const areaToggle = (toggles) => html`<div class="toggle-group">
                ${toggles.map(t => html`<label class="toggle-row"> <span>${t.label}</span> <ha-switch .checked=${area[t.key] === true}
                            @change=${(e) => uf(t.key, e.target.checked || "")}
                        ></ha-switch></label>`)}</div>`;
        const containerContent = html`<div class="vcb">
                <div style="display:flex;gap:var(--awc-e-s3);align-items:flex-start">
                    ${this._renderAreaPositionGrid(areaIdx, "position", POSITION_GRIDS.button_area_position)}
                    <div style="display:flex;flex-direction:column;gap:var(--awc-e-s2);align-self:center;flex:1;min-width:0">
                        <div class="css-field">
                            <span class="css-field-label">${LABELS.button_area_width}</span>
                            <input type="text" placeholder="auto"
                                .value=${String(area.width || "")}
                                @change=${(e) => uf("width", e.target.value || "")}
                            ></div>
                        <div class="css-field">
                            <span class="css-field-label">${LABELS.button_area_height}</span>
                            <input type="text" placeholder="auto"
                                .value=${String(area.height || "")}
                                @change=${(e) => uf("height", e.target.value || "")}
                            ></div></div></div>
                <div style="display:flex;align-items:center;gap:var(--awc-e-s2)">
                    <span style="font-size:var(--awc-e-f-body);color:var(--secondary-text-color);white-space:nowrap">Stacking</span>
                    <div class="segmented" role="radiogroup" aria-label="Stack direction" style="flex:1">
                        ${[{v:"vertical",l:"↕ Vertical"},{v:"horizontal",l:"↔ Horizontal"}].map(o => {
                            const cur = area.stack_direction || "vertical";
                            return html`<button type="button" role="radio" class=${cur === o.v ? "active" : ""}
                                @click=${() => uf("stack_direction", o.v)}
                            >${o.l}</button>`;
                        })}</div></div>
                <div class="segmented" role="radiogroup" aria-label="Layout">
                    ${OPT.button_area_layout.map(o => html`<button type="button" role="radio" class=${layout === o.value ? "active" : ""}
                            @click=${() => uf("layout", o.value)}
                        >${o.label}</button>`)}</div>
                ${isGrid ? areaSlider("columns", LABELS.button_area_columns, 1, 12, 1) : ""}
                ${isScroll ? areaSlider("scroll_count", LABELS.button_area_scroll_count, 1, 10, 1) : ""}
                <div class="toggle-group"><label class="toggle-row"> <span>${LABELS.button_area_grouped}</span> <ha-switch .checked=${area.grouped === true}
                            @change=${(e) => { const on = e.target.checked; uf("grouped", on || ""); if (on && !bgActive) { uf("background", true); uf("background_style", bgStyle || "frosted"); } }}
                        ></ha-switch></label></div>
                ${areaToggle([{ key: "separator", label: LABELS.button_area_separator }])}
                <div class="vcb-grid">
                    ${sf("gap", LABELS.button_area_gap, "8px")}
                    ${sf("padding", LABELS.button_area_padding, "0")}</div>
                ${area.grouped === true && area.background === true ? this._renderAreaColorPicker(areaIdx, "background_color", "Container background color") : ""}</div>`;
        const buttonsContent = html`<div class="vcb">
                ${this._renderSubDisclosure("Layout", html`<div class="vcb">
                <div class="vcb-format-row">
                    ${[{v:"inline",l:"Inline"},{v:"stacked",l:"Stacked"},{v:"vertical",l:"Vertical"}].map(o => {
                        const a = buttonFormat === o.v;
                        return html`<button type="button" class="vcb-format-card ${a ? 'active' : ''}"
                            @click=${() => uf("button_style", o.v)}>
                            <div class="vcb-fmt ${o.v}">
                                ${o.v === "stacked" ? html`<div class="vcb-fmt-sq"></div><div class="vcb-fmt-col"><div class="vcb-fmt-bar sm"></div><div class="vcb-fmt-bar lg"></div></div>`
                                : o.v === "vertical" ? html`<div class="vcb-fmt-sq"></div><div class="vcb-fmt-col"><div class="vcb-fmt-bar sm"></div><div class="vcb-fmt-bar lg"></div></div>`
                                : html`<div class="vcb-fmt-sq"></div><div class="vcb-fmt-bar sm"></div><div class="vcb-fmt-bar lg"></div>`}</div>
                            <span class="vcb-format-name">${o.l}</span></button>`;})}</div>
                <div class="segmented" role="radiogroup" aria-label="Alignment" style="flex-wrap:nowrap">
                    ${OPT.button_area_align.map(o => html`<button type="button" role="radio" class=${align === o.value ? "active" : ""}
                            @click=${() => uf("align", o.value)}
                        >${o.label}</button>`)}</div></div>`)}
                ${this._renderSubDisclosure("Background", html`<div class="vcb">
                <div class="segmented" role="radiogroup" aria-label="Background">
                    <button type="button" role="radio" class=${!bgActive ? "active" : ""} @click=${() => uf("background", false)}>Off</button>
                    ${[{value:"frosted",label:"Frosted"},{value:"contrast",label:"Contrast"},{value:"theme",label:"Theme"}].map(o => html`<button type="button" role="radio"
                            class=${bgActive && bgStyle === o.value ? "active" : ""}
                            @click=${() => { uf("background", true); uf("background_style", o.value); }}
                        >${o.label}</button>`)}</div>
                <div class="segmented" role="radiogroup" aria-label="Icon background">
                    ${[{value:undefined,label:"Default"},{value:true,label:"On"},{value:false,label:"Off"}].map(o => html`<button type="button" role="radio"
                            class=${(area.button_icon_background === o.value || (o.value === undefined && area.button_icon_background === undefined)) ? "active" : ""}
                            @click=${() => uf("button_icon_background", o.value === undefined ? "" : o.value)}
                        >${o.label}</button>`)}</div>
                ${bgActive || area.button_icon_background === true ? html`
                    ${this._renderAreaColorPicker(areaIdx, "button_background_color", "Button background")}
                    ${this._renderAreaColorPicker(areaIdx, "button_icon_background_color", "Icon background")}` : ""}</div>`)}
                ${this._renderSubDisclosure("Text & Icon Sizes", html`<div class="vcb">
                <div class="vcb-grid">
                    ${sf("button_text_size", "Value size", "auto")}
                    ${sf("button_label_size", "Label size", "auto")}</div>
                <div class="vcb-grid">
                    ${sf("button_icon_size", "Icon size", "auto")}
                    ${sf("sub_value_size", "Sub value size", "auto")}</div></div>`)}
                ${this._renderSubDisclosure("Gaps", html`<div class="vcb">
                <div class="vcb-grid">
                    ${sf("button_gap", "Button gap", "6px")}
                    ${sf("button_text_gap", "Text gap", "0.35em")}</div></div>`)}
                ${this._renderSubDisclosure("Padding", html`<div class="vcb">
                <div class="vcb-grid">
                    ${sf("button_padding", "Button padding", "auto")}
                    ${sf("button_icon_padding", "Icon padding", "auto")}</div></div>`)}</div>`;
        return html`
            <div class="sensor-list">
                ${list.map((button, idx) => this._renderButtonRow(button, idx, list.length, areaIdx))}</div>
            <button type="button" class="add-button-btn" @click=${() => this._addButton(areaIdx)}>
                <ha-icon icon="mdi:plus"></ha-icon>
                <span>Add button</span></button>
            ${this._renderDisclosure("Button Area Settings", containerContent)}
            ${this._renderDisclosure("Button Settings", html`<div class="fc-box" style="background:rgba(var(--rgb-primary-text-color,0,0,0),0.03);margin-bottom:var(--awc-e-s3)">
                <div style="display:flex;align-items:center;gap:var(--awc-e-s2);font-size:var(--awc-e-f-meta);color:var(--secondary-text-color)">
                    <ha-icon icon="mdi:lightbulb-outline" style="--mdc-icon-size:16px;flex-shrink:0"></ha-icon>
                    <span>These settings apply to all buttons in this area. Individual button settings can override them.</span>
                </div></div>${buttonsContent}`)}
            ${this._renderDisclosure("Visibility", this._renderAreaVisibility(area, areaIdx))}`;
    }
    _renderAreaPositionGrid(areaIdx, field, gridDef) {
        const area = this._getAreas()[areaIdx] || {};
        const valueMap = gridDef.valueMap || {};
        const reverseMap = Object.fromEntries(Object.entries(valueMap).map(([k, v]) => [v, k]));
        const stored = area[field] || "", value = reverseMap[stored] || stored, cells = gridDef.cells.flat();
        const disabledSet = new Set(gridDef.disabled || []), labelText = LABELS["button_area_" + field] || field;
        return html`<div>
                <div class="settings-group-label">${labelText}</div>
                <div class="grid-3x3" role="radiogroup" aria-label=${labelText}>
                    ${cells.map((val) => { if (val === null) return html`<div class="grid-cell empty"></div>`; const isDisabled = disabledSet.has(val); return html`<button type="button"
                                role="radio"
                                class="grid-cell ${value === val ? "active" : ""} ${isDisabled ? "disabled" : ""}"
                                ?disabled=${isDisabled}
                                title=${isDisabled ? `${val} (not supported here)` : val}
                                aria-label=${val}
                                @click=${isDisabled ? null : () => this._updateAreaField(areaIdx, field, valueMap[val] || val)}
                            ></button>`;
                    })}</div></div>`;}
    _renderVisibilityConditions(conditions, emptyLabel, commitList) {
        const CONDITION_TYPES = [
            { value: "state", label: "State" },
            { value: "numeric_state", label: "Numeric state" },
            { value: "screen", label: "Screen size" },
            { value: "user", label: "User" },
        ];
        const removeCondition = (ci) => {
            const arr = [...conditions]; arr.splice(ci, 1); commitList(arr);
        };
        const updateCondition = (ci, patch) => {
            const arr = [...conditions]; arr[ci] = { ...arr[ci], ...patch }; commitList(arr);
        };
        const addCondition = () => {
            commitList([...conditions, { condition: "state", entity: "", state: "" }]);
        };
        return html`${conditions.map((c, ci) => {
                const cType = c.condition || "state";
                const onTypeChange = (newType) => {
                    const base = { condition: newType };
                    if (newType === "state") { base.entity = c.entity || ""; base.state = ""; }
                    else if (newType === "numeric_state") { base.entity = c.entity || ""; }
                    else if (newType === "screen") { base.media_query = c.media_query || "(min-width: 768px)"; }
                    else if (newType === "user") { base.users = c.users || []; }
                    const arr = [...conditions]; arr[ci] = base; commitList(arr);
                };
                return html`<div class="field-group" style="position:relative">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--awc-e-s2)">
                        <span class="field-group-label" style="margin:0">Condition ${ci + 1}</span>
                        <button type="button" class="ring-threshold-del" title="Remove" @click=${() => removeCondition(ci)}>
                            <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon></button></div>
                    <div class="segmented segmented-compact" role="radiogroup" aria-label="Condition type">
                        ${CONDITION_TYPES.map(o => html`<button type="button" role="radio"
                            class=${cType === o.value ? "active" : ""}
                            @click=${() => onTypeChange(o.value)}
                        >${o.label}</button>`)}</div>
                    ${cType === "state" ? html`<ha-form .hass=${this.hass}
                            .data=${{ entity: c.entity || "" }}
                            .schema=${[{ name: "entity", selector: { entity: {} } }]}
                            .computeLabel=${() => "Entity"}
                            @value-changed=${(e) => { e.stopPropagation(); updateCondition(ci, { entity: (e.detail && e.detail.value && e.detail.value.entity) || "" }); }}
                        ></ha-form>
                        <div class="css-field-row cols-2">
                            <div class="css-field">
                                <span class="css-field-label">State</span>
                                <input type="text" placeholder="on"
                                    .value=${c.state != null ? String(c.state) : ""}
                                    @change=${(e) => { const v = e.target.value; const arr = [...conditions]; const entry = { ...arr[ci] }; if (v !== "") { entry.state = v; delete entry.state_not; } else { delete entry.state; } arr[ci] = entry; commitList(arr); }}
                                ></div>
                            <div class="css-field">
                                <span class="css-field-label">State not</span>
                                <input type="text" placeholder=""
                                    .value=${c.state_not != null ? String(c.state_not) : ""}
                                    @change=${(e) => { const v = e.target.value; const arr = [...conditions]; const entry = { ...arr[ci] }; if (v !== "") { entry.state_not = v; delete entry.state; } else { delete entry.state_not; } arr[ci] = entry; commitList(arr); }}
                                ></div></div>` : ""}
                    ${cType === "numeric_state" ? html`<ha-form .hass=${this.hass}
                            .data=${{ entity: c.entity || "" }}
                            .schema=${[{ name: "entity", selector: { entity: {} } }]}
                            .computeLabel=${() => "Entity"}
                            @value-changed=${(e) => { e.stopPropagation(); updateCondition(ci, { entity: (e.detail && e.detail.value && e.detail.value.entity) || "" }); }}
                        ></ha-form>
                        <div class="css-field-row cols-2">
                            <div class="css-field">
                                <span class="css-field-label">Above</span>
                                <input type="text" placeholder=""
                                    .value=${c.above != null ? String(c.above) : ""}
                                    @change=${(e) => { const v = e.target.value.trim(); const arr = [...conditions]; if (v !== "") arr[ci] = { ...arr[ci], above: parseFloat(v) }; else { arr[ci] = { ...arr[ci] }; delete arr[ci].above; } commitList(arr); }}
                                ></div>
                            <div class="css-field">
                                <span class="css-field-label">Below</span>
                                <input type="text" placeholder=""
                                    .value=${c.below != null ? String(c.below) : ""}
                                    @change=${(e) => { const v = e.target.value.trim(); const arr = [...conditions]; if (v !== "") arr[ci] = { ...arr[ci], below: parseFloat(v) }; else { arr[ci] = { ...arr[ci] }; delete arr[ci].below; } commitList(arr); }}
                                ></div></div>` : ""}
                    ${cType === "screen" ? html`<div class="css-field">
                            <span class="css-field-label">Media query</span>
                            <input type="text" placeholder="(min-width: 768px)"
                                .value=${c.media_query || ""}
                                @change=${(e) => updateCondition(ci, { media_query: e.target.value.trim() })}
                            ></div>` : ""}
                    ${cType === "user" ? html`<div class="css-field">
                            <span class="css-field-label">User IDs (comma-separated)</span>
                            <input type="text" placeholder="abc123, def456"
                                .value=${Array.isArray(c.users) ? c.users.join(", ") : ""}
                                @change=${(e) => updateCondition(ci, { users: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                            ></div>` : ""}
                </div>`;
            })}
            <button type="button" class="ring-threshold-add" @click=${addCondition}>
                <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon> Add condition</button>
            ${conditions.length > 0 ? html`<div style="font-size:var(--awc-e-f-meta);color:var(--secondary-text-color);line-height:1.4;margin-top:var(--awc-e-s2)">
                All conditions must be met to be visible.</div>` : ""}`;}
    _renderAreaVisibility(area, areaIdx) {
        const conditions = Array.isArray(area.visibility) ? area.visibility : [];
        return this._renderVisibilityConditions(conditions, "This button area is always visible.", (arr) => {
            const n = { ...area };
            if (arr.length) n.visibility = arr; else delete n.visibility;
            this._updateAreaAt(areaIdx, n);
        });}
    _renderButtonVisibility(button, areaIdx, idx, update) {
        const conditions = Array.isArray(button.visibility) ? button.visibility : [];
        return this._renderVisibilityConditions(conditions, "This button is always visible.", (arr) => {
            const n = { ...button };
            if (arr.length) n.visibility = arr; else delete n.visibility;
            update(n);
        });}
    _renderImagesPanel() {
        const c = this._formData;
        const mode = c._visual_mode;
        const isNone = mode === "none";
        const showBgFilters = mode === "visuals" || mode === "images";
        const modeHint = mode === "images" ? "Custom images or videos that change with the weather."
            : mode === "simple" ? "A soft gradient that changes with the weather."
            : mode === "none" ? "Just a flat card background."
            : "Animated weather backgrounds.";
        const brightnessStatus = (v) => {
            const pct = Math.round(v * 100);
            if (v < 0.5) return `${pct}% — Very dark`;
            if (v < 0.8) return `${pct}% — Dimmed`;
            if (v < 0.95) return `${pct}% — Slightly dimmed`;
            if (v >= 0.95 && v <= 1.05) return "Default brightness";
            if (v < 1.2) return `${pct}% — Slightly brighter`;
            if (v < 1.5) return `${pct}% — Bright`;
            return `${pct}% — Very bright`;
        };
        const saturationStatus = (v) => {
            const pct = Math.round(v * 100);
            if (v === 0) return "Grayscale";
            if (v < 0.4) return `${pct}% — Desaturated`;
            if (v < 0.8) return `${pct}% — Muted colors`;
            if (v >= 0.95 && v <= 1.05) return "Default intensity";
            if (v < 1.4) return `${pct}% — Vivid colors`;
            if (v < 1.8) return `${pct}% — Very vivid`;
            return `${pct}% — Maximum saturation`;
        };
        const blurStatus = (v) => {
            if (v === 0) return "No blur";
            if (v <= 2) return `${v}px — Subtle`;
            if (v <= 6) return `${v}px — Soft`;
            if (v <= 12) return `${v}px — Strong`;
            return `${v}px — Heavy`;
        };
        return html`
            <div class="fc-box" style="margin-top:0">
                <ha-form
                    .hass=${this.hass}
                    .data=${{ _visual_mode: mode }}
                    .schema=${[{ name: "_visual_mode", selector: { select: { mode: "dropdown", options: OPT.visual_mode } } }]}
                    .computeLabel=${this._computeLabel}
                    @value-changed=${(e) => { e.stopPropagation(); const v = e.detail && e.detail.value && e.detail.value._visual_mode; if (v && v !== mode) this._setVisualMode(v); }}
                ></ha-form>
                <div style="font-size:var(--awc-e-f-meta);color:var(--secondary-text-color);line-height:1.4;margin-top:var(--awc-e-s2)">${modeHint}</div>
            </div>
            ${mode === "images" ? this._renderDisclosure("Weather Images", html`
                <div class="settings-group">
                    ${this._renderClearableText("weather_image_path")}
                    ${this._renderClearableText("weather_image_path_night")}
                </div>
                <div class="fc-box" style="background:rgba(var(--rgb-primary-text-color,0,0,0),0.03)">
                    <div style="display:flex;align-items:center;gap:var(--awc-e-s2);font-size:var(--awc-e-f-meta);color:var(--secondary-text-color)">
                        <ha-icon icon="mdi:lightbulb-outline" style="--mdc-icon-size:16px;flex-shrink:0"></ha-icon>
                        <span>Name each image after the weather state (e.g. <code>sunny.jpg</code>, <code>rainy.png</code>) and put them in the day folder. Add a night folder to swap images at night, or leave it empty to use the day folder all the time.</span>
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:var(--awc-e-s2);margin-top:var(--awc-e-s3)">
                    ${this._renderSlider("bg_blur", LABELS.bg_blur, 0, 20, 1, null, blurStatus)}
                </div>`) : ""}
            ${this._renderDisclosure("Color Settings", html`
                <div class="fc-box" style="margin-top:0">
                    <div class="section-title"><ha-icon icon="mdi:theme-light-dark" style="--mdc-icon-size:18px"></ha-icon><span>Color Mode</span></div>
                    ${this._renderForm(this._colorModeSchema())}
                    ${!isNone ? html`<div class="toggle-group" style="margin-top:var(--awc-e-s2)">
                        <label class="toggle-row"><span>Adapt contrast to theme</span><ha-switch
                            .checked=${this._formData.theme_adapt !== false}
                            @change=${(e) => this._updateField("theme_adapt", e.target.checked ? undefined : false)}
                        ></ha-switch></label>
                    </div>` : ""}
                </div>
                ${showBgFilters ? html`<div style="display:flex;flex-direction:column;gap:var(--awc-e-s2)">
                ${this._renderSlider("bg_brightness", LABELS.bg_brightness, 0.3, 1.7, 0.05, null, brightnessStatus)}
                ${this._renderSlider("bg_saturation", LABELS.bg_saturation, 0, 2, 0.05, null, saturationStatus)}</div>` : ""}
                ${!isNone ? html`<div class="toggle-group" style="margin-top:var(--awc-e-s3)">
                    <label class="toggle-row"><span>Fade to dashboard background</span><ha-switch
                        .checked=${this._formData.bottom_fade === true}
                        @change=${(e) => this._updateField("bottom_fade", e.target.checked)}
                    ></ha-switch></label>
                </div>` : ""}`)}
            ${mode !== "none" ? this._renderDisclosure("Special Effects", html`<div class="toggle-group">
                <label class="toggle-row"><span>Night Sky</span><ha-switch
                    .checked=${this._formData.night_sky_effects !== false}
                    @change=${(e) => this._updateField("night_sky_effects", e.target.checked ? undefined : false)}
                ></ha-switch></label>
                <label class="toggle-row"><span>Sun (Glow & Rays)</span><ha-switch
                    .checked=${this._formData.sun_effects !== false}
                    @change=${(e) => this._updateField("sun_effects", e.target.checked ? undefined : false)}
                ></ha-switch></label>
            </div>`) : ""}`;}
    render() {
        if (!this.hass || !this._config) return html``; const c = this._formData;
        return html`${this._renderForm([{ name: "weather_entity", selector: { entity: { domain: "weather" } } }])}

            <ha-expansion-panel
                outlined
                .expanded=${this._openPanel === "card_settings"}
                @expanded-changed=${(e) => this._onPanelToggle("card_settings", e.detail.expanded)}
            >
                <div slot="header" class="panel-header">
                    <ha-icon icon="mdi:cog-outline"></ha-icon>
                    <span>General</span></div>
                ${this._renderDisclosure("Dimensions", html`<div class="settings-group">
                    ${this._renderCardStyleSegmented()}
                    ${this._renderOffsetPicker()}</div>`)}
                ${this._renderDisclosure("Icon Settings", html`<div class="settings-group">
                    <div class="settings-group-label">Icon Set</div>
                    <div class="segmented" role="radiogroup" aria-label="Icon set">
                            ${[{v:"line",l:"Line"},{v:"colored",l:"Colored"}].map(o => html`<button type="button" role="radio"
                                class=${((this._formData || {}).icon_set || "line") === o.v ? "active" : ""}
                                @click=${() => this._updateField("icon_set", o.v === "line" ? "" : o.v)}
                            >${o.l}</button>`)}</div>
                    <div class="clearable-field">
                        ${this._renderForm([{ name: "icon_path", selector: { text: {} } }])}
                        ${(this._formData || {}).icon_path ? html`<button type="button" class="clear-btn" title="Clear" @click=${() => this._updateField("icon_path", "")}><ha-icon icon="mdi:close"></ha-icon></button>` : ""}
                    </div>
                    <div class="fc-box" style="background:rgba(var(--rgb-primary-text-color,0,0,0),0.03)">
                        <div style="display:flex;align-items:center;gap:var(--awc-e-s2);font-size:var(--awc-e-f-meta);color:var(--secondary-text-color)">
                            <ha-icon icon="mdi:lightbulb-outline" style="--mdc-icon-size:16px;flex-shrink:0"></ha-icon>
                            <span>Set a folder path to use your own SVG weather icons instead of the built-in set. <a href="https://github.com/shpongledsummer/atmospheric-weather-card#weather-icons" target="_blank" rel="noopener" style="color:var(--primary-color)">How to add them</a></span>
                        </div></div></div>`)}
                ${this._renderDisclosure("Custom Image", html`
                    <div class="settings-group">
                        ${this._renderClearableText("image_day")}
                        ${this._renderClearableText("image_night")}
                    </div>
                    ${this._renderSlider("image_scale", LABELS.image_scale, 0, 200, 1, HELPERS.image_scale)}
                    ${this._renderPositionGrid("image_alignment", POSITION_GRIDS.image_alignment, false, this._renderImageOffsetInline())}
                    ${this._renderDisclosure("Status Override", this._renderForm(this._imageStatusSchema()))}
                `)}
                ${this._renderDisclosure("Tap Action", html`<div class="settings-group">
                    ${this._renderForm([{ name: "card_tap_action", selector: { ui_action: {} } }])}</div>`)}</ha-expansion-panel>
            <ha-expansion-panel
                outlined
                .expanded=${this._openPanel === "images"}
                @expanded-changed=${(e) => this._onPanelToggle("images", e.detail.expanded)}
            >
                <div slot="header" class="panel-header">
                    <ha-icon icon="mdi:image-outline"></ha-icon>
                    <span>Visuals</span></div>
                ${this._renderImagesPanel()}</ha-expansion-panel>
            <ha-expansion-panel
                outlined
                .expanded=${this._openPanel === "buttons"}
                @expanded-changed=${(e) => this._onPanelToggle("buttons", e.detail.expanded)}
            >
                <div slot="header" class="panel-header">
                    <ha-icon icon="mdi:checkbox-multiple-blank-outline"></ha-icon>
                    <span>Buttons</span></div>
                ${this._renderButtonAreasEditor()}</ha-expansion-panel>
            <ha-expansion-panel outlined .expanded=${this._openPanel === "cards"}
                @expanded-changed=${(e) => this._onPanelToggle("cards", e.detail.expanded)}
            >
                <div slot="header" class="panel-header">
                    <ha-icon icon="mdi:card-outline"></ha-icon>
                    <span>Cards</span></div>
                <div class="info">
                    Add any Home Assistant card here. You can also use grids or stacks if you need a specific layout.</div>
                ${this._renderPositionGrid("custom_cards_position", POSITION_GRIDS.custom_cards_position, true)}
                ${this._renderCustomCardsEditor()}</ha-expansion-panel>`;}}
if (!customElements.get("atmospheric-weather-card-editor")) {
    customElements.define( "atmospheric-weather-card-editor", AtmosphericWeatherCardEditor);}
