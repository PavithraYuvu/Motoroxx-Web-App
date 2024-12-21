import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrl: './jobcard.component.scss'
})
export class JobcardComponent implements OnInit {

  jobcardobj = {
    mobile: "",
    name: "",
  }

  vehiclenumber = {
    vehicleState: "TN",
    vehicleDistrict: "",
    vehicleCity: "",
    vehicleNumber: ""
  }

  modelcolor: any = "";

  location: any = ""
  odoMeter: boolean = false;


  isChecked: boolean = true;
  generalService: boolean = false;



  newComplaint: any;

  adddedComplaints: any[] = [];


  // locationOptions = [
  //   'Velachery',
  //    'Tambaram', 
  //    'Ramapuram'
  //   ]

  listColors = [
    'Blue',
    'Black',
    'Green',
    'Grey',
    'Orange',
    'Pink',
    'Red',
    'White',
    'Yellow'
  ];

  singlebrand: boolean = false;
  garage_brandtype: any;
  selectedBrandName: any;
  branddata_full: any;
  seletedbrand_model: any;
  branddata: any[] = [];
  selectedmodelname: any;
  showmodelDropdown: boolean;
  showDropdown: boolean;
  vehcilehistorydata: any;
  selectedvehcileid: any;
  selectedModelpackage: any;
  odometerreading: any = "";
  complaintsarray_db: any = [];
  typeofservice: any;
  formattedComplaintsstringy: string;
  remarks: any = "";
  inventory_things: boolean = false;
  addmodelpopup: any;
  addmodel: any;
  vehiclehistory_popup: any;
  locationOptions: any;
  showDropdownlocation: boolean;
  showlocationdropdown: boolean;
  genralservice_boolean: boolean = false;
  carddata_fortable: any = [];
  carddata_forcomplaints: any = [];
  vehicleId: string = ''; // To store vehicle number

  bikebrandfor_slider: any;
  bikemodelfor_slider: any;
  vehicleNumberfor_slider: any;
  invoiceNum: any;
  invoiceDate: any;
  invoiceAmount: any;
  index_veh_data: any = [];
  index_for_slider: any = 0;
  // popupData: any = null;     // Store the data for the vehicle being hovered
  // selectedVehicleData: any = null; // Variable to store the selected vehicle data


  constructor(private LocalStoreService: LocalStoreService, private ngbModel: NgbModal, private toastr: ToastrService) {


  }




  ngOnInit(): void {

    console.log("the data inside the vehcile id", this.selectedvehcileid)

    this.onintbranchdata()
    this.getBrands()
    this.getlocation()
  }


  selectLocation(option: string) {
    this.location = option;
    console.log(option);
    this.showlocationdropdown = !this.showlocationdropdown;

  }

  generateCID() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let cid = "";

    // Create 4 random groups of 4 characters
    for (let i = 0; i < 4; i++) {
      let segment = "";
      for (let j = 0; j < 4; j++) {
        segment += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      cid += segment + (i < 3 ? "-" : ""); // Add a dash between groups
    }

    return cid;
  }


  addComplaint() {
    if (!this.newComplaint.trim()) {
      alert('Please enter a complaint.');
      return;
    }
    this.adddedComplaints.unshift(this.newComplaint.trim());
    console.log("the data iniside the", this.adddedComplaints)

    const formattedComplaints = [];

    this.adddedComplaints.forEach((complaint, index) => {
      const complaintObject = {
        c_id: this.generateCID(),
        [`complaint ${index + 1}`]: complaint,
        value: complaint
      };
      formattedComplaints.push(complaintObject);

      this.formattedComplaintsstringy = JSON.stringify(formattedComplaints)

    });
    this.newComplaint = '';
  }

  removeComplaint(index: number) {
    this.adddedComplaints.splice(index, 1);
  }


  isClicked: string | null = null;

