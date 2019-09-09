import React, { Component } from 'react'

import { CsvToHtmlTable } from 'react-csv-to-table';
import ReactFileReader from 'react-file-reader';

import './FirstPage.css';

const sampleData = `
Chrysler Imperial,14.7,8,440,230,3.23,5.345,17.42,0,0,3,4
Fiat 128,32.4,4,78.7,66,4.08,2.2,19.47,1,1,4,1
`;
class FirstPage extends Component {
	constructor(props){
		super(props);

		this.state = {
			delimiter: '',
			option: "false",
			key_option: "none",
			checkBoxchecked: false,
			fileName: '',
			firstLine: '',
			fileContents: '',
			csvData: sampleData,
			//csvData: '',
		    columns: ['column1','column2','column3','column4'],
		    predicateArray: ['column1','column2','column3','column4'],
		 	n: 2,
		    predicateValue: '',
		    display_table: sampleData,
		    columnMappingString: '',
		    clicked_button: 'table',
		    insert_query: '',
		    table_query: '',
		    types: ["boolean","byte","date","float","int","short","string","uri"],
		    currentColumnIndex: 0,
		    uriPrefixArray: [""],
		    uriPresent: [],
		    currentSubject: "",
		};

		this.handleFiles = this.handleFiles.bind(this);
		this.handleBrowseButton = this.handleBrowseButton.bind(this);
		this.handleDelimiterChange = this.handleDelimiterChange.bind(this);
		this.handleOptionChange = this.handleOptionChange.bind(this);
		this.handleKeyOptionChange = this.handleKeyOptionChange.bind(this);
		this.handleInsertQuery = this.handleInsertQuery.bind(this);
		this.handleTableQuery = this.handleTableQuery.bind(this);
		this.handleSaveQuery = this.handleSaveQuery.bind(this);
		this.handleDatatypeChange = this.handleDatatypeChange.bind(this);
		this.onQueryChanged = this.onQueryChanged.bind(this);
		this.handlePredicateChange = this.handlePredicateChange.bind(this);
		this.handleURIPrefix = this.handleURIPrefix.bind(this);
	}

