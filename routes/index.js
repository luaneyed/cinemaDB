module.exports = function(app, Play)
{
  app.get('/plays', function(req,res){
    Play.find({}, {"_id": false, "__v": false}, function(err, plays){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.json(plays);
    });
  });


  /*
  app.get('/', function(req,res){
    fs.readFile('./html/got.html', function(error,data){ //load index.html
    if(error){
      console.log(error);
    }else{
      res.writeHead(200, {'Content-Type': 'text/html'}); //set Head Type
      res.end(data); //load html response
    }
    });
  });
  */
  /*
	app.get('/api/movies', function(req,res){
		Movie.find(function(err, movies){
			if(err) return res.status(500).send({error: 'database failure'});
			res.json(movies);
		})
	});

	app.get('/api/movies/:movie_id', function(req,res){
		Movie.findOne({_id: req.params.movie_id}, function(err, movie){
			if(err) return res.status(500).json({error: err});
			if(!movie) return res.status(404).json({error: 'book not found'});
			res.json(book);
		})
	});

	app.get('/api/movies/title/:title', function(req,res){
		Movie.find({title: req.params.title}, {_id: 0, timetable: 1, review: 1, score: 1}, function(err, movies){
			if(err) return res.status(500).json({error: err});
			if(movies.length === 0) return res.status(404).json({error: 'movie not found'});
			res.json(movies);
		})
	});

	app.put('/api/moives/title/:title', function(req,res){
		Movie.update({title: req.params.title}, {$set: req.body}, function(err, output){
			if(err) res.status(500).json({error: 'database failure'});
			console.log(output);
			if(!output.n) return res.status(404).json({error: 'movie not found'});
			res.json({message: 'movie successfully updated'});
		});
	});

	app.delete('/api/movies/title/:title', function(req,res){
		Movie.remove({title: req.params.title}, function(err, output){
			if(err) return res.status(500).json({error: 'database failure'});
			res.status(204).end();
		});
	});*/
}
