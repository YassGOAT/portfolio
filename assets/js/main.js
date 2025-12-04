// =========================================================
// main.js – logique du portfolio
// =========================================================

// Config certifications
let CERTIFICATIONS_DATA = [];
let CURRENT_CERT_PAGE = 1;
const CERTS_PER_PAGE = 9;
const CERTS_VISIBLE_DEFAULT = 2;

// Config projets
let PROJECTS_DATA = [];
const PROJECTS_VISIBLE_DEFAULT = 2;


// =========================================================
// MODAL PROJET (plein écran)
// =========================================================

let projectModal,
    projectModalImg,
    projectModalTitle,
    projectModalPrev,
    projectModalNext,
    projectModalImages = [],
    projectModalIndex = 0;

function initProjectModal() {
    projectModal = document.createElement("div");
    projectModal.classList.add("project-modal");
    projectModal.id = "project-modal";

    const content = document.createElement("div");
    content.classList.add("project-modal-content");

    // wrapper image
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("project-modal-img-wrapper");
    projectModalImg = document.createElement("img");
    imgWrapper.appendChild(projectModalImg);

    // titre
    projectModalTitle = document.createElement("div");
    projectModalTitle.classList.add("project-modal-title");

    // boutons
    const closeBtn = document.createElement("button");
    closeBtn.classList.add("project-modal-close");
    closeBtn.textContent = "✕";
    closeBtn.addEventListener("click", closeProjectModal);

    projectModalPrev = document.createElement("button");
    projectModalPrev.classList.add("project-modal-prev");
    projectModalPrev.textContent = "‹";
    projectModalPrev.addEventListener("click", () => {
        changeProjectModalImage(-1);
    });

    projectModalNext = document.createElement("button");
    projectModalNext.classList.add("project-modal-next");
    projectModalNext.textContent = "›";
    projectModalNext.addEventListener("click", () => {
        changeProjectModalImage(1);
    });

    content.appendChild(imgWrapper);
    content.appendChild(projectModalTitle);
    content.appendChild(closeBtn);
    content.appendChild(projectModalPrev);
    content.appendChild(projectModalNext);

    projectModal.appendChild(content);

    // clic sur le fond = fermer
    projectModal.addEventListener("click", (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });

    document.body.appendChild(projectModal);
}

function openProjectModal(project, startIndex = 0) {
    projectModalImages = Array.isArray(project.images) ? project.images : [];
    if (projectModalImages.length === 0) return;

    projectModalIndex = startIndex;
    projectModalTitle.textContent = project.title || "";
    updateProjectModalImage();
    projectModal.classList.add("active");
}

function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove("active");
}

function changeProjectModalImage(direction) {
    if (projectModalImages.length === 0) return;
    projectModalIndex =
        (projectModalIndex + direction + projectModalImages.length) %
        projectModalImages.length;
    updateProjectModalImage();
}

function updateProjectModalImage() {
    if (!projectModalImg || projectModalImages.length === 0) return;
    projectModalImg.src = projectModalImages[projectModalIndex];
}

// =========================================================
// DOMContentLoaded
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    const DATA_URL = "assets/data/data.json";

    fetch(DATA_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            initPresentation(data.presentation);
            setupCertifications(data.certifications);
            initProjectModal();            // <-- initialisation du modal projet
            initProjects(data.projects);
            initContact(data.contact);
            initCV(data.cv);
            initFooterYear();
            initScrollButtons();
            initBurgerMenu();
            initLogoScrollTop();
        })
        .catch(error => {
            console.error("Impossible de charger data.json :", error);
        });
});


// =========================================================
// PRÉSENTATION
// =========================================================

