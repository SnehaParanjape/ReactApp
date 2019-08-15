import React, { Component } from 'react';
import './App.css';
import ReactFileReader from 'react-file-reader';

class Try extends Component {
  constructor(props){
    super(props);

    this.state = {
      jsonData: '',
      
    };

    this.handleBrowseButton = this.handleBrowseButton.bind(this);

  }

handleFiles = files => {
  var reader = new FileReader();
  
  reader.onload = (e) => {

    var text = reader.result;
    var completeFile = text.split('\n');

    const Parser = require('sql-ddl-to-json-schema');
    const parser = new Parser('mysql');

    //const sql = 'CREATE TABLE users (id INT(11) NOT NULL AUTO_INCREMENT,nickname VARCHAR(255) NOT NULL,deleted_at TIMESTAMP NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,updated_at TIMESTAMP,PRIMARY KEY (id)) ENGINE MyISAM COMMENT \'All system users\';ALTER TABLE users ADD UNIQUE KEY unq_nick (nickname);';
    //const sql = reader.result;
    //console.log((((compactJsonTablesArray[0].columns))[0]).name);   OUPUT: name of column[0]
    //console.log(((((compactJsonTablesArray[0].columns))[j]).type).datatype);
    //console.log((((compactJsonTablesArray[0]).primaryKey).columns[0]).column);   OUTPUT: id
      var sql=completeFile;

      parser.feed(sql);
      var parsedJsonFormat = parser.results;
      
      var compactJsonTablesArray = parser.toCompactJson(parsedJsonFormat);
      //console.log(compactJsonTablesArray);
      //console.log((compactJsonTablesArray[0]).name);    OUTPUT: Table name
 
      //console.log((compactJsonTablesArray[0]).columns);
      //console.log(((compactJsonTablesArray[0]).columns).length);      OUTPUT: number of columns      
console.log(compactJsonTablesArray);
    
  
    this.setState({
      
      jsonData: reader.result,
    })
  }
  reader.readAsText(files[0]);
}
  handleBrowseButton(event) {
    
  }

  render() 
  { 
    return (
          <div id="browse_btn_div"> 
            <ReactFileReader
              multipleFiles={false}
              fileTypes={[".json"]}
              handleFiles={this.handleFiles}>
                    
              <button id="browse_btn" onClick={this.handleBrowseButton}>Browse</button>
            </ReactFileReader>
            {this.state.jsonData}
          </div>  
               
    )
  }
}

export default Try;
