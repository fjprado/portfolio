const DEFAULT_PROJECT_PIC = "./assets/default-project-pic.png";
const IMAGE_WAIT_TIMEOUT_MS = 3000;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/* MOBILE MENU */

function initMobileMenu() {
    const icon = $(".mobile__menu-icon");
    const menu = $(".mobile__menu-links");

    const setOpen = (open) => {
        menu.classList.toggle("open", open);
        icon.classList.toggle("open", open);
        icon.setAttribute("aria-expanded", String(open));
    };

    icon.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
    $$("a", menu).forEach(link => link.addEventListener("click", () => setOpen(false)));
}

/* HELPERS */

const cloneTemplate = (id) => document.getElementById(id).content.firstElementChild.cloneNode(true);

const setLink = (element, url) => {
    if (url) element.href = url;
    else element.remove();
};

const groupBy = (items, key) => items.reduce((groups, item) => {
    (groups[item[key]] ??= []).push(item);
    return groups;
}, {});

const pageLoaded = () => new Promise(resolve => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
});

// Waits for eagerly loaded images (e.g. profile pictures set from JSON) so the page reveals fully drawn.
const imagesLoaded = () => {
    const pending = $$("img:not([loading='lazy'])")
        .filter(img => !img.complete)
        .map(img => new Promise(resolve => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
        }));
    const timeout = new Promise(resolve => setTimeout(resolve, IMAGE_WAIT_TIMEOUT_MS));
    return Promise.race([Promise.all(pending), timeout]);
};

/* RENDERERS */

function renderProfile(profile) {
    document.title = `${profile.name} | Portfolio`;
    $$(".logo").forEach(logo => logo.textContent = profile.name);

    $(".profile-pic").src = profile.profilePic;
    $("#profile-name").textContent = profile.name;
    $("#profile-role").textContent = profile.role;
    $("#profile-download-cv").href = profile.cvPath;
    $(".linkedin-profile").href = profile.linkedinUrl;
    $(".github-profile").href = profile.githubUrl;
}

function renderAbout(about) {
    $(".about-pic").src = about.aboutPic;

    const experience = $(".about-experience-container");
    about.experiences.forEach(({ yoe, area }) => {
        const p = document.createElement("p");
        p.textContent = `✦ ${yoe} years - ${area}`;
        experience.appendChild(p);
    });

    const education = $(".about-education-container");
    about.education.forEach(({ title, course }) => {
        const p = document.createElement("p");
        p.textContent = `✦ ${title} in ${course}`;
        education.appendChild(p);
    });

    // aboutText intentionally allows simple HTML such as <br>.
    $(".about-text p").innerHTML = about.aboutText;
}

function renderSkills(skills) {
    const container = $(".skills-container");

    Object.entries(groupBy(skills, "type")).forEach(([type, groupSkills]) => {
        const group = cloneTemplate("skill-group-template");
        $(".experience-sub-title", group).textContent = type;

        const list = $(".article-container", group);
        groupSkills.forEach(({ skill, level }) => {
            const item = cloneTemplate("skill-template");
            const bar = $(".bar", item);
            $(".skill-name", item).textContent = skill;
            bar.classList.add(`bar-progress-${level}`);
            bar.setAttribute("aria-label", `Level ${level} of 5`);
            list.appendChild(item);
        });

        container.appendChild(group);
    });
}

function renderCertifications(certifications) {
    const container = $(".certifications-container");

    certifications.forEach(({ name, company, date }) => {
        const item = cloneTemplate("certification-template");
        $(".certification-name", item).textContent = name;
        $(".certification-company", item).textContent = `by ${company}`;
        $(".certification-date", item).textContent = `(${date})`;
        container.appendChild(item);
    });
}

function renderProjects(projects) {
    const container = $(".projects-grid");

    projects.forEach(({ name, projectPic, description, tags, gitHubUrl, liveDemoUrl }) => {
        const card = cloneTemplate("project-template");

        const img = $(".project-card__img", card);
        img.src = projectPic || DEFAULT_PROJECT_PIC;
        img.alt = `${name} screenshot`;
        img.addEventListener("error", () => img.src = DEFAULT_PROJECT_PIC, { once: true });

        $(".project-card__title", card).textContent = name;

        const descriptionEl = $(".project-card__description", card);
        if (description) descriptionEl.textContent = description;
        else descriptionEl.remove();

        const tagList = $(".project-card__tags", card);
        if (tags?.length) {
            tags.forEach(tag => {
                const li = document.createElement("li");
                li.textContent = tag;
                tagList.appendChild(li);
            });
        } else {
            tagList.remove();
        }

        setLink($(".project-repo", card), gitHubUrl);
        setLink($(".project-demo", card), liveDemoUrl);

        container.appendChild(card);
    });
}

function renderContact(profile) {
    const email = $(".contact-email a");
    email.href = `mailto:${profile.email}`;
    email.textContent = profile.email;
    $(".contact-linkedin a").href = profile.linkedinUrl;
}

function renderFooter(profile) {
    const year = new Date().getFullYear();
    $("footer .copyright").textContent = `Copyright © ${year} ${profile.name}. All Rights Reserved.`;
}

/* INIT */

async function loadPortfolio() {
    const response = await fetch("./portfolio.json");
    if (!response.ok) throw new Error(`Failed to load portfolio.json (${response.status})`);
    return response.json();
}

async function init() {
    initMobileMenu();

    try {
        const portfolio = await loadPortfolio();
        renderProfile(portfolio.profile);
        renderAbout(portfolio.about);
        renderSkills(portfolio.skills);
        renderCertifications(portfolio.certifications);
        renderProjects(portfolio.projects);
        renderContact(portfolio.profile);
        renderFooter(portfolio.profile);
    } catch (error) {
        console.error(error);
    }

    await pageLoaded();
    await imagesLoaded();
    document.body.classList.remove("is-loading");
}

init();
