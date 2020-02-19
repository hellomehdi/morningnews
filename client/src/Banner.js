import React, { useEffect } from 'react';
import './App.css';
import { connect } from 'react-redux';

function Banner(props) {

  // FUNCTION TO SET COUNTRY ON CLICK
  var setCountry = async (country, lang) => {

    props.clickSetCountry(country, lang)

    await fetch('/country', {
      // Options
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}&country=${country}&lang=${lang}`
    }); 
  }


  // HOOK GET CURRENT COUNTRY FROM DB
  useEffect(() => {
    async function fetchData() {

    if(props.token !== null){
      var rawResponse = await fetch(`/country?token=${props.token}`);  
      var response = await rawResponse.json();
      props.clickSetCountry(response.country, response.lang); 
      }
    }
    fetchData();
  // eslint-disable-next-line
  }, [props.token]);


  // STYLES
  var flagStyleFR = {width:'40px', margin:"10px", cursor:'pointer'};
  var flagStyleGB = {width:'40px', margin:"10px", cursor:'pointer'};
  var flagStyleES = {width:'40px', margin:"10px", cursor:'pointer'};

  if(props.countryCode === 'fr'){
    flagStyleFR.border = '2px black solid';
    flagStyleFR.borderRadius = '100%';
  };

  if(props.countryCode === 'gb'){
    flagStyleGB.border = '2px black solid';
    flagStyleGB.borderRadius = '100%';
  };

  if(props.countryCode === 'es'){
    flagStyleES.border = '2px black solid';
    flagStyleES.borderRadius = '100%';
  };


  // RETURN PRINCIPAL
  return (
    <div className="Banner" style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
      <img style={flagStyleFR} src="/images/france.png" alt="France" onClick={ ()=>setCountry('fr', 'fr') }/>
      <img style={flagStyleGB} src="/images/united-kingdom.png" alt="GB" onClick={ ()=>setCountry('gb', 'en') }/>
      <img style={flagStyleES} src="/images/spain.png" alt="Spain" onClick={ ()=>setCountry('es', 'es') }/>
    </div>
  );
}


// COMPOSANT CONTENEUR POUR LE COUNTRY
function mapDispatchToProps(dispatch){
    return {
      clickSetCountry: function(countryCode, languageCode){
        dispatch({type: 'setCountry', countryCode: countryCode, languageCode: languageCode})
      }
    }
  };


// Fonction permettant de cibler les états du store qu'on veut exploiter
function mapStateToProps(state) { 
    return { countryCode: state.country.countryCode, languageCode: state.country.languageCode, token: state.token } // token accessible en tant que prop 
  }


// EXPORT
export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(Banner)