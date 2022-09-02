import {DateTime} from "luxon";

export const App = {
  client: 'http://localhost:3000',
  server: 'http://localhost:8080'
}

export const User = {
  email: 'test@cepeda.io'
};

export const Member = {
  displayName: 'TestUser',
  availability: {
    start: DateTime.now().plus({ days: 1, hours: 9 }).startOf('hour').toISO(),
    end: DateTime.now().plus({ days: 1, hours: 17 }).startOf('hour').toISO()
  }
}

export const Event = {
  name: 'test-event',
  description: 'This is a test event',
  duration: {
    hours: 1
  }
}
