import mongoose from 'mongoose'

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => console.log(`Mongo connected!`))

export const db = mongoose.connection