	handleFiles = files => {
		let reader = new FileReader();
    	reader.onload =  () => {
			let text = reader.result;
			let completeFile = text.split('\n');
			let CSV=require('csv-string');
			let currentDelimiter = CSV.detect(completeFile);
			//let currentDelimiter = '|';
			let tempfirstLine=completeFile[0].split(currentDelimiter);
			let secondLine = completeFile[1].split(currentDelimiter);
			let secondLine2 = secondLine;
	      	for( let i=0; i < tempfirstLine.length; i++ ) {
	      		if(isNaN(secondLine[i]) === false) {
	      			secondLine2[i] = Number(secondLine[i]);
	      		}
	      		else {
	      			secondLine2[i] = secondLine[i];
	      		}
	      	}
	     	let headerCondition;
	     	let thirdLine = completeFile[2].split(currentDelimiter);
	     	let tempfirstLine2 = tempfirstLine;
	     	let thirdLine2 = thirdLine;
	     	
	     	for( let k = 0; k < tempfirstLine.length; k++ ) {
	     		if(isNaN(tempfirstLine[k]) === false) {
	      			tempfirstLine2[k] = parseInt(tempfirstLine[k],10);
	     		}
	      		else {
	      			tempfirstLine2[k] = tempfirstLine[k];
	      		}

	      		if(isNaN(thirdLine[k]) === false) {
	      			thirdLine2[k] = parseInt(thirdLine[k],10);
	      		}
	      		else {
	      			thirdLine2[k] = thirdLine[k];
	      		}
	     	}

	     	headerCondition = (
					(
						(typeof tempfirstLine2[0]) !== (typeof secondLine2[0])
					) &&
					(
						(typeof secondLine2[0]) === (typeof thirdLine2[0])
					)
				) ||
				(
					(
						(typeof tempfirstLine2[1]) !== (typeof secondLine2[1])
					) &&
					(
						(typeof secondLine2[1]) === (typeof thirdLine2[1])
					)
				);

			let cols, uristates = this.state.uriPresent;
			let temp_types=this.state.types;

    		if(headerCondition === true) {
    			cols=tempfirstLine;
    			for (let l = 0; l <tempfirstLine.length; l++) {
    				temp_types[l] = typeof secondLine[l];
    				if( typeof secondLine[l] === "number" ) {
    					if( Number.isInteger(secondLine[l])) {
    						temp_types[l] = "int";
    					}
    					else if (secondLine[l] % 1 !== 0) {
    						temp_types[l] = "float";
    					}
    				}
    				else if (typeof secondLine[l] === "string") {
    					temp_types[l] = "char";
    					if (secondLine[l] === "true" || secondLine[l] === "false") {
    						temp_types[l] = "boolean";
    					}
    				}
    				if(cols[l].indexOf(' ') >= 0) {
    					cols[l] = cols[l].split(' ').join('');
    				}
					cols[l] = cols[l].replace(/[^a-zA-Z ]/g, "");
					uristates[l] = false;
    			}
    		} 
    		else {
    			cols=this.state.columns;
    		
    			for( let m = 0; m < tempfirstLine.length; m++) {
    				cols[m] = "column"+m;
    				uristates[m] = false;
    			}
    		}
    		//Initializing ALL Column Headers' Uri Prefix as ""
			let temp_uriPrefixArray = this.state.uriPrefixArray;
    		for( let q = 0; q < tempfirstLine.length; q++) {
    			temp_uriPrefixArray[q] = "";
    		}
			let str1='';
	      	for(let j=0;j<tempfirstLine.length -1;j++) {
	        	str1 += cols[j]+":"+ (this.state.types[j])+",";
	      	}
	      	str1 += cols[tempfirstLine.length-1]+":"+ (this.state.types[tempfirstLine.length-1]);
    		//console.log ('ack 443: files', files);
    		//console.log(files[0].name);
    		document.getElementById("url_text").value = files[0].name;

    		if(headerCondition === true) {
	      	document.getElementById("header").checked = true;
    		document.getElementById("header2").checked = false;
	      	}
    		
    		else {
    		document.getElementById("header2").checked = true;
    		document.getElementById("header").checked = false;
    		}
    		
	      	// Use reader.result
	      	this.setState({
		        csvData: reader.result,
		        columns: cols,
		        predicateArray: cols,
		        types: temp_types,
		        fileName: files[0].name,
		        firstLine: tempfirstLine,
		        fileContents: completeFile,
		        n: tempfirstLine.length,
		        display_table: <CsvToHtmlTable 
							        data={reader.result}
							        csvDelimiter={currentDelimiter}
							        tableClassName="table"
							        hasHeader={headerCondition} 
							    />,
		        option: headerCondition,
		        columnMappingString: str1,
		        delimiter: currentDelimiter,
		        uriPresent: uristates,
		        uriPrefixArray: temp_uriPrefixArray,
	      	})
    	};
    	reader.readAsText(files[0]);
  	};

  	handleBrowseButton() {
		this.setState({
			display_table: <CsvToHtmlTable 
						        data={this.state.csvData}
						        csvDelimiter=" "
						        tableClassName="table table-hover"
						        hasHeader={false} 
						    />,
		});
	}

