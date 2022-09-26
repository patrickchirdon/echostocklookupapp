
const express=require('express');
const app=express()
app.use(express.static('views/images')); 
const exphbs =require('express-handlebars');

const path = require('path');
const request = require('request')
const bodyParser= require('body-parser');

const PORT=process.env.PORT || 5000;

//use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

var tickervar = 0

const { Console } = require("console");
// get fs module for creating write streams
const fs = require("fs");

app.use(express.static('.'))

var jsondata;

var accountSid = "AC762f6adbc2f2d427b1678c7614663714" // Your Account SID from www.twilio.com/console
var authToken = "d9b8068bc7b60c3242da8a4dffe6974b"  // Your Auth Token from www.twilio.com/console


const client = require('twilio')(accountSid, authToken);




                                
                                 

function call_api(finishedAPI, ticker){
    
    if (tickervar===0){
    ticker='TSLA'
    tickervar=1
    }
    
	request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_2711a2706e924888a2a063e6e4cf4307', {json: true}, (err, res,body)=> {
	if(err){ return console.log(err);}
	if(res.statusCode ===200){
	    
    const myLogger = new Console({
    stdout: fs.createWriteStream("views/overview.json"),
    stderr: fs.createWriteStream("errStdErr.txt"),
    });
	    myLogger.log(JSON.stringify(body))
	    
        
        
		finishedAPI(body);
		}
	});
	
	if (tickervar===0){
    ticker='TSLA'
    tickervar=1
    }
    
	
	//advanced stats
	request('https://cloud.iexapis.com/stable/stock/' + ticker + '/stats?token=pk_2711a2706e924888a2a063e6e4cf4307', {json: true}, (err, res,body)=> {
	if(err){ return console.log(err);}
	if(res.statusCode ===200){
	     
    const myLogger = new Console({
    stdout: fs.createWriteStream("views/stats.json"),
    stderr: fs.createWriteStream("errStdErr.txt"),
    });
	    myLogger.log(JSON.stringify(body))
	    
		}
	});
	
	if (tickervar===0){
    ticker='TSLA'
    tickervar=1
    }
    
	//company info
	request('https://cloud.iexapis.com/stable/stock/' + ticker + '/company?token=pk_2711a2706e924888a2a063e6e4cf4307', {json: true}, (err, res,body)=> {
	if(err){ return console.log(err);}
	if(res.statusCode ===200){
	     
    const myLogger = new Console({
    stdout: fs.createWriteStream("views/info.json"),
    stderr: fs.createWriteStream("errStdErr.txt"),
    });
	myLogger.log(JSON.stringify(body))
	    
		}
	});
	
	if (tickervar===0){
    ticker='TSLA'
    tickervar=1
    }
    
	//company news
	request('https://cloud.iexapis.com/stable/stock/' + ticker + '/news/last/4?token=pk_2711a2706e924888a2a063e6e4cf4307', {json: true}, (err, res,body)=> {
	if(err){ return console.log(err);}
	if(res.statusCode ===200){
	     
        const myLogger = new Console({
        stdout: fs.createWriteStream("views/news.json"),
        stdout: fs.createWriteStream("news.json"),
        stderr: fs.createWriteStream("errStdErr.txt"),
        });
	    myLogger.log(body)
	    finishedAPI(body);
	    
		}
	});
	
  
    

	
};




app.use(express.urlencoded({
  extended: true
}))


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');



app.post('/example', (req, res) => {
  const phonenumber = req.body.phonenumber
  const nm = req.body.nm
  const fs = require('fs');

  let rawdata = fs.readFileSync('overview.json');
  let overview = JSON.parse(rawdata);
  let overview2= JSON.stringify(overview, null, 2);
 


//info
  let rawdata2 = fs.readFileSync('info.json');
  let info = JSON.parse(rawdata2);
  let info2= JSON.stringify(info, null, 2);


  
  let rawdata3 = fs.readFileSync('stats.json');
  let stats= JSON.parse(rawdata3);
  let stats2= JSON.stringify(stats, null, 2);
  
  console.log(req.body)
  
  
  


		
  client.messages
    .create({
     body: 'https://echo.investments/',
     from: '+13392184849',
     to: phonenumber
   })
  .then(message => console.log(message.sid));
  
 
  

  

  client.messages
  .create({
     body: overview2,
     from: '+13392184849',
     to: phonenumber
   })
  .then(message => console.log(message.sid));
  
 
  client.messages
  .create({
     body: info2,
     from: '+13392184849',
     to: phonenumber
   })
  .then(message => console.log(message.sid));
  

  client.messages
  .create({
     body: stats2,
     from: '+13392184849',
     to: phonenumber
   })
  .then(message => console.log(message.sid));
  
  

    
    
 
  //...
  res.end()
})



//Set index handlebar index  GET routes
app.get('/', function(req, res){
		call_api(function(doneAPI){
          
            
            
			res.render('home', {
			stock: doneAPI
			
			
			
		
		});
		
		
	});

});



//Set index handlebar index  POST routes
app.post('/', function(req, res){
		call_api(function(doneAPI){
		    console.log(req.body)
			posted_stuff =req.body.stock_ticker;
			res.render('home', {
			stock: doneAPI
			
			
			
				
		
		});
	}, req.body.stock_ticker);

});



//set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () =>console.log('Server Listening on port' + PORT))
