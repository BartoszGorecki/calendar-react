import React, { Component } from "react";
import CalendarMonth from "./calendar-month";

const months = [
  "January",
  "Februar",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

class App extends Component {
  state = {
    currentday: new Date().getDate(),
    currentmonth: new Date().getMonth(),
    currentyear: new Date().getFullYear(),
    selectedDate: {
      day: null,
      month: null,
      year: null
    }
  };

  getFirstDayOfMonth = (month, year) =>
    new Date(year, month).getDay() === 0
      ? 6
      : new Date(year, month).getDay() - 1;

  getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  setCurrentDay = (currentmonth, currentyear) => {
    if (
      currentmonth - 1 === new Date().getMonth() &&
      currentyear === new Date().getFullYear()
    ) {
      const currentday = new Date().getDate();
      this.setState({ currentday });
    }
  };

  next = () => {
    const { currentyear, currentmonth } = this.state;
    currentmonth === 11
      ? this.setState({
          currentyear: currentyear + 1,
          currentmonth: 0,
          currentday: 1
        })
      : this.setState({
          currentmonth: currentmonth + 1,
          currentday: 1
        });
  };

  previous = () => {
    const { currentyear, currentmonth } = this.state;
    currentmonth === 0
      ? this.setState({
          currentyear: currentyear - 1,
          currentmonth: 11
        })
      : this.setState({
          currentmonth: currentmonth - 1
        });
    this.setCurrentDay(currentmonth, currentyear);
  };

  isCurrentMonth = () =>
    this.state.currentmonth === new Date().getMonth() &&
    this.state.currentyear === new Date().getFullYear();

  showActualDay = () => {
    this.setState({
      currentmonth: new Date().getMonth(),
      currentyear: new Date().getFullYear()
    });
  };

  isSelectedDateSame = (serviceDay, serviceMonth) => {
    const {
      selectedDate: { day, month, year },
      currentyear
    } = this.state;
    return serviceDay === day && serviceMonth === month && currentyear === year;
  };

  selectServiceDate = serviceDay => {
    const { currentmonth, currentyear } = this.state;
    const serviceMonth = months[currentmonth];
    if (this.isSelectedDateSame(serviceDay, serviceMonth)) return;
    const selectedDate = {
      day: serviceDay,
      month: serviceMonth,
      year: currentyear
    };
    this.setState({
      selectedDate
    });
  };

  render() {
    const { currentday, currentmonth, currentyear } = this.state;

    console.log(this.state);
    return (
      <div className="container">
        <div className="card">
          <div className="form-inline">
            <button
              disabled={this.isCurrentMonth()}
              className="btn"
              id="previous"
              onClick={this.previous}
            >
              {"<< Previous"}
            </button>
            <button className="btn" id="next" onClick={this.next}>
              {"Next >>"}
            </button>
          </div>
          <h3
            onClick={this.showActualDay}
            className="card-header"
            id="monthAndYear"
          >
            {months[currentmonth]} {this.isCurrentMonth() && currentday + ","}{" "}
            {currentyear}
          </h3>
          <CalendarMonth
            selectServiceDate={this.selectServiceDate}
            getFirstDayOfMonth={this.getFirstDayOfMonth(
              currentmonth,
              currentyear
            )}
            daysInMonth={this.getDaysInMonth(currentmonth, currentyear)}
            actualDate={this.state}
          />
        </div>
      </div>
    );
  }
}
export default App;
