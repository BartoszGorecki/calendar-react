import React from "react";
import PropTypes from "prop-types";

const eventsInUk = ["27.05.2019", "26.05.2019", "03.06.2019"];

class CalendarWeek extends React.Component {
  static propTypes = {
    actualDate: PropTypes.object,
    days: PropTypes.array,
    selectServiceDate: PropTypes.func
  };

  isEventDay = ({ currentmonth, currentyear }, dayOfMonth, events) =>
    events.some(
      event =>
        +event.slice(0, 2) === dayOfMonth &&
        +event.slice(3, 5) === currentmonth &&
        +event.slice(6, 10) === currentyear
    );

  isWeekDay = index => index !== 5 && index !== 6;

  isCurrentDay = dayOfMonth => dayOfMonth === new Date().getDate();

  isFutureDay = ({ currentmonth, currentyear }, dayOfMonth) => {
    if (!this.isCurrentMonth(currentmonth, currentyear)) return true;
    return dayOfMonth >= new Date().getDate();
  };

  isCurrentMonth = (currentmonth, currentyear) =>
    currentmonth === new Date().getMonth() &&
    currentyear === new Date().getFullYear();

  highlightActualDate = ({ currentmonth, currentyear }, dayOfMonth) =>
    this.isCurrentDay(dayOfMonth) &&
    this.isCurrentMonth(currentmonth, currentyear);

  availableDaysExceptEvents = (actualDate, dayOfMonth, index) =>
    this.isWeekDay(index) &&
    this.isFutureDay(actualDate, dayOfMonth) &&
    !this.isEventDay(actualDate, dayOfMonth, eventsInUk);

  render() {
    const { actualDate, selectServiceDate } = this.props;
    return (
      <tr>
        {this.props.days[0].map((item, index) => (
          <td
            onClick={
              this.availableDaysExceptEvents(actualDate, item, index)
                ? () => selectServiceDate(item)
                : null
            }
            className={`${
              item
                ? this.availableDaysExceptEvents(actualDate, item, index)
                  ? "available"
                  : "unavailable"
                : ""
            } ${this.highlightActualDate(actualDate, item) ? "today" : ""}`}
            key={index}
          >
            {item}
          </td>
        ))}
      </tr>
    );
  }
}

export default CalendarWeek;

// let className = cx(styles.base, {
//     [styles.clickable]: this.props.clickable,
//     [styles.withIcon]: !!this.props.icon
//   });
// return <div className={className} />

// var liClasses = classNames({
//     'main-class': true,
//     'activeClass': self.state.focused === index
//   });

//   return (<li className={liClasses}>{data.name}</li>);
