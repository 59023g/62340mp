const secrets = require( './secrets.js' );

const twilio = require( 'twilio' )( secrets.twilioSid, secrets.twilioSecret );
const request = require( 'request-promise' );
const cheerio = require( 'cheerio' );

  // 1 hour = 3600000ms
const intervalCheck = 3600000;

let parseBody = ( res ) => {
  let timeNow = new Date().getTime()

  if ( res.statusCode !== 200 ) return Promise.reject( new Error( `req error: statusCode: ${ res.statusCode }` ) );
  let $ = cheerio.load( res.body );
  let results = [];

  $( 'li.result-row' ).each( function( i, elem ) {
    let postTime = new Date( $( this ).find( '.result-date' ).attr( 'datetime' ) )
    let url = $( this ).find( '.result-title' ).attr( 'href' );

    if ( isWithinTheHour( postTime, timeNow ) ) results.push( [ url ] )

  } );

  if ( results.length === 0 ) {
    return Promise.reject( 'no results' )
  }

  return Promise.resolve( results )
}


// this shortens the url because carrier's block messages which contain a craigslist URL
let getShortUrl = ( results ) => {
  return new Promise( ( resolve, reject ) => {

    if ( results.length === 0 ) return Promise.resolve( `No matches today` )

    let loopPromiseArr = [];

    for ( let i = 0; i < results.length; i++ ) {

      let rawUrl = results[ i ][ 0 ];
      let url = '';

      // if the rawUrl is from outside sf it returns with new city in hostname
      // this is for the 'results in your area postings, which we want here'
      if ( rawUrl.includes( '//' ) ) {
        url = `https:${ rawUrl }`
      } else {
        url = secrets.hostName + rawUrl
      }

      // loop through each result and convert longurl to short
      loopPromiseArr.push(
        new Promise( ( resolve, reject ) => {
          let options = {
            method: 'POST',
            uri: 'https://www.googleapis.com/urlshortener/v1/url?key=' + secrets.googl,
            body: {
              longUrl: url
            },
            json: true
          }

          request( options )
            .then( shortUrl => {
              results[ i ].pop();
              return resolve( results[ i ].concat( shortUrl.id ) );
            } )
            .catch( err => reject( err ) )
        } ) )
    }

    Promise.all( loopPromiseArr )
      .then( success => {
        resolve( success )
      } )
      .catch( err => {
        reject( 'loopPromiseArr Error' )
      } );

  } )
}

let sendSms = ( results ) => {
  return new Promise( ( resolve, reject ) => {
    let loopPromiseArr = [];

    for ( let i = 0; i < results.length; i++ ) {
      loopPromiseArr.push( twilio.messages.create( {
        body: results[ i ][ 0 ],
        to: secrets.to,
        from: secrets.from
      }, function( err, data ) {
        if ( err ) {
          console.error( 'Could not notify administrator' );
          console.error( err );
          return Promise.reject( `Error sending SMS: ${ err }` )
        } else {
          return Promise.resolve( `Success sending SMS` )
        }
      } ) )

    }

    Promise.all( loopPromiseArr )
      .then( success => {
        resolve( success )
      } )
      .catch( err => {
        reject( `loopPromiseArr Error ${ err }` )
      } );

  } )

}

let run = () => {
  request( {
      uri: secrets.hostName + secrets.reqPath,
      resolveWithFullResponse: true
    } )
    .then( parseBody )
    .then( getShortUrl )
    .then( sendSms )
    .then( result => console.log( 'result success' ) )
    .catch( err => console.log( err ) )
}

run();
// every hour
setInterval( run, intervalCheck )


// util

let isWithinTheHour = ( postTime, timeNow ) => {
  let diff = timeNow - postTime.getTime()
  if ( diff <= intervalCheck ) {
    return true
  }
  return false
}
