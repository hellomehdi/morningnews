export default function(wishlist=[], action) {

    var wishlistCopy = [];

    if(action.type === 'addArticle' && wishlistCopy.some(article => article.title === action.articleLiked.title) === false) {

        wishlistCopy = [...wishlist];
        wishlistCopy.push(action.articleLiked);

        return wishlistCopy;

    } else if(action.type === 'removeArticle') {

        wishlistCopy = [...wishlist];
        wishlistCopy = wishlistCopy.filter(article => article.title !== action.articleRemoved.title);

        return wishlistCopy;

    } else if(action.type === 'setArticles'){

        wishlistCopy = action.articlesAdded;

        return wishlistCopy;

    } else if(action.type === 'resetArticles'){

        wishlistCopy = [];
        return wishlistCopy;
        
    } else {
    
        return wishlist;
    
    }
        
    

}