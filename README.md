# MESA/Boogie Custom Amp Configurator (Shopify)

A "build your own" amp page for a MESA/Boogie dealer store, in the style of Sweetwater's
MESA custom configurator: customers pick a model, then covering, top panel, grille, piping,
corners and handle, see a live preview and running price, and add the build to the cart.

- `demo/index.html`: standalone demo with sample options and **sample prices** (open in any browser)
- `shopify/sections/amp-configurator.liquid`: the theme section
- `shopify/assets/amp-configurator.js`: preview drawing, pricing, cart logic
- `shopify/assets/amp-configurator.css`: styles

## Install

1. **Back up your theme:** Online Store → Themes → ⋯ → Duplicate. Work on the copy.
2. ⋯ → **Edit code**:
   - In **sections/**, add a new section `amp-configurator` and paste in the `.liquid` file.
   - In **assets/**, add `amp-configurator.js` and `amp-configurator.css` and paste in their contents.
3. **Create one product per model** you'll offer, e.g. "MESA/Boogie Mark VII Head – Custom Configured",
   priced from your dealer price list.
4. **Create upcharge products** for options that cost extra, e.g. "Custom option – Crocodile covering".
   Hide them from search and collections and don't track inventory.
5. **Make a page template:** Online Store → Themes → Customize → Pages → create template `custom-amp`,
   then add the **Amp configurator** section.
6. **Add "Amp model" blocks:** pick the product and its type (head, 1x12 combo, 2x12 or 4x12 cab).
   The type sets the preview shape and which steps apply. Cabinets skip the top panel step, and 4x12s skip the handle step.
7. **Add "Option choice" blocks:** set the *Option group* (Covering, Top panel, Grille, Piping,
   Corners, Handle), *Choice name*, *Part* it changes, *Colour*, *Texture* (Bronco, Taurus, Crocodile,
   Hardwood, Jute, Wicker, Leather, Metal) and an *Upcharge product* if it costs extra.
   Tick *Selected by default* on one choice per group.
8. Upload the **official MESA logo** from your dealer assets as the section's *Logo image*.
9. Create a page (e.g. `/pages/mesa-custom`) using the `custom-amp` template and add it to your menu.

Use MESA's current Custom Configured option list and your dealer pricing for the choices.
The option names in the demo come from public MESA listings, and its prices are placeholders.

## Real photos or renders

The preview is drawn in code, so it works immediately. For a photo-real look:

1. Ask MESA for dealer imagery, or photograph or render each model **from one fixed angle**.
2. Set a **Base photo/render** on each model block, then add a transparent PNG **Preview layer image**
   to each option (e.g. the grille in Wicker, the covering in Navy Crocodile). Layers stack in the order
   covering → panel → grille → piping → corners → handle.
3. Optional: a **Swatch image** (a close-up of the real material) replaces the drawn swatch.

## How the cart and orders work

"Add custom amp to cart" adds the model product plus one upcharge product per paid option.
They share a **Build ID**, and every choice is saved on the order as a line-item property, so the
order lists exactly what to submit to MESA. "Share build" copies a link that reopens the same build.

**Limitation:** a customer could remove an upcharge line from the cart. Check that the Build ID lines
match before placing the order with MESA. To lock them together, use Shopify's bundle / Cart Transform
features or a product-options app.

**Deposits:** to take a deposit instead of the full price, link the model blocks to deposit products.
The chosen options still come through on the order.
