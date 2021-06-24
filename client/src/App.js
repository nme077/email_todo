import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/custom.scss'
import './App.css';
import React from 'react';
import validator from 'validator';
import RotateLoader from "react-spinners/RotateLoader";


class Loading extends React.Component {
  render() {
    return(
      <div>
        <div className="text-center loadingScreen d-flex align-items-center justify-content-center"></div>
        <div className="position-absolute d-flex align-items-center justify-content-center w-100 h-100 p-0 statusIcon">
          <RotateLoader />
        </div>
      </div>  
    )
  }
}

class SuccessScreen extends React.Component {
  render() {
    return(
      <div>
        <div className="text-center success d-flex align-items-center justify-content-center"></div>
        <div className="position-absolute d-flex align-items-center justify-content-center w-100 h-100 p-0 statusIcon">
          <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="#99ff00" className="bi bi-check-lg bounce" viewBox="0 0 16 16">
            <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
          </svg>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sentSuccess: false,
      sentFailure: false,
      reminder: '',
      emailAddress: '',
      validEmail: '',
      isLoading: true
    }
  }
  
  handleReminder = (e) => {
    this.setState({reminder: e.target.value});
  }

  handleEmail = (e) => {
    this.setState({emailAddress: e.target.value});
  }

  handleClick = (e) => {
    e.preventDefault();

    if(validator.isEmail(this.state.emailAddress)) {
      this.setState({
        isLoading: true,
        invalidEmail: false
      })
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          reminder: this.state.reminder,
          email: this.state.emailAddress
         })
      };
  
      fetch('/send', requestOptions)
        .then(() => {
          this.setState({sentSuccess: true, isLoading: false});

          setTimeout(() => {
            this.setState({sentSuccess: false});
          }, 3000);
        })
        .catch(() => this.setState({sentFailure: true, isLoading: false}));
    } else {
      this.setState({
        invalidEmail: true
      })
    }

  }

  render() {
    return (
      <div className="min-vh-100 min-vw-100 d-flex align-items-center justify-content-center ">
        <div className="corner-ribbon">&copy; 2021 <a href="https://www.nicholaseveland.com/resume" target="_blank" rel="noreferrer" className="link-light portfolioLink">Nicholas Eveland</a></div>
        <div className="position-fixed mh-100 w-100 pageBackground">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fillOpacity="1" d="M0,128L30,154.7C60,181,120,235,180,250.7C240,267,300,245,360,229.3C420,213,480,203,540,218.7C600,235,660,277,720,288C780,299,840,277,900,240C960,203,1020,149,1080,144C1140,139,1200,181,1260,170.7C1320,160,1380,96,1410,64L1440,32L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path></svg>
        </div>
        <div className="container">
          <div>
            {this.state.isLoading ? <Loading /> : null}
            {this.state.sentSuccess ? <SuccessScreen /> : null}
            <h1 className="text-center mb-4">Send a quick email reminder</h1>
            <form className="inputInterface">
              <div className="row justify-content-center">
                <div className="col-md-6 col-sm-12">
                  <input type="email" className="form-control form-control-lg my-2" name="email" onChange={this.handleEmail} placeholder="Email address" autoFocus />
                  {this.state.invalidEmail &&
                    <div className="text-danger">Enter a valid email address</div>
                  }
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-6 col-sm-12">
                  <input type="text" className="form-control form-control-lg my-2" name="reminder" onChange={this.handleReminder} placeholder="Remind me..." />
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-6 col-sm-12 d-grid gap-2">
                  <button className="btn btn-lg btn-primary btn-fluid rounded-pill my-2" type="button" onClick={this.handleClick}>Send</button>
                </div>
              </div>
            </form>
          </div>
      </div>
    </div>
    )
  }
}


export default App;
