# Code Structure Audit — unimart-nextjs (Full Project)

> Focus: unorganized, overly complex, and hard-to-maintain code structures.  
> Static data in components is expected for a Themeforest template — not flagged here.

---

## 1. CRITICAL — Giant Monolithic Header Files (61–65 KB each)

**Files:** `Header4`, `Header8`, `Header9`, `Header9Transparent`, `Header17`, `Header20`, `Header22`

Each of these headers is **1,000+ lines** because they contain the entire **mega-menu category dropdown HTML inline** — hundreds of `<Link>` items repeated directly in the component body.

Looking at `Header8.tsx` (1,106 lines / 65 KB), the mega-menu category lists for "Home & Garden", "Smart Phones", "Electronics Gadgets", etc. are literally copy-pasted blocks of JSX with the same structure repeated 8+ times. The same inline `<svg>` fire/flame icon (25 lines of path data) appears verbatim in **every single dropdown column**.

**The fix pattern:**
```
Before: Header8.tsx (1,106 lines - entire mega menu inline)
After:  Header8.tsx (~120 lines - layout only)
        headerComponents/MegaMenuCategory.tsx (~80 lines - single category column)
        headerComponents/MegaMenuFlameIcon.tsx (~30 lines - shared SVG)
        data/megaMenu.ts (category link data)
```

**Impact**: These 7 files add ~430 KB of near-duplicate JSX to the bundle. Extracting the mega-menu into a data-driven component would reduce each from ~1000 lines to ~100 lines.

---

## 2. CRITICAL — `Categories.tsx` Modal: 2,222 Lines / 102 KB

`components/modals/Categories.tsx` is a **single 2,222-line file** — the largest in the entire project at 102 KB. This is the categories sidebar/modal component containing every category tree hardcoded as JSX.

This should be:
- A small shell component (`~50 lines`)
- Driven by the existing `data/categories.ts` (already exists at 45 KB)
- With a recursive or mapped `CategoryTree` sub-component

---

## 3. CRITICAL — `filterReducer.ts`: Duplicate Case Handlers

`components/reducer/filterReducer.ts` has **two identical `case` blocks** for `SET_CURRENT_PAGE` and `SET_ITEM_PER_PAGE` — lines 103–107 and 141–145 are exact duplicates:

```ts
// Lines 103-107
case "SET_CURRENT_PAGE":
  return { ...state, currentPage: action.payload };
case "SET_ITEM_PER_PAGE":
  return { ...state, itemPerPage: action.payload, currentPage: 1 };

// Lines 141-145 — EXACT DUPLICATE
case "SET_CURRENT_PAGE":        // ← dead code, never reached
  return { ...state, currentPage: action.payload };
case "SET_ITEM_PER_PAGE":       // ← dead code, never reached
  return { ...state, itemPerPage: action.payload, currentPage: 1 };
```

In a JavaScript `switch`, the second instance of identical cases is **unreachable dead code**. TypeScript should warn about this but it may be suppressed.

---

## 4. CRITICAL — `console.log` in Production Code

`components/reducer/filterActions.ts` lines 9 and 11 have **two `console.log(brand)` calls** — a debugging statement committed to the main `toggleBrand` function. This fires every time a user clicks a brand filter in the shop:

```ts
export function toggleBrand(...): void {
  const updated = ...;
  console.log(brand);   // ← line 9, debug leftover
  dispatch({ type: "SET_BRANDS", payload: updated });
  console.log(brand);   // ← line 11, duplicate debug leftover
}
```

---

## 5. MAJOR — `MobileMenu.tsx` at 48 KB / ~1,100 Lines

`components/modals/MobileMenu.tsx` is 48 KB and contains the entire mobile navigation tree hardcoded inline. Like the header files, it duplicates all shop page links, category structures, and sub-menus as raw JSX.

The mobile menu should share navigation data with `data/menu.ts` (already 33 KB) instead of maintaining its own duplicate link tree.

---

## 6. MAJOR — Inline SVG Repeated Across the Codebase

The same "flame/fire" SVG icon (the 3-color gradient fire) appears in:
- `DetailsDefault.tsx`
- `DetailsZoom1.tsx`
- `Header8.tsx` (multiple times)
- `Header4.tsx`, `Header9.tsx`, etc.
- `WelcomeBanner.tsx`
- `QuickView2.tsx`

Each occurrence is ~25 lines of raw `<svg>` + `<path>` + `<defs>` + `<linearGradient>` JSX. This SVG should be a shared `<FlameIcon />` component in `components/common/`.

The same applies to the "eye/views" SVG (green eye icon) which appears in similar numbers of files.

---

## 7. MAJOR — `LayoutClientEffects.tsx`: Two Separate `useEffect` Calls That Should Be One

