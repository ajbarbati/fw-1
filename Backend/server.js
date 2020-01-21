const express = require('express')
const app = express()
const serverless = require('serverless-http')
require('dotenv').config()
const path = require('path')
const nodemailer = require('nodemailer')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const port = 8080

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

app.use(express.static('public'))

// Tempesting Engine
const hbs = handlebars.create({
  defaultLayout: 'main',
  //custom helper
  helpers: {
    calc: function(value) {
      return value + 7
    },
    list: function(value, options) {
      return "<h2>" + options.fn({ test: value, page:'hey yo' })+ "</h2>"
    }
  }
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// app.set('views', path.join(__dirname, '../views'))
app.set('views', path.join(__dirname, '/.netlify/functions/views'))
app.use(express.static('../public/'))

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// viewed at http://localhost:8080
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Fortisure IT',
    style: 'home.css',
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    style: 'about.css'
  })
})

app.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    listEnable: false
  })
})

// Training Form
app.post('/training', (req, res) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken:
        'ya29.Il-5B_AybGCJ5Qq5timu4G1epCzJZ81PuUixLqzm8p4KunRR5fdcjxDxcXQgVZ9I4RkXXpQC1pyA0X4dp2607c1XKshfAWJW1ufMXzvl_pGhwtx8j7mJgB51Hei1QIXgng',
      expires: 3536
    }
  })

  let mailOptions = {
    from: `${req.body.firstName} at: ${req.body.email}`,
    to: 'te27154@gmail.com',
    subject: `Info From: ${req.body.firstName} ${req.body.lastName}`,
    html: `
    <h3>New Contact Info</h3>
    <ul>
      <li><b>Name:</b> ${req.body.firstName} ${req.body.lastName}</li>
      <li><b>Email:</b> ${req.body.email}</li>
      <li><b>Phone:</b> ${req.body.phone}</li>
      <li><b>High School:</b> ${req.body.school}</li>
    </ul>`
    
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
})

//Service Form
app.post('/service', (req, res) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  })

  let mailOptions = {
    from: `${req.body.firstName}`,
    to: 'te27154@gmail.com',
    subject: `Service Request: ${req.body.interest}`,
    html: `
        <h3>New Contact Info</h3>
        <ul>
          <li><b>Name:</b> ${req.body.firstName}</li>
          <li><b>Email:</b> ${req.body.email}</li>
          <li><b>Phone:</b> ${req.body.phone}</li>
          <li><b>Area of Interest:</b> ${req.body.phone}</li>
        </ul>
        <h3>Message:</h3>
        <p>${req.body.message}</p>`
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
})


module.exports.handler = serverless(app);