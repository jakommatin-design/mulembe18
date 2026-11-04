# 11. Luxury Glassmorphism Design System Specification

## 1. Design Philosophy & Mood
- **Aesthetic**: Heritage Prestige meets Ultra-Modern Glassmorphism. Inspired by world-class cultural institutions and high-end member organisations.
- **Visual Feel**: Frosted translucent layers, crystalline depth, refined typography, generous negative space, and disciplined layout rhythm.
- **Core Principle**: **Text legibility and WCAG AA contrast always supersede effect**. If a glass layer risks low contrast, opacity is boosted immediately.

---

## 2. Color Palette & CSS Variables

The system supports both **Dark Mode** (default luxury feel) and **Light Mode** (pristine daylight feel) driven by CSS variables toggled on `[data-theme="dark"]` and `[data-theme="light"]`.

### Design Tokens:
- **Emerald Forest (Primary)**: Deep heritage green `#08281A` / `#0C3B26` representing fertility and the Luhya ancestral heartland.
- **Kenyatta Ochre & Gold (Accent)**: Warm luminous gold `#D4AF37` / `#F3C64F` providing regal highlights, badges, and primary calls to action.
- **Glass Surfaces**:
  - Dark Theme: `rgba(255, 255, 255, 0.07)` to `rgba(255, 255, 255, 0.14)` with 16px–24px backdrop blur.
  - Light Theme: `rgba(255, 255, 255, 0.72)` to `rgba(255, 255, 255, 0.88)` with 16px–24px backdrop blur.
- **Borders**: 1px subtle hairline borders:
  - Dark Theme: `rgba(255, 255, 255, 0.12)`
  - Light Theme: `rgba(0, 0, 0, 0.08)`
- **Atmospheric Background**: Deep obsidian/emerald radial gradients with soft diffused color orbs creating refraction depth beneath glass surfaces.

---

## 3. Typography Scale
Loaded via `next/font/google`:
- **Display & Headings**: `Cinzel` or `Playfair Display` (Refined editorial serif for titles, cultural banners, and section markers).
- **Body & UI**: `Plus Jakarta Sans` or `Inter` (Ultra-crisp geometric sans-serif optimized for mobile legibility).

---

## 4. Glass Surface Primitives Catalog

| Primitive | Class Name | Blur Radius | Surface Tint | Border Spec | Default Shadow |
|---|---|:---:|---|---|---|
| **Glass Panel** | `.glass-panel` | `20px` | `var(--glass-bg-base)` | `1px solid var(--glass-border)` | `0 8px 32px var(--glass-shadow)` |
| **Glass Card** | `.glass-card` | `16px` | `var(--glass-bg-card)` | `1px solid var(--glass-border)` | `0 10px 25px var(--glass-shadow)` |
| **Glass Navbar** | `.glass-navbar` | `24px` | `var(--glass-bg-nav)` | `1px solid var(--glass-border-b)`| `0 4px 20px rgba(0,0,0,0.15)` |
| **Glass Modal** | `.glass-modal` | `28px` | `var(--glass-bg-modal)`| `1px solid var(--glass-border)` | `0 20px 60px rgba(0,0,0,0.4)` |
| **Glass Sidebar** | `.glass-sidebar` | `20px` | `var(--glass-bg-card)` | `1px solid var(--glass-border-r)`| `0 4px 30px var(--glass-shadow)` |
| **Glass Input** | `.glass-input` | `12px` | `var(--glass-bg-input)`| `1px solid var(--glass-border)` | Inset subtle depth |
| **Glass Badge** | `.glass-badge` | `8px` | `var(--glass-bg-badge)`| `1px solid var(--glass-border)` | None |

---

## 5. Micro-Interactions & Transitions
- **Hover Lift**: Cards elevate smoothly: `transform: translateY(-4px); transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1)`.
- **Focus Rings**: Accessible 2px gold glow: `box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.35)`.
- **Skeleton Shimmer**: Animated translucent shimmer gradient for data loading placeholders.
- **Accessibility**: Automatic fallback to high-opacity solid surfaces when `prefers-reduced-motion: reduce` or `backdrop-filter` is unsupported.
