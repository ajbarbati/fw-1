const express = require('express')
const csp = require('express-csp-header')
const app = express()
const serverless = require('serverless-http')
require('dotenv').config({path: `${__dirname}/.env`})
const path = require('path')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const port = 8080

const mailjet = require ('node-mailjet')
.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

app.listen(process.env.PORT || port, () => console.log(`Express server listening on port ${process.env.PORT || port}!`))

app.use(express.static('public'))

app.use(csp({
    policies: {
        'default-src': [csp.SELF, csp.INLINE, 'https://www.youtube.com/embed/m_YMxye5mEA'],
        'img-src': [csp.SELF, csp.INLINE, 'https://fonts.googleapis.com/', `https://via.placeholder.com/`],
        'style-src': [csp.SELF, csp.INLINE, 'https://fonts.googleapis.com/'],
        'font-src': [csp.SELF, 'https://fonts.gstatic.com'],
        'script-src': [csp.SELF, csp.INLINE],
        'worker-src': [csp.NONE],
        'media-src': [csp.SELF, csp.INLINE, 'https://www.youtube.com/embed/m_YMxye5mEA'],
        'block-all-mixed-content': true
    }
}));
// HTTP response header will be defined as:
// "Content-Security-Policy: default-src 'none'; img-src 'self';"


// Template Engine
const hbs = handlebars.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../views/layouts'),
  partialsDir  : [
        //  path to your partials
        path.join(__dirname, '../views/partials'),
  ],
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
app.set('views', path.join(__dirname, '../views'))


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

app.get('/careers', (req, res) => {
  res.render('careers', {
    title: 'Career Development',
    style: 'careers.css'
  })
})

app.get('/services', (req, res) => {
  res.render('services', {
    title: 'Services',
    style: 'services.css'
  })
})
app.get('/success', (req, res) => {
  res.render('success', {
    title: 'Thank You',
    style: 'success.css'
  })
})


// Training Form
app.post('/training', (req, res) => {
const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "alex.barbati@fortisureit.com",
        "Name": `FortisureIT`
      },
      "To": [
        {
          "Email": "alex.barbati@fortisureit.com",
          "Name": `${req.body.firstName} ${req.body.lastName}`
        }
      ],
      "Subject": 'Thank You for Contacting Us!',
      "TextPart": "Contact",
      "HTMLPart": `<h3>${req.body.firstName} thank you for reaching out.
      </br>To learn more about our program please visit our<a href='https://www.fortisureit.com/'>website</a>!</h3>`,
      "CustomID": "AppGettingStartedTest"
    }
  ]
})
request
  .then((result) => {
    console.log(result.body)
    res.redirect('/success')
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
})



//Service Form
app.post('/service', (req, res) => {
  const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "alex.barbati@fortisureit.com",
        "Name": `FortisureIT`
      },
      "To": [
        {
          "Email": "alex.barbati@fortisureit.com",
          "Name": `${req.body.firstName} ${req.body.lastName}`
        }
      ],
      "Subject": 'Thank You for Contacting Us!',
      "TextPart": "Contact",
      "HTMLPart": `<h3>${req.body.firstName} thank you for reaching out.
      </br>We will be in touch with you about your ${req.body.interest}  request shortly.
      </br>If you have any additional questions please visit our <a href='https://www.fortisureit.com/'>website</a>!</h3>`,
      "CustomID": "AppGettingStartedTest"
    }
  ]
})
request
  .then((result) => {
    console.log(result.body)
    res.redirect('/success')
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
})


module.exports.handler = serverless(app);