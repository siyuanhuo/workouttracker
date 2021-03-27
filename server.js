const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000

const db = require('./models')

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/workout', { useNewUrlParser: true, useUnifiedTopology: true })


app.get('/exercise', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/exercise.html'))
})

app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/stats.html'))
})

// route to call workout data from db
app.get('/api/workouts', (req, res) => {
  db.Workout.find({}, null, {sort: {day: 1}})
  .populate('exercises')
  .then((r) => { res.json(r) })
  .catch(error => { res.json(error) })
})

// route to update workout data
app.put('/api/workouts/:id', (req, res) => {
  const workoutID = req.params.id
  db.Exercise.create(req.body).then(
    ({_id}) => db.Workout.findOneAndUpdate({_id: workoutID}, {$push: {exercises: _id}}, {new: true})
  ).then(
    ((r) => {res.json(r)})
  ).catch(error => {res.json(error)})
})

// route to create new workout
app.post('/api/workouts', (req, res) => {
  console.log('routing: workouts')
  db.Workout.create(req.body)
  .then( (r) => {res.json(r)} )
  .catch(error => {res.json(error)})
})

// route to populate workout dashboard
app.get('/api/workouts/range', (req, res) => {
  db.Workout.find({}, null, {sort: {day: 1}})
  .populate('exercises')
  .then( (data) => {res.json(data)} )
  .catch( error => {res.json(error)} )
})

app.listen(PORT, function () {
  console.log(`Serving app on http://localhost:${PORT}`)
})