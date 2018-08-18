(function() {
	'use strict';

	// Variables
	const $form    = document.querySelector('.url-form');
	const $body    = document.querySelector('body');
	const $url     = document.querySelector('.url-list');
	const $reset   = document.querySelector('input[type="reset"]');
	const $store   = document.querySelector('.text-loja');
	const $copyAll = document.querySelector('.copy-all');
	const $urlList = document.querySelector('.url-list');
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
	const app = {};

	// Função que inicia a aplicação
	app.init = () => {

		// Inicia a aplicação com dados pré-configurados
		app.initialData();

		// Reinicia a aplicação
		$reset.addEventListener('click', app.resetForm);

		// Assiste alterações na seleção da loja
		$form.loja.addEventListener('change', function() {
			let text = this.value;
			$body.setAttribute('class', `${app.textToCssClass(text)}`);
			app.changeTitle(text);

			if ($form.produto.value !== '') {
				app.updateAll();
			}
		});

		// Submit do formulário
		$form.addEventListener('submit', (e) => {
			e.preventDefault();
			app.updateAll();
		});

		// Copia todas as URL's
		$copyAll.addEventListener('click', function() {
			let itensToCopy = [...document.querySelectorAll('.url-list .url-list__item .url')]
			itensToCopy = itensToCopy.map(item => item.textContent);
			itensToCopy = itensToCopy.join('\n\n');

			app.copyToClipboard(this, itensToCopy);
		});

		// Copia cada URL
		$urlList.addEventListener('click', function(e) {
			let self = e.target;

			if (e.target.classList[0] === 'copy-text' || e.target.classList[0] === 'url') {
				let itemToCopy = e.target.closest('.url-list__item');
				itemToCopy = itemToCopy.querySelector('.url').textContent;

				app.copyToClipboard(self, itemToCopy);
			}
		});
	};

	// Dados iniciais "padrões" para todas as campanhas
	app.initialData = () => {
		// $form.loja.value        = 'Brastemp';
		// $form.produto.value     = '/eletrodomesticos/geladeira---refrigerador, /geladeira-brastemp-inverse-maxi-573-litros-bre80ak/p, /combos, 707';
		$form.utmSource.value   = 'whirlpool';
		$form.utmMedium.value   = 'email_blast';
		$form.utmCampaign.value = '%%emailname_%%';
		$form.login.value       = '%%=Base64Encode(emailaddr)=%%';
		$form.utmiPc.value      = 'email_blast';
		$form.utmiCp.value      = 'whp_emkt';
		// $form.utmContent.value  = '#UTMCONTENT#';
		// $form.utmTerm.value     = '#UTMTERM#';
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

	// Copy to clipboard
	app.copyToClipboard = (cta, copyFrom) => {
		document.addEventListener('copy', (e) => {
			e.preventDefault();

			if (e.clipboardData) {
				e.clipboardData.setData("text/plain", copyFrom);
				// console.log('###', e.clipboardData.getData('text'));
			}
		});

		document.execCommand('copy');
		app.copyFeedback(cta);
	};

	// Feedback message when copy
	app.copyFeedback = (element) => {
		const item = element;
		item.classList.add('is--active');

		setTimeout(() => (item.classList.remove('is--active')), 800);
	};

	// Transform a text in a css class
	app.textToCssClass = (textToChange) => {
		let text = textToChange;
		text = text.toLocaleLowerCase();
		text = text.replace(/-/gm, '');
		text = text.replace(/\s+/gm, '-');

		return text;
	};

	// Muda o título da página com base na loja selecionada
	app.changeTitle = (title) => {
		$store.textContent = title !== 'Selecione a loja' ? title : '';
	};

	// Pega os produtos cadastrados e passa para o gerador de URL
	app.getProducts = () => {
		let products = $form.produto.value;
		let store    = $form.loja.value;
		let isColection;

		app.updateVariables();

		products = products.replace(/\s+/gmi, '').split(',');

		products.map(product => {
			isColection = !!!product.match(/\/\S+(?:\/p)?/gmi);

			app.generateUrl(store, product, isColection);
		});
	};

	// Define o template com base na loja escolhida
	app.generateUrl = (store, product, isColection) => {
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
		urlCleared = urlCleared.replace(/fq=h/gmi, 'fq=H');
		urlCleared = urlCleared.replace(/returnurl/gmi, 'ReturnUrl');

		return urlCleared;
	};

	// Template dos itens da lista
	app.listItem = (url) => {
		let template = `
			<span class="url">${url}</span>
			<span class="copied">Copiado</span>
			<button class="copy copy-one">
				<svg class="copy-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 488.3 488.3" style="enable-background:new 0 0 488.3 488.3;" xml:space="preserve">
					<g>
						<path d="M314.25,85.4h-227c-21.3,0-38.6,17.3-38.6,38.6v325.7c0,21.3,17.3,38.6,38.6,38.6h227c21.3,0,38.6-17.3,38.6-38.6V124 C352.75,102.7,335.45,85.4,314.25,85.4z M325.75,449.6c0,6.4-5.2,11.6-11.6,11.6h-227c-6.4,0-11.6-5.2-11.6-11.6V124 c0-6.4,5.2-11.6,11.6-11.6h227c6.4,0,11.6,5.2,11.6,11.6V449.6z"/>
						<path d="M401.05,0h-227c-21.3,0-38.6,17.3-38.6,38.6c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5c0-6.4,5.2-11.6,11.6-11.6h227 c6.4,0,11.6,5.2,11.6,11.6v325.7c0,6.4-5.2,11.6-11.6,11.6c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5c21.3,0,38.6-17.3,38.6-38.6 V38.6C439.65,17.3,422.35,0,401.05,0z"/>
					</g>
				</svg>
				<span class="copy-text">
					Copiar
					<span class="copied">Copiado</span>
				</span>
			</button>
		`;

		return template;
	};

	// Exibe as URLs na tela
	app.printUrls = (url) => {
		let template = app.listItem(url);
		let li = document.createElement('li');

		li.classList.add('url-list__item');
		li.innerHTML = template;

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

	// Atualiza o formulário e chama a função de gerar URL's
	app.updateAll = () => {
		if ($form.loja.value !== 'Selecione a loja') {
			app.clearUrlContainer();
			app.getProducts();
		}
		else {
			app.resetForm();
		}
	};

	// Inicia a aplicação
	app.init();
})();