import Logger from '../src';

describe('Logger', () => {
  const Log = Logger();
  test('log error', () => {
    const log = Log.error('log1', {hello: 'world'});
    expect(log.level.name).toBe('error');
    expect(log.message).toBe('log1');
    expect(log.metadata).toEqual({hello: 'world'});
  });
  test('log warn', () => {
    const log = Log.warn('log2', {hello: 'world'});
    expect(log.level.name).toBe('warn');
    expect(log.message).toBe('log2');
    expect(log.metadata).toEqual({hello: 'world'});
  });
  test('log info', () => {
    const log = Log.info('log3', {hello: 'world'});
    expect(log.level.name).toBe('info');
    expect(log.message).toBe('log3');
    expect(log.metadata).toEqual({hello: 'world'});
  });
  test('log debug', () => {
    const log = Log.debug('log4', {hello: 'world'});
    expect(log.level.name).toBe('debug');
    expect(log.message).toBe('log4');
    expect(log.metadata).toEqual({hello: 'world'});
  });
  describe('Logger with extra level', () => {
    const Log = Logger({
      levels: {
        extra: {
          color: '#ff0000',
          level: 1,
        },
      },
    });
    test('log extra', () => {
      const log = Log.extra('log5', {hello: 'world'});
      expect(log.level.name).toBe('extra');
      expect(log.message).toBe('log5');
      expect(log.metadata).toEqual({hello: 'world'});
    });
    test('should have extra in level list', () => {
      expect(Log.getLevels()).toContain('extra');
    });
  });
});
