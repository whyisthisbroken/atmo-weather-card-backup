[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=flat-square)](https://github.com/hacs/integration)
![Contains](https://img.shields.io/badge/Contains-★_Shooting_Stars-333?style=flat-square)

## Atmospheric Weather Card

A detail-oriented weather and forecast card.

> **Heads up:** The animated background runs on GLSL shaders. They are light, but old GPUs and wall tablets may still struggle. If yours does, there are lighter options like [weather images](#performance) and [simple backgrounds](#simple-backgrounds).

<br>

## Contents

**Getting Started** · [Installation](#installation) · [Setup](#setup) · [Examples](#examples)

**Customization** · [Appearance](#appearance) · [CSS Variables](#css-variables)

**Guides** · [Buttons](#buttons) · [Font](#font-family) · [Icons](#weather-icons)

**Reference** · [Color Mode](#color-mode) · [Simple Backgrounds](#simple-backgrounds) · [Performance](#performance)

<br>

> **Note on AI use:** Getting a design to look right takes a lot of time, so I use AI in this project for the tedious stuff, fixing bugs, and helping with the trial and error of new ideas. I hope the card shows that everything here is built with code I actually have full experience with.

<br>

## Installation

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=shpongledsummer&repository=atmospheric-weather-card&category=plugin)

<details>
<summary><b>Method 1 — HACS (Recommended)</b></summary>

<br>

1. Open **HACS** in Home Assistant.
2. Navigate to the **Frontend** section.
3. Click the **Explore & Download Repositories** button (or the `+` icon).
4. Search for **Atmospheric Weather Card**.
5. Click **Download**.
6. Reload your dashboard.

</details>

<details>
<summary><b>Method 2 — Manual</b></summary>

<br>

[![Open your Home Assistant instance and navigate to your lovelace resources.](https://my.home-assistant.io/badges/lovelace_resources.svg)](https://my.home-assistant.io/redirect/lovelace_resources/)

1. Download `atmospheric-weather-card.js` from the latest release.
2. Place the file in your `config/www/` folder.
3. Navigate to **Settings** → **Dashboards** → **⋮** → **Resources**.
4. Add a new resource:
    * **URL:** `/local/atmospheric-weather-card.js`
    * **Type:** JavaScript Module
5. Hard-refresh your browser.

</details>

<br>

## Setup

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`weather_entity`** | `string` | — | **Required.** Your weather integration entity (e.g., `weather.your_weather_entity`). This drives the background animation and the forecast data. |
| **`sun_entity`** | `string` | — | **Required.** Tracks the sun to switch between day and night. Without it, the card stays in permanent day. |

> [!IMPORTANT]
> When you add the card it comes with a small default layout already set up: the temperature, a UV ring, and today's high and low. Everything on top of the background is built from [buttons](#buttons), so you can change, remove, or add to that starting point until the card shows exactly what you want.

<br>

## Examples

The card is flexible, so these are starting points rather than fixed designs. You can change anything, mix elements, and combine the card with other Home Assistant cards. To get the exact look from the screenshots, add the [font](#font-family) and the [weather icons](#weather-icons) using the guides.

<br>

<img width="400" alt="Screenshot_20260628-000448" src="https://github.com/user-attachments/assets/79dfe1de-90d0-4516-a3e0-12a343f23de9" />

<details>
<summary><b>Default Card</b></summary>

<br>

A compact card with the temperature in the top-left, a forecast ring on the right, and today's high and low along the bottom.

```yaml
type: custom:atmospheric-weather-card
weather_entity: weather.your_weather_entity
sun_entity: sun.sun
theme_entity: sun.sun
card_height: 130px
card_offset: 0px 0px 24px 0px
bottom_fade: false
grid_options:
  rows: auto
button_areas:
  - position: top-left
    layout: wrap
    padding: 0px 4px
    gap: 0px
    background: true
    button_style: stacked
    button_icon_size: 26px
    button_padding: 12px 0px
    button_text_size: 14px
    align: center
    buttons:
      - entity: sensor.your_temperature
        attribute: temperature
        text_size: 30px
        hide_icon: true
        hide_label: true
        background: false
        padding: 0px 4px
        value_weight: "700"
        text_gap: 8px
        style: inline
        fancy_unit: true
        unit_format: °C
  - position: right
    layout: grid
    padding: 0px 8px
    gap: 8px
    background: true
    button_style: stacked
    button_icon_size: 26px
    button_padding: 12px
    button_text_size: 14px
    align: center
    buttons:
      - entity: weather.your_weather_entity
        attribute: uv_index
        icon: weather
        icon_size: 34px
        hide_label: true
        hide_value: true
        style: inline
        type: ring
        ring_width: 4px
        ring_gap: 10px
        ring_max: "11"
        ring_threshold_mode: gradient
        padding: 14px
        ring_thresholds:
          - value: "0"
            color: rgba(128, 191, 172, 0.8)
          - value: "1"
            color: rgba(145, 199, 163, 0.8)
          - value: "2"
            color: rgba(163, 206, 155, 0.8)
          - value: "3"
            color: rgba(195, 214, 141, 0.8)
          - value: "4"
            color: rgba(224, 219, 129, 0.8)
          - value: "5"
            color: rgba(235, 198, 113, 0.8)
          - value: "6"
            color: rgba(235, 168, 103, 0.8)
          - value: "7"
            color: rgba(230, 138, 99, 0.8)
          - value: "8"
            color: rgba(219, 106, 99, 0.8)
          - value: "9"
            color: rgba(201, 79, 100, 0.8)
          - value: "10"
            color: rgba(168, 64, 115, 0.8)
  - position: bottom-left
    layout: grid
    padding: 0px
    gap: 8px
    background: true
    button_style: stacked
    button_icon_size: 26px
    button_padding: 12px
    button_text_size: 14px
    align: center
    buttons:
      - entity: weather.your_weather_entity
        forecast: daily
        attribute: temperature
        name: "Today: "
        name_format: ""
        forecast_precision: 0
        sub_value_attribute: templow
        sub_value_format: " –"
        sub_value_weight: "700"
        sub_value_size: 12px
        text_order: label,sub,value
        hide_icon: true
        text_size: 12px
        label_size: 12px
        label_weight: "500"
        value_weight: "700"
        text_gap: 5px
        inner_gap: 0px
        style: inline
        align: end
        padding: 8px 12px
```

</details>

<br>


<img width="400" alt="Screenshot_20260628-000733" src="https://github.com/user-attachments/assets/60005c82-1d06-4375-90ee-c9ae160794d4" />

<details>
<summary><b>Big Forecast Card</b></summary>

<br>

A taller card with a big temperature and a live subtext in the top-left, a UV ring in the top-right, today's high and low at the bottom, and a scrollable eight-hour forecast strip underneath.

```yaml
type: custom:atmospheric-weather-card
weather_entity: weather.your_weather_entity
sun_entity: sun.sun
theme_entity: sun.sun
card_height: 240px
card_padding: 16px
card_offset: 40px 0px 40px 0px
theme_adapt: false
bottom_fade: false
custom_cards_position: bottom-left
grid_options:
  rows: auto
button_areas:
  - position: top-left
    layout: wrap
    padding: 0 8px
    gap: 0px
    background: true
    button_style: vertical
    button_gap: 6px
    button_text_gap: 2px
    button_icon_size: 26px
    button_text_size: 14px
    button_label_size: 14px
    button_icon_background_color: rgba(255,255,255,0.55)
    stack_direction: vertical
    align: center
    buttons:
      - entity: sensor.your_temperature
        attribute: temperature
        text_size: 42px
        hide_icon: true
        hide_label: true
        background: false
        value_weight: "700"
        name_sensor: sensor.your_subtext
        unit_format: °
        align: start
  - position: top-right
    layout: grid
    padding: 4px
    gap: 8px
    background: true
    background_style: frosted
    button_style: stacked
    button_icon_size: 26px
    button_padding: 16px
    button_text_size: 14px
    align: center
    buttons:
      - entity: weather.your_weather_entity
        attribute: uv_index
        icon: weather
        icon_size: 28px
        hide_label: true
        hide_value: true
        style: inline
        type: ring
        ring_gap: 4px
        ring_width: 4px
        ring_max: "11"
  - position: bottom-left
    layout: wrap
    columns: 2
    padding: 0 0 10px 8px
    gap: 4px
    background: true
    button_style: inline
    button_gap: 0px
    button_text_gap: 6px
    button_icon_size: 26px
    button_text_size: 13px
    button_label_size: 13px
    button_icon_background_color: rgba(255,255,255,0.55)
    sub_value_size: 14px
    stack_direction: vertical
    align: start
    buttons:
      - entity: weather.your_weather_entity
        forecast: daily
        attribute: templow
        name: Heute
        unit_format: "° – "
        value_weight: "700"
        sub_value_attribute: temperature
        sub_value_weight: "700"
        sub_value_format: °
        hide_icon: true
        background: false
        align: start
      - entity: sensor.your_subtext
        name: "|"
        name_format: ""
        overflow: marquee
        value_weight: "500"
        hide_icon: true
        background: false
        align: start
  - position: bottom-left
    layout: horizontal-scroll
    scroll_count: 6
    padding: 16px 0px
    gap: 2px
    width: 100%
    background: true
    background_style: frosted
    grouped: true
    separator: true
    button_style: vertical
    button_gap: 10px
    button_text_gap: 4px
    button_icon_size: 24px
    button_text_size: 14px
    button_label_size: 10px
    button_icon_background_color: rgba(255,255,255,0.55)
    sub_value_size: 10px
    stack_direction: vertical
    align: center
    buttons:
      - entity: weather.your_weather_entity
        forecast: hourly
        forecast_offset: 0
        attribute: temperature
        sub_value_attribute: templow
        forecast_precision: 0
        unit_format: °
        icon: weather
      - entity: weather.your_weather_entity
        forecast: hourly
        forecast_offset: 1
        attribute: temperature
        sub_value_attribute: templow
        forecast_precision: 0
        unit_format: °
        icon: weather
      - entity: weather.your_weather_entity
        forecast: hourly
        forecast_offset: 2
        attribute: temperature
        sub_value_attribute: templow
        forecast_precision: 0
        unit_format: °
        icon: weather
      - entity: weather.your_weather_entity
        forecast: hourly
        forecast_offset: 3
        attribute: temperature
        sub_value_attribute: templow
        forecast_precision: 0
        unit_format: °
        icon: weather
      - entity: weather.your_weather_entity
        forecast: hourly
        forecast_offset: 4
        attribute: temperature
        sub_value_attribute: templow
        forecast_precision: 0
        unit_format: °
        icon: weather
      - entity: weather.your_weather_entity
        forecast: hourly
        forecast_offset: 5
        attribute: temperature
        sub_value_attribute: templow
        forecast_precision: 0
        unit_format: °
        icon: weather
      - entity: weather.your_weather_entity
        forecast: hourly
        forecast_offset: 6
        attribute: temperature
        sub_value_attribute: templow
        forecast_precision: 0
        unit_format: °
        icon: weather
      - entity: weather.your_weather_entity
        forecast: hourly
        forecast_offset: 7
        attribute: temperature
        sub_value_attribute: templow
        forecast_precision: 0
        unit_format: °
        icon: weather
```

</details>

<br>

<br>

## Appearance

The card has a visual editor for setting up layouts. All YAML settings are listed below.

<details>
<summary><b>All settings</b></summary>

<br>

<details>
<summary><strong>Card Layout</strong></summary>

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `card_height` | `number` · `string` | `200` | Height in pixels. Numbers are treated as px (e.g., `130` becomes `130px`). Set to `auto` to fill the available height in grid layouts. |
| `card_padding` | `string` | `16px` | Inner padding around the content. Accepts any CSS padding value (e.g., `8px`, `12px 20px`). |
| `card_offset` | `string` | — | Shifts the card using a CSS margin (e.g., `"-50px 0px 0px 0px"`). Useful when layering cards. |
| `card_tap_action` | `object` | — | A standard Home Assistant [tap action](https://www.home-assistant.io/dashboards/actions/) for the card background. |

</details>

<details>
<summary><strong>Background & Effects</strong></summary>

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `fx_detail` | `number` | `1` | Visual detail of the animation, from `0` to `1`. Lower values are lighter on the GPU but look simpler. Set to `0` to turn the shader off completely (see [Performance](#performance)). |
| `simple_background` | `boolean` | `false` | Replaces the animated shader with a lightweight CSS gradient that still changes with the weather and time of day. The shader is switched off. See [Simple Backgrounds](#simple-backgrounds). |
| `sun_effects` | `boolean` | `true` | Shows the sun rays during the day. Set to `false` to hide them. |
| `night_sky_effects` | `boolean` | `true` | Shows the stars at night. Set to `false` to hide them. |
| `bg_brightness` | `number` | `1` | Brightness multiplier for the background (e.g., `0.8` to darken, `1.2` to brighten). |
| `bg_saturation` | `number` | `1` | Color saturation multiplier for the background (e.g., `0` for grayscale, `1.5` for more vivid). |
| `bottom_fade` | `boolean` | `false` | Fades the bottom edge of the card so buttons at the bottom blend into the background. |
| `weather_image_path` | `string` | — | Folder of your own background images or videos, used instead of the animation. The shader is switched off. See [Performance](#performance). |
| `weather_image_path_night` | `string` | — | Optional separate folder used at night. Falls back to `weather_image_path` if empty. |

</details>

<details>
<summary><strong>Color Mode</strong></summary>

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `card_color_mode` | `string` | *auto* | Controls light/dark colors. By default the card follows your `theme_entity` (or the sun). Set to `light` or `dark` to lock it, or `ha_theme` to follow your Home Assistant theme. See [Color Mode](#color-mode). |
| `theme_entity` | `string` | — | Drives the light/dark colors from any entity's state. Commonly set to `sun.sun` so the card matches sunrise and sunset. See [Color Mode](#color-mode). |
| `theme_adapt` | `boolean` | `true` | Nudges the card's brightness when its day/night state doesn't match your dashboard's dark mode, so it blends in. Set to `false` to keep the card's own brightness no matter what the dashboard is doing. |

</details>

<details>
<summary><strong>Icons</strong></summary>

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `icon_set` | `string` | *default* | The style of the built-in animated weather icons. Set to `colored` for the colored version instead of the default single-color icons. |
| `icon_path` | `string` | — | A global folder for custom weather icons, used by any button with `icon: weather` that doesn't set its own `icon_path`. See [Weather Icons](#weather-icons). |

</details>

<details>
<summary><strong>Button Areas</strong></summary>

Buttons are placed inside one or more **areas**. Each area has a position on the card and its own row settings, and holds a list of buttons. You can have several areas at once, for example a temperature in the top-left and a forecast row along the bottom. For a walkthrough, see the [Buttons guide](#buttons).

```yaml
button_areas:
  - position: top-left
    buttons:
      - entity: weather.your_weather_entity
        attribute: temperature
  - position: bottom-left
    background: true
    buttons:
      - entity: sensor.outside_humidity
      - entity: sensor.wind_speed
```

<details>
<summary><strong>Area options</strong></summary>

These are set on each entry in the `button_areas` list.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `string` | `bottom-left` | Where the area sits on the card. Uses a 9-cell grid: `top-left`, `top-center`, `top-right`, `left`, `center`, `right`, `bottom-left`, `bottom-center`, `bottom-right`. |
| `buttons` | `list` | — | The buttons inside this area. Each entry is an object (see Per-button options below). |
| `layout` | `string` | `wrap` | How the buttons are arranged. `wrap` moves extra buttons to a new line, `horizontal-scroll` keeps them on one line with a hidden scrollbar, `vertical-scroll` stacks them in a scrollable column, `grid` arranges them in equal columns. |
| `columns` | `number` | `3` | Number of equal columns when `layout: grid` is used. |
| `scroll_count` | `number` | — | How many buttons are visible at once in a scroll layout. Enables snap-scrolling through pages. |
| `align` | `string` | `start` | How buttons align inside the area. Options: `start`, `center`, `end`, `spread`. |
| `gap` | `string` | — | Space between the buttons in this area. |
| `background` | `boolean` | `false` | Adds a styled background behind the buttons in this area. |
| `background_style` | `string` | `frosted` | Look of the area background when `background` is on. Options: `frosted`, `contrast`, `theme`. |
| `grouped` | `boolean` | `false` | Wraps the buttons into a single shared background instead of one per button. Requires `background: true`. |
| `separator` | `boolean` | `false` | Adds a thin divider line between buttons. Only shows when `grouped` is on. |
| `stack_direction` | `string` | — | When two areas share the same position, sets how they stack. Options: `vertical`, `horizontal`. |
| `hide` | `boolean` | `false` | Hides the whole area. |
| `button_style` | `string` | `inline` | Default layout for the buttons in this area. `inline` puts the icon and text side by side, `stacked` arranges them in a compact two-column block, `vertical` centers them in a column. |
| `button_background_color` | `string` | — | Background color applied to the buttons in this area. |
| `button_icon_background` | `boolean` | `false` | Adds a background behind the icon of each button in this area. |
| `button_icon_background_color` | `string` | — | Icon background color for the buttons in this area. |

</details>

<details>
<summary><strong>Per-button options</strong></summary>

Each entry in an area's `buttons` list accepts the following keys.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `entity` | `string` | — | **Required.** Any sensor, binary_sensor, or weather entity. Pointing it at the weather entity shows the current state (e.g., `Sunny`). |
| `attribute` | `string` | — | Read a specific attribute instead of the state (e.g., `humidity` on a weather entity). |
| `name` | `string` | — | Optional label shown with the value (e.g., `Wind`). For forecast buttons, this overrides the auto-generated day/time name. |
| `name_sensor` | `string` | — | An entity whose state is used as the button's label, updating live. |
| `name_attribute` | `string` | — | Reads a specific attribute from `name_sensor` instead of its state. |
| `name_format` | `string` | — | Text added after the name (e.g., `": "`). |
| `icon` | `string` | *auto* | An `mdi:` icon, the keyword `weather` to show the icon matching the current (or forecasted) condition, or empty to use the entity's own icon. |
| `icon_path` | `string` | — | Folder for custom weather icons. With `icon: weather`, the current state resolves to a file like `/local/weather-icons/rainy.svg`. See [Weather Icons](#weather-icons). |
| `unit_format` | `string` | — | Replaces the unit after the value, with no space. For example `°` turns `12 °C` into `12°`. |
| `fancy_unit` | `boolean` | `false` | Renders the temperature unit as a small superscript. Works on a `temperature` attribute from a weather entity. |
| `style` | `string` | — | Overrides the area's `button_style` for this button. Accepts `inline`, `stacked`, `vertical`. |
| `type` | `string` | — | Set to `ring` for a circular gauge or `bar` for a horizontal bar gauge. See the [Buttons guide](#buttons). |
| `width` | `string` | — | Limits the button width (e.g., `60%`, `200px`). Required for marquee overflow. |
| `height` | `string` | — | Sets the button height (e.g., `78px`). |
| `hide_icon` | `boolean` | `false` | Hides the icon. |
| `hide_label` | `boolean` | `false` | Hides the name label. |
| `hide_value` | `boolean` | `false` | Hides the value text. |
| `overflow` | `string` | `ellipsis` | How a value wider than `width` is handled. Options: `ellipsis`, `clip`, `wrap`, `marquee`. |
| `label_overflow` | `string` | `ellipsis` | Same options as `overflow`, applied to the name label. |
| `marquee_speed` | `number` | `30` | Scroll speed in pixels per second when `overflow: marquee` is used. Minimum `5`. |
| `marquee_rtl` | `boolean` | `false` | Reverses the marquee direction. |
| `tap_action` | `object` | `more-info` | A standard Home Assistant [tap action](https://www.home-assistant.io/dashboards/actions/) for this button. |
| `visibility` | `list` | — | Standard Home Assistant [visibility conditions](https://www.home-assistant.io/dashboards/conditional/#conditions). The button only shows when the conditions pass. |
| `forecast` | `string` | — | Set to `daily` or `hourly` to show forecast data. The name is generated automatically (day names or times). Requires a weather entity. |
| `forecast_offset` | `number` | `0` | Which forecast entry to show. `0` = today/now, `1` = tomorrow/next hour, and so on. |
| `forecast_precision` | `number` | `0` | Decimal places for forecast values. |

</details>

<details>
<summary><strong>Sub-value (second value)</strong></summary>

A button can show a second value next to or below the main one, useful for things like a high and low temperature in one button.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `sub_value_entity` | `string` | — | Entity for the second value. Defaults to the button's own `entity` if empty. |
| `sub_value_attribute` | `string` | — | Attribute to read for the second value (e.g., `templow`). |
| `sub_value_format` | `string` | — | Text added after the second value (e.g., `" –"`). |
| `sub_value_size` | `string` | — | Font size of the second value. |
| `sub_value_weight` | `string` | — | Font weight of the second value. |
| `sub_value_overflow` | `string` | — | Overflow handling for the second value. Same options as `overflow`. |
| `hide_sub_value` | `boolean` | `false` | Hides the second value. |

</details>

<details>
<summary><strong>Per-button style overrides</strong></summary>

Each button can override the area styles, so you can mix very different-looking buttons in one area.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `background` | `boolean` | — | Overrides the area's background for this button. |
| `background_color` | `string` | — | Custom background color, including `rgba()`. |
| `padding` | `string` | — | Inner padding for this button. |
| `text_size` | `string` | — | Value text size. |
| `label_size` | `string` | — | Name label text size. |
| `value_weight` | `string` | — | Font weight of the value (e.g., `600`, `700`). |
| `label_weight` | `string` | — | Font weight of the name label. |
| `inner_gap` | `string` | — | Gap between the icon and the text. |
| `text_gap` | `string` | — | Gap between the name and the value. |
| `icon_size` | `string` | — | Icon size. |
| `icon_padding` | `string` | — | Padding around the icon. |
| `icon_background` | `boolean` | — | Adds a background behind the icon. |
| `icon_background_color` | `string` | — | Icon background color. |
| `align` | `string` | — | Content alignment within the button. Options: `start`, `center`, `end`, `spread`. |
| `button_round` | `boolean` | `false` | Forces a fully rounded pill shape. |
| `element_order` | `string` | — | Order of the parts of a button, comma-separated (e.g., `icon,text,bar`). |
| `text_order` | `string` | — | Order of the text parts, comma-separated (e.g., `label,sub,value`). |

</details>

<details>
<summary><strong>Free positioning</strong></summary>

A button can be pulled out of its area and placed anywhere on the card.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `string` | — | Set to `custom` to detach the button from the area. |
| `position_anchor` | `string` | `top-left` | Anchor point on the same 9-cell grid as areas. |
| `position_x` | `string` | `0` | Horizontal offset (e.g., `20px`, `10%`). |
| `position_y` | `string` | `0` | Vertical offset (e.g., `20px`, `10%`). |

</details>

</details>

<details>
<summary><strong>Custom Images</strong></summary>

You can add your own images, such as a picture of your house, on top of the background.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `image_day` | `string` | — | File path for the daytime image (e.g., `/local/house-day.png`). |
| `image_night` | `string` | — | File path for the nighttime image. Falls back to the day image if empty. |
| `image_scale` | `number` | `100` | Image size as a percentage of the card height. |
| `image_alignment` | `string` | `top-right` | Image placement. Options: `center`, `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`. |
| `image_x` | `string` | — | Horizontal offset from the anchored position. |
| `image_y` | `string` | — | Vertical offset from the anchored position. |
| `status_entity` | `string` | — | An entity to watch. When it is active, the card swaps to the status images below. |
| `status_day` | `string` | — | Day image shown while the status entity is active. |
| `status_night` | `string` | — | Night image shown while the status entity is active. |

</details>

<details>
<summary><strong>Embedded Cards</strong></summary>

You can embed other Home Assistant cards inside this one, for buttons, graphs, sensors, and more.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `custom_cards` | `list` | — | A list of cards to display. Standard or custom cards both work. |
| `custom_cards_position` | `string` | `bottom` | Where the container of cards sits (e.g., `bottom`, `top`, `bottom-right`). |
| `custom_cards_css_class` | `string` | — | A CSS class on the container, handy for styling with `card_mod`. |
| `custom_width` | `string` | — | *Set on a nested card.* Forces a width (e.g., `100%`, `50px`). |
| `custom_height` | `string` | — | *Set on a nested card.* Forces a height (e.g., `150px`). |

**Basic example:**
```yaml
custom_cards_position: bottom
custom_cards:
  - type: weather-forecast
    custom_width: 100%
    entity: weather.your_weather_entity
```

</details>

<a name="css-variables"></a>
<details>
<summary><strong>CSS Variables</strong></summary>

> Most users won't need these. The options above cover all common use cases. These are here for fine-tuning small details like shadows, fonts, and spacing, either in your theme or via `card_mod`.

<details>
<summary><b>Card Variables</b></summary>

| Variable | Default | Description |
| :--- | :--- | :--- |
| `--awc-card-border-radius` | `12px` | Corner radius of the card. |
| `--awc-card-border-width` | *HA theme* | Border width. Inherits from the theme by default. |
| `--awc-card-padding` | `16px` | Inner padding. |
| `--awc-bg-brightness` | `1` | Background brightness multiplier (matches `bg_brightness`). |
| `--awc-bg-saturation` | `1` | Background saturation multiplier (matches `bg_saturation`). |
| `--awc-stack-order` | *auto* | Stacking order (z-index) of the card. |
| `--awc-fade-color` | *auto* | Color of the bottom fade when `bottom_fade` is on. |
| `--awc-fade-start` | *auto* | Where the bottom fade begins. |
| `--awc-custom-cards-direction` | `row` | Flex direction of the embedded cards container. |
| `--awc-custom-cards-gap` | `8px` | Gap between embedded cards. |
| `--awc-custom-cards-justify` | `flex-start` | Horizontal alignment of embedded cards. |
| `--awc-custom-cards-align` | `flex-start` | Vertical alignment of embedded cards. |

</details>

<details>
<summary><b>Text & Button Variables</b></summary>

| Variable | Default | Description |
| :--- | :--- | :--- |
| `--awc-text-day` | `#2c2c2e` | Text color during the day. |
| `--awc-text-night` | `#FFFFFF` | Text color at night. |
| `--awc-text-color` | *auto* | Resolved text color. Overrides day and night at once. |
| `--awc-text-shadow-day` | *soft glow* | Text shadow during the day. |
| `--awc-text-shadow-night` | *soft glow* | Text shadow at night. |
| `--awc-button-text-shadow` | *auto* | Text shadow on the button label. |
| `--awc-bottom-font-size` | `16px` | Button value text size. |
| `--awc-bottom-font-weight` | `500` | Button value text weight. |
| `--awc-bottom-gap` | `8px` | Gap between buttons. |
| `--awc-bottom-opacity` | `0.7` | Opacity of buttons without a background. |
| `--awc-button-gap` | `6px` | Gap between the icon and text in a button. |
| `--awc-button-text-gap` | `0.35em` | Gap between the name and value. |
| `--awc-buttons-padding` | `0` | Inner padding of each button. |
| `--awc-button-name-weight` | `500` | Font weight of the button label. |
| `--awc-button-name-opacity` | `0.7` | Opacity of the button label. |
| `--awc-button-name-color` | `inherit` | Color of the button label. |
| `--awc-button-name-font-size` | *auto* | Font size of the button label. |
| `--awc-button-value-weight` | *auto* | Font weight of the button value. |
| `--awc-button-value-opacity` | *auto* | Opacity of the button value. |
| `--awc-button-tint` | *auto* | Tint color applied to a button. |
| `--awc-icon-size` | `1.1em` | Button icon size. |
| `--awc-icon-padding` | `0` | Padding around the button icon. |
| `--awc-row-width` | *auto* | Width of a button area. |
| `--awc-row-height` | `auto` | Height of a button area. |
| `--awc-row-columns` | `1` | Columns when an area uses `layout: grid`. |
| `--awc-separator-color` | *auto* | Color of the separator line. |
| `--awc-separator-width` | `2px` | Thickness of the separator line. |
| `--awc-marquee-duration` | `20s` | Marquee scroll duration. Longer is slower. |
| `--awc-marquee-fade` | `12px` | Edge fade width on a marquee button. |
| `--awc-marquee-separator` | `"•"` | Character between marquee repeats. |
| `--awc-marquee-sep-gap` | `0.4em` | Padding around the marquee separator. |

</details>

<details>
<summary><b>Gauge Variables (ring & bar)</b></summary>

These apply to buttons using `type: ring` or `type: bar`.

| Variable | Default | Description |
| :--- | :--- | :--- |
| `--awc-ring-color` | *auto* | Color of the filled part of a ring. |
| `--awc-ring-w` | `4px` | Ring thickness. |
| `--awc-ring-gap` | `3px` | Gap between the ring and the button. |
| `--awc-bar-color` | *auto* | Color of the filled part of a bar. |
| `--awc-bar-h` | `4px` | Bar height. |

</details>

<details>
<summary><b>Stacked & Vertical Chip Variables</b></summary>

These apply when a button uses `style: stacked` or `style: vertical`.

| Variable | Default | Description |
| :--- | :--- | :--- |
| `--awc-stacked-icon-bg` | *auto* | Background color of the icon area. |
| `--awc-stacked-icon-radius` | *auto* | Corner radius of the icon area. |
| `--awc-stacked-icon-inset` | `3px` | Inset used for the icon area radius. |
| `--awc-stacked-name-size` | `0.85em` | Label font size. |
| `--awc-stacked-name-opacity` | `0.7` | Label opacity. |
| `--awc-stacked-value-weight` | `700` | Value font weight. |

</details>

<details>
  <summary><b>Card Mod Example</b></summary>

  ```yaml
  type: custom:atmospheric-weather-card
  weather_entity: weather.your_weather_entity
  card_mod:
    style: |
      :host {
        --awc-text-day: #ffffff;
        --awc-text-night: #ffffff;
        --awc-text-shadow-day: 0 1px 2px rgba(0, 0, 0, 0.15);
        --awc-text-shadow-night: 0 1px 2px rgba(0, 0, 0, 0.8);
      }
  ```
</details>

</details>

</details>

<br>

## Color Mode

The card's light or dark look is controlled by **`card_color_mode`** and, when following an entity, your **`theme_entity`**. The day/night sky itself always follows your **`sun_entity`**, so you still get stars at night regardless of the color setting.

<details>
<summary><strong>How to set this up</strong></summary>

<br>

| Mode | Config | What it does |
| :--- | :--- | :--- |
| **Follow the sun** | `sun_entity: sun.sun`<br>`theme_entity: sun.sun` | The light and dark colors switch at real sunrise and sunset. This is the default starting point. |
| **Follow your HA theme** | `card_color_mode: ha_theme` | The colors match whatever your Home Assistant theme is doing. On Android and iOS, the theme can auto-toggle dark mode at sunrise and sunset. |
| **Lock light or dark** | `card_color_mode: light`<br>or `card_color_mode: dark` | Locks the colors to one look. The sky still follows `sun_entity`, so you keep the stars at night. |
| **Custom logic** | `theme_entity: sensor.my_mode` | `theme_entity` can point at any entity. The card uses its dark look when the state is `below_horizon`, and the light look otherwise. Useful for rules like "dark after 9pm". |

</details>

<br>

## Simple Backgrounds

If you want the weather-aware look without the shader, set `simple_background: true`. Instead of the animated background you get a soft CSS gradient that still changes with the weather and switches between a day and a night version with your `sun_entity`. It is much lighter on the GPU and a good fit for a wall tablet or any device where the shader feels like too much.

```yaml
type: custom:atmospheric-weather-card
weather_entity: weather.your_weather_entity
sun_entity: sun.sun
simple_background: true
```

Every weather state has its own gradient, and you can override any of them with CSS variables, either in your theme or through `card_mod`. There are two variables per state and time of day. The base is the main gradient, and the glow is a soft highlight laid over it.

| Variable | What it does |
| :--- | :--- |
| `--awc-simple-base-{state}-day` | Main gradient for that weather state during the day. |
| `--awc-simple-base-{state}-night` | Main gradient for that weather state at night. |
| `--awc-simple-glow-{state}-day` | Highlight over the base during the day. |
| `--awc-simple-glow-{state}-night` | Highlight over the base at night. |
| `--awc-simple-bg-day` | Fallback gradient behind everything, used as a base layer. |

Replace `{state}` with a weather condition like `sunny`, `cloudy`, `rainy`, `pouring`, `snowy`, `fog`, `lightning`, `partlycloudy`, `clear-night`, or any of the other Home Assistant [weather states](https://www.home-assistant.io/integrations/weather/#condition-mapping).

```yaml
type: custom:atmospheric-weather-card
weather_entity: weather.your_weather_entity
sun_entity: sun.sun
simple_background: true
card_mod:
  style: |
    :host {
      --awc-simple-base-sunny-day: linear-gradient(135deg, #cfe8f5 0%, #a9c4df 100%);
      --awc-simple-base-sunny-night: linear-gradient(135deg, #1b2e46 0%, #0c1122 100%);
    }
```

<br>

## Guides

<a name="buttons"></a>
<details>
<summary><b>Buttons & Forecasts</b></summary>

Buttons are the small elements you add to the card. Each one can show live data from any Home Assistant entity, or a weather forecast. You group buttons into [areas](#appearance), and each area has its own position and layout. Within an area you can leave all buttons looking the same (good for a forecast row) or style each one differently. Every option is listed in the [Appearance](#appearance) section.

<details>
<summary><strong>Forecast buttons</strong></summary>

<br>

By default a button shows the current state of its entity. Setting `forecast` to `daily` or `hourly` switches it to forecast mode, where it shows one future entry from the weather entity.

Use `forecast_offset` to pick the entry: `0` is today (or now), `1` is tomorrow (or the next hour), and so on. The button generates a name automatically, like `Mon` for daily or `14:00` for hourly. You can override that with `name`.

With `icon: weather` on a forecast button, the icon matches the **forecasted** condition for that entry, not the current weather.

```yaml
buttons:
  - entity: weather.your_weather_entity
    forecast: daily
    attribute: temperature
    forecast_offset: 1
    sub_value_attribute: templow
    sub_value_format: "°"
    icon: weather
  - entity: weather.your_weather_entity
    forecast: hourly
    attribute: temperature
    forecast_offset: 3
    unit_format: "°"
```

The first button shows tomorrow's high with its low next to it and a matching icon. The second shows the temperature three hours from now with `°` after the value.

</details>

<details>
<summary><strong>Ring gauge</strong></summary>

<br>

Set `type: ring` to turn a button into a circular gauge. The ring fills based on the value within a min/max range, which works well for humidity, battery, UV index, and similar.

```yaml
buttons:
  - entity: sensor.living_room_humidity
    type: ring
    ring_min: 0
    ring_max: 100
    ring_width: 4px
    ring_gap: 3px
    ring_color: "#03a9f4"
    style: vertical
    hide_label: true
    icon: mdi:water-percent
```

You can add color thresholds that change the ring color as the value rises. `solid` fills the whole ring with the matched color, `segments` draws each range as its own arc, and `gradient` blends between the colors.

```yaml
buttons:
  - entity: sensor.cpu_temperature
    type: ring
    ring_min: 30
    ring_max: 100
    ring_color: "#4caf50"
    ring_threshold_mode: solid
    ring_thresholds:
      - value: 60
        color: "#ff9800"
      - value: 80
        color: "#f44336"
```

| Option | What it does |
| :--- | :--- |
| `type: ring` | Enables the ring gauge. |
| `ring_min` | Minimum of the range (default `0`). |
| `ring_max` | Maximum of the range (default `100`). |
| `ring_width` | Thickness of the ring. |
| `ring_gap` | Gap between the ring and the button. |
| `ring_color` | Color of the filled part. |
| `ring_threshold_mode` | `solid`, `segments`, or `gradient`. |
| `ring_thresholds` | A list of `{ value, color }` entries. |
| `gauge_entity` | Use a different entity for the gauge value than the one shown as text. |
| `gauge_attribute` | Attribute to read for the gauge value. |

</details>

<details>
<summary><strong>Bar gauge</strong></summary>

<br>

Set `type: bar` for a horizontal bar instead of a ring. It works the same way and supports the same thresholds.

```yaml
buttons:
  - entity: sensor.battery_level
    type: bar
    bar_min: 0
    bar_max: 100
    bar_height: 4px
    bar_color: "#4caf50"
    name: Battery
```

| Option | What it does |
| :--- | :--- |
| `type: bar` | Enables the bar gauge. |
| `bar_min` | Minimum of the range (default `0`). |
| `bar_max` | Maximum of the range (default `100`). |
| `bar_height` | Height of the bar. |
| `bar_color` | Color of the filled part. |
| `bar_threshold_mode` | `solid`, `segments`, or `gradient`. |
| `bar_thresholds` | A list of `{ value, color }` entries. |

</details>

<details>
<summary><strong>Color thresholds</strong></summary>

<br>

Any button can change its color based on a value, even without a gauge. This tints the button when a number passes a threshold.

```yaml
buttons:
  - entity: sensor.outside_temperature
    color_thresholds:
      - value: 0
        color: "#5488c7"
      - value: 20
        color: "#e08f5e"
      - value: 30
        color: "#d66454"
```

You can read the threshold value from a different entity or attribute with `color_threshold_entity` and `color_threshold_attribute`.

</details>

<details>
<summary><strong>Second value</strong></summary>

<br>

A button can show a second value beside or below the main one, which is handy for a high and low temperature together.

```yaml
buttons:
  - entity: weather.your_weather_entity
    forecast: daily
    attribute: temperature
    name: "Today: "
    sub_value_attribute: templow
    sub_value_format: " –"
    text_order: label,sub,value
```

Use `text_order` to set the order of the label, value, and second value (here it reads "Today: low – high").

</details>

<details>
<summary><strong>Free positioning</strong></summary>

<br>

Any button can be lifted out of its area and placed anywhere. Set `position: custom` and use the anchor and offsets.

```yaml
buttons:
  - entity: sensor.outside_temperature
    position: custom
    position_anchor: top-right
    position_x: 20px
    position_y: 10px
    background: true
```

This places the button 20px from the right and 10px from the top, independent of the area it lives in. The anchor uses the same 9-cell grid as the areas.

</details>

<details>
<summary><strong>Conditional buttons</strong></summary>

<br>

A button can be shown only when certain conditions are met, using the standard Home Assistant visibility conditions.

```yaml
buttons:
  - entity: sensor.wind_gust
    name: Gust
    visibility:
      - condition: numeric_state
        entity: sensor.wind_gust
        above: 40
```

This button only appears when the gust value goes above 40. State, numeric state, screen size, user, and `and`/`or`/`not` conditions are all supported.

</details>

</details>

<a name="font-family"></a>
<details>
<summary><b>Font Family</b></summary>

<br>

The screenshots use the **Montserrat** font, which you can download or embed from [Google Fonts](https://fonts.google.com/specimen/Montserrat). Once it is loaded into your Home Assistant frontend (for example through a theme), the card picks it up along with the rest of your dashboard, since it inherits whatever font your theme sets.

<br>

</details>

<a name="weather-icons"></a>
<details>
<summary><b>Weather Icons</b></summary>

<br>

The card comes with its own set of animated weather icons built in. Use them by setting a button's `icon` to `weather`. For a colored version of the built-in icons, set `icon_set: colored` on the card.

```yaml
buttons:
  - entity: weather.your_weather_entity
    icon: weather
```

If you would rather use your own icons, point a button (or the whole card) at a folder of SVG files. 

1. Download the SVGs and name them after the weather conditions, like `sunny.svg` or `rainy.svg`. The state names are standardized; you can find them in the [HA documentation](https://www.home-assistant.io/integrations/weather/#condition-mapping).
2. Put the files in a folder like `config/www/weather-icons/`.
3. Set `icon` to `weather` and add the folder path with `icon_path`:

```yaml
buttons:
  - entity: weather.your_weather_entity
    icon: weather
    icon_path: /local/weather-icons/
```

You can also set `icon_path` once at the top level of the card so every `icon: weather` button uses it without repeating the path. The card then loads the file matching the current state, for example `/local/weather-icons/rainy.svg` for rainy weather.

<br>

</details>

<br>

## Performance

The animated background uses GLSL shaders. It is optimized to balance visual detail with performance, but because it relies on the GPU, very old hardware will naturally still struggle. If the animation feels slow or stutters, here are a few alternatives:

* **Use a simple background.** Set `simple_background: true` for a lightweight CSS gradient that still changes with the weather and time of day. The shader is switched off. See [Simple Backgrounds](#simple-backgrounds).
* **Use your own images instead.** Set `weather_image_path` to a folder of images or videos named after the weather states (like `rainy.jpg` or `sunny.mp4`). The card shows the matching file for the current weather and switches the shader off. You can add a separate night folder with `weather_image_path_night`.
* **Turn the animation off.** Set `disable_background: true` to switch the shader off completely. The card keeps working and your buttons and layout stay exactly the same, just without the moving background.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `disable_background` | `boolean` | `false` | Integrated shader animations, `true` switches them off. |
| `simple_background` | `boolean` | `false` | Lightweight CSS gradient instead of the shader. |
| `weather_image_path` | `string` | — | Folder of images or videos to show instead of the animation. |
| `weather_image_path_night` | `string` | — | Optional separate folder for night. Falls back to the day folder. |

<br>

## Support the project

If you find this card useful, consider leaving a star. It helps with motivation :)
