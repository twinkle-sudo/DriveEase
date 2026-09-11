// ================================
// HERO BOOK BUTTON
// ================================

const bookButton =
    document.querySelector(".hero-buttons button");

if (bookButton) {

    bookButton.addEventListener("click", function () {

        window.location.href = "/cars";

    });

}


// ================================
// CAR DETAILS MODAL
// ================================

const detailButtons =
    document.querySelectorAll(".details-button");

const modal =
    document.querySelector("#carModal");

const closeModal =
    document.querySelector(".close-modal");


if (modal && closeModal) {

    const modalCarName =
        document.querySelector("#modalCarName");

    const modalCarPrice =
        document.querySelector("#modalCarPrice");

    const modalCarSpecs =
        document.querySelector("#modalCarSpecs");

    const modalAvailability =
        document.querySelector("#modalAvailability");


    detailButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const carCard =
                button.closest(".car-card");

            const carName =
                carCard.querySelector("h3").textContent;

            const carDetails =
                carCard.querySelectorAll("p");

            const availability =
                carCard.querySelector("span");


            modalCarName.textContent =
                carName;

            modalCarPrice.textContent =
                carDetails[0].textContent;

            modalCarSpecs.textContent =
                carDetails[1].textContent;

            modalAvailability.textContent =
                availability.textContent;


            modal.style.display = "flex";

        });

    });


    closeModal.addEventListener("click", function () {

        modal.style.display = "none";

    });

}


// ================================
// BOOKING MODAL
// ================================

const bookingModal =
    document.querySelector("#bookingModal");

const closeBooking =
    document.querySelector(".close-booking");

const modalBookButton =
    document.querySelector("#modalBookButton");

const selectedCar =
    document.querySelector("#selectedCar");


if (
    bookingModal &&
    closeBooking &&
    modalBookButton &&
    modal &&
    selectedCar
) {

    modalBookButton.addEventListener("click", function () {

        const modalCarName =
            document.querySelector("#modalCarName");

        selectedCar.textContent =
            "Booking: " + modalCarName.textContent;

        modal.style.display = "none";

        bookingModal.style.display = "flex";

    });


    closeBooking.addEventListener("click", function () {

        bookingModal.style.display = "none";

    });

}


// ================================
// BOOKING DATES
// ================================

const pickupDate =
    document.querySelector("#pickupDate");

const returnDate =
    document.querySelector("#returnDate");


if (pickupDate && returnDate) {

    const today =
        new Date().toISOString().split("T")[0];


    pickupDate.min = today;

    returnDate.min = today;


    pickupDate.addEventListener(
        "change",
        function () {

            returnDate.min =
                pickupDate.value;

        }
    );

}


// ================================
// BOOKING FORM
// ================================

const bookingForm =
    document.querySelector("#bookingForm");


if (
    bookingForm &&
    pickupDate &&
    returnDate
) {

    bookingForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (
                returnDate.value <
                pickupDate.value
            ) {

                alert(
                    "Return date cannot be before pickup date."
                );

                return;

            }


            alert(
                "Booking submitted successfully!"
            );

        }
    );

}


// ===============================
// CONTACT FORM
// ===============================

const contactForm = document.querySelector("#contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const contactName =
            document.querySelector("#contactName").value;

        const contactEmail =
            document.querySelector("#contactEmail").value;

        const contactMessage =
            document.querySelector("#contactMessage").value;


        try {

            const response = await fetch(
                "/api/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: contactName,

                        email: contactEmail,

                        message: contactMessage

                    })
                }
            );


            const data = await response.json();


            if (data.success) {

                alert(
                    "Thank you, " +
                    contactName +
                    "!\n\n" +
                    "Your message has been received successfully."
                );

                contactForm.reset();

            } else {

                alert(
                    "Message failed: " +
                    data.message
                );

            }


        } catch (error) {

            console.error(error);

            alert(
                "Could not connect to the DriveEase server."
            );

        }

    });

}