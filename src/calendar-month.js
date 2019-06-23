import React from "react";
import PropTypes from "prop-types";
import CalendarWeek from "./calendar-week";

const daysOfWeek = ["Mon", "Tue", "Wed", "The", "Fri", "Sat", "Sun"];

class CalendarMonth extends React.Component {
  static propTypes = {
    getFirstDayOfMonth: PropTypes.number,
    daysInMonth: PropTypes.number,
    actualDate: PropTypes.object,
    selectServiceDate: PropTypes.func
  };

  createArrayWithEmptyCells = length => new Array(length).fill(null);

  getArrayOfDaysInMonth = days => {
    const firstEmptyCells = this.createArrayWithEmptyCells(
      this.props.getFirstDayOfMonth
    );
    const valueOfDaysInMonth = this.createArrayWithEmptyCells(days).map(
      (_, index) => index + 1
    );
    const finalFormOfMonth = [...firstEmptyCells, ...valueOfDaysInMonth];
    const restEmptyCells = finalFormOfMonth.length % 7;
    return restEmptyCells > 0
      ? [
          ...finalFormOfMonth,
          ...this.createArrayWithEmptyCells(7 - restEmptyCells)
        ]
      : finalFormOfMonth;
  };

  getDividedArray = array => {
    const smallArrays = [];
    while (array.length > 0) {
      smallArrays.push([array.splice(0, 7)]);
    }
    return smallArrays;
  };

  render() {
    const { actualDate, daysInMonth, selectServiceDate } = this.props;
    const arrayOfDaysInMonth = this.getArrayOfDaysInMonth(daysInMonth);
    const dividedArray = this.getDividedArray(arrayOfDaysInMonth);
    return (
      <table className="table" id="calendar">
        <thead>
          <tr>
            {daysOfWeek.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody id="calendar-body">
          {dividedArray &&
            dividedArray.map(array => (
              <CalendarWeek
                selectServiceDate={selectServiceDate}
                actualDate={actualDate}
                key={array}
                days={array}
              />
            ))}
        </tbody>
      </table>
    );
  }
}

export default CalendarMonth;
