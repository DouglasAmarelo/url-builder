(function() {
	'use strict';

	// Variables
	const $form   = document.querySelector('.url-form');
	const $body   = document.querySelector('body');
	const $url    = document.querySelector('.url-list');
	const $reset  = document.querySelector('input[type="reset"]');
	const $inputs = $form.querySelectorAll('[class*="url-form__"]');
	const $store  = document.querySelector('.text-loja');
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

	let app = {};

	app.init = () => {
		console.log('App started and running...');
		document.querySelector('#produto').value = '/geladeira/p, /fogao/p, 102030';

		// Reset Form
		$reset.addEventListener('click', app.resetForm);

		// Remove os erros do formulário ao perceber mudanças nos campos
		$form.addEventListener('change', () => {
			app.formValidation('removeError');
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
				app.clearUrlContainer();
				app.getProducts();
			}
			else {
				app.resetForm();
			}

			app.formValidation('addError');
		});
	};

	// Atualiza o valor das variáveis com o valor dos campos
	app.updateVariables = () => {
		urlLoja       = $form.loja.options[$form.loja.selectedIndex].getAttribute('data-url');
		paramLogin    = $form.login.value;
		paramSource   = $form.utmSource.value;
		paramMedium   = $form.utmMedium.value;
		paramCampaign = $form.utmCampaign.value;
		paramCp       = $form.utmiCp.value;
		paramPc       = $form.utmiPc.value;
		paramEmail    = paramLogin;
	}

	// Faz a validação do formulário
	app.formValidation = (instruction) => {
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
	app.getProducts = () => {
		let products = $form.produto.value;
		let store    = $form.loja.value;
		let type;

		products = products.split(',');

		products.map(product => {
			product = product.replace(/\s+/, '');
			type = !!product.match(/\b\d+\b/gmi);

			app.generateUrl(store, product, app.getParams(), type);
		});
	}

	// Pera os parâmetros de todos os inputs preenchidos
	app.getParams = () => {
		let params = [];
		let $inputs = document.querySelectorAll('input[type="text"]');
		let $formInputs = [...$inputs];

		$formInputs.map((item) => {
			if (item.value !== undefined && item.value !== '' && item.param !== null) {
				params.push({
					'valor' : item.value,
					'param' : item.getAttribute('data-param')
				});
			}
		});

		return params;
	}

	// Define o template com base na loja escolhida
	app.generateUrl = (store, product, params, type) => {
		let paramClosedStore = '';
		let urlType = type === true ? '/busca/?fq=H:' : '';
		paramProduct = urlType + product;

		console.log('##########', params);

		app.updateVariables();

		if (store.includes('Compra Certa')) {
			paramClosedStore = `login=${paramLogin}&ReturnUrl=${paramProduct}?email=${paramEmail}&utmi_cp=${paramCp}&utmi_pc=${paramPc}&`;
		}

		completeUrl = `${urlLoja}${paramProduct}?${paramClosedStore}utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}`;

		app.printUrls(completeUrl);
	}

	// Exibe as URLs na tela
	app.printUrls = (url) => {
		let li = document.createElement('li');
		li.textContent = url;
		$url.appendChild(li);
	}

	// Reset
	app.resetForm = () => {
		app.formValidation('removeError');
		app.clearUrlContainer();
		$body.removeAttribute('class');
		$store.textContent = '';
	}

	// Clear the container with all URL's
	app.clearUrlContainer = () => $url.innerHTML = '';

	// Inicia a aplicação
	app.init();
})();