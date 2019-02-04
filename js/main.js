console.log('Starting up');

function initPage() {
    createProjects();
    renderProjects();
}

function renderProjects() {

    var projects = getProjectsForDisplay();
    // console.log(projects);
    var strHTML = '';
    projects.map(function (project) {
        strHTML += `<div class="col-md-4 col-sm-6 portfolio-item">
                        <a class="portfolio-link" data-toggle="modal" href="#portfolioModal" onclick="renderModal(${project.id})">
                            <div class="portfolio-hover">
                                <div class="portfolio-hover-content">
                                    <i class="fa fa-plus fa-3x"></i>
                                </div>
                            </div>
                            <img class="img-fluid" src="${project.thumbnail}" alt="">
                        </a>
                        <div class="portfolio-caption">
                            <h4>${project.client}</h4>
                            <p class="text-muted">${project.category}</p>
                        </div>
                    </div>`
    });

    $('.projects').html(strHTML);
}

function renderModal(id) {
    var project = getProjectById(id);
    console.log(project.url);
    $('.portfolio-modal .project-name').text(project.name);
    $('.portfolio-modal .project-desc').text(project.desc);
    $('.portfolio-modal .project-img').attr('src', project.img);
    var month = getMonthByTimestamp(project.publishedAt);
    var year = getYearByTimestamp(project.publishedAt);
    $('.portfolio-modal .project-date').text('Date: ' + month + ' ' + year);
    $('.portfolio-modal .project-client').text(project.client);
    $('.portfolio-modal .project-category').text(project.category);
    $('.portfolio-modal .project-url').attr('href', project.url);
}