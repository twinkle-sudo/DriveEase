// ==========================================
// DRIVEEASE - CARS PAGE JAVASCRIPT
// ==========================================


// ==========================================
// GET ELEMENTS
// ==========================================

const searchInput = document.querySelector("#searchInput");
const fuelFilter = document.querySelector("#fuelFilter");
const seatFilter = document.querySelector("#seatFilter");
const priceFilter = document.querySelector("#priceFilter");

const carsGrid = document.querySelector("#carsGrid");
const carCount = document.querySelector("#carCount");

const cars = document.querySelectorAll(".listing-card");


// ==========================================
// CAR FILTERING
// ==========================================

function filterCars() {

    const searchValue =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const fuelValue =
        fuelFilter
            ? fuelFilter.value.toLowerCase()
            : "all";

    const seatValue =
        seatFilter
            ? seatFilter.value
            : "all";


    let visibleCars = [];


    cars.forEach(function (car) {

        const name =
            (car.dataset.name || "").toLowerCase();

        const fuel =
            (car.dataset.fuel || "").toLowerCase();

        const seats =
            car.dataset.seats || "";


        const matchesSearch =
            name.includes(searchValue);

        const matchesFuel =
            fuelValue === "all" ||
            fuel === fuelValue;

        const matchesSeats =
            seatValue === "all" ||
            seats === seatValue;


        if (
            matchesSearch &&
            matchesFuel &&
            matchesSeats
        ) {

            car.style.display = "";

            visibleCars.push(car);

        } else {

            car.style.display = "none";

        }

    });


    // Update car count

    if (carCount) {

        carCount.textContent =
            visibleCars.length + " cars found";

    }

}


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterCars
    );

}


// ==========================================
// FUEL FILTER
// ==========================================

if (fuelFilter) {

    fuelFilter.addEventListener(
        "change",
        filterCars
    );

}


// ==========================================
// SEAT FILTER
// ==========================================

if (seatFilter) {

    seatFilter.addEventListener(
        "change",
        filterCars
    );

}


// ==========================================
// PRICE SORTING
// ==========================================

if (priceFilter && carsGrid) {

    priceFilter.addEventListener(
        "change",
        function () {

            const cards =
                Array.from(
                    carsGrid.querySelectorAll(
                        ".listing-card"
                    )
                );


            if (priceFilter.value === "low") {

                cards.sort(function (a, b) {

                    return Number(a.dataset.price) -
                           Number(b.dataset.price);

                });

            }


            if (priceFilter.value === "high") {

                cards.sort(function (a, b) {

                    return Number(b.dataset.price) -
                           Number(a.dataset.price);

                });

            }


            cards.forEach(function (card) {

                carsGrid.appendChild(card);

            });


            filterCars();

        }
    );

}


// ==========================================
// INITIAL FILTER
// ==========================================

filterCars();


// ==========================================
// CAR DETAILS MODAL
// ==========================================

const carsModal =
    document.querySelector("#carsModal");

const carsModalClose =
    document.querySelector("#carsModalClose");

const modalImage =
    document.querySelector("#modalImage");

const modalName =
    document.querySelector("#modalName");

const modalFuel =
    document.querySelector("#modalFuel");

const modalSeats =
    document.querySelector("#modalSeats");

const modalPrice =
    document.querySelector("#modalPrice");

const modalStatus =
    document.querySelector("#modalStatus");

const modalBook =
    document.querySelector("#modalBook");


// ==========================================
// SELECTED CAR INFORMATION
// ==========================================

let selectedCarName = "";

let selectedCarPrice = 0;

let selectedCarId = null;


// ==========================================
// VIEW DETAILS BUTTONS
// ==========================================

const detailButtons =
    document.querySelectorAll(".listing-details");


detailButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const card =
                button.closest(".listing-card");


            if (!card) {
                return;
            }


            // Get car information

            selectedCarName =
                card.dataset.name ||
                "Selected Car";


            selectedCarPrice =
                Number(card.dataset.price) ||
                0;


            selectedCarId =
                card.dataset.id ||
                card.dataset.carId ||
                null;


            // Get image

            const image =
                card.querySelector("img");


            if (image && modalImage) {

                modalImage.src =
                    image.src;

                modalImage.alt =
                    selectedCarName;

            }


            // Set modal information

            if (modalName) {

                modalName.textContent =
                    selectedCarName;

            }


            if (modalFuel) {

                modalFuel.textContent =
                    "Fuel: " +
                    (card.dataset.fuel || "N/A");

            }


            if (modalSeats) {

                modalSeats.textContent =
                    "Seats: " +
                    (card.dataset.seats || "N/A");

            }


            if (modalPrice) {

                modalPrice.textContent =
                    "₹" +
                    selectedCarPrice.toLocaleString() +
                    " / day";

            }


            // Availability

            const availability =
                card.querySelector(
                    ".available, .unavailable, .availability"
                );


            if (availability && modalStatus) {

                modalStatus.textContent =
                    availability.textContent.trim();

                modalStatus.className =
                    availability.className;

            } else if (modalStatus) {

                modalStatus.textContent =
                    "Available";

            }


            // Open details modal

            if (carsModal) {

                carsModal.style.display =
                    "flex";

            }

        }
    );

});


// ==========================================
// CLOSE DETAILS MODAL
// ==========================================

if (carsModalClose && carsModal) {

    carsModalClose.addEventListener(
        "click",
        function () {

            carsModal.style.display =
                "none";

        }
    );

}


// ==========================================
// CLOSE DETAILS MODAL OUTSIDE
// ==========================================

