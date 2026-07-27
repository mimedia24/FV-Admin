# Main Admin 12 — Frontend-only correction

This release is designed for the existing `sever11.zip` API contract. It does
not require or include a Server or User App change.

## Corrected

- Added a clearly visible **App Update Control** item directly below Dashboard.
- Added `/app-update` as a protected Main Admin route.
- Dashboard now loads the complete active-order directory and calculates:
  - Today Order
  - Total Order
  - Weekly and monthly summaries
  - Saturday-to-Friday chart
  - Food sale, restaurant sale, delivery, rider tip and delivery profit
- Orders with `isArchived === true` are excluded from every dashboard figure.
- Bangladesh calendar boundaries are used in the browser.
- Replaced the broken wide Order Trash table with responsive order cards.
- Trash cards show restaurant, customer, phone, zone, amount, delivery, tip,
  payment, status, order date, archive date and archive reason.
- Restore remains available through the existing Server endpoint.
- Removed the broken permanent-delete request because `sever11.zip` does not
  expose a permanent-delete endpoint. This prevents the previous 404 error.

## Important compatibility note

Permanent database deletion cannot be safely implemented in frontend code.
The supplied `sever11.zip` supports archive and restore only. Adding permanent
deletion would require a separate Server change and explicit approval.
