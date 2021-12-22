import {EventEmitter} from '../src';

describe('EventEmitter test', () => {
  it('should on be called', () => {
    const emitter = new EventEmitter();
    const spy = jest.fn();
    emitter.on('test', spy);
    emitter.emit('test');
    emitter.emit('test');
    expect(spy).toHaveBeenCalledTimes(2);
  });
  it('should once be called', () => {
    const emitter = new EventEmitter();
    const spy = jest.fn();
    emitter.once('test', spy);
    emitter.emit('test');
    emitter.emit('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should off be called', () => {
    const emitter = new EventEmitter();
    const spy = jest.fn();
    emitter.on('test', spy);
    emitter.off('test', spy);
    emitter.emit('test');
    expect(spy).toHaveBeenCalledTimes(0);
  });
  it('should emit only is validation with on', () => {
    const emitter = new EventEmitter();
    const spy = jest.fn();
    let i = 0;
    emitter.on('test', spy, () => ++i >= 2);
    emitter.emit('test');
    expect(spy).toHaveBeenCalledTimes(0);
    emitter.emit('test');
    expect(spy).toHaveBeenCalledTimes(1);
    emitter.emit('test');
    expect(spy).toHaveBeenCalledTimes(2);
  });
  it('should emit only is validation with once', () => {
    const emitter = new EventEmitter();
    const spy = jest.fn();
    let i = 0;
    emitter.once('test', spy, () => ++i >= 2);
    emitter.emit('test');
    expect(spy).toHaveBeenCalledTimes(0);
    emitter.emit('test');
    expect(spy).toHaveBeenCalledTimes(1);
    emitter.emit('test');
    expect(spy).toHaveBeenCalledTimes(1);
  });
  describe('Sub EventEmitter tests', () => {
    it('should on be called', () => {
      const emitter = new EventEmitter();
      const subEmitter = emitter.subEmitter();
      const spy = jest.fn();
      subEmitter.on('test', spy);
      subEmitter.emit('test');
      subEmitter.emit('test');
      expect(spy).toHaveBeenCalledTimes(2);
    });
    it('should once be called', () => {
      const emitter = new EventEmitter();
      const subEmitter = emitter.subEmitter();
      const spy = jest.fn();
      subEmitter.once('test', spy);
      subEmitter.emit('test');
      subEmitter.emit('test');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should off be called', () => {
      const emitter = new EventEmitter();
      const subEmitter = emitter.subEmitter();
      const spy = jest.fn();
      subEmitter.on('test', spy);
      subEmitter.off('test', spy);
      subEmitter.emit('test');
      expect(spy).toHaveBeenCalledTimes(0);
    });
    it('should parent not receive events from his children',()=>{
      const emitter = new EventEmitter();
      const subEmitter = emitter.subEmitter();
      const spy = jest.fn();
      emitter.on('test', spy);
      subEmitter.on('test', spy);
      subEmitter.emit('test');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should children receive events from his parent',()=>{
      const emitter = new EventEmitter();
      const subEmitter = emitter.subEmitter();
      const spy = jest.fn();
      emitter.on('test', spy);
      subEmitter.on('test', spy);
      emitter.emit('test');
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
