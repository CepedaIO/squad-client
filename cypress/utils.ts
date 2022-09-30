// Utility to match GraphQL mutation based on the operation name
import {CyHttpMessages} from "cypress/types/net-stubbing";
import {App} from "./fixtures/data";
import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {appConfig} from "../src/configs/app";
import config from "./config";

export const  login = (email: string) => {
  window.localStorage.setItem('auth', email);
}

export const hasOperationName = (req: CyHttpMessages.IncomingHttpRequest, operationName: string) => {
  const { body } = req
  return body.hasOwnProperty('operationName') && body.operationName === operationName;
}

// Alias query if operationName matches
export const aliasQuery = (req:CyHttpMessages.IncomingHttpRequest, operationName:string) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`
  }
}

// Alias mutation if operationName matches
export const aliasMutation = (req:CyHttpMessages.IncomingHttpRequest, operationName:string) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`
  }
}

export const dataCY = (tag: string) => cy.get(`[data-cy="${tag}"]`);
export const click = (tag: string) => dataCY(tag).click();
export const visit = (relative: string) => cy.visit(`${config.client}/${relative}`);
export const wait = (queries: string[], mutations: string[] = [], between?: () => void) => {
  cy.intercept('POST', `${config.server}`, (req) => {
    queries.forEach((query) => aliasQuery(req, query))
    mutations.forEach((mutation) => aliasMutation(req, mutation));
  });

  between && between();

  return queries.map((query) => `@gql${query}Query`)
    .concat(
      mutations.map((mutation) => `@gql${mutation}Mutation`)
    )
    .map((operation) => cy.wait(operation));
}

let failed = false
export const stopOnFirstFail = () => {
  failed = false;
  Cypress.on('fail', (e) => {
    failed = true
    throw e
  })
  
  afterEach(function() {
    if (failed) {
      // @ts-ignore
      Cypress.runner.stop()
    }
  });
}

export const client = new ApolloClient({
  link: createHttpLink({
    uri: 'http://localhost:8100/graphql',
  }),
  cache: new InMemoryCache(),
});
