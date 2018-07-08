(function() {
	'use strict';

	// Variables
	const $form  = document.querySelector('.url-form');
	const $body     = document.querySelector('body');
	const $url      = document.querySelector('.url');
	const $reset    = document.querySelector('input[type="reset"]');
	const $inputs    = $form.querySelectorAll('[class*="url-form__"]');
	const $store = document.querySelector('.text-loja');
	let urlLoja,
		paramProducts,
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
		urlLoja       = $form.loja.options[$form.loja.selectedIndex].getAttribute('data-url');
		paramProducts = $form.produto.value;
		paramLogin    = $form.login.value;
		paramSource   = $form.utmSource.value;
		paramMedium   = $form.utmMedium.value;
		paramCampaign = $form.utmCampaign.value;
		paramCp       = $form.utmiCp.value;
		paramPc       = $form.utmiPc.value;
		paramEmail    = paramLogin;
	}

	// Faz a validação do formulário
	function formValidation(instruction) {
		$inputs.forEach(( item ) => {
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

	// Define o template com base na loja escolhida
	function generateUrl() {
		let loja = $form.loja.value;

		completeUrl = `${urlLoja + paramProducts}?utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&utmi_cp=${paramCp}&utmi_pc=${paramPc}`;

		if (loja === 'Compra Certa (Corp)' || loja === 'Compra Certa (Colab)') {
			completeUrl = `${urlLoja + paramProducts}?login=${paramLogin}&ReturnUrl=/${paramProducts}?utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&utmi_cp=${paramCp}&utmi_pc=${paramPc}&email=${paramEmail}`;
		}

		$url.textContent = completeUrl;
	}


	// Verifica os campos que tem informação e registra
	// parâmetros e valores no objeto "data"
	// function getParam() {
	// 	let data = [];

	// 	document.querySelectorAll('input[type=text]').forEach(( item, index ) => {
	// 		if ( item.value !== '' && item.value !== undefined ) {
	// 			data.push(
	// 				{
	// 					"param": item.getAttribute('data-param'),
	// 					"val": item.value
	// 				}
	// 			);
	// 		}
	// 	});


	// 	data.map( item => {
	// 		if (item.param === 'login') {
	// 			item.param = `ReturnUrl=/${item.param}`;
	// 		}
	// 	});

	// 	data = data.map( item => `${item.param}=${item.val}` );

	// 	console.log(data);

	// 	return data;
	// }

	// Reset
	function resetForm() {
		formValidation('removeError');
		$body.removeAttribute('class');
		$url.textContent = '';
	}

	$reset.addEventListener('click', resetForm);


	// Assiste as mudanças nos campos do formulário
	$form.addEventListener('change', () => {
		updateVariables();
		formValidation('removeError');
	});


	// Select do formulário
	$form.loja.addEventListener('change', function() {
		let text = this.value;
		$store.textContent = text !== 'Selecione a loja' ? text : '';

		text = text.toLocaleLowerCase().replace(/-/gm, '').replace(/\s+/gm, '-');

		$body.setAttribute('class', `${text}`);
	});


	// Submit do formulário
	$form.addEventListener('submit', function(e) {
		e.preventDefault();

		// Atualiza a URL final
		if ($form.loja.value !== 'Selecione a loja') {
			generateUrl();
		}
		else {
			resetForm();
		}

		formValidation('addError');
	});





	document.querySelector('#produto').value = '/geladeira/p, /fogao/p, 102030';
	function getProducts() {
		let products = $form.produto.value;
		products = products.split(',');


		console.log( products );
		console.log( Object.prototype.toString.call(products) );
	}

	getProducts();


})();