  onButtonClick(button: string) {
    this.isClicked = button;  // Set the clicked button ('GSP' or 'BSP')
    console.log(button);
  }


  fuelLevel: number = 0;

  fuelAmount: number = 0;
  // slidervalue: number = 50;
  calculateFuel(value: number) {
    console.log(`Fuel Amount: ${value}%`);

  }

  savejobcard() {


    console.log('the data inside the ', this.vehiclenumber.vehicleCity)

    let vh_number =
      (this.vehiclenumber.vehicleState || "") +
      "-" +
      (this.vehiclenumber.vehicleDistrict || "") +
      "-" +
      (this.vehiclenumber.vehicleCity || "") +
      "-" +
      (this.vehiclenumber.vehicleNumber || "");


    console.log('the data inside the merged vh number ', vh_number)
    console.log('the data inside the merged model ', this.selectedBrandName)
    console.log('the data inside the merged brand ', this.selectedmodelname)
    console.log('the data inside the  brand color', this.modelcolor)
    console.log("the odometer reading", this.odoMeter)



    let odometervalue
    if (this.odoMeter == true || this.odometerreading == "") {
      odometervalue = "Odometer not working"
    } else {
      odometervalue = this.odometerreading
    }

    let genralservicecheck
    let gs_selected_option_index
    if (this.generalService == true) {
      genralservicecheck = "1"
      gs_selected_option_index = "0"
    } else {
      genralservicecheck = "0"
      gs_selected_option_index = "0"

    }

    const brandData = this.branddata_full[this.selectedBrandName];

    this.selectedModelpackage = brandData.bikespackage.find(
      (bike) => bike.bikename.toLowerCase() === this.selectedmodelname.toLowerCase()
    );

    let selectedamount = this.selectedModelpackage.gsp.offerselectedvalue

    const gs_selected_amount = `${selectedamount}, GSP`;



    // return
    this.LocalStoreService.postcustomer(this.jobcardobj, this.location).subscribe(async (customerdata) => {

      console.log("the full data of the customer", customerdata)
      let userid = customerdata.userid

      this.LocalStoreService.addvehicle(userid, this.jobcardobj, vh_number, this.selectedBrandName, this.selectedmodelname, this.vehiclenumber, this.modelcolor, this.selectedvehcileid, this.selectedModelpackage).subscribe(vehciledata => {

        console.log("the addvehicle vehcile data", vehciledata)

        this.LocalStoreService.addjobcard(vehciledata._id, odometervalue, this.fuelAmount, genralservicecheck, this.selectedModelpackage, this.formattedComplaintsstringy,
          this.jobcardobj.mobile, userid, this.remarks, gs_selected_option_index, gs_selected_amount
        ).subscribe(jobcarddata => {

          this.toastr.success('jobcard added sucessfully!', 'Success!', { timeOut: 3000 });

          this.jobcardobj.mobile = "",
            this.jobcardobj.name = "",
            this.location = "",
            this.vehiclenumber.vehicleState = ""
          this.vehiclenumber.vehicleDistrict = ""
          this.vehiclenumber.vehicleCity = ""
          this.vehiclenumber.vehicleNumber = ""
          // this.selectedBrandName = "",
          this.selectedmodelname = "",
            this.modelcolor = "",
            this.odometerreading = "",
            this.generalService = false,
            this.remarks = "",
            this.adddedComplaints = []







        })
      })
    })
  }


  onintbranchdata() {

    this.LocalStoreService.getbranchbybranchidid().subscribe(data => {
      this.typeofservice = data.response[0].service
      this.genralservice_boolean = data.response[0].genralservice
      if (data.response[0].single_brand) {
        this.singlebrand = data.response[0].single_brand
        this.garage_brandtype = data.response[0].brand

      } else {
        this.singlebrand = false
      }

    })
  }


