import mongoose from 'mongoose'

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => console.log(`Mongo - [OK]`))

export const db = mongoose.connection