# Eventify – Event & Workshop Management Platform (frontend)

Static frontend built with HTML5, CSS3 and vanilla JavaScript. No build step, no dependencies.

## Run it
Open `index.html` in a browser, or serve the folder: `python -m http.server 8000` then visit http://localhost:8000

## Structure
`index/events/about/contact/login/register/payment.html`, `assets/css/style.css`, `assets/js/script.js`, `assets/images/` (SVG illustrations).

## What works now
Responsive navbar, event search and category filters, event detail dialog, form validation, show/hide password, toasts, and a payment page that reads `?event=<id>`.
Nothing is saved: no login, no database, no payment. `<body data-static>` keeps valid forms from submitting.

## Flask integration
1. Move the HTML files to `templates/`, the `assets/` folder to `static/`, and use `url_for('static', filename='...')` for asset paths.
2. Navbar and footer are injected by `script.js` (`buildLayout`). Replace them with a `base.html` layout and `{% extends %}`.
3. `EVENTS` in `script.js` is sample data. Render events with Jinja loops or serve JSON from Flask.
4. The students table on the home page is sample data. Replace the rows with a Jinja loop over your database query.
5. Remove `data-static` from `<body>` so forms POST to Flask. Set each form's `action` to your route.
6. Payment: create a Razorpay **test-mode** order on the server, open Checkout from the `#pay-now` handler (see comment in `initPayment`), and verify the signature server-side. The four payment states (checkout, processing, success, failure) are in `payment.html`; the "UI preview" buttons are for demos and should be removed.

## Images
Event images are generated SVG illustrations so the project works offline. Replace them with real event photos in `assets/images/` and update the `img` field in `EVENTS`.
