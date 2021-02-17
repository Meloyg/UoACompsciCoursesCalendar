function fetchVcard(vCardURL) {
    return fPromise = fetch(vCardURL, {
        headers: {
            "Accept": "application/json",
        },
    })
        .then((response) => response.text())
        .then((e) => {
            let lst = e.split("\n");
            let obj = {};
            for (let i = 0; i < lst.length; i++) {
                let a = lst[i].split(":");
                if (a[0] == "TEL;TYPE=WORK,VOICE") {
                    obj.TEL = a[1];
                }
                if (a[0] == "ADR;TYPE=WORK") {
                    let s = a[1];
                    obj.ADR = s.replace(/;/g, "");
                }
            }
            let location = "<p class='location'>" + obj.ADR + "</p>";
            let phoneNumber = "<br><br>Phone: <a href='tel:" + obj.TEL + "' style='text-decoration: none;'>" + obj.TEL + "</a></li>";
            if (obj.ADR == null) {
                location = "";
            }
            if (obj.TEL == null) {
                phoneNumber = "";
            }

            return phoneNumber + location;
        });
}

function getStaffInfo() {
    const proxy = "https://dividni.com/cors/CorsProxyService.svc/proxy?url="
    const url = "https://unidirectory.auckland.ac.nz/rest/search?orgFilter=MATHS";
    const fetchPromise = fetch(proxy + url, {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((e) => {


        let list = e.list;
        // console.log(e);

        list.forEach((person) => {
            let title = "";
            if (person.title != null) {
                title = person.title;
            }
            let name = "<h2>" + title + " " + person.names + "</h2>";
            let email = "<br><br>Email: <a href='mailto:" + person.emailAddresses + "' style='text-decoration: none;'>" + person.emailAddresses + "</a>";
            let jobtitles = "<br>" + person.jobtitles;
            let profileUrl = person.profileUrl[1];
            let vCrad = "";
            if (profileUrl != null) {
                vCrad = "<br><br><a href='http://redsox.uoa.auckland.ac.nz/cors/CorsProxyService.svc/proxy?url=https://unidirectory.auckland.ac.nz/people/vcard/"
                    + profileUrl + "' style='text-decoration: none;'>Add to contacts</a>";
            }
            let imageURL = "";
            if (person.imageId != null) {
                imageURL = "http://redsox.uoa.auckland.ac.nz/cors/CorsProxyService.svc/proxy?url=https://unidirectory.auckland.ac.nz/people/imageraw/"
                    + profileUrl + "/" + person.imageId + "/biggest";
            } else {
                imageURL = "http://redsox.uoa.auckland.ac.nz/cors/CorsProxyService.svc/proxy?url=https://unidirectory.auckland.ac.nz/people/imageraw/"
                    + 0 + "/" + 0 + "/biggest";
            }
            let image = "<img src='" + imageURL + "' />";

            let vCardURL = "http://redsox.uoa.auckland.ac.nz/cors/CorsProxyService.svc/proxy?url=https://unidirectory.auckland.ac.nz/people/vcard/" + profileUrl + "";


            // console.log(result);

            let content = "<div id='info'>" + name + image + jobtitles + vCrad + email;

            let s = fetchVcard(vCardURL);

            async function getInfo(content) {
                let result = await fetchVcard(vCardURL);
                document.getElementById("staff").innerHTML += content + result + "</div><hr/ style='width:80%;' >";
                console.clear();
            }
            getInfo(content);

        })
    });

}

function fetchTimetable(catalogNbr) {
    let url = "https://api.test.auckland.ac.nz/service/classes/v1/classes?year=2021&subject=COMPSCI&size=500&catalogNbr=" + catalogNbr;
    const fetchPromise = fetch(url)
        .then((response) => (response.json()))
        .then((e) => {
            let table = document.getElementById(catalogNbr);
            // console.log(e);
            if (e == undefined || e.data == "") {
                table.innerHTML = "Timetable is not available for this course. Please contact the Mathematics office for more information.";
            }
            else {
                let list = e.data;
                table.innerHTML = "";

                list.forEach((e) => {
                    if (e.meetingPatterns.length != 0) {
                        let num = 0;
                        let name = e.acadOrg + " " + e.catalogNbr;
                        let type = e.component + " " + e.classNbr;
                        let status = "<br>Status: CLOSE";
                        if (e.status == "O") {
                            status = "<br>Status: OPEN"
                            num = 1;
                        }
                        let info = "";

                        e.meetingPatterns.forEach((e) => {
                            if (e != undefined) {
                                let day = e.daysOfWeek;
                                let startTime = "Time: " + e.startTime + " - " + e.endTime;
                                let startDate = "Date: " + e.startDate + " - " + e.endDate;
                                let location = "Location: " + e.location;
                                info += "<br>" + startDate + "  ||  " + startTime + " || " + location + '<br>';
                            }
                            let content = name + ": " + type + status + "<br>" + info;
                            if (num == 1) {
                                table.innerHTML += "<div style='background-color: lightgreen;' id='tb'>" + content + "</div>";
                            } else {
                                table.innerHTML += "<div id='tb'>" + content + "</div>";
                            }
                        })
                    }
                })
            }

            if (table.style.display == "none") {
                table.style.display = "block";
            } else {
                table.style.display = "none";
            }
        })
}


function getCourses() {
    const url = "https://api.test.auckland.ac.nz/service/courses/v2/courses?subject=COMPSCI&year=2021&size=500";
    const fetchPromise = fetch(url)
        .then((response) => (response.json()))
        .then((e) => {
            const list = e.data;
            // console.log(list);

            let obj = {};
            let array = [];

            list.forEach((course) => {
                let courseNum = course.catalogNbr;
                let title = "<br><h3>" + course.acadOrg + " " + courseNum + "</h3>";
                let info = course.titleLong;
                let courseInfo = "<p>Please contact the Mathematics office for more information.</p>"
                if (course.description != undefined) {
                    courseInfo = "<p>" + course.description + "</p>"
                }
                let rqrmntDescr = "<p></p>"
                if (course.rqrmntDescr != undefined) {
                    rqrmntDescr = '<p>' + course.rqrmntDescr + "</p>";
                }
                let timetable = "<button id='tButton' onclick=fetchTimetable(" + course.catalogNbr + ")>Show and Hide Timetable</button>" +
                    "<section id='" + course.catalogNbr + "' style='display:none;'></section>";

                let content = title + info + courseInfo + rqrmntDescr + timetable + "<br><hr/>";

                obj[courseNum] = content;
                array.push(courseNum);

            });
            array.sort();

            array.forEach((e) => {
                if (e[0] == "1") {
                    document.getElementById("stage1").innerHTML += obj[e];
                }
                if (e[0] == "2") {
                    document.getElementById("stage2").innerHTML += obj[e];
                }
                if (e[0] == "3") {
                    document.getElementById("stage3").innerHTML += obj[e];
                }
                if (e[0] == "7") {
                    document.getElementById("pgd").innerHTML += obj[e];
                }
                if (e[0] == "8" | e[0] == "9") {
                    document.getElementById("others").innerHTML += obj[e];
                }
            });


        })
}


function fetchGraph() {
    const url = "https://cws.auckland.ac.nz/qz20/Quiz2020ChartService.svc/g";
    const fPromise = fetch(url)
        .then((response) => response.json())
        .then((e) => {

            const svg = "http://www.w3.org/2000/svg";
            let y = 30;

            const viewBox = document.createElementNS(svg, "svg");
            viewBox.setAttribute("viewBox", "0 0 500 500");
            viewBox.setAttribute("width", "100%");
            viewBox.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
            document.getElementById("graph").appendChild(viewBox);

            let count = 1;



            e.forEach((data) => {
                let number = data / 10;
                let q = 30;
                for (let j = 0; j < number; j++) {
                    let logo = document.createElementNS(svg, "use");
                    logo.setAttribute("xlink:href", "#myDot");
                    logo.setAttribute("x", q);
                    logo.setAttribute("y", y - 20);
                    viewBox.appendChild(logo);
                    q += 28;

                }
                let num = 10 - (data % 10);
                let num1 = 28 * (num / 10.0)
                if (num != 10) {

                    let rect = document.createElementNS(svg, "rect");
                    rect.setAttribute("id", "block")
                    rect.setAttribute("x", q - num - 1);
                    rect.setAttribute("y", y - 20);
                    rect.setAttribute("width", 20);
                    rect.setAttribute("height", 25);
                    rect.setAttribute("fill", "white");
                    viewBox.appendChild(rect);

                    let cut = document.createElementNS(svg, "use");
                    cut.setAttribute("clip-path", "#url(#myDot)");
                    cut.setAttribute("xlink:href", "#block");
                    cut.setAttribute("fill", "blue");
                    viewBox.appendChild(cut);
                }




                let newText = document.createElementNS(svg, "text");
                newText.setAttribute("x", 20);
                newText.setAttribute("y", y);
                newText.setAttribute("font-size", "15");


                newText.innerHTML = count++;
                viewBox.appendChild(newText);

                y += 30;
            })


            let output = "";
            for (let i = 0; i < e.length; i++) {
                output += "[" + e[i] + "]";
            }
            document.getElementById("graph").innerHTML += "";
        })
}



// console.log(list1);
getStaffInfo();
getCourses();
fetchGraph();





function showHome() {
    document.getElementById("home").style.display = "block";
    document.getElementById("staff").style.display = "none";
    document.getElementById("infographics").style.display = "none";
    document.getElementById("courses").style.display = "none";

}

function showStaff() {
    document.getElementById("home").style.display = "none";
    document.getElementById("staff").style.display = "block";
    document.getElementById("infographics").style.display = "none";
    document.getElementById("courses").style.display = "none";
}

function showInfographics() {
    document.getElementById("home").style.display = "none";
    document.getElementById("staff").style.display = "none";
    document.getElementById("infographics").style.display = "block";
    document.getElementById("courses").style.display = "none";
}

function showCourses() {
    document.getElementById("home").style.display = "none";
    document.getElementById("staff").style.display = "none";
    document.getElementById("infographics").style.display = "none";
    document.getElementById("courses").style.display = "block";
}