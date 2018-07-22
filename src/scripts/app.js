(function() {
	'use strict';

	// Variables
	const $form  = document.querySelector('.url-form');
	const $body  = document.querySelector('body');
	const $url   = document.querySelector('.url-list');
	const $reset = document.querySelector('input[type="reset"]');
	const $store = document.querySelector('.text-loja');
	let urlLoja,
		paramLogin,
		paramSource,
		paramMedium,
		paramCampaign,
		paramCp,
		paramPc,
		paramEmail,
		paramContent,
		paramTerm;

	// Objeto que comporta todas as funções da aplicação
	let app = {};

	// Função que inicia a aplicação
	app.init = () => {
		console.log('App started and running...');

		// ######## Fake data ########
		$form.loja.value = 'Brastemp';
		$form.produto.value = '/geladeira/p, /fogao/p, 102030';
		$form.utmSource.value = '#SOURCE#';
		$form.utmMedium.value = '#MEDIUM#';
		$form.utmCampaign.value = '#CAMPAIGN#';
		// ######## Fake data ########


		// Reinicia a aplicação
		$reset.addEventListener('click', app.resetForm);

		// Assiste alterações na seleção da loja
		$form.loja.addEventListener('change', function() {
			let text = this.value;
			app.changeTitle(text);

			text = text.toLocaleLowerCase();
			text = text.replace(/-/gm, '');
			text = text.replace(/\s+/gm, '-');

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
		});
	};

	// Muda o título da página com base na loja selecionada
	app.changeTitle = (title) => {
		$store.textContent = title !== 'Selecione a loja' ? title : '';
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
		paramContent  = $form.utmContent.value;
		paramTerm     = $form.utmTerm.value;
	};

	// Pega os produtos cadastrados e passa para o gerador de URL
	app.getProducts = () => {
		let products = $form.produto.value;
		let store    = $form.loja.value;
		let isColection;

		products = products.replace(/\s+/gmi, '').split(',');

		products.map(product => {
			isColection = !!!product.match(/\/\S+\/p/gmi);

			app.generateUrl(store, product, isColection);
		});
	};

	// Define o template com base na loja escolhida
	app.generateUrl = (store, product, isColection) => {
		app.updateVariables();

		let urlType = isColection ? '/busca/?fq=H:' : '';
		let paramColecao = isColection ? '&' : '?';
		let paramProduct = urlType + product;
		let completeUrl;

		if (store.includes('Corp')) {
			completeUrl = `${urlLoja}${paramProduct}${paramColecao}utmi_pc=${paramPc}&utmi_cp=${paramCp}&login=${paramLogin}&ReturnUrl=${paramProduct}${paramColecao}utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&email=${paramEmail}&utm_content=${paramContent}&utm_term=${paramTerm}&`;
		}
		else if (store.includes('Colab')) {
			completeUrl = `${urlLoja}/sistema/401?&email=${paramEmail}&ReturnUrl=${paramProduct}${paramColecao}utmi_pc=${paramPc}&utmi_cp=${paramCp}&utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&utm_content=${paramContent}&utm_term=${paramTerm}&`;
		}
		else {
			completeUrl = `${urlLoja}${paramProduct}${paramColecao}utm_source=${paramSource}&utm_medium=${paramMedium}&utm_campaign=${paramCampaign}&utmi_pc=${paramPc}&utmi_cp=${paramCp}&utm_content=${paramContent}&utm_term=${paramTerm}&`;
		}

		// Função que limpa os itens não preenchidos da URL
		completeUrl = app.clearUrl(completeUrl);

		// Função que exibe a URL na tela
		app.printUrls(completeUrl);
	};

	// Remove itens que não foram preenchidos da URL final
	app.clearUrl = (url) => {
		let urlCleared = url;
		urlCleared = urlCleared.trim();
		urlCleared = urlCleared.toLocaleLowerCase();
		urlCleared = urlCleared.replace(/\w+=&/gmi, '');
		urlCleared = urlCleared.replace(/&$/gmi, '');

		return urlCleared;
	}

	// Exibe as URLs na tela
	app.printUrls = (url) => {
		let li = document.createElement('li');
		li.textContent = url;
		$url.appendChild(li);
	};

	// Limpa todos os campos e volta a aplicação ao estado inicial
	app.resetForm = () => {
		app.clearUrlContainer();
		$body.removeAttribute('class');
		app.changeTitle('');
	};

	// Clear the container with all URL's
	app.clearUrlContainer = () => $url.innerHTML = '';

	// Inicia a aplicação
	app.init();
})();