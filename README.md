# Squad Client

## Cypress first approach

Cypress has been intended to work with and test all features available in the app, including sending and responding to emails

It is highly recommend that you work within the context of Cypress and develop new features by adding your manual interactions as Cypress tests

## Update GraphQL Schema

Take full of advantage of GraphQL's auto-completion by ensuring your local schema is up-to-date whenever the API changes:

```bash
yarn schema
```

## Rebuild image

Whenever you make changes to files outside of `src` (such as .env or package.json), you must re-build the image and restart the server before they take effect

```bash
cd ./services/client
docker compose build client
cpa ws restart client
```

## Working locally

When working locally, you have to link the `shared` library with the server to get the most up to date version

```bash
cd ./services/shared
yarn link
cd ./services/client
yarn link "squad-shared"
```
