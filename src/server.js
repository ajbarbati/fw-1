const { check, validationResult } = require('express-validator')
const express = require('express')
const csp = require('express-csp-header')
const app = express()

const serverless = require('serverless-http')
require('dotenv').config({ path: `${__dirname}/.env` })
const path = require('path')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const port = 8080

const googAnal = require('universal-analytics')
const visitor =googAnal('159343542')

visitor.pageview('/', 'https://fortisureit.com', 'Fortisure IT').send()
visitor.pageview('/about', 'https://fortisureit.com/about', 'About').send()
visitor.pageview('/careers', 'https://fortisureit.com/careers', 'Career Development').send()
visitor.pageview('/services', 'https://fortisureit.com/services', 'Services').send()

app.listen(process.env.PORT || port, () =>
  console.log(`Express server listening on port ${process.env.PORT || port}!`)
)

app.use(express.static('public'))

app.use(

  csp({
    policies: {
      'default-src': [
        csp.SELF,
        csp.INLINE,
        'https://www.youtube.com/embed/m_YMxye5mEA',
        'https://www.google.com/recaptcha/api.js'
      ],
      'img-src': [
        csp.SELF,
        csp.INLINE,
        'https://fonts.googleapis.com/',
        'https://res.cloudinary.com/',
        "https://www.google-analytics.com/r/collect?v=1&_v=j81&a=17204956&t=pageview&_s=1&dl=https%3A%2F%2Ffortisureit.com%2F&ul=en-us&de=UTF-8&dt=Fortisure%20IT&sd=24-bit&sr=1920x1080&vp=548x948&je=0&_u=IEBAAUAB~&jid=593123134&gjid=1943381835&cid=231714683.1582917994&tid=UA-159343542-1&_gid=1505644601.1582917994&_r=1&gtm=2ou2j0&z=2056694264"
      ],
      'style-src': [csp.SELF, csp.INLINE, 'https://fonts.googleapis.com/'],
      'font-src': [csp.SELF, 'https://fonts.gstatic.com'],
      'script-src': [
        csp.SELF,
        csp.INLINE, 
        'https://www.google.com/recaptcha/',
        'https://www.gstatic.com/recaptcha/',
        'https://www.google.com/recaptcha/api.js',
        "https://www.googletagmanager.com/gtag/js?id=UA-159343542-1",
        "https://www.google-analytics.com/analytics.js" 
      ],
      'worker-src': [csp.NONE],
      'frame-src': [
        csp.SELF,
        csp.INLINE,
        'https://www.google.com/recaptcha/',
        'https://www.google.com/recaptcha/api.js'
      ],
      'media-src': [
        csp.SELF,
        csp.INLINE,
        'https://www.youtube.com/embed/m_YMxye5mEA'
      ],
      'block-all-mixed-content': true
    }
  })
)
// HTTP response header will be defined as:
// "Content-Security-Policy: default-src 'none'; img-src 'self';"

// Template Engine
const hbs = handlebars.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../views/layouts'),
  partialsDir: [
    //  path to your partials
    path.join(__dirname, '../views/partials')
  ]
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '../views'))

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Routes
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Fortisure IT',
    style: 'home.css'
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
app.get('/failed', (req, res) => {
  res.render('failed', {
    title: 'Please Try Again',
    style: 'success.css'
  })
})

const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
)

function handleError(err) {
  throw new Error(err)
}

