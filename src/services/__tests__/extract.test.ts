import { extractWidths } from '../extract';

describe('extractWidths', function() {
  it('should extract tailwind widths from classnames', function() {
    const [remaining, extracted] = extractWidths('w-full p-2 m-45');
    expect(remaining).equals('p-2 m-45');
    expect(extracted).equals('w-full');
  });

  it('should output an empty string when nothing to extract', function() {
    const [remaining, extracted] = extractWidths('p-2 m-45');
    expect(remaining).equals('p-2 m-45');
    expect(extracted).equals('');
  });

  it('should output an empty string when everything is extracted', function() {
    const [remaining, extracted] = extractWidths('w-full min-w-md max-w-screen-l');
    expect(remaining).equals('');
    expect(extracted).equals('w-full min-w-md max-w-screen-l');
  });

  it('should extract when a single class', function() {
    const [remaining, extracted] = extractWidths('w-full');
    expect(remaining).equals('');
    expect(extracted).equals('w-full');
  });
});
