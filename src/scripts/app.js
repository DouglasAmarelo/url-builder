(function() {
	'use strict';

	// Variables
	const $formUrl  = document.querySelector('.url-form');
	const $body     = document.querySelector('body');
	const $url      = document.querySelector('.url');
	const $reset    = document.querySelector('input[type="reset"]');
	let   inputs    = $formUrl.querySelectorAll('[class*="url-form__"]');
	let   lojaTitle = document.querySelector('.text-loja');
	let urlLoja,
		paramSearch,
		paramLogin,
		paramSource,
		paramMedium,
		paramCampaign,
		paramCp,
		paramPc,
		paramEmail,
		completeUrl;

	// const urlLoja       = 'https://loja.compracerta.com.br';
	// let   paramSearch   = 'lava-loucas-brastemp-14-servicos-blf14ae-2003643/p';
	// let   paramLogin    = 'douglas@jussi.com.br';
	// let   paramSource   = 'whirlpool';
	// let   paramMedium   = 'email_blast';
	// let   paramCampaign = '20180627-preco-lavalouca';
	// let   paramCp       = 'whp_emkt';
	// let   paramPc       = 'email_blast';
	// let   paramEmail    = paramLogin;


	// Atualiza o valor das variáveis com o valor dos campos
	function updateVariables() {
		urlLoja       = $formUrl.loja.options[$formUrl.loja.selectedIndex].getAttribute('data-url');
		paramSearch   = $formUrl.produto.value;
		paramLogin    = $formUrl.login.value;
		paramSource   = $formUrl.utmSource.value;
		paramMedium   = $formUrl.utmMedium.value;
		paramCampaign = $formUrl.utmCampaign.value;
		paramCp       = $formUrl.utmiCp.value;
		paramPc       = $formUrl.utmiPc.value;
		paramEmail    = paramLogin;
	}

	// Define o template com base na loja escolhida
	function urlTemplate() {
		let loja = $formUrl.loja.value;

		completeUrl = `${urlLoja + paramSearch}?utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&utmi_cp=${paramCp}&utmi_pc=${paramPc}`;

		if (loja === 'Compra Certa (Corp)' || loja === 'Compra Certa (Colab)') {
			completeUrl = `${urlLoja + paramSearch}?login=${paramLogin}&ReturnUrl=/${paramSearch}?utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&utmi_cp=${paramCp}&utmi_pc=${paramPc}&email=${paramEmail}`;
		}


		$url.textContent = completeUrl;
	}

	// Faz a validação do formulário
	function formValidation(instruction) {
		inputs.forEach(( item ) => {
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

	function resetForm() {
		formValidation('removeError');
		$body.removeAttribute('class');
		$url.textContent = '';
	}

	// Campos do formulário
	$formUrl.addEventListener('change', () => {
		updateVariables();
		formValidation('removeError');
	});

	function getParam() {
		let data = [];

		inputs.forEach(( item, index ) => {
			if ( item.value !== '' || item.value !== undefined ) {
				data.push(
					{
						"param": item.getAttribute('data-param'),
						"val": item.value
					}
				);
			}
		});

		console.log( data );
	}

	// Reset
	$reset.addEventListener('click', resetForm);

	// Select do formulário
	$formUrl.loja.addEventListener('change', function() {
		let text = this.value;
		lojaTitle.textContent = text !== 'Selecione a loja' ? text : '';

		text = text.toLocaleLowerCase().replace(/-/gm, '').replace(/\s+/gm, '-');

		$body.setAttribute('class', `${text}`);
	});

	// Submit do formulário
	$formUrl.addEventListener('submit', function(e) {
		e.preventDefault();

		// Atualiza a URL final
		if ($formUrl.loja.value !== 'Selecione a loja') {
			urlTemplate();
		}
		else {
			resetForm();
		}

		formValidation('addError');

		getParam();
	});

})();