`components/common/LayoutClientEffects.tsx` has **two `useEffect` blocks** both depending on `[pathname]` (lines 10–172 and 173–184). The second one (animationend listener) should simply be merged into the first cleanup block — there's no reason they need to be separate.

```tsx
// Current: two separate useEffect([pathname])
useEffect(() => { /* scroll observers, zoom */ }, [pathname]);
useEffect(() => { /* animationend listeners */ }, [pathname]);  // ← should merge into above

// Should be: one combined useEffect with single cleanup
useEffect(() => {
  // ... all setup
  return () => { /* all cleanup */ };
}, [pathname]);
```

Additionally, the animationend listener (lines 174–183) **never cleans up** its event listeners. On every route change, new listeners pile up on the same DOM elements without the old ones being removed.

---

## 8. MAJOR — Inconsistent Naming Conventions

Several naming inconsistencies make the codebase harder to navigate:

| Issue | Examples |
|---|---|
| Typos in file/folder names kept as directory names | `element-catagories-style` (should be `categories`), `home-straller` (should be `stroller`), `home-borkha-shop` (should be `burqa`), `home-laggage-bag` (should be `luggage`) |
| `SimmilerProducts` (typo) | `SimmilerProducts2.tsx`, `SimmilerProducts3.tsx` vs `SimillerProducts5.tsx` — inconsistent |
| Mixed naming for "Separate" components | `NavShopPages.tsx` (23 KB) alongside tiny `NavFilterTab.tsx` — no consistent scope rule |
| `SerchWithCategory2.tsx` | Typo: should be `SearchWithCategory2` |

---

## 9. MODERATE — `store.ts`: `quickViewItem` Default Is an Arbitrary Product

In `context/store.ts` line 53:
```ts
quickViewItem: products[0],  // ← imports entire fashion product list just for a default
```

This imports the entire `products` array from `@/data/products/fashion` (the 94 KB `fashion.ts` file) just to use `products[0]` as a placeholder default value. The default should be `null` with a union type `Product | null`, not a random product that also pulls in a 94 KB data file into the context bundle.

---

## 10. MODERATE — `data/` Files Are Extremely Large

| File | Size | Notes |
|---|---|---|
| `electronics.ts` | **132 KB** | Should be split by sub-category |
| `fashion.ts` | **94 KB** | Should be split (formal, casual, etc.) |
| `testimonials.ts` | **65 KB** | All testimonials in one array |
| `others.ts` | **57 KB** | A catch-all — undefined category |
| `splash.ts` | **39 KB** | Splash-only data mixed with product data |

These giant single files mean any page importing even one product from `electronics.ts` loads 132 KB of data that it doesn't need. They should be split into smaller grouped files, and `others.ts` should be properly categorized.

---

## 11. MODERATE — `lib/` Has Only One File

`lib/lightgallery-styles.ts` is a 5-line CSS re-export shim. The `lib/` directory exists just for this one utility. Either:
- Move it to `utils/` alongside `magneticButton.ts`, `nav.ts`, `videoControls.ts`
- Or expand `lib/` to house all third-party integrations

Currently `utils/` and `lib/` overlap in purpose with no clear separation rule.

---

## 12. MINOR — Imports Are Not Consistently Organized

Multiple files have imports in non-standard order (components before libraries, CSS mid-file):
- Type imports scattered among value imports (should use `import type` consistently)
- `drift-zoom` CSS imported in `DetailsZoom1.tsx` — a component-level CSS import, while all other gallery CSS goes through `lib/lightgallery-styles.ts`
- Some files import from `@/context/Context.ts` (the re-export barrel), others import directly from `@/context/store` or `@/context/uiStore`, inconsistently

---

## Priority Summary

| # | Issue | Effort | Impact |
|---|---|---|---|
| 1 | Extract mega-menu from 7 giant headers into data-driven component | High | Huge bundle reduction |
| 2 | Refactor `Categories.tsx` (2,222 lines) to use `data/categories.ts` | High | Massive maintainability gain |
| 3 | Fix duplicate `case` blocks in `filterReducer.ts` | **Trivial** | Correctness |
| 4 | Remove `console.log` from `filterActions.ts` | **Trivial** | Production quality |
| 5 | Extract shared `<FlameIcon />` and `<EyeIcon />` SVG components | Low | Eliminates ~20 duplicates |
| 6 | Merge two `useEffect([pathname])` in `LayoutClientEffects.tsx` + fix leak | Low | Prevents listener accumulation |
| 7 | Fix `quickViewItem` default in `store.ts` (remove 94 KB import) | Low | Reduces context bundle size |
| 8 | Split large data files (electronics 132 KB, fashion 94 KB) | Medium | Faster page-level imports |
| 9 | Fix typos in directory/file names | Low | Readability |
| 10 | Unify `lib/` and `utils/` or define clear separation | Low | Structural clarity |
