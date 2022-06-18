import { DateTime } from 'luxon';

export const roomRemainingTimeFromCreateTime = (dateString: string) => {
  const iso8601 = dateString.replace(' ', 'T').replace(' GMT', '+00:00');

  const startTime = DateTime.fromISO(iso8601);

  const endTime = startTime.plus({ hours: 6 });

  // @ts-ignore
  const remainingTimeInMillis = endTime.ts - DateTime.local().ts;

  // ６時間以上経過している場合は残り時間なしとする
  // @ts-ignore
  if (DateTime.local().ts - endTime.ts > 0) {
    return '00:00:00';
  }

  return DateTime.fromMillis(remainingTimeInMillis, { zone: 'GMT' }).toFormat('HH:mm:ss');
};
