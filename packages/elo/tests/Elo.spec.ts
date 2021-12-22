import Elo from '../src';
import {ok} from 'assert';

describe('Testing Elo ranking system', () => {
  it('should get instance of Elo', () => {
    const elo = new Elo();
    expect(elo).toBeInstanceOf(Elo);
  });
  it('should have expected default options', () => {
    const elo = new Elo();
    expect(elo.getKFactor()).toBe(32);
    expect(elo.getInitialRating()).toBe(1000);
  });
  it('should have expected custom options', () => {
    const elo = new Elo({
      kFactor: 64,
      initialRating: 2000,
    });
    expect(elo.getKFactor()).toBe(64);
    expect(elo.getInitialRating()).toBe(2000);
  });
  describe('Test performance', () => {
    it('should calculate expected performance', () => {
      const {Ea, Eb} = new Elo().calculatePerformance(1400, 1200);
      ok(Ea >= 0 && Ea <= 1);
      ok(Eb >= 0 && Eb <= 1);
      ok(Ea > Eb);
      expect(Ea + Eb).toBeCloseTo(1);
    });
    it('should get performance of 0.5', () => {
      const performance = new Elo().calculatePerformance(1000, 1000);
      expect(performance.Ea).toBe(0.5);
      expect(performance.Eb).toBe(0.5);
    });
    it('should calcule same known score', () => {
      const rating = 1613;
      const opponents = [
        {rating: 1609, score: 0.506},
        {rating: 1477, score: 0.686},
        {rating: 1388, score: 0.785},
        {rating: 1586, score: 0.539},
        {rating: 1720, score: 0.351},
      ];
      const elo = new Elo({kFactor: 32});
      opponents.forEach(({rating: opponentRating, score}) => {
        const {Ea, Eb} = elo.calculatePerformance(rating, opponentRating);
        expect(Ea).toBeCloseTo(score);
        expect(Eb).toBeCloseTo(1 - score);
      });
    });
  });
  describe('Calculate new elo rating', () => {
    it('should get new rating', () => {
      const elo = new Elo({kFactor: 20});
      const newRating = elo.calculateRating(1800, 2005, 0.5);
      expect(newRating.Ra).toBeCloseTo(1805, 0);
      expect(newRating.Rb).toBeCloseTo(2000, 0);
    });
    it('should get new rating', () => {
      const elo = new Elo({kFactor: 20});
      const newRating = elo.calculateRating(1800, 2005, 1);
      expect(newRating.Ra).toBeCloseTo(1815, 0);
      expect(newRating.Rb).toBeCloseTo(1990, 0);
    });
    it('should get new rating', () => {
      const elo = new Elo({kFactor: 20});
      const newRating = elo.calculateRating(1800, 2005, 0);
      expect(newRating.Ra).toBeCloseTo(1795, 0);
      expect(newRating.Rb).toBeCloseTo(2010, 0);
    });
  });
});
