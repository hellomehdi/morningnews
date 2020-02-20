import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './App.css';
import { Card, Icon, Modal } from 'antd';
import Nav from './Nav'
import Banner from './Banner'
import { connect } from 'react-redux';

const { Meta } = Card;

function MyArticles(props) {

  // ETATS
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');


  // HOOK GET WISHLIST ARTICLES FROM DB
  useEffect(() => {
    async function fetchData() {

      if(props.token !== null && props.language !== null && props.country !== null){

        var rawResponse = await fetch(`/wishlist?token=${props.token}&country=${props.country}`);  
        var response = await rawResponse.json();
        props.resetWishList();

        response.articles.forEach(function(responseArticle){
          props.addToWishList(responseArticle);
        });

      }

    }

    fetchData();
  // eslint-disable-next-line
  }, [props.token, props.country, props.language]);


  // IF NOT LOGGED IN, REDIRECT
  if(props.token === null || props.token === undefined){
    return(
      <Redirect to='/' />
    )
  };


  // FUNCTION DELETE WISHLIST ARTICLE FROM DB
  var deleteArticle = async (article) => {
    await fetch(`/wishlist/${props.token}/${article.title}`, {
      method: 'DELETE'
    });
    props.removeFromWishList(article);
  }


  // Settings pour la modal
  var handleClickShowModal = (title, content) => {
    setVisible(true)
    setModalTitle(title);
    setModalContent(content);
  };
  var handleCancel = e => {
    setVisible(false)
  };


  // On boucle sur tous les articles
  var wishlist = props.myArticles.map(function(article, i) {
    return (
      <div key={i} style={{display:'flex', justifyContent:'center'}}>
      <Modal
        title={modalTitle}
        visible={visible}
        okText='Read more'
        okButtonProps={{href:article.url, target:'_blank', style:{marginLeft:'10px'}}}
        cancelText='Close'
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
          <Icon type="delete" key="ellipsis" onClick={()=>deleteArticle(article)}/>
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


  // IF NO ARTICLES IN LIST, SHOW TEXT
  var noArticles;
  if(props.myArticles.length === 0){
    noArticles = <p style={{marginTop:"50px"}}>No articles</p>
  };


  // RETURN PRINCIPAL
  return (
    <div>
      <Nav/>
      <Banner />
      <div className="Card">
        {wishlist}
        {noArticles}
      </div>
    </div>
  );
}


// Fonction permettant de cibler les états du store qu'on veut exploiter
function mapStateToProps(state) {
  return { myArticles: state.wishlist, token: state.token, country: state.country.countryCode, language: state.country.languageCode }
}


// Composant conteneur pour redux
function mapDispatchToProps(dispatch) {
  return {
    removeFromWishList: function(article) { // Fonction accessible en tant que propriété
      dispatch( {type: 'removeArticle', articleRemoved: article} ) // Initialisation de l'action
    },
    addToWishList: function(article) { 
      dispatch( {type: 'addArticle', articleLiked: article} ) 
    },
    setWishList: function(articles) { 
      dispatch( {type: 'setArticles', articlesAdded: articles} ) 
    }, 
    resetWishList: function() { 
      dispatch( {type: 'resetArticles'} ) 
  }
  }
}


// EXPORT
export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(MyArticles);
