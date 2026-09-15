# Dubai Mortgage Calculator

Standalone portfolio edition of the Smart Indexes mortgage calculator for Dubai residential property.

## Features

- AED / USD mortgage scenarios
- Property value, down payment and loan amount controls
- Annual interest rate and 5–25 year loan term
- Mortgage start month and payoff date
- Amortization schedule and total interest calculation
- Dubai transaction-cost inputs
- Typical Dubai fee auto-fill
- Optional 5% VAT on service fees
- Payment breakdown and required upfront amount
- Chart.js payment / balance visualizations
- Printable calculation
- English / Russian calculation labels supported by the JavaScript logic

## Stack

PHP-compatible HTML, JavaScript, CSS and Chart.js 4.4.2.

No backend framework, database, API key or production Smart Indexes dataset is required.

## Run locally

Place the repository in any PHP-capable web root and open `index.php`.

The calculator itself is client-side. PHP is used only as the page entry point, so it can also be adapted to a static HTML deployment.

## Notes

The AED/USD conversion uses the fixed AED peg reference used by the original calculator (`3.6725 AED per USD`).

Fee presets are provided for estimation only. Users should verify current fees, bank terms and transaction costs with their bank, broker, conveyancer or the relevant authority before making financial decisions.

## Portfolio edition

This repository contains the calculator interface and calculation logic only. Smart Indexes site navigation, production page wrappers, production asset paths and unrelated website code are excluded.

Original product: Smart Indexes — Mortgage Calculator for Dubai residential property.

© Smart Indexes. Portfolio source code published for demonstration purposes. No permissive software license is granted by this repository.
