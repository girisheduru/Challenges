import logo from './logo.svg';
import './App.css';
import React from 'react';


class  App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      bdata: 'Default Data', 
    };
  }

  componentDidMount() {
    const url = "/api"
    //const url = "http://localhost:9001/api"

    fetch(url)
    .then((response) => {
      if(!response.ok) throw new Error(response.status);
      else return response.json();
    })
    .then((data) => {
      this.setState({ bdata: data.key });
    })
    .catch((error) => {
      this.setState({ bdata: "failed" });
    });

  }
 

  render() {

    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                  Three tier App with GCP and K8s Cluster
            </p>
            
            <p>   Data from Backend  :   {this.state.bdata}</p>
  
          </header>
        </div>
    
    );
  }

 

  /*componentDidMount() {
    console.log("Girish 1")
    this.callApi()
        .then(res => this.setState({ data: res.json}))
        .catch(err => console.log(err));
  }*/

 /* callApi = async() => {
      console.log("Girish 2")

      const response = await fetch('http://localhost:9001/getBackendData',{
          headers:{
              "accepts":"application/json"
          }
      });
      const datasync = await response.json();
      if (response.status !== 200) throw Error(datasync.message);

      //return datasync;

      console.log("Girish 3")

      return "Girish";

  }*/

  

  /*render(){

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
                Three tier App with GCP and K8s Cluster
          </p>
          
          <p>   Data from Backend  :   {this.state.name}</p>

        </header>
      </div>
  
    );
  }*/
  
}

export default App;
