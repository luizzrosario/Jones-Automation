## Features

- Automated form filling (name, email, phone, company, employees).
- Randomized emails and phone numbers for each test run.
- Validation scenarios (invalid email, empty name, long name).
- Screenshots saved on each run:
  - `screenshots/` → normal execution.
  - `ERRORS/` → failed or crashed runs.
- Detects "Thank You" page after submission or logs failure.

## Project Structure

- `formAutomation.js` → Core automation logic (browser launch, form filling, screenshot, validation).
- `index.js` → Test runner with multiple user scenarios.

## Setup

Install dependencies:

    npm install puppeteer

## Run Tests

Run the test suite:

    node index.js

## Output

- Console logs show each test case execution.
- Screenshots are saved in `screenshots/`.
- Errors/failures are saved in `ERRORS/`.
