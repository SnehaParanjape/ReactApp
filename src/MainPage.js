import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './index.css';
import 'react-tabs/style/react-tabs.css'

import FirstPage from './FirstPage'
import SecondPage from './SecondPage'
import ThirdPage from "./ThirdPage";

class TabPage extends Component {

	render() 
	{
		return (
			<Tabs>
    			<TabList>
    				<Tab>CSV</Tab>
      				<Tab>DB</Tab>
			    	<Tab>TTL</Tab>
			    </TabList>
	    		<TabPanel>
		    		<FirstPage />
	    		</TabPanel>
	    		<TabPanel>
	      			<SecondPage />
	    		</TabPanel>
			    <TabPanel>
			    	<ThirdPage />
			    </TabPanel>
  			</Tabs>
		)
	}
}

export default TabPage