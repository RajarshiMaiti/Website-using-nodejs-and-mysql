var mysql = require('mysql');
var express = require('express');


var bodyParser = require('body-parser');
var api=require('novelcovid');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'mr',
    port: '3308',
});


var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request,response){
    response.sendFile(__dirname + '/index.html');
});


app.get('/merchandise', function(request, response) {
    response.sendFile(__dirname + '/merchandise.html');
});


app.get('/myteam', function(request, response){
    response.sendFile(__dirname + '/myteam.html');
});

app.get('/loginpage', function(request, response) {
    response.sendFile(__dirname + '/loginpage.html');
});





app.post('/selectdata', function(request, response) {
    var Username = request.body.Username;
    var Password = request.body.Password;
    if (Username && Password) {
        connection.query('SELECT * FROM data WHERE Username = ? AND Password = ?', [Username, Password], function(error, results, fields) {
            if (results.length > 0) {
                
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }           
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');   
        response.end();
    }
});


app.get('/home', function(request, response) {
    
    response.sendFile(__dirname + '/index.html');
});




app.get('/data', function(request, response){
    response.sendFile(__dirname + '/register.html');
});

app.post('/dataregister',function(req,res){
    var Name=req.body.Name;
    var Address=req.body.Address;
    var Country=req.body.Country;
    var Phone=req.body.Phone;
    var id=req.body.id;
    

    connection.connect(function(err){
        var sql="INSERT INTO hp(Name,Address,Country,Phone) values('"+Name+"','"+Address+"','"+Country+"','"+Phone+"')";
        connection.query(sql,function(err,register){
            if(err) throw err;
            console.log("Record Inserted");
            res.redirect('/home');
        });
    });

});





app.get('/update', function(request, response){
    response.sendFile(__dirname + '/modify.html');
});


app.post('/update',function(req,res){
    var Name=req.body.Name;
    var Address=req.body.Address;
    var Country=req.body.Country;
    var Phone=req.body.Phone;
    var id=req.body.id;
    

    connection.connect(function(err){
        var sql="update hp set Name= '"+Name+"',Address= '"+Address+"',Country='"+Country+"',Phone='"+Phone+"' where id='"+id+"'"; 
        connection.query(sql,function(err,register){
            if(err) throw err;
            console.log("Record updated");
            res.redirect('/update');
        });
    });

});


app.get('/media', function(request, response){
    response.sendFile(__dirname + '/media.html');
});


app.post('/mediapage',function(req,res){
    var Name=req.body.Name;
    var Email=req.body.Email;
    var Subject=req.body.Subject;
    var Comment=req.body.Comment;
    var id=req.body.id;
    

    connection.connect(function(err){
        var sql="INSERT INTO info(Name,Email,Subject,Comment) values('"+Name+"','"+Email+"','"+Subject+"','"+Comment+"')";
        connection.query(sql,function(err,register){
            if(err) throw err;
            console.log("Record Inserted");
            res.redirect('/home');
        });
    });

});


app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static('./public'));

app.get('/covid',async(req,res)=>{
    const global=await api.all();
    const countries=await api.countries({sort:'cases'});
    res.render('covid',{global,countries});
});




app.listen(7000);
console.log('Server Started');