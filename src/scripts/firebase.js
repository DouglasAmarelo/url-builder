const firebaseInit = () => {
	console.log('Firebase iniciado');
};

const allFirebase = () => {
	// Initialize Firebase
	const config = {
		apiKey            : "AIzaSyA8apgtQAzh_fiLBfKMWVqeLg6BSFENkWY",
		authDomain        : "jussi-url-builder.firebaseapp.com",
		databaseURL       : "https://jussi-url-builder.firebaseio.com",
		projectId         : "jussi-url-builder",
		storageBucket     : "jussi-url-builder.appspot.com",
		messagingSenderId : "21018623862"
	};
	firebase.initializeApp(config);

	const DB = firebase.database().ref('/campanhas');

	const formatoDeDados = {
		"0" : {
			"nome": "Nome da campanha",
			"data": "23-08-2018",
			"loja": "Compra Certa",
			"links": "/eletrodomesticos/geladeira---refrigerador, /geladeira-brastemp-inverse-maxi-573-litros-bre80ak/p, /combos, 707",
			"parametros": {
				"utm_source": "whirlpool",
				"utm_medium": "email_blast",
				"utm_campaign": "%%emailname_%%",
				"loginEmail": "%%=Base64Encode(emailaddr)=%%",
				"utmi_pc": "email_blast",
				"utmi_cp": "whp_emkt",
				"utm_content": null,
				"utm_term": null
			}
		}
	};

	// Get data
	DB.on('value', function(data) {
		console.log(data);
		console.log(data.val());
	});


	// Post data
	const novaCampanha = DB.push();
	novaCampanha.set(formatoDeDados)
	.then(() => {
		console.log( 'ACABOOOOOO' );
	});
};

export { firebaseInit, allFirebase };