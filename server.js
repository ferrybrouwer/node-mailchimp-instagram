import path from 'path'
import {InstagramModel, MailchimpModel} from './model'
import express from 'express'
import expressValidator from 'express-validator'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import config from './config'

// create express server
const app = express()

// set key
MailchimpModel.setKey(config.MAILCHIMP_API_KEY)

// set views
app.set('views', path.resolve(__dirname, 'views'))
app.set('view engine', 'pug')

// some middlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(expressValidator())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// root
app.get('/', (req, res) => {
    res.render('index')
})

// mailchimp
app.get('/mailchimp', (req, res) => {
    res.render('mailchimp')
})

// instagram
app.get('/instagram/:hashtag?', async(req, res, next) => {
    try {
        const nodes = await InstagramModel.getNodes(req.params.hashtag)
        res.render('instagram', {nodes})
    } catch (err) {
        next(err)
    }
})

// subscribe to mailchimp
app.post('/mailchimp', async(req, res, next) => {
    // send output
    const send = (data, status = 200) => {
        const method = req.xhr ? 'json' : 'render'
        const args   = req.xhr ? [data] : ['mailchimp', data]
        res.status(status)[method](...args)
    }

    // validate req.body
    req.sanitize('name').trim()
    req.sanitize('email').trim()
    req.checkBody('name', 'Name can not be empty').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail()
    const result = await req.getValidationResult()

    // default response object
    const {name  = '', email = ''} = req.body
    let response = {
        success: true,
        message: null,
        errors:  [],
        body:    {name, email}
    }

    try {
        if (!result.isEmpty()) {
            response.params = result.array().map((obj) => obj.param)
            throw new Error(`Invalid params`, 402)
        }

        await MailchimpModel.subscribeList(config.MAILCHIMP_LIST_ID, name, email)
        response.body.name = response.body.email = ''
    } catch (err) {
        response.message = err.title || err.message
        response.success = false
    }

    send(response, response.success === false ? 402 : 200)
})

// 404 requests
app.use((err, req, res, next) => {
    res.status(err.status || 404)
    res.render('error', {message: err.message})
})

app.listen(3000, () => console.log('> Server started on http://localhost:3000...'))

