import {config as configEnv} from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {graphqlHTTP} from "express-graphql";
import {buildSchema} from "graphql";


configEnv()

const app = express()

const port = process.env.NODE_ENV === 'development' ? 4000 : process.env.API_PORT

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// routes here

// error handling middleware here


// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`)

// The root provides a resolver function for each API endpoint
const root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within'
  },
  random: () => {
    return Math.random()
  },
  rollThreeDice: () => {
    return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6))
  },
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
)

// start the Express server
app.listen(port, () => {
  console.log(`API started at http://localhost:${port}`)
})

module.exports = app
