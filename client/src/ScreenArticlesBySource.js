import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux';
const { Meta } = Card;

function ArticlesBySource(props) {

  // ETATS
  const [articlesList, setArticlesList] = useState([]);

  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');


  // HOOK
  useEffect(() => {
    async function fetchData() {
      if(props.token !== null){
        var rawResponse = await fetch(`/top-headlines?id=${props.match.params.id}`);  
        var response = await rawResponse.json();
        setArticlesList(response.articles);
      }
    }
    fetchData();
  }, [props.match.params.id, props.token]);


  // REDIRECT IF NOT LOGGED IN
  if(props.token === null || props.token === undefined){
    return(
      <Redirect to='/' />
    )
  };


  // FUNCTION TO SAVE ARTICLE TO REDUX AND DB
  var saveArticle = async (article) => {

    // CHECK IF ARTICLE IS IN WISHLIST ALREADY THEN ADD IT
    if(props.token !== null && props.country !== null){

      var rawResponse = await fetch(`/wishlist?token=${props.token}&country=${props.country}`);  
      var response = await rawResponse.json();

      if(response.articles.some(articleDB => articleDB.title === article.title)) {

        // Do nothing, article already in DB

      } else {

        props.addToWishList(article);
  
        var data = JSON.stringify({
          title: article.title,
          description: article.description,
          content: article.content,
          urlToImage: article.urlToImage,
          token: props.token,
          country: props.country
        });
      
        await fetch('/add-to-wishlist', {
          // Options
          method: 'POST',
          headers: {'Content-Type':'application/Json'},
          body: data
  
        });
      };
    };
  };


  // FONCTIONS FOR MODAL COMPONENT
  var handleClickShowModal = (title, content) => {
    setVisible(true)
    setModalTitle(title);
    setModalContent(content);
  };
  var handleOk = e => {
    setVisible(false)
  };
  var handleCancel = e => {
    setVisible(false)
  };


  // On boucle sur tous les articles
  var allArticles = articlesList.map(function(article, i) {
    return (
      <div key={i} style={{display:'flex',justifyContent:'center'}}>
          <Modal
            title={modalTitle}
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            closable={false}
            >
            <p>{modalContent}</p>
          </Modal>
          <Card
            style={{ 
            width: 300, 
            margin:'15px', 
            display:'flex',
            flexDirection: 'column',
            justifyContent:'space-between' }}
            cover={
            <img
                alt="example"
                src={article.urlToImage}
            />
            }
            actions={[
                <Icon type="read" key="ellipsis2" onClick={()=>handleClickShowModal(article.title, article.content)}/>,
                <Icon type="like" key="ellipsis" onClick={()=>saveArticle(article)}/>
            ]}
            >
            <Meta
              title={article.title}
              description={article.description}
            />
          </Card>
        </div>
    )
  });


  // RETURN PRINCIPAL
  return (
    <div>
      <Nav/>
        <div className="Banner"/>
        <div className="Card">
        {allArticles}    
        </div>   
    </div>
  );
}


// Composant conteneur pour redux
function mapDispatchToProps(dispatch) {
  return {
    addToWishList: function(article) { // Fonction accessible en tant que propriété
        dispatch( {type: 'addArticle', articleLiked: article} ) // Initialisation de l'action, et on transfert l'article
    }
  }
}


// Fonction permettant de cibler les états du store qu'on veut exploiter
function mapStateToProps(state) { 
  return { token: state.token, country: state.country.countryCode } // token accessible en tant que prop 
}


// EXPORT
export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(ArticlesBySource);