  getBrands() {

    this.LocalStoreService.get_brandmodel_forinventory().subscribe(data => {

      if (this.singlebrand == true) {

        this.selectedBrandName = this.garage_brandtype

        this.branddata_full = data.response.vehicles[0]
        console.log("the data inside the branddata for inventory full models package", this.branddata_full)

        this.seletedbrand_model = this.branddata_full[this.selectedBrandName].bikespackage;

        console.log("the data inside the branddata for inventory in jobcardpage ", this.seletedbrand_model)

        this.branddata = Object.keys(this.branddata_full).filter(key => key !== '_id' && key !== 'branch_id' && key !== '__v');

      } else {
        this.branddata_full = data.response.vehicles[0]

        console.log("the data inside the branddata for inventory ", this.branddata_full)

        this.branddata = Object.keys(this.branddata_full).filter(key => key !== '_id' && key !== 'branch_id' && key !== '__v');

      }
    })
  }

  selectmodel(model) {
    // this.inputmodelArray.model = model.bikename;
    // this.inputcategoryArray.categoryId = category._id;
    this.selectedmodelname = model.bikename;
    // this.filteredCategoryData = [];    


    const brandData = this.branddata_full[this.selectedBrandName];

    this.selectedModelpackage = brandData.bikespackage.find(
      (bike) => bike.bikename.toLowerCase() === this.selectedmodelname.toLowerCase()
    );

    console.log("the data iniside the selected model package", this.selectedModelpackage)

  }

  hidemodelDropdown() {
    setTimeout(() => this.showmodelDropdown = false, 400);
  }

  hidebrandDropdown() {
    setTimeout(() => this.showDropdown = false, 400);
  }

  selectBrand(brand) {

    this.selectedBrandName = brand;
    console.log("the data inside the brand in select brand", brand)

    this.seletedbrand_model = this.branddata_full[this.selectedBrandName].bikespackage;

  }


  checkvehicles(vehiclehistorypage) {

    console.log("the data inisde the checkvehciles history", this.jobcardobj.mobile.length)

    if (this.jobcardobj.mobile.length > 9) {
      this.LocalStoreService.checkvehicles(this.jobcardobj.mobile).subscribe(data => {


        this.vehcilehistorydata = data.response
        console.log('testing:', this.vehcilehistorydata);

        this.vehcilehistorydata.forEach(data => {
          data.customer_vehicles.jobcard_details.forEach(data2 => {
            console.log("jobcardId:", data2.vehicle_id);
            if (data2.invoice) {
              console.log("the data inside the first loop", data2.invoice.date)

              console.log("the data inside the first loop", data2.invoice.invoice_amount)
            }
          })
        })

        if (data.status == "1")
          this.vehiclehistory_popup = this.ngbModel.open(vehiclehistorypage, {
            size: 'xl',
          })
        console.log("the data inisde the checkvehciles history", data)
      })
    }
  }
  // by pavi written a showPopup and hidePopup function
  // showPopup(data: any): void {
  //   console.log("the set of data:", data);
  //   this.popupData = data;
  //   console.log("checkdata:", this.popupData);
  // }
  // Hide the popup when mouse leaves the card
  // hidePopup(): void {
  //   this.popupData = null;
  // }
  isSidebarOpen = false;

  toggleSidebar(jobcarddata, vehciledata, i) {

    console.log("ddddddddddd:", vehciledata)
    console.log("ddddddddddd jobdata:", jobcarddata)

    this.index_veh_data = vehciledata
    this.index_for_slider = i
    console.log("ddddddddddd jobdata:", this.index_for_slider)
    //  let indexdata = vehciledata.customer_vehicles.jobcard_details[i+1]
    //  console.log("the data of the indexpointer",indexdata)

    this.bikebrandfor_slider = vehciledata.customer_vehicles.brand
    this.bikemodelfor_slider = vehciledata.customer_vehicles.model
    this.vehicleNumberfor_slider = vehciledata.customer_vehicles.vh_number
    this.invoiceNum = jobcarddata.invoice.invoice_reference_number
    this.invoiceDate = jobcarddata.invoice.date
    this.invoiceAmount = jobcarddata.invoice.invoice_amount
    this.vehicleId = ''
    this.carddata_fortable = []
    this.carddata_forcomplaints = []
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log("the data inside the card", jobcarddata)

    if (jobcarddata.invoice) {
      if (jobcarddata.invoice.all_spares.length > 0) {
        this.carddata_fortable = jobcarddata.invoice.all_spares
      }
    }
    if (jobcarddata.complaints.length > 0) {
      this.carddata_forcomplaints = jobcarddata.complaints

    }
    this.remarks = jobcarddata.remarks || 'No Remarks';
  }

