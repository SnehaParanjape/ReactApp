import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';

import {
  DiagramEngine,
  DiagramModel,
  DefaultNodeModel,
  DiagramWidget,
} from "storm-react-diagrams";
import './App.css';

import './SecondPage.css';

/*
  const ElmArchitecture = ({name}) => {
  //1) setup the diagram engine
  var engine = new DiagramEngine();
  engine.installDefaultFactories();

  //2) setup the diagram model
  var model = new DiagramModel();
  //3-A) create a default node
  var node1 = new DefaultNodeModel(name, "rgb(0,192,255)");
  let port1 = node1.addOutPort(" ");
  node1.setPosition(100, 100);

  //3-B) create another default node
  var node2 = new DefaultNodeModel("view", "rgb(192,255,0)");
  let port2 = node2.addInPort("Model");
  //let port3 = node2.addOutPort("Html");
  node2.setPosition(400, 100);

  // link the ports
  let link1 = port1.link(port2);
  link1.addLabel("Label1");

  //4) add the models to the root graph
  model.addAll(node1, node2, link1);

  //5) load model into engine
  engine.setDiagramModel(model);

  //6) render the diagram!
  return <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />;
};
*/
  const ElmArchitecture = ({node_name}) => {

  var engine = new DiagramEngine();
  engine.installDefaultFactories();

  var model = new DiagramModel();

  var node1 = <createNode node_name={node_name} />
  //let port1 = node1.addOutPort(" ");
  //let port3 = node1.addInPort("nickname");
  //node1.setPosition(100, 100);

  var node2 = new DefaultNodeModel("view", "rgb(192,255,0)");
  let port2 = node2.addInPort("Model");
  node2.setPosition(400, 100);

  //let link1 = port1.link(port2);
  //link1.addLabel("Label1");

  //model.addAll(node1, node2, link1);
  model.addAll(node1, node2);

  engine.setDiagramModel(model);

  return <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />;
};

