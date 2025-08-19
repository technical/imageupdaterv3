// Test date formatting
const testDrawDate = 'Tuesday';

const today = new Date();
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const targetDay = daysOfWeek.indexOf(testDrawDate);
const currentDay = today.getDay();

let daysUntilTarget = targetDay - currentDay;
// If it's the same day (tonight's draw), use today
// If it's in the past this week, add 7 to get next week
if (daysUntilTarget < 0) daysUntilTarget += 7;

const targetDate = new Date(today);
targetDate.setDate(today.getDate() + daysUntilTarget);

// Format as "Tuesday 19th August"
const day = targetDate.getDate();
const month = targetDate.toLocaleDateString('en-GB', { month: 'long' });
const ordinal = day + (day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th');

const drawDateFormatted = `${testDrawDate} ${ordinal} ${month}`;

console.log('Today is:', today.toDateString());
console.log('Current day index:', currentDay, '(' + daysOfWeek[currentDay] + ')');
console.log('Target day:', testDrawDate, '(index:', targetDay + ')');
console.log('Days until target:', daysUntilTarget);
console.log('Target date:', targetDate.toDateString());
console.log('Formatted output:', drawDateFormatted);