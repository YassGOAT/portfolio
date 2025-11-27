// =========================================================
// main.js – logique du portfolio
// =========================================================

// Config certifications
let CERTIFICATIONS_DATA = [];
let CURRENT_CERT_PAGE = 1;
const CERTS_PER_PAGE = 9;
const CERTS_VISIBLE_DEFAULT = 3;

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
// CERTIFICATIONS
// =========================================================

function setupCertifications(certifications) {
    if (!Array.isArray(certifications)) return;

    CERTIFICATIONS_DATA = certifications;
    CURRENT_CERT_PAGE = 1;

    renderCertificationsPage();
    renderCertificationsPagination();
    setupCertificationsToggle();
}

function getCertificationsForCurrentPage() {
    const startIndex = (CURRENT_CERT_PAGE - 1) * CERTS_PER_PAGE;
    const endIndex = startIndex + CERTS_PER_PAGE;
    return CERTIFICATIONS_DATA.slice(startIndex, endIndex);
}

function renderCertificationsPage() {
    const container = document.getElementById("certifications-list");
    if (!container) return;

    const certsPage = getCertificationsForCurrentPage();
    container.innerHTML = "";

    certsPage.forEach((cert, index) => {
        const card = document.createElement("article");
        card.classList.add("cert-card");

        if (index >= CERTS_VISIBLE_DEFAULT) {
            card.classList.add("cert-hidden");
        }

        const logo = document.createElement("div");
        logo.classList.add("cert-logo");

        if (cert.logo) {
            const img = document.createElement("img");
            img.src = cert.logo;
            img.alt = `Logo ${cert.issuer || ""}`.trim();
            img.loading = "lazy";
            logo.appendChild(img);
        }

        const title = document.createElement("h3");
        title.textContent = cert.title || "Certification";

        const issuer = document.createElement("p");
        issuer.classList.add("cert-issuer");
        issuer.textContent = cert.issuer || "";

        const year = document.createElement("p");
        year.classList.add("cert-year");
        if (cert.year) {
            year.textContent = `Année : ${cert.year}`;
        }

        if (cert.logo) card.appendChild(logo);
        card.appendChild(title);
        if (cert.issuer) card.appendChild(issuer);
        if (cert.year) card.appendChild(year);

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

function renderCertificationsPagination() {
    const paginationContainer = document.getElementById("cert-pagination");
    if (!paginationContainer) return;

    const totalCerts = CERTIFICATIONS_DATA.length;
    const totalPages = Math.ceil(totalCerts / CERTS_PER_PAGE);

    paginationContainer.innerHTML = "";

    if (totalPages <= 1) {
        paginationContainer.style.display = "none";
        return;
    }

    paginationContainer.style.display = "flex";

    for (let page = 1; page <= totalPages; page++) {
        const btn = document.createElement("button");
        btn.textContent = page;
        btn.classList.add("cert-page-btn");
        if (page === CURRENT_CERT_PAGE) {
            btn.classList.add("active");
        }

        btn.addEventListener("click", () => {
            CURRENT_CERT_PAGE = page;
            renderCertificationsPage();
            renderCertificationsPagination();
        });

        paginationContainer.appendChild(btn);
    }
}

function setupCertificationsToggle() {
    const toggleBtn = document.getElementById("cert-toggle-btn");
    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
        const container = document.getElementById("certifications-list");
        if (!container) return;

        const hiddenCards = container.querySelectorAll(".cert-hidden");
        if (hiddenCards.length === 0) return;

        const isExpanded = toggleBtn.dataset.expanded === "true";

        if (isExpanded) {
            hiddenCards.forEach(card => {
                card.style.display = "none";
            });
            toggleBtn.textContent = "Voir plus";
            toggleBtn.dataset.expanded = "false";
        } else {
            hiddenCards.forEach(card => {
                card.style.display = "block";
            });
            toggleBtn.textContent = "Masquer";
            toggleBtn.dataset.expanded = "true";
        }
    });
}

function resetCertToggleButton() {
    const toggleBtn = document.getElementById("cert-toggle-btn");
    const container = document.getElementById("certifications-list");
    if (!toggleBtn || !container) return;

    const cards = container.querySelectorAll(".cert-card");
    const hiddenCards = container.querySelectorAll(".cert-card.cert-hidden");

    if (cards.length <= CERTS_VISIBLE_DEFAULT || hiddenCards.length === 0) {
        toggleBtn.style.display = "none";
        toggleBtn.dataset.expanded = "false";
        return;
    }

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

    grid.innerHTML = "";

    projects.forEach(project => {
        const card = document.createElement("article");
        card.classList.add("project-card");

        if (project.image) {
            const img = document.createElement("img");
            img.src = project.image;
            img.alt = `Aperçu du projet ${project.title || ""}`.trim();
            img.loading = "lazy";
            card.appendChild(img);
        }

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
            githubLink.textContent = "GitHub";
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
}


// =========================================================
// CONTACT
// =========================================================

function initContact(contact) {
    if (!contact) return;

    const contactText = document.querySelector(".section-contact p");
    const linksContainer = document.getElementById("contact-links");

    if (contactText && contact.email) {
        contactText.innerHTML = `N’hésite pas à me contacter à cette adresse : 
            <a href="mailto:${contact.email}">${contact.email}</a>`;
    }

    if (!linksContainer || !Array.isArray(contact.links)) return;

    linksContainer.innerHTML = "";

    contact.links.forEach(link => {
        const a = document.createElement("a");
        a.href = link.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = link.label || link.url;
        a.classList.add("btn-secondary");
        linksContainer.appendChild(a);
    });
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
