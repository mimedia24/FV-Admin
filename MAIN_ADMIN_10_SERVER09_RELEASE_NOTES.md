# FoodVerse Main Admin 10

This package is based on `admin09.zip` and is connected to the APIs in
`server09.zip`.

## Added and corrected

- Added a recoverable Main Admin **Order Trash** page.
- Added restore action through `PATCH /api/admin/order/:orderId/restore`.
- Renamed the order action from Delete to Trash.
- Disabled Trash for active orders; an order must be cancelled first.
- Rebuilt the Admin Order Timeline using the same normalized status stages as
  Server09, including Ready for Pickup and Cancelled states.
- Improved notification upload feedback for large images and now displays the
  real server validation message.
- Preserved the existing `zone-management` page for Agent account and
  zone-delivery-charge control; no duplicate Agent Management page was added.
- Preserved the existing bKash Zone Ledger and central Profit Report flows.

## Deployment order

1. Deploy/start Server09.
2. Deploy this Main Admin build.
3. Confirm the production API base in `secrets.js` / environment configuration.

No User App, Rider App or Agent Panel files are included or modified in this
package.

## Verification

- Clean dependency installation
- Targeted ESLint checks for every changed page/component
- Production Vite build
- 11 required Main Admin/Server route contract checks
- 36 Server09 regression tests
- ZIP integrity validation
