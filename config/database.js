let mongoose  = require ('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/cnt',{
    useNewUrlParser: true,
    useUnifiedTopology:true
    //useCreateIndex:true
}).then(()=>console.log("Connection Sucessfull"))
    .catch((err) => console.log(err));