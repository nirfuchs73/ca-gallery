var gNextId = 1;
var gProjects;

function createProjects() {
    var projects = [
        createProject('Project 1', 'description 1', 'Threads', 'Illustration', 'img/portfolio/01-thumbnail.jpg', 'img/portfolio/01-full.jpg', 'projs/Minesweeper/index.html'),
        createProject('Project 2', 'description 2', 'Explore', 'Graphic Design', 'img/portfolio/02-thumbnail.jpg', 'img/portfolio/02-full.jpg', 'projs/GuessMe/index.html'),
        createProject('Project 3', 'description 3', 'Finish', 'Identity', 'img/portfolio/03-thumbnail.jpg', 'img/portfolio/03-full.jpg', 'projs/Minesweeper/index.html'),
        createProject('Project 4', 'description 4', 'Lines', 'Branding', 'img/portfolio/04-thumbnail.jpg', 'img/portfolio/04-full.jpg', 'projs/GuessMe/index.html'),
        createProject('Project 5', 'description 5', 'Southwest', 'Website Design', 'img/portfolio/05-thumbnail.jpg', 'img/portfolio/05-full.jpg', 'projs/Minesweeper/index.html'),
        createProject('Project 6', 'description 5', 'Window', 'Photography', 'img/portfolio/06-thumbnail.jpg', 'img/portfolio/06-full.jpg', 'projs/GuessMe/index.html')
    ];

    gProjects = projects;
}

function getProjectsForDisplay() {
    return gProjects;
}

function createProject(name, desc, client, category, thumbnail, img, url) {
    return {
        id: gNextId++,
        name: name,
        // title: title,
        desc: desc,
        publishedAt: 1549291021753,
        client: client,
        category, category,
        thumbnail: thumbnail,
        img: img,
        url: url,
        labels: ['Matrixes', 'keyboard events']
    }
}

function getProjectById(id) {
    var project = gProjects.find(function (project) {
        return project.id === id;
    });

    return project;
}

function getMonthByTimestamp(timestamp) {
    var mobthes = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    date = new Date(timestamp);
    var idx = date.getMonth();
    return mobthes[idx];
}

function getYearByTimestamp(timestamp) {
    date = new Date(timestamp);
    return date.getFullYear();
}

function sendEmail() {
    var emailAddress = 'nirfuch73@gmail.com';
    var url = 'https://mail.google.com/mail/u/0/?view=cm&fs=1&to=' + emailAddress + '&su=SUBJECT&body=BODY';
    window.open(url);
}