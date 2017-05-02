#ee-session

[![Greenkeeper badge](https://badges.greenkeeper.io/eventEmitter/em-session-manager.svg)](https://greenkeeper.io/)

middleware for ee-webservice. sessions module with caching. sessions persisted via a storagemanager, cached on a per process basis. if you enable local caching of sessions you need session affinity by the laod balancers. requests from the same client _must_ always be sent to the same process. store _never_ critical data in sessions, persist ciritcal data always in a db. do not store large amounts of data on a session: not > 1kb! please read the following stack overflow article: http://stackoverflow.com/questions/3841341/implications-of-distributed-sessions-on-development.

ATTENTION: you must make absolutely sure that session affinity is working! if it's not working you will get different states on all your nodes! ( so on one server the user may be signed in, on the other not ).


## installation
	
	npm install em-session-manager


## setup
		
	var   SessionManager 		= require( "em-session-manager" )
		, DynamoDBStorage 	 	= require( "em-session-storage-dynamodb" )
		, CookieSessionIdentity	= require( "em-session-identity-cookie" );


	var storage = new MysqlSessionStorage( config );


	// sessions will be detected via cookie ( directive for domain a.com )
	var domainACookie = new CookieSessionIdentity( {
		  cookie: 	"sid" 			// optional custom cookie name, defaults to "sid"
		, path: 	"/my/path" 		// the cookies path directive, defaults to /
		, secure: 	true
		, httpOnly: true
		, host: 	"a.com"
	} );

	// sessions will be detected via cookie
	var domainBCookie = new CookieSessionIdentity( {
		  cookie: 	"sid" 			// optional custom cookie name, defaults to "sid"
		, path: 	"/x" 			// the cookies path directive, defaults to /
	} );

	

	// create sessions manmager instance
	var sessions = new SessionManager( {
		  cacheMaxAge: 	3600
		, cacheLimit: 	100000 		// # of sessions cached locally, this requires n * sesisonSize ram. least used sessions will be removed from the cache, default 100k
	} );


	// add storagemanager
	sessions.setPersistenStorage( storage );

	// add sessions identities
	sessions.setIdentityManager( domainACookie );
	sessions.setIdentityManager( domainBCookie );


	// add to webservice
	webservice.use( sessions );



## usage

	// the sesison is provided via the requets object provided by ee-webservice
	var session = request.session;

	// retreive a value
	var value = session.get( key );

	// store a value, if provided, the callback will be executed if changes have been stored on the storage provider
	session.set( key, value, [ callback ] );

	// remove a value, if provided, the callback will be executed if changes have been stored on the storage provider
	var value = session.remove( key, [ callback ] );


	// change cookie value
	session.renew();

	// destroy session and all data on it ( persisted data too ) 
	// if provided, the callback will be executed if changes have been stored on the storage provider
	session.destroy( [ callback ] );




## middleware interfaces


	var StorageMiddleWare = new Class( {

		init: function( options ){
			// store options, do some setup stuff
		}


		// get the complete session
		get: function( sessionId, callback ){
			// callback: function( err, sessionData ){}
			// err must not be set if no value could be found ( this will return instead undefined as value )
		}


		// sessiondata must be a js object
		, set: function( sessionId, sessionData, callback ){
			// callback: function( err ){}
		}


		// key is a key on the root of the sessiondata object
		, update: function( sessionId, key, value, callback ){
			// callback: function( err ){}
		}


		// key is a key on the root of the sessiondata object
		, remove: function( sessionId, key, callback ){
			// callback: function( err ){}
		}


		// delete the session from the storage
		, delete: function( sessionId, callback ){
			// callback: function( err ){}
		}
	} );





	var SessionIdentityManager = new Class( {

		init: function( options ){
			// store options, initialize
		}


		// get identity from request
		, get: function( request, response, next ){

		} 


		// set new identity on the response
		, set: function( request, response, next ){

		}


		// delete  identity on response
		, remove: function( request, response, next ){

		}
	} );