  	handleDelimiterChange(event) {

  		let currentDelimiter = event.target.value;
			let tempfirstLine=this.state.fileContents[0].split(currentDelimiter);
			let secondLine = this.state.fileContents[1].split(currentDelimiter);
			let secondLine2 = secondLine;
	      	for( let i=0; i < tempfirstLine.length; i++ ) {
	      		if(isNaN(secondLine[i]) === false) {
	      			secondLine2[i] = Number(secondLine[i]);
	      		}
	      		else {
	      			secondLine2[i] = secondLine[i];
	      		}
	      	}
	     	
	     	let thirdLine = this.state.fileContents[2].split(currentDelimiter);
	     	let tempfirstLine2 = tempfirstLine;
	     	let thirdLine2 = thirdLine;
	     	
	     	for( let k = 0; k < tempfirstLine.length; k++ ) {
	     		if(isNaN(tempfirstLine[k]) === false) {
	      			tempfirstLine2[k] = parseInt(tempfirstLine[k],10);
	     		}
	      		else {
	      			tempfirstLine2[k] = tempfirstLine[k];
	      		}

	      		if(isNaN(thirdLine[k]) === false) {
	      			thirdLine2[k] = parseInt(thirdLine[k],10);
	      		}
	      		else {
	      			thirdLine2[k] = thirdLine[k];
	      		}
	     	}

	     	let headerCondition = this.state.option;

			let cols, uristates = this.state.uriPresent;
			
			let temp_types=this.state.types;

    		if(headerCondition === true) {
    			cols=tempfirstLine;
    			for (let l = 0; l <tempfirstLine.length; l++) {
    				temp_types[l] = typeof secondLine[l];
    				if( typeof secondLine[l] === "number" ) {
    					if( Number.isInteger(secondLine[l])) {
    						temp_types[l] = "int";
    					}
    					else if (secondLine[l] % 1 !== 0) {
    						temp_types[l] = "float";
    					}
    				}
    				else if (typeof secondLine[l] === "string") {
    					temp_types[l] = "char";
    					if (secondLine[l] === "true" || secondLine[l] === "false") {
    						temp_types[l] = "boolean";
    					}
    				}
    				if(cols[l].indexOf(' ') >= 0) {
    					cols[l] = cols[l].split(' ').join('');
    				}
					cols[l] = cols[l].replace(/[^a-zA-Z ]/g, "");
					uristates[l] = false;
    			}
    		} 
    		else {
    			
    			cols=[];
    			//console.log(tempfirstLine.length);
    			for( let m = 0; m < tempfirstLine.length; m++) {
    				cols[m] = "column"+m;
    				//console.log(cols);
    				uristates[m] = false;
    			}
    			//console.log(cols);
    		}
    		//Initializing ALL Column Headers' Uri Prefix as ""
			let temp_uriPrefixArray = this.state.uriPrefixArray;
    		for( let q = 0; q < tempfirstLine.length; q++) {
    			temp_uriPrefixArray[q] = "";
    		}
			let str1='';
	      	for(let j=0;j<tempfirstLine.length -1;j++) {
	        	str1 += cols[j]+":"+ (this.state.types[j])+",";
	      	}
	      	str1 += cols[tempfirstLine.length-1]+":"+ (this.state.types[tempfirstLine.length-1]);
    		//console.log ('ack 443: files', files);
    		//console.log(files[0].name);
    		document.getElementById("url_text").value = this.state.fileName;

    		if(headerCondition === true) {
	      	document.getElementById("header").checked = true;
    		document.getElementById("header2").checked = false;
	      	}
    		
    		else {
    		document.getElementById("header2").checked = true;
    		document.getElementById("header").checked = false;
    		}

// Use reader.result
	      	this.setState({
		        columns: cols,
		        predicateArray: cols,
		        types: temp_types,
		        firstLine: tempfirstLine,
		        n: tempfirstLine.length,
		        
		        option: headerCondition,
		        columnMappingString: str1,
		        uriPresent: uristates,
		        uriPrefixArray: temp_uriPrefixArray,
		        display_table: <CsvToHtmlTable 
							        data={this.state.csvData}
							        csvDelimiter={event.target.value}
							        tableClassName="table"
							        hasHeader={headerCondition} 
							    />,
		        delimiter: event.target.value,
	      	})
  		/*this.setState({
			delimiter: event.target.value,
			display_table: <CsvToHtmlTable 
						        data={this.state.csvData || sampleData}
						        csvDelimiter={event.target.value}
						        tableClassName="table table-hover"
						        hasHeader={this.state.option} 
						    />,
		})*/
	}

	handleOptionChange(event) {
		let x = event.target.value === "true" ? <CsvToHtmlTable
						        data={this.state.csvData || sampleData}
						        csvDelimiter={this.state.delimiter}
						        tableClassName="table table-hover"
						        hasHeader={true}
						    />: <CsvToHtmlTable 
						        data={this.state.csvData || sampleData}
						        csvDelimiter={this.state.delimiter}
						        tableClassName="table table-hover"
						        hasHeader={false}
						    />;
	  this.setState({
	  	option: event.target.value,
	  	display_table: x,
	  });
	}

