const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  day: {
		type: Date,
	},
	exercises: [
		{
			type: Schema.Types.ObjectId,
			ref: "Exercise",
		},
	]
})

const Workout = mongoose.model("Workout", WorkoutSchema);

const ExerciseSchema = new Schema({
	type: String,
	name: String,
	duration: Number,
	distance: Number,
	weight: Number,
	reps: Number,
	sets: Number,
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = { Workout, Exercise }