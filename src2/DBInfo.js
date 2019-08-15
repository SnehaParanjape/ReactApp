import React, { Component } from 'react';

import './SecondPage.css';

class DBInfo extends Component {
  render() 
  { 
    return (
        <div id="first_div">
          <div id="server_div">
            <div id="server_label_div">
              Server: 
            </div>
            <div id="server_text_div">
              <input type="text" id="server_text"></input>
            </div>
          </div>

          <div id="port_div">
            <div id="port_label_div">
              Port: 
            </div>
            <div id="port_text_div">
              <input type="text" id="port_text"></input>
            </div>
          </div>

          <div id="username_div">
            <div id="username_label_div">
              Username: 
            </div>
            <div id="username_text_div">
              <input type="text" id="username_text"></input>
            </div>
          </div>

          <div id="password_div">
            <div id="password_label_div">
              Password: 
            </div>
            <div id="password_text_div">
              <input type="text" id="password_text"></input>
            </div>
          </div>

          <div id="dbName_div">
            <div id="dbName_label_div">
              Database Name: 
            </div>
            <div id="dbName_text_div">
              <input type="text" id="dbName_text"></input>
            </div>
          </div>
        </div>
    )
  }
}

export default DBInfo;