if (carsModal) {

    carsModal.addEventListener(
        "click",
        function (event) {

            if (event.target === carsModal) {

                carsModal.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// BOOKING MODAL
// ==========================================

const bookingModal =
    document.querySelector("#bookingModal");

const bookingClose =
    document.querySelector("#bookingClose");

const bookingCarName =
    document.querySelector("#bookingCarName");

const pickupDate =
    document.querySelector("#pickupDate");

const returnDate =
    document.querySelector("#returnDate");

const rentalDays =
    document.querySelector("#rentalDays");

const totalPrice =
    document.querySelector("#totalPrice");

const bookingForm =
    document.querySelector("#bookingForm");


// ==========================================
// OPEN BOOKING MODAL
// ==========================================

if (modalBook) {

    modalBook.addEventListener(
        "click",
        function () {

            // Check availability

            if (
                modalStatus &&
                modalStatus.textContent
                    .toLowerCase()
                    .includes("unavailable")
            ) {

                alert(
                    "Sorry, this car is currently unavailable."
                );

                return;

            }


            // Check booking modal

            if (!bookingModal) {

                alert(
                    "Booking form could not be loaded."
                );

                return;

            }


            // Set selected car

            if (bookingCarName) {

                bookingCarName.textContent =
                    "Selected Car: " +
                    selectedCarName;

            }


            // Close details modal

            if (carsModal) {

                carsModal.style.display =
                    "none";

            }


            // Open booking modal

            bookingModal.style.display =
                "flex";


            // Calculate price

            calculatePrice();

        }
    );

}


// ==========================================
// CLOSE BOOKING MODAL
// ==========================================

if (bookingClose && bookingModal) {

    bookingClose.addEventListener(
        "click",
        function () {

            bookingModal.style.display =
                "none";

        }
    );

}


// ==========================================
// CLOSE BOOKING MODAL OUTSIDE
// ==========================================

if (bookingModal) {

    bookingModal.addEventListener(
        "click",
        function (event) {

            if (event.target === bookingModal) {

                bookingModal.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// DATE SETUP
// ==========================================

if (pickupDate && returnDate) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    pickupDate.min =
        today;

    returnDate.min =
        today;


    pickupDate.addEventListener(
        "change",
        function () {

            returnDate.min =
                pickupDate.value;


            if (
                returnDate.value &&
                returnDate.value <
                pickupDate.value
            ) {

                returnDate.value = "";

            }


            calculatePrice();

        }
    );


    returnDate.addEventListener(
        "change",
        function () {

            calculatePrice();

        }
    );

}


// ==========================================
// CALCULATE RENTAL PRICE
// ==========================================

function calculatePrice() {

    if (
        !pickupDate ||
        !returnDate ||
        !rentalDays ||
        !totalPrice
    ) {

        return;

    }


    if (
        !pickupDate.value ||
        !returnDate.value
    ) {

        rentalDays.textContent =
            "0 days";

        totalPrice.textContent =
            "₹0";

        return;

    }


    const pickup =
        new Date(pickupDate.value);

    const returnDay =
        new Date(returnDate.value);


    const difference =
        returnDay - pickup;


    let days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    if (days < 0) {

        rentalDays.textContent =
            "0 days";

        totalPrice.textContent =
            "₹0";

        return;

    }


    // Same-day rental = 1 day

    if (days === 0) {

        days = 1;

    }


    const price =
        days * selectedCarPrice;


    rentalDays.textContent =
        days + " days";


    totalPrice.textContent =
        "₹" +
        price.toLocaleString();

}


// ==========================================
// SUBMIT BOOKING
// ==========================================

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Check car

            if (!selectedCarId) {

                alert(
                    "Please select a car first."
                );

                return;

            }


            // Check dates

            if (
                !pickupDate.value ||
                !returnDate.value
            ) {

                alert(
                    "Please select pickup and return dates."
                );

                return;

            }


            if (
                returnDate.value <
                pickupDate.value
            ) {

                alert(
                    "Return date cannot be before pickup date."
                );

                return;

            }


            // Customer information

            const customerName =
                document.querySelector(
                    "#customerName"
                ).value.trim();


            const customerPhone =
                document.querySelector(
                    "#customerPhone"
                ).value.trim();


            if (
                !customerName ||
                !customerPhone
            ) {

                alert(
                    "Please enter your name and contact number."
                );

                return;

            }


            // Calculate days

            const pickup =
                new Date(pickupDate.value);

            const returnDay =
                new Date(returnDate.value);


            const difference =
                returnDay - pickup;


            let days =
                Math.ceil(
                    difference /
                    (1000 * 60 * 60 * 24)
                );


            if (days === 0) {

                days = 1;

            }


            const finalPrice =
                days * selectedCarPrice;


            // Send booking to Flask

            try {

                const response =
                    await fetch(
                        "/api/bookings",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                car_id:
                                    selectedCarId,

                                customer_name:
                                    customerName,

                                customer_phone:
                                    customerPhone,

                                pickup_date:
                                    pickupDate.value,

                                return_date:
                                    returnDate.value,

                                rental_days:
                                    days,

                                total_price:
                                    finalPrice

                            })

                        }
                    );


                const data =
                    await response.json();


                if (data.success) {

                    alert(
                        "Booking submitted successfully!\n\n" +
                        "Car: " +
                        selectedCarName +
                        "\n" +
                        "Rental Duration: " +
                        days +
                        " days\n" +
                        "Total Price: ₹" +
                        finalPrice.toLocaleString()
                    );


                    bookingForm.reset();


                    rentalDays.textContent =
                        "0 days";


                    totalPrice.textContent =
                        "₹0";


                    bookingModal.style.display =
                        "none";


                } else {

                    alert(
                        "Booking failed: " +
                        data.message
                    );

                }


            } catch (error) {

                console.error(
                    "Booking error:",
                    error
                );


                alert(
                    "Could not connect to the DriveEase server."
                );

            }

        }
    );

}