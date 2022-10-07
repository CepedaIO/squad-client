// Utility to match GraphQL mutation based on the operation name
import {CyHttpMessages} from "cypress/types/net-stubbing";
import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import config from "./config";
import "cypress-real-events/support";

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
export const visit = (relative: string) => relative.includes(config.client) ? cy.visit(relative) : cy.visit(`${config.client}/${relative}`);
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

export const manuallyLogin = (email:string) => {
  dataCY('email').type(email);
  
  const [Login] = wait([], ['Login'], () => dataCY('submit').click());
  Login.then(({ response }) => {
    expect(response!.statusCode).to.equal(200);
    expect(response!.body.data.login.success).to.equal(true);
  });
  
  cy.task('getLastEmail', email).its('html').then((email) => {
    cy.document().invoke('write', email);
    cy.contains('Expire after 2 weeks').click();
    cy.location('pathname').should('contain', 'login-with');
  });
  
  const [UseLoginToken] = wait([], ['UseLoginToken']);
  UseLoginToken.then(({ response }) => {
    expect(response!.statusCode).to.equal(200);
    expect(response!.body.data.useLoginToken.success).to.equal(true);
  });
  
  dataCY('navigate:home').click();
};

export const client = new ApolloClient({
  link: createHttpLink({
    uri: 'http://localhost:8100/graphql',
  }),
  cache: new InMemoryCache(),
});
