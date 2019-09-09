import React, { Component } from 'react';
import './App.css';
import './ThirdPage.css';

class ThirdPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            load_option: 'global',
            url: '',
            graph_name: '',
            query: '',
        };
        this.handleLoadOptionsChange = this.handleLoadOptionsChange.bind(this);
        this.handleURLChange = this.handleURLChange.bind(this);
        this.handleGraphNameChange = this.handleGraphNameChange.bind(this);
        this.handleLoadQuery = this.handleLoadQuery.bind(this);
        this.onQueryChanged = this.onQueryChanged.bind(this);
        this.handleSaveQuery = this.handleSaveQuery.bind(this);
    }
    handleLoadOptionsChange(event) {
        this.setState({
            load_option: event.target.value,
        })
    }
    handleURLChange(event) {
        this.setState({
            url: event.target.value,
        })
    }
    handleGraphNameChange(event) {
        this.setState({
            graph_name: event.target.value,
        })
    }
    handleLoadQuery () {
        let load_query = "LOAD WITH '"+this.state.load_option+"' <"+this.state.url+"> INTO GRAPH <"+this.state.graph_name+">";
        document.getElementById('load_query_preview_text').value = load_query;
        this.setState({
            query: load_query,
        })
    }
    onQueryChanged(event) {
        this.setState({
            query: event.target.value,
        })
    }
    handleSaveQuery() {
        let textToSave = this.state.query;
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
    render()
    {
        return (
            <div>
                <div id="load_options_div">
                    <div id="load_options_label">
                        Load WITH Options :
                    </div>
                    <select id="load_options_select" size="1" onChange={this.handleLoadOptionsChange}>
                        <option value="global">global</option>
                        <option value="leader">leader</option>
                        <option value="compute">compute</option>
                    </select>
                </div>
                <div id="url_div">
                    <div id="url_label_div">
                        Enter URL:
                    </div>
                    <input contentEditable type="text" id="url_textbox" onChange={this.handleURLChange}/>
                </div>
                <div id="graph_div">
                    <div id="graph_label_div">
                        Enter Graph Name:
                    </div>
                    <input contentEditable type="text" id="graph_textbox" onChange={this.handleGraphNameChange}/>
                </div>
                <div id="generate_load_query_div">
                    <button type="button" id="load_query_button" onClick={this.handleLoadQuery}>Generate Load Query</button>
                </div>
                <div id="load_query_preview_div">
                    <div id="load_query_preview_label">
                       <b> Load Query (Preview):</b>
                    </div>
                    <div id="load_query_preview_text_div">
                        <textarea id="load_query_preview_text" rows="2" onChange={this.onQueryChanged}/>
                    </div>
                </div>
                <div id="save_query_div">
                    <button type="button" id="save_query_button" onClick={this.handleSaveQuery}>Save Query</button>
                </div>
            </div>

        )
    }
}

export default ThirdPage;
