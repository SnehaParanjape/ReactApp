import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';
import './App.css';
import './SecondPage.css';

class SecondPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      fileName: '',
      jsonData: '',
      OriginalcompleteFile: '',
      columnMappingString: '',
      table_query: '',
    };

    this.handleTableQuery = this.handleTableQuery.bind(this);
    this.handleSaveQuery = this.handleSaveQuery.bind(this);
   // this.handleConnect = this.handleConnect.bind(this);
  }

  handleFiles = files => {
    let reader = new FileReader();
    
    reader.onload = (e) => {

      let text = reader.result;
      let tempOriginalcompleteFile = text.split('\n');

      this.setState({
        fileName: files[0].name,
        jsonData: text,
        OriginalcompleteFile: tempOriginalcompleteFile,
      })
    }
    reader.readAsText(files[0]);
  }

  handleTableQuery(event) {

    let completeFile = this.state.OriginalcompleteFile;

    const Parser = require('sql-ddl-to-json-schema');
    const parser = new Parser('mysql');
    let tableName = [];
    let num_cols = [];
    let col_names = [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']];
    let datatypes = [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']];
    let pk = [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']];
    let fk = [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']];
    let ref_table = [[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],[''],['']];
    let str1=[];

    for ( let n = 0; n < completeFile.length; n++ ) {
      let temp_completeString = completeFile[n].replace("SERIAL","INT");
      let completeString = temp_completeString.replace(/`/g,"");
      //console.log(completeString);
      let sql = completeString;
      parser.feed(sql);
      let parsedJsonFormat = parser.results;
      let compactJsonTablesArray = parser.toCompactJson(parsedJsonFormat);
      //console.log(typeof (compactJsonTablesArray[0]));
      //let compactJsonTablesArray = temp_compactJsonTablesArray.replace("\`","");
      //console.log(compactJsonTablesArray);
      //console.log((compactJsonTablesArray[0]).name);    OUTPUT: Table name
      tableName[n] = (compactJsonTablesArray[0]).name;
      //console.log((compactJsonTablesArray[0]).columns);
      //console.log(((compactJsonTablesArray[0]).columns).length);      OUTPUT: number of columns
      num_cols[n] = ((compactJsonTablesArray[0]).columns).length;

      for ( let i = 0; i < num_cols[n]; i++ ) {
        pk[n][i] = false;
      }

      for( let j = 0; j < num_cols[n]; j++ ) {
        //console.log((((compactJsonTablesArray[0].columns))[j]).name);   OUPUT: names of columns
        col_names[n][j] =  (((compactJsonTablesArray[0].columns))[j]).name;
        //console.log(((((compactJsonTablesArray[0].columns))[j]).type).datatype);
        datatypes[n][j] = ((((compactJsonTablesArray[0].columns))[j]).type).datatype;
        if( (compactJsonTablesArray[0]).primaryKey !== undefined ) {
          if ( ((((compactJsonTablesArray[0]).primaryKey).columns).length) >= 1 ) {
            for ( let a = 0; a < ((((compactJsonTablesArray[0]).primaryKey).columns).length); a++) {
              if ( ((((compactJsonTablesArray[0]).primaryKey).columns[a]).column) === ((((compactJsonTablesArray[0].columns))[j]).name) ) {
                pk[n][j] = true;
              }
            }
          }
        }
        if(compactJsonTablesArray[0].hasOwnProperty('foreignKeys')) {
          if ( ((compactJsonTablesArray[0]).foreignKeys).length >= 1 ) {
            for (let b = 0; b < (((compactJsonTablesArray[0]).foreignKeys).length); b++ ) {
              if ( (((compactJsonTablesArray[0]).foreignKeys[b]).columns).length >= 1 ) {
                for (let c = 0; c < ((((compactJsonTablesArray[0]).foreignKeys[b]).columns).length); c++ ) {
                  if ( ((((compactJsonTablesArray[0]).foreignKeys[b]).columns[c]).column) === ((((compactJsonTablesArray[0].columns))[j]).name) ) {
                    fk[n][j] = true;
                    //console.log("PK"+n+"\n"+temp_pk[n][i]);
                    ref_table[n][j] = compactJsonTablesArray[0].foreignKeys[b].reference.table;
                  }
                }
              }
            }
          }
        }
      }

      str1[n] = '';
      for( var k = 0; k < (num_cols[n]) - 1; k++ ) {
        if( datatypes[n][k] === 'varchar' || datatypes[n][k] === 'varchar2' ) {
          str1[n] += col_names[n][k]+":char,";
        }
        else {
          str1[n] += col_names[n][k]+":"+ (datatypes[n][k])+",";
        }
      }
      if( datatypes[n][((num_cols[n])-1)] === 'varchar' || datatypes[n][((num_cols[n])-1)] === 'varchar2' ) {
        str1[n] += col_names[n][k]+":char";
      }
      else {
        str1[n] += col_names[n][k]+":"+ (datatypes[n][((num_cols[n])-1)]);
      }
      
    }
    let FullQuery = '';
    let num_tables = completeFile.length;
    let flag = [num_tables];
    for ( let x = 0; x < num_tables; x++) {
      for (let y = 0; y < num_cols[x]; y++) {
        if(pk[x][y] === true) {
          flag[x] = true;
          break;
        }
        else {
          flag[x] = false;
        }
      }
    }
    for ( let l = 0; l < num_tables; l++ ) {

      let graph_name = tableName[l];
      let data = "";
      for( let p = 0; p < num_cols[l]; p++) {

        if(pk[l][p] === true) {
          data += "?"+graph_name.toLowerCase()+"_"+col_names[l][p];
          if(p === num_cols[l]-1) {
            data+=".";
          }
        }
        else {
          //data += " <"+col_names[l][p]+"> ?col"+(p+1)+";";
          if(flag[l] === false) {
            if ( fk[l][p] === true ) {
              data += "[] <"+col_names[l][p]+"> ?"+ref_table[l][p].toLowerCase()+"_"+col_names[l][p];
              flag[l] = true;
              if(p === num_cols[l]-1) {
                data+=".";
              }
              else {
                data +=";";
              }
            }
            else {
              data += "[] <"+col_names[l][p]+"> ?"+col_names[l][p];
              flag[l] = true;
              if(p === num_cols[l]-1) {
                data+=".";
              }
              else {
                data +=";";
              }
            }
            
          }
          else {
            if( fk[l][p] === true) {
              data += "<"+col_names[l][p]+"> ?"+ref_table[l][p].toLowerCase()+"_"+col_names[l][p];
              if(p === num_cols[l]-1) {
                data+=".";
              }
              else {
                data +=";";
              }
            }
            else {
              data += "<"+col_names[l][p]+"> ?"+col_names[l][p];
              if(p === num_cols[l]-1) {
                data+=".";
              }
              else {
                data +=";";
              }
            }
            
          }
        }
        data += "\n";
      }
      let binds = '';
     
      for(let q = 0; q < num_cols[l]; q++) {
        if(pk[l][q] === true) {
          binds += "BIND(IRI(CONCAT(\""+graph_name+"#\",STR(?"+col_names[l][q]+"))) AS ?"+graph_name.toLowerCase()+"_"+col_names[l][q]+")\n";
        }
        if(fk[l][q] === true) {
          binds += "BIND(IRI(CONCAT(\""+ref_table[l][q]+"#\",STR(?"+col_names[l][q]+"))) AS ?"+ref_table[l][q].toLowerCase()+"_"+col_names[l][q]+")\n";
        }
      }
      FullQuery+="INSERT { \nGRAPH <"+graph_name+"> {\n"+data+" } \n} \nWHERE { \nTABLE <file://"+this.state.fileName+"> ( \n 'csv', 'global', ',',true,'"+str1[l]+"')\n"+binds+"};;\n";
    }
    document.getElementById("load_query_preview_text").value = FullQuery;

    let Dracula = require('graphdracula');
    let Graph = Dracula.Graph;
    let Renderer = Dracula.Renderer.Raphael;
    let Layout = Dracula.Layout.Spring;

    let graph = new Graph();

    for ( let r = 0; r < completeFile.length - 1; r++) {
      graph.addNode(tableName[r]);
      for ( let s = 0; s < num_cols[r]; s++) {
        if(fk[r][s] === true ) {
          graph.addEdge(tableName[r],ref_table[r][s], {directed:true});
        }
      }
      
    }
    for ( let t = 0; t < num_cols[completeFile.length - 1]; t++) {
        if(fk[completeFile.length - 1][t] === true ) {
          graph.addEdge(tableName[completeFile.length - 1],ref_table[completeFile.length - 1][t],{directed:true});
        }
      }

    let layout = new Layout(graph);
    let renderer = new Renderer('#secondPage_second_div', graph, 400, 300);
    renderer.draw();

    this.setState({
      table_query: FullQuery,
      columnMappingString: str1,
    });
  }

/*
  handleInsertQuery(event) {
   
    var data = this.state.jsonData;
    var splitLine = data.split('\n');

    var eachLine = [];
     for ( var i = 0; i < splitLine.length; i++) {
      eachLine[i] = splitLine[i];
    }

    var tableName = [];
    var dataArray = [];
    for ( var j = 0; j < eachLine.length; j++) {
      tableName[j] = eachLine[j].split(" ")[2];
      dataArray[j] = eachLine[j].split(" ")[4];
    }
    var eachDataArray = [];

    for ( var k = 0; k < dataArray.length; k++ ) {
      eachDataArray[k] = dataArray[k].slice(1,-2).split(",");
    }
    console.log(tableName);
    console.log(dataArray);
    console.log(eachDataArray);

//console.log(dataName[2].slice(1,-2).split(',')[1]);
    var str = "<"+tableName[0]+eachDataArray[0][0]+"> a <"+tableName[0]+">\n";
    str += "<"+tableName[0]+eachDataArray[0][0]+"> <name> "+eachDataArray[0][1]+"\n";
    str += "<"+tableName[0]+eachDataArray[0][0]+"> <employer> <Company"+eachDataArray[0][2]+">\n";

    str += "<"+tableName[0]+eachDataArray[1][0]+"> a <"+tableName[0]+">\n";
    str += "<"+tableName[0]+eachDataArray[1][0]+"> <name> "+eachDataArray[1][1]+"\n";
    str += "<"+tableName[0]+eachDataArray[1][0]+"> <employer> <Company"+eachDataArray[1][2]+">\n";

    str += "<"+tableName[0]+eachDataArray[2][0]+"> a <"+tableName[0]+">\n";
    str += "<"+tableName[0]+eachDataArray[2][0]+"> <name> "+eachDataArray[2][1]+"\n";
    str += "<"+tableName[0]+eachDataArray[2][0]+"> <employer> <Company"+eachDataArray[2][2]+">\n";

    str += "<"+tableName[3]+eachDataArray[3][0]+"> a <"+tableName[3]+">\n";
    str += "<"+tableName[3]+eachDataArray[3][0]+"> <name> "+eachDataArray[3][1]+"\n";
    str += "<"+tableName[3]+eachDataArray[3][0]+"> <employer> <Company"+eachDataArray[3][2]+">\n";

    str += "<"+tableName[3]+eachDataArray[4][0]+"> a <"+tableName[3]+">\n";
    str += "<"+tableName[3]+eachDataArray[4][0]+"> <name> "+eachDataArray[3][1]+"\n";
    str += "<"+tableName[3]+eachDataArray[4][0]+"> <employer> <Company"+eachDataArray[3][2]+">\n";
    document.getElementById("load_query_preview_text").value = str;
  }
*/
  handleSaveQuery(event) {
    let textToSave = this.state.clicked_button ==="insert" ? this.state.insert_query:this.state.table_query;
    let textToSaveAsBlob = new Blob([textToSave], {type: "text/plain"});
    let textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    //let fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    let downloadLink = document.createElement("a");
    downloadLink.download = "file.txt";
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
/*handleConnect() {
    //var uri = 'http://localhost:8080/connect?server=127.0.0.1&port=8080&username=root&db_name=tpch';
 //   var query = "SELECT * WHERE {SERVICE <"+uri+">{?s ?p ?o}}";
       var query = "SELECT (count(*) as ?c) WHERE {?s ?p ?o}";

    var encoded = encodeURI(query);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/sparql',true);
    xhr.setRequestHeader("Accept", "application/sparql-results+json");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //xhr.setRequestHeader("Content-Type", "application/sparql-query");
    var reqbody = "query="+encoded;
    //xhr.setRequestHeader("Content-Length",reqbody.length);
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            console.log(xhr.responseText);

        }
    }
    xhr.send(reqbody);
    //xhr.send(query);

  }*/



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
              <input type="password" id="password_text"></input>
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
         {/*} <button id="secondPage_browse_btn" onClick={this.handleConnect}>Connect</button>*/}
          <div id="secondPage_browse_btn_div"> 
            <ReactFileReader
              multipleFiles={false}
              fileTypes={[".json",".sql",".ddl"]}
              handleFiles={this.handleFiles}>
                    
              <button id="secondPage_browse_btn">Browse</button>
            </ReactFileReader>
          </div>
        </div>

        <div id="secondPage_second_div">
          {/*<ElmArchitecture node_name="id"></ElmArchitecture>*/}
        </div>
        
        <div id="secondPage_third_div">
          {/*{this.state.jsonData}*/}
        </div>
  
        <div id="secondPage_fourth_div">
          <div id="secondPage_generate_table_query_div">
            <button type="button" id="secondPage_table_query_button" onClick={this.handleTableQuery}>Generate Table Query</button>
          </div>
        </div>

        <div id="load_query_preview_div">
          <div id="load_query_preview_label">
            <b>Load Query (Preview):  </b>
          </div>
          <div id="load_query_preview_text_div">
            <textarea id="load_query_preview_text" rows="4" defaultValue={this.state.clicked_button ==="insert" ? this.state.insert_query:this.state.table_query} onChange={this.onQueryChanged}/>
          </div>
        </div>

        <div id="save_query_div">  
          <button type="button" id="save_query_button" onClick={this.handleSaveQuery}>Save Query</button>
        </div>

        {/*<div id="run_query_div">
          <button type="button" id="run_query_button">Run Query</button>
        </div>*/}
      </div>

    )
  }
}

export default SecondPage;
