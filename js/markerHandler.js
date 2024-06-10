AFRAME.registerComponent("markerhandler", {
  init: async function () {
    this.el.addEventListener("markerFound", () => {
     console.log("marker is found");
     this.handleMarkerFound();
    });


    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });
  },

  handleMarkerFound: function (toyes, markerId) {

    var buttonDiv = document.getElementById("order-button")
    buttonDiv.style.display = "flex";

    var orderButton = document.getElementById("order-summary-button");
    var orderSummaryButton = document.getElementById("order-summary-button");

    orderButton.addEventListener("click",()=>{
      swal({
        icon:"",
        title:" ",
        timer:2000,
        buttons: false
      });
    });

    orderSummaryButton.addEventListener("click", ()=>{
      swal({
        icon: "warning",
        title:"Order Summary",
        text:"Work In Progress"
      });
    });
  },
  getOrderSummary: async function (uid) {
    return await firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then(doc => doc.data());
  },

  handleOrder: function (uid, toy) {
    // Reading current table order details
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        var details = doc.data();

        if (details["current_orders"][toy.id]) {
          // Increasing Current Quantity
          details["current_orders"][toy.id]["quantity"] += 1;

          //Calculating Subtotal of item
          var currentQuantity = details["current_orders"][toy.id]["quantity"];

          details["current_orders"][toy.id]["subtotal"] =
            currentQuantity * toy.price;
        } else {
          details["current_orders"][toy.id] = {
            item: toy.toy_name,
            price: toy.price,
            quantity: 1,
            subtotal: toy.price * 1
          };
        }

        details.total_bill += toy.price;

        //Updating db
        firebase
          .firestore()
          .collection("users")
          .doc(doc.id)
          .update(details);
      });
  },
  handleRatings: function (toy) {

    document.getElementById("rating-modal-div").style.display = "flex";
    document.getElementById("rating-input").value = "0";

    var saveRatingButton = document.getElementById("save-rating-button");
    saveRatingButton.addEventListener("click", () => {
      document.getElementById("rating-modal-div").style.display = "none";
      //Get the input value(Review & Rating)
      var rating = document.getElementById("rating-input").value;

      
      firebase
        .firestore()
        .collection("toys")
        .doc(toy.id)
        .update({
          rating: rating
        })
        .then(() => {
          swal({
            icon: "success",
            title: "Thanks For Rating!",
            text: "We Hope You Like Toy !!",
            timer: 2500,
            buttons: false
          });
        });
    });
    

    var currentOrders = Object.keys(orderSummary.current_orders);    

    if (currentOrders.length > 0 && currentOrders==dish.id) {
      
      // Close Modal
      document.getElementById("feedback-input").value = "";

      //Submit button click event

      saveRatingButton.addEventListener("click", () => {
        document.getElementById("rating-modal-div").style.display = "none";
        //Get the input value(Review & Rating)
        var rating = document.getElementById("rating-input").value;
        var feedback = document.getElementById("feedback-input").value;

        //Update db
        firebase
          .firestore()
          .collection("dishes")
          .doc(dish.id)
          .update({
            last_review: feedback,
            last_rating: rating
          })
          .then(() => {
            swal({
              icon: "success",
              title: "Thanks For Rating!",
              text: "We Hope You Like Dish !!",
              timer: 2500,
              buttons: false
            });
          });
      });
    } 
  },
});