  rightaerrow() {

    this.index_veh_data
    this.index_for_slider
    let jobcardlength = this.index_veh_data.customer_vehicles.jobcard_details.length

    console.log("the data inisde the legth of jobcard", jobcardlength)
    console.log("the data inisde the legth of jobcard", this.index_for_slider)
    let jobcarddata

    jobcarddata = this.index_veh_data.customer_vehicles.jobcard_details[this.index_for_slider + 1]

    if (this.index_for_slider < jobcardlength) {
      this.index_for_slider++

    }

    if (this.index_for_slider < jobcardlength) {
      
      this.carddata_fortable = []
      this.carddata_forcomplaints = []
      this.bikebrandfor_slider = this.index_veh_data.customer_vehicles.brand
      this.bikemodelfor_slider = this.index_veh_data.customer_vehicles.model
      this.vehicleNumberfor_slider = this.index_veh_data.customer_vehicles.vh_number
      this.invoiceNum = jobcarddata.invoice.invoice_reference_number
      this.invoiceDate = jobcarddata.invoice.date
      this.invoiceAmount = jobcarddata.invoice.invoice_amount
      this.vehicleId = ''

      if (jobcarddata.invoice) {
        if (jobcarddata.invoice.all_spares.length > 0) {
          this.carddata_fortable = jobcarddata.invoice.all_spares
        }
      }
      if (jobcarddata.complaints.length > 0) {
        this.carddata_forcomplaints = jobcarddata.complaints

      }
      this.remarks = jobcarddata.remarks || 'No Remarks';
      //  console.log("the data of the indexpointer",indexdata)
      console.log("rightaerrow")
    }
  }

  leftaerrow() {

    if(this.index_for_slider != 0){
      this.carddata_fortable = []
      this.carddata_forcomplaints = []
      this.index_veh_data
      this.index_for_slider
      let jobcarddata = this.index_veh_data.customer_vehicles.jobcard_details[this.index_for_slider - 1]
      this.index_for_slider--
      
      
      this.bikebrandfor_slider = this.index_veh_data.customer_vehicles.brand
      this.bikemodelfor_slider = this.index_veh_data.customer_vehicles.model
      this.vehicleNumberfor_slider = this.index_veh_data.customer_vehicles.vh_number
      this.invoiceNum = jobcarddata.invoice.invoice_reference_number
      this.invoiceDate = jobcarddata.invoice.date
      this.invoiceAmount = jobcarddata.invoice.invoice_amount
      this.vehicleId = ''
  
      if (jobcarddata.invoice) {
        if (jobcarddata.invoice.all_spares.length > 0) {
          this.carddata_fortable = jobcarddata.invoice.all_spares
        }
      }
      if (jobcarddata.complaints.length > 0) {
        this.carddata_forcomplaints = jobcarddata.complaints
      }
      this.remarks = jobcarddata.remarks || 'No Remarks';
      
    }

  }


  getComplaint(data: any): string {
    // Fetch the key dynamically that starts with 'complaint'
    const complaintKey = Object.keys(data).find(key => key.includes('complaint'));
    return complaintKey ? data[complaintKey] : 'No complaint';
  }





