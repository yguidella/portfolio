/* console.log("Sistema nervoso da Yasmin online! 👽"); */

const seguidoresGitHub = document.getElementById('github-seguidores');
const reposGitHub = document.getElementById('github-repos');
const swiperWrapper = document.querySelector('.swiper-wrapper');
const formulario = document.querySelector('#formulario');
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const iconesProjetos = {
    "blogpessoal": "./assets/icons/projetos/blog_pessoal_icone.png",
    "rangoo_nest": "./assets/icons/projetos/rangoo_icone.png",
    "projeto_ecommerce_artindie": "./assets/icons/projetos/artindie_icone.png",
    "rotainclusiva_nest": "./assets/icons/projetos/rota_inclusiva_icone.png",
    "portfolio": "./assets/icons/projetos/portfolio_icone.png"
};

async function getAboutGithub(){
    try {
        const resposta = await fetch('https://api.github.com/users/yguidella');

        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }

        const perfil = await resposta.json();

        if (seguidoresGitHub) {
            seguidoresGitHub.textContent = perfil.followers;
        }

        if (reposGitHub) {
            reposGitHub.textContent = perfil.public_repos;
        }

        console.log('Números do GitHub atualizados com sucesso! 🛸');

    } catch (error) {
        console.error('Ops! Algo deu errado ao buscar os dados:', error);
    }
}

async function getProjectsGithub() {
    try {
        const resposta = await fetch
        ('https://api.github.com/users/yguidella/repos?sort=updated&per_page=9');

        if (!resposta.ok) {
            throw new Error(`Erro ao buscar repositórios: ${resposta.status}`);
        }

        const repositorios = await resposta.json();

        swiperWrapper.innerHTML = '';

        const projetosFiltrados = repositorios
        .filter(repo => repo.topics && repo.topics.includes('portfolio'))
        .slice(0,5);

        projetosFiltrados.forEach(projeto => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');

            const urlIcone = iconesProjetos[projeto.name] || "./assets/icons/social/github_icone.png";

            const tagsHTML = projeto.topics
            .filter(topic => topic !== 'portfolio')
            .slice(0, 4)
            .map(topic => `<span class="tag">${topic}</span>`)
            .join('');

            const descricaoLimitada = projeto.description && projeto.description.length > 120 
            ? projeto.description.substring(0, 117) + "..." 
            : projeto.description || "Projeto desenvolvido com foco em solução criativa! 👽";

            slide.innerHTML = `
                <article class="project-card">
                    <figure class="project-image">
                        <img src="${urlIcone}" alt="Ícone do projeto" class="project-icon">
                    </figure>
                    <div class="project-content">
                        <h3>
                            ${
                                projeto.name === 'blogpessoal' ? 'BLOG PESSOAL' : 
                                projeto.name === 'rotainclusiva_nest' ? 'ROTA INCLUSIVA' :
                                projeto.name === 'projeto_ecommerce_artindie' ? 'ARTINDIE E-COMMERCE' :
                                projeto.name === 'rangoo_nest' ? 'RANGOO DELIVERY' :
                                projeto.name.replace(/-/g, ' ').replace(/_/g, ' ').toUpperCase()
                            }
                        </h3>
                        
                        <p>${descricaoLimitada}</p>
                        <div class="project-tags">
                            ${tagsHTML}
                        </div>
                        <div class="project-buttons">
                            <a href="${projeto.html_url}" target="_blank" rel="noopener noreferrer" 
                            class="botao-outline botao-sm">GitHub</a>
                            ${ projeto.homepage ? `<a href="${projeto.homepage}" target="_blank" 
                            rel="noopener noreferrer" 
                            class="botao-outline botao-sm">Deploy</a>` : '' }
                        </div>
                    </div>
                </article>
            
            `;
            swiperWrapper.appendChild(slide);
        });

        console.log("Projetos carregados com sucesso! 🚀");
        iniciarSwiper();

    } catch (error) {
        console.error('Ops! Algo deu errado ao buscar os projetos:', error);
    }
}

getAboutGithub();
getProjectsGithub();

function iniciarSwiper() {
    new Swiper('.mySwiper', {
        slidesPerView: 1,
        slidesPerGroup: 1,      
        spaceBetween: 30,     
        loop: true, 
        watchOverflow: true, 
        
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        
        grabCursor: true,

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: false,
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        /*breakpoints: {
            768: {
                slidesPerView: 1,
            },
            1100: {
                slidesPerView: 3,
            }
        }*/
    });
}

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    document.querySelectorAll('#formulario span')
    .forEach(span => span.textContent = '');

    let isValid = true;

    const nome = document.getElementById('nome');
    const erroNome = document.getElementById('erro-nome');
    if (nome.value.trim().length < 3) {
        erroNome.textContent = 'O nome deve ter no mínimo 3 caracteres).';
        if (isValid) nome.focus();
        isValid = false;
    }

    const email = document.getElementById('email');
    const erroEmail = document.getElementById('erro-email');
    if (!emailRegex.test(email.value)) {
        erroEmail.textContent = 'Por favor, insira um e-mail válido.';
        if (isValid) email.focus();
        isValid = false;
    }

    const assunto = document.getElementById('assunto');
    const erroAssuntoElement = document.getElementById('erro-assunto');
    if (assunto.value.trim().length < 5) {
        erroAssuntoElement.textContent = 'O assunto deve ter no mínimo 5 caracteres.';
        if (isValid) assunto.focus();
        isValid = false;
    }

    const mensagem = document.getElementById('mensagem');
    const erroMensagem = document.getElementById('erro-mensagem');
    if (mensagem.value.trim() === '') {
        erroMensagem.textContent = 'A mensagem não pode estar vazia.';
        if (isValid) mensagem.focus();
        isValid = false;
    }

    if (isValid) {
        const botao = formulario.querySelector('button');
        botao.disabled = true;
        botao.textContent = 'Enviando...';
        formulario.submit();
    }

});


