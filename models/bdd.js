var mongoose = require('mongoose'); // Initialisation du module mongoose

// Options de connexion
var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology : true
}

mongoose.connect(process.env.MONGODB_URI || `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@morningnews-z356p.mongodb.net/morningnews?retryWrites=true&w=majority`, 
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