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
		paramProduct,
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
		paramProduct  = $form.produto.value;
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

	// Pega as URLs os produtos e passa para o gerador de URL
	document.querySelector('#produto').value = '/geladeira/p, /fogao/p, 102030';
	function getProducts() {
		let products = $form.produto.value;
		let store = $form.loja.value;
		let type;

		products = products.split(',');


		console.log( products );
		console.log( Object.prototype.toString.call(products) );
	}

	getProducts();

	// Define o template com base na loja escolhida
	function generateUrl(store, product, type) {
		let paramClosedStore = '';
		let urlType = type === 'busca' ? '/busca/?fq=H:' : '';
		paramProduct = urlType + product;

		if (store.includes('Compra Certa')) {
			paramClosedStore = `login=${paramLogin}&ReturnUrl=${paramProduct}?email=${paramEmail}&utmi_cp=${paramCp}&utmi_pc=${paramPc}&`;
		}

		completeUrl = `${urlLoja}${paramProduct}?${paramClosedStore}utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}`;

		console.log( completeUrl );

		return completeUrl;
	}

	console.log('\n\n');
	generateUrl('Compra Certa', '/geladeira/p');
	generateUrl('Compra Certa', '102030', 'busca');
	console.log('\n\n');
	generateUrl('Brastemp', '/fogao/p');
	generateUrl('Brastemp', '102030', 'busca');

	// Exibe as URLs na tela
	function printUrls(url) {
		$url.textContent = url;
	}


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



})();