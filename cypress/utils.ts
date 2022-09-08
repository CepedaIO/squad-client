// Utility to match GraphQL mutation based on the operation name
import {CyHttpMessages} from "cypress/types/net-stubbing";
import {App} from "./fixtures/data";

export const login = (email: string) => {
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
export const visit = (relative: string) => cy.visit(`${App.client}/${relative}`);
export const wait = (queries: string[], mutations: string[] = [], between?: () => void) => {
  cy.intercept('POST', `${App.server}`, (req) => {
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
