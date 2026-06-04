# Plan: Shared Footer Component Across All Pages

## Current State

After auditing all 15 pages in [`frontend/src/pages/`](frontend/src/pages/), here's the footer situation:

| Page | Has Footer? | Footer Type |
|------|-------------|-------------|
| [`Home.jsx`](frontend/src/pages/Home.jsx) (lines 411-483) | ✅ Full featured | **The "gold standard"** — newsletter, quiz CTA, links, copyright |
| [`About.jsx`](frontend/src/pages/About.jsx) (lines 400-453) | ✅ Similar but different | Similar style, slightly different layout & markup |
| [`Cart.jsx`](frontend/src/pages/Cart.jsx) (lines 310-340) | ✅ Minimal version | Simpler footer, different structure |
| [`ProductDetails.jsx`](frontend/src/pages/ProductDetails.jsx) (lines 375-386) | ✅ Minimal version | Simple copyright bar only |
| [`BestSellers.jsx`](frontend/src/pages/BestSellers.jsx) | ❌ **No footer** | Ends at line 680 |
| [`NewArrivals.jsx`](frontend/src/pages/NewArrivals.jsx) | ❌ **No footer** | Ends at line 494 |
| [`Categories.jsx`](frontend/src/pages/Categories.jsx) | ❌ **No footer** | Ends at line 1173 |
| [`CategoryViewAll.jsx`](frontend/src/pages/CategoryViewAll.jsx) | ❌ **No footer** | Ends at line 218 |
| [`Login.jsx`](frontend/src/pages/Login.jsx) | ❌ **No footer** | Ends at line 189 |
| [`Signup.jsx`](frontend/src/pages/Signup.jsx) | ❌ **No footer** | Ends at line 185 |
| [`Profile.jsx`](frontend/src/pages/Profile.jsx) | ❌ **No footer** | Ends at line 48 |
| [`Wishlist.jsx`](frontend/src/pages/Wishlist.jsx) | ❌ **No footer** | Ends at line 205 |
| [`SearchResults.jsx`](frontend/src/pages/SearchResults.jsx) | ❌ **No footer** | Ends at line 175 |
| [`Contact.jsx`](frontend/src/pages/Contact.jsx) | ❌ **No footer** | Ends at line 208 |
| [`Checkout.jsx`](frontend/src/pages/Checkout.jsx) | ❌ **No footer** | Ends at line 224 |

## The Plan

### Step 1: Create a shared `Footer` component

Extract the full footer from [`Home.jsx`](frontend/src/pages/Home.jsx) (lines 411-483, the "7. REFINED FOOTER & NEWSLETTER" section) into a new reusable component at:

**`frontend/src/components/Footer.jsx`**

This component will accept optional props for admin editing capabilities (the `data-edit-key` attributes and `HomeLiveEditor`/admin functionality). The component will be self-contained with:
- Newsletter signup section with quiz CTA
- Link columns (Shop, About, Support)
- Copyright bar
- Inline `<style>` for the `trustMarquee` animation (if needed)

### Step 2: Update `Home.jsx`

Replace the inline footer (lines 411-483) with the new `<Footer />` component.
Keep the [`HomeLiveEditor`](frontend/src/components/admin/HomeLiveEditor.jsx) integration since that's admin-specific to Home.

### Step 3: Add `<Footer />` to pages WITHOUT a footer (12 pages)

These pages need `<Footer />` imported and rendered at the end of their JSX, just before the closing `</div>` wrapper:

1. [`BestSellers.jsx`](frontend/src/pages/BestSellers.jsx)
2. [`NewArrivals.jsx`](frontend/src/pages/NewArrivals.jsx)
3. [`Categories.jsx`](frontend/src/pages/Categories.jsx)
4. [`CategoryViewAll.jsx`](frontend/src/pages/CategoryViewAll.jsx)
5. [`Login.jsx`](frontend/src/pages/Login.jsx)
6. [`Signup.jsx`](frontend/src/pages/Signup.jsx)
7. [`Profile.jsx`](frontend/src/pages/Profile.jsx)
8. [`Wishlist.jsx`](frontend/src/pages/Wishlist.jsx)
9. [`SearchResults.jsx`](frontend/src/pages/SearchResults.jsx)
10. [`Contact.jsx`](frontend/src/pages/Contact.jsx)
11. [`Checkout.jsx`](frontend/src/pages/Checkout.jsx)
12. [`ProductDetails.jsx`](frontend/src/pages/ProductDetails.jsx) *(replace existing minimal footer)*

### Step 4 (Optional): Replace non-standard footers on existing pages

- **`About.jsx`** — Has its own footer. Could keep as-is since About is brand/ethos page with custom styling, OR replace with shared `<Footer />`.
- **`Cart.jsx`** — Has its own minimal footer. Could be replaced with shared `<Footer />`.
- **`ProductDetails.jsx`** — Has a simple copyright bar. Replace with shared `<Footer />` for consistency.

### Considerations

1. **Admin data-edit attributes**: The Home footer has `data-edit-key` attributes for admin CMS editing. These can be removed from the shared component (since admin editing is Home-page specific) or kept inert. The component will still work fine without the admin context.

2. **No duplicate code**: The extracted component should be a pure copy of the Home footer HTML structure minus admin-specific hooks. All pages get the same polished footer.

3. **Minimal page changes**: Each page only needs:
   - `import Footer from '../components/Footer'`
   - `<Footer />` placed before the outer `</div>`