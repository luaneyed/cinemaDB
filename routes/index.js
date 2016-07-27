module.exports = function(app, Play, Movie)
{
  app.get('/movies', function(req,res){
    Movie.find({}, {"_id": false, "__v": false}, function(err, plays){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.json(plays);
    });
  });

  app.get('/plays', function(req,res){
    Play.find({}, {"_id": false, "__v": false}, function(err, plays){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.json(plays);
    });
  });

  app.get('/plays/title/:title', function(req,res){
    Play.find({title: req.params.title}, {"_id": false, "__v": false, "title": false}, function(err, plays){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.json(plays);
    });
  });

  app.get('/plays/day/:day', function(req,res){
    Play.find({day: req.params.day}, {"_id": false, "__v": false, "day": false}, function(err, plays){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.json(plays);
    });
  });

  app.get('/plays/theater/:theater', function(req,res){
    Play.find({theater: req.params.theater}, {"_id": false, "__v": false, "theater": false}, function(err, plays){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.json(plays);
    });
  });

  app.get('/plays/brand/:brand', function(req,res){
    Play.find({brand: req.params.brand}, {"_id": false, "__v": false, "brand": false}, function(err, plays){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.json(plays);
    });
  });

  app.get('/plays/title&day/:title/:day', function(req,res){
    Play.find({title: req.params.title, day: req.params.day}, {"_id": false, "__v": false, "title": false, "day": false}, function(err, plays){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.json(plays);
    });
  });
  
  app.get('/plays/brand&day/:brand/:day', function(req,res){
    Play.find({brand: req.params.brand, day: req.params.day}, {"_id": false, "__v": false, "brand": false, "day": false}, function(err, plays){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.json(plays);
    });
  });

   app.get('/plays/brand&title/:brand/:title', function(req,res){
    Play.find({brand: req.params.brand, title: req.params.title}, {"_id": false, "__v": false, "brand": false, "title": false}, function(err, plays){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.json(plays);
    });
  });

}
