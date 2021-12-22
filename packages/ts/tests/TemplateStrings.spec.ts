import ts from '../src/index';

describe('TemplateStrings', () => {
  it('should return the correct string', () => {
    expect(ts('Hello {world} !', {world: 'World'})).toBe('Hello World !');
    expect(ts('Hello {world} !', {})).toBe('Hello {world} !');
    expect(ts('Hello {world.planet} !', {planet: 'World'})).toBe('Hello {world.planet} !');
    expect(ts('{a.huge.hello} {a.big.world} !', {a: {huge: {hello: 'Hello'}, big: {world: 'World'}}})).toBe(
      'Hello World !'
    );
  });
});
