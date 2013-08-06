

	var   Class 		= require( "ee-class" )
		, log 			= require( "ee-log" );


	module.exports = new Class( {


		init: function( options ){
			this.nodes 		= options.nodes;
			this.cacheLimit = options.cacheLimit || 100000;
			this.listen 	= options.listen || { interface: "IF_ANY", port: 62828 };

		}



		
	} );