import React, { useState, useEffect } from 'react';
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'
import Banner from './Banner'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function extractHostname(url) { //find & remove protocol (http, ftp, etc.) and get hostname
  var hostname;
  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  return hostname;
}

function Sources(props) {

  //ETATS
  const [sourceList, setSourceList] = useState([]);


  // HOOK 
  useEffect(() => {
    async function fetchData() {
      if(props.token !== null && props.languageCode !== null && props.countryCode !== null){

        var rawResponse = await fetch(`http://newsapi.org/v2/sources?language=${props.languageCode}&country=${props.countryCode}&apiKey=7dacd8a2aabe4673a8daed9dfcd5875a`);  
        var response = await rawResponse.json();
        setSourceList(response.sources);

      }
    }
    fetchData();
  // eslint-disable-next-line
  }, [props.countryCode, props.languageCode, props.token]);


  // RETURN PRINCIPAL
  return (
    <div>
        <Nav/>
        <Banner />
       <div className="HomeThemes">
              <List
                  itemLayout="horizontal"
                  dataSource={sourceList}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`https://logo.clearbit.com/${extractHostname(item.url)}`} />}
                        title={<Link to={`/articlesbysource/${item.id}`}>{item.name}</Link>}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />
          </div>
      </div>
  );
}


// COMPOSANT POUR ACCEDER 
function mapStateToProps(state) {
  return { countryCode: state.country.countryCode, languageCode: state.country.languageCode, token: state.token, sources: state.sources};
};


// EXPORT
export default connect(
  mapStateToProps,
  null
  )(Sources)
