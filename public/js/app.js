function ReportViewModel() {
  var self = this;
  
  self.address = ko.observable('');
  self.zip = ko.observable('');
  self.selectedAddress = ko.observable('');
  self.possibleAddresses = ko.observable('');
  self.recyclingAvailable = ko.observable('');
  self.modalMessage = ko.observable('');
  
  self.recyclingOptions = [
    {intVal: 1, label: "My landlord provides recycling"},
    {intVal: 2, label: "My building has blue bins"},
    {intVal: 3, label: "There is no recycling in my building"},
    {intVal: 4, label: "There is a recycling building to get to, but it is not easy to use"},
    {intVal: 5, label: "There is a recycling bin at my building, but it does not have enough space"}
  ]
  
  self.save = function(){
    var address = self.selectedAddress();
    var data = {'address': address.street, 'latitude': address.latLng.lat, 'longitude': address.latLng.lng, 'recyclingAvailable': self.recyclingAvailable};
    $.post('/reports.json', data)
      .done(function(response){
        $('.modal').modal('hide');
        self.modalMessage('Thanks for contributing!');
        $('#infoModal').modal('show');
      })
      .fail(function(){
        $('.modal').modal('hide');
        self.modalMessage('Failed to create your report, please try again');
        $('#infoModal').modal('show');
      })
    // here we will do some client-side validation
    // and then POST the values to the geocoding endpoint, etc.
    console.log(self.address() + ", " + self.zip());
  }

  self.selectAddress = function(address){
    self.selectedAddress(address);
    $('.modal').modal('hide');
    $('#getOnMapModal').modal('show');
  }

  self.clearSearchForm = function(){
    $('#searchForm input:text').val('');
  }

  self.search = function(report, event){
    var address = report.address();
    var zip = report.zip();
    var url = "geocode.json?address=" + address
    if(zip)
      url += "&zip=" + zip;

    $.get(url, function(response){
      if(response.length == 1){
        self.selectAddress(response[0]);
      } else if(response.length > 1) {
        self.possibleAddresses(response);
        $('.modal').modal('hide');
        $('#searchResultsModal').modal('show');
      } else {
        self.possibleAddresses([]);
        $('.modal').modal('hide');
        $('#searchResultsModal').modal('show');
      }
    })
  }

  self.startSearch = function(){
    $('.modal').modal('hide');
    self.clearSearchForm();
    self.selectedAddress('');
    self.possibleAddresses([]);

    $('#searchModal').modal('show');
  }

}

ko.applyBindings(new ReportViewModel());
