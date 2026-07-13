/**
 * ATMO WEATHER CARD — VISUAL EDITOR
 * Visual editor for the atmo weather card.
 */
import { LitElement, html, css } from "https://esm.sh/lit@3.2.1";

// ── MIGRATION BLOCK ─────────────────────────
function _migrateConfig(raw) {
  const c = { ...raw };
  const rename = (oldKey, newKey) => {
    if (c[oldKey] !== undefined && c[newKey] === undefined) {
      c[newKey] = c[oldKey];
    }
    delete c[oldKey];
  };
  rename("offset", "card_offset");
  rename("square", "card_square");
  rename("stack_order", "card_stack_order");
  rename("full_width", "card_full_width");
  rename("filter", "card_filter");
  rename("css_mask_vertical", "card_mask_vertical");
  rename("css_mask_horizontal", "card_mask_horizontal");
  rename("disable_text", "card_hide_text");
  rename("tap_action", "card_tap_action");
  rename("background_style", "card_background_style");
  rename("day", "image_day");
  rename("night", "image_night");
  rename("theme", "card_color_mode");
  rename("sun_moon_size", "celestial_size");
  rename("moon_style", "celestial_moon_style");
  if (c.celestial_alignment === undefined) {
    const oldX =
        c.sun_moon_x_position != null ? c.sun_moon_x_position : c.celestial_x,
      oldY =
        c.sun_moon_y_position != null ? c.sun_moon_y_position : c.celestial_y;
    if (oldX !== undefined || oldY !== undefined) {
      const xStr = String(oldX != null ? oldX : "")
          .trim()
          .toLowerCase(),
        yStr = String(oldY != null ? oldY : "")
          .trim()
          .toLowerCase(),
        xIsCenter = xStr === "center";
      const yIsCenter = yStr === "center",
        xVal = xIsCenter ? 0 : parseInt(xStr, 10) || 0,
        yVal = yIsCenter ? 0 : parseInt(yStr, 10) || 0;
      const hSide = xIsCenter ? "center" : xVal < 0 ? "right" : "left",
        vSide = yIsCenter ? "center" : yVal < 0 ? "bottom" : "top";
      if (hSide === "center" && vSide === "center") {
        c.celestial_alignment = "center";
      } else if (vSide === "center") {
        c.celestial_alignment = hSide;
      } else {
        c.celestial_alignment = `${vSide}-${hSide}`;
      }
      c.celestial_x = xIsCenter ? 0 : Math.max(0, Math.abs(xVal) - 31);
      c.celestial_y = yIsCenter ? 0 : Math.max(0, Math.abs(yVal) - 31);
    }
  }
  delete c.sun_moon_x_position;
  delete c.sun_moon_y_position;
  rename("image_offset_x", "image_x");
  rename("image_offset_y", "image_y");
  rename("status_image_day", "status_day");
  rename("status_image_night", "status_night");
  rename("disable_top_text", "top_text_hide");
  rename("top_text_sensor", "top_text_entity");
  rename("top_position", "top_text_position");
  rename("top_font_size", "top_text_size");
  rename("top_unit_format", "top_text_unit");
  rename("top_text_behind_weather", "top_text_behind");
  const hasTopTextKeys =
    c.top_text_hide !== undefined ||
    c.top_text_entity !== undefined ||
    c.top_text_position !== undefined ||
    c.top_text_size !== undefined ||
    c.top_text_unit !== undefined ||
    c.top_text_padding !== undefined ||
    c.top_text_background !== undefined ||
    c.top_text_behind !== undefined;
  if (hasTopTextKeys && c.top_text_hide !== true) {
    const topChip = {
      entity: c.top_text_entity || c.weather_entity || "weather.home",
      position: "custom",
      position_anchor: c.top_text_position || "top-left",
      position_x: "pad",
      position_y: "pad",
      text_size: c.top_text_size || "clamp(24px, 11cqw, 52px)",
      padding: c.top_text_padding || "0px 4px",
      background: false,
      hide_icon: true,
      hide_label: true,
    };
    if (!c.top_text_entity) {
      topChip.attribute = "temperature";
      topChip.fancy_unit = true;
    }
    if (c.top_text_unit !== undefined) topChip.unit_format = c.top_text_unit;
    if (c.top_text_background === true) topChip.background = true;
    if (c.top_text_behind === true) topChip.behind_effects = true;
    c.chips = [topChip, ...(Array.isArray(c.chips) ? c.chips : [])];
  }
  const hasLegacyChipAreaKeys =
    c.chips_position !== undefined ||
    c.chips_layout !== undefined ||
    c.chips_background !== undefined ||
    c.disable_chips !== undefined;
  delete c.top_text_hide;
  delete c.top_text_entity;
  delete c.top_text_position;
  delete c.top_text_size;
  delete c.top_text_unit;
  delete c.top_text_padding;
  delete c.top_text_background;
  delete c.top_text_behind;
  rename("disable_chips", "chip_area_hide");
  rename("chips_position", "chip_area_position");
  rename("chips_layout", "chip_area_layout");
  rename("chips_columns", "chip_area_columns");
  rename("chips_visible", "chip_area_scroll_count");
  rename("chips_width", "chip_area_width");
  rename("chips_height", "chip_area_height");
  rename("chips_align", "chip_area_align");
  rename("chips_grouped", "chip_area_grouped");
  rename("chips_separator", "chip_area_separator");
  rename("chips_full_width", "chip_area_full_width");
  rename("chips_container_padding", "chip_area_padding");
  rename("chips_container_bg_color", "chip_area_background_color");
  rename("chips_background", "chip_area_background");
  if (c.chip_inner_gap !== undefined) {
    if (c.chip_area_gap === undefined && c.chip_gap !== undefined)
      c.chip_area_gap = c.chip_gap;
    c.chip_gap = c.chip_inner_gap;
    delete c.chip_inner_gap;
  } else if (c.chip_gap !== undefined && c.chip_area_gap === undefined) {
    if (hasLegacyChipAreaKeys) {
      c.chip_area_gap = c.chip_gap;
      delete c.chip_gap;
    }
  }
  rename("chip_format", "chip_style");
  rename("chips_font_size", "chip_text_size");
  rename("chips_name_font_size", "chip_label_size");
  rename("chips_padding", "chip_padding");
  rename("chip_icon_width", "chip_icon_size");
  rename("chip_icon_bg", "chip_icon_background");
  rename("chips_bg_color", "chip_background_color");
  rename("chips_icon_bg_color", "chip_icon_background_color");
  rename("chip_bg_color", "chip_background_color");
  rename("chip_icon_bg_color", "chip_icon_background_color");
  rename("chip_area_bg_color", "chip_area_background_color");
  if (c.chip_area_layout === "scroll") c.chip_area_layout = "horizontal-scroll";
  if (Array.isArray(c.chips)) {
    c.chips = c.chips.map((chip) => {
      if (!chip || typeof chip !== "object") return chip;
      const s = { ...chip };
      const r = (o, n) => {
        if (s[o] !== undefined && s[n] === undefined) s[n] = s[o];
        delete s[o];
      };
      r("chip_format", "style");
      r("chip_align", "align");
      r("chip_background", "background");
      r("chip_bg_color", "background_color");
      r("bg_color", "background_color");
      r("chip_icon_bg_color", "icon_background_color");
      r("icon_bg_color", "icon_background_color");
      r("icon_bg", "icon_background");
      r("chip_padding", "padding");
      r("disable_icon", "hide_icon");
      r("font_size", "text_size");
      r("name_font_size", "label_size");
      if (s.overflow === "marquee" && s.label_overflow === undefined)
        s.label_overflow = "marquee";
      r("behind", "behind_effects");
      r("card_tap_action", "tap_action");
      if (s.forecast_show_min && s.forecast && s.attribute === "temperature") {
        if (!s.sub_value_attribute) s.sub_value_attribute = "templow";
        if (s.forecast_low_position !== "below")
          s.sub_value_position = "beside";
      }
      delete s.forecast_show_min;
      delete s.forecast_low_position;
      return s;
    });
  }
  return c;
}
// ── END MIGRATION BLOCK ─────────────────────────────────────────────────
const LABELS = Object.freeze({
  weather_entity: "Weather Entity",
  sun_entity: "Sun Entity",
  moon_phase_entity: "Moon Phase Entity",
  theme_entity: "Theme Entity",
  _color_mode: "Color Mode",
  card_style: "Card Style",
  card_square: "Square Mode",
  card_height: "Card Height",
  card_padding: "Card Padding",
  card_offset: "Card Offset",
  card_stack_order: "Layer Order",
  card_tap_action: "Tap Action",
  card_filter: "Visual Filter",
  card_full_width: "Full Width",
  card_mask_vertical: "Fade Top & Bottom Edges",
  card_mask_horizontal: "Fade Left & Right Edges",
  card_hide_text: "Hide All Text",
  card_background_style: "Background Style",
  celestial_size: "Size (px)",
  celestial_position: "Position Mode",
  celestial_alignment: "Alignment",
  celestial_x: "X Offset",
  celestial_y: "Y Offset",
  celestial_moon_style: "Moon Glow Color",
  image_day: "Day Image URL",
  image_night: "Night Image URL",
  image_scale: "Image Scale (%)",
  image_alignment: "Image Position",
  image_x: "Horizontal Offset",
  image_y: "Vertical Offset",
  status_entity: "Status Entity",
  status_day: "Status Image (Day)",
  status_night: "Status Image (Night)",
  chip_area_hide: "Disable Chips",
  chip_area_position: "Position",
  chip_text_size: "Value text size",
  chip_label_size: "Label text size",
  chip_area_layout: "Layout",
  chip_style: "Chip style",
  chip_area_columns: "Columns",
  chip_area_scroll_count: "Show at once",
  chip_area_align: "Align content",
  chip_area_width: "Width",
  chip_area_height: "Height",
  chip_area_full_width: "Full width chips",
  chip_padding: "Chip padding",
  chip_area_padding: "Container padding",
  chip_area_gap: "Chips gap",
  chip_gap: "Icon/text gap",
  chip_text_gap: "Label/value gap",
  chip_icon_size: "Icon size",
  chip_area_background: "Background",
  chip_area_grouped: "One shared background",
  chip_area_separator: "Divider between chips",
  chip_icon_background: "Icon background",
  chip_icon_padding: "Padding around icon",
  custom_cards_position: "Embedded Cards Position",
  custom_cards_css_class: "Embedded Cards CSS Class",
  chip_area_background_color: "Container Background Color",
  perf_mode: "Performance Preset",
  perf_fps: "Frame Rate",
  perf_cloud_quality: "Cloud Detail",
  perf_effects: "Weather Effects",
  perf_fauna: "Fauna",
  perf_dpr: "Sharpness",
  animation_speed: "Animation Speed",
  bird_animation_speed: "Bird Animation Speed",
  star_animation_speed: "Star Twinkle Speed",
  fauna_birds_at_night: "Birds At Night",
});
const HELPERS = Object.freeze({
  weather_entity: "",
  sun_entity: "Used for the day/night cycle.",
  moon_phase_entity: "Your moon phase sensor.",
  theme_entity: "An entity whose state switches between light and dark mode.",
  card_height: "In pixels, e.g. 220. Use 'auto' for dashboard grid layouts.",
  card_padding: "Inner padding, e.g. 16px or 12px 20px.",
  card_offset: "",
  card_stack_order: "",
  card_tap_action: "What happens when the card is tapped.",
  card_full_width: "Removes side margins so the card fills edge to edge.",
  card_mask_vertical: "Adds a soft fade to the top and bottom edges.",
  card_mask_horizontal: "Adds a soft fade to the left and right edges.",
  card_hide_text: "Hides all text overlays in one toggle.",
  card_filter: "A color filter applied to the animations.",
  celestial_moon_style: "",
  celestial_x: "Horizontal offset from the alignment edge, in pixels.",
  celestial_y: "Vertical offset from the alignment edge, in pixels.",
  celestial_position: "",
  image_night: "Shown at night. Falls back to the day image if left empty.",
  image_scale: "Image height as a percentage of the card height.",
  image_alignment: "",
  image_x: "Fine-tune horizontal position. Pixels or CSS, e.g. -20 or 10%.",
  image_y: "Fine-tune vertical position. Pixels or CSS, e.g. 10 or -5%.",
  status_entity:
    "Shows a different image when this entity is active, open, or home.",
  status_day: "Day image shown while the status entity is active.",
  status_night: "Night image shown while the status entity is active.",
  chip_area_columns: "Number of equal-width columns in grid layout.",
  chip_area_align: "Horizontal alignment of chips within the container.",
  card_background_style:
    "Frosted: translucent glass effect. Contrast: solid and readable. Theme: follows your HA theme colours.",
  custom_cards_css_class:
    "Adds a CSS class to the embedded cards container (useful with card_mod).",
  perf_mode: "Choose a preset or fine-tune each setting below.",
  animation_speed: "Global animation speed multiplier for all motion.",
  bird_animation_speed:
    "Bird-only speed multiplier applied on top of animation speed.",
  star_animation_speed: "Twinkle speed multiplier for night stars.",
  fauna_birds_at_night: "Disable this to let birds fly only during daytime.",
});
const CHIP_LABELS = Object.freeze({
  entity: "Entity",
  attribute: "Attribute",
  name: "Label",
  name_sensor: "Label Entity",
  name_attribute: "Label Attribute",
  sub_value_entity: "Sub Value Entity",
  sub_value_attribute: "Sub Value Attribute",
  gauge_entity: "Value Entity",
  gauge_attribute: "Value Attribute",
  width: "Width",
  overflow: "Value overflow",
  label_overflow: "Label overflow",
  sub_value_overflow: "Sub value overflow",
  marquee_speed: "Scroll speed",
  marquee_rtl: "Right-to-left",
  icon: "Icon",
  icon_path: "Icon folder",
  tap_action: "Tap Action",
  unit_format: "Custom unit",
  text_size: "Value text size",
  label_size: "Label text size",
  inner_gap: "Icon/text gap",
  text_gap: "Label/value gap",
  padding: "Chip padding",
});
const CHIP_HELPERS = Object.freeze({
  name_sensor: "Use a sensor value as the label instead.",
  width: "e.g. 200px or 60%. Constrains the chip width.",
  icon: "MDI icon, or type 'weather' for a dynamic icon.",
  icon_path: "e.g. /local/weather-icons/",
  forecast_offset: "0 = today/now, 1 = tomorrow/next hour, etc.",
});
const KEY_ORDER = Object.freeze([
  "type",
  "name",
  "entity",
  "weather_entity",
  "sun_entity",
  "moon_phase_entity",
  "color_mode",
  "card_color_mode",
  "theme_entity",
  "card_style",
  "card_height",
  "card_padding",
  "card_square",
  "celestial_size",
  "celestial_position",
  "celestial_alignment",
  "celestial_x",
  "celestial_y",
  "celestial_moon_style",
  "image_day",
  "image_night",
  "image_scale",
  "image_alignment",
  "status_entity",
  "status_day",
  "status_night",
  "chip_area_position",
  "card_hide_text",
  "chip_area_hide",
  "chip_text_size",
  "chip_label_size",
  "chip_area_layout",
  "chip_area_columns",
  "chip_area_scroll_count",
  "chip_area_align",
  "chip_area_width",
  "chip_area_height",
  "chip_area_full_width",
  "chip_padding",
  "chip_area_padding",
  "chip_area_gap",
  "chip_gap",
  "chip_text_gap",
  "chip_icon_size",
  "chip_style",
  "chip_area_background",
  "chip_area_grouped",
  "chip_area_separator",
  "chip_background_color",
  "chip_icon_background_color",
  "chip_area_background_color",
  "card_background_style",
  "card_tap_action",
  "hold_action",
  "double_tap_action",
  "card_offset",
  "card_full_width",
  "card_mask_vertical",
  "card_mask_horizontal",
  "card_stack_order",
  "card_filter",
  "chip_icon_background",
  "custom_cards_position",
  "custom_cards_css_class",
  "perf_mode",
  "perf_fps",
  "animation_speed",
  "bird_animation_speed",
  "star_animation_speed",
  "perf_cloud_quality",
  "perf_effects",
  "perf_fauna",
  "perf_dpr",
  "fauna_bird_density",
  "fauna_plane_density",
  "fauna_bird_flock_size",
  "fauna_birds_at_night",
  "chips",
  "custom_cards",
]);
const DISPLAY_DEFAULTS = Object.freeze({
  card_style: "immersive",
  card_color_mode: "auto",
  card_filter: "none",
  celestial_moon_style: "default",
  image_alignment: "top-right",
  card_background_style: "frosted",
  chip_area_layout: "wrap",
  chip_style: "inline",
  chip_area_align: "start",
  perf_mode: "default",
  fauna_birds_at_night: true,
});
const CHIP_STYLE_OVERRIDE_KEYS = Object.freeze([
  "style",
  "align",
  "background",
  "icon_background",
  "background_color",
  "icon_background_color",
  "padding",
  "text_size",
  "label_size",
  "inner_gap",
  "text_gap",
  "icon_size",
  "icon_padding",
  "width",
  "height",
  "value_weight",
  "label_weight",
  "chip_round",
  "sub_value_size",
  "sub_value_weight",
]);
const TOP_LEVEL_NUMBER_FIELDS = Object.freeze([
  "card_stack_order",
  "celestial_size",
  "celestial_x",
  "celestial_y",
  "image_scale",
  "chip_area_columns",
  "chip_area_scroll_count",
  "perf_fps",
  "animation_speed",
  "bird_animation_speed",
  "star_animation_speed",
  "perf_cloud_quality",
  "perf_effects",
  "perf_fauna",
  "perf_dpr",
  "fauna_bird_density",
  "fauna_plane_density",
  "fauna_bird_flock_size",
]);
const TOP_LEVEL_BOOLEAN_FIELDS = Object.freeze([
  "card_square",
  "card_hide_text",
  "chip_area_hide",
  "chip_area_full_width",
  "chip_area_background",
  "chip_area_grouped",
  "chip_area_separator",
  "card_full_width",
  "card_mask_vertical",
  "card_mask_horizontal",
  "chip_icon_background",
  "fauna_birds_at_night",
]);
const CHIP_NUMBER_FIELDS = Object.freeze([
  "forecast_offset",
  "forecast_precision",
  "marquee_speed",
  "ring_min",
  "ring_max",
  "ring_width",
  "ring_gap",
  "bar_min",
  "bar_max",
  "bar_height",
  "bar_gap",
]);
const CHIP_BOOLEAN_FIELDS = Object.freeze([
  "hide_icon",
  "hide_label",
  "hide_value",
  "hide_sub_value",
  "marquee_rtl",
  "background",
  "icon_background",
  "fancy_unit",
  "chip_round",
  "behind_effects",
]);
const CHIP_CSS_SIZE_FIELDS = Object.freeze(["width", "height"]);
const SAFE_TOP_LEVEL_NUMBER_FIELDS =
  typeof TOP_LEVEL_NUMBER_FIELDS !== "undefined" &&
  Array.isArray(TOP_LEVEL_NUMBER_FIELDS)
    ? TOP_LEVEL_NUMBER_FIELDS
    : [];
const SAFE_TOP_LEVEL_BOOLEAN_FIELDS =
  typeof TOP_LEVEL_BOOLEAN_FIELDS !== "undefined" &&
  Array.isArray(TOP_LEVEL_BOOLEAN_FIELDS)
    ? TOP_LEVEL_BOOLEAN_FIELDS
    : [];
const SAFE_CHIP_NUMBER_FIELDS =
  typeof CHIP_NUMBER_FIELDS !== "undefined" && Array.isArray(CHIP_NUMBER_FIELDS)
    ? CHIP_NUMBER_FIELDS
    : [];
const SAFE_CHIP_BOOLEAN_FIELDS =
  typeof CHIP_BOOLEAN_FIELDS !== "undefined" &&
  Array.isArray(CHIP_BOOLEAN_FIELDS)
    ? CHIP_BOOLEAN_FIELDS
    : [];
const SAFE_CHIP_CSS_SIZE_FIELDS =
  typeof CHIP_CSS_SIZE_FIELDS !== "undefined" &&
  Array.isArray(CHIP_CSS_SIZE_FIELDS)
    ? CHIP_CSS_SIZE_FIELDS
    : [];
