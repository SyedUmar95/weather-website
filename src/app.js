const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');


const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname,'../public');
const viewsDirectoryPath = path.join(__dirname,'../templates/views');
const partialsDirectoryPath = path.join(__dirname,'../templates/partials');     

app.set('view engine','hbs')
app.set('views', viewsDirectoryPath);
hbs.registerPartials(partialsDirectoryPath);

app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index',{
        title : 'Weather App',
        name: 'Syed Umar'
    })
})

app.get('/help', (req,res) => {
    res.render('help',{
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Syed Umar'
    })
})

app.get('/about', (req,res) => {
    res.render('about',{
        title : 'About Me',
        name: 'Syed Umar'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData ) => {
            if(error){
                res.send( { error });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

    // res.send({
    //     'forecast':'It is Snowing',
    //     'location':'Bangalore',
    //     'address': res.query.address
    // });
})

app.get('/help/*', (req, res) => {
    // res.send(`404 error - help/ Page Not Found`)
    res.render('404', {
        errorMessage: '404 error - help/ Page Not Found',
        title: 'Error Chiccha',
        name : 'Syed Umar'
    })
})

app.get('*', (req, res) => {
    // res.send(`404 error - Page Not Found`)
    res.render('404',{
        errorMessage: '404 error - Page Not Found',
        title: 'Error Chiccha',
        name : 'Syed Umar'
    })
})

app.listen(port , () => {
    console.log(`Started the server on ${port}`);
})