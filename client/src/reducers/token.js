export default function(token = null, action) {

    var tokenCopy;
    
    if(action.type === 'addToken') {

        tokenCopy = action.token;
        return tokenCopy;

    } else if(action.type === 'deleteToken') {

        tokenCopy = null;
        return tokenCopy;
        
    } else {

        return token;

    }

}
