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
		paramContent,
		paramTerm;

	let app = {};

	app.init = () => {
		console.log('App started and running...');
		document.querySelector('#produto').value = '/geladeira/p, /fogao/p, 102030';

		// Reset Form
		$reset.addEventListener('click', app.resetForm);

		// Remove os erros do formulário ao perceber mudanças nos campos
		$form.addEventListener('change', () => {
			// app.formValidation('removeError');
		});

		// Select do formulário
		$form.loja.addEventListener('change', function() {
			let text = this.value;
			app.changeTitle(text);

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

			// app.formValidation('addError');
		});
	}

	// Muda o título da página com base na loja selecionada
	app.changeTitle = (title) => {
		$store.textContent = title !== 'Selecione a loja' ? title : '';
	}

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
		paramContent  = $form.utmContent.value;
		paramTerm     = $form.utmTerm.value;
	}

	// Faz a validação do formulário
	app.formValidation = (instruction) => {
		$inputs.forEach((item) => {
			if (instruction === 'addError') {
				if (item.value === '' || item.value === undefined || item.value === null) {
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
		let isColection;

		products = products.replace(/\s+/gmi, '').split(',');

		products.map(product => {
			isColection = !!!product.match(/\/\S+\/p/gmi);

			app.generateUrl(store, product, isColection);
		});
	}

	// Define o template com base na loja escolhida
	app.generateUrl = (store, product, isColection) => {
		app.updateVariables();

		let urlType = isColection ? '/busca/?fq=H:' : '';
		let paramColecao = isColection ? '&' : '?';
		let completeUrl;

		paramProduct = urlType + product;

		if (store.includes('Corp')) {
			completeUrl = `${urlLoja}${paramProduct}${paramColecao}utmi_pc=${paramPc}&utmi_cp=${paramCp}&login=${paramLogin}&ReturnUrl=${paramProduct}${paramColecao}utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&email=${paramEmail}&utm_content=${paramContent}&utm_term=${paramTerm}&`;
		}
		else if (store.includes('Colab')) {
			completeUrl = `${urlLoja}/sistema/401?&email=${paramEmail}&ReturnUrl=${paramProduct}${paramColecao}utmi_pc=${paramPc}&utmi_cp=${paramCp}&utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&utm_content=${paramContent}&utm_term=${paramTerm}&`;
		}
		else {
			completeUrl = `${urlLoja}${paramProduct}${paramColecao}utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&utmi_pc=${paramPc}&utmi_cp=${paramCp}&utm_content=${paramContent}&utm_term=${paramTerm}&`;
		}

		completeUrl = completeUrl.toLocaleLowerCase();
		completeUrl = completeUrl.trim();
		completeUrl = completeUrl.replace(/\w+=&/gmi, '');
		completeUrl = completeUrl.replace(/&$/gmi, '');

		// console.log('completeUrl', completeUrl);

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
		// app.formValidation('removeError');
		app.clearUrlContainer();
		$body.removeAttribute('class');
		app.changeTitle('');
	}

	// Clear the container with all URL's
	app.clearUrlContainer = () => $url.innerHTML = '';

	// Inicia a aplicação
	app.init();
})();