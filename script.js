function toggleMenu(){
    const menu = document.querySelector(".mobile__menu-links");
    const icon = document.querySelector(".mobile__menu-icon");

    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

document.onreadystatechange = () => { 
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector("#loader").style.visibility = "visible";
    } else {        
        getData();
        setTimeout(() => {
            document.querySelector("body").style.visibility = "visible";
            document.querySelector("#loader").style.display = "none";
        }, 700);        
    }
}

async function getData() {  
    /// ELEMENTS
    const topName = document.querySelectorAll(".logo");

    /* PROFILE SECTION */ 
    const profilePic = document.querySelector(".profile-pic");
    const profileName = document.querySelector("#profile-name");
    const profileRole = document.querySelector("#profile-role");
    const profileDownloadCv = document.querySelector("#profile-download-cv");
    const profileLinkedin = document.querySelectorAll(".linkedin-profile");
    const profileGitHub = document.querySelector(".github-profile");

    /* ABOUT SECTION */
    const aboutPic = document.querySelector(".about-pic");
    const aboutExperience = document.querySelector(".about-experience-container");
    const aboutEducation = document.querySelector(".about-education-container");
    const aboutText = document.querySelector(".about-text p");

    /* EXPERIENCE SECTION */
    const skillSection = document.querySelector(".skills-container");
    const certificationSection = document.querySelector(".certifications-container");

    /* PROJECTS SECTION */    
    const projectSection = document.querySelectorAll(".project-container");

    /* CONTACT SECTION */
    const contactEmail = document.querySelector(".contact-email a");
    const contactLinkedin = document.querySelector(".contact-linkedin a");

    /* FOOTER SECTION */
    const footerCopyright = document.querySelector("footer p");
       
    const data = await fetch('./portfolio.json');
    const portfolio = await data.json();
    if(portfolio){
        topName.forEach(x => x.innerHTML = portfolio.profile.name);
    
        /* Profile */
        profilePic.src = portfolio.profile.profilePic;
        profileName.innerHTML = portfolio.profile.name;
        profileRole.innerHTML = portfolio.profile.role;
        profileDownloadCv.addEventListener('click', () => {
            window.open(portfolio.profile.cvPath);
        });
        profileLinkedin.forEach(x => x.addEventListener('click', () => {
            window.open(portfolio.profile.linkedinUrl);
        }));
        profileGitHub.addEventListener('click', () => {
            window.open(portfolio.profile.githubUrl);
        })
    
        /* About */
        aboutPic.src = "./assets/about-pic.jpg";
        portfolio.about.experiences.forEach(item => {
            var exp = document.createElement("p");
            exp.innerHTML = `&#10022; ${item.yoe} years - ${item.area}`;
            aboutExperience.appendChild(exp);            
        });         
        portfolio.about.education.forEach(item => {
            var edu = document.createElement("p");
            edu.innerHTML = `&#10022; ${item.title} ${item.course} ${item.type}`;
            aboutEducation.appendChild(edu);            
        }); 
        aboutText.innerHTML = portfolio.about.aboutText;

        let skillsHtml = createSkillSection(portfolio.skills);
        skillSection.innerHTML = skillsHtml;

        let certificationsHtml = createCertificationSection(portfolio.certifications);
        certificationSection.innerHTML = certificationsHtml;

        /* Projects */
        for(let i = 0; i < portfolio.projects.length || i < 3; i++){
            projectSection[i].querySelector(".project-img").src = portfolio.projects[i].projectPic ?? "./assets/default-project-pic.png";
            projectSection[i].querySelector(".project-title").innerHTML = portfolio.projects[i].name;
            projectSection[i].querySelector(".project-repo").addEventListener('click', () => {
                window.open(portfolio.projects[i].gitHubUrl)
            });
            projectSection[i].querySelector(".project-demo").addEventListener('click', () => {
                window.open(portfolio.projects[i].liveDemoUrl)
            });
        }

        /* Contact */
        contactEmail.href = `mailto:${portfolio.profile.email}`;
        contactEmail.innerHTML = portfolio.profile.email;
        contactLinkedin.href = portfolio.profile.linkedinUrl;

        /* Footer */
        let currentYear = new Date().getFullYear();
        footerCopyright.innerHTML = `Copyright &#169; ${currentYear} ${portfolio.profile.name}. All Rights Reserved.`
    }    
}

const createSkillSection = (skills) => {
    const groupedSkills = skills.reduce((group, expItem) => {
        const { type } = expItem;
        group[type] = group[type] ?? [];
        group[type].push({skill: expItem.skill, level: expItem.level});
        return group;
      }, {});

    let skillContainerHtml = "";
    Object.keys(groupedSkills).forEach(groupSkill => {
        skillContainerHtml += `<div class="details-container">
        <h2 class="experience-sub-title">${groupSkill}</h2>
        <div class="article-container">`

        Object.values(groupedSkills[groupSkill]).forEach(skill => {
            skillContainerHtml += `<article>
            <img 
                class="icon"
                src="./assets/checkmark.png" alt="Checkmark icon">
            <div>
                <h3>${skill.skill}</h3>
                <div class="bar bar-progress-${skill.level}"></div>
            </div>
        </article>`
        });

        skillContainerHtml += `</div>
        </div>`
    });

    return skillContainerHtml;
}

const createCertificationSection = (certifications) => {
    let certificationContainerHtml = "";
    certifications.forEach(certification => {
        certificationContainerHtml += `
        <div class="details-container">
            <div class="article-container">
                <div class="certification-item-container">
                    <p>
                        <img 
                        class="icon"
                        src="./assets/experience.png" alt="Experience icon">
                        <b>${certification.name}</b>
                    </p>
                    <div class="certification-item-detail">
                        <p>by ${certification.company}</p> 
                        <p>(${certification.date})</p>
                    </div>
                </div>
            </div>
        </div>`
    });

    return certificationContainerHtml;
}