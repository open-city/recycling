function ReportViewModel() {
  var self = this;

  self.address = ko.observable('');
  self.zip = ko.observable('');
  self.selectedAddress = ko.observable('');
  self.possibleAddresses = ko.observable('');
  self.comment = ko.observable('');
  self.infoMessage = ko.observable('');
  self.buildingsFoundMessage = ko.observable('');
  self.reportCountForLocation = ko.observable(0);
  self.existingAddress = ko.observable('');

  self.getReportCountForAddressAndDisplayForm = function(address){
    var latitude = address.geometry.location.lat;
    var longitude = address.geometry.location.lng;
    $.get('/locations.json?latitude=' + latitude + '&longitude=' + longitude)
      .done(function(response){
        if(response.locations && response.locations.length >= 1){
          var loc = response['locations'][0];
          self.reportCountForLocation(loc.reports.length);
          $('.side-content').hide();
          $('#getOnMap').show();
        } else {
          $('.side-content').hide();
          $('#getOnMapFirst').show();
        }
      })
      .fail(function(response){
        console.log("Errored while looking for an existing location");
      })
  }

  self.save = function(){
    var address = self.selectedAddress();
    var formatted_address = address.address_components[0].long_name + " " + address.address_components[1].short_name
    var zip = address.address_components[7].long_name
    var data = {
      'address': formatted_address,
      'zip': zip,
      'latitude': address.geometry.location.lat,
      'longitude': address.geometry.location.lng,
      'comment': self.comment()
    };
    
    $.post('/reports.json', data)
      .done(function(response){
        $('.side-content').hide();
        self.infoMessage('Thank you for your report!');
        $('#infoContent').show();
      })
      .fail(function(){
        $('.side-content').hide();
        self.infoMessage('Failed to create your report, please try again');
        $('#infoContent').show();
    })
    // here we will do some client-side validation
    // and then POST the values to the geocoding endpoint, etc.
  }

  self.selectAddress = function(address){
    self.selectedAddress(address);
    self.getReportCountForAddressAndDisplayForm(address);
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
      } else {
        self.possibleAddresses(response || []);
        self.buildingsFoundMessage(response.length + " buildings found");
        $('.side-content').hide();
        $('#searchForm').show();
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
