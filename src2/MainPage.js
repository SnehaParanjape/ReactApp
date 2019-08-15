import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import 'react-tabs/style/react-tabs.css'

import FirstPage from './FirstPage'
import SecondPage from './SecondPage'

class TabPage extends Component {

	render() 
	{
		return (
			<Tabs>
    			<TabList>
      				<Tab>DB</Tab>
      				<Tab>CSV</Tab>
			    	<Tab>TTL</Tab>
			    </TabList>
			    <TabPanel>
	      			<SecondPage />
	    		</TabPanel>
	    		<TabPanel>
		    		<FirstPage />
	    		</TabPanel>
			    <TabPanel>
			    	<p>
						Protocol:
						<input type="text" name="protocols" id="protocols" placeholder="file or http or ftp or s3 or hdfs"></input>
					</p>
					<p> URL: 
						<input type="text" name="FileName" id="filename"></input>
						<input id="csv" type="file"></input>
					</p>
					<div id="common_label_div">
						Load Query (Preview):
						<input type="text" name="LoadQueryPreview" id="load_query_preview"></input>
					</div> 
			    </TabPanel>
  			</Tabs>
		)
	}
}

export default TabPage