function JSONToCSVConvertor(data:any, columns: any, index: any, showHeadings: boolean, center: { country_name: string; country_iso: string; name: string; wbmt_id: string; }, year: string, numTeams: number, ageGroup: string, reporter: { email: string; }) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object

    var CSV = "";
    //This condition will generate the Label/Header
    if (showHeadings) {
      var row = "sep=,"
      CSV += row + "\r\n";
      var row = "Country, " + center.country_name + " " + center.country_iso;
      CSV += row + "\r\n";
      var row = "Center Name, " + center.name;
      CSV += row + "\r\n";
      var row = "Center WBMT ID, " + center.wbmt_id;
      CSV += row + "\r\n";
      var row = "Year, " + year;
      CSV += row + "\r\n";
      var row = "Number of Centers, " + numTeams;
      CSV += row + "\r\n";
      var row = "Age Group, " + ageGroup;
      CSV += row + "\r\n";
      var row = "Reporter, " + reporter?.email;
      CSV += row + "\r\n";
      CSV += "\r\n";
    }
    //Create header row
    var row = "";
    row += "Indication" + ",";
    {(columns).map((data: any ) => {
      row += data['donor_type_txt'] + ","
    })};
    row = row.slice(0, -1);
    CSV += row + "\r\n";

    //1st loop is to extract each row
    {(index).map((ind: any) => {
      var row = ind['indication_txt'] + ",";
        {(columns).map((don: { donor_type_id: string | number; }) => {
        row += data[ind.indication_id][don.donor_type_id] + ","
      })};
      row.slice(0, row.length - 1);
      CSV += row + "\r\n";
    })}

    if (CSV === "") {
      alert("Invalid data");
      return;
    }

    //Generate a file name
    var fileName = center.country_iso + "_" + center.wbmt_id + "_" + year;
    //this will remove the blank-spaces from the title and replace it with an underscore
    // fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = "data:text/csv;charset=utf-8," + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    // link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return(
    <></>
    )}

    export {JSONToCSVConvertor}