	handleKeyOptionChange(event) {

  		if(event.target.value === "none") {
  		    let temp_uriPresent = this.state.uriPresent;
            for( let k = 0; k < this.state.n; k++) {
                if( k === this.state.currentColumnIndex ) {
                    temp_uriPresent[k] = false;
                }
            }
        //}
            /*else {
                for( let l = 0; l < this.state.n; l++) {
                    if( l === this.state.currentColumnIndex ) {
                        temp_uriPresent[l] = !temp_uriPresent[l];
                    }
                }
            }*/
            this.setState({
                uriPresent: temp_uriPresent,
            });

  		}
  		else {
			let temp_uriPresent = this.state.uriPresent;
			//if(event.target.value === "none") {
				for( let k = 0; k < this.state.n; k++) {
					if( k === this.state.currentColumnIndex ) {
						temp_uriPresent[k] = true;
					}
				}
			//}
			/*else {
				for( let l = 0; l < this.state.n; l++) {
					if( l === this.state.currentColumnIndex ) {
						temp_uriPresent[l] = !temp_uriPresent[l];
					}
				}
			}*/
            this.setState({
                uriPresent: temp_uriPresent,
            });
		}
            
        let temp_subject = this.state.firstLine[this.state.currentColumnIndex];
		this.setState({
			key_option: event.target.value,
			//uriPresent: temp_uriPresent,
            currentSubject: temp_subject,
		});
	}

	handleSelectChange = (event) => {
		let x=0;
		for(let i = 0; i < this.state.n; i++ ) {
			if(this.state.columns[i] === event.target.value) {
				x=i;
			}
		}
		document.getElementById("predicate_textbox").value = event.target.value;
	    this.setState({
	      predicateValue: event.target.value,
	      currentColumnIndex: x,
	    });
  	};

  	handleDatatypeChange = (event) => {

		let temp_types = this.state.types;
		let temp_uriPresent = this.state.uriPresent;

  		for( let i = 0; i < this.state.n; i++) {
  			if( i === this.state.currentColumnIndex ) {
  				temp_types[i] = event.target.value;
  			}
  		}
		let str1='';
	      for(var j = 0; j < this.state.firstLine.length - 1; j++ ) {
	      	str1 += this.state.predicateArray[j]+":"+ (temp_types[j])+",";
	      }
	      	str1 += this.state.predicateArray[this.state.firstLine.length-1]+":"+ (temp_types[this.state.firstLine.length-1]);

	    this.setState({
	      types: temp_types,
	      columnMappingString: str1,
	      uriPresent: temp_uriPresent,
	    });
  	};

	handleTableQuery() {
		let graph_name = this.state.fileName.split(".")[0];
		let predicateWithURI = "";
		let predicateWithoutURI = "";

		for (let x = 0; x <=this.state.firstLine.length-1; x++) {
			if(this.state.uriPresent[x] === true ) {
				predicateWithURI = "?"+graph_name.toLowerCase();
				break;
			}
			else {
				predicateWithURI = "[]";
			}
		}

	    for( let j = 0; j <= this.state.firstLine.length-1; j++) {
	      	if(this.state.predicateArray[j] !== null) {
	      		if(this.state.uriPresent[j] === true) {
		      		predicateWithURI += "_"+this.state.predicateArray[j];
	      		}
	      		else {
		      		predicateWithoutURI += "<"+this.state.predicateArray[j]+"> ?"+this.state.predicateArray[j]+";\n";
	      		}
		    }

	    }

		let binds = '';
	    for(let k = 0; k <= this.state.firstLine.length - 1; k++) {
	    	if(this.state.uriPresent[k] === true) {
	    		/*if(this.state.uriPrefixArray[k] === "")
	    		{
	    			binds += "BIND(IRI(STR(?"+this.state.predicateArray[k]+")) AS ?"+this.state.predicateArray[k]+"_uri)\n";
	    		}
	    		else {*/
	    			//binds += "BIND(IRI(CONCAT(\""+this.state.uriPrefixArray[k]+"\",STR(?"+this.state.predicateArray[k]+"))) AS ?"+this.state.predicateArray[k]+"_uri)\n";
	    			binds += "BIND(IRI(CONCAT(\""+graph_name.toUpperCase()+"#\",STR(?"+this.state.predicateArray[k]+"))) AS "+predicateWithURI+")\n";

	    		//}
	    	}
	      }

		let q="INSERT { \nGRAPH <"+graph_name+"> {\n"+predicateWithURI+"\n"+predicateWithoutURI+" } \n} \nWHERE { \nTABLE <file:///Users/sneha.paranjape/Documents/Browse/"+this.state.fileName+"> ( \n 'csv', 'global', '"+this.state.delimiter+"' ,"+this.state.option+", '"+this.state.columnMappingString+"')\n"+binds+"}";
		document.getElementById("load_query_preview_text").value = q;
		this.setState({
			table_query: q,
			clicked_button: 'table',

		});
	}