  onSelectVehicle(selectedVehicleId: string) {
    console.log("Selected Vehicle ID:", selectedVehicleId);

    this.vehcilehistorydata.forEach((data) => {
      if (data.customer_vehicles._id === selectedVehicleId) {
        console.log("Matched Vehicle:", data);

        this.jobcardobj.name = data.name;
        this.location = data.address
        this.selectedvehcileid = data.customer_vehicles._id
        this.vehiclenumber.vehicleState = data.customer_vehicles.vehiclenumber.vehicleState;
        this.vehiclenumber.vehicleDistrict = data.customer_vehicles.vehiclenumber.vehicleDistrict;
        this.vehiclenumber.vehicleCity = data.customer_vehicles.vehiclenumber.vehicleCity;
        this.vehiclenumber.vehicleNumber = data.customer_vehicles.vehiclenumber.vehicleNumber;
        this.modelcolor = data.customer_vehicles.color;
        this.selectedBrandName = data.customer_vehicles.brand;
        this.selectedmodelname = data.customer_vehicles.model;


      }
    });

    this.vehiclehistorypopup_close()
  }


  // sliderValue: number = 50; 
  // fuelAmount: number = 0.050;
  sliderValue: number = 0;

  updateFuelAmount(event: any): void {
    this.sliderValue = event.target.value;
    const minFuelAmount = 0.001;
    const maxFuelAmount = 1.0;
    this.fuelAmount = minFuelAmount + (this.sliderValue / 100) * (maxFuelAmount - minFuelAmount);
  }

  // updateFuelAmount(event: any): void {
  //   this.sliderValue = event.target.value;
  //   this.fuelAmount = (this.sliderValue / 100) * 20; 
  // }

  addmodelpopup_close() {

    this.addmodelpopup.close()

  }


  openmodelpopup(modelpage) {
    this.inventory_things = false
    this.addmodelpopup = this.ngbModel.open(modelpage, {
    })
  }

  savemodel() {
    let process = "checkmodel"
    // let selectedbrand = ""
    this.LocalStoreService.checkinventorydataexist(process, this.addmodel, this.selectedBrandName).subscribe(data => {
      if (data.response == true) {
        this.inventory_things = true
      }
      if (data.response != true) {

        let flag = "addmodel"

        this.LocalStoreService.brandsave(this.selectedBrandName, flag, this.addmodel).subscribe(data => {
          this.addmodel = ""
          this.inventory_things = false
          this.addmodelpopup.close()
          // this.selectBrand(this.selectedBrandName)



        })
      }

    })
  }

  vehiclehistorypopup_close() {

    this.vehiclehistory_popup.close()

  }

  addanother_vehicle() {

    this.vehcilehistorydata.forEach((data) => {
      console.log("Matched Vehicle:", data);

      this.jobcardobj.name = data.name;

      this.vehiclehistory_popup.close()
    });

  }

  getlocation() {
    this.LocalStoreService.getlocations().subscribe(data => {

      this.locationOptions = data.response['locations']

      console.log("the data inside the location option", this.locationOptions)

    })
  }


  hidlocationDropdown() {

    setTimeout(() => this.showlocationdropdown = false, 400);

  }


  toggleLocationDropdown() {
    this.showlocationdropdown = !this.showlocationdropdown;
  }

  clearall() {

    this.selectedvehcileid = ""
    this.jobcardobj.mobile = "",
      this.jobcardobj.name = "",
      this.location = "",
      // this.vehiclenumber.vehicleState = ""
      this.vehiclenumber.vehicleDistrict = ""
    this.vehiclenumber.vehicleCity = ""
    this.vehiclenumber.vehicleNumber = ""
    // this.selectedBrandName = "",
    // this.selectedmodelname = "",
    this.modelcolor = "",
      this.odometerreading = "",
      this.generalService = false,
      this.remarks = "",
      this.adddedComplaints = []



  }





}