function initPresentation(presentation) {
    if (!presentation) return;

    const titleEl = document.getElementById("presentation-title");
    const subtitleEl = document.getElementById("presentation-subtitle");
    const descEl = document.getElementById("presentation-description");
    const imgEl = document.querySelector(".presentation-photo img");
    const tagsContainer = document.getElementById("presentation-tags");

    if (titleEl && presentation.name) {
        titleEl.textContent = `Bonjour, je suis ${presentation.name}`;
    }

    if (subtitleEl && presentation.role) {
        subtitleEl.textContent = presentation.role;
    }

    if (descEl && presentation.description) {
        descEl.textContent = presentation.description;
    }

    if (imgEl && presentation.photo) {
        imgEl.src = presentation.photo;
        imgEl.alt = `Photo de profil de ${presentation.name || "moi"}`;
    }

    if (tagsContainer && Array.isArray(presentation.tags)) {
        tagsContainer.innerHTML = "";
        presentation.tags.forEach(tag => {
            const span = document.createElement("span");
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
    }
}


// =========================================================
// CV – injection des liens depuis le JSON
// =========================================================

function initCV(cvItems) {
    if (!Array.isArray(cvItems)) return;

    const links = document.querySelectorAll(".cv-link");

    links.forEach(link => {
        const id = link.dataset.cvId; // "devweb" ou "data"
        const cvItem = cvItems.find(item => item.id === id);
        if (!cvItem) return;

        // URL du PDF
        link.href = cvItem.file;

        // Mise à jour textes depuis JSON (optionnel mais propre)
        const titleEl = document.getElementById(`cv-${id}-title`);
        const descEl = document.getElementById(`cv-${id}-desc`);

        if (titleEl && cvItem.title) titleEl.textContent = cvItem.title;
        if (descEl && cvItem.description) descEl.textContent = cvItem.description;
    });
}


// =========================================================
// CERTIFICATIONS – même logique que PROJETS
// =========================================================

function setupCertifications(certifications) {
    if (!Array.isArray(certifications)) return;

    CERTIFICATIONS_DATA = certifications;
    renderCertifications();
    setupCertificationsToggle();
}

function renderCertifications() {
    const container = document.getElementById("certifications-list");
    if (!container) return;

    container.innerHTML = "";

    CERTIFICATIONS_DATA.forEach((cert, index) => {
        const card = document.createElement("article");
        card.classList.add("cert-card");

        // On cache celles au-delà du seuil
        if (index >= CERTS_VISIBLE_DEFAULT) {
            card.classList.add("cert-hidden");
        }

        // Logo
        if (cert.logo) {
            const logo = document.createElement("div");
            logo.classList.add("cert-logo");

            const img = document.createElement("img");
            img.src = cert.logo;
            img.alt = `Logo ${cert.issuer || ""}`.trim();
            img.loading = "lazy";

            logo.appendChild(img);
            card.appendChild(logo);
        }

        // Titre
        const title = document.createElement("h3");
        title.textContent = cert.title || "Certification";
        card.appendChild(title);

        // Issuer
        if (cert.issuer) {
            const issuer = document.createElement("p");
            issuer.classList.add("cert-issuer");
            issuer.textContent = cert.issuer;
            card.appendChild(issuer);
        }

        // Année
        if (cert.year) {
            const year = document.createElement("p");
            year.classList.add("cert-year");
            year.textContent = `Année : ${cert.year}`;
            card.appendChild(year);
        }

        // Lien certificat / cours
        if (cert.certificate_url) {
            const link = document.createElement("a");
            link.href = cert.certificate_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Voir le certificat";
            link.classList.add("btn-secondary");
            card.appendChild(link);
        }

        container.appendChild(card);
    });

    resetCertToggleButton();
}

function setupCertificationsToggle() {
    const toggleBtn = document.getElementById("cert-toggle-btn");
    const container = document.getElementById("certifications-list");
    if (!toggleBtn || !container) return;

    toggleBtn.addEventListener("click", () => {
        const isExpanded = toggleBtn.dataset.expanded === "true";
        const hiddenCards = container.querySelectorAll(".cert-card.cert-hidden");

        if (!isExpanded) {
            hiddenCards.forEach(card => {
                card.style.display = "block";
            });
            toggleBtn.textContent = "Masquer";
            toggleBtn.dataset.expanded = "true";
        } else {
            hiddenCards.forEach(card => {
                card.style.display = "none";
            });
            toggleBtn.textContent = "Voir plus";
            toggleBtn.dataset.expanded = "false";
        }
    });
}

function resetCertToggleButton() {
    const toggleBtn = document.getElementById("cert-toggle-btn");
    const container = document.getElementById("certifications-list");
    if (!toggleBtn || !container) return;

    const cards = container.querySelectorAll(".cert-card");
    const hiddenCards = container.querySelectorAll(".cert-card.cert-hidden");

    // Si 3 certifs ou moins → pas de bouton
    if (cards.length <= CERTS_VISIBLE_DEFAULT || hiddenCards.length === 0) {
        toggleBtn.style.display = "none";
        toggleBtn.dataset.expanded = "false";
        return;
    }

    // État initial : voir plus, cartes au-delà de 3 cachées
    toggleBtn.style.display = "inline-flex";
    toggleBtn.textContent = "Voir plus";
    toggleBtn.dataset.expanded = "false";

    hiddenCards.forEach(card => {
        card.style.display = "none";
    });
}

// =========================================================
// PROJETS
// =========================================================

function initProjects(projects) {
    const grid = document.getElementById("projects-grid");
    if (!grid || !Array.isArray(projects)) return;

    PROJECTS_DATA = projects;
    grid.innerHTML = "";

    PROJECTS_DATA.forEach((project, index) => {
        const card = document.createElement("article");
        card.classList.add("project-card");

        // On masque ceux après les 2 premiers
        if (index >= PROJECTS_VISIBLE_DEFAULT) {
            card.classList.add("project-hidden");
        }

        /* ==========================
           CARROUSEL D'IMAGES
        ========================== */
        if (Array.isArray(project.images) && project.images.length > 0) {
            const carousel = document.createElement("div");
            carousel.classList.add("project-carousel");

            const inner = document.createElement("div");
            inner.classList.add("project-carousel-inner");

            project.images.forEach((src, imgIndex) => {
                const img = document.createElement("img");
                img.src = src;
                img.alt = project.title || "Image du projet";
                img.loading = "lazy";

                img.addEventListener("click", (e) => {
                    e.stopPropagation();
                    openProjectModal(project, imgIndex);
                });

                inner.appendChild(img);
            });

            carousel.appendChild(inner);

            const btnPrev = document.createElement("button");
            btnPrev.classList.add("carousel-btn", "carousel-prev");
            btnPrev.innerHTML = "‹";

            const btnNext = document.createElement("button");
            btnNext.classList.add("carousel-btn", "carousel-next");
            btnNext.innerHTML = "›";

            carousel.appendChild(btnPrev);
            carousel.appendChild(btnNext);

            let position = 0;
            const maxIndex = project.images.length - 1;

            const updateCarousel = () => {
                inner.style.transform = `translateX(-${position * 100}%)`;
            };

            btnNext.addEventListener("click", () => {
                position = (position + 1 > maxIndex) ? 0 : position + 1;
                updateCarousel();
            });

            btnPrev.addEventListener("click", () => {
                position = (position - 1 < 0) ? maxIndex : position - 1;
                updateCarousel();
            });

            card.appendChild(carousel);
        }

        /* ==========================
           CONTENU TEXTE
        ========================== */
        const body = document.createElement("div");
        body.classList.add("project-card-body");

        const title = document.createElement("h3");
        title.classList.add("project-card-title");
        title.textContent = project.title || "Projet";

        const desc = document.createElement("p");
        desc.classList.add("project-card-desc");
        desc.textContent = project.description || "";

        const techList = document.createElement("p");
        techList.classList.add("project-card-techs");
        if (Array.isArray(project.techs) && project.techs.length > 0) {
            techList.textContent = project.techs.join(" • ");
        }

        const linksWrapper = document.createElement("div");
        linksWrapper.classList.add("project-card-links");

        if (project.github) {
            const githubLink = document.createElement("a");
            githubLink.href = project.github;
            githubLink.target = "_blank";
            githubLink.rel = "noopener noreferrer";
            githubLink.textContent = "Voir le dépôt GitHub";
            githubLink.classList.add("btn-secondary");
            linksWrapper.appendChild(githubLink);
        }

        if (project.demo) {
            const demoLink = document.createElement("a");
            demoLink.href = project.demo;
            demoLink.target = "_blank";
            demoLink.rel = "noopener noreferrer";
            demoLink.textContent = "Démo";
            demoLink.classList.add("btn-primary");
            linksWrapper.appendChild(demoLink);
        }

        body.appendChild(title);
        body.appendChild(desc);
        if (techList.textContent.trim() !== "") {
            body.appendChild(techList);
        }
        if (linksWrapper.childNodes.length > 0) {
            body.appendChild(linksWrapper);
        }

        card.appendChild(body);
        grid.appendChild(card);
    });

    setupProjectsToggle();
}

function setupProjectsToggle() {
    const toggleBtn = document.getElementById("projects-toggle-btn");
    const grid = document.getElementById("projects-grid");
    if (!toggleBtn || !grid) return;

    const cards = grid.querySelectorAll(".project-card");

    // S'il y a 2 projets ou moins, pas besoin de bouton
    if (cards.length <= PROJECTS_VISIBLE_DEFAULT) {
        toggleBtn.style.display = "none";
        return;
    }

    toggleBtn.style.display = "inline-flex";
    toggleBtn.textContent = "Voir plus";
    toggleBtn.dataset.expanded = "false";

    // On s'assure que ceux après les 2 premiers sont cachés au départ
    cards.forEach((card, index) => {
        if (index >= PROJECTS_VISIBLE_DEFAULT) {
            card.classList.add("project-hidden");
        }
    });

    toggleBtn.addEventListener("click", () => {
        const isExpanded = toggleBtn.dataset.expanded === "true";
        const hiddenCards = grid.querySelectorAll(".project-card.project-hidden");

        if (!isExpanded) {
            hiddenCards.forEach(card => {
                card.style.display = "block";
            });
            toggleBtn.textContent = "Masquer";
            toggleBtn.dataset.expanded = "true";
        } else {
            hiddenCards.forEach(card => {
                card.style.display = "none";
            });
            toggleBtn.textContent = "Voir plus";
            toggleBtn.dataset.expanded = "false";
        }
    });
}


// =========================================================
// CONTACT
// =========================================================

function initContact(contact) {
    if (!contact) return;

    const emailEl = document.getElementById("contact-email");
    const phoneEl = document.getElementById("contact-phone");
    const cityEl = document.getElementById("contact-city");
    const statusEl = document.getElementById("contact-status");
    const linksContainer = document.getElementById("contact-links");

    // E-mail → bouton cliquable (Gmail web)
    if (emailEl && contact.email) {
        emailEl.textContent = contact.email;
        emailEl.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`;
        emailEl.target = "_blank";
    }

    // Téléphone → bouton cliquable avec "tel:"
    if (phoneEl && contact.phone) {
        phoneEl.textContent = contact.phone;
        phoneEl.href = `tel:${contact.phone.replace(/\s+/g, '')}`;
    }

    // Autres infos classiques
    if (cityEl && contact.city) cityEl.textContent = contact.city;
    if (statusEl && contact.status) statusEl.textContent = contact.status;

    // Réseaux sociaux
    if (linksContainer) {
        linksContainer.innerHTML = "";

        if (Array.isArray(contact.links)) {
            contact.links.forEach(link => {
                const a = document.createElement("a");
                a.href = link.url;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.classList.add("contact-social");

                // icône
                if (link.icon) {
                    const img = document.createElement("img");
                    img.src = link.icon;
                    img.alt = link.label;
                    img.classList.add("contact-social-icon");
                    a.appendChild(img);
                }

                // texte du réseau
                const span = document.createElement("span");
                span.textContent = link.label;
                a.appendChild(span);

                linksContainer.appendChild(a);
            });
        }
    }
}


// =========================================================
// FOOTER – année automatique
// =========================================================

function initFooterYear() {
    const yearSpan = document.getElementById("footer-year");
    if (!yearSpan) return;
    yearSpan.textContent = new Date().getFullYear();
}


// =========================================================
// BOUTON "VOIR MES PROJETS"
// =========================================================

function initScrollButtons() {
    const btnProjets = document.getElementById("btn-voir-projets");
    const projetsSection = document.getElementById("projets");

    if (btnProjets && projetsSection) {
        btnProjets.addEventListener("click", () => {
            projetsSection.scrollIntoView({ behavior: "smooth" });
        });
    }
}


// =========================================================
// NAVBAR BURGER
// =========================================================

function initBurgerMenu() {
    const burgerBtn = document.getElementById("burger-btn");
    const navbar = document.getElementById("navbar");

    if (!burgerBtn || !navbar) return;

    burgerBtn.addEventListener("click", () => {
        burgerBtn.classList.toggle("active");
        navbar.classList.toggle("active");
    });

    navbar.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            burgerBtn.classList.remove("active");
            navbar.classList.remove("active");
        });
    });
}


// =========================================================
// LOGO → retour en haut de page
// =========================================================

function initLogoScrollTop() {
    const logoLink = document.getElementById("logo-link");
    if (!logoLink) return;

    logoLink.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
