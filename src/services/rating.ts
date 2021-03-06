import { ForecastPoint } from '@src/clients/stormGlass';
import { Beach, GeoPositiion } from '@src/models/beach';

const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHigh: {
    min: 1.0,
    max: 2.0,
  },
  headHigh: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(private beach: Beach) {}

  public getRatingBasedOnWindAndWavePositions(
    wavePosition: GeoPositiion,
    windPosition: GeoPositiion
  ): number {
    if (wavePosition === windPosition) {
      return 1;
    } else if (this.isWindOffShore(wavePosition, windPosition)) {
      return 5;
    }

    return 3;
  }

  public getRatingForSwellPeriod(period: number): number {
    if (period >= 7 && period < 10) return 2;

    if (period >= 10 && period < 14) return 4;

    if (period >= 14) return 5;

    return 1;
  }

  public getRateForPoint(point: ForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection);
    const windDirection = this.getPositionFromLocation(point.windDirection);
    const windAndWaveRating = this.getRatingBasedOnWindAndWavePositions(
      swellDirection,
      windDirection
    );
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);
    const finalRating =
      (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;

    return Math.round(finalRating);
  }

  public getRatingForSwellSize(height: number): number {
    if (
      height >= waveHeights.ankleToKnee.min &&
      height < waveHeights.ankleToKnee.max
    )
      return 2;

    if (
      height >= waveHeights.waistHigh.min &&
      height < waveHeights.waistHigh.max
    )
      return 3;

    if (height >= waveHeights.headHigh.min) return 5;

    return 1;
  }

  public getPositionFromLocation(coordinates: number): GeoPositiion {
    if (coordinates > 310 || (coordinates < 50 && coordinates >= 0))
      return GeoPositiion.N;

    if (coordinates >= 50 && coordinates < 120) return GeoPositiion.E;

    if (coordinates >= 120 && coordinates < 220) return GeoPositiion.S;

    if (coordinates >= 220 && coordinates < 310) return GeoPositiion.W;

    return GeoPositiion.E;
  }

  private isWindOffShore(
    wavePosition: GeoPositiion,
    windPosition: GeoPositiion
  ): boolean {
    return (
      (wavePosition === GeoPositiion.N &&
        windPosition === GeoPositiion.S &&
        this.beach.position === GeoPositiion.N) ||
      (wavePosition === GeoPositiion.S &&
        windPosition === GeoPositiion.N &&
        this.beach.position === GeoPositiion.S) ||
      (wavePosition === GeoPositiion.E &&
        windPosition === GeoPositiion.W &&
        this.beach.position === GeoPositiion.E) ||
      (wavePosition === GeoPositiion.W &&
        windPosition === GeoPositiion.E &&
        this.beach.position === GeoPositiion.W)
    );
  }
}
