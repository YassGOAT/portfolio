// main.js

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
            initCertifications(data.certifications);
            initProjects(data.projects);
            initContact(data.contact);
            initFooterYear();
            initScrollButtons();
        })
        .catch(error => {
            console.error("Impossible de charger data.json :", error);
        });
});

/* ==========================
   PRÉSENTATION
   ========================== */

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

/* ==========================
   CERTIFICATIONS
   ========================== */

function initCertifications(certifications) {
    const container = document.getElementById("certifications-list");
    if (!container || !Array.isArray(certifications)) return;

    container.innerHTML = "";

    certifications.forEach(cert => {
        const card = document.createElement("article");
        card.classList.add("cert-card");

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

        const link = document.createElement("a");
        if (cert.certificate_url) {
            link.href = cert.certificate_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Voir le certificat";
            link.classList.add("btn-secondary");
        }

        card.appendChild(logo);
        card.appendChild(title);
        card.appendChild(issuer);
        card.appendChild(year);
        if (cert.certificate_url) {
            card.appendChild(link);
        }

        container.appendChild(card);
    });
}

/* ==========================
   PROJETS
   ========================== */

function initProjects(projects) {
    const grid = document.getElementById("projects-grid");
    if (!grid || !Array.isArray(projects)) return;

    grid.innerHTML = "";

    projects.forEach(project => {
        const card = document.createElement("article");
        card.classList.add("project-card");

        // Image du projet
        if (project.image) {
            const img = document.createElement("img");
            img.src = project.image;
            img.alt = `Aperçu du projet ${project.title || ""}`.trim();
            img.loading = "lazy";
            card.appendChild(img);
        }

        const body = document.createElement("div");
        body.classList.add("project-card-body");

        // Titre
        const title = document.createElement("h3");
        title.classList.add("project-card-title");
        title.textContent = project.title || "Projet";

        // Description
        const desc = document.createElement("p");
        desc.classList.add("project-card-desc");
        desc.textContent = project.description || "";

        // Techs
        const techList = document.createElement("p");
        techList.classList.add("project-card-techs");
        if (Array.isArray(project.techs) && project.techs.length > 0) {
            techList.textContent = project.techs.join(" • ");
        }

        // Liens (GitHub / Demo)
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

/* ==========================
   CONTACT
   ========================== */

function initContact(contact) {
    if (!contact) return;

    const linksContainer = document.getElementById("contact-links");
    const contactSection = document.querySelector(".section-contact p");

    // Email dans le texte
    if (contactSection && contact.email) {
        contactSection.innerHTML = `N’hésite pas à me contacter à cette adresse : 
            <a href="mailto:${contact.email}">${contact.email}</a>`;
    }

    // Liens (GitHub, LinkedIn, etc.)
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

/* ==========================
   FOOTER
   ========================== */

function initFooterYear() {
    const yearSpan = document.getElementById("footer-year");
    if (!yearSpan) return;
    const year = new Date().getFullYear();
    yearSpan.textContent = year;
}

/* ==========================
   BOUTON "VOIR MES PROJETS"
   ========================== */

function initScrollButtons() {
    const btnProjets = document.getElementById("btn-voir-projets");
    const projetsSection = document.getElementById("projets");

    if (btnProjets && projetsSection) {
        btnProjets.addEventListener("click", () => {
            projetsSection.scrollIntoView({ behavior: "smooth" });
        });
    }
}

/* ==========================
   MENU BURGER
   ========================== */

const burgerBtn = document.getElementById("burger-btn");
const navbar = document.getElementById("navbar");

if (burgerBtn && navbar) {
    burgerBtn.addEventListener("click", () => {
        burgerBtn.classList.toggle("active");
        navbar.classList.toggle("active");
    });
}

// Ferme le menu quand on clique sur un lien
document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        burgerBtn.classList.remove("active");
        navbar.classList.remove("active");
    });
});

// Ferme le menu quand on clique en dehors
document.addEventListener("click", e => {
    if (!e.target.closest(".navbar") && !e.target.closest("#burger-btn")) {
        burgerBtn.classList.remove("active");
        navbar.classList.remove("active");
    }
});