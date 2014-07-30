function ReportViewModel() {
  var self = this;
  
  self.address = ko.observable('');
  self.zip = ko.observable('');
  
  self.recyclingOptions = [
    {intVal: 1, label: "My landlord provides recycling"},
    {intVal: 2, label: "My building has blue bins"},
    {intVal: 3, label: "There is no recycling in my building"},
    {intVal: 4, label: "There is a recycling building to get to, but it is not easy to use"},
    {intVal: 5, label: "There is a recycling bin at my building, but it does not have enough space"}
  ]
  
  self.save = function(){
    // here we will do some client-side validation
    // and then POST the values to the geocoding endpoint, etc.
    console.log(self.address() + ", " + self.zip());
  }
}

ko.applyBindings(new ReportViewModel());