const createNode = ({node_name}) => {
  console.log(node_name);
  var node1 = new DefaultNodeModel(node_name, "rgb(0,192,255)");
  node1.setPosition(100,100);
  return node1;
};
class SecondPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      fileName: '',
      jsonData: '',
      num_tables: 0,
      tableName: [],
      num_cols: [],
      col_names: [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']],
      datatypes: [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']],
      pk: [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']],
      columnMappingString: '',
      table_query: '',
    };

    this.handleBrowseButton = this.handleBrowseButton.bind(this);
    this.handleTableQuery = this.handleTableQuery.bind(this);
    this.handleSaveQuery = this.handleSaveQuery.bind(this);
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
    var temp_tableName = this.state.tableName;
    var temp_num_cols = this.state.num_cols;
    //console.log((((compactJsonTablesArray[0].columns))[0]).name);   OUPUT: name of column[0]
    var temp_col_names = this.state.col_names;
    //console.log(((((compactJsonTablesArray[0].columns))[j]).type).datatype);
    var temp_datatypes = this.state.datatypes;
    //console.log((((compactJsonTablesArray[0]).primaryKey).columns[0]).column);   OUTPUT: id
    var temp_pk = this.state.pk;
    var str1=[];

    for ( var n = 0; n < completeFile.length; n++ ) {
      var sql=completeFile[n];

      parser.feed(sql);
      var parsedJsonFormat = parser.results;
      
      var compactJsonTablesArray = parser.toCompactJson(parsedJsonFormat);
      //console.log(compactJsonTablesArray);
      //console.log((compactJsonTablesArray[0]).name);    OUTPUT: Table name
      temp_tableName[n] = (compactJsonTablesArray[0]).name;
      //console.log((compactJsonTablesArray[0]).columns);
      //console.log(((compactJsonTablesArray[0]).columns).length);      OUTPUT: number of columns
      temp_num_cols[n] = ((compactJsonTablesArray[0]).columns).length;

      for ( var i = 0; i < temp_num_cols[n]; i++ ) {
        temp_pk[n][i] = false;
      }

      for( var j = 0; j < temp_num_cols[n]; j++ ) {
        //console.log((((compactJsonTablesArray[0].columns))[j]).name);   OUPUT: names of columns
        temp_col_names[n][j] =  (((compactJsonTablesArray[0].columns))[j]).name;
        //console.log(((((compactJsonTablesArray[0].columns))[j]).type).datatype);
        temp_datatypes[n][j] = ((((compactJsonTablesArray[0].columns))[j]).type).datatype;

        if( (compactJsonTablesArray[0]).primaryKey !== undefined ) {
          if ( ((((compactJsonTablesArray[0]).primaryKey).columns).length) >= 1 ) {
            for ( var a = 0; a < ((((compactJsonTablesArray[0]).primaryKey).columns).length); a++) {
              if ( ((((compactJsonTablesArray[0]).primaryKey).columns[a]).column) === ((((compactJsonTablesArray[0].columns))[j]).name) ) {
                temp_pk[n][j] = true;
                //console.log("PK"+n+"\n"+temp_pk[n][i]);
              }
            }
          }
        }
        else {
          temp_pk[n][0] = true;
        }
      }
      str1[n] = '';
      for( var k = 0; k < (temp_num_cols[n]) - 1; k++ ) {
        str1[n] += "col"+(k+1)+":"+ (temp_datatypes[n][k])+",";
      }
      str1[n] += "col"+temp_num_cols[n]+":"+ (temp_datatypes[n][((temp_num_cols[n])-1)]);

    }
  
    this.setState({
      fileName: files[0].name,
      jsonData: reader.result,
      num_tables: completeFile.length,
      tableName: temp_tableName,
      num_cols: temp_num_cols,
      col_names: temp_col_names,
      datatypes: temp_datatypes,
      pk: temp_pk,
      columnMappingString: str1,
    })
  }
  reader.readAsText(files[0]);
}
  handleBrowseButton(event) {
    
  }
  handleTableQuery(event) {

    var FullQuery = '';

    for ( var n = 0; n < this.state.num_tables; n++ ) {

      var graph_name = this.state.tableName[n];
      var data = "[ ]";
      for( var i = 0; i < this.state.num_cols[n]; i++) {
           
        if(this.state.pk[n][i] === true) {
          data += " <"+this.state.col_names[n][i]+"> ?col"+(i+1)+"_uri ;";
        }
        else {
          data += " <"+this.state.col_names[n][i]+"> ?col"+(i+1)+";";
        }
        data += "\n";
      }
      var binds = '';
     
      for(var j = 0; j < this.state.num_cols[n]; j++) {
        if(this.state.pk[n][j] === true) {
          binds += "BIND(IRI(STR(?col"+(j+1)+")) AS ?col"+(j+1)+"_uri)\n";
        }
      }
      var q="INSERT { \nGRAPH <"+graph_name+"> {\n"+data+" } \n} \nWHERE { \nTABLE <file:///"+this.state.fileName+"> ( \n 'csv', 'global', '"+this.state.columnMappingString[n]+"')\n"+binds+"}\n";
      FullQuery += q;
    }
    document.getElementById("load_query_preview_text").value = FullQuery;

    this.setState({
      table_query: FullQuery,
    });
  }

  handleSaveQuery(event) {
    var textToSave = this.state.clicked_button ==="insert" ? this.state.insert_query:this.state.table_query;
    var textToSaveAsBlob = new Blob([textToSave], {type: "text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    //var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = "file.txt";
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  render() 
  { 
    return (
      <div>
        <div id="secondPage_first_div">
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

          <div id="secondPage_browse_btn_div"> 
            <ReactFileReader
              multipleFiles={false}
              fileTypes={[".json"]}
              handleFiles={this.handleFiles}>
                    
              <button id="secondPage_browse_btn" onClick={this.handleBrowseButton}>Browse</button>
            </ReactFileReader>
          </div>
        </div>

        <div id="secondPage_second_div">
          <ElmArchitecture node_name={this.state.col_names[0][0]}></ElmArchitecture>
        </div>
        
        <div id="secondPage_third_div">
          {this.state.jsonData}
        </div>
  
        <div id="secondPage_fourth_div">
          <div id="secondPage_generate_table_query_div">
            <button type="button" id="secondPage_table_query_button" onClick={this.handleTableQuery}>Generate Table Query</button>
          </div>
        </div>

        <div id="load_query_preview_div">
          <div id="load_query_preview_label">
            Load Query (Preview):  
          </div>
          <div id="load_query_preview_text_div">
            <textarea id="load_query_preview_text" rows="4" defaultValue={this.state.clicked_button ==="insert" ? this.state.insert_query:this.state.table_query} onChange={this.onQueryChanged}/>
          </div>
        </div>

        <div id="save_query_div">  
          <button type="button" id="save_query_button" onClick={this.handleSaveQuery}>Save Query</button>
        </div>

        <div id="run_query_div">
          <button type="button" id="run_query_button">Run Query</button>
        </div>
          
      </div>

    )
  }
}

export default SecondPage;
