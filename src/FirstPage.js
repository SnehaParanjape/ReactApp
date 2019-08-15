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

			checkBoxchecked: false,

			fileName: '',
			firstLine: '',
			fileContents: '',

			csvData: sampleData,
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

		    //currentDatatype: '',

		    currentColumnIndex: 0,

		    uriPrefixArray: [""],
		    uriPresent: [],
		    currentSubject: "",

		};

		this.handleFiles = this.handleFiles.bind(this);
		this.handleBrowseButton = this.handleBrowseButton.bind(this);

		this.handleDelimiterChange = this.handleDelimiterChange.bind(this);
		this.handleOptionChange = this.handleOptionChange.bind(this);

		this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);

		this.handleInsertQuery = this.handleInsertQuery.bind(this);
		this.handleTableQuery = this.handleTableQuery.bind(this);
		this.handleSaveQuery = this.handleSaveQuery.bind(this);

		this.handleDatatypeChange = this.handleDatatypeChange.bind(this);

		this.onQueryChanged = this.onQueryChanged.bind(this);

		this.handlePredicateChange = this.handlePredicateChange.bind(this);

		this.handleURIPrefix = this.handleURIPrefix.bind(this);

	}

	handleFiles = files => {
    	var reader = new FileReader();
    	reader.onload =  (e) => {

	      var text = reader.result;
	      var completeFile = text.split('\n');

	      var CSV=require('csv-string');

    		//console.log(CSV.detect(completeFile));
    		var currentDelimiter = CSV.detect(completeFile);
	      var tempfirstLine=completeFile[0].split(currentDelimiter);
	      var secondLine = completeFile[1].split(currentDelimiter);
	      var secondLine2 = secondLine;

	      //var tempsecondLine = completeFile[1].split(',');

	      /*for (var kit=1;kit<completeFile.length;kit++)
	      {
	      	console.log(completeFile[kit]);
	      	//console.log(completeFile[kit].split(','));
	      	var temp = completeFile[kit].split(',');
	      	for(var ros=0;ros<temp.length;ros++)
	      	{
	      		console.log(temp[ros]);
	      	}

	      }*/

	      for(var i=0; i < tempfirstLine.length; i++) {
	      		if(isNaN(secondLine[i]) === false) {

	      			secondLine2[i] = Number(secondLine[i]);
	      		}
	      		else {
	      			secondLine2[i] = secondLine[i];
	      		}
	      }
	     	var headerCondition;
	     	var thirdLine = completeFile[2].split(currentDelimiter);
	     	var tempfirstLine2 = tempfirstLine;
	     	var thirdLine2 = thirdLine;
	     	
	     	for(var k = 0; k < tempfirstLine.length; k++) {
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

	     	if( 
	     		( 
	     			(
	     				(typeof tempfirstLine2[0]) != (typeof secondLine2[0])
	     		  	) && 
	     		  	(
	     		  		(typeof secondLine2[0]) == (typeof thirdLine2[0])
	     		  	)
	     		) || 
	     		( 
	     			(
	     				(typeof tempfirstLine2[1]) != (typeof secondLine2[1])
	     			) && 
	     			(
	     				(typeof secondLine2[1]) == (typeof thirdLine2[1])
	     			)
	     		)
	     	)
	     		headerCondition = true;
	     	else
	     		headerCondition = false;
	     	
    	var cols, uristates = this.state.uriPresent;
    	var temp_types=this.state.types;

    	if(headerCondition === true) {
    		cols=tempfirstLine;
    		for (var l = 0; l <tempfirstLine.length; l++) {
    			temp_types[l] = typeof secondLine[l];
    			if(typeof secondLine[l] === "number") {
    				//console.log(secondLine[l]);
    				//console.log(Number.isInteger(secondLine[l]));
    				if(Number.isInteger(secondLine[l])) {
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
    	} else {
    		cols=this.state.columns;
    		
    		for( var m = 0; m < tempfirstLine.length; m++) {
    			cols[m] = "column"+m;
    			uristates[m] = false;
    		}
    	}
    	//Initializing ALL Column Headers' Uri Prefix as ""
    	var temp_uriPrefixArray = this.state.uriPrefixArray;
    	for( var q = 0; q < tempfirstLine.length; q++) {
    			temp_uriPrefixArray[q] = "";
    		}

    	var str1='';

	      for(var j=0;j<tempfirstLine.length -1;j++) {
	        str1 += "col"+(j+1)+":"+ (this.state.types[j])+",";
	      }
	      str1 += "col"+[tempfirstLine.length]+":"+ (this.state.types[tempfirstLine.length-1]);
    		
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

    	}
    	reader.readAsText(files[0]);
  	}

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
  		this.setState({
			delimiter: event.target.value,
			display_table: <CsvToHtmlTable 
						        data={this.state.csvData || sampleData}
						        csvDelimiter={event.target.value}
						        tableClassName="table table-hover"
						        hasHeader={this.state.option} 
						    />,
		})
	}

	handleOptionChange(event) {
		var x = this.state.option === "true" ? <CsvToHtmlTable 
						        data={this.state.csvData || sampleData}
						        csvDelimiter={this.state.delimiter}
						        tableClassName="table table-hover"
						        hasHeader={false} 
						    />: <CsvToHtmlTable 
						        data={this.state.csvData || sampleData}
						        csvDelimiter={this.state.delimiter}
						        tableClassName="table table-hover"
						        hasHeader={true} 
						    />;
	  this.setState({
	  	option: event.target.value,
	  	display_table: x,
	  });
	}

	handleSelectChange = (event) => {
		var x=0;
		for(var i = 0; i < this.state.n; i++ ) {
			if(this.state.columns[i] === event.target.value) {
				x=i;
			}	
		} 
		
		document.getElementById("predicate_textbox").value = event.target.value;
	    this.setState({
	      predicateValue: event.target.value,
	      currentColumnIndex: x,
	      
	    });
  	}

  	handleDatatypeChange = (event) => {

  		var temp_types = this.state.types;
  		var temp_uriPresent = this.state.uriPresent;

  		for( var i = 0; i < this.state.n; i++) {
  			if( i === this.state.currentColumnIndex ) {
  				temp_types[i] = event.target.value;
  			}
  		}
		/*
  		var str1='';

	      
	      for(var j = 0; j < this.state.firstLine.length -1; j++ ) {
	      	str1 += this.state.firstLine[j]+" : "+ (this.state.types[j])+", ";
	      }
	      str1 += this.state.firstLine[this.state.firstLine.length-1]+" : "+ (this.state.types[this.state.firstLine.length-1]);
	      */

	      var str1='';

	      for(var j = 0; j < this.state.firstLine.length - 1; j++ ) {
	      	if(temp_types[j] === "uri") {
	      		str1 += "col"+(j+1)+":char, ";
	      	}
	      	else {
	      		str1 += "col"+(j+1)+":"+ (temp_types[j])+",";
	      	}
	      }
	      if(temp_types[this.state.firstLine.length-1] === "uri") {
	      		str1 += "col"+(j+1)+":char";
	      	}
	      	else {
	      		str1 += "col"+[this.state.firstLine.length]+":"+ (temp_types[this.state.firstLine.length-1]);
	      	}
	      

	      if(event.target.value === "uri") {
	      	document.getElementById("col_uri").style.display = 'block';
	      	temp_uriPresent[this.state.currentColumnIndex] = true;
	      }
	      else {
	      	document.getElementById("col_uri").style.display = 'none';
	      }
	     // console.log(temp_uriPresent);
	    this.setState({
	      types: temp_types,
	      columnMappingString: str1,
	      uriPresent: temp_uriPresent,
	    });
  	}

	handleCheckBoxChange() {

		var temp_types = this.state.types;
  		for( var i = 0; i < this.state.n; i++) {
  			if( i === this.state.currentColumnIndex ) {
  				temp_types[i] = "uri";
  			}
  		}
		
	    var str1='';

	    for(var j = 0; j < this.state.firstLine.length - 1; j++ ) {
	    	if(temp_types[j] === "uri") {
	      		str1 += "col"+(j+1)+":char, ";
	      	}
	      	else {
	      		str1 += "col"+(j+1)+":"+ (temp_types[j])+",";
	      	}
	    }
	    if(temp_types[this.state.firstLine.length-1] === "uri") {
	      	str1 += "col"+(j+1)+":char";
	    }
	    else {
	      	str1 += "col"+[this.state.firstLine.length]+":"+ (temp_types[this.state.firstLine.length-1]);
	    }

		var temp_uriPresent = this.state.uriPresent;
  		if(!this.state.checkBoxchecked) {
	  		for( var k = 0; k < this.state.n; k++) {
	  			if( k === this.state.currentColumnIndex ) {
	  				temp_uriPresent[k] = !temp_uriPresent[k];
	  			}
	  		}
  		}
  		else {
  			for( var l = 0; l < this.state.n; l++) {
	  			if( l === this.state.currentColumnIndex ) {
	  				temp_uriPresent[l] = !temp_uriPresent[l];
	  			}
	  		}
  		}
  		var temp_subject = this.state.firstLine[this.state.currentColumnIndex];
  		//console.log(temp_uriPresent);
  		
		this.setState({
			checkBoxchecked: !this.state.checkBoxchecked,
			types: temp_types,
			columnMappingString: str1,
			uriPresent: temp_uriPresent,
			currentSubject: temp_subject,
		})
	}

	handleTableQuery(event) {
		/*var binds = '';
		for(var j = 0; j < this.state.firstLine.length - 1; j++) {

			binds += "BIND(IRI(CONCAT(\""+this.state.firstLine[j]+"\",str(?"+this.state.firstLine[j]+")) AS ?"+this.state.firstLine[j]+"_uri))\n";
	        //str1 += cols[j]+" : "+ (this.state.types[j])+", ";
	      }
	      //str1 += cols[tempfirstLine.length-1]+" : "+ (this.state.types[tempfirstLine.length-1]);
	      	binds += "BIND(IRI(CONCAT(\""+this.state.firstLine[this.state.firstLine.length-1]+"\",str(?"+this.state.firstLine[this.state.firstLine.length-1]+")) AS ?"+this.state.firstLine[this.state.firstLine.length-1]+"_uri))\n";
		var q="TABLE <"+this.state.fileName+">\n('csv', 'global', ' "+this.state.delimiter+" ' ,"+this.state.option+", ' "+this.state.columnMappingString+" ')\n"+binds;
		document.getElementById("load_query_preview_text").value = q;
		this.setState({
			table_query: q,
			clicked_button: 'table',
		});
		*/
		/*var data = "";
		if( this.state.currentSubject !== "" ) {
			data = "[?"+this.state.currentSubject+"]";
		}
		else {
			data = "["+this.state.currentSubject+"]";
		}
		*/

		var data = "[ ]";

	    for( var j = 0; j <= this.state.firstLine.length-1; j++) {
	      	if(this.state.predicateArray[j] !== null) {
	      		if(this.state.types[j] === "uri") {
		      		//data += " <"+this.state.predicateArray[j]+"> ?"+this.state.predicateArray[j]+"_uri ;";
		      		data += " <"+this.state.predicateArray[j]+"> ?col"+(j+1)+"_uri ;";
	      		}
	      		else {
	      			//data += " <"+this.state.predicateArray[j]+"> ?"+this.state.predicateArray[j]+"_uri ;";
		      		data += " <"+this.state.predicateArray[j]+"> ?col"+(j+1)+";";
	      		}
		    }
		    else {
		      	
		      	if(this.state.types[j] === "uri") {
					//data += " <"+this.state.firstLine[j]+"> ?"+this.state.firstLine[j]+"_uri ;";
		      		data += " <"+this.state.firstLine[j]+"> ?col"+(j+1)+"_uri ;";
	      		}
	      		else {
					//data += " <"+this.state.firstLine[j]+"> ?"+this.state.firstLine[j]+"_uri ;";		      		
					data += " <"+this.state.firstLine[j]+"> ?col"+(j+1)+";";
	      		}
		    }
		    data += "\n";
	    }

	    var binds = '';
	    for(var k = 0; k <= this.state.firstLine.length - 1; k++) {

	    	if(this.state.uriPresent[k] === true) {
	    		//binds += "BIND(IRI(CONCAT(\""+this.state.uriPrefixArray[k]+"\",?"+this.state.firstLine[k]+")) AS ?"+this.state.firstLine[k]+"_uri).\n";
	    		if(this.state.uriPrefixArray[k] === "")
	    		{
	    			binds += "BIND(IRI(STR(?col"+(k+1)+")) AS ?col"+(k+1)+"_uri)\n";
	    		}
	    		else {
	    			binds += "BIND(IRI(CONCAT(\""+this.state.uriPrefixArray[k]+"\",STR(?col"+(k+1)+"))) AS ?col"+(k+1)+"_uri)\n";
	    		}
	    	}
			//binds += "BIND(IRI(CONCAT(\""+this.state.firstLine[j]+"\",str(?"+this.state.firstLine[j]+")) AS ?"+this.state.firstLine[j]+"_uri))\n";
	        //str1 += cols[j]+" : "+ (this.state.types[j])+", ";
	      }
	      //str1 += cols[tempfirstLine.length-1]+" : "+ (this.state.types[tempfirstLine.length-1]);
	      	//binds += "BIND(IRI(CONCAT(\""+this.state.firstLine[this.state.firstLine.length-1]+"\",str(?"+this.state.firstLine[this.state.firstLine.length-1]+")) AS ?"+this.state.firstLine[this.state.firstLine.length-1]+"_uri))\n";
		var graph_name = this.state.fileName.split(".")[0];
		var q="INSERT { \nGRAPH <"+graph_name+"> {\n"+data+" } \n} \nWHERE { \nTABLE <file:///"+this.state.fileName+"> ( \n 'csv', 'global', '"+this.state.delimiter+"' ,"+this.state.option+", '"+this.state.columnMappingString+"')\n"+binds+"}";
		document.getElementById("load_query_preview_text").value = q;

		this.setState({
			table_query: q,
			clicked_button: 'table',
		});
	}

	handleInsertQuery(event) {
		/*
		var data = '';
		for ( var i = 1; i < this.state.fileContents.length; i++) {
	      	var temp = this.state.fileContents[i].split(',');
	      	data += "\n[ ] ";
	      	
	      	for( var j = 0; j < temp.length-1; j++) {
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
		      		console.log("First Line"+this.state.firstLine[j]);
		      		if(isNaN(this.state.firstLine[j]) === true) {
	      				data += " <"+this.state.firstLine[j]+"> "+temp[j]+";";
	      			}
		      	}
	      		data += "\n";
	      	}
	      	
	      	if(this.state.predicateArray[temp.length-1] !== null) {
	      		data += " <"+this.state.predicateArray[temp.length-1]+"> "+temp[temp.length-1]+".";
	      	}
	      	else {
	      		data += " <"+this.state.firstLine[temp.length-1]+"> "+temp[temp.length-1]+".";
	      	}
	      	data += "\n";
	    }
		var q = "INSERT DATA {\nGRAPH <filename> {"+data+"}\n}";
		document.getElementById("load_query_preview_text").value = q;
		this.setState({
			insert_query: q,
			clicked_button: 'insert',
		});
		*/
		var graph_name = this.state.fileName.split(".")[0];
		var data = '';
		for ( var i = 1; i < this.state.fileContents.length; i++) {
	      	var temp = this.state.fileContents[i].split(',');
	      	data +="\n<"+graph_name+i+"> a <"+graph_name+">\n";
	      	
	      	for( var j = 0; j < temp.length-1; j++) {
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
	    
		var q = "INSERT DATA {\nGRAPH <"+graph_name+"> {"+data+"}\n}";
		document.getElementById("load_query_preview_text").value = q;
		this.setState({
			insert_query: q,
			clicked_button: 'insert',
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

		var currentpredicateArray = this.state.predicateArray;

		for(var i = 0; i < this.state.n; i++ ) {
			if(i === this.state.currentColumnIndex) {
				currentpredicateArray[i] = event.target.value;
			}	
		} 
		//console.log(currentpredicateArray);
		this.setState({
			predicateArray: currentpredicateArray,
		})
	}

	handleURIPrefix(event) {
		var currenturiPrefixArray = this.state.uriPrefixArray;

		for(var i = 0; i < this.state.n; i++ ) {
			if(i === this.state.currentColumnIndex) {
				currenturiPrefixArray[i] = event.target.value;
			}	
		} 
		//console.log(currenturiPrefixArray);
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

		const checkBoxContent = this.state.checkBoxchecked ? 
			<div id="type">
				<div id="common_label_div">					
					Type:
				</div>		
				<select size="1">
					<option value="uri">uri</option>
				</select>
				<div id="common_label_div">
					URI prefix:
				</div>
				<input contentEditable type="text" id="uri_prefix" onChange={this.handleURIPrefix}></input>
			</div> : <div id="type">
					<div id="common_label_div">				
						Type:
					</div>			
					<select size="1" onChange={this.handleDatatypeChange}>
						<option value="boolean">boolean</option>
						<option value="byte">byte</option>
						<option value="date">date</option>
						<option value="float">float</option>
						<option value="int">int</option>
						<option value="short">short</option>
						<option value="char">char</option>
						<option value="uri">uri</option>
					</select>
					<div id="col_uri">
						<div id="common_label_div">
							URI prefix:
						</div>
						<input contentEditable type="text" id="uri_prefix" onChange={this.handleURIPrefix}></input>
					</div>
				</div>;
		return (
    			
	    		<div>
		    		<div id="first_div">

		    			<div id="protocol_div">
		    				<div id="protocol_label_div">
								Protocol:
							</div>
							<div id="protocol_select_div">
								<select size="1" id="protocols_select">
									<option value="file">file</option>
									<option value="http">http</option>
									<option value="ftp">ftp</option>
									<option value="s3">s3</option>
									<option value="hdfs">hdfs</option>
								</select>
							</div>
							<div id="open_btn_div">
								<button type="button" id="open_file_button">Open</button>
							</div>
						</div>
						<div id="url_div"> 
							<div id="url_label_div">
								URL: 
							</div>
							<div id="url_text_div">
								<input type="text" id="url_text"></input>
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
						{this.state.display_table}
					</div>


					<div id="third_div">
						<div id="delimiter">
							<div id="common_label_div">
								Delimiter:
							</div>
							<input type="text" id="delimiter_textbox" value={this.state.delimiter} onChange={this.handleDelimiterChange}/>
						</div>
						<div id="quote_char">
							<div id="common_label_div">
								Quote Char:
							</div>
							<input type="text" id="quote_char_textbox" defaultValue=""/>
						</div>
						<div id="esc_char">
							<div id="common_label_div">
								Esc Char:
							</div>
							<input type="text" id="esc_char_textbox"></input>
						</div>
						<div id="headers">
							<div id="common_label_div">
								Headers:
							</div>
							<input type="radio" id="header" name="truefalse" value="true" onChange={this.handleOptionChange}></input>
							True		
							<input type="radio" id="header2" name="truefalse" value="false" onChange={this.handleOptionChange}></input>
							False
						</div>
					</div>

					<div id="fourth_div">
						<div id="columns_select_div">
							<div id="common_label_div">
								Column Headers:
							</div>
							<select onChange={this.handleSelectChange} id="columns_select" size={this.state.n}>
								{optionItems}
							</select>
						</div>

						<div id="predicate_div"> 
							<div id="common_label_div">     
						    	Predicate:
						    </div>
							<input contentEditable type="text" id="predicate_textbox" defaultValue={this.state.predicateValue} onChange={this.handlePredicateChange}></input>   
							<div id="common_label_div">
								Is Subject:
							<input type="checkbox" checked={ this.state.checkBoxchecked } onChange={ this.handleCheckBoxChange }></input>
							</div>
							<br/>		
						</div>
						{ checkBoxContent }
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
							Load Query (Preview):  
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

					<div id="run_query_div">
						<button type="button" id="run_query_button">Run Query</button>
					</div>
					
	    		</div>
		)
	}
}

export default FirstPage