const OPT = Object.freeze({
  color_mode: [
    { value: "ha_theme", label: "Follow my Home Assistant theme" },
    { value: "entity", label: "Follow another entity (e.g. the sun)" },
    { value: "force_light", label: "Force light mode" },
    { value: "force_dark", label: "Force dark mode" },
  ],
  card_filter: [
    { value: "none", label: "None" },
    { value: "darken", label: "Darken" },
    { value: "vivid", label: "Vivid" },
    { value: "muted", label: "Muted" },
    { value: "warm", label: "Warm" },
  ],
  celestial_moon_style: [
    { value: "default", label: "Default (follows theme)" },
    { value: "blue", label: "Blue" },
    { value: "yellow", label: "Yellow" },
    { value: "purple", label: "Purple" },
    { value: "grey", label: "Grey" },
  ],
  chip_overflow: [
    { value: "ellipsis", label: "Ellipsis (…)" },
    { value: "marquee", label: "Scrolling text" },
    { value: "clip", label: "Clip" },
    { value: "wrap", label: "Wrap" },
  ],
  chip_area_layout: [
    { value: "wrap", label: "Wrap" },
    { value: "grid", label: "Grid" },
    { value: "horizontal-scroll", label: "Scroll X" },
    { value: "vertical-scroll", label: "Scroll Y" },
  ],
  chip_area_align: [
    { value: "start", label: "Left" },
    { value: "center", label: "Center" },
    { value: "end", label: "Right" },
    { value: "spread", label: "Spread" },
  ],
});
const FC_ATTRIBUTES = Object.freeze([
  { value: "condition", label: "Condition" },
  { value: "temperature", label: "Temperature (high)" },
  { value: "templow", label: "Temperature (low)" },
  { value: "precipitation_probability", label: "Rain probability" },
  { value: "precipitation", label: "Precipitation" },
  { value: "humidity", label: "Humidity" },
  { value: "wind_speed", label: "Wind speed" },
  { value: "wind_bearing", label: "Wind bearing" },
  { value: "pressure", label: "Pressure" },
  { value: "cloud_coverage", label: "Cloud coverage" },
  { value: "uv_index", label: "UV index" },
]);
const POSITION_GRIDS = Object.freeze({
  image_alignment: {
    cells: [
      ["top-left", "top-center", "top-right"],
      ["left", "center", "right"],
      ["bottom-left", "bottom-center", "bottom-right"],
    ],
    valueMap: { left: "center-left", right: "center-right" },
  },
  custom_cards_position: {
    cells: [
      ["top-left", "top-center", "top-right"],
      ["left", "center", "right"],
      ["bottom-left", "bottom-center", "bottom-right"],
    ],
    valueMap: { left: "center-left", right: "center-right" },
  },
  celestial_alignment: {
    cells: [
      ["top-left", "top-center", "top-right"],
      ["left", "center", "right"],
      ["bottom-left", "bottom-center", "bottom-right"],
    ],
  },
  chip_area_position: {
    cells: [
      ["top-left", "top-center", "top-right"],
      ["left", "center", "right"],
      ["bottom-left", "bottom-center", "bottom-right"],
    ],
  },
});
const PREPARED_POSITION_GRIDS = Object.freeze(
  Object.fromEntries(
    Object.entries(POSITION_GRIDS).map(([field, def]) => {
      const valueMap = def.valueMap || {};
      const reverseMap = Object.fromEntries(
        Object.entries(valueMap).map(([k, v]) => [v, k]),
      );
      return [
        field,
        Object.freeze({
          ...def,
          valueMap,
          reverseMap,
          cellsFlat: def.cells.flat(),
          disabledSet: new Set(def.disabled || []),
        }),
      ];
    }),
  ),
);
class AtmosphericWeatherCardEditor extends LitElement {
  static get properties() {
    return {
      _config: { type: Object, state: true },
      _colorModeState: { type: String, state: true },
      _expandedCard: { type: Number, state: true },
      _expandedChip: { type: Number, state: true },
      _openPanel: { type: String, state: true },
      _cardHeightError: { type: String, state: true },
    };
  }
  set hass(val) {
    const old = this._hass;
    this._hass = val;
    if (!old && val) {
      this.requestUpdate();
    } else if (old && val) {
      if (!this._hassThrottle) {
        this._hassThrottle = true;
        setTimeout(() => {
          this._hassThrottle = false;
          this.requestUpdate();
        }, 2000);
      }
    }
  }
  get hass() {
    return this._hass;
  }
  static get styles() {
    return css`
      :host {
        --awc-e-s1: 4px;
        --awc-e-s2: 8px;
        --awc-e-s3: 12px;
        --awc-e-s4: 16px;
        --awc-e-r-box: 10px;
        --awc-e-r-ctrl: 8px;
        --awc-e-r-inline: 6px;
        --awc-e-f-meta: 12px;
        --awc-e-f-label: 13px;
        --awc-e-f-body: 14px;
        --awc-e-f-header: 15px;
        --awc-e-t: 150ms ease;
        --mdc-text-field-fill-color: rgba(
          var(--rgb-primary-text-color, 0, 0, 0),
          0.06
        );
        --mdc-select-fill-color: rgba(
          var(--rgb-primary-text-color, 0, 0, 0),
          0.06
        );
        --mdc-typography-subtitle1-font-size: var(--awc-e-f-label);
        --mdc-typography-subtitle1-font-weight: 400;
        --mdc-typography-body2-font-size: var(--awc-e-f-meta);
        display: block;
      }
      /* ── Spacing ── */
      ha-form {
        display: block;
      }
      ha-expansion-panel {
        display: block;
        margin-top: var(--awc-e-s3);
        --ha-card-border-radius: var(--awc-e-r-box);
        & ha-form {
          margin-top: var(--awc-e-s2);
        }
      }
      ha-form + ha-form {
        margin-top: var(--awc-e-s1);
      }
      .chip-accordion-body > * + *,
      .settings-group > * + *,
      .disclosure-body > * + * {
        margin-top: var(--awc-e-s2);
      }
      .chip-accordion-body > :first-child,
      .settings-group > :first-child,
      .disclosure-body > :first-child {
        margin-top: 0;
      }
      .settings-group > .settings-group-label + *,
      .settings-group > .section-title + * {
        margin-top: 0;
      }
      /* ── Panel headers ── */
      .panel-header {
        display: flex;
        align-items: center;
        gap: var(--awc-e-s2);
        font-size: var(--awc-e-f-header);
        font-weight: 500;
        color: var(--primary-text-color);
        & ha-icon {
          --mdc-icon-size: 20px;
          color: var(--secondary-text-color);
        }
      }
      /* ── Shared backgrounds ── */
      .info,
      .cards-empty,
      .card-row,
      details.disclosure {
        background: var(--secondary-background-color);
        border-radius: var(--awc-e-r-box);
      }
      details.disclosure details.disclosure,
      details.disclosure .card-row {
        background:
          linear-gradient(
            rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05),
            rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05)
          ),
          var(--secondary-background-color);
      }
      .composite,
      .grid-picker {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09);
        border-radius: var(--awc-e-r-box);
      }
      .composite:last-child,
      .grid-picker:last-child,
      .section-box:last-child {
        margin-bottom: 0;
      }
      .disclosure-body > :last-child {
        margin-bottom: 0;
      }
      /* ── Info blocks ── */
      .info {
        padding: var(--awc-e-s3) var(--awc-e-s4);
        margin: 0 0 var(--awc-e-s3) 0;
        font-size: var(--awc-e-f-label);
        line-height: 1.5;
        color: var(--secondary-text-color);
        & b {
          color: var(--primary-text-color);
          font-weight: 500;
        }
        & code {
          background: var(--primary-background-color);
          padding: 1px 6px;
          border-radius: 4px;
          font-size: var(--awc-e-f-meta);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        &.inline-action {
          display: flex;
          align-items: center;
          gap: var(--awc-e-s3);
          justify-content: space-between;
          & > span {
            flex: 1;
          }
        }
      }
      .inline-action-btn {
        flex-shrink: 0;
        padding: var(--awc-e-s2) var(--awc-e-s3);
        border: 0;
        background: var(--primary-color);
        color: var(--text-primary-color, white);
        border-radius: var(--awc-e-r-ctrl);
        font-size: var(--awc-e-f-label);
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: opacity var(--awc-e-t);
        &:hover {
          opacity: 0.85;
        }
      }
      /* ── Labels & helpers ── */
      .grid-picker-label,
      .composite-label {
        display: block;
        font-size: var(--awc-e-f-label);
        font-weight: 500;
        margin-bottom: var(--awc-e-s2);
        color: var(--primary-text-color);
      }
      .grid-helper,
      .composite-helper {
        margin-top: var(--awc-e-s2);
        font-size: var(--awc-e-f-meta);
        color: var(--secondary-text-color);
        line-height: 1.5;
      }
      .scope-note {
        font-size: var(--awc-e-f-meta);
        color: var(--secondary-text-color);
        display: flex;
        align-items: center;
        gap: var(--awc-e-s1);
        & ha-icon {
          --mdc-icon-size: 14px;
        }
      }
      /* ── Grid layouts ── */
      .card-size-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--awc-e-s2);
        & ha-textfield {
          display: block;
          width: 100%;
          min-width: 0;
        }
      }
      .grid-picker {
        margin: var(--awc-e-s3) 0 var(--awc-e-s4) 0;
        padding: var(--awc-e-s3) var(--awc-e-s4);
      }
      .section-box .grid-picker {
        margin: var(--awc-e-s2) 0 0 0;
        background: transparent;
        padding: 0;
      }
      .field-group .grid-picker {
        margin: 0;
        background: transparent;
        padding: 0;
      }
      .chips-pos-align-row .grid-picker {
        margin: 0;
        padding: 0;
        background: transparent;
        flex-shrink: 0;
      }
      .grid-3x3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--awc-e-s1);
        width: 144px;
        aspect-ratio: 1;
      }
      .grid-cell {
        border: 0;
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.16);
        border-radius: var(--awc-e-r-inline);
        cursor: pointer;
        padding: 0;
        transition: background var(--awc-e-t);
        &:hover:not(.disabled):not(.active) {
          background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.28);
        }
        &.active {
          background: var(--primary-color);
        }
        &.empty {
          visibility: hidden;
          pointer-events: none;
        }
        &.disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: repeating-linear-gradient(
            45deg,
            rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.16) 0 6px,
            var(--divider-color) 6px 7px
          );
        }
      }
      .grid-extras {
        display: flex;
        gap: var(--awc-e-s1);
        margin-top: var(--awc-e-s2);
        flex-wrap: wrap;
      }
      .grid-extra {
        flex: 1;
        min-width: 100px;
        padding: var(--awc-e-s2) var(--awc-e-s3);
        border: 0;
        background: var(--secondary-background-color);
        border-radius: var(--awc-e-r-inline);
        color: var(--primary-text-color);
        font-size: var(--awc-e-f-label);
        cursor: pointer;
        transition:
          background var(--awc-e-t),
          color var(--awc-e-t);
        &:hover:not(.active) {
          background: var(--divider-color);
        }
        &.active {
          background: var(--primary-color);
          color: var(--text-primary-color, white);
        }
      }
      /* ── Composite field groups ── */
      .composite {
        margin: var(--awc-e-s3) 0 var(--awc-e-s4) 0;
        padding: var(--awc-e-s3) var(--awc-e-s4);
      }
      .composite-row {
        display: flex;
        align-items: center;
        gap: var(--awc-e-s2);
        flex-wrap: wrap;
      }
      .composite-unit {
        font-size: var(--awc-e-f-label);
        color: var(--secondary-text-color);
      }
      .composite-number,
      .composite-grid-4 input {
        flex: 1;
        min-width: 120px;
        padding: var(--awc-e-s2) var(--awc-e-s3);
        border: 1px solid transparent;
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07);
        color: var(--primary-text-color);
        border-radius: var(--awc-e-r-ctrl);
        font-size: var(--awc-e-f-body);
        box-sizing: border-box;
        transition: border-color var(--awc-e-t);
        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
      .composite-number:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .composite-grid-4 {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--awc-e-s2);
        & label {
          display: flex;
          flex-direction: column;
          gap: var(--awc-e-s1);
          font-size: var(--awc-e-f-meta);
          color: var(--secondary-text-color);
        }
        & input {
          flex: none;
          min-width: 0;
          width: 100%;
        }
      }
      .composite-textfield {
        flex: 1;
        min-width: 0;
      }
      /* ── Segmented controls ── */
      .segmented {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07);
        border-radius: var(--awc-e-r-ctrl);
        padding: 0;
        gap: 1px;
        box-sizing: border-box;
        & button {
          flex: 1 1 auto;
          min-width: 52px;
          padding: var(--awc-e-s2) var(--awc-e-s3);
          border: 0;
          background: transparent;
          color: var(--primary-text-color);
          font-size: var(--awc-e-f-body);
          cursor: pointer;
          transition:
            background var(--awc-e-t),
            color var(--awc-e-t);
          text-align: center;
          border-radius: var(--awc-e-r-ctrl);
          &:hover:not(.active) {
            background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07);
          }
          &.active {
            background: var(--primary-color);
            color: var(--text-primary-color, white);
          }
        }
        &.segmented-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
      }
      .composite-row .segmented {
        flex: 1;
        min-width: 0;
      }
      .segmented.segmented-compact {
        & button {
          min-width: 0;
          padding: var(--awc-e-s2) var(--awc-e-s1);
          font-size: var(--awc-e-f-meta);
        }
      }
      /* ── Disclosure / details ── */
      details.disclosure {
        margin-top: var(--awc-e-s3);
        overflow: hidden;
        & > summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--awc-e-s2);
          padding: var(--awc-e-s3) var(--awc-e-s4);
          font-size: var(--awc-e-f-label);
          font-weight: 500;
          color: var(--primary-text-color);
          user-select: none;
          transition: background var(--awc-e-t);
          &::-webkit-details-marker {
            display: none;
          }
          &:hover {
            background: var(--divider-color);
          }
          & ha-icon {
            --mdc-icon-size: 18px;
            color: var(--secondary-text-color);
          }
          & .chevron {
            transition: transform var(--awc-e-t);
          }
        }
        &[open] > summary .chevron {
          transform: rotate(90deg);
        }
        & > .disclosure-body {
          padding: var(--awc-e-s4) var(--awc-e-s4) var(--awc-e-s3)
            var(--awc-e-s4);
        }
      }
      /* ── Card rows (cards editor) ── */
      .cards-empty {
        padding: var(--awc-e-s4);
        text-align: center;
        font-size: var(--awc-e-f-label);
        color: var(--secondary-text-color);
        margin-bottom: var(--awc-e-s3);
      }
      .card-row {
        margin-bottom: var(--awc-e-s2);
        overflow: hidden;
        & .card-row-head {
          display: flex;
          align-items: center;
          gap: var(--awc-e-s2);
          padding: var(--awc-e-s3) var(--awc-e-s4);
          cursor: pointer;
          user-select: none;
          transition: background var(--awc-e-t);
          &:hover {
            background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05);
          }
          & > .chevron {
            --mdc-icon-size: 20px;
            color: var(--secondary-text-color);
            transition: transform var(--awc-e-t);
          }
        }
        &.expanded .card-row-head > .chevron {
          transform: rotate(90deg);
        }
        & .card-row-title {
          flex: 1;
          font-size: var(--awc-e-f-body);
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        & .card-row-actions {
          display: flex;
          gap: 2px;
          & button {
            width: 32px;
            height: 32px;
            border: 0;
            background: transparent;
            color: var(--secondary-text-color);
            border-radius: var(--awc-e-r-inline);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition:
              background var(--awc-e-t),
              color var(--awc-e-t);
            &:hover:not(:disabled) {
              background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07);
              color: var(--primary-text-color);
            }
            &:disabled {
              opacity: 0.3;
              cursor: not-allowed;
            }
          }
          & ha-icon {
            --mdc-icon-size: 18px;
          }
        }
        & .card-row-body {
          padding: var(--awc-e-s3) var(--awc-e-s4) var(--awc-e-s4);
          background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.03);
        }
      }
      /* ── Add buttons ── */
      .add-card-btn,
      .add-chip-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--awc-e-s2);
        width: 100%;
        padding: var(--awc-e-s3);
        border: 1.5px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.4);
        background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.06);
        color: var(--primary-color);
        border-radius: var(--awc-e-r-box);
        font-size: var(--awc-e-f-body);
        font-weight: 500;
        cursor: pointer;
        transition:
          background var(--awc-e-t),
          border-color var(--awc-e-t);
        &:hover {
          background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.12);
          border-color: var(--primary-color);
        }
        & ha-icon {
          --mdc-icon-size: 20px;
        }
      }
      .sensor-list {
        margin-top: 0;
        &:empty {
          display: none;
        }
      }
      /* ── Compact fields ── */
      .compact-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--awc-e-s2);
        margin: var(--awc-e-s3) 0;
      }
      .compact-field {
        display: flex;
        flex-direction: column;
        gap: 2px;
        & .compact-field-label {
          font-size: var(--awc-e-f-meta);
          color: var(--secondary-text-color);
          padding-left: 2px;
        }
        & input,
        & ha-textfield {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        & input {
          padding: var(--awc-e-s2) var(--awc-e-s3);
          border: 1px solid transparent;
          background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07);
          color: var(--primary-text-color);
          border-radius: var(--awc-e-r-ctrl);
          font-size: var(--awc-e-f-body);
          transition: border-color var(--awc-e-t);
          &:focus {
            outline: none;
            border-color: var(--primary-color);
          }
        }
      }
      .compact-field.invalid input {
        border-color: var(--error-color);
      }
      .compact-field-hint {
        font-size: var(--awc-e-f-meta);
        color: var(--secondary-text-color);
        padding-left: 2px;
        line-height: 1.3;
      }
      .compact-field-hint.error {
        color: var(--error-color);
      }
      /* ── Toggle groups ── */
      .toggle-group {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
        border-radius: var(--awc-e-r-box);
        overflow: hidden;
        margin: var(--awc-e-s2) 0;
      }
      .toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--awc-e-s3);
        padding: 10px var(--awc-e-s2) 10px var(--awc-e-s3);
        cursor: pointer;
        box-sizing: border-box;
        & + .toggle-row {
          border-top: 1px solid
            rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
        }
        & > span {
          font-size: var(--awc-e-f-body);
          color: var(--primary-text-color);
        }
        & ha-switch {
          flex-shrink: 0;
          margin: 0;
          padding: 0;
          --ha-switch-background-color: rgba(
            var(--rgb-primary-text-color, 0, 0, 0),
            0.12
          );
          --ha-switch-thumb-background-color: rgba(
            var(--rgb-primary-text-color, 0, 0, 0),
            0.35
          );
          --ha-switch-border-color: transparent;
          --ha-switch-thumb-border-color: transparent;
          --ha-switch-checked-border-color: transparent;
          --ha-switch-checked-thumb-border-color: transparent;
          --ha-switch-checked-background-color: var(--primary-color);
          --ha-switch-checked-thumb-background-color: var(
            --text-primary-color,
            #fff
          );
          --switch-unchecked-track-color: rgba(
            var(--rgb-primary-text-color, 0, 0, 0),
            0.12
          );
          --switch-unchecked-button-color: rgba(
            var(--rgb-primary-text-color, 0, 0, 0),
            0.35
          );
          --switch-checked-track-color: var(--primary-color);
          --switch-checked-button-color: var(--text-primary-color, #fff);
        }
      }
      /* ── Section boxes ── */
      .section-box {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09);
        border-radius: var(--awc-e-r-box);
        overflow: hidden;
        margin: var(--awc-e-s3) 0 var(--awc-e-s4) 0;
        padding: var(--awc-e-s3) var(--awc-e-s4);
      }
      .section-box.no-pad {
        padding: var(--awc-e-s4);
      }
      .section-box.no-pad > .sensor-list {
        margin-top: 0;
      }
      .section-box .compact-fields {
        margin: 0;
      }
      .fc-box {
        margin: var(--awc-e-s3) 0;
        padding: var(--awc-e-s3) var(--awc-e-s4);
        background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.08);
        border: 1px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.18);
        border-radius: var(--awc-e-r-box);
      }
      .fc-box ha-form {
        margin-top: var(--awc-e-s2);
      }
      /* ── Icon combo & weather icon ── */
      .icon-combo {
        display: flex;
        align-items: center;
        gap: var(--awc-e-s1);
        & ha-icon-picker {
          flex: 1;
          min-width: 0;
        }
        & .icon-weather-btn {
          flex-shrink: 0;
          padding: var(--awc-e-s2) var(--awc-e-s3);
          border: 0;
          border-radius: var(--awc-e-r-ctrl);
          font-size: var(--awc-e-f-meta);
          cursor: pointer;
          transition:
            background var(--awc-e-t),
            color var(--awc-e-t);
          &.active {
            background: var(--primary-color);
            color: var(--text-primary-color, white);
          }
          &:not(.active) {
            background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09);
            color: var(--primary-text-color);
          }
          &:hover:not(.active) {
            background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.16);
          }
        }
      }
      .weather-icon-active {
        display: flex;
        align-items: center;
        gap: var(--awc-e-s2);
        padding: var(--awc-e-s2) var(--awc-e-s3);
        background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.07);
        border: 1px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.18);
        border-radius: var(--awc-e-r-ctrl);
      }
      .weather-icon-active-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1px;
        & span:first-child {
          font-size: var(--awc-e-f-label);
          font-weight: 500;
          color: var(--primary-text-color);
        }
      }
      .weather-icon-active-sub {
        font-size: var(--awc-e-f-meta);
        color: var(--secondary-text-color);
      }
      .weather-icon-active .icon-weather-btn {
        flex-shrink: 0;
        padding: var(--awc-e-s1) var(--awc-e-s2);
        border: 0;
        border-radius: var(--awc-e-r-ctrl);
        font-size: var(--awc-e-f-meta);
        cursor: pointer;
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09);
        color: var(--primary-text-color);
        transition: background var(--awc-e-t);
        &:hover {
          background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.16);
        }
      }
      /* ── Chip type picker ── */
      .chip-type-picker {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--awc-e-s2);
        margin: 0 0 var(--awc-e-s3) 0;
      }
      .chip-type-btn {
        display: flex;
        align-items: center;
        gap: var(--awc-e-s2);
        padding: var(--awc-e-s2) var(--awc-e-s3);
        border: 1.5px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.12);
        border-radius: var(--awc-e-r-box);
        background: transparent;
        color: var(--primary-text-color);
        text-align: left;
        cursor: pointer;
        transition:
          border-color var(--awc-e-t),
          background var(--awc-e-t);
        &:hover {
          border-color: var(--primary-color);
          background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.05);
        }
        &.active {
          border-color: var(--primary-color);
          background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.08);
        }
        & .chip-type-icon {
          --mdc-icon-size: 18px;
          color: var(--secondary-text-color);
          flex-shrink: 0;
        }
        & .chip-type-icon.active-icon {
          color: var(--primary-color);
        }
        & .chip-type-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        & .chip-type-name {
          font-size: var(--awc-e-f-label);
          font-weight: 500;
          line-height: 1.2;
        }
        & .chip-type-desc {
          font-size: var(--awc-e-f-meta);
          color: var(--secondary-text-color);
          line-height: 1.2;
        }
      }
      /* ── Chip header badges ── */
      .chip-badge-row {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 4px;
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1);
        color: var(--secondary-text-color);
        flex-shrink: 0;
        & ha-icon {
          --mdc-icon-size: 13px;
        }
      }
      .chip-badge-free {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 4px;
        background: var(--primary-color, rgba(76, 140, 110, 0.85));
        color: #fff;
        flex-shrink: 0;
        & ha-icon {
          --mdc-icon-size: 13px;
        }
      }
      /* ── Position grid + align ── */
      .chips-pos-align-row {
        display: flex;
        gap: var(--awc-e-s3);
        align-items: flex-start;
      }
      /* ── CSS value fields ── */
      .css-field-row {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
        gap: var(--awc-e-s2);
        margin-top: var(--awc-e-s2);
      }
      .css-field-row.cols-2 {
        grid-template-columns: 1fr 1fr;
      }
      .css-field {
        display: flex;
        flex-direction: column;
        gap: 3px;
        & .css-field-label {
          font-size: var(--awc-e-f-meta);
          color: var(--secondary-text-color);
          font-weight: 500;
          padding-left: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        & input {
          width: 100%;
          box-sizing: border-box;
          height: 36px;
          padding: 0 10px;
          border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.18);
          background: var(
            --mdc-text-field-fill-color,
            rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06)
          );
          color: var(--primary-text-color);
          border-radius: var(--awc-e-r-ctrl);
          font-size: var(--awc-e-f-body);
          font-family: inherit;
          transition: border-color var(--awc-e-t);
          &:focus {
            outline: none;
            border-color: var(--primary-color);
          }
          &::placeholder {
            color: var(--secondary-text-color);
            opacity: 0.7;
          }
        }
      }
      /* ── Section headings ── */
      .settings-group {
        margin-top: 16px;
      }
      .settings-group:first-child {
        margin-top: 0;
      }
      .settings-group-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--secondary-text-color);
        margin-bottom: var(--awc-e-s2);
        display: flex;
        align-items: center;
        gap: var(--awc-e-s1);
      }
      .section-title {
        font-size: var(--awc-e-f-label);
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: var(--awc-e-s2);
        display: flex;
        align-items: center;
        gap: var(--awc-e-s1);
      }
      .field-group {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05);
        border-radius: var(--awc-e-r-box);
        padding: var(--awc-e-s3);
        margin-top: var(--awc-e-s2);
      }
      .field-group > .toggle-group:first-child {
        margin-top: 0;
      }
      .field-group > .toggle-group:last-child {
        margin-bottom: 0;
      }
      .field-group-label {
        font-size: var(--awc-e-f-meta);
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: var(--awc-e-s2);
      }
      /* ── Chip accordions ── */
      .chip-accordion {
        border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09);
        border-radius: var(--awc-e-r-box);
        overflow: hidden;
        margin-top: var(--awc-e-s2);
        background: var(--secondary-background-color);
      }
      .chip-accordion + .chip-accordion {
        margin-top: var(--awc-e-s1);
      }
      .chip-accordion-head {
        display: flex;
        align-items: center;
        gap: var(--awc-e-s2);
        padding: var(--awc-e-s2) var(--awc-e-s3);
        cursor: pointer;
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.03);
        user-select: none;
        -webkit-user-select: none;
        & .chip-accordion-title {
          flex: 1;
          font-size: var(--awc-e-f-label);
          font-weight: 500;
          color: var(--primary-text-color);
        }
        & .chip-accordion-icon {
          --mdc-icon-size: 15px;
          color: var(--secondary-text-color);
          flex-shrink: 0;
        }
        & ha-icon.chevron {
          --mdc-icon-size: 16px;
          color: var(--secondary-text-color);
          transition: transform var(--awc-e-t);
          flex-shrink: 0;
        }
        &.open ha-icon.chevron {
          transform: rotate(90deg);
        }
        &:hover {
          background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
        }
      }
      .chip-accordion-body {
        padding: var(--awc-e-s3);
        border-top: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09);
      }
      .chip-accordion-body > .settings-group:first-child {
        margin-top: 0;
      }
      .chip-accordion-body .settings-group + .settings-group {
        margin-top: var(--awc-e-s3);
      }
      /* ── Chip nudge strips ── */
      .chip-nudge {
        display: flex;
        align-items: flex-start;
        gap: var(--awc-e-s2);
        padding: var(--awc-e-s2) var(--awc-e-s3);
        margin: var(--awc-e-s1) 0;
        border-radius: var(--awc-e-r-ctrl);
        font-size: var(--awc-e-f-meta);
        color: var(--secondary-text-color);
        line-height: 1.5;
        & code {
          background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
          padding: 0 4px;
          border-radius: 3px;
        }
      }
      .chip-nudge.warning {
        background: rgba(var(--rgb-warning-color, 255, 152, 0), 0.1);
        border: 1px solid rgba(var(--rgb-warning-color, 255, 152, 0), 0.25);
      }
      .chip-nudge.info {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
        border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.09);
      }
      /* ── Chip color picker ── */
      .chip-color-box {
        margin-top: var(--awc-e-s2);
        padding: var(--awc-e-s2) var(--awc-e-s3);
        border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.1);
        border-radius: var(--awc-e-r-ctrl);
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.03);
      }
      .chip-color-row {
        display: flex;
        align-items: center;
        gap: var(--awc-e-s2);
      }
      .chip-color-label {
        flex: 1;
        font-size: var(--awc-e-f-label);
        color: var(--primary-text-color);
      }
      .chip-color-swatch {
        width: 36px;
        height: 28px;
        border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.18);
        border-radius: var(--awc-e-r-inline);
        padding: 1px 2px;
        background: none;
        cursor: pointer;
        flex-shrink: 0;
      }
      .chip-color-clear {
        width: 24px;
        height: 24px;
        border: 0;
        border-radius: 50%;
        padding: 0;
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
        color: var(--secondary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background var(--awc-e-t);
        &:hover {
          background: rgba(var(--rgb-error-color, 211, 47, 47), 0.15);
          color: var(--error-color);
        }
      }
      .chip-color-opacity-row {
        display: flex;
        align-items: center;
        gap: var(--awc-e-s2);
        margin-top: var(--awc-e-s2);
      }
      .chip-color-opacity-label {
        font-size: 11px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }
      .chip-color-opacity {
        flex: 1;
        height: 4px;
        accent-color: var(--primary-color);
        cursor: pointer;
      }
      .chip-color-opacity-val {
        font-size: 11px;
        color: var(--secondary-text-color);
        width: 32px;
        text-align: right;
        flex-shrink: 0;
      }
      /* ── Sliders ── */
      .awc-slider {
        display: flex;
        flex-direction: column;
        gap: var(--awc-e-s1);
        padding: var(--awc-e-s3);
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.05);
        border-radius: var(--awc-e-r-box);
      }
      .awc-slider-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--awc-e-s2);
        margin-bottom: var(--awc-e-s1);
      }
      .awc-slider-label {
        font-size: var(--awc-e-f-label);
        color: var(--primary-text-color);
        font-weight: 400;
        flex: 1;
      }
      .awc-slider-num {
        width: 48px;
        flex-shrink: 0;
        text-align: right;
        border: none;
        background: none;
        color: var(--primary-color);
        font-size: var(--awc-e-f-label);
        font-weight: 600;
        font-family: inherit;
        padding: 0;
        outline: none;
        -moz-appearance: textfield;
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
      }
      .awc-slider-range {
        width: 100%;
        height: 4px;
        accent-color: var(--primary-color);
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        display: block;
        background: linear-gradient(
          to right,
          var(--primary-color) 0%,
          var(--primary-color) var(--awc-slider-pct, 50%),
          rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.18)
            var(--awc-slider-pct, 50%)
        );
        border-radius: 2px;
        border: none;
        outline: none;
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary-color);
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
        }
        &::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary-color);
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
        }
      }
      .awc-slider-helper {
        font-size: var(--awc-e-f-meta);
        color: var(--secondary-text-color);
        margin-top: var(--awc-e-s1);
        line-height: 1.4;
      }
      /* ── Free chip positioning ── */
      .free-pos-layout {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--awc-e-s3);
        align-items: start;
      }
      .offset-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--awc-e-s2);
      }
      .offset-field {
        display: flex;
        flex-direction: column;
        gap: 3px;
        & .offset-field-label {
          font-size: 11px;
          color: var(--secondary-text-color);
          font-weight: 500;
          padding-left: 2px;
        }
        & input {
          width: 100%;
          box-sizing: border-box;
          height: 36px;
          padding: 0 10px;
          border: 1px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.18);
          background: var(
            --mdc-text-field-fill-color,
            rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06)
          );
          color: var(--primary-text-color);
          border-radius: var(--awc-e-r-ctrl);
          font-size: var(--awc-e-f-body);
          font-family: inherit;
          &:focus {
            outline: none;
            border-color: var(--primary-color);
          }
          &::placeholder {
            color: var(--secondary-text-color);
            opacity: 0.7;
          }
        }
      }
      .free-mode-box {
        background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.05);
        border: 1px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.14);
        border-radius: var(--awc-e-r-box);
        overflow: hidden;
      }
      .free-mode-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--awc-e-s2) var(--awc-e-s3);
      }
      .free-mode-label {
        font-size: var(--awc-e-f-label);
        font-weight: 500;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        gap: var(--awc-e-s1);
      }
      .free-pos-subpanel {
        padding: 0 var(--awc-e-s3) var(--awc-e-s3);
      }
      .free-pos-subpanel::before {
        content: "";
        display: block;
        height: 10px;
      }
      .anchor-grid {
        display: grid;
        grid-template-columns: repeat(3, 30px);
        grid-template-rows: repeat(3, 30px);
        gap: 4px;
      }
      .anchor-cell {
        width: 30px;
        height: 30px;
        border: 1.5px solid rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.15);
        border-radius: var(--awc-e-r-ctrl);
        background: transparent;
        cursor: pointer;
        transition:
          border-color var(--awc-e-t),
          background var(--awc-e-t);
        &:hover:not(.active) {
          border-color: var(--primary-color);
          background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.07);
        }
        &.active {
          border-color: var(--primary-color);
          background: var(--primary-color);
        }
      }
      .clearable-field {
        position: relative;
        & ha-form {
          padding-right: 0;
        }
        & .clear-btn {
          position: absolute;
          top: 8px;
          right: 4px;
          width: 24px;
          height: 24px;
          padding: 0;
          margin: 0;
          border: none;
          background: transparent;
          color: var(--secondary-text-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          opacity: 0.6;
          transition:
            opacity var(--awc-e-t),
            color var(--awc-e-t);
          z-index: 1;
          &:hover {
            opacity: 1;
            color: var(--error-color);
          }
          & ha-icon {
            --mdc-icon-size: 16px;
          }
        }
      }
      /* ── Forecast special box ── */
      .chip-forecast-box {
        border: 1px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.18);
        border-radius: var(--awc-e-r-box);
        overflow: hidden;
        margin-top: var(--awc-e-s3);
      }
      .chip-forecast-header {
        display: flex;
        align-items: center;
        gap: var(--awc-e-s1);
        padding: var(--awc-e-s1) var(--awc-e-s3) 0;
        font-size: 11px;
        font-weight: 600;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .chip-forecast-header ha-icon {
        --mdc-icon-size: 13px;
      }
      .chip-forecast-body {
        padding: var(--awc-e-s2) var(--awc-e-s3) var(--awc-e-s3);
      }
      .chip-forecast-body > * + * {
        margin-top: var(--awc-e-s2);
      }
      /* ── Ring threshold rows ── */
      .ring-threshold-row {
        display: flex;
        align-items: center;
        gap: var(--awc-e-s2);
        padding: var(--awc-e-s2) 0;
        & + .ring-threshold-row {
          border-top: 1px solid
            rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
          padding-top: var(--awc-e-s2);
        }
      }
      .ring-threshold-row .chip-color-swatch {
        width: 28px;
        height: 22px;
        flex-shrink: 0;
      }
      .ring-threshold-row input[type="text"] {
        flex: 1;
        min-width: 0;
        height: 30px;
        padding: 0 8px;
        border: 1px solid transparent;
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.07);
        color: var(--primary-text-color);
        border-radius: var(--awc-e-r-ctrl);
        font-size: var(--awc-e-f-body);
        font-family: inherit;
        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
      .ring-threshold-row .threshold-label {
        font-size: 11px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }
      .ring-threshold-del {
        width: 22px;
        height: 22px;
        border: 0;
        border-radius: 50%;
        padding: 0;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition:
          background var(--awc-e-t),
          color var(--awc-e-t);
        &:hover {
          background: rgba(var(--rgb-error-color, 211, 47, 47), 0.12);
          color: var(--error-color);
        }
      }
      .ring-threshold-add {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--awc-e-s2);
        width: 100%;
        padding: var(--awc-e-s2);
        margin-top: var(--awc-e-s2);
        border: 1.5px solid rgba(var(--rgb-primary-color, 0, 120, 212), 0.4);
        border-radius: var(--awc-e-r-ctrl);
        background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.06);
        color: var(--primary-color);
        font-size: var(--awc-e-f-label);
        font-weight: 500;
        cursor: pointer;
        transition:
          background var(--awc-e-t),
          border-color var(--awc-e-t);
        &:hover {
          background: rgba(var(--rgb-primary-color, 0, 120, 212), 0.12);
          border-color: var(--primary-color);
        }
        & ha-icon {
          --mdc-icon-size: 16px;
        }
      }
    `;
  }
  setConfig(config) {
    config = _migrateConfig(config);
    const c = { ...(config || {}) };
    this._normalizeConfigTypes(c);
    let autofilled = false;
    if (!c.weather_entity && this.hass && this.hass.states) {
      const firstWeather = Object.keys(this.hass.states).find((id) =>
        id.startsWith("weather."),
      );
      if (firstWeather) {
        c.weather_entity = firstWeather;
        autofilled = true;
      }
    }
    if (
      !c.sun_entity &&
      this.hass &&
      this.hass.states &&
      this.hass.states["sun.sun"]
    ) {
      c.sun_entity = "sun.sun";
      autofilled = true;
    }
    this._config = this._cleanConfig(c);
    if (c.card_color_mode === "light") this._colorModeState = "force_light";
    else if (c.card_color_mode === "dark") this._colorModeState = "force_dark";
    else if (c.theme_entity) this._colorModeState = "entity";
    else this._colorModeState = "ha_theme";
    if (autofilled) Promise.resolve().then(() => this._emit());
  }
  get _formData() {
    if (
      this._cachedFormData &&
      this._cachedFormConfig === this._config &&
      this._cachedFormColorMode === this._colorModeState
    ) {
      return this._cachedFormData;
    }
    const c = { ...DISPLAY_DEFAULTS, ...(this._config || {}) };
    c._color_mode =
      this._colorModeState ||
      (c.card_color_mode === "light"
        ? "force_light"
        : c.card_color_mode === "dark"
          ? "force_dark"
          : c.theme_entity
            ? "entity"
            : "ha_theme");
    this._cachedFormData = c;
    this._cachedFormConfig = this._config;
    this._cachedFormColorMode = this._colorModeState;
    return c;
  }
  _colorModeSchema() {
    const c = this._formData,
      showThemeEntity = c._color_mode === "entity";
    return [
      {
        name: "_color_mode",
        selector: { select: { mode: "dropdown", options: OPT.color_mode } },
      },
      ...(showThemeEntity
        ? [{ name: "theme_entity", selector: { entity: {} } }]
        : []),
    ];
  }
  _renderToggleGroup(toggles) {
    return html`<div class="toggle-group">
      ${toggles.map(
        (t) =>
          html`<label class="toggle-row">
            <span>${t.label}</span>
            <ha-switch
              data-key=${t.key}
              .checked=${this._formData[t.key] === true}
              @change=${this._onToggleGroupChange}
            ></ha-switch
          ></label> `,
      )}
    </div>`;
  }
  _onToggleGroupChange(e) {
    const key = e.target && e.target.dataset && e.target.dataset.key;
    if (!key) return;
    this._updateField(key, e.target.checked === true);
  }
  _getChips() {
    const chips = (this._config || {}).chips;
    if (!Array.isArray(chips) || chips.length === 0) return [];
    if (chips.every((s) => s && typeof s === "object")) return chips;
    return chips.map((s) => (s && typeof s === "object" ? s : {}));
  }
  _imageStatusSchema() {
    const c = this._formData,
      hasStatus = !!c.status_entity;
    return [
      { name: "status_entity", selector: { entity: {} } },
      ...(hasStatus
        ? [
            {
              type: "grid",
              name: "",
              schema: [
                { name: "status_day", selector: { text: {} } },
                { name: "status_night", selector: { text: {} } },
              ],
            },
          ]
        : []),
    ];
  }
  _computeLabel = (schema) => {
    if (!schema || !schema.name) return "";
    return LABELS[schema.name] || schema.name;
  };
  _computeHelper = (schema) => {
    if (!schema || !schema.name) return undefined;
    return HELPERS[schema.name] || undefined;
  };
  _isValidCardHeight(value) {
    if (value === null || value === undefined) return true;
    const raw = String(value).trim();
    if (!raw) return true;
    if (raw.toLowerCase() === "auto") return true;
    if (/^-?\d+(?:\.\d+)?$/.test(raw)) return true;
    return /^-?\d+(?:\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|svh|lvh|dvh|ch|ex|cm|mm|in|pt|pc)$/i.test(
      raw,
    );
  }
  _normalizeCardHeight(value) {
    if (value === null || value === undefined) return value;
    const raw = String(value).trim();
    if (!raw) return "";
    if (raw.toLowerCase() === "auto") return "auto";
    if (/^-?\d+(?:\.\d+)?$/.test(raw)) {
      const n = Number(raw);
      return Number.isFinite(n) ? n : "";
    }
    if (
      /^-?\d+(?:\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|svh|lvh|dvh|ch|ex|cm|mm|in|pt|pc)$/i.test(
        raw,
      )
    )
      return raw;
    return this._config && this._config.card_height
      ? this._config.card_height
      : "";
  }
  _normalizeCssSizeValue(value) {
    if (value === null || value === undefined) return value;
    if (typeof value === "number" && Number.isFinite(value))
      return `${value}px`;
    const raw = String(value).trim();
    if (!raw) return "";
    const m = raw.match(/^-?\d+(?:\.\d+)?/);
    if (m) return `${m[0]}px`;
    return "";
  }
  _coerceNumberLike(value) {
    if (typeof value === "number")
      return Number.isFinite(value) ? value : value;
    if (typeof value !== "string") return value;
    const raw = value.trim();
    if (!/^-?\d+(?:\.\d+)?$/.test(raw)) return value;
    const n = Number(raw);
    return Number.isFinite(n) ? n : value;
  }
  _coerceBooleanLike(value) {
    if (typeof value === "boolean") return value;
    if (typeof value !== "string") return value;
    const raw = value.trim().toLowerCase();
    if (raw === "true") return true;
    if (raw === "false") return false;
    return value;
  }
  _normalizeChipTypes(chip) {
    if (!chip || typeof chip !== "object" || Array.isArray(chip)) return chip;
    const out = { ...chip };
    for (const key of SAFE_CHIP_NUMBER_FIELDS) {
      if (key in out) out[key] = this._coerceNumberLike(out[key]);
    }
    for (const key of SAFE_CHIP_CSS_SIZE_FIELDS) {
      if (key in out) out[key] = this._normalizeCssSizeValue(out[key]);
    }
    for (const key of SAFE_CHIP_BOOLEAN_FIELDS) {
      if (key in out) out[key] = this._coerceBooleanLike(out[key]);
    }
    for (const tKey of ["ring_thresholds", "bar_thresholds"]) {
      if (!Array.isArray(out[tKey])) continue;
      out[tKey] = out[tKey].map((t) => {
        if (!t || typeof t !== "object" || Array.isArray(t)) return t;
        const n = { ...t };
        if ("value" in n) n.value = this._coerceNumberLike(n.value);
        return n;
      });
    }
    return out;
  }
  _normalizeConfigTypes(obj) {
    if (!obj || typeof obj !== "object") return obj;
    for (const key of SAFE_TOP_LEVEL_NUMBER_FIELDS) {
      if (key in obj) obj[key] = this._coerceNumberLike(obj[key]);
    }
    for (const key of SAFE_TOP_LEVEL_BOOLEAN_FIELDS) {
      if (key in obj) obj[key] = this._coerceBooleanLike(obj[key]);
    }
    if ("card_height" in obj)
      obj.card_height = this._normalizeCardHeight(obj.card_height);
    if (Array.isArray(obj.chips))
      obj.chips = obj.chips.map((chip) => this._normalizeChipTypes(chip));
    return obj;
  }
  _valueChanged(ev) {
    ev.stopPropagation();
    if (!this._config) return;
    const prev = this._config;
    const incoming = { ...((ev.detail && ev.detail.value) || {}) };
    const strip = [];
    if (Object.prototype.hasOwnProperty.call(incoming, "card_height")) {
      this._cardHeightError = this._isValidCardHeight(incoming.card_height)
        ? ""
        : "Invalid height. Use auto, 160, 160px, 40vh, or 80%.";
      incoming.card_height = this._normalizeCardHeight(incoming.card_height);
    }
    if (incoming._color_mode !== undefined) {
      this._colorModeState = incoming._color_mode;
      switch (incoming._color_mode) {
        case "ha_theme":
          strip.push("theme_entity", "card_color_mode");
          break;
        case "entity":
          strip.push("card_color_mode");
          if (!incoming.theme_entity) {
            incoming.theme_entity =
              incoming.sun_entity ||
              (this.hass && this.hass.states && this.hass.states["sun.sun"]
                ? "sun.sun"
                : "");
          }
          break;
        case "force_light":
          strip.push("theme_entity");
          incoming.card_color_mode = "light";
          break;
        case "force_dark":
          strip.push("theme_entity");
          incoming.card_color_mode = "dark";
          break;
      }
    }
    delete incoming._color_mode;
    if (incoming.status_entity && !prev.status_entity) {
      if (!incoming.status_day && incoming.image_day)
        incoming.status_day = incoming.image_day;
      if (!incoming.status_night && incoming.image_night)
        incoming.status_night = incoming.image_night;
    }
    if (incoming.card_square === true && prev.card_square !== true)
      strip.push("card_height");
    this._patch(incoming, { replace: true, strip });
  }
  _patch(changes, opts) {
    const options = opts || {};
    const base = options.replace ? {} : { ...(this._config || {}) };
    const next = { ...base, ...changes };
    if (Array.isArray(options.strip)) {
      for (const k of options.strip) delete next[k];
    }
    this._config = this._cleanConfig(next);
    this._emit();
  }
  _computeInactiveKeys(c) {
    const out = new Set();
    if (c.card_color_mode === "light" || c.card_color_mode === "dark")
      out.add("theme_entity");
    if (c.chip_area_background !== true) out.add("card_background_style");
    const chipLayout = c.chip_area_layout || "wrap";
    if (chipLayout !== "grid") out.add("chip_area_columns");
    if (chipLayout !== "horizontal-scroll" && chipLayout !== "vertical-scroll")
      out.add("chip_area_scroll_count");
    const isScroll =
      chipLayout === "horizontal-scroll" || chipLayout === "vertical-scroll";
    if (!isScroll) {
      out.add("chip_area_height");
      out.add("chip_area_full_width");
    }
    if (!c.chip_area_grouped) out.add("chip_area_separator");
    return out;
  }
  _cleanConfig(config) {
    const out = { ...config };
    this._normalizeConfigTypes(out);
    for (const key of Object.keys(out)) {
      const v = out[key];
      if (v === "" || v === null || v === undefined) {
        delete out[key];
        continue;
      }
      if (Array.isArray(v) && v.length === 0) {
        delete out[key];
        continue;
      }
      if (
        typeof v === "object" &&
        !Array.isArray(v) &&
        Object.keys(v).length === 0
      )
        delete out[key];
    }
    for (const [k, defVal] of Object.entries(DISPLAY_DEFAULTS)) {
      if (out[k] === defVal) delete out[k];
    }
    const inactive = this._computeInactiveKeys(out);
    for (const k of inactive) delete out[k];
    delete out._color_mode;
    const ordered = {};
    for (const k of KEY_ORDER) {
      if (k === "custom_cards") continue;
      if (k in out) ordered[k] = out[k];
    }
    for (const k of Object.keys(out)) {
      if (k === "custom_cards") continue;
      if (!(k in ordered)) ordered[k] = out[k];
    }
    if ("custom_cards" in out) ordered.custom_cards = out.custom_cards;
    return ordered;
  }
  _emit() {
    const config = { ...(this._config || {}) };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }
  _renderForm(schema) {
    if (!schema || schema.length === 0) return "";
    return html`<ha-form
      .hass=${this.hass}
      .data=${this._formData}
      .schema=${schema}
      .computeLabel=${this._computeLabel}
      .computeHelper=${this._computeHelper}
      @value-changed=${this._valueChanged}
    ></ha-form>`;
  }
  _renderClearableText(name) {
    const val = (this._formData || {})[name];
    return html`<div class="clearable-field">
      ${this._renderForm([{ name, selector: { text: {} } }])}
      ${val
        ? html`<button
            type="button"
            class="clear-btn"
            title="Clear"
            data-field=${name}
            @click=${this._onClearFieldClick}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>`
        : ""}
    </div>`;
  }
  _onClearFieldClick(e) {
    const field =
      e.currentTarget && e.currentTarget.dataset
        ? e.currentTarget.dataset.field
        : "";
    if (!field) return;
    this._updateField(field, "");
  }
  _renderDisclosure(label, content) {
    const isAdvanced = label === "Advanced options";
    return html`<details class="disclosure" @toggle=${this._onDisclosureToggle}>
      <summary>
        <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
        ${isAdvanced ? html`<ha-icon icon="mdi:cog-outline"></ha-icon>` : ""}
        <span>${label}</span>
      </summary>
      <div class="disclosure-body">${content}</div>
    </details>`;
  }
  _onDisclosureToggle(e) {
    const el = e.currentTarget;
    if (!el.open) return;
    const parent = el.parentElement;
    if (!parent) return;
    parent
      .querySelectorAll(":scope > details.disclosure[open]")
      .forEach((d) => {
        if (d !== el) d.open = false;
      });
  }
  _renderPositionGrid(field, gridDef) {
    const prepared = PREPARED_POSITION_GRIDS[field];
    const valueMap = prepared ? prepared.valueMap : gridDef.valueMap || {};
    const reverseMap = prepared
      ? prepared.reverseMap
      : Object.fromEntries(Object.entries(valueMap).map(([k, v]) => [v, k]));
    const stored = this._formData[field] || "",
      value = reverseMap[stored] || stored,
      cells = prepared ? prepared.cellsFlat : gridDef.cells.flat();
    const disabledSet = prepared
        ? prepared.disabledSet
        : new Set(gridDef.disabled || []),
      helper = HELPERS[field],
      labelText = LABELS[field] || field;
    return html`<div class="grid-picker">
      <div class="grid-picker-label">${labelText}</div>
      <div class="grid-3x3" role="radiogroup" aria-label=${labelText}>
        ${cells.map((val) => {
          if (val === null) return html`<div class="grid-cell empty"></div>`;
          const isDisabled = disabledSet.has(val);
          const mappedValue = valueMap[val] || val;
          return html`<button
            type="button"
            role="radio"
            class="grid-cell ${value === val ? "active" : ""} ${isDisabled
              ? "disabled"
              : ""}"
            ?disabled=${isDisabled}
            data-field=${field}
            data-value=${mappedValue}
            title=${isDisabled ? `${val} (not supported here)` : val}
            aria-label=${val}
            @click=${this._onPositionGridSelect}
          ></button>`;
        })}
      </div>
      ${gridDef.extras
        ? html`<div class="grid-extras">
            ${gridDef.extras.map(
              (ex) =>
                html`<button
                  type="button"
                  class="grid-extra ${value === ex.value ? "active" : ""}"
                  aria-pressed=${value === ex.value ? "true" : "false"}
                  data-field=${field}
                  data-value=${ex.value}
                  @click=${this._onPositionGridSelect}
                >
                  ${ex.label}
                </button>`,
            )}
          </div>`
        : ""}
      ${helper ? html`<div class="grid-helper">${helper}</div>` : ""}
    </div>`;
  }
  _onPositionGridSelect(e) {
    const target = e.currentTarget;
    if (!target || target.disabled) return;
    const field = target.dataset && target.dataset.field;
    const value = target.dataset && target.dataset.value;
    if (!field || value === undefined) return;
    this._setField(field, value);
  }
  _setField(field, value) {
    const current = this._config || {};
    if (current[field] === value) {
      this._patch({}, { strip: [field] });
      return;
    }
    this._patch({ [field]: value });
  }
  _updateField(field, value) {
    if (field === "card_height") {
      this._cardHeightError = this._isValidCardHeight(value)
        ? ""
        : "Invalid height. Use auto, 160, 160px, 40vh, or 80%.";
      value = this._normalizeCardHeight(value);
    }
    const isEmpty = value === null || value === undefined || value === "";
    if (isEmpty) {
      this._patch({}, { strip: [field] });
      return;
    }
    this._patch({ [field]: value });
  }
  _setCardStyle(value) {
    if (value === "standalone") {
      this._patch(
        { card_style: value },
        {
          strip: [
            "card_full_width",
            "card_mask_vertical",
            "card_mask_horizontal",
          ],
        },
      );
      return;
    }
    this._patch({ card_style: value });
  }
  _onPanelToggle(id, expanded) {
    if (expanded) this._openPanel = id;
    else if (this._openPanel === id) this._openPanel = null;
  }
  _onPanelExpandedChanged(e) {
    const panel =
      e.currentTarget && e.currentTarget.dataset
        ? e.currentTarget.dataset.panel
        : "";
    if (!panel) return;
    this._onPanelToggle(panel, !!(e.detail && e.detail.expanded));
  }
  _onTrimmedFieldChange(e) {
    const field =
      e.currentTarget && e.currentTarget.dataset
        ? e.currentTarget.dataset.field
        : "";
    if (!field) return;
    this._updateField(field, (e.target.value || "").trim());
  }
  _onRawFieldChange(e) {
    const field =
      e.currentTarget && e.currentTarget.dataset
        ? e.currentTarget.dataset.field
        : "";
    if (!field) return;
    this._updateField(field, e.target.value || "");
  }
  _onOffsetPartChange(e) {
    const indexRaw =
      e.currentTarget && e.currentTarget.dataset
        ? e.currentTarget.dataset.offsetIndex
        : "";
    const index = Number(indexRaw);
    if (!Number.isInteger(index)) return;
    this._setOffsetPart(index, e.target.value);
  }
  _onSegmentedFieldSelect(e) {
    const t = e.currentTarget;
    const field = t && t.dataset ? t.dataset.field : "";
    if (!field) return;
    const value = t && t.dataset ? t.dataset.value : "";
    const valueType = t && t.dataset ? t.dataset.valueType : "string";
    if (valueType === "number") {
      const n = Number(value);
      if (!Number.isFinite(n)) return;
      this._updateField(field, n);
      return;
    }
    if (valueType === "boolean") {
      this._updateField(field, value === "true");
      return;
    }
    if (valueType === "empty") {
      this._updateField(field, "");
      return;
    }
    this._updateField(field, value);
  }
  _onChipAreaBackgroundModeSelect(e) {
    const mode =
      e.currentTarget && e.currentTarget.dataset
        ? e.currentTarget.dataset.bgMode
        : "";
    if (!mode) return;
    if (mode === "off") {
      this._updateField("chip_area_background", false);
      return;
    }
    this._updateField("chip_area_background", true);
    this._updateField("card_background_style", mode);
  }
  _renderCardStyleSegmented() {
    const c = this._formData,
      isSquare = c.card_square === true,
      current = c.card_style || "immersive";
    const opts = [
      { value: "immersive", label: "Immersive" },
      { value: "standalone", label: "Standalone" },
    ];
    return html`<div class="grid-picker">
      <div class="segmented" role="radiogroup" aria-label=${LABELS.card_style}>
        ${opts.map(
          (o) =>
            html`<button
              type="button"
              role="radio"
              data-value=${o.value}
              class=${current === o.value ? "active" : ""}
              @click=${this._onCardStyleSelect}
            >
              ${o.label}
            </button>`,
        )}
      </div>
      <div class="composite-helper">
        ${current === "immersive"
          ? "The card uses no background at all."
          : "Background color based on the weather."}
      </div>
      <div class="compact-fields">
        ${isSquare
          ? ""
          : this._renderCompactField("card_height", "e.g. 220 or auto")}
        ${this._renderCompactField("card_padding", "e.g. 16px")}
      </div>
    </div>`;
  }
  _onCardStyleSelect(e) {
    const value =
      e.currentTarget && e.currentTarget.dataset
        ? e.currentTarget.dataset.value
        : "";
    if (!value) return;
    this._setCardStyle(value);
  }
  _renderCelestialOffsetPicker() {
    const c = this._formData;
    return html`<div class="composite">
      <div class="composite-label">Offset from edge</div>
      <div class="composite-row" style="flex-wrap:nowrap">
        <span class="composite-unit">X</span>
        <input
          type="text"
          class="composite-number"
          placeholder="0"
          style="flex:1;min-width:0"
          data-field="celestial_x"
          .value=${String(c.celestial_x || "")}
          @change=${this._onTrimmedFieldChange}
        />
        <span class="composite-unit">Y</span>
        <input
          type="text"
          class="composite-number"
          placeholder="0"
          style="flex:1;min-width:0"
          data-field="celestial_y"
          .value=${String(c.celestial_y || "")}
          @change=${this._onTrimmedFieldChange}
        />
      </div>
    </div>`;
  }
  _parseOffset(raw) {
    if (!raw || typeof raw !== "string") return [0, 0, 0, 0];
    const parts = raw
      .trim()
      .split(/\s+/)
      .map((p) => parseInt(p, 10) || 0);
    switch (parts.length) {
      case 0:
        return [0, 0, 0, 0];
      case 1:
        return [parts[0], parts[0], parts[0], parts[0]];
      case 2:
        return [parts[0], parts[1], parts[0], parts[1]];
      case 3:
        return [parts[0], parts[1], parts[2], parts[1]];
      default:
        return [parts[0], parts[1], parts[2], parts[3]];
    }
  }
  _serializeOffset(arr) {
    if (arr.every((v) => v === 0)) return "";
    return arr.map((v) => `${v}px`).join(" ");
  }
  _setOffsetPart(index, rawValue) {
    const parts = this._parseOffset(this._formData.card_offset);
    parts[index] = parseInt(rawValue, 10) || 0;
    this._updateField("card_offset", this._serializeOffset(parts));
  }
  _renderImageOffsetPicker() {
    const c = this._formData;
    if (!c.image_day && !c.image_night) return "";
    return html`<div class="composite">
      <div class="composite-label">Image Offset</div>
      <div class="composite-row" style="flex-wrap:nowrap">
        <span class="composite-unit">X</span>
        <ha-textfield
          class="composite-textfield"
          placeholder="0"
          style="flex:1;min-width:0"
          data-field="image_x"
          .value=${String(c.image_x || "")}
          @change=${this._onTrimmedFieldChange}
        ></ha-textfield>
        <span class="composite-unit">Y</span>
        <ha-textfield
          class="composite-textfield"
          placeholder="0"
          style="flex:1;min-width:0"
          data-field="image_y"
          .value=${String(c.image_y || "")}
          @change=${this._onTrimmedFieldChange}
        ></ha-textfield>
      </div>
      <div class="composite-helper">
        Fine-tune image position. Pixels or CSS values, e.g. -20 or 10%.
      </div>
    </div>`;
  }
  _renderOffsetPicker() {
    const parts = this._parseOffset(this._formData.card_offset),
      edges = ["Top", "Right", "Bottom", "Left"];
    return html`<div class="composite">
      <div class="composite-label">${LABELS.card_offset}</div>
      <div class="composite-grid-4">
        ${edges.map(
          (label, i) =>
            html`<label>
              <span>${label}</span>
              <input
                type="number"
                step="1"
                data-offset-index=${String(i)}
                .value=${String(parts[i])}
                @change=${this._onOffsetPartChange}
            /></label>`,
        )}
      </div>
      ${HELPERS.card_offset
        ? html`<div class="composite-helper">${HELPERS.card_offset}</div>`
        : ""}
    </div>`;
  }
  _renderCustomCardsEditor() {
    const cards = Array.isArray(this._config && this._config.custom_cards)
      ? this._config.custom_cards
      : [];
    return html`${cards.length === 0
        ? html`<div class="cards-empty">No cards yet.</div>`
        : cards.map((card, idx) =>
            this._renderCardRow(card, idx, cards.length),
          )}
      <button type="button" class="add-card-btn" @click=${this._addBlankCard}>
        <ha-icon icon="mdi:plus"></ha-icon>
        <span>Add card</span>
      </button>`;
  }
  _renderListRow({
    idx,
    total,
    expanded,
    title,
    badge,
    onToggle,
    onMoveUp,
    onMoveDown,
    onRemove,
    onDuplicate,
    body,
  }) {
    return html`<div class="card-row ${expanded ? "expanded" : ""}">
      <div class="card-row-head" @click=${onToggle}>
        <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
        ${badge ? badge : ""}
        <span class="card-row-title">${title}</span>
        <div class="card-row-actions" @click=${this._onStopPropagation}>
          <button
            type="button"
            title="Move up"
            ?disabled=${idx === 0}
            @click=${onMoveUp}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
          <button
            type="button"
            title="Move down"
            ?disabled=${idx === total - 1}
            @click=${onMoveDown}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
          ${onDuplicate
            ? html`<button
                type="button"
                title="Duplicate"
                @click=${onDuplicate}
              >
                <ha-icon icon="mdi:content-copy"></ha-icon>
              </button>`
            : ""}
          <button type="button" title="Delete" @click=${onRemove}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
      </div>
      ${expanded ? html`<div class="card-row-body">${body}</div>` : ""}
    </div>`;
  }
  _onStopPropagation(e) {
    e.stopPropagation();
  }
  _onCustomCardSizeChange(e) {
    const t = e.currentTarget;
    const idx = Number(t && t.dataset ? t.dataset.cardIdx : NaN);
    const key = t && t.dataset ? t.dataset.cardKey : "";
    if (!Number.isInteger(idx) || idx < 0 || !key) return;
    const cards = [...((this._config && this._config.custom_cards) || [])];
    const card = cards[idx] && typeof cards[idx] === "object" ? cards[idx] : {};
    const next = { ...card };
    const v = (e.target.value || "").trim();
    if (v) next[key] = v;
    else delete next[key];
    this._updateCardAt(idx, next);
  }
  _onCustomCardFormValueChanged(e) {
    e.stopPropagation();
    const idx = Number(
      e.currentTarget && e.currentTarget.dataset
        ? e.currentTarget.dataset.cardIdx
        : NaN,
    );
    if (!Number.isInteger(idx) || idx < 0) return;
    this._updateCardAt(
      idx,
      (e.detail && e.detail.value && e.detail.value._card) || {},
    );
  }
  _renderCardRow(card, idx, total) {
    const expanded = this._expandedCard === idx;
    const title =
      card && card.type ? String(card.type).replace(/^custom:/, "") : "card";
    const body = html`<div class="card-size-row">
        <div class="offset-field">
          <span class="offset-field-label">Custom Width</span>
          <input
            type="text"
            placeholder="e.g. 140px or 60%"
            data-card-idx=${String(idx)}
            data-card-key="custom_width"
            .value=${card.custom_width || ""}
            @change=${this._onCustomCardSizeChange}
          />
        </div>
        <div class="offset-field">
          <span class="offset-field-label">Custom Height</span>
          <input
            type="text"
            placeholder="e.g. 110px"
            data-card-idx=${String(idx)}
            data-card-key="custom_height"
            .value=${card.custom_height || ""}
            @change=${this._onCustomCardSizeChange}
          />
        </div>
      </div>
      <ha-form
        .hass=${this.hass}
        .data=${{ _card: card }}
        .schema=${[{ name: "_card", selector: { object: {} } }]}
        data-card-idx=${String(idx)}
        .computeLabel=${() => ""}
        @value-changed=${this._onCustomCardFormValueChanged}
      ></ha-form>`;
    return this._renderListRow({
      idx,
      total,
      expanded,
      title,
      body,
      onToggle: () => this._toggleCardExpanded(idx),
      onMoveUp: () => this._moveCard(idx, -1),
      onMoveDown: () => this._moveCard(idx, 1),
      onRemove: () => this._removeCard(idx),
    });
  }
  _toggleCardExpanded(idx) {
    this._expandedCard = this._expandedCard === idx ? null : idx;
  }
  _moveCard(idx, delta) {
    const cards = [...((this._config && this._config.custom_cards) || [])];
    const target = idx + delta;
    if (target < 0 || target >= cards.length) return;
    [cards[idx], cards[target]] = [cards[target], cards[idx]];
    if (this._expandedCard === idx) this._expandedCard = target;
    else if (this._expandedCard === target) this._expandedCard = idx;
    this._updateField("custom_cards", cards);
  }
  _removeCard(idx) {
    const cards = [...((this._config && this._config.custom_cards) || [])];
    cards.splice(idx, 1);
    if (this._expandedCard === idx) this._expandedCard = null;
    else if (
      typeof this._expandedCard === "number" &&
      this._expandedCard > idx
    ) {
      this._expandedCard = this._expandedCard - 1;
    }
    this._updateField("custom_cards", cards);
  }
  _updateCardAt(idx, newCard) {
    const cards = [...((this._config && this._config.custom_cards) || [])];
    cards[idx] = newCard;
    this._updateField("custom_cards", cards);
  }
  _addBlankCard = () => {
    const cards = [
      ...((this._config && this._config.custom_cards) || []),
      { type: "entity", entity: "", custom_width: "100%" },
    ];
    this._expandedCard = cards.length - 1;
    this._updateField("custom_cards", cards);
  };
  _chipTitle(chip) {
    const name = ((chip && chip.name) || "").toString().trim(),
      entity = ((chip && chip.entity) || "").toString().trim();
    const attribute = ((chip && chip.attribute) || "").toString().trim();
    if (!entity) return name ? `${name} — (no entity)` : "(choose an entity)";
    const st = this.hass && this.hass.states && this.hass.states[entity],
      friendly = st && st.attributes && st.attributes.friendly_name;
    const label = friendly || entity;
    if (chip.forecast) {
      const type = chip.forecast === "hourly" ? "Hourly" : "Daily",
        offset = parseInt(chip.forecast_offset, 10) || 0;
      const offsetLabel =
        chip.forecast === "hourly"
          ? offset === 0
            ? "now"
            : `+${offset}h`
          : offset === 0
            ? "today"
            : offset === 1
              ? "tomorrow"
              : `+${offset}d`;
      const attrLabel = attribute || "condition";
      const base = `${label} · ${type} ${offsetLabel} [${attrLabel}]`;
      return name ? `${name} — ${base}` : base;
    }
    const withAttr = attribute ? `${label} [${attribute}]` : label;
    return name ? `${name} — ${withAttr}` : withAttr;
  }
  _cleanChip(chip) {
    const out = { ...chip };
    if (!out.entity) {
      delete out.attribute;
      delete out.forecast;
      delete out.forecast_offset;
    }
    if (!out.forecast) {
      delete out.forecast_offset;
      delete out.forecast_precision;
    }
    if (out.forecast_offset === 0) delete out.forecast_offset;
    if (!out.sub_value_entity && !out.sub_value_attribute) {
      delete out.sub_value_format;
      delete out.sub_value_position;
      delete out.sub_value_size;
      delete out.sub_value_weight;
      delete out.hide_sub_value;
    }
    if (out.type !== "ring" && out.type !== "bar") {
      delete out.gauge_entity;
      delete out.gauge_attribute;
    }
    if (out.type !== "ring") {
      delete out.ring_min;
      delete out.ring_max;
      delete out.ring_color;
      delete out.ring_width;
      delete out.ring_gap;
      delete out.ring_thresholds;
      delete out.ring_threshold_mode;
    }
    if (out.type !== "bar") {
      delete out.bar_min;
      delete out.bar_max;
      delete out.bar_color;
      delete out.bar_height;
      delete out.bar_gap;
      delete out.bar_thresholds;
      delete out.bar_threshold_mode;
    }
    for (const k of Object.keys(out)) {
      const v = out[k];
      if (k === "unit_format" || k === "ring_min" || k === "bar_min") {
        if (v === null || v === undefined) delete out[k];
        continue;
      }
      if (k === "background" && v === false) continue;
      if (k === "icon_background" && v === false) continue;
      if (v === "" || v === null || v === undefined || v === false)
        delete out[k];
    }
    return out;
  }
  _updateChipAt(idx, newChip) {
    const list = this._getChips().map((c, i) =>
      i === idx ? this._cleanChip(newChip) : c,
    );
    this._commitChips(list);
  }
  _addChip = () => {
    const list = this._getChips();
    const next = [...list, {}];
    this._expandedChip = next.length - 1;
    this._commitChips(next);
  };
  _moveChip(idx, delta) {
    const list = [...this._getChips()],
      target = idx + delta;
    if (target < 0 || target >= list.length) return;
    [list[idx], list[target]] = [list[target], list[idx]];
    if (this._expandedChip === idx) this._expandedChip = target;
    else if (this._expandedChip === target) this._expandedChip = idx;
    this._commitChips(list);
  }
  _removeChip(idx) {
    const list = [...this._getChips()];
    list.splice(idx, 1);
    delete this[`_acc_open_${idx}`];
    delete this[`_text_acc_${idx}`];
    for (let i = idx; i < list.length; i++) {
      this[`_acc_open_${i}`] = this[`_acc_open_${i + 1}`] || null;
      this[`_text_acc_${i}`] = this[`_text_acc_${i + 1}`] || null;
    }
    delete this[`_acc_open_${list.length}`];
    delete this[`_text_acc_${list.length}`];
    if (this._expandedChip === idx) this._expandedChip = null;
    else if (
      typeof this._expandedChip === "number" &&
      this._expandedChip > idx
    ) {
      this._expandedChip = this._expandedChip - 1;
    }
    this._commitChips(list);
  }
  _duplicateChip(idx) {
    const list = [...this._getChips()];
    list.splice(idx + 1, 0, { ...list[idx] });
    this._expandedChip = idx + 1;
    this._commitChips(list);
  }
  _toggleChipExpanded(idx) {
    this._expandedChip = this._expandedChip === idx ? null : idx;
  }
  _getChipByIndex(idx) {
    const i = Number(idx);
    if (!Number.isInteger(i) || i < 0) return null;
    const list = this._getChips();
    return list[i] && typeof list[i] === "object" ? list[i] : null;
  }
  _onChipAccordionToggle(e) {
    const t = e.currentTarget;
    const idx = Number(t && t.dataset ? t.dataset.chipIdx : NaN);
    const key = t && t.dataset ? t.dataset.accKey : "";
    const kind = t && t.dataset ? t.dataset.accKind : "main";
    if (!Number.isInteger(idx) || idx < 0 || !key) return;
    const prop = kind === "text" ? `_text_acc_${idx}` : `_acc_open_${idx}`;
    this[prop] = this[prop] === key ? null : key;
    this.requestUpdate();
  }
  _onChipTypeModeSelect(e) {
    const t = e.currentTarget;
    const idx = Number(t && t.dataset ? t.dataset.chipIdx : NaN);
    const mode = t && t.dataset ? t.dataset.mode : "";
    if (!Number.isInteger(idx) || idx < 0 || !mode) return;
    const chip = this._getChipByIndex(idx);
    if (!chip) return;
    if (mode === "sensor") {
      const n = { ...chip };
      delete n.forecast;
      delete n.forecast_offset;
      delete n.forecast_precision;
      this._updateChipAt(idx, n);
      return;
    }
    if (mode === "forecast") {
      const cur = (chip.entity || "").toString().trim();
      const cardWeatherEntity =
        (this._config && this._config.weather_entity) || "";
      const ent =
        cur && cur.startsWith("weather.") ? cur : cardWeatherEntity || cur;
      const n = {
        ...chip,
        forecast: "daily",
        attribute: "temperature",
        forecast_offset: 1,
      };
      if (ent) n.entity = ent;
      this._updateChipAt(idx, n);
    }
  }
  _onChipForecastTypeSelect(e) {
    const t = e.currentTarget;
    const idx = Number(t && t.dataset ? t.dataset.chipIdx : NaN);
    const forecast = t && t.dataset ? t.dataset.forecastType : "";
    if (!Number.isInteger(idx) || idx < 0 || !forecast) return;
    const chip = this._getChipByIndex(idx);
    if (!chip) return;
    this._updateChipAt(idx, {
      ...chip,
      forecast,
      forecast_offset: 0,
    });
  }
  _onChipAnchorSelect(e) {
    const t = e.currentTarget;
    const idx = Number(t && t.dataset ? t.dataset.chipIdx : NaN);
    const anchor = t && t.dataset ? t.dataset.anchor : "";
    if (!Number.isInteger(idx) || idx < 0 || !anchor) return;
    const chip = this._getChipByIndex(idx);
    if (!chip) return;
    this._updateChipAt(idx, { ...chip, position_anchor: anchor });
  }
  _onChipToggleChange(e) {
    const t = e.currentTarget;
    const idx = Number(t && t.dataset ? t.dataset.chipIdx : NaN);
    const key = t && t.dataset ? t.dataset.key : "";
    const mode = t && t.dataset ? t.dataset.mode : "true-delete";
    if (!Number.isInteger(idx) || idx < 0 || !key) return;
    const chip = this._getChipByIndex(idx);
    if (!chip) return;
    const next = { ...chip };
    const checked = e.target && e.target.checked === true;
    if (mode === "true-delete") {
      if (checked) next[key] = true;
      else delete next[key];
    } else if (mode === "false-delete") {
      if (!checked) next[key] = false;
      else delete next[key];
    } else if (mode === "true-false-if-defined") {
      if (checked) next[key] = true;
      else {
        if (chip[key] !== undefined) next[key] = false;
        else delete next[key];
      }
    }
    this._updateChipAt(idx, next);
  }
  _onChipActionClick(e) {
    const t = e.currentTarget;
    const idx = Number(t && t.dataset ? t.dataset.chipIdx : NaN);
    const action = t && t.dataset ? t.dataset.action : "";
    if (!Number.isInteger(idx) || idx < 0 || !action) return;
    const chip = this._getChipByIndex(idx);
    if (!chip) return;
    const next = { ...chip };
    if (action === "remove-icon") {
      delete next.icon;
    } else if (action === "set-weather-icon") {
      next.icon = "weather";
    } else if (action === "clear-icon-path") {
      delete next.icon_path;
    } else if (action === "reset-styles") {
      for (const k of CHIP_STYLE_OVERRIDE_KEYS) delete next[k];
    } else {
      return;
    }
    this._updateChipAt(idx, next);
  }
  _onChipSegmentedSelect(e) {
    const t = e.currentTarget;
    const idx = Number(t && t.dataset ? t.dataset.chipIdx : NaN);
    const key = t && t.dataset ? t.dataset.key : "";
    const mode = t && t.dataset ? t.dataset.mode : "set";
    const valueType = t && t.dataset ? t.dataset.valueType : "string";
    const raw = t && t.dataset ? t.dataset.value : "";
    if (!Number.isInteger(idx) || idx < 0 || !key) return;
    const chip = this._getChipByIndex(idx);
    if (!chip) return;
    const next = { ...chip };
    let value = raw;
    if (valueType === "number") {
      const n = Number(raw);
      if (!Number.isFinite(n)) return;
      value = n;
    } else if (valueType === "boolean") {
      value = raw === "true";
    }
    if (mode === "set-or-delete-empty") {
      if (value === "") delete next[key];
      else next[key] = value;
    } else if (mode === "toggle-delete-if-same") {
      if (chip[key] === value) delete next[key];
      else next[key] = value;
    } else if (mode === "beside-or-delete") {
      if (value === "beside") next[key] = "beside";
      else delete next[key];
    } else if (mode === "solid-or-delete") {
      if (value === "solid") delete next[key];
      else next[key] = value;
    } else {
      next[key] = value;
    }
    this._updateChipAt(idx, next);
  }
  _commitChips(list) {
    if (!Array.isArray(list) || list.length === 0) {
      this._patch({}, { strip: ["chips"] });
      return;
    }
    this._patch({ chips: list });
  }
  _chipLabel = (schema) => {
    if (!schema || !schema.name) return "";
    return CHIP_LABELS[schema.name] || schema.name;
  };
  _chipHelper = (schema) => {
    if (!schema || !schema.name) return undefined;
    return CHIP_HELPERS[schema.name] || undefined;
  };
  _renderChipRow(chip, idx, total) {
    const expanded = this._expandedChip === idx;
    const isFree = (chip.position || "").toString().toLowerCase() === "custom";
    const isFc = !!chip.forecast;
    const chipType = chip.type || "";
    const posBadge = isFree
      ? html`<span class="chip-badge-free"
          ><ha-icon icon="mdi:cursor-move"></ha-icon
        ></span>`
      : html`<span class="chip-badge-row"
          ><ha-icon icon="mdi:view-grid-outline"></ha-icon
        ></span>`;
    const badge = posBadge;
    if (!expanded) {
      return this._renderListRow({
        idx,
        total,
        expanded,
        body: "",
        badge,
        title: this._chipTitle(chip),
        onToggle: () => this._toggleChipExpanded(idx),
        onMoveUp: () => this._moveChip(idx, -1),
        onMoveDown: () => this._moveChip(idx, 1),
        onDuplicate: () => this._duplicateChip(idx),
        onRemove: () => this._removeChip(idx),
      });
    }
    const hasEntity = !!(chip.entity || "").toString().trim(),
      entityId = (chip.entity || "").toString().trim();
    const nameSensorId = (chip.name_sensor || "").toString().trim();
    const fcEntityMissing =
      isFc && entityId && !entityId.startsWith("weather.");
    const accOpen = this[`_acc_open_${idx}`] || null;
    const update = (next) => this._updateChipAt(idx, next);
    const chipForm = (schema) =>
      html`<ha-form
        .hass=${this.hass}
        .data=${chip}
        .schema=${schema}
        .computeLabel=${this._chipLabel}
        .computeHelper=${this._chipHelper}
        @value-changed=${(e) => {
          e.stopPropagation();
          update((e.detail && e.detail.value) || {});
        }}
      ></ha-form>`;
    const cssField = (key, label, placeholder) =>
      html`<div class="css-field">
        <span class="css-field-label">${label}</span>
        <input
          type="text"
          placeholder=${placeholder}
          .value=${chip[key] !== undefined ? String(chip[key]) : ""}
          @change=${(e) => {
            const v = e.target.value;
            const next = { ...chip };
            if (key === "unit_format" || key === "sub_value_format") {
              next[key] = v;
            } else if (v.trim()) next[key] = v.trim();
            else delete next[key];
            update(next);
          }}
        />
      </div>`;
    const acc = (key, icon, title, content) => {
      const isOpen = accOpen === key;
      return html`<div class="chip-accordion">
        <div
          class="chip-accordion-head ${isOpen ? "open" : ""}"
          data-chip-idx=${idx}
          data-acc-kind="main"
          data-acc-key=${key}
          @click=${this._onChipAccordionToggle}
        >
          <ha-icon class="chip-accordion-icon" icon="${icon}"></ha-icon>
          <span class="chip-accordion-title">${title}</span>
          <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
        </div>
        ${isOpen ? html`<div class="chip-accordion-body">${content}</div>` : ""}
      </div>`;
    };
    /* ── Data source (always visible) ── */
    const typePicker = html`<div class="chip-type-picker">
      <button
        type="button"
        class="chip-type-btn ${!isFc ? "active" : ""}"
        data-chip-idx=${idx}
        data-mode="sensor"
        @click=${this._onChipTypeModeSelect}
      >
        <ha-icon
          class="chip-type-icon ${!isFc ? "active-icon" : ""}"
          icon="mdi:gauge"
        ></ha-icon>
        <div class="chip-type-text">
          <span class="chip-type-name">Sensor</span
          ><span class="chip-type-desc">Live entity value</span>
        </div>
      </button>
      <button
        type="button"
        class="chip-type-btn ${isFc ? "active" : ""}"
        data-chip-idx=${idx}
        data-mode="forecast"
        @click=${this._onChipTypeModeSelect}
      >
        <ha-icon
          class="chip-type-icon ${isFc ? "active-icon" : ""}"
          icon="mdi:calendar-clock"
        ></ha-icon>
        <div class="chip-type-text">
          <span class="chip-type-name">Forecast</span
          ><span class="chip-type-desc">Weather forecast</span>
        </div>
      </button>
    </div>`;
    const entitySection = isFc
      ? chipForm([
          { name: "entity", selector: { entity: { domain: "weather" } } },
        ])
      : chipForm([
          { name: "entity", selector: { entity: {} } },
          ...(entityId
            ? [
                {
                  name: "attribute",
                  selector: { attribute: { entity_id: entityId } },
                },
              ]
            : []),
        ]);
    const emptyNudge = !hasEntity
      ? html`<div class="chip-nudge info">
          <ha-icon
            icon="mdi:information-outline"
            style="--mdc-icon-size:14px;flex-shrink:0"
          ></ha-icon>
          Pick an entity for this chip.
        </div>`
      : "";
    const fcWarning = fcEntityMissing
      ? html`<div class="chip-nudge warning">
          <ha-icon
            icon="mdi:alert-circle-outline"
            style="--mdc-icon-size:14px;flex-shrink:0"
          ></ha-icon>
          Forecast requires a weather entity.
        </div>`
      : "";
    const fcAttr = chip.attribute || "condition";
    const fcOff = parseInt(chip.forecast_offset, 10) || 0;
    /* ── Icon accordion ── */
    const isWeatherIcon =
      (chip.icon || "").toString().trim().toLowerCase() === "weather";
    const iconSection = html`<div class="toggle-group">
        <label class="toggle-row">
          <span>Hide icon</span>
          <ha-switch
            data-chip-idx=${idx}
            data-key="hide_icon"
            data-mode="true-delete"
            .checked=${chip.hide_icon === true}
            @change=${this._onChipToggleChange}
          ></ha-switch
        ></label>
      </div>
      ${!chip.hide_icon
        ? html`${isWeatherIcon
              ? html`<div class="weather-icon-active">
                  <ha-icon
                    icon="mdi:weather-partly-cloudy"
                    style="--mdc-icon-size:20px;color:var(--primary-color)"
                  ></ha-icon>
                  <div class="weather-icon-active-text">
                    <span>Weather icon</span>
                    <span class="weather-icon-active-sub"
                      >${isFc ? "Matches forecast" : "Matches weather"}</span
                    >
                  </div>
                  <button
                    type="button"
                    class="icon-weather-btn"
                    data-chip-idx=${idx}
                    data-action="remove-icon"
                    @click=${this._onChipActionClick}
                  >
                    Remove
                  </button>
                </div>`
              : html`<div class="icon-combo">
                  <ha-form
                    style="flex:1;min-width:0"
                    .hass=${this.hass}
                    .data=${{ icon: chip.icon || "" }}
                    .schema=${[{ name: "icon", selector: { icon: {} } }]}
                    .computeLabel=${() => ""}
                    @value-changed=${(e) => {
                      e.stopPropagation();
                      update({
                        ...chip,
                        icon:
                          (e.detail && e.detail.value && e.detail.value.icon) ||
                          "",
                      });
                    }}
                  ></ha-form>
                  <button
                    type="button"
                    class="icon-weather-btn"
                    title="Use dynamic weather icon"
                    data-chip-idx=${idx}
                    data-action="set-weather-icon"
                    @click=${this._onChipActionClick}
                  >
                    <ha-icon
                      icon="mdi:weather-partly-cloudy"
                      style="--mdc-icon-size:18px"
                    ></ha-icon>
                  </button>
                </div>`}
            <div class="clearable-field">
              ${chipForm([{ name: "icon_path", selector: { text: {} } }])}
              ${chip.icon_path
                ? html`<button
                    type="button"
                    class="clear-btn"
                    title="Clear"
                    data-chip-idx=${idx}
                    data-action="clear-icon-path"
                    @click=${this._onChipActionClick}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>`
                : ""}
            </div>
            <div class="css-field-row cols-2">
              ${cssField("icon_size", "Size", "auto")}
              ${cssField("icon_padding", "Padding", "auto")}
            </div>
            <div class="toggle-group">
              <label class="toggle-row">
                <span>Icon background</span>
                <ha-switch
                  data-chip-idx=${idx}
                  data-key="icon_background"
                  data-mode="true-false-if-defined"
                  .checked=${chip.icon_background === true}
                  @change=${this._onChipToggleChange}
                ></ha-switch
              ></label>
            </div>
            ${chip.icon_background === true
              ? this._renderColorPicker(
                  "Icon background color",
                  chip.icon_background_color || "",
                  (h, o) => {
                    const next = { ...chip };
                    if (!h) delete next.icon_background_color;
                    else
                      next.icon_background_color = this._serializeColor(h, o);
                    update(next);
                  },
                )
              : ""}`
        : ""}`;
    /* ── Text accordion ── */
    const isValueMarquee = (chip.overflow || "").toLowerCase() === "marquee";
    const isLabelMarquee =
      (chip.label_overflow || "").toLowerCase() === "marquee";
    const hasSubValue = !!(chip.sub_value_entity || chip.sub_value_attribute);
    const subEntityId = (chip.sub_value_entity || "").toString().trim();
    const textAccOpen = this[`_text_acc_${idx}`] || null;
    const textAcc = (tKey, title, content) => {
      const isOpen = textAccOpen === tKey;
      return html`<div class="chip-accordion">
        <div
          class="chip-accordion-head ${isOpen ? "open" : ""}"
          data-chip-idx=${idx}
          data-acc-kind="text"
          data-acc-key=${tKey}
          @click=${this._onChipAccordionToggle}
        >
          <span class="chip-accordion-title">${title}</span>
          <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
        </div>
        ${isOpen ? html`<div class="chip-accordion-body">${content}</div>` : ""}
      </div>`;
    };
    const labelContent = html`<div class="toggle-group">
        <label class="toggle-row">
          <span>Hide</span>
          <ha-switch
            data-chip-idx=${idx}
            data-key="hide_label"
            data-mode="true-delete"
            .checked=${chip.hide_label === true}
            @change=${this._onChipToggleChange}
          ></ha-switch
        ></label>
      </div>
      ${chip.hide_label !== true
        ? html`${chipForm([{ name: "name", selector: { text: {} } }])}
            ${chipForm([{ name: "name_sensor", selector: { entity: {} } }])}
            ${nameSensorId
              ? chipForm([
                  {
                    name: "name_attribute",
                    selector: { attribute: { entity_id: nameSensorId } },
                  },
                ])
              : isFc && !chip.name
                ? html`<ha-form
                    .hass=${this.hass}
                    .data=${{ name_attribute: chip.name_attribute || "" }}
                    .schema=${[
                      {
                        name: "name_attribute",
                        selector: {
                          select: { mode: "dropdown", options: FC_ATTRIBUTES },
                        },
                      },
                    ]}
                    .computeLabel=${() => "Forecast attribute"}
                    @value-changed=${(e) => {
                      e.stopPropagation();
                      const v =
                        e.detail &&
                        e.detail.value &&
                        e.detail.value.name_attribute;
                      const n = { ...chip };
                      if (v) n.name_attribute = v;
                      else delete n.name_attribute;
                      update(n);
                    }}
                  ></ha-form>`
                : ""}
            <div class="css-field-row cols-2">
              ${cssField("label_size", "Size", "auto")}
            </div>
            <div
              class="segmented segmented-compact"
              role="radiogroup"
              aria-label="Weight"
            >
              ${[
                { value: "", label: "Normal" },
                { value: "500", label: "Light" },
                { value: "600", label: "Medium" },
                { value: "700", label: "Bold" },
              ].map(
                (o) =>
                  html`<button
                    type="button"
                    role="radio"
                    class=${(chip.label_weight || "") === o.value
                      ? "active"
                      : ""}
                    data-chip-idx=${idx}
                    data-key="label_weight"
                    data-mode="set-or-delete-empty"
                    data-value=${o.value}
                    @click=${this._onChipSegmentedSelect}
                  >
                    ${o.label}
                  </button>`,
              )}
            </div>
            ${chipForm([
              {
                name: "label_overflow",
                selector: {
                  select: { mode: "dropdown", options: OPT.chip_overflow },
                },
              },
            ])}`
        : ""}`;
    const valueContent = html`<div class="toggle-group">
        <label class="toggle-row">
          <span>Hide</span>
          <ha-switch
            data-chip-idx=${idx}
            data-key="hide_value"
            data-mode="true-delete"
            .checked=${chip.hide_value === true}
            @change=${this._onChipToggleChange}
          ></ha-switch
        ></label>
        ${!chip.hide_value &&
        !isFc &&
        this.hass &&
        this.hass.states[entityId] &&
        this.hass.states[entityId].attributes &&
        (this.hass.states[entityId].attributes.temperature_unit ||
          (
            this.hass.states[entityId].attributes.unit_of_measurement || ""
          ).match(/^°/))
          ? html`<label class="toggle-row">
              <span>Fancy unit</span>
              <ha-switch
                data-chip-idx=${idx}
                data-key="fancy_unit"
                data-mode="true-delete"
                .checked=${chip.fancy_unit === true}
                @change=${this._onChipToggleChange}
              ></ha-switch
            ></label>`
          : ""}
      </div>
      ${chip.hide_value !== true
        ? html`${chipForm([{ name: "unit_format", selector: { text: {} } }])}
            <div class="css-field-row cols-2">
              ${cssField("text_size", "Size", "auto")}
            </div>
            <div
              class="segmented segmented-compact"
              role="radiogroup"
              aria-label="Weight"
            >
              ${[
                { value: "", label: "Normal" },
                { value: "500", label: "Light" },
                { value: "600", label: "Medium" },
                { value: "700", label: "Bold" },
              ].map(
                (o) =>
                  html`<button
                    type="button"
                    role="radio"
                    class=${(chip.value_weight || "") === o.value
                      ? "active"
                      : ""}
                    data-chip-idx=${idx}
                    data-key="value_weight"
                    data-mode="set-or-delete-empty"
                    data-value=${o.value}
                    @click=${this._onChipSegmentedSelect}
                  >
                    ${o.label}
                  </button>`,
              )}
            </div>
            ${chipForm([
              {
                name: "overflow",
                selector: {
                  select: { mode: "dropdown", options: OPT.chip_overflow },
                },
              },
            ])}`
        : ""}`;
    const subValueContent = html`<div class="toggle-group">
        <label class="toggle-row">
          <span>Hide</span>
          <ha-switch
            data-chip-idx=${idx}
            data-key="hide_sub_value"
            data-mode="true-delete"
            .checked=${chip.hide_sub_value === true}
            @change=${this._onChipToggleChange}
          ></ha-switch
        ></label>
      </div>
      ${chip.hide_sub_value !== true
        ? html`${chipForm([
            { name: "sub_value_entity", selector: { entity: {} } },
          ])}
          ${subEntityId
            ? chipForm([
                {
                  name: "sub_value_attribute",
                  selector: { attribute: { entity_id: subEntityId } },
                },
              ])
            : isFc
              ? html`<ha-form
                  .hass=${this.hass}
                  .data=${{
                    sub_value_attribute: chip.sub_value_attribute || "",
                  }}
                  .schema=${[
                    {
                      name: "sub_value_attribute",
                      selector: {
                        select: { mode: "dropdown", options: FC_ATTRIBUTES },
                      },
                    },
                  ]}
                  .computeLabel=${() => "Forecast attribute"}
                  @value-changed=${(e) => {
                    e.stopPropagation();
                    const v =
                      e.detail &&
                      e.detail.value &&
                      e.detail.value.sub_value_attribute;
                    const n = { ...chip };
                    if (v) n.sub_value_attribute = v;
                    else delete n.sub_value_attribute;
                    update(n);
                  }}
                ></ha-form>`
              : ""}
          ${hasSubValue
            ? html`<div class="css-field-row cols-2">
                  ${cssField("sub_value_format", "Unit", "")}
                  ${cssField("sub_value_size", "Size", "auto")}
                </div>
                <div
                  class="segmented segmented-compact"
                  role="radiogroup"
                  aria-label="Weight"
                >
                  ${[
                    { value: "", label: "Normal" },
                    { value: "500", label: "Light" },
                    { value: "600", label: "Medium" },
                    { value: "700", label: "Bold" },
                  ].map(
                    (o) =>
                      html`<button
                        type="button"
                        role="radio"
                        class=${(chip.sub_value_weight || "") === o.value
                          ? "active"
                          : ""}
                        data-chip-idx=${idx}
                        data-key="sub_value_weight"
                        data-mode="set-or-delete-empty"
                        data-value=${o.value}
                        @click=${this._onChipSegmentedSelect}
                      >
                        ${o.label}
                      </button>`,
                  )}
                </div>
                <div class="segmented" role="radiogroup" aria-label="Position">
                  ${[
                    { value: "below", label: "Below" },
                    { value: "beside", label: "Beside value" },
                  ].map((o) => {
                    const cur =
                      chip.sub_value_position === "beside" ? "beside" : "below";
                    return html`<button
                      type="button"
                      role="radio"
                      class=${cur === o.value ? "active" : ""}
                      data-chip-idx=${idx}
                      data-key="sub_value_position"
                      data-mode="beside-or-delete"
                      data-value=${o.value}
                      @click=${this._onChipSegmentedSelect}
                    >
                      ${o.label}
                    </button>`;
                  })}
                </div>
                ${chipForm([
                  {
                    name: "sub_value_overflow",
                    selector: {
                      select: { mode: "dropdown", options: OPT.chip_overflow },
                    },
                  },
                ])}`
            : ""}`
        : ""}`;
    const isSubValueMarquee =
      (chip.sub_value_overflow || "").toLowerCase() === "marquee";
    const marqueeContent =
      isValueMarquee || isLabelMarquee || isSubValueMarquee
        ? html`<div class="toggle-group">
              <label class="toggle-row">
                <span>Right-to-left</span>
                <ha-switch
                  data-chip-idx=${idx}
                  data-key="marquee_rtl"
                  data-mode="true-delete"
                  .checked=${chip.marquee_rtl === true}
                  @change=${this._onChipToggleChange}
                ></ha-switch
              ></label>
            </div>
            ${(() => {
              const spd = parseFloat(chip.marquee_speed) || 30,
                spdPct = Math.round(((spd - 5) / (100 - 5)) * 100);
              return html`<div class="awc-slider">
                <div class="awc-slider-head">
                  <span class="awc-slider-label">Scroll speed</span>
                  <input
                    type="number"
                    class="awc-slider-num"
                    min="5"
                    max="100"
                    step="5"
                    .value=${String(spd)}
                    @change=${(e) => {
                      const v = Math.min(
                        100,
                        Math.max(5, parseInt(e.target.value, 10) || 30),
                      );
                      const range = e.target
                        .closest(".awc-slider")
                        .querySelector(".awc-slider-range");
                      if (range) {
                        range.value = v;
                        range.style.setProperty(
                          "--awc-slider-pct",
                          Math.round(((v - 5) / (100 - 5)) * 100) + "%",
                        );
                      }
                      update({ ...chip, marquee_speed: v });
                    }}
                  />
                </div>
                <input
                  type="range"
                  class="awc-slider-range"
                  min="5"
                  max="100"
                  step="5"
                  .value=${String(spd)}
                  style="--awc-slider-pct:${spdPct}%"
                  @input=${(e) => {
                    const v = parseInt(e.target.value, 10);
                    const p = Math.round(((v - 5) / (100 - 5)) * 100);
                    e.target.style.setProperty("--awc-slider-pct", p + "%");
                    const n = e.target
                      .closest(".awc-slider")
                      .querySelector(".awc-slider-num");
                    if (n) n.value = v;
                  }}
                  @change=${(e) =>
                    update({
                      ...chip,
                      marquee_speed: parseInt(e.target.value, 10),
                    })}
                />
              </div>`;
            })()}`
        : null;
    const textSection = html`${textAcc("text_label", "Label", labelContent)}
    ${textAcc("text_value", "Value", valueContent)}
    ${textAcc("text_sub", "Sub value", subValueContent)}
    ${marqueeContent
      ? textAcc("text_marquee", "Scrolling", marqueeContent)
      : ""}`;
    /* ── Layout accordion ── */
    const layoutSection = html`<div
        class="segmented"
        role="radiogroup"
        aria-label="Chip layout"
      >
        ${[
          { value: "inline", label: "Inline" },
          { value: "stacked", label: "Stacked" },
          { value: "vertical", label: "Vertical" },
        ].map(
          (o) =>
            html`<button
              type="button"
              role="radio"
              class=${chip.style === o.value ? "active" : ""}
              data-chip-idx=${idx}
              data-key="style"
              data-mode="toggle-delete-if-same"
              data-value=${o.value}
              @click=${this._onChipSegmentedSelect}
            >
              ${o.label}
            </button>`,
        )}
      </div>
      <div class="segmented" role="radiogroup" aria-label="Alignment">
        ${[
          { value: "start", label: "Left" },
          { value: "center", label: "Center" },
          { value: "end", label: "Right" },
          { value: "spread", label: "Spread" },
        ].map(
          (o) =>
            html`<button
              type="button"
              role="radio"
              class=${chip.align === o.value ? "active" : ""}
              data-chip-idx=${idx}
              data-key="align"
              data-mode="toggle-delete-if-same"
              data-value=${o.value}
              @click=${this._onChipSegmentedSelect}
            >
              ${o.label}
            </button>`,
        )}
      </div>
      <div class="toggle-group">
        <label class="toggle-row">
          <span>Round shape</span>
          <ha-switch
            data-chip-idx=${idx}
            data-key="chip_round"
            data-mode="true-delete"
            .checked=${chip.chip_round === true}
            @change=${this._onChipToggleChange}
          ></ha-switch
        ></label>
        <label class="toggle-row">
          <span>Background</span>
          <ha-switch
            data-chip-idx=${idx}
            data-key="background"
            data-mode="false-delete"
            .checked=${chip.background !== false}
            @change=${this._onChipToggleChange}
          ></ha-switch
        ></label>
      </div>
      ${chip.background !== false
        ? this._renderColorPicker(
            "Background color",
            chip.background_color || "",
            (h, o) => {
              const next = { ...chip };
              if (!h) delete next.background_color;
              else next.background_color = this._serializeColor(h, o);
              update(next);
            },
          )
        : ""}
      <div class="settings-group">
        <div class="settings-group-label">Chip Layout</div>
        <div class="css-field-row cols-2">
          ${cssField("width", "Width", "e.g. 200px")}
          ${cssField("height", "Height", "e.g. 40px")}
        </div>
        <div class="css-field-row cols-2">
          ${cssField("padding", "Padding", "auto")}
        </div>
      </div>
      <div class="settings-group">
        <div class="settings-group-label">Gaps</div>
        <div class="css-field-row cols-2">
          ${cssField("inner_gap", "Icon/text gap", "auto")}
          ${cssField("text_gap", "Label/value gap", "auto")}
        </div>
      </div>`;
    /* ── Type accordion (ring / bar gauge) ── */
    const gaugeFields = (prefix) => {
      const p = prefix + "_";
      const label = prefix === "ring" ? "Ring" : "Bar";
      const thresholds = Array.isArray(chip[p + "thresholds"])
        ? chip[p + "thresholds"]
        : [];
      const sizeFields =
        prefix === "ring"
          ? html`<div class="css-field-row cols-2">
              ${cssField("ring_width", "Thickness", "4")}
              ${cssField("ring_gap", "Gap", "3")}
            </div>`
          : html`<div class="css-field-row cols-2">
              ${cssField("bar_height", "Thickness", "4")}
              ${cssField("bar_gap", "Gap", "4")}
            </div>`;
      const gaugeEntityId = (chip.gauge_entity || "").toString().trim();
      return html`<div class="css-field-row cols-2">
          ${cssField(p + "min", "Min", "0")}
          ${cssField(p + "max", "Max", "100")}
        </div>
        ${sizeFields}
        ${this._renderColorPicker(
          `${label} color`,
          chip[p + "color"] || "",
          (h, o) => {
            const next = { ...chip };
            if (!h) delete next[p + "color"];
            else next[p + "color"] = this._serializeColor(h, o);
            update(next);
          },
        )}
        <details class="disclosure" @toggle=${this._onDisclosureToggle}>
          <summary>
            <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
            <ha-icon icon="mdi:cog-outline"></ha-icon>
            <span>${label} entity</span>
          </summary>
          <div class="disclosure-body">
            <div
              style="font-size:var(--awc-e-f-meta);color:var(--secondary-text-color);line-height:1.4"
            >
              Use a different entity for the ${prefix} value instead of the
              chip's main entity.
            </div>
            ${chipForm([{ name: "gauge_entity", selector: { entity: {} } }])}
            ${gaugeEntityId
              ? chipForm([
                  {
                    name: "gauge_attribute",
                    selector: { attribute: { entity_id: gaugeEntityId } },
                  },
                ])
              : isFc
                ? html`<ha-form
                    .hass=${this.hass}
                    .data=${{ gauge_attribute: chip.gauge_attribute || "" }}
                    .schema=${[
                      {
                        name: "gauge_attribute",
                        selector: {
                          select: { mode: "dropdown", options: FC_ATTRIBUTES },
                        },
                      },
                    ]}
                    .computeLabel=${() => "Forecast attribute"}
                    @value-changed=${(e) => {
                      e.stopPropagation();
                      const v =
                        e.detail &&
                        e.detail.value &&
                        e.detail.value.gauge_attribute;
                      const n = { ...chip };
                      if (v) n.gauge_attribute = v;
                      else delete n.gauge_attribute;
                      update(n);
                    }}
                  ></ha-form>`
                : ""}
          </div>
        </details>
        <details class="disclosure" @toggle=${this._onDisclosureToggle}>
          <summary>
            <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
            <ha-icon icon="mdi:cog-outline"></ha-icon>
            <span>Color thresholds</span>
          </summary>
          <div class="disclosure-body">
            <div
              class="segmented"
              role="radiogroup"
              aria-label="Threshold mode"
            >
              ${[
                { value: "solid", label: "Solid" },
                { value: "segments", label: "Segments" },
                { value: "gradient", label: "Gradient" },
              ].map(
                (o) =>
                  html`<button
                    type="button"
                    role="radio"
                    class=${(chip[p + "threshold_mode"] || "solid") === o.value
                      ? "active"
                      : ""}
                    data-chip-idx=${idx}
                    data-key=${p + "threshold_mode"}
                    data-mode="solid-or-delete"
                    data-value=${o.value}
                    @click=${this._onChipSegmentedSelect}
                  >
                    ${o.label}
                  </button>`,
              )}
            </div>
            ${thresholds.map(
              (t, ti) =>
                html`<div class="ring-threshold-row">
                  <span class="threshold-label">≥</span>
                  <input
                    type="text"
                    placeholder="value"
                    .value=${String(t.value != null ? t.value : "")}
                    @change=${(e) => {
                      const arr = [...thresholds];
                      arr[ti] = { ...arr[ti], value: e.target.value.trim() };
                      update({ ...chip, [p + "thresholds"]: arr });
                    }}
                  />
                  <input
                    type="color"
                    class="chip-color-swatch"
                    .value=${t.color || "#ff0000"}
                    @input=${(e) => {
                      const arr = [...thresholds];
                      arr[ti] = { ...arr[ti], color: e.target.value };
                      update({ ...chip, [p + "thresholds"]: arr });
                    }}
                  />
                  <button
                    type="button"
                    class="ring-threshold-del"
                    title="Remove"
                    @click=${() => {
                      const arr = [...thresholds];
                      arr.splice(ti, 1);
                      update({
                        ...chip,
                        [p + "thresholds"]: arr.length ? arr : undefined,
                      });
                    }}
                  >
                    <ha-icon
                      icon="mdi:close"
                      style="--mdc-icon-size:14px"
                    ></ha-icon>
                  </button>
                </div>`,
            )}
            <button
              type="button"
              class="ring-threshold-add"
              @click=${() => {
                const arr = [...thresholds, { value: "", color: "#ff9800" }];
                update({ ...chip, [p + "thresholds"]: arr });
              }}
            >
              <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
              Add threshold
            </button>
          </div>
        </details>`;
    };
    const GAUGE_SUFFIXES = [
      "min",
      "max",
      "color",
      "thresholds",
      "threshold_mode",
    ];
    const ringSection = html`<div
        class="segmented"
        role="radiogroup"
        aria-label="Chip type"
      >
        ${[
          { value: "", label: "Default" },
          { value: "ring", label: "Ring" },
          { value: "bar", label: "Bar" },
        ].map(
          (o) =>
            html`<button
              type="button"
              role="radio"
              class=${chipType === o.value ? "active" : ""}
              @click=${() => {
                const n = { ...chip };
                const prev = chipType;
                if (o.value) n.type = o.value;
                else delete n.type;
                if (prev && o.value && prev !== o.value) {
                  for (const s of GAUGE_SUFFIXES) {
                    const src = prev + "_" + s,
                      dst = o.value + "_" + s;
                    if (n[src] !== undefined && n[dst] === undefined)
                      n[dst] = n[src];
                  }
                }
                update(n);
              }}
            >
              ${o.label}
            </button>`,
        )}
      </div>
      ${chipType === "ring" ? gaugeFields("ring") : ""}
      ${chipType === "bar" ? gaugeFields("bar") : ""}`;
    /* ── Position accordion ── */
    const ANCHORS = [
      "top-left",
      "top-center",
      "top-right",
      "left",
      "center",
      "right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];
    const currentAnchor = chip.position_anchor || "top-left";
    const positionSection = html`<div class="toggle-group">
        <label class="toggle-row">
          <span>Free positioning</span>
          <ha-switch
            .checked=${isFree}
            @change=${(e) => {
              const n = { ...chip };
              if (e.target.checked) {
                n.position = "custom";
                if (!n.position_anchor) n.position_anchor = "top-left";
              } else {
                [
                  "position",
                  "position_anchor",
                  "position_x",
                  "position_y",
                ].forEach((k) => delete n[k]);
              }
              update(n);
            }}
          ></ha-switch
        ></label>
        <label class="toggle-row">
          <span>Behind animations</span>
          <ha-switch
            .checked=${chip.behind_effects === true}
            @change=${(e) => {
              const n = { ...chip };
              if (e.target.checked) n.behind_effects = true;
              else delete n.behind_effects;
              update(n);
            }}
          ></ha-switch
        ></label>
      </div>
      ${isFree
        ? html`<div>
            <div class="free-pos-layout">
              <div>
                <div class="settings-group-label">Position</div>
                <div
                  class="anchor-grid"
                  role="radiogroup"
                  aria-label="Position"
                >
                  ${ANCHORS.map(
                    (v) =>
                      html`<button
                        type="button"
                        role="radio"
                        class="anchor-cell ${currentAnchor === v
                          ? "active"
                          : ""}"
                        title=${v}
                        aria-label=${v}
                        data-chip-idx=${idx}
                        data-anchor=${v}
                        @click=${this._onChipAnchorSelect}
                      ></button>`,
                  )}
                </div>
              </div>
              <div>
                <div class="settings-group-label">Offset</div>
                <div class="offset-fields">
                  <div class="offset-field">
                    <span class="offset-field-label">X</span>
                    <input
                      type="text"
                      placeholder="0"
                      .value=${String(chip.position_x || "")}
                      @change=${(e) => {
                        const n = { ...chip };
                        const v = e.target.value.trim();
                        if (v) n.position_x = v;
                        else delete n.position_x;
                        update(n);
                      }}
                    />
                  </div>
                  <div class="offset-field">
                    <span class="offset-field-label">Y</span>
                    <input
                      type="text"
                      placeholder="0"
                      .value=${String(chip.position_y || "")}
                      @change=${(e) => {
                        const n = { ...chip };
                        const v = e.target.value.trim();
                        if (v) n.position_y = v;
                        else delete n.position_y;
                        update(n);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> `
        : ""}`;
    /* ── Tap action accordion ── */
    const tapSection = html`${chipForm([
      { name: "tap_action", selector: { ui_action: {} } },
    ])}`;
    /* ── Forecast special box (outside accordions) ── */
    const forecastBox =
      isFc && !fcEntityMissing
        ? html`<div class="chip-forecast-box">
            <div class="chip-forecast-header">
              <ha-icon icon="mdi:weather-partly-cloudy"></ha-icon> Forecast
            </div>
            <div class="chip-forecast-body">
              <div
                class="segmented"
                role="radiogroup"
                aria-label="Forecast type"
              >
                ${[
                  { value: "daily", label: "Daily" },
                  { value: "hourly", label: "Hourly" },
                ].map(
                  (o) =>
                    html`<button
                      type="button"
                      role="radio"
                      class=${chip.forecast === o.value ? "active" : ""}
                      data-chip-idx=${idx}
                      data-forecast-type=${o.value}
                      @click=${this._onChipForecastTypeSelect}
                    >
                      ${o.label}
                    </button>`,
                )}
              </div>
              ${(() => {
                const fcMax = chip.forecast === "hourly" ? 23 : 6;
                const fcLabel =
                  chip.forecast === "hourly" ? "Hours ahead" : "Days ahead";
                const fcHelper =
                  chip.forecast === "hourly"
                    ? fcOff === 0
                      ? "Now"
                      : `+${fcOff}h`
                    : fcOff === 0
                      ? "Today"
                      : fcOff === 1
                        ? "Tomorrow"
                        : `+${fcOff} days`;
                const pct = Math.round((fcOff / fcMax) * 100);
                return html`<div class="awc-slider">
                  <div class="awc-slider-head">
                    <span class="awc-slider-label">${fcLabel}</span>
                    <input
                      type="number"
                      class="awc-slider-num"
                      min="0"
                      max=${fcMax}
                      step="1"
                      .value=${String(fcOff)}
                      @change=${(e) => {
                        const v = Math.min(
                          fcMax,
                          Math.max(0, parseInt(e.target.value, 10) || 0),
                        );
                        const range = e.target
                          .closest(".awc-slider")
                          .querySelector(".awc-slider-range");
                        if (range) {
                          range.value = v;
                          range.style.setProperty(
                            "--awc-slider-pct",
                            Math.round((v / fcMax) * 100) + "%",
                          );
                        }
                        update({ ...chip, forecast_offset: v });
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    class="awc-slider-range"
                    min="0"
                    max=${fcMax}
                    step="1"
                    .value=${String(fcOff)}
                    style="--awc-slider-pct:${pct}%"
                    @input=${(e) => {
                      const v = parseInt(e.target.value, 10);
                      const p = Math.round((v / fcMax) * 100);
                      e.target.style.setProperty("--awc-slider-pct", p + "%");
                      const n = e.target
                        .closest(".awc-slider")
                        .querySelector(".awc-slider-num");
                      if (n) n.value = v;
                    }}
                    @change=${(e) =>
                      update({
                        ...chip,
                        forecast_offset: parseInt(e.target.value, 10),
                      })}
                  />
                  <div class="awc-slider-helper">${fcHelper}</div>
                </div>`;
              })()}
              <ha-form
                .hass=${this.hass}
                .data=${{ attribute: fcAttr }}
                .schema=${[
                  {
                    name: "attribute",
                    selector: {
                      select: { mode: "dropdown", options: FC_ATTRIBUTES },
                    },
                  },
                ]}
                .computeLabel=${() => "Show"}
                @value-changed=${(e) => {
                  e.stopPropagation();
                  const v =
                    e.detail && e.detail.value && e.detail.value.attribute;
                  if (v !== undefined) update({ ...chip, attribute: v });
                }}
              ></ha-form>
              ${fcAttr !== "condition" && !chip.hide_value
                ? html`${(() => {
                    const prec =
                      chip.forecast_precision !== undefined
                        ? chip.forecast_precision
                        : 1;
                    const pct = Math.round((prec / 2) * 100);
                    return html`<div class="awc-slider">
                      <div class="awc-slider-head">
                        <span class="awc-slider-label">Decimal places</span>
                        <input
                          type="number"
                          class="awc-slider-num"
                          min="0"
                          max="2"
                          step="1"
                          .value=${String(prec)}
                          @change=${(e) => {
                            const v = Math.min(
                              2,
                              Math.max(0, parseInt(e.target.value, 10) || 0),
                            );
                            const range = e.target
                              .closest(".awc-slider")
                              .querySelector(".awc-slider-range");
                            if (range) {
                              range.value = v;
                              range.style.setProperty(
                                "--awc-slider-pct",
                                Math.round((v / 2) * 100) + "%",
                              );
                            }
                            update({ ...chip, forecast_precision: v });
                          }}
                        />
                      </div>
                      <input
                        type="range"
                        class="awc-slider-range"
                        min="0"
                        max="2"
                        step="1"
                        .value=${String(prec)}
                        style="--awc-slider-pct:${pct}%"
                        @input=${(e) => {
                          const v = parseInt(e.target.value, 10);
                          const p = Math.round((v / 2) * 100);
                          e.target.style.setProperty(
                            "--awc-slider-pct",
                            p + "%",
                          );
                          const n = e.target
                            .closest(".awc-slider")
                            .querySelector(".awc-slider-num");
                          if (n) n.value = v;
                        }}
                        @change=${(e) =>
                          update({
                            ...chip,
                            forecast_precision: parseInt(e.target.value, 10),
                          })}
                      />
                    </div>`;
                  })()}`
                : ""}
            </div>
          </div>`
        : null;
    /* ── Style reset ── */
    const hasStyleOverrides = CHIP_STYLE_OVERRIDE_KEYS.some(
      (k) => chip[k] !== undefined && chip[k] !== "",
    );
    /* ── Assemble body ── */
    const body = html`${typePicker} ${entitySection} ${emptyNudge} ${fcWarning}
    ${forecastBox || ""}
    ${acc("ring", "mdi:circle-outline", "Type", ringSection)}
    ${acc("layout", "mdi:view-compact-outline", "Layout", layoutSection)}
    ${acc("text", "mdi:format-text", "Text", textSection)}
    ${acc("icon", "mdi:image-outline", "Icon", iconSection)}
    ${acc("position", "mdi:arrow-all", "Position", positionSection)}
    ${acc("tap", "mdi:gesture-tap", "Tap Action", tapSection)}
    ${hasStyleOverrides
      ? html`<button
          type="button"
          class="add-card-btn"
          style="border-style:solid;border-color:rgba(var(--rgb-error-color,211,47,47),0.35);color:var(--error-color);margin-top:var(--awc-e-s3)"
          data-chip-idx=${idx}
          data-action="reset-styles"
          @click=${this._onChipActionClick}
        >
          <ha-icon icon="mdi:restore"></ha-icon><span>Reset all styles</span>
        </button>`
      : ""}`;
    return this._renderListRow({
      idx,
      total,
      expanded,
      body,
      badge,
      title: this._chipTitle(chip),
      onToggle: () => this._toggleChipExpanded(idx),
      onMoveUp: () => this._moveChip(idx, -1),
      onMoveDown: () => this._moveChip(idx, 1),
      onDuplicate: () => this._duplicateChip(idx),
      onRemove: () => this._removeChip(idx),
    });
  }
  _parseColor(raw) {
    const s = (raw || "").toString().trim();
    const m = s.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i);
    if (m) {
      const hex = `#${parseInt(m[1]).toString(16).padStart(2, "0")}${parseInt(m[2]).toString(16).padStart(2, "0")}${parseInt(m[3]).toString(16).padStart(2, "0")}`;
      return {
        hex,
        opacity: m[4] !== undefined ? parseFloat(m[4]) : 1,
        hasColor: true,
      };
    }
    if (/^#[0-9a-f]{3,8}$/i.test(s))
      return { hex: s.slice(0, 7), opacity: 1, hasColor: true };
    return { hex: "#ffffff", opacity: 0, hasColor: false };
  }
  _serializeColor(hex, opacity) {
    if (opacity >= 1) return hex;
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${parseFloat(opacity.toFixed(2))})`;
  }
  _renderColorPicker(label, raw, onWrite) {
    const { hex, opacity, hasColor } = this._parseColor(raw);
    return html`<div class="chip-color-box">
      <div class="chip-color-row">
        <ha-icon
          icon="mdi:palette-outline"
          style="--mdc-icon-size:15px;color:var(--secondary-text-color);flex-shrink:0"
        ></ha-icon>
        <span class="chip-color-label">${label}</span>
        <input
          type="color"
          class="chip-color-swatch"
          .value=${hex}
          @input=${(e) => onWrite(e.target.value, opacity || 1)}
        />
        ${hasColor
          ? html`<button
              type="button"
              class="chip-color-clear"
              title="Clear color"
              @click=${() => onWrite("", 1)}
            >
              <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
            </button>`
          : ""}
      </div>
      ${hasColor
        ? html`<div class="chip-color-opacity-row">
            <span class="chip-color-opacity-label">Opacity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              class="chip-color-opacity"
              .value=${String(opacity)}
              @input=${(e) => onWrite(hex, parseFloat(e.target.value))}
            />
            <span class="chip-color-opacity-val"
              >${Math.round(opacity * 100)}%</span
            >
          </div> `
        : ""}
    </div>`;
  }
  _renderGlobalColorPicker(key, label) {
    const raw = (this._config[key] || "").toString().trim();
    return this._renderColorPicker(label, raw, (h, o) => {
      this._updateField(key, h ? this._serializeColor(h, o) : "");
    });
  }
  _renderSlider(field, label, min, max, step, helper) {
    const val =
        parseFloat(
          this._formData[field] != null ? this._formData[field] : min,
        ) || min,
      pct = Math.round(((val - min) / (max - min)) * 100);
    const onRange = (e) => {
      const v = parseFloat(e.target.value),
        p = Math.round(((v - min) / (max - min)) * 100);
      e.target.style.setProperty("--awc-slider-pct", p + "%");
      const numInput = e.target
        .closest(".awc-slider")
        .querySelector(".awc-slider-num");
      if (numInput) numInput.value = v;
    };
    const onCommit = (e) =>
      this._updateField(field, parseFloat(e.target.value));
    const onNumInput = (e) => {
      const v = Math.min(max, Math.max(min, parseFloat(e.target.value) || min));
      const range = e.target
        .closest(".awc-slider")
        .querySelector(".awc-slider-range");
      if (range) {
        range.value = v;
        const p = Math.round(((v - min) / (max - min)) * 100);
        range.style.setProperty("--awc-slider-pct", p + "%");
      }
      this._updateField(field, v);
    };
    return html`<div class="awc-slider">
      <div class="awc-slider-head">
        <span class="awc-slider-label">${label}</span>
        <input
          type="number"
          class="awc-slider-num"
          min=${min}
          max=${max}
          step=${step}
          .value=${String(val)}
          @change=${onNumInput}
        />
      </div>
      <input
        type="range"
        class="awc-slider-range"
        min=${min}
        max=${max}
        step=${step}
        .value=${String(val)}
        style="--awc-slider-pct:${pct}%"
        @input=${onRange}
        @change=${onCommit}
      />
      ${helper ? html`<div class="awc-slider-helper">${helper}</div>` : ""}
    </div>`;
  }
  _renderCompactField(field, placeholder) {
    const current = String(this._formData[field] || ""),
      label = LABELS[field] || field;
    const isCardHeight = field === "card_height";
    const hasError = isCardHeight && !!this._cardHeightError;
    return html`<div class="compact-field ${hasError ? "invalid" : ""}">
      <span class="compact-field-label">${label}</span>
      <input
        type="text"
        placeholder=${placeholder}
        data-field=${field}
        .value=${current}
        @change=${this._onRawFieldChange}
      />
      ${hasError
        ? html`<div class="compact-field-hint error">
            ${this._cardHeightError}
          </div>`
        : ""}
    </div>`;
  }
  _renderChipsEditor() {
    const c = this._formData,
      list = this._getChips();
    let layout = (c.chip_area_layout || "wrap").toString().toLowerCase();
    const isGrid = layout === "grid";
    const isScroll =
      layout === "horizontal-scroll" || layout === "vertical-scroll";
    const align = (c.chip_area_align || "start").toString().toLowerCase();
    const chipFormat = (c.chip_style || "inline").toString().toLowerCase();
    const bgStyle = c.card_background_style || "frosted",
      bgActive = !!c.chip_area_background;
    const sf = (key, label, placeholder) =>
      html`<div class="css-field">
        <span class="css-field-label">${label}</span>
        <input
          type="text"
          placeholder=${placeholder}
          data-field=${key}
          .value=${String(c[key] || "")}
          @change=${this._onRawFieldChange}
        />
      </div>`;
    const containerContent = html`<div class="settings-group">
        <div class="section-title">Position &amp; Size</div>
        <div style="display:flex;gap:var(--awc-e-s3);align-items:flex-start">
          ${this._renderPositionGrid(
            "chip_area_position",
            POSITION_GRIDS.chip_area_position,
          )}
          <div
            style="display:flex;flex-direction:column;gap:var(--awc-e-s2);align-self:center;flex:1;min-width:0"
          >
            <div class="css-field">
              <span class="css-field-label">${LABELS.chip_area_width}</span>
              <input
                type="text"
                placeholder="auto"
                data-field="chip_area_width"
                .value=${String(c.chip_area_width || "")}
                @change=${this._onRawFieldChange}
              />
            </div>
            <div class="css-field">
              <span class="css-field-label">${LABELS.chip_area_height}</span>
              <input
                type="text"
                placeholder="auto"
                data-field="chip_area_height"
                .value=${String(c.chip_area_height || "")}
                @change=${this._onRawFieldChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div class="settings-group">
        <div class="section-title">Layout</div>
        <div class="segmented" role="radiogroup" aria-label="Layout">
          ${OPT.chip_area_layout.map(
            (o) =>
              html`<button
                type="button"
                role="radio"
                class=${layout === o.value ? "active" : ""}
                data-field="chip_area_layout"
                data-value=${o.value}
                @click=${this._onSegmentedFieldSelect}
              >
                ${o.label}
              </button>`,
          )}
        </div>
        ${isGrid
          ? this._renderSlider(
              "chip_area_columns",
              LABELS.chip_area_columns,
              1,
              12,
              1,
            )
          : ""}
        ${isScroll
          ? this._renderSlider(
              "chip_area_scroll_count",
              LABELS.chip_area_scroll_count,
              1,
              10,
              1,
            )
          : ""}
      </div>
      <div class="settings-group">
        <div class="section-title">Arrangement</div>
        <div class="field-group">
          ${this._renderToggleGroup([
            { key: "chip_area_grouped", label: LABELS.chip_area_grouped },
            ...(isScroll
              ? [
                  {
                    key: "chip_area_full_width",
                    label: LABELS.chip_area_full_width,
                  },
                ]
              : []),
          ])}
          ${c.chip_area_grouped === true
            ? this._renderToggleGroup([
                {
                  key: "chip_area_separator",
                  label: LABELS.chip_area_separator,
                },
              ])
            : ""}
          <div class="css-field-row cols-2">
            ${sf("chip_area_gap", LABELS.chip_area_gap, "8px")}
            ${sf("chip_area_padding", LABELS.chip_area_padding, "0")}
          </div>
        </div>
      </div>
      ${c.chip_area_grouped === true && c.chip_area_background === true
        ? html`
            <div class="settings-group">
              <div class="section-title">Container Color</div>
              ${this._renderGlobalColorPicker(
                "chip_area_background_color",
                "Container background color",
              )}
            </div>
          `
        : ""}`;
    const chipsContent = html`<div class="settings-group">
        <div class="section-title">Chip Layout</div>
        <div class="segmented" role="radiogroup" aria-label="Chip style">
          ${[
            { value: "inline", label: "Inline" },
            { value: "stacked", label: "Stacked" },
            { value: "vertical", label: "Vertical" },
          ].map(
            (o) =>
              html`<button
                type="button"
                role="radio"
                class=${chipFormat === o.value ? "active" : ""}
                data-field="chip_style"
                data-value=${o.value}
                @click=${this._onSegmentedFieldSelect}
              >
                ${o.label}
              </button>`,
          )}
        </div>
      </div>
      <div class="settings-group">
        <div class="settings-group-label">Content Alignment</div>
        <div
          class="segmented"
          role="radiogroup"
          aria-label="Chip content alignment"
          style="flex-wrap:nowrap"
        >
          ${OPT.chip_area_align.map(
            (o) =>
              html`<button
                type="button"
                role="radio"
                class=${align === o.value ? "active" : ""}
                data-field="chip_area_align"
                data-value=${o.value}
                @click=${this._onSegmentedFieldSelect}
              >
                ${o.label}
              </button>`,
          )}
        </div>
      </div>
      <div class="settings-group">
        <div class="section-title">Background</div>
        <div class="settings-group-label">Chip background</div>
        <div class="segmented" role="radiogroup" aria-label="Background">
          <button
            type="button"
            role="radio"
            class=${!bgActive ? "active" : ""}
            data-bg-mode="off"
            @click=${this._onChipAreaBackgroundModeSelect}
          >
            Off
          </button>
          ${[
            { value: "frosted", label: "Frosted" },
            { value: "contrast", label: "Contrast" },
            { value: "theme", label: "Theme" },
          ].map(
            (o) =>
              html`<button
                type="button"
                role="radio"
                class=${bgActive && bgStyle === o.value ? "active" : ""}
                data-bg-mode=${o.value}
                @click=${this._onChipAreaBackgroundModeSelect}
              >
                ${o.label}
              </button>`,
          )}
        </div>
        <div class="settings-group-label">Icon background</div>
        <div
          class="segmented"
          role="radiogroup"
          aria-label=${LABELS.chip_icon_background}
        >
          ${[
            { value: undefined, label: "Default" },
            { value: true, label: "On" },
            { value: false, label: "Off" },
          ].map(
            (o) =>
              html`<button
                type="button"
                role="radio"
                class=${c.chip_icon_background === o.value ||
                (o.value === undefined && c.chip_icon_background === undefined)
                  ? "active"
                  : ""}
                data-field="chip_icon_background"
                data-value=${o.value === undefined ? "" : String(o.value)}
                data-value-type=${o.value === undefined ? "empty" : "boolean"}
                @click=${this._onSegmentedFieldSelect}
              >
                ${o.label}
              </button>`,
          )}
        </div>
        <div class="settings-group-label">Custom colors</div>
        ${this._renderGlobalColorPicker(
          "chip_background_color",
          "Background color (all chips)",
        )}
        ${this._renderGlobalColorPicker(
          "chip_icon_background_color",
          "Icon background color (all chips)",
        )}
      </div>
      <div class="settings-group">
        <div class="section-title">Dimensions</div>
        <div class="css-field-row cols-2">
          ${sf("chip_text_size", LABELS.chip_text_size, "auto")}
          ${sf("chip_label_size", LABELS.chip_label_size, "auto")}
        </div>
        <div class="css-field-row cols-2">
          ${sf("chip_icon_size", LABELS.chip_icon_size, "auto")}
          ${sf("chip_icon_padding", LABELS.chip_icon_padding, "auto")}
        </div>
        <div class="css-field-row cols-2">
          ${sf("chip_gap", LABELS.chip_gap, "6px")}
          ${sf("chip_text_gap", LABELS.chip_text_gap, "0.35em")}
        </div>
        <div class="css-field-row cols-2">
          ${sf("chip_padding", LABELS.chip_padding, "auto")}
        </div>
      </div>`;
    return html` <div class="sensor-list">
        ${list.map((chip, idx) => this._renderChipRow(chip, idx, list.length))}
      </div>
      <button type="button" class="add-chip-btn" @click=${this._addChip}>
        <ha-icon icon="mdi:plus"></ha-icon> <span>Add chip</span>
      </button>
      ${this._renderDisclosure("Chip Area Settings", containerContent)}
      ${this._renderDisclosure("Chip Style Settings", chipsContent)}
      <div
        class="fc-box"
        style="background:rgba(var(--rgb-primary-text-color,0,0,0),0.03)"
      >
        <div
          style="display:flex;align-items:center;gap:var(--awc-e-s2);font-size:var(--awc-e-f-meta);color:var(--secondary-text-color)"
        >
          <ha-icon
            icon="mdi:lightbulb-outline"
            style="--mdc-icon-size:16px;flex-shrink:0"
          ></ha-icon>
          <span
            >SVG icons:
            <a
              href="https://github.com/shpongledsummer/atmo-weather-card#weather-icons"
              target="_blank"
              rel="noopener"
              style="color:var(--primary-color)"
              >How to add them</a
            ></span
          >
        </div>
      </div>`;
  }
  _renderPerformancePanel() {
    const PRESETS = {
      low: {
        perf_fps: 24,
        perf_cloud_quality: 0.5,
        perf_effects: 0,
        perf_fauna: 0,
        perf_dpr: 1.0,
        animation_speed: 1.0,
        bird_animation_speed: 1.0,
        star_animation_speed: 1.0,
        fauna_bird_density: 0.5,
        fauna_plane_density: 0.5,
        fauna_bird_flock_size: 4,
        fauna_birds_at_night: true,
      },
      default: {
        perf_fps: 30,
        perf_cloud_quality: 1.5,
        perf_effects: 1,
        perf_fauna: 2,
        perf_dpr: 2.0,
        animation_speed: 1.0,
        bird_animation_speed: 1.0,
        star_animation_speed: 1.0,
        fauna_bird_density: 1.0,
        fauna_plane_density: 1.0,
        fauna_bird_flock_size: 8,
        fauna_birds_at_night: true,
      },
      ultra: {
        perf_fps: 60,
        perf_cloud_quality: 2.0,
        perf_effects: 2,
        perf_fauna: 2,
        perf_dpr: 2.0,
        animation_speed: 1.0,
        bird_animation_speed: 1.0,
        star_animation_speed: 1.0,
        fauna_bird_density: 1.5,
        fauna_plane_density: 1.5,
        fauna_bird_flock_size: 12,
        fauna_birds_at_night: true,
      },
    };
    const keys = [
      "perf_fps",
      "animation_speed",
      "bird_animation_speed",
      "star_animation_speed",
      "perf_cloud_quality",
      "perf_effects",
      "perf_fauna",
      "perf_dpr",
      "fauna_bird_density",
      "fauna_plane_density",
      "fauna_bird_flock_size",
      "fauna_birds_at_night",
    ];
    const cfg = this._config || {};
    const presetName =
      typeof cfg.perf_mode === "string" && PRESETS[cfg.perf_mode]
        ? cfg.perf_mode
        : "default";
    const activePreset = PRESETS[presetName];
    const val = (k) => {
      const raw = cfg[k] !== undefined ? cfg[k] : activePreset[k];
      const num = typeof raw === "number" ? raw : parseFloat(raw);
      return Number.isFinite(num) ? num : activePreset[k];
    };
    const matched =
      ["low", "default", "ultra"].find((p) =>
        keys.every((k) => val(k) === PRESETS[p][k]),
      ) || "custom";
    const onPreset = (name) => {
      const p = PRESETS[name],
        changes = {};
      for (const k of keys) changes[k] = p[k];
      changes.perf_mode = name;
      this._patch(changes);
    };
    const DESCS = {
      perf_fps: {
        24: "Battery saver",
        30: "Balanced",
        45: "Smoother",
        60: "Maximum smoothness",
      },
      perf_cloud_quality: {
        0.5: "Simple clouds",
        1: "Moderate detail",
        1.5: "Detailed clouds",
        2: "Maximum detail",
      },
      perf_effects: {
        0: "No weather effects",
        1: "Rain, snow, lightning, stars",
        2: "Extra shooting stars and comets",
      },
      perf_fauna: {
        0: "No fauna",
        1: "Birds only",
        2: "Birds and planes",
      },
      perf_dpr: {
        0.5: "Low resolution",
        1: "Standard resolution",
        1.5: "Sharp rendering",
        2: "Native resolution",
      },
    };
    const perfButtons = (field, label, options) => {
      const v = val(field);
      const desc = (DESCS[field] && DESCS[field][v]) || "";
      return html`<div class="settings-group">
        <div class="settings-group-label">${label}</div>
        <div class="segmented" role="radiogroup" aria-label=${label}>
          ${options.map(
            (o) =>
              html`<button
                type="button"
                role="radio"
                class=${v === o.value ? "active" : ""}
                data-field=${field}
                data-value=${String(o.value)}
                data-value-type="number"
                @click=${this._onSegmentedFieldSelect}
              >
                ${o.label}
              </button>`,
          )}
        </div>
        ${desc ? html`<div class="composite-helper">${desc}</div>` : ""}
      </div>`;
    };
    return html`<div class="grid-picker">
        <div class="grid-picker-label">${LABELS.perf_mode}</div>
        <div class="segmented">
          ${[
            { v: "low", l: "Low" },
            { v: "default", l: "Default" },
            { v: "ultra", l: "Ultra" },
          ].map(
            (o) =>
              html`<button
                type="button"
                class=${matched === o.v ? "active" : ""}
                @click=${() => onPreset(o.v)}
              >
                ${o.l}
              </button>`,
          )}
        </div>
      </div>
      ${this._renderDisclosure(
        "Advanced Settings",
        html`
          ${perfButtons("perf_fps", LABELS.perf_fps, [
            { value: 24, label: "24" },
            { value: 30, label: "30" },
            { value: 45, label: "45" },
            { value: 60, label: "60" },
          ])}
          ${this._renderSlider(
            "animation_speed",
            LABELS.animation_speed,
            0.0,
            3.0,
            0.1,
          )}
          ${this._renderSlider(
            "bird_animation_speed",
            LABELS.bird_animation_speed,
            0.0,
            3.0,
            0.1,
          )}
          ${this._renderSlider(
            "star_animation_speed",
            LABELS.star_animation_speed,
            0.0,
            2.0,
            0.1,
          )}
          ${perfButtons("perf_cloud_quality", LABELS.perf_cloud_quality, [
            { value: 0.5, label: "Low" },
            { value: 1, label: "Medium" },
            { value: 1.5, label: "High" },
            { value: 2, label: "Ultra" },
          ])}
          ${perfButtons("perf_effects", LABELS.perf_effects, [
            { value: 0, label: "Off" },
            { value: 1, label: "Default" },
            { value: 2, label: "Ultra" },
          ])}
          ${perfButtons("perf_fauna", LABELS.perf_fauna, [
            { value: 0, label: "Off" },
            { value: 1, label: "Birds" },
            { value: 2, label: "All" },
          ])}
          ${perfButtons("perf_dpr", LABELS.perf_dpr, [
            { value: 0.5, label: "Low" },
            { value: 1, label: "Medium" },
            { value: 1.5, label: "High" },
            { value: 2, label: "Full" },
          ])}
          <div
            class="settings-group"
            style="margin-top: var(--awc-e-s4); padding-top: var(--awc-e-s4); border-top: 1px solid var(--divider-color);"
          >
            <div class="settings-group-label">🦅 Fauna Customization</div>
            ${this._renderSlider(
              "fauna_bird_density",
              "Bird spawn rate",
              0.5,
              2.0,
              0.1,
            )}
            ${this._renderSlider(
              "fauna_plane_density",
              "Plane spawn rate",
              0.5,
              2.0,
              0.1,
            )}
            ${this._renderSlider(
              "fauna_bird_flock_size",
              "Birds per flock",
              1,
              20,
              1,
            )}
            ${this._renderToggleGroup([
              {
                key: "fauna_birds_at_night",
                label: "Birds at night",
              },
            ])}
          </div>
        `,
      )}`;
  }
  render() {
    if (!this.hass || !this._config) return html``;
    const c = this._formData;
    return html`${this._renderForm([
        { name: "weather_entity", selector: { entity: { domain: "weather" } } },
      ])}
      <ha-expansion-panel
        outlined
        data-panel="sun_moon"
        .expanded=${this._openPanel === "sun_moon"}
        @expanded-changed=${this._onPanelExpandedChanged}
      >
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:theme-light-dark"></ha-icon>
          <span>Sun &amp; Moon</span>
        </div>
        ${this._renderForm([
          {
            type: "grid",
            name: "",
            schema: [
              { name: "sun_entity", selector: { entity: { domain: "sun" } } },
              {
                name: "moon_phase_entity",
                selector: { entity: { domain: "sensor" } },
              },
            ],
          },
        ])}
        ${this._renderDisclosure(
          "Position & Size",
          (() => {
            const mode = this._formData.celestial_position || "fixed";
            return html` ${this._renderForm([
              {
                name: "celestial_position",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: [
                      { value: "fixed", label: "Fixed Sun & Moon" },
                      { value: "dynamic_sun", label: "Dynamic Sun" },
                      { value: "dynamic_both", label: "Dynamic Sun & Moon" },
                    ],
                  },
                },
              },
            ])}
            ${mode === "fixed" || mode === "dynamic_sun"
              ? html`<div class="field-group">
                  ${this._renderPositionGrid(
                    "celestial_alignment",
                    POSITION_GRIDS.celestial_alignment,
                  )}
                  ${this._renderCelestialOffsetPicker()}
                </div> `
              : ""}
            ${this._renderSlider(
              "celestial_size",
              LABELS.celestial_size,
              20,
              200,
              1,
            )}`;
          })(),
        )}
        ${this._renderDisclosure(
          "Moon Style",
          this._renderForm([
            {
              name: "celestial_moon_style",
              selector: {
                select: { mode: "dropdown", options: OPT.celestial_moon_style },
              },
            },
          ]),
        )}</ha-expansion-panel
      >
      <ha-expansion-panel
        outlined
        data-panel="color_mode"
        .expanded=${this._openPanel === "color_mode"}
        @expanded-changed=${this._onPanelExpandedChanged}
      >
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:palette-outline"></ha-icon>
          <span>Color Mode</span>
        </div>
        ${this._renderForm(this._colorModeSchema())}
        ${this._renderDisclosure(
          "Advanced options",
          this._renderForm([
            {
              name: "card_filter",
              selector: {
                select: { mode: "dropdown", options: OPT.card_filter },
              },
            },
          ]),
        )}</ha-expansion-panel
      >
      <ha-expansion-panel
        outlined
        data-panel="layout"
        .expanded=${this._openPanel === "layout"}
        @expanded-changed=${this._onPanelExpandedChanged}
      >
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:page-layout-body"></ha-icon>
          <span>Card Style</span>
        </div>
        ${this._renderCardStyleSegmented()}
        ${this._renderDisclosure(
          "Advanced options",
          html`${this._renderToggleGroup([
            { key: "card_hide_text", label: LABELS.card_hide_text },
            { key: "card_square", label: LABELS.card_square },
            ...(!((this._formData.card_style || "") === "standalone")
              ? [
                  { key: "card_full_width", label: LABELS.card_full_width },
                  {
                    key: "card_mask_vertical",
                    label: LABELS.card_mask_vertical,
                  },
                  {
                    key: "card_mask_horizontal",
                    label: LABELS.card_mask_horizontal,
                  },
                ]
              : []),
          ])}
          ${this._renderSlider(
            "card_stack_order",
            LABELS.card_stack_order,
            -10,
            10,
            1,
            HELPERS.card_stack_order,
          )}
          ${this._renderOffsetPicker()}`,
        )}</ha-expansion-panel
      >
      <ha-expansion-panel
        outlined
        data-panel="text"
        .expanded=${this._openPanel === "text"}
        @expanded-changed=${this._onPanelExpandedChanged}
      >
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:layers-outline"></ha-icon>
          <span>Overlays</span>
        </div>
        ${c.card_hide_text === true
          ? html`<div class="info inline-action">
              <span
                >Chips are hidden by <b>Hide All Text</b> in Card Style →
                Advanced options. Your settings are preserved.</span
              >
              <button
                type="button"
                class="inline-action-btn"
                data-field="card_hide_text"
                @click=${this._onClearFieldClick}
              >
                Show again
              </button>
            </div>`
          : html`${this._renderDisclosure("Chips", this._renderChipsEditor())}`}
        ${this._renderDisclosure(
          "Image",
          html`<div class="settings-group">
              ${this._renderClearableText("image_day")}
              ${this._renderClearableText("image_night")}
            </div>
            ${this._renderSlider(
              "image_scale",
              LABELS.image_scale,
              0,
              200,
              1,
              HELPERS.image_scale,
            )}
            ${this._renderPositionGrid(
              "image_alignment",
              POSITION_GRIDS.image_alignment,
            )}
            ${this._renderImageOffsetPicker()}
            ${this._renderDisclosure(
              "Status Override",
              this._renderForm(this._imageStatusSchema()),
            )}`,
        )}
        ${this._renderDisclosure(
          "Cards",
          html`<div class="info">
              Add any Home Assistant card here. You can also use grids or stacks
              if you need a specific layout.
            </div>
            ${this._renderPositionGrid(
              "custom_cards_position",
              POSITION_GRIDS.custom_cards_position,
            )}
            ${this._renderClearableText("custom_cards_css_class")}
            ${this._renderCustomCardsEditor()}`,
        )}</ha-expansion-panel
      >
      <ha-expansion-panel
        outlined
        .expanded=${this._openPanel === "performance"}
        @expanded-changed=${(e) =>
          this._onPanelToggle("performance", e.detail.expanded)}
      >
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:speedometer"></ha-icon>
          <span>Performance</span>
        </div>
        ${this._renderPerformancePanel()}</ha-expansion-panel
      >
      <ha-expansion-panel
        outlined
        .expanded=${this._openPanel === "card_tap_action"}
        @expanded-changed=${(e) =>
          this._onPanelToggle("card_tap_action", e.detail.expanded)}
      >
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:gesture-tap"></ha-icon>
          <span>Tap Action</span>
        </div>
        ${this._renderForm([
          { name: "card_tap_action", selector: { ui_action: {} } },
        ])}</ha-expansion-panel
      >`;
  }
}
if (!customElements.get("atmo-weather-card-editor")) {
  customElements.define(
    "atmo-weather-card-editor",
    AtmosphericWeatherCardEditor,
  );
}
