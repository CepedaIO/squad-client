import extractWidths from '../extractWidths';

describe('extractWidths', function() {
  it('should extract tailwind widths from classnames', function() {
    const [remaining, extracted] = extractWidths('w-full p-2 m-45');
    expect(remaining).toEqual('p-2 m-45');
    expect(extracted).toEqual('w-full');
  });

  it('should output an empty string when nothing to extract', function() {
    const [remaining, extracted] = extractWidths('p-2 m-45');
    expect(remaining).toEqual('p-2 m-45');
    expect(extracted).toEqual('');
  });

  it('should output an empty string when everything is extracted', function() {
    const [remaining, extracted] = extractWidths('w-full min-w-md max-w-screen-l');
    expect(remaining).toEqual('');
    expect(extracted).toEqual('w-full min-w-md max-w-screen-l');
  });
});
