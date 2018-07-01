(function() {
	'use strict';

	const urlLoja       = 'https://loja.compracerta.com.br';
	let   paramSearch   = 'lava-loucas-brastemp-14-servicos-blf14ae-2003643/p';
	let   paramLogin    = 'douglas@jussi.com.br';
	let   paramSource   = 'whirlpool';
	let   paramMedium   = 'email_blast';
	let   paramCampaign = '20180627-preco-lavalouca';
	let   paramCp       = 'whp_emkt';
	let   paramPc       = 'email_blast';
	let   paramEmail    = paramLogin;

	let completeUrl = `${urlLoja}/${paramSearch}?login=${paramLogin}&ReturnUrl=/${paramSearch}?utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&utmi_cp=${paramCp}&utmi_pc=${paramPc}&email=${paramEmail}`;

	let $h = document.querySelector('h1');

	$h.innerText = completeUrl;

	console.log('URL', completeUrl);
})();