// Training Form
app.post('/training', 
  [
    check('firstName', 'Field Invalid')
      .notEmpty()
      .trim()
      .isAlpha(),
    check('lastName', 'Field Invalid')
      .notEmpty()
      .trim()
      .isAlpha(),
    check('email','Email Invalid')
      .notEmpty()
      .trim()
      .isEmail()
      .normalizeEmail()
      .isAscii(),
    check('phone','Phone Number Invalid')
      .notEmpty()
      .trim()
      .isNumeric([{ no_symbols: true }]),
    check('school', 'Field Invalid')
      .notEmpty()
      .isAscii()
  ],
  (req, res) => {
    const emailData = {
      Messages: [
        {
          From: {
            Email: 'training@fortisureit.com',
            Name: `Fortisure`
          },
          To: [
            {
              Email: `${req.body.email}`,
              Name: `${req.body.firstName} ${req.body.lastName}`
            }
          ],
          Subject: 'Thank You from FortisureIT',
          HTMLPart: `<!DOCTYPE html>
        <html
          xmlns="http://www.w3.org/1999/xhtml"
          xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office"
        >
          <head>
            <title>Thank You from FortisureIT</title>
            <!--[if !mso]><!-- -->
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <!--<![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <style type="text/css">
              #outlook a {
                padding: 0;
              }
              body {
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
              }
              table,
              td {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
              }
              img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
              }
              p {
                display: block;
                margin: 13px 0;
              }
            </style>
            <!--[if mso]>
              <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG />
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
              </xml>
            <![endif]-->
            <!--[if lte mso 11]>
              <style type="text/css">
                .mj-outlook-group-fix {
                  width: 100% !important;
                }
              </style>
            <![endif]-->
            <!--[if !mso]><!-->
            <link
              href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700"
              rel="stylesheet"
              type="text/css"
            />
            <style type="text/css">
              @import url(
                https://fonts.googleapis.com/css?family=Open+Sans:300,
                400,
                500,
                700
              );
            </style>
            <!--<![endif]-->
            <style type="text/css">
              @media only screen and (min-width: 480px) {
                .mj-column-per-100 {
                  width: 100% !important;
                  max-width: 100%;
                }
              }
            </style>
            <style type="text/css">
              [owa] .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
              }
            </style>
            <style type="text/css">
              @media only screen and (max-width: 480px) {
                table.mj-full-width-mobile {
                  width: 100% !important;
                }
                td.mj-full-width-mobile {
                  width: auto !important;
                }
              }
            </style>
          </head>
          <body style="background-color:#F4F4F4;">
            <div style="background-color:#F4F4F4;">
              <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
              <div
                style="background:transparent;background-color:transparent;margin:0px auto;max-width:600px;"
              >
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background:transparent;background-color:transparent;width:100%;"
                >
                  <tbody>
                    <tr>
                      <td
                        style="border:0px solid #ffffff;direction:ltr;font-size:0px;padding:0px 0px 0px 0px;padding-bottom:0px;padding-left:0px;padding-right:0px;padding-top:0px;text-align:center;"
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="vertical-align:top;"
                            width="100%"
                          >
                            <tr>
                              <td
                                align="center"
                                style="font-size:0px;padding:10px 25px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="border-collapse:collapse;border-spacing:0px;"
                                >
                                  <tbody>
                                    <tr>
                                      <td style="width:600px;">
                                        <img
                                          alt="office"
                                          height="auto"
                                          src="https://xulj8.mjt.lu/tplimg/xulj8/b/xvxgm/1uj8.png"
                                          style="border:none;border-radius:px;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                          width="600"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td
                                align="center"
                                vertical-align="middle"
                                style="background:#ffffff;font-size:0px;padding:40px 25px 40px 25px;padding-top:40px;padding-right:25px;padding-bottom:40px;padding-left:25px;word-break:break-word;"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="border-collapse:separate;line-height:100%;"
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      bgcolor="#17b9a3"
                                      role="presentation"
                                      style="border:0px solid #ffffff;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px 10px 25px;background:#17b9a3;"
                                      valign="middle"
                                    >
                                      <a href="https://FortisureIT.com">
                                      <p
                                        style="display:inline-block;background:#17b9a3;color:#ffffff;font-family:Open Sans, Helvetica, Arial, sans-serif;font-size:21px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px 10px 25px;mso-padding-alt:0px;border-radius:3px;"
                                      >
                                        <b style="font-weight:700;"
                                          ><span
                                            style="color: rgb(255, 255, 255); background-color: rgb(23, 185, 163); font-weight: 700;"
                                            >Visit our Web Site!</span
                                          ></b
                                        >
                                      </p></a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
              <div
                style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"
              >
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background:#ffffff;background-color:#ffffff;width:100%;"
                >
                  <tbody>
                    <tr>
                      <td
                        style="border:0px solid #ffffff;direction:ltr;font-size:0px;padding:40px 0px 40px 0px;padding-bottom:40px;padding-left:0px;padding-right:0px;padding-top:40px;text-align:center;"
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="vertical-align:top;"
                            width="100%"
                          >
                            <tr>
                              <td
                                align="left"
                                style="font-size:0px;padding:0px 25px 0px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"
                              >
                                <div
                                  style="font-family:Arial, sans-serif;font-size:13px;letter-spacing:normal;line-height:22px;text-align:left;color:#55575d;"
                                >
                                  <h1 style="font-size: 20px; font-weight: bold;">
                                    <span style="color:#9f1224;"
                                      ><i style="font-style:italic;"
                                        >Thank you for contacting us!</i
                                      ></span
                                    >
                                  </h1>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                align="left"
                                style="font-size:0px;padding:0px 25px 0px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"
                              >
                                <div
                                  style="font-family:Arial, sans-serif;font-size:13px;letter-spacing:normal;line-height:22px;text-align:left;color:#55575d;"
                                >
                                  <p style="font-size: 13px; margin: 10px 0;">
                                    <span
                                      style="font-family:Open Sans,Helvetica,Arial,sans-serif;"
                                      >We will be in touch with you, in the meantime if
                                      you have any questions please visit our web
                                      site!</span
                                    >
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
              <div
                style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"
              >
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background:#ffffff;background-color:#ffffff;width:100%;"
                >
                  <tbody>
                    <tr>
                      <td
                        style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;"
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="vertical-align:top;"
                            width="100%"
                          >
                            <tr>
                              <td
                                align="center"
                                style="font-size:0px;padding:0px 20px 0px 20px;padding-top:0px;padding-right:20px;padding-bottom:0px;padding-left:20px;word-break:break-word;"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="border-collapse:collapse;border-spacing:0px;"
                                >
                                  <tbody>
                                    <tr>
                                      <td style="width:560px;">
                                        <img
                                          alt="logo"
                                          height="auto"
                                          src="https://xulj8.mjt.lu/tplimg/xulj8/b/xvxgm/1ukm.png"
                                          style="border:none;border-radius:px;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                          width="560"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
              <div
                style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"
              >
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background:#ffffff;background-color:#ffffff;width:100%;"
                >
                  <tbody>
                    <tr>
                      <td
                        style="border:0px solid #ffffff;direction:ltr;font-size:0px;padding:20px 0px 20px 0px;padding-left:0px;padding-right:0px;text-align:center;"
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            width="100%"
                          >
                            <tbody>
                              <tr>
                                <td style="vertical-align:top;padding:0;">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"
                                      >
                                        <div
                                          style="font-family:Arial, sans-serif;font-size:11px;letter-spacing:normal;line-height:22px;text-align:center;color:#000000;"
                                        >
                                          <p style="font-size: 13px; margin: 10px 0;">
                                            <span
                                              style="font-family:Open Sans,Helvetica,Arial,sans-serif;"
                                              >This e-mail has been sent to
                                              [[EMAIL_TO]],
                                              <a
                                                target="_blank"
                                                style="color:inherit; text-decoration:none"
                                                href="[[UNSUB_LINK_EN]]"
                                                >click here to unsubscribe</a
                                              >.</span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"
                                      >
                                        <div
                                          style="font-family:Arial, sans-serif;font-size:11px;letter-spacing:normal;line-height:22px;text-align:center;color:#000000;"
                                        >
                                          <p style="font-size: 13px; margin: 10px 0;">
                                            <span
                                              style="font-family:Open Sans,Helvetica,Arial,sans-serif;"
                                              >US Copyright 2020 FortisureIT | All
                                              Rights Reserved</span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </div>
          </body>
        </html>`
        }
      ]
    }
    const emailData2 = {
      Messages: [
        {
          From: {
            Email: 'training@fortisureit.com',
            Name: `Training`
          },
          To: [
            {
              Email: 'training@fortisureit.com'
            }
          ],
          Cc: [
            {
              Email: 'brandon.taylor@fortisureit.com',
              Name: 'Brandon Taylor'
            }
          ],
          Bcc: [
            {
              Email: 'scott.arnold@fortisureit.com',
              Name: 'Scott Arnold'
            }
          ],
          Subject: 'New Contact Info Form',
          TextPart: 'Contact',
          HTMLPart: `
        <h3>New Contact Form!</h3></br>
        First Name: ${req.body.firstName}</br>
        Last Name: ${req.body.lastName}</br>
        Email: ${req.body.email}</br>
        Phone: ${req.body.phone}</br>
        School: ${req.body.school}`
        }
      ]
    }

    const errors = validationResult(req)
    console.log(req.body)

    //handle error
    if (!errors.isEmpty()) {
      res.redirect('/failed')
      // res.status(422).jsonp(errors.array())
    } else {
      // post contact to mailjet
      mailjet
        .post('/contact')
        .request({
          Email: `${req.body.email}`
        }).catch(handleError)

      // start request to mailjet
      const mailjetPOST = mailjet.post('send', { version: 'v3.1' })

      // send out email
      mailjetPOST
        .request(emailData)
        .then(result => {
          console.log(result.body)
          // redirect to success page
          res.redirect('/success')
        }).catch(handleError)
      mailjetPOST
        .request(emailData2)
        .then(result => {
          console.log(result.body)
          // redirect to success page
          res.redirect('/success')
        }).catch(handleError)
    }
})

