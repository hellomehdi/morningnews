var mongoose = require('mongoose'); // Initialisation du module mongoose

// Options de connexion
var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology : true
}

mongoose.connect(process.env.MONGODB_URI, 
    options,         
    function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Connection DB OK");
        }
    }
);

module.exports = mongoose;