export default function (country = {}, action) {

    if(action.type === 'setCountry') {

        var countryCopy = {};

        countryCopy.countryCode = action.countryCode;
        countryCopy.languageCode = action.languageCode;

        return countryCopy;

    } else {

        return country;
        
    }

}