	handleInsertQuery() {
		let graph_name = this.state.fileName.split(".")[0];
		let data = '';
		for ( let i = 1; i < this.state.fileContents.length; i++) {
			let temp = this.state.fileContents[i].split(',');
	      	data +="\n<"+graph_name+i+"> a <"+graph_name+">\n";
	      	
	      	for( let j = 0; j < temp.length-1; j++) {
	      		data += "<"+graph_name+i+">";
	      		if(this.state.predicateArray[j] !== null) {
	      			if(this.state.types[j] === "date") {
	      				data += " <"+this.state.predicateArray[j]+"> \""+temp[j]+"\"^^xsd:date;";
	      			}
	      			else if(this.state.types[j] === "double") {
	      				data += " <"+this.state.predicateArray[j]+"> \""+temp[j]+"\"^^xsd:double;";
	      			}
	      			else if(this.state.types[j] === "byte") {
	      				data += " <"+this.state.predicateArray[j]+"> \""+temp[j]+"\"^^xsd:byte;";
	      			}
	      			else if(isNaN(this.state.predicateArray[j]) === true) {
	      				data += " <"+this.state.predicateArray[j]+"> "+temp[j]+";";
	      			}
		      	}
		      	else {
		      		if(isNaN(this.state.firstLine[j]) === true) {
	      				data += " <"+this.state.firstLine[j]+"> "+temp[j]+";";
	      			}
		      	}
	      		data += "\n";
	      	}
	      	if(this.state.predicateArray[temp.length-1] !== null) {
	      		data += "<"+graph_name+i+">";
	      		data += " <"+this.state.predicateArray[temp.length-1]+"> "+temp[temp.length-1]+".";
	      	}
	      	else {
	      		data += "<"+graph_name+i+">";
	      		data += " <"+this.state.firstLine[temp.length-1]+"> "+temp[temp.length-1]+".";
	      	}
	      	data += "\n";
	    }
		let q = "INSERT DATA {\nGRAPH <"+graph_name+"> {"+data+"}\n}";
		document.getElementById("load_query_preview_text").value = q;
		this.setState({
			insert_query: q,
			clicked_button: 'insert',
		});
	}

	handleSaveQuery() {
		let textToSave = this.state.clicked_button ==="insert" ? this.state.insert_query:this.state.table_query;
		let textToSaveAsBlob = new Blob([textToSave], {type: "text/plain"});
		let textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
		let downloadLink = document.createElement("a");
		downloadLink.download = "file.txt";
		downloadLink.innerHTML = "Download File";
		downloadLink.href = textToSaveAsURL;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();
	}

	onQueryChanged(event) {
		if(this.state.clicked_button === 'insert' ) {
			document.getElementById("load_query_preview_text").value = event.target.value;
			this.setState({
				insert_query: event.target.value,
			})
		}
		else {
			this.setState({
				table_query: event.target.value,
			})
		}
	}
	handlePredicateChange(event) {
		let currentpredicateArray = this.state.predicateArray;
		for(let i = 0; i < this.state.n; i++ ) {
			if(i === this.state.currentColumnIndex) {
				currentpredicateArray[i] = event.target.value;
			}	
		} 
		this.setState({
			predicateArray: currentpredicateArray,
		})
	}

