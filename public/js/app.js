function ReportViewModel() {
  var self = this;
  
  self.address = ko.observable('');
  self.zip = ko.observable('');
  self.selectedAddress = ko.observable('');
  self.possibleAddresses = ko.observable('');
  self.recyclingAvailable = ko.observable('');
  self.infoMessage = ko.observable('');
  
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
        $('.side-content').hide();
        self.infoMessage('Thanks for contributing!');
        $('#infoContent').show();
      })
      .fail(function(){
        $('.side-content').hide();
        self.infoMessage('Failed to create your report, please try again');
        $('#infoContent').show();
      })
    // here we will do some client-side validation
    // and then POST the values to the geocoding endpoint, etc.
    console.log(self.address() + ", " + self.zip());
  }

  self.selectAddress = function(address){
    self.selectedAddress(address);
    $('.side-content').hide();
    $('#getOnMapForm').show();
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
      if(response.length == 1 && address){
        self.selectAddress(response[0]);
      } else if(response.length > 1) {
        self.possibleAddresses(response);
        $('.side-content').hide();
        $('#searchResultsForm').show();
      } else {
        self.possibleAddresses([]);
        $('.side-content').hide();
        $('#searchResultsForm').show();
      }
    })
  }

  self.startSearch = function(){
    $('.side-content').hide();
    self.clearSearchForm();
    self.selectedAddress('');
    self.possibleAddresses([]);

    $('#searchForm').show();
  }

}

ko.applyBindings(new ReportViewModel());
$('#searchForm').show();
