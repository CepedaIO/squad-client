import {click, dataCY, manuallyLogin, stopOnFirstFail, visit, wait} from "../utils";
import {User, Event, Invite, Invite2} from "../fixtures/data";
import {DateTime} from "luxon";
import DateAndTime from "../../src/services/input-types/datetime";
import {deleteTestData, loginTestUser} from "../api";

describe('Create Event', () => {
  stopOnFirstFail();
  before(() => deleteTestData());
  
  it('should create a event', () => {
    const eventStart = DateTime.now().startOf('month').startOf('day');
    const eventEnd = DateTime.now().endOf('month').endOf('day');
    const start = DateTime.now().startOf('month').plus({ days: 1 }).startOf('day');
    const end = DateTime.now().startOf('month').plus({ days: 10 }).endOf('day');
    
    loginTestUser(User.member.email);
    visit('home');
    click('create:event');
    dataCY('name').type(Event.name);
    dataCY('img').type(Event.img);
    dataCY('description').type(Event.description);
    dataCY('duration:select').select(Object.keys(Event.duration)[0]);
    dataCY('duration:input').clear().type(Object.values(Event.duration)[0].toString());
    dataCY('displayName').type(User.member.displayName);
  
    dataCY('event:availability').click();
    dataCY('event:availability:start').type(DateAndTime.out(eventStart))
    dataCY('event:availability:end').type(DateAndTime.out(eventEnd))
    dataCY('event:availability:submit').click();
    
    dataCY('member:availability').click();
    dataCY('member:availability:start').type(DateAndTime.out(start))
    dataCY('member:availability:end').type(DateAndTime.out(end))
    dataCY('member:availability:submit').click();
  
    dataCY('member:availability').click();
    dataCY('member:availability:start').type(DateAndTime.out(start.plus({ weeks: 2 })))
    dataCY('member:availability:end').type(DateAndTime.out(end.plus({ weeks: 2 })))
    dataCY('member:availability:submit').click();
    
    const [CreateEvent] = wait([], ['CreateEvent'], () => dataCY('submit:event').click());
    CreateEvent.then(({response}) => {
      expect(response!.statusCode).to.equal(200);
      expect(response!.body.errors).to.be.undefined;
      expect(response!.body.data.createEvent.id).to.not.be.undefined;
    });
    
    cy.location('pathname').should('contain', 'home');
    cy.get('.event-card').its('length').should('eq', 1);
  });
});

describe('Invite User1', () => {
  it('should invite user', () => {
    loginTestUser(User.member.email);
    visit('home');
    dataCY('event:card:0').click();
    dataCY('invite:create').click();
    dataCY('email').type(Invite.member.email);
    dataCY('message').type(Invite.message);
  
    const [InviteMember] = wait([], ['InviteMember'], () => dataCY('invite:submit').click());
    InviteMember.then(({ response }) => {
      expect(response!.statusCode).to.equal(200);
      expect(response!.body.errors).to.be.undefined;
      expect(response!.body.data.inviteMember.success).to.equal(true);
    });
  });
  
  it('should accept invitation to event', () => {
    const start = DateTime.now().startOf('month').plus({ days: 3 }).startOf('day');
    const end = DateTime.now().startOf('month').plus({ days: 12 }).endOf('day');

    loginTestUser(Invite.member.email);
    cy.task('getLastEmail', Invite.member.email).its('html').then((email) => {
      cy.document().invoke('write', email);
      cy.contains('Accept').click();
      cy.location('pathname').should('contain', 'invite');
    });
  
    dataCY('displayName').type(Invite.member.displayName);
    
    dataCY('member:availability').click();
    dataCY('member:availability:start').type(DateAndTime.out(start))
    dataCY('member:availability:end').type(DateAndTime.out(end))
    dataCY('member:availability:submit').click();
  
    dataCY('member:availability').click();
    dataCY('member:availability:start').type(DateAndTime.out(start.plus({ weeks: 2 })))
    dataCY('member:availability:end').type(DateAndTime.out(end.plus({ weeks: 2 })))
    dataCY('member:availability:submit').click();
    dataCY('submit').click();
  });
});

describe('Invite User2', () => {
  it('should invite user', () => {
    loginTestUser(User.member.email);
    visit('home');
    dataCY('event:card:0').click();
    dataCY('invite:create').click();
    dataCY('email').type(Invite2.member.email);
    dataCY('message').type(Invite2.message);
    
    const [InviteMember] = wait([], ['InviteMember'], () => dataCY('invite:submit').click());
    InviteMember.then(({ response }) => {
      expect(response!.statusCode).to.equal(200);
      expect(response!.body.errors).to.be.undefined;
      expect(response!.body.data.inviteMember.success).to.equal(true);
    });
  });
  
  it('should accept invitation to event', () => {
    const start = DateTime.now().startOf('month').plus({ days: 5 }).startOf('day');
    const end = DateTime.now().startOf('month').plus({ days: 14 }).endOf('day');

    cy.task('getLastEmail', Invite2.member.email).its('html').then((email) => {
      cy.document().invoke('write', email);
      cy.contains('Accept').click();
      cy.location('pathname').should('contain', 'invite');
    });
  
    manuallyLogin(Invite2.member.email);
    dataCY('invite:summary:0').click();
    
    dataCY('displayName').type(Invite2.member.displayName);
    dataCY('member:availability').click();
    dataCY('member:availability:start').type(DateAndTime.out(start))
    dataCY('member:availability:end').type(DateAndTime.out(end))
    dataCY('member:availability:submit').click();
  
    dataCY('member:availability').click();
    dataCY('member:availability:start').type(DateAndTime.out(start.plus({ weeks: 2 })))
    dataCY('member:availability:end').type(DateAndTime.out(end.plus({ weeks: 2 })))
    dataCY('member:availability:submit').click();
    dataCY('submit').click();
  });
});

describe('Join by link', () => {
  let joinLink: string = '';
  it('should copy event join link', () => {
    loginTestUser(User.member.email);
    visit('home');
    dataCY('event:card:0').click();
    cy.get('[data-cy="join-link"]').realClick()
    cy.window().then(async (win: Window) => {
      joinLink = await win.navigator.clipboard.readText()
    });
  });
  
  it('should create join request', () => {
    const start = DateTime.now().startOf('month').plus({ days: 7 }).startOf('day');
    const end = DateTime.now().startOf('month').plus({ days: 16 }).endOf('day');
    
    loginTestUser('join-user@cepeda.io');
    visit(joinLink);
    dataCY('displayName').type('UserFromJoin');
    dataCY('member:availability').click();
    dataCY('member:availability:start').type(DateAndTime.out(start))
    dataCY('member:availability:end').type(DateAndTime.out(end))
    dataCY('member:availability:submit').click();
  
    dataCY('member:availability').click();
    dataCY('member:availability:start').type(DateAndTime.out(start.plus({ weeks: 2 })))
    dataCY('member:availability:end').type(DateAndTime.out(end.plus({ weeks: 2 })))
    dataCY('member:availability:submit').click();
    dataCY('submit').click();
  })
})

describe('Accept Pending Memberships', () => {
  it('should accept pending membership', () => {
    loginTestUser(User.member.email);
    visit('home');
    dataCY('event:card:0').click();
    dataCY('accept:pending:0').click();
  });
});

describe.only('Publish event times', () => {
  it('should choose and publish event time', () => {
    loginTestUser(User.member.email);
    visit('home')
    dataCY('event:card:0').click();
    dataCY('event:time:0').click();
    dataCY('submit:event:time').click();
  });
});
