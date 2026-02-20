// ===== LOAD BOOKINGS FROM BACKEND =====
async function loadBookings() {
    try {
        const response = await fetch("http://127.0.0.1:5000/bookings");
        const bookings = await response.json();

        const tableBody = document.getElementById("bookingTableBody");
        const emptyState = document.getElementById("emptyState");

        tableBody.innerHTML = "";

        if (!bookings || bookings.length === 0) {
            emptyState.classList.remove("d-none");
            return;
        }

        emptyState.classList.add("d-none");

        bookings.forEach(b => {

            let statusClass = "status-pending";
            if (b.status === "APPROVED") statusClass = "status-approved";
            if (b.status === "REJECTED") statusClass = "status-rejected";

            const [date, time] = b.datetime.split("T");

            const row = `
                <tr>
                    <td class="ps-4">
                        <strong>${b.name}</strong><br>
                        <small>${b.email}</small>
                        ${b.message ? `<div class="small text-muted">${b.message}</div>` : ""}
                    </td>
                    <td>${date}</td>
                    <td>${time}</td>
                    <td>${b.people}</td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            ${b.status}
                        </span>
                    </td>
                    <td class="text-end pe-4">
                        <button class="btn btn-success btn-sm me-2"
                            onclick="updateStatus(${b.id}, 'APPROVED')">
                            Approve
                        </button>

                        <button class="btn btn-danger btn-sm"
                            onclick="updateStatus(${b.id}, 'REJECTED')">
                            Reject
                        </button>
                    </td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Backend connection failed:", error);
        alert("Backend not running! Start python app.py");
    }
}


// ===== APPROVE / REJECT =====
async function updateStatus(id, status) {
    try {
        await fetch(`http://127.0.0.1:5000/update-status/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: status })
        });

        loadBookings(); // refresh table
    } catch (error) {
        console.error("Status update failed:", error);
    }
}


// ===== LOGOUT BUTTON =====
document.addEventListener("DOMContentLoaded", () => {

    // load bookings when page opens
    loadBookings();

    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            window.location.href = "admin-login.html";
        });
    }
});