import React, { Component } from 'react'
import Yearselect from './comp/Yearselect'
import Monthselect from './comp/Monthselect'

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const isEventValid = state => (
  state.nazwa.length > 5 &&
  state.dzien.length > 0 &&
  state.miesiac.length > 0 &&
  state.rok.length > 3 &&
  !isNaN(state.dzien) &&
  !isNaN(state.miesiac) &&
  !isNaN(state.rok) 
)

class App extends Component {

  state = {
    today: new Date(),
    cday: new Date().getDate(),
    cmonth: new Date().getMonth(),
    cyear: new Date().getFullYear(),
    isAddingOpen: false,
    nazwa: '',
    opis: '',
    dzien: '',
    miesiac: '',
    rok: '',
    nazwaError: false,
    dzienError: false,
    miesiacError: false,
    rokError: false,
    dateError: false,
    events: []
  }

  componentDidMount() {
    this.gettingPosts()
  }

  checkSoonEvents = () => {
    let lisy = document.querySelectorAll('.events-list ul li')
    lisy.forEach( item => {
      /* if ((new Date(2019, parseInt(months.indexOf(item.innerText.substr(3,3))), parseInt(item.innerText.substr(0,1))).getTime() - new Date().getTime())/(1000*60*60*24) <= 0 ) {
        item && item.parentElement.removeChild(item)
      } */
      if ((new Date(2019, parseInt(months.indexOf(item.innerText.substr(3,3))), parseInt(item.innerText.substr(0,1))).getTime() - new Date().getTime())/(1000*60*60*24) < 2 ) {
         item.classList.add('pretty-soon')
       }
    })
  }

  checkPastedEvent = () => {
    if (new Date(this.state.cyear, this.state.cmonth, this.state.cday).getTime() > new Date(this.state.rok, this.state.miesiac, this.state.dzien)) {
      this.setState({
        dateError: true
      })
    }
  }

  gettingPosts = () => {
    fetch('http://localhost:3005/eventy', { method: 'GET' })
      .then(response => response.json())
      .then(json => {
        let newjson = json.filter( item => {
          new Date
        })
        this.setState({
          events: json
        })
        this.checkSoonEvents()
        this.showCalendar(this.state.cmonth, this.state.cyear)
      })
  }

  showCalendar = (month, year) => {
    let selectyear = document.getElementById("year")
    let selectmonth = document.getElementById("month")
    let tableBody = document.getElementById('calendar-body')
    let daysInMonth = 32 - new Date(year, month).getDate()
    let firstDay = new Date(year, month).getDay()
    tableBody.innerHTML = ''
    selectyear.value = year
    selectmonth.value = month
    let date = 1
    for (let i = 0; i < 6; i++) {
      let row = document.createElement('tr')
      for (let j = 0; j < 7; j++) {
        if (date > daysInMonth) {
          break
        } else if (i === 0 && j < firstDay) {
          let cell = document.createElement('td')
          row.appendChild(cell)
        } else {
          let cell = document.createElement('td')
          if (date === this.state.today.getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
            cell.classList.add('activeDay')
          }
          this.state.events.forEach( item => {
            if (parseInt(item.dzien) === date && parseInt(item.miesiac) === month && parseInt(item.rok) === year) {
                cell.classList.add('eventDay')
                cell.dataset.info = item.nazwa
               /*  let newele = document.createElement('div')
                newele.innerText = cell.dataset.info
                newele.setAttribute("style", 
                "position: absolute; width: 5rem; height: 5rem; background: black; top: -5rem; left: -5rem")
                console.log('newele', newele)
                cell.appendChild(newele) */
              }
          })
          cell.innerText = date
          row.appendChild(cell)
          date++
        }
      }
      tableBody.appendChild(row)
    }
  }

  next = () => {
    this.state.cmonth === 11 ? this.setState({
      cyear: this.state.cyear + 1,
      cmonth: 0
    }, () => {
      this.showCalendar(this.state.cmonth, this.state.cyear)
    }) :
      this.setState({
        cmonth: this.state.cmonth + 1
      }, () => {
        this.showCalendar(this.state.cmonth, this.state.cyear)
      })
  }

  previous = () => {
    this.state.cmonth === 0 ? this.setState({
      cyear: this.state.cyear - 1,
      cmonth: 11
    }, () => {
      this.showCalendar(this.state.cmonth, this.state.cyear)
    }) : this.setState({
      cmonth: this.state.cmonth - 1
    }, () => {
      this.showCalendar(this.state.cmonth, this.state.cyear)
    })
  }

  jump = () => {
    let selectyear = document.getElementById("year").value
    let selectmonth = document.getElementById("month").value
    this.setState({
      cmonth: parseInt(selectmonth),
      cyear: parseInt(selectyear)
    }, () => {
      this.showCalendar(this.state.cmonth, this.state.cyear)
    })
  }

  handleFormChange = e => {
    let name = e.target.name
    let value = e.target.value
    this.checkPastedEvent()
    this.setState({
      [name]: value
    })
    if (name === 'nazwa' && value.length > 5) {
      this.setState({
        nazwaError: false
      })
    }
    if (name === 'dzien' && value.length > 0 && !isNaN(value)) {
      this.setState({
        dzienError: false
      })
    }
    if (name === 'miesiac' && value.length > 0 && !isNaN(value)) {
      this.setState({
        miesiacError: false
      })
    }
    if (name === 'rok' && value.length > 3 && !isNaN(value)) {
      this.setState({
        rokError: false
      })
    }
  }