	handleURIPrefix(event) {
		let currenturiPrefixArray = this.state.uriPrefixArray;
		for(let i = 0; i < this.state.n; i++ ) {
			if(i === this.state.currentColumnIndex) {
				currenturiPrefixArray[i] = event.target.value;
			}	
		} 
		this.setState({
			uriPrefixArray: currenturiPrefixArray,
		})
	}

	render() 
	{
		 let optionItems = this.state.columns.map((column) => 
		    <option key={column.toString()}>
		    	{column}
		    </option>
      		);

		return (
    			
	    		<div>
		    		<div id="first_div">
						<div id="url_div"> 
							<div id="url_label_div">
								URL: 
							</div>
							<div id="url_text_div">
								<input type="text" id="url_text"/>
							</div>
							<div id="firstPage_browse_btn_div">
								<ReactFileReader 
							    multipleFiles={false}
							    fileTypes={[".csv"]} 
							    handleFiles={this.handleFiles}>
							        
							    <button id="firstPage_browse_btn" onClick={this.handleBrowseButton}>Browse</button>
							    </ReactFileReader>
							</div>
						</div>
					</div>

					<div id="second_div">
						<div id="common_label_div"><h5>Data Preview:</h5></div>
						<div id="display">{this.state.display_table}</div>
					</div>

					<div id="third_div">
						<div id="delimiter">
							<div id="common_label_div">
								<b>Delimiter:</b>
							</div>
							<input type="text" id="delimiter_textbox" value={this.state.delimiter} onChange={this.handleDelimiterChange}/>
						</div>
						<div id="headers">
							<div id="common_label_div">
							<b>	Headers:</b>
							</div>
							<input type="radio" id="header" name="truefalse" value="true" onChange={this.handleOptionChange}/>
							True		
							<input type="radio" id="header2" name="truefalse" value="false" onChange={this.handleOptionChange}/>
							False
						</div>
					</div>

					<div id="fourth_div">
						<div id="columns_select_div">
							<div id="common_label_div">
								<b>Column Headers:</b> 
							</div>
							<select onChange={this.handleSelectChange} id="columns_select" size={this.state.n}>
								{optionItems}
							</select>
						</div>

						<div id="predicate_div"> 
							<div id="common_label_div">     
						    	<b>Predicate:</b> 
						    </div>
							<input contentEditable type="text" id="predicate_textbox" defaultValue={this.state.predicateValue} onChange={this.handlePredicateChange}/>
                            <div id="headers">
								<input type="radio" id="none_header" name="radio_key" value="none" onChange={this.handleKeyOptionChange}/>
								None
								<input type="radio" id="primary_header" name="radio_key" value="primary" onChange={this.handleKeyOptionChange}/>
								Primary Key
							</div>
                            		
						</div>
						<div id="type">
                                <div id="common_label_div">
                                    <b>Type:</b> 
                                </div>
                                <select size="1" onChange={this.handleDatatypeChange} id="type_select">
                                    <option value="boolean">boolean</option>
                                    <option value="byte">byte</option>
                                    <option value="date">date</option>
                                    <option value="float">float</option>
                                    <option value="int">int</option>
                                    <option value="short">short</option>
                                    <option value="char">char</option>
                                </select>
                            </div>

					</div>
						
					<div id="fifth_div">
						<div id="firstPage_generate_table_query_div">
							<button type="button" id="firstPage_table_query_button" onClick={this.handleTableQuery}>Generate Table Query</button>
						</div>
						<div id="firstPage_generate_insert_query_div">
							<button type="button" id="firstPage_insert_query_button" onClick={this.handleInsertQuery}>Generate Insert Query</button>
						</div>
					</div>

					<div id="load_query_preview_div">
						<div id="load_query_preview_label">
							<b>Load Query (Preview): </b> 
						</div>
						<div id="load_query_preview_text_div">
							{/*<input contentEditable type="text" id="load_query_preview_text" rows="4" defaultValue={this.state.clicked_button ==="insert" ? this.state.insert_query:this.state.table_query} onChange={this.onQueryChanged}>
								
							</input>*/}
							<textarea id="load_query_preview_text" rows="4" defaultValue={this.state.clicked_button ==="insert" ? this.state.insert_query:this.state.table_query} onChange={this.onQueryChanged}>
							</textarea>
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

export default FirstPage