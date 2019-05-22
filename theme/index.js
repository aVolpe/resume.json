var fs = require('fs');
var _ = require('lodash');
var gravatar = require('gravatar');
var Mustache = require('mustache');

var d = new Date();
var curyear = d.getFullYear();

function getMonth(startDateStr) {
    switch (startDateStr.substr(5,2)) {
    case '01':
        return "January ";
    case '02':
        return "February ";
    case '03':
        return "March ";
    case '04':
        return "April ";
    case '05':
        return "May ";
    case '06':
        return "June ";
    case '07':
        return "July ";
    case '08':
        return "August ";
    case '09':
        return "September ";
    case '10':
        return "October ";
    case '11':
        return "November ";
    case '12':
        return "December ";
    }
}

function render(resumeObject) {

    resumeObject.capitalName = resumeObject.name.toUpperCase();
    if(resumeObject.contact && resumeObject.contact.email) {
        resumeObject.gravatar = gravatar.url(resumeObject.contact.email, {
                        s: '200',
                        r: 'pg',
                        d: 'mm'
                    });
    }
    resumeObject.photo = resumeObject.info.image;

    _.each(resumeObject.social, function(p){
        switch(p.network.toLowerCase()) {
            // special cases
            case "google-plus":
            case "googleplus":
                p.iconClass = "fa fa-google-plus";
                break;
            case "flickr":
            case "flicker":
                p.iconClass = "fa fa-flickr";
                break;
            case "dribbble":
            case "dribble":
                p.iconClass = "fa fa-dribbble";
                break;
            case "codepen":
                p.iconClass = "fa fa-codepen";
                break;
            case "soundcloud":
                p.iconClass = "fa fa-soundcloud";
                break;
            case "reddit":
                p.iconClass = "fa fa-reddit";
                break;
            case "tumblr":
            case "tumbler":
                p.iconClass = "fa fa-tumblr";
                break;
            case "stack-overflow":
            case "stackoverflow":
                p.iconClass = "fa fa-stack-overflow";
                break;
            case "blog":
            case "rss":
                p.iconClass = "fa fa-rss";
                break;
            case "gitlab":
                p.iconClass = "fa fa-gitlab";
                break;
            case "keybase":
                p.iconClass = "fa fa-key";
                break;
            default:
                // try to automatically select the icon based on the name
                p.iconClass = "fa fa-" + p.network.toLowerCase();
        }

        if (p.url) {
            p.text = p.url;
        } else {
            p.text = p.network + ": " + p.username;
        }
    });

    if (resumeObject.employment.history && resumeObject.employment.history.length) {
        resumeObject.employmentBool = true;
        _.each(resumeObject.employment.history, function(w){
            if (w.start) {
                w.startDateYear = (w.start || "").substr(0,4);
                w.startDateMonth = getMonth(w.start || "");

            }
            if(w.end) {
                w.endDateYear = (w.end || "").substr(0,4);
                w.endDateMonth = getMonth(w.end || "");
            } else {
                w.endDateYear = 'Present'
            }
            if (w.highlights) {
                if (w.highlights[0]) {
                    if (w.highlights[0] != "") {
                        w.boolHighlights = true;
                    }
                }
            }
        });
    }

    if (resumeObject.volunteer && resumeObject.volunteer.length) {
        resumeObject.volunteerBool = true;
        _.each(resumeObject.volunteer, function(w){
            if (w.startDate) {
                w.startDateYear = (w.startDate || "").substr(0,4);
                w.startDateMonth = getMonth(w.startDate || "");

            }
            if(w.endDate) {
                w.endDateYear = (w.endDate || "").substr(0,4);
                w.endDateMonth = getMonth(w.endDate || "");
            } else {
                w.endDateYear = 'Present'
            }
            if (w.highlights) {
                if (w.highlights[0]) {
                    if (w.highlights[0] != "") {
                        w.boolHighlights = true;
                    }
                }
            }
        });
    }

    if (resumeObject.education.history && resumeObject.education.history.length) {
        if (resumeObject.education.history[0].institution) {
            resumeObject.educationBool = true;
            _.each(resumeObject.education.history, function(e){
                if( !e.area || !e.studyType ){
                  e.educationDetail = (e.area == null ? '' : e.area) + (e.studyType == null ? '' : e.studyType);
                } else {
                  e.educationDetail = e.area + ", "+ e.studyType;
                }
                if (e.start) {
                    e.startDateYear = e.start.substr(0,4);
                    e.startDateMonth = getMonth(e.start || "");
                } else {
                    e.endDateMonth = "";
                }
                if (e.end) {
                    e.endDateYear = e.end.substr(0,4);
                    e.endDateMonth = getMonth(e.end || "")

                    if (e.endDateYear > curyear) {
                        e.endDateYear += " (expected)";
                    }
                } else {
                    e.endDateYear = 'Present'
                    e.endDateMonth = '';
                }
                if (e.courses) {
                    if (e.courses[0]) {
                        if (e.courses[0] != "") {
                            e.educationCourses = true;
                        }
                    }
                }
            });
        }
    }

    if (resumeObject.awards && resumeObject.awards.length) {
        if (resumeObject.awards[0].title) {
            resumeObject.awardsBool = true;
            _.each(resumeObject.awards, function(a){
                a.year = (a.date || "").substr(0,4);
                a.day = (a.date || "").substr(8,2);
                a.month = getMonth(a.date || "");
            });
        }
    }

    if (resumeObject.publications && resumeObject.publications.length) {
        if (resumeObject.publications[0].name) {
            resumeObject.publicationsBool = true;
            _.each(resumeObject.publications, function(a){
                a.year = (a.releaseDate || "").substr(0,4);
                a.day = (a.releaseDate || "").substr(8,2);
                a.month = getMonth(a.releaseDate || "");
            });
        }
    }

    if (resumeObject.skills.sets && resumeObject.skills.sets.length) {
        if (resumeObject.skills.sets[0].name) {
            resumeObject.skillsBool = true;
        }
    }

    if (resumeObject.interests && resumeObject.interests.length) {
        if (resumeObject.interests[0].name) {
            resumeObject.interestsBool = true;
        }
    }

    if (resumeObject.languages && resumeObject.languages.length) {
        if (resumeObject.languages[0].language) {
            resumeObject.languagesBool = true;
        }
    }

    if (resumeObject.references && resumeObject.references.length) {
        if (resumeObject.references[0].name) {
            resumeObject.referencesBool = true;
        }
    }

    resumeObject.css = fs.readFileSync(__dirname + "/style.css", "utf-8");
    resumeObject.printcss = fs.readFileSync(__dirname + "/print.css", "utf-8");
    var theme = fs.readFileSync(__dirname + '/resume.template', 'utf8');
    var resumeHTML = Mustache.render(theme, resumeObject);


    return resumeHTML;
};
module.exports = {
    render: render
}
