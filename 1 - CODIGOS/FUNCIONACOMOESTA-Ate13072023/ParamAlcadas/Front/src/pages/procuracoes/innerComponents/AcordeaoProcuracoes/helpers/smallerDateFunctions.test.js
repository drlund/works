import { dateToBRTimezoneString } from 'utils/dateToBRTimezoneString';
import { getSmallerDateFromSubsidiarias, getSmallerDate } from './smallerDateFunctions';

describe('smallerDateFunctions.js', () => {
  describe('edge cases', () => {
    describe('getSmallerDateFromSubsidiarias()', () => {
      it('returns null when subsidiarias array have only null dates', () => {
        expect(
          getSmallerDateFromSubsidiarias([])
        ).toEqual(null);
      });
    });

    describe('getSmallerDate()', () => {
      it('returns null when both dates are null', () => {
        expect(
          getSmallerDate(null, null)
        ).toEqual(null);
      });
    });

    describe('getSmallerDateNum()', () => {
      it('returns the date2 when date1 is null', () => {
        const date = '2020-01-01';
        expect(
          getSmallerDate(null, date)
        ).toEqual(new Date(date));
      });

      it('returns the smaller of two dates', () => {
        const date1 = '2020-01-01';
        const date2 = '2021-01-01';
        expect(
          getSmallerDate(date1, date2)
        ).toEqual(new Date(date1));
      });
    });
  });
});
