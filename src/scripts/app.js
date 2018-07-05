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
	const $formUrl = document.querySelector('.url-form');
	const $body    = document.querySelector('body');
	const $url     = document.querySelector('.url');
	const urlLoja  = 'https://loja.compracerta.com.br';
	const $reset   = document.querySelector('input[type="reset"]');
	let   inputs   = $formUrl.querySelectorAll('input[type="text"]');
	let paramSearch,
		paramLogin,
		paramSource,
		paramMedium,
		paramCampaign,
		paramCp,
		paramPc,
		paramEmail,
		completeUrl;

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
	}

	// Define o template com base na loja escolhida
	const urlTemplate = () => {
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

	// Faz a validação do formulário
	const formValidation = (instruction) => {
		inputs.forEach(( item, index ) => {
			if ( instruction === 'addError' ) {
				if (item.value === '' || item.value === undefined) {
					item.classList.add('error');
				}
			}

			if ( instruction === 'removeError' ) {
				item.classList.remove('error');
			}
		});
	}

	// Cmpos do formulário
	$formUrl.addEventListener('change', () => {
		updateVariables();
		formValidation('removeError');
	});

	// Reset
	$reset.addEventListener('click', () => {
		formValidation('removeError');
		$body.removeAttribute('class');
		$url.textContent = '';
	});

	// Select do formulário
	$formUrl.loja.addEventListener('change', function() {
		let text = this.value;
			text = text.toLocaleLowerCase()
						.replace(/-/gm, '')
						.replace(/\s+/gm, '-');

		$body.setAttribute('class', `${text}`);
	});

	// Submit do formulário
	$formUrl.addEventListener('submit', function(e) {
		e.preventDefault();
		formValidation('addError');

		// Atualiza a URL final
		urlTemplate();
	});
})();