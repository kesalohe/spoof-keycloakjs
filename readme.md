# Example On How To Fake Keycloak Authentication With Cypress

Example on how to fake an authentication flow using Keycloak.js without changing its configuration.
There are 2 Cypress tests to illustrate either authentication code flow or implicit flow.
Notes on how this works can be found at: https://kesalohe.xyz/faking-keycloak-js-authentication/

Both flows are tested in [spoof-keycloak.cy.js](/cypress/cypress/e2e/spoof-keycloak.cy.js).

## Running The Tests

```bash
cd webapp/
python -m http.server &
cd ../cypress
npm install
npx cypress run
```

