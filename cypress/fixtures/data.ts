import {DateTime} from "luxon";

export const App = {
  client: 'http://localhost:3100',
  server: 'http://localhost:8100'
}

export const User = {
  email: 'cypress@cepeda.io'
};

export const Member = {
  displayName: 'TestUser',
  availability: {
    start: DateTime.now().plus({ days: 1, hours: 9 }).startOf('hour').toISO(),
    end: DateTime.now().plus({ days: 1, hours: 17 }).startOf('hour').toISO()
  }
};

export const Invite = {
  member: {
    displayName: 'InvitedUser',
    email: 'cypress-invited@cepeda.io',
    availability: {
      start: DateTime.now().plus({ days: 1, hours: 9 }).startOf('hour').toISO(),
      end: DateTime.now().plus({ days: 1, hours: 17 }).startOf('hour').toISO()
    }
  },
  message: 'This is a test invite to a test user'
};

export const Event = {
  name: 'Luna Event',
  description: 'This is an event dedicated to telling Luna how amazing she is',
  img: 'https://cepeda.io/pictures/luna5.jpg',
  duration: {
    hours: 1
  }
}
