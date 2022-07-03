import { DateTime } from 'luxon';

interface ResponseType {
  type: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
  duration: number;
}

export const dateTimeFromNow = (millis: number): ResponseType => {
  const from = DateTime.fromMillis(millis);

  if (from.diffNow('seconds').seconds > 0) {
    // +のときは未来の時間なので無視
    return {
      type: 'seconds',
      duration: 0,
    };
  } else if (from.diffNow('years').years <= -1) {
    return {
      type: 'years',
      duration: Math.floor(Math.abs(from.diffNow('years').years)),
    };
  } else if (from.diffNow('months').months <= -1) {
    return {
      type: 'months',
      duration: Math.floor(Math.abs(from.diffNow('months').months)),
    };
  } else if (from.diffNow('weeks').weeks <= -1) {
    return {
      type: 'weeks',
      duration: Math.floor(Math.abs(from.diffNow('weeks').weeks)),
    };
  } else if (from.diffNow('days').days <= -1) {
    return {
      type: 'days',
      duration: Math.floor(Math.abs(from.diffNow('days').days)),
    };
  } else if (from.diffNow('hours').hours <= -1) {
    return {
      type: 'hours',
      duration: Math.floor(Math.abs(from.diffNow('hours').hours)),
    };
  } else if (from.diffNow('seconds').seconds < -59) {
    return {
      type: 'minutes',
      duration: Math.floor(Math.abs(from.diffNow('minutes').minutes)),
    };
  } else {
    return {
      type: 'seconds',
      duration: Math.floor(Math.abs(from.diffNow('seconds').seconds)),
    };
  }
};