//Service Form
app.post('/service', 
[
    check('firstName', 'Field Invalid')
      .notEmpty()
      .trim()
      .isAlpha(),
    check('organization', 'Field Invalid')
      .notEmpty()
      .trim()
      .isAscii(),
    check('email','Email Invalid')
      .notEmpty()
      .trim()
      .isEmail()
      .normalizeEmail()
      .isAscii(),
    check('phone','Phone Number Invalid')
      .notEmpty()
      .trim()
      .isNumeric([{ no_symbols: true }]),
    check('message')
      .notEmpty()
      .isAscii()
  ],
  (req, res) => {
    const emailData = {
      Messages: [
        {
          From: {
            Email: 'info@fortisureit.com',
            Name: `Info / Service`
          },
          To: [
            {
              Email: `${req.body.email}`,
              Name: `${req.body.firstName} ${req.body.lastName}`
            }
          ],
          Subject: 'Thank You for Contacting Us!',
          TextPart: 'Contact',
          HTMLPart: `<!DOCTYPE html>
        <html
          xmlns="http://www.w3.org/1999/xhtml"
          xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office"
        >
          <head>
            <title>Thank You from FortisureIT</title>
            <!--[if !mso]><!-- -->
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <!--<![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <style type="text/css">
              #outlook a {
                padding: 0;
              }
              body {
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
              }
              table,
              td {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
              }
              img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
              }
              p {
                display: block;
                margin: 13px 0;
              }
            </style>
            <!--[if mso]>
              <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG />
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
              </xml>
            <![endif]-->
            <!--[if lte mso 11]>
              <style type="text/css">
                .mj-outlook-group-fix {
                  width: 100% !important;
                }
              </style>
            <![endif]-->
            <!--[if !mso]><!-->
            <link
              href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700"
              rel="stylesheet"
              type="text/css"
            />
            <style type="text/css">
              @import url(
                https://fonts.googleapis.com/css?family=Open+Sans:300,
                400,
                500,
                700
              );
            </style>
            <!--<![endif]-->
            <style type="text/css">
              @media only screen and (min-width: 480px) {
                .mj-column-per-100 {
                  width: 100% !important;
                  max-width: 100%;
                }
              }
            </style>
            <style type="text/css">
              [owa] .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
              }
            </style>
            <style type="text/css">
              @media only screen and (max-width: 480px) {
                table.mj-full-width-mobile {
                  width: 100% !important;
                }
                td.mj-full-width-mobile {
                  width: auto !important;
                }
              }
            </style>
          </head>
          <body style="background-color:#F4F4F4;">
            <div style="background-color:#F4F4F4;">
              <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
              <div
                style="background:transparent;background-color:transparent;margin:0px auto;max-width:600px;"
              >
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background:transparent;background-color:transparent;width:100%;"
                >
                  <tbody>
                    <tr>
                      <td
                        style="border:0px solid #ffffff;direction:ltr;font-size:0px;padding:0px 0px 0px 0px;padding-bottom:0px;padding-left:0px;padding-right:0px;padding-top:0px;text-align:center;"
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="vertical-align:top;"
                            width="100%"
                          >
                            <tr>
                              <td
                                align="center"
                                style="font-size:0px;padding:10px 25px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="border-collapse:collapse;border-spacing:0px;"
                                >
                                  <tbody>
                                    <tr>
                                      <td style="width:600px;">
                                        <img
                                          alt="office"
                                          height="auto"
                                          src="https://xulj8.mjt.lu/tplimg/xulj8/b/xvxgm/1uj8.png"
                                          style="border:none;border-radius:px;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                          width="600"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td
                                align="center"
                                vertical-align="middle"
                                style="background:#ffffff;font-size:0px;padding:40px 25px 40px 25px;padding-top:40px;padding-right:25px;padding-bottom:40px;padding-left:25px;word-break:break-word;"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="border-collapse:separate;line-height:100%;"
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      bgcolor="#17b9a3"
                                      role="presentation"
                                      style="border:0px solid #ffffff;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px 10px 25px;background:#17b9a3;"
                                      valign="middle"
                                    >
                                      <a href="https://FortisureIT.com">
                                      <p
                                        style="display:inline-block;background:#17b9a3;color:#ffffff;font-family:Open Sans, Helvetica, Arial, sans-serif;font-size:21px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px 10px 25px;mso-padding-alt:0px;border-radius:3px;"
                                      >
                                        <b style="font-weight:700;"
                                          ><span
                                            style="color: rgb(255, 255, 255); background-color: rgb(23, 185, 163); font-weight: 700;"
                                            >Visit our Web Site!</span
                                          ></b
                                        >
                                      </p></a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
              <div
                style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"
              >
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background:#ffffff;background-color:#ffffff;width:100%;"
                >
                  <tbody>
                    <tr>
                      <td
                        style="border:0px solid #ffffff;direction:ltr;font-size:0px;padding:40px 0px 40px 0px;padding-bottom:40px;padding-left:0px;padding-right:0px;padding-top:40px;text-align:center;"
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="vertical-align:top;"
                            width="100%"
                          >
                            <tr>
                              <td
                                align="left"
                                style="font-size:0px;padding:0px 25px 0px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"
                              >
                                <div
                                  style="font-family:Arial, sans-serif;font-size:13px;letter-spacing:normal;line-height:22px;text-align:left;color:#55575d;"
                                >
                                  <h1 style="font-size: 20px; font-weight: bold;">
                                    <span style="color:#9f1224;"
                                      ><i style="font-style:italic;"
                                        >Thank you for contacting us!</i
                                      ></span
                                    >
                                  </h1>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                align="left"
                                style="font-size:0px;padding:0px 25px 0px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"
                              >
                                <div
                                  style="font-family:Arial, sans-serif;font-size:13px;letter-spacing:normal;line-height:22px;text-align:left;color:#55575d;"
                                >
                                  <p style="font-size: 13px; margin: 10px 0;">
                                    <span
                                      style="font-family:Open Sans,Helvetica,Arial,sans-serif;"
                                      >We will be in touch with you about your ${req.body.interest} request, in the meantime if
                                      you have any questions please visit our web
                                      site!</span
                                    >
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
              <div
                style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"
              >
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background:#ffffff;background-color:#ffffff;width:100%;"
                >
                  <tbody>
                    <tr>
                      <td
                        style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;"
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="vertical-align:top;"
                            width="100%"
                          >
                            <tr>
                              <td
                                align="center"
                                style="font-size:0px;padding:0px 20px 0px 20px;padding-top:0px;padding-right:20px;padding-bottom:0px;padding-left:20px;word-break:break-word;"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="border-collapse:collapse;border-spacing:0px;"
                                >
                                  <tbody>
                                    <tr>
                                      <td style="width:560px;">
                                        <img
                                          alt="logo"
                                          height="auto"
                                          src="https://xulj8.mjt.lu/tplimg/xulj8/b/xvxgm/1ukm.png"
                                          style="border:none;border-radius:px;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                          width="560"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
              <div
                style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"
              >
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background:#ffffff;background-color:#ffffff;width:100%;"
                >
                  <tbody>
                    <tr>
                      <td
                        style="border:0px solid #ffffff;direction:ltr;font-size:0px;padding:20px 0px 20px 0px;padding-left:0px;padding-right:0px;text-align:center;"
                      >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            width="100%"
                          >
                            <tbody>
                              <tr>
                                <td style="vertical-align:top;padding:0;">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"
                                      >
                                        <div
                                          style="font-family:Arial, sans-serif;font-size:11px;letter-spacing:normal;line-height:22px;text-align:center;color:#000000;"
                                        >
                                          <p style="font-size: 13px; margin: 10px 0;">
                                            <span
                                              style="font-family:Open Sans,Helvetica,Arial,sans-serif;"
                                              >This e-mail has been sent to
                                              [[EMAIL_TO]],
                                              <a
                                                target="_blank"
                                                style="color:inherit; text-decoration:none"
                                                href="[[UNSUB_LINK_EN]]"
                                                >click here to unsubscribe</a
                                              >.</span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;"
                                      >
                                        <div
                                          style="font-family:Arial, sans-serif;font-size:11px;letter-spacing:normal;line-height:22px;text-align:center;color:#000000;"
                                        >
                                          <p style="font-size: 13px; margin: 10px 0;">
                                            <span
                                              style="font-family:Open Sans,Helvetica,Arial,sans-serif;"
                                              >US Copyright 2020 FortisureIT | All
                                              Rights Reserved</span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </div>
          </body>
        </html>`
        }
      ]
    }
    const emailData2 = {
      Messages: [
        {
          From: {
            Email: 'info@fortisureit.com',
            Name: `Info / Service`
          },
          To: [
            {
              Email: 'info@fortisureit.com'
            }
          ],
          Cc: [
            {
              Email: 'rob.kozak@fortisureit.com',
              Name: 'Rob Kozak'
            }
          ],
          Bcc: [
            {
              Email: 'scott.arnold@fortisureit.com',
              Name: 'Scott Arnold'
            }
          ],
          Subject: 'New Contact Info Form',
          TextPart: 'Contact',
          HTMLPart: `
        <h3>New Contact Form!</h3></br>
        Name: ${req.body.firstName}</br>
        Organization: ${req.body.organization}</br>
        Email: ${req.body.email}</br>
        Phone: ${req.body.phone}</br>
        Area of Interest: ${req.body.interest}</br>
        Message: </br>
        ${req.body.message}`
        }
      ]
    }

    const errors = validationResult(req)
    console.log(req.body)

    //handle error
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      res.redirect('/failed')
    } else {
      // post contact to mailjet
      mailjet
        .post('/contact')
        .request({
          Email: `${req.body.email}`
        }).catch(handleError)

      // start request to mailjet
      const mailjetPOST = mailjet.post('send', { version: 'v3.1' })

      // send out email
      mailjetPOST
        .request(emailData)
        .then(result => {
          console.log(result.body)
          // redirect to success page
          res.redirect('/success')
        }).catch(handleError)
      mailjetPOST
        .request(emailData2)
        .then(result => {
          console.log(result.body)
          // redirect to success page
          res.redirect('/success')
        }).catch(handleError)
    }
})

module.exports.handler = serverless(app)