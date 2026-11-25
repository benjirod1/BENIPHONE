# Lark Black Friday Weekend: Meta ads

Matches the Klaviyo "Black Friday is here" email: up to 20% off new guitars, amps and pedals,
discount applied in cart, no code, free shipping.

## Images

| File | Placement |
|---|---|
| `lark-bf-*-square-1080x1080.png` | Feed (FB/IG), Marketplace, right column |
| `lark-bf-*-feed-1080x1350.png` | Feed 4:5 (best for IG/FB mobile feed) |
| `lark-bf-*-story-1080x1920.png` | Stories and Reels (text kept clear of the top/bottom UI) |

**A** = "Up to 20% off." (offer-led) · **B** = "Add to cart. Watch it drop." (mechanic-led).
Run both as one ad set and let Meta pick the winner. In Ads Manager, use "Customize asset per
placement" to give each placement its size.

## Primary text (pick 2–3, Meta will rotate them)

1. Black Friday is here. Up to 20% off new guitars, amps and pedals. Add it to your cart and the price drops. No code needed, and shipping is free.
2. That guitar you've been eyeing? Add it to your cart this weekend and watch the price drop, up to 20% off. No code, free shipping.
3. Our biggest sale of the year is on now. Up to 20% off new guitars, amps and pedals, taken off automatically in your cart. Free shipping on everything.
4. 🎸 Black Friday Weekend: up to 20% off. 🔌 Guitars, amps and pedals. 🛒 Price drops in cart, no code. 📦 Free shipping.

## Headlines (max ~40 characters)

- Up to 20% Off. No Code Needed.
- Black Friday: Up to 20% Off Gear
- Add to Cart. Watch It Drop.
- Free Shipping + Up to 20% Off

## Description

- Price drops in cart. Free shipping.
- Guitars, amps and pedals on sale.

## Setup

- **CTA button:** Shop Now
- **Link:** the 20% off collection (same as the email's "Shop 20% off" button). Optionally a second ad pointing at the 15% collection.
- **UTMs:** `utm_source=meta&utm_medium=paid_social&utm_campaign=black_friday_2026`
- **Audiences:** retarget site visitors and add-to-carts (last 30 days) and your Klaviyo list as a custom audience, plus a broad/Advantage+ prospecting set.
- **Schedule:** set the end date to the sale end so ads stop when the prices go back up.

## Edit the images

Change text in `src/ad.html` and re-run `cd src && node render.js`.
