import mongoose from 'mongoose'

const connectionString = process.env.MONGO_URL

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

export const db = mongoose.connection