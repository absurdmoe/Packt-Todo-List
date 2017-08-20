const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const url = 'mongodb://heroku_z06hj07v:vl28l2t9r415bjlpm8ve8rfsq7@ds153123.mlab.com:53123/heroku_z06hj07v' || 'mongodb://127.0.0.1:27017/todoa';
const MongoClient = mongo.MongoClient;
let ObjectId = require('mongodb').ObjectId;

let port = process.env.PORT || 3000;
const c = console.log;


app.use("/", express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


app.get('/',( req,res ) => {
	res.sendFile(__dirname + '/index.html');
})



app.get('/tasks/update/:id',( req,res ) =>{
	res.sendFile(__dirname + '/update.html');
})



let doMongo = ( funct ) => {
	MongoClient.connect(url, ( err,db ) => {
		let tasks = db.collection('tasks');
		funct(err,db,tasks);
	})
}

app.get('/tasks/index', ( req,res ) => {
	doMongo((err,db,tasks) => {
		tasks.find({}).toArray((error,result)=>{
			res.send(JSON.stringify(result));
		})
	})
})


app.post('/tasks/new/', ( req, res ) => {
	doMongo((err,db,tasks) => {
		tasks.insert({
			info: req.body.info,
			timestamp: new Date()
		})
	})
	res.redirect('/');
})


app.put('/tasks/update/', ( req,res ) => {
	console.log(req.body.info,req.body.id)
	let o_id = new ObjectId(req.body.id)
	doMongo((err,db,tasks) => {
		tasks.update({_id: o_id}, { $set: { info: req.body.info } });
	})
	res.end();
})

app.delete('/tasks/delete/:id', (req,res) => {
	let o_id = new ObjectId(req.params.id);
	doMongo((err,db,tasks) => {
		tasks.remove({_id: o_id},(err,result)=>{
			console.log(err,result);
		});
	})
	res.end();
})

app.get('*',(req,res) => res.send('404 not found'));

app.listen(port,( err ) => {
	!err?c('listening',port):c('err',err);
})