  handleFormSubmit = e => {
    e.preventDefault()
    let obj = {
      nazwa: this.state.nazwa,
      opis: this.state.opis,
      dzien: this.state.dzien,
      miesiac: this.state.miesiac-1,
      rok: this.state.rok
    }
    this.setState({
      events: this.state.events.push({
        nazwa: this.state.nazwa,
        opis: this.state.opis,
        dzien: this.state.dzien,
        miesiac: this.state.miesiac-1,
        rok: this.state.rok
      })
    })
    this.postingEvents(obj)
    this.setState({
      nazwa: '',
      opis: '',
      dzien: '',
      miesiac: '',
      rok: ''
    })
  }

  postingEvents = events => {
    fetch('http://localhost:3005/eventy', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(events)
    })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        this.gettingPosts()
      })
  }

  showMe = e => {
    //document.querySelectorAll('.hidden-content').forEach( item => {
    //  item.classList.remove('slide-down')
    //})
    e.target.nextSibling.nextSibling.classList.toggle('slide-up')
    e.target.nextSibling.nextSibling.classList.toggle('slide-down')
  }
  removeEvent = id => {
    fetch(`http://localhost:3005/eventy/${id}`, { method: 'DELETE' })

    let events = this.state.events.filter(item => item.id !== id)
    this.setState({
      events
    })
  }

  handleBlur = e => {
    const { name } = e.target
    if (name === 'nazwa') {
      this.setState({
        nazwaError: this.state.nazwa.length < 6
      })
    }
    if (name === 'dzien') {
      this.setState({
        dzienError: this.state.dzien.length < 1
      })
    }
    if (name === 'miesiac') {
      this.setState({
        miesiacError: this.state.miesiac.length < 1
      })
    }
    if (name === 'rok') {
      this.setState({
        rokError: this.state.rok.length < 4
      })
    }
  }

  movetohead = () => {
    this.showCalendar(new Date().getMonth(), new Date().getFullYear())
    this.setState({
      cmonth: new Date().getMonth(),
      cyear: new Date().getFullYear()
    })
  }
  render() {
    const { isAddingOpen,
      nazwa,
      opis,
      dzien,
      miesiac,
      rok,
      events,
      cday,
      cmonth,
      cyear,
      dzienError,
      miesiacError,
      rokError,
      nazwaError,
      dateError } = this.state
    let eve
    if (events.length) {
      eve = events.sort((a, b) => new Date(a.rok, a.miesiac, a.dzien) - new Date(b.rok, b.miesiac, b.dzien)).map(item => {
        return <li key={item.id}>
          <div className='event-name' onClick={this.showMe}>{item.dzien}. {months[item.miesiac]} {item.rok === cyear && item.rok} - {item.nazwa}</div><div className='mrx' onClick={() => this.removeEvent(item.id)}><i class="fas fa-times"></i></div>
          <div className='hidden-content slide-up'>{item.opis || 'Brak opisu'}</div>
        </li>
      })
    } else {
      eve = 'Brak informacji'
    }
    let enabled = isEventValid(this.state) && dateError
    return (
      <div className="container">
        <div className='events-list'>
          <span className='events-header'>Zbliżające się wydarzenia</span>
          <ul>{eve}</ul>
        </div>
        <div className="card">
          <h3 onClick={this.movetohead}className="card-header" id="monthAndYear">{months[cmonth]} {cmonth === new Date().getMonth() && cday + ','} {cyear}</h3>
          <table className="table" id="calendar">
            <thead>
              <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody id="calendar-body">
            </tbody>
          </table>

          <div className="form-inline">
            <button className="btn" id="previous" onClick={this.previous}>{'<< Previous'}</button>
            <button className="btn" id="next" onClick={this.next}>{'Next >>'}</button>
          </div>

          <form className="form-inline2">
            <label htmlFor="month">Jump To:&nbsp;&nbsp;&nbsp;</label>

            <Monthselect jump={this.jump} />
            <Yearselect jump={this.jump} />

          </form>

          <button className='add-btn' onClick={() => this.setState({ isAddingOpen: !isAddingOpen })}>Wydarzenie</button>

          {isAddingOpen && (
            <form className='event-form' onSubmit={this.handleFormSubmit}>
              <input
                type='text'
                placeholder='Nazwa wydarzenia'
                name='nazwa'
                onChange={this.handleFormChange}
                onBlur={this.handleBlur}
                value={nazwa}
              />
              {nazwaError &&
                <p>
                  Nazwa nie może być pustym ciągiem znaków
                    </p>}
              <input
                type='text'
                placeholder='Opis wydarzenia'
                name='opis'
                onChange={this.handleFormChange}
                onBlur={this.handleBlur}
                value={opis}
              />
              <input
                type='text'
                placeholder='Dzień miesiąca'
                name='dzien'
                onChange={this.handleFormChange}
                onBlur={this.handleBlur}
                value={dzien}
              />
              {dzienError &&
                <p>
                  Podaj prawidłowy dzień miesiąca
                    </p>}
              <input
                type='text'
                placeholder='Miesiąc'
                name='miesiac'
                onChange={this.handleFormChange}
                onBlur={this.handleBlur}
                value={miesiac}
              />
              {miesiacError &&
                <p>
                  Podaj prawidłową liczbę oznaczającą miesiąc
                    </p>}
              <input
                type='text'
                placeholder='Rok'
                name='rok'
                onChange={this.handleFormChange}
                onBlur={this.handleBlur}
                value={rok}
              />
              {rokError &&
                <p>
                  Podaj 4 cyfrową liczbę reprezentującą rok. Liczba nie może by mnniejsza od {cyear}
                    </p>}
              <button className='add-btn extradisabled' disabled={!enabled}>Dodaj</button>
            </form>)}

        </div>
      </div>
    )
  }
}
export default App
