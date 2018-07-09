var json = $("#data").text(),
    jsonData = JSON.parse(json),
    i,
    jsonLength = jsonData.length,
    temp,
    tbl,
    tr,
    td,
    body;
tbl = document.createElement("table");
tbl.border = "1px";
for (i = 0; i < jsonLength; i++) {
    if (i == 0) {
        tr = document.createElement("tr");
        for (temp in jsonData[i]) {
            td = document.createElement("td");
            td.appendChild(document.createTextNode(temp));
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }
    tr = document.createElement("tr");
    for (temp in jsonData[i]) {
        td = document.createElement("td");
        td.appendChild(document.createTextNode(jsonData[i][temp]));
        tr.appendChild(td);
    }
    tbl.appendChild(tr);
}
body = document.getElementsByTagName("body");
body[0].appendChild(tbl);