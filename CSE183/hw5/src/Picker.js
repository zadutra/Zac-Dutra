import React from 'react';
import moment from 'moment';

/**
 * Simple component with no state.
 *
 * See the basic-react from lecture 11 for an example of adding and
 * reacting to changes in state.
 */

const head = document.getElementsByTagName('HEAD')[0];
const link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'Picker.css';
head.appendChild(link);

const weekdayShort = moment.weekdaysShort();
const weekdayShortName = weekdayShort.map((day) => {
  return (
    <th key = {day} className = "weekday">
      {day}
    </th>

  );
});

const state = {
  dateObject: moment(),
};

const firstDayOfTheMonth = () => {
  const dateObject = state.dateObject;
  const firstDay = moment(dateObject).startOf('month').format('d');
  return firstDay;
};

const blanks = [];
for (let i = 0; i < firstDayOfTheMonth(); i++) {
  blanks.push(
      <td className = 'calendar-day empty'> {''}</td>,
  );
}

const daysInMonth = [];
for (let d = 1; d <= daysInMonth; d++) {
  daysInMonth.push(
      <td key={d} className="calendar-day">
        {d}
      </td>,
  );
}

const totalSlots = [...blanks, ...daysInMonth];
const rows = [];
let cells = [];

totalSlots.forEach((row, i) => {
  if (i % 7 !== 0) {
    cells.push(row);
  } else {
    rows.push(cells);
    cells = [];
    cells.push(row);
  }
  if (i === totalSlots.length - 1) {
    rows.push(cells);
  }
});

const daysinmonth = rows.forEach((d, i) => {
  return <tr>{d}</tr>;
});


/**
   *
   */
class Picker extends React.Component {
  /**
   * @return {object} a <div> containing an <h2>
   */
  render() {
    return (
      <table className="calendar-day">
        <thead>
          <tr id = 'weekday'>{weekdayShortName}</tr>
        </thead>
        <tbody id = 'month'>{daysinmonth}</tbody>
      </table>
    );
  }
}

export default Picker;

