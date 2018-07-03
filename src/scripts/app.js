(function() {
	'use strict';

	// const urlLoja       = 'https://loja.compracerta.com.br';
	// let   paramSearch   = 'lava-loucas-brastemp-14-servicos-blf14ae-2003643/p';
	// let   paramLogin    = 'douglas@jussi.com.br';
	// let   paramSource   = 'whirlpool';
	// let   paramMedium   = 'email_blast';
	// let   paramCampaign = '20180627-preco-lavalouca';
	// let   paramCp       = 'whp_emkt';
	// let   paramPc       = 'email_blast';
	// let   paramEmail    = paramLogin;

	// Variables
	const $formUrl      = document.querySelector('.url-form');
	const $url          = document.querySelector('.url');
	const urlLoja       = 'https://loja.compracerta.com.br';
	let paramSearch;
	let paramLogin;
	let paramSource;
	let paramMedium;
	let paramCampaign;
	let paramCp;
	let paramPc;
	let paramEmail;
	let completeUrl;

	// Atualiza o valor das variáveis com o valor dos campos
	function updateVariables() {
		paramSearch   = $formUrl.produto.value;
		paramLogin    = $formUrl.login.value;
		paramSource   = $formUrl.utmSource.value;
		paramMedium   = $formUrl.utmMedium.value;
		paramCampaign = $formUrl.utmCampaign.value;
		paramCp       = $formUrl.utmiCp.value;
		paramPc       = $formUrl.utmiPc.value;
		paramEmail    = $formUrl.email.value;

		// Atualiza a URL final
		urlTemplate();
	}

	// Define o template com base na loja escolhida
	function urlTemplate() {
		let loja = $formUrl.loja.value;

		// var sel = document.querySelector('#loja');
		// var selected = sel.options[sel.selectedIndex];
		// var extra = selected.getAttribute('data-url');
		// console.log(extra);

		completeUrl = `${urlLoja}/${paramSearch}?utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&utmi_cp=${paramCp}&utmi_pc=${paramPc}`;

		if (loja === 'Compra Certa - Corp' || loja === 'Compra Certa - Colab') {
			completeUrl = `${urlLoja}/${paramSearch}?login=${paramLogin}&ReturnUrl=/${paramSearch}?utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&utmi_cp=${paramCp}&utmi_pc=${paramPc}&email=${paramEmail}`;
			return;
		}

		$url.textContent = completeUrl;
	}

	// Cmpos do formulário
	$formUrl.addEventListener('change', function(e) {
		updateVariables();
	});

	// Select do formulário
	$formUrl.loja.addEventListener('change', function() {
		let text = this.value
		text = text.toLocaleLowerCase();
		text = text.replace(/-/gm, '');
		text = text.replace(/\s+/gm, '-');

		$formUrl.setAttribute('class', `url-form ${text}`);
	});

	// Submit do formulário
	$formUrl.addEventListener('submit', function(e) {
		e.preventDefault();
	});

})();