sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/IntervalTrigger",
    "sap/m/MessageBox",
    'sap/ui/comp/navpopover/LinkData',
    "sap/ui/model/Sorter",
    "sap/ui/core/dnd/DragInfo",
    "sap/f/dnd/GridDropInfo",
    "sap/ui/core/library",
    'sap/ui/core/Title',
    'sap/ui/layout/form/SimpleForm',
    'sap/m/Image',
    'sap/m/Text',
    'sap/m/FlexItemData',
    'sap/m/MessageToast',
    'sap/ui/comp/smartvariants/SmartVariantManagement',
    'sap/ui/comp/smartvariants/PersonalizableInfo'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, IntervalTrigger, MessageBox, LinkData, Sorter, DragInfo, GridDropInfo, coreLibrary, Title, SimpleForm, Image, Text, FlexItemData, MessageToast, SmartVariantManagement, PersonalizableInfo ) {
        "use strict";


        // shortcut for sap.ui.core.dnd.DropLayout
        let DropLayout = coreLibrary.dnd.DropLayout;

        // shortcut for sap.ui.core.dnd.DropPosition
        let DropPosition = coreLibrary.dnd.DropPosition;

        let Drag = false;

        return Controller.extend("sapxpsp.app.envirodash.controller.Main", {
            
          
          
          onInit: function () {

               // let oPersInfo = new PersonalizableInfo({
               //   type: "control",                            //specific to the control: already used: filterbar/table/chart
               //   keyName: "PageVariantPKey",                //nedded as property
                //dataSource: this.getEntityType(),          // not really required; convenient
               //   control: this                              // the SmartChart, or ...
               // });

               // let oSmartVariantManagement = new SmartVariantManagement;

               // oSmartVariantManagement.addPersonalizableControl(oPersInfo);


                this._intervalTrigger = new IntervalTrigger(0);

                var oGrid = this.byId("grid1");

                oGrid.addDragDropConfig(new DragInfo({
                  sourceAggregation: "items"
                }));

                oGrid.addDragDropConfig(new GridDropInfo({
                  targetAggregation: "items",
                  dropPosition: DropPosition.Between,
                  dropLayout: DropLayout.Horizontal,
                  drop: function (oInfo) {
                    var oDragged = oInfo.getParameter("draggedControl"),
                      oDropped = oInfo.getParameter("droppedControl"),
                      sInsertPosition = oInfo.getParameter("dropPosition"),
                      iDragPosition = oGrid.indexOfItem(oDragged),
                      iDropPosition = oGrid.indexOfItem(oDropped);
          
                    oGrid.removeItem(oDragged);
          
                    if (iDragPosition < iDropPosition) {
                      iDropPosition--;
                    }
          
                    if (sInsertPosition === "After") {
                      iDropPosition++;
                    }
          
                    oGrid.insertItem(oDragged, iDropPosition);
                    Drag = true
                    this.updateValues();
                    oGrid.focusItem(iDropPosition);
                  }.bind(this)
                }));

                /*Smart chart
                //set maxHeight for categoryAxis in order to allow longer labels being fully displayed 
                oSmartChart.attachInitialise(function(){
                  oSmartChart.getChart().setVizProperties({categoryAxis:{layout:{maxHeight:0.8}}});
                });
                
                */
                this.oSmartChart = this.getView().byId("smartChartParticulate");        
                this.oSmartChart.attachInitialized(function(oControlEvent){
                  this.oSmartChart.getChartAsync().then(function(oInnerChart){
                    oInnerChart.setVizProperties(
                      { 
                        layout: {
                           maxHeight:0.7
                        },
                        plotArea: {
                          dataLabel: {
                            visible: true
                          }
                        }
                      }
                    );
                  });
                }.bind(this)
                );
                
//oSmartChart.setModel(this.getView().getModel("catalog"));
            },
            onAfterRendering: function() {
                
                
                this._gaugeTemp =  new JustGage({
                    id: this.getView().byId("id_GaugeTemp").sId,
                    value: 25,
                    min: 0,
                    max: 65,
                    customSectors: [{
                        color : "#6495ed", 
                        lo : 0,
                        hi : 15
                      },{
                        color : "#00bfff",
                        lo : 15,
                        hi : 20
                      },{
                        color : "#008b8b",
                        lo : 20,
                        hi : 24
                      },{
                        color : "#ffd700",
                        lo : 24,
                        hi : 27
                      },{
                        color : "#ff8c00",
                        lo : 27,
                        hi : 30
                      },{
                        color : "#cd5c5c",
                        lo : 30,
                        hi : 65
                      }],
                    //title: this.getResourceBundle().getText("tempTitle"),
                    label: this.getResourceBundle().getText("tempLabel"),
                    relativeGaugeSize: true,
                    //titlePosition: "below",
                    shadowOpacity: 1,
                    shadowSize: 5,
                    shadowVerticalOffset: 10,
                    view: this.getView(),
                 
                });

                this._gaugeHum = new JustGage({
                    id: this.getView().byId("id_GaugeHum").sId,
                    value: 60,
                    min: 0,
                    max: 100,
                    customSectors: [{
                        color : "#cd5c5c", 
                        lo : 0,
                        hi : 20
                      },{
                        color : "#ff8c00",
                        lo : 20,
                        hi : 30
                      },{
                        color : "#ffd700",
                        lo : 30,
                        hi : 40
                      },{
                        color : "#008b8b",
                        lo : 40,
                        hi : 60
                      },{
                        color : "#00bfff",
                        lo : 60,
                        hi : 80
                      },{
                        color : "#6495ed",
                        lo : 80,
                        hi : 100
                      }],
                    //title: this.getResourceBundle().getText("humTitle"),
                    label: this.getResourceBundle().getText("humLabel"),
                    relativeGaugeSize: true,
                    //titlePosition: "below",
                    shadowOpacity: 1,
                    shadowSize: 5,
                    shadowVerticalOffset: 10,
                    view: this.getView(),
                    //size: 900
                });

                this._gaugeLux = new JustGage({
                    id: this.getView().byId("id_GaugeLux").sId,
                    value: 10,
                    min: 0,
                    max: 1500,
                    customSectors: [{
                        color : "#000000",
                        lo : 0,
                        hi : 50
                      },{
                        color : "#696969",
                        lo : 50,
                        hi : 100
                      },{
                        color : "#a9a9a9 ",
                        lo : 100,
                        hi : 500
                      },{
                        color : "#d3d3d3",
                        lo : 500,
                        hi : 750
                      },{
                        color : "#f0ffff",
                        lo : 750,
                        hi : 1000
                      },{
                        color : "#ffffff",
                        lo : 1000,
                        hi : 1500
                      }],
                    //title: this.getResourceBundle().getText("luxTitle"),
                    label: this.getResourceBundle().getText("luxLabel"),
                    relativeGaugeSize: true,
                    shadowOpacity: 1,
                    shadowSize: 5,
                    shadowVerticalOffset: 10,
                    view: this.getView(),
                    //size: 900
                });
                /*
                this._gaugeNoise =  new JustGage({
                  id: this.getView().byId("id_GaugeNoise").sId,
                  value: 40,
                  min: 0,
                  max: 120,
                  customSectors: [{
                      color : "#6495ed", 
                      lo : 40,
                      hi : 50
                    },{
                      color : "#00bfff",
                      lo : 50,
                      hi : 60
                    },{
                      color : "#008b8b",
                      lo : 50,
                      hi : 70
                    },{
                      color : "#ffd700",
                      hi : 90
                    },{
                      color : "#ff8c00",
                      lo : 90,
                      hi : 100
                    },{
                      color : "#cd5c5c",
                      lo : 100,
                      hi : 120
                    }],
                  //title: this.getResourceBundle().getText("tempTitle"),
                  label: this.getResourceBundle().getText("noiseLabel"),
                  relativeGaugeSize: true,
                  //titlePosition: "below",
                  shadowOpacity: 1,
                  shadowSize: 5,
                  shadowVerticalOffset: 10,
                  view: this.getView(),
               
                });
                */
                this._gaugePressure = new JustGage({
                    id: this.getView().byId("id_GaugePressure").sId,
                    value: 1000,
                    min: 800,
                    max: 1200,
                    //title: this.getResourceBundle().getText("pressureTitle"),
                    label: this.getResourceBundle().getText("pressureLabel"),
                    relativeGaugeSize: true,
                    shadowOpacity: 1,
                    shadowSize: 5,
                    shadowVerticalOffset: 10,
                    view: this.getView(),
                    //size: 900
                });

                this._gaugeGas = new JustGage({
                  id: this.getView().byId("id_GaugeGas").sId,
                  value: 300000,
                  min: 7500,
                  max: 525000,
                  customSectors: [{
                      color : "#cd5c5c", 
                      lo : 7500,
                      hi : 15000
                    },{
                      color : "#ff8c00",
                      lo : 15000,
                      hi : 40000
                    },{
                      color : "#ffd700",
                      lo : 40000,
                      hi : 75000
                    },{
                      color : "#008b8b",
                      lo : 75000,
                      hi : 125000
                    },{
                      color : "#00bfff",
                      lo : 125000,
                      hi : 250000
                    },{
                      color : "#6495ed",
                      lo : 250000,
                      hi : 525000
                    }
                  ],
                  humanFriendly : true,
                  reverse: true,
                  //title: this.getResourceBundle().getText("gasTitle"),
                  label: this.getResourceBundle().getText("gasLabel"),
                  relativeGaugeSize: true,
                  shadowOpacity: 1,
                  shadowSize: 5,
                  shadowVerticalOffset: 10,
                  view: this.getView(),
                  //size: 900
              });
              this._gaugeIaq = new JustGage({
                id: this.getView().byId("id_GaugeIaq").sId,
                value: 15,
                min: 0,
                max: 500,
                customSectors: [{
                    color : "#6495ed", 
                    lo : 0,
                    hi : 15
                  },{
                    color : "#00bfff",
                    lo : 15,
                    hi : 100
                  },{
                    color : "#008b8b",
                    lo : 100,
                    hi : 200
                  },{
                    color : "#ffd700",
                    lo : 200,
                    hi : 300
                  },{
                    color : "#ff8c00",
                    lo : 300,
                    hi : 400
                  },{
                    color : "#cd5c5c",
                    lo : 400,
                    hi : 500
                  }
                ],
                humanFriendly : true,
                reverse: true,
                //title: this.getResourceBundle().getText("gasTitle"),
                label: this.getResourceBundle().getText("iaqLabel"),
                relativeGaugeSize: true,
                shadowOpacity: 1,
                shadowSize: 5,
                shadowVerticalOffset: 10,
                view: this.getView(),
                //size: 900
              });

              this._intervalTrigger.addListener(function(){
                  this.updateValues();
              }.bind(this))
                
              this._intervalTrigger.setInterval(30000);
            },  
            updateValues : function () {
                this.oSmartChart.getModel().refresh(true);

                this.getView().getModel().read("/ambientalIOT", {
                    sorters: [
                      new Sorter("timestamp", true) // "Sorter" required from "sap/ui/model/Sorter"
                    ],
                    urlParameters: {
                      //"$select": "ProductID",
                      "$top": 1,
                    },
                    success: function (oData) {
                      if (Drag) {
                        Drag = false
                        this._gaugeTemp =  new JustGage({
                          id: this.getView().byId("id_GaugeTemp").sId,
                          value: oData.results[0].temp,
                          min: 0,
                          max: 65,
                          customSectors: [{
                              color : "#6495ed", 
                              lo : 0,
                              hi : 15
                            },{
                              color : "#00bfff",
                              lo : 15,
                              hi : 20
                            },{
                              color : "#008b8b",
                              lo : 20,
                              hi : 24
                            },{
                              color : "#ffd700",
                              lo : 24,
                              hi : 27
                            },{
                              color : "#ff8c00",
                              lo : 27,
                              hi : 30
                            },{
                              color : "#cd5c5c",
                              lo : 30,
                              hi : 65
                            }],
                          //title: this.getResourceBundle().getText("tempTitle"),
                          label: this.getResourceBundle().getText("tempLabel"),
                          relativeGaugeSize: true,
                          //titlePosition: "below",
                          shadowOpacity: 1,
                          shadowSize: 5,
                          shadowVerticalOffset: 10,
                          view: this.getView(),
                       
                        });
      
                        this._gaugeHum = new JustGage({
                          id: this.getView().byId("id_GaugeHum").sId,
                          value: oData.results[0].hum,
                          min: 0,
                          max: 100,
                          customSectors: [{
                              color : "#cd5c5c", 
                              lo : 0,
                              hi : 20
                            },{
                              color : "#ff8c00",
                              lo : 20,
                              hi : 30
                            },{
                              color : "#ffd700",
                              lo : 30,
                              hi : 40
                            },{
                              color : "#008b8b",
                              lo : 40,
                              hi : 60
                            },{
                              color : "#00bfff",
                              lo : 60,
                              hi : 80
                            },{
                              color : "#6495ed",
                              lo : 80,
                              hi : 100
                            }],
                          //title: this.getResourceBundle().getText("humTitle"),
                          label: this.getResourceBundle().getText("humLabel"),
                          relativeGaugeSize: true,
                          //titlePosition: "below",
                          shadowOpacity: 1,
                          shadowSize: 5,
                          shadowVerticalOffset: 10,
                          view: this.getView(),
                          //size: 900
                        });
                        /*
                        this._gaugeNoise =  new JustGage({
                          id: this.getView().byId("id_GaugeNoise").sId,
                          value: oData.results[0].temp,
                          min: 0,
                          max: 120,
                          customSectors: [{
                              color : "#6495ed", 
                              lo : 40,
                              hi : 50
                            },{
                              color : "#00bfff",
                              lo : 50,
                              hi : 60
                            },{
                              color : "#008b8b",
                              lo : 50,
                              hi : 70
                            },{
                              color : "#ffd700",
                              lo : 70,
                              hi : 90
                            },{
                              color : "#ff8c00",
                              lo : 90,
                              hi : 100
                            },{
                              color : "#cd5c5c",
                              lo : 100,
                              hi : 120
                            }],
                          //title: this.getResourceBundle().getText("tempTitle"),
                          label: this.getResourceBundle().getText("noiseLabel"),
                          relativeGaugeSize: true,
                          //titlePosition: "below",
                          shadowOpacity: 1,
                          shadowSize: 5,
                          shadowVerticalOffset: 10,
                          view: this.getView(),
                       
                        });
                        */
                        this._gaugeLux = new JustGage({
                          id: this.getView().byId("id_GaugeLux").sId,
                          value: oData.results[0].lux,
                          min: 0,
                          max: 1500,
                          customSectors: [{
                              color : "#000000",
                              lo : 0,
                              hi : 50
                            },{
                              color : "#696969",
                              lo : 50,
                              hi : 100
                            },{
                              color : "#a9a9a9 ",
                              lo : 100,
                              hi : 500
                            },{
                              color : "#d3d3d3",
                              lo : 500,
                              hi : 750
                            },{
                              color : "#f0ffff",
                              lo : 750,
                              hi : 1000
                            },{
                              color : "#ffffff",
                              lo : 1000,
                              hi : 1500
                            }],
                          //title: this.getResourceBundle().getText("luxTitle"),
                          label: this.getResourceBundle().getText("luxLabel"),
                          relativeGaugeSize: true,
                          shadowOpacity: 1,
                          shadowSize: 5,
                          shadowVerticalOffset: 10,
                          view: this.getView(),
                          //size: 900
                        });
      
                        this._gaugePressure = new JustGage({
                          id: this.getView().byId("id_GaugePressure").sId,
                          value: oData.results[0].pressure,
                          min: 800,
                          max: 1200,
                          //title: this.getResourceBundle().getText("pressureTitle"),
                          label: this.getResourceBundle().getText("pressureLabel"),
                          relativeGaugeSize: true,
                          shadowOpacity: 1,
                          shadowSize: 5,
                          shadowVerticalOffset: 10,
                          view: this.getView(),
                          //size: 900
                        });
      
                        this._gaugeGas = new JustGage({
                          id: this.getView().byId("id_GaugeGas").sId,
                          value: oData.results[0].gas,
                          min: 7500,
                          max: 525000,
                          customSectors: [{
                              color : "#cd5c5c", 
                              lo : 7500,
                              hi : 15000
                            },{
                              color : "#ff8c00",
                              lo : 15000,
                              hi : 40000
                            },{
                              color : "#ffd700",
                              lo : 40000,
                              hi : 75000
                            },{
                              color : "#008b8b",
                              lo : 75000,
                              hi : 125000
                            },{
                              color : "#00bfff",
                              lo : 125000,
                              hi : 250000
                            },{
                              color : "#6495ed",
                              lo : 250000,
                              hi : 525000
                            }
                          ],
                          humanFriendly : true,
                          reverse: true,
                          //title: this.getResourceBundle().getText("gasTitle"),
                          label: this.getResourceBundle().getText("gasLabel"),
                          relativeGaugeSize: true,
                          shadowOpacity: 1,
                          shadowSize: 5,
                          shadowVerticalOffset: 10,
                          view: this.getView(),
                          //size: 900
                        });
                        
                        this._gaugeIaq = new JustGage({
                          id: this.getView().byId("id_GaugeIaq").sId,
                          value: oData.results[0].iaq,
                          min: 0,
                          max: 500,
                          customSectors: [
                            {
                              color : "#6495ed", 
                              lo : 0,
                              hi : 15
                            },{
                              color : "#00bfff",
                              lo : 15,
                              hi : 100
                            },{
                              color : "#008b8b",
                              lo : 100,
                              hi : 200
                            },{
                              color : "#ffd700",
                              lo : 200,
                              hi : 300
                            },{
                              color : "#ff8c00",
                              lo : 300,
                              hi : 400
                            },{
                              color : "#cd5c5c",
                              lo : 400,
                              hi : 500
                            }
                          ],
                          humanFriendly : true,
                          reverse: true,
                          //title: this.getResourceBundle().getText("gasTitle"),
                          label: this.getResourceBundle().getText("iaqLabel"),
                          relativeGaugeSize: true,
                          shadowOpacity: 1,
                          shadowSize: 5,
                          shadowVerticalOffset: 10,
                          view: this.getView(),
                          //size: 900
                        });
                      } else {
                        this._gaugeTemp.refresh(oData.results[0].temp);
                        this._gaugeHum.refresh(oData.results[0].hum);
                        this._gaugeLux.refresh(oData.results[0].lux);
                        this._gaugeGas.refresh(oData.results[0].gas);
                        this._gaugeIaq.refresh(oData.results[0].iaq);
                        /*
                        this._gaugeNoise.refresh(oData.results[0].noise);
                        */
                        this._gaugePressure.refresh(oData.results[0].pressure);
                      }
                  
                    }.bind(this),
                    error: function (oError) {
                        //MessageBox.error(this.getResourceBundle().getText("errorLoadingData"));
                        MessageToast.show(this.getResourceBundle().getText("errorLoadingData"));
                    }.bind(this)
                });
                
            },
      
            
        

            /**
            * Getter for the resource bundle.
            * @public
            * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
            */
            getResourceBundle : function () {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            } });

            
    });
