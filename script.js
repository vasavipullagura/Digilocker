/* =====================================================
   VAULTEDU STUDENT DIGITAL LOCKER
===================================================== */


/* =====================================================
   DATA
===================================================== */

let documents =
    JSON.parse(localStorage.getItem("vaultEduDocuments")) || [];

let currentFile = null;


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showRegister() {

    document.getElementById("welcomePage")
        .classList.remove("active");

    document.getElementById("registerPage")
        .classList.add("active");
}


function showWelcome() {

    document.getElementById("registerPage")
        .classList.remove("active");

    document.getElementById("dashboardPage")
        .classList.remove("active");

    document.getElementById("welcomePage")
        .classList.add("active");
}


/* =====================================================
   REGISTRATION
===================================================== */

document
    .getElementById("registrationForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document
                .getElementById("studentName")
                .value
                .trim();

        const email =
            document
                .getElementById("studentEmail")
                .value
                .trim();


        if (!name || !email) {

            showToast("Please enter your name and email.");

            return;
        }


        const student = {
            name: name,
            email: email
        };


        localStorage.setItem(
            "vaultEduStudent",
            JSON.stringify(student)
        );


        initializeDashboard();

        document
            .getElementById("registerPage")
            .classList.remove("active");

        document
            .getElementById("dashboardPage")
            .classList.add("active");


        showToast(
            "Your digital locker has been created!"
        );

    });


/* =====================================================
   INITIALIZE DASHBOARD
===================================================== */

function initializeDashboard() {

    const student =
        JSON.parse(
            localStorage.getItem("vaultEduStudent")
        );


    if (!student) {
        return;
    }


    const firstLetter =
        student.name.charAt(0).toUpperCase();


    document.getElementById("welcomeName")
        .textContent = student.name.split(" ")[0];


    document.getElementById("sidebarName")
        .textContent = student.name;


    document.getElementById("sidebarEmail")
        .textContent = student.email;


    document.getElementById("sidebarAvatar")
        .textContent = firstLetter;


    document.getElementById("headerAvatar")
        .textContent = firstLetter;


    document.getElementById("largeAvatar")
        .textContent = firstLetter;


    document.getElementById("profileName")
        .textContent = student.name;


    document.getElementById("profileEmail")
        .textContent = student.email;


    document.getElementById("infoName")
        .textContent = student.name;


    document.getElementById("infoEmail")
        .textContent = student.email;


    updateDocumentUI();
}


/* =====================================================
   CHECK EXISTING LOGIN
===================================================== */

window.addEventListener("DOMContentLoaded", function() {

    const student =
        localStorage.getItem("vaultEduStudent");


    if (student) {

        initializeDashboard();

        document
            .getElementById("welcomePage")
            .classList.remove("active");

        document
            .getElementById("registerPage")
            .classList.remove("active");

        document
            .getElementById("dashboardPage")
            .classList.add("active");
    }

});


/* =====================================================
   DASHBOARD NAVIGATION
===================================================== */

function showDashboardSection(section, clickedButton) {

    const sections = [
        "overview",
        "documents",
        "profile",
        "security"
    ];


    sections.forEach(function(item) {

        const element =
            document.getElementById(
                item + "Section"
            );

        if (element) {

            element.classList.add(
                "hidden-section"
            );
        }

    });


    const selected =
        document.getElementById(
            section + "Section"
        );


    if (selected) {

        selected.classList.remove(
            "hidden-section"
        );
    }


    document
        .querySelectorAll(".side-link")
        .forEach(function(button) {

            button.classList.remove("active");

        });


    if (clickedButton) {

        clickedButton.classList.add("active");

    } else {

        const buttons =
            document.querySelectorAll(".side-link");

        const index =
            sections.indexOf(section);

        if (buttons[index]) {
            buttons[index].classList.add("active");
        }

    }


    if (section === "documents") {
        renderAllDocuments();
    }

}


/* =====================================================
   UPLOAD MODAL
===================================================== */

function openUploadModal() {

    document
        .getElementById("uploadModal")
        .classList.add("show");

}


function closeUploadModal() {

    document
        .getElementById("uploadModal")
        .classList.remove("show");


    currentFile = null;


    document
        .getElementById("fileInput")
        .value = "";


    document
        .getElementById("documentName")
        .value = "";


    document
        .getElementById("selectedFile")
        .classList.add("hidden");

}


/* =====================================================
   FILE SELECTED
===================================================== */

function fileSelected(input) {

    if (!input.files || !input.files[0]) {
        return;
    }


    currentFile = input.files[0];


    document
        .getElementById("selectedFileName")
        .textContent =
        currentFile.name;


    document
        .getElementById("selectedFile")
        .classList.remove("hidden");


    const nameInput =
        document.getElementById(
            "documentName"
        );


    if (!nameInput.value) {

        nameInput.value =
            currentFile.name
                .replace(/\.[^/.]+$/, "")
                .replace(/[-_]/g, " ");

    }

}


/* =====================================================
   ADD DOCUMENT
===================================================== */

function addDocument() {

    const documentName =
        document
            .getElementById("documentName")
            .value
            .trim();


    const category =
        document
            .getElementById("documentCategory")
            .value;


    if (!documentName) {

        showToast(
            "Please enter a document name."
        );

        return;
    }


    if (!currentFile) {

        showToast(
            "Please choose a file first."
        );

        return;
    }


    const newDocument = {

        id: Date.now(),

        name: documentName,

        fileName: currentFile.name,

        category: category,

        size: formatFileSize(
            currentFile.size
        ),

        rawSize: currentFile.size,

        type: currentFile.type,

        date: new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        )

    };


    documents.unshift(newDocument);


    localStorage.setItem(
        "vaultEduDocuments",
        JSON.stringify(documents)
    );


    closeUploadModal();

    updateDocumentUI();

    showToast(
        "Document saved to your locker!"
    );

}


/* =====================================================
   FORMAT FILE SIZE
===================================================== */

function formatFileSize(bytes) {

    if (bytes === 0) {
        return "0 KB";
    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const i =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        parseFloat(
            (bytes /
                Math.pow(1024, i))
                .toFixed(1)
        )
        +
        " " +
        units[i]
    );

}


/* =====================================================
   DOCUMENT ICON
===================================================== */

function getDocumentIcon(fileName) {

    const extension =
        fileName
            .split(".")
            .pop()
            .toLowerCase();


    if (extension === "pdf") {
        return "fa-file-pdf";
    }


    if (
        extension === "jpg" ||
        extension === "jpeg" ||
        extension === "png"
    ) {
        return "fa-file-image";
    }


    if (
        extension === "doc" ||
        extension === "docx"
    ) {
        return "fa-file-word";
    }


    return "fa-file";
}


/* =====================================================
   UPDATE UI
===================================================== */

function updateDocumentUI() {

    const total =
        documents.length;


    const certificateCount =
        documents.filter(function(doc) {

            return doc.category === "Certificate";

        }).length;


    const totalBytes =
        documents.reduce(function(total, doc) {

            return total + (doc.rawSize || 0);

        }, 0);


    document.getElementById(
        "totalDocuments"
    ).textContent = total;


    document.getElementById(
        "documentCount"
    ).textContent = total;


    document.getElementById(
        "certificateCount"
    ).textContent =
        certificateCount;


    document.getElementById(
        "storageUsed"
    ).textContent =
        formatFileSize(totalBytes);


    renderRecentDocuments();

    renderAllDocuments();

}


/* =====================================================
   RECENT DOCUMENTS
===================================================== */

function renderRecentDocuments() {

    const container =
        document.getElementById(
            "recentDocuments"
        );


    if (documents.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    <i class="fa-solid fa-folder-open"></i>
                </div>

                <h3>Your locker is empty</h3>

                <p>
                    Upload your first document to get started.
                </p>

                <button onclick="openUploadModal()">
                    Upload Document
                </button>

            </div>

        `;

        return;
    }


    const recent =
        documents.slice(0, 5);


    container.innerHTML =
        recent.map(function(doc) {

            return createDocumentRow(doc);

        }).join("");

}


/* =====================================================
   CREATE DOCUMENT ROW
===================================================== */

function createDocumentRow(doc) {

    return `

        <div class="document-row">

            <div class="file-icon">

                <i class="fa-solid
                    ${getDocumentIcon(doc.fileName)}">
                </i>

            </div>


            <div class="document-info">

                <strong>
                    ${escapeHTML(doc.name)}
                </strong>

                <small>
                    ${doc.fileName}
                    •
                    ${doc.size}
                    •
                    ${doc.date}
                </small>

            </div>


            <span class="document-category">
                ${doc.category}
            </span>


            <div class="document-actions">

                <button
                    title="View"
                    onclick="viewDocument(${doc.id})">

                    <i class="fa-regular fa-eye"></i>

                </button>


                <button
                    class="delete"
                    title="Delete"
                    onclick="deleteDocument(${doc.id})">

                    <i class="fa-regular fa-trash-can"></i>

                </button>

            </div>

        </div>

    `;

}


/* =====================================================
   ALL DOCUMENTS
===================================================== */

function renderAllDocuments() {

    const container =
        document.getElementById(
            "allDocuments"
        );


    if (!container) {
        return;
    }


    if (documents.length === 0) {

        container.innerHTML = `

            <div class="empty-state"
                 style="grid-column:1/-1">

                <div class="empty-icon">

                    <i class="fa-solid fa-folder-open"></i>

                </div>

                <h3>No documents yet</h3>

                <p>
                    Your important files will appear here.
                </p>

                <button onclick="openUploadModal()">
                    Add Your First Document
                </button>

            </div>

        `;

        return;
    }


    container.innerHTML =
        documents.map(function(doc) {

            return `

                <div class="document-card">

                    <div class="document-card-top">

                        <div class="document-large-icon">

                            <i class="fa-solid
                                ${getDocumentIcon(doc.fileName)}">
                            </i>

                        </div>

                        <span class="category-badge">
                            ${doc.category}
                        </span>

                    </div>


                    <h3>
                        ${escapeHTML(doc.name)}
                    </h3>


                    <p>
                        ${doc.fileName}
                        •
                        ${doc.size}
                    </p>


                    <div class="document-card-footer">

                        <span>
                            ${doc.date}
                        </span>


                        <div class="card-actions">

                            <button
                                title="View"
                                onclick="viewDocument(${doc.id})">

                                <i class="fa-regular fa-eye"></i>

                            </button>


                            <button
                                title="Delete"
                                onclick="deleteDocument(${doc.id})">

                                <i class="fa-regular fa-trash-can"></i>

                            </button>

                        </div>

                    </div>

                </div>

            `;

        }).join("");

}


/* =====================================================
   SEARCH
===================================================== */

function searchDocuments() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const container =
        document.getElementById(
            "recentDocuments"
        );


    if (!search) {

        renderRecentDocuments();

        return;
    }


    const results =
        documents.filter(function(doc) {

            return (
                doc.name
                    .toLowerCase()
                    .includes(search)

                ||

                doc.fileName
                    .toLowerCase()
                    .includes(search)

                ||

                doc.category
                    .toLowerCase()
                    .includes(search)
            );

        });


    if (results.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i class="fa-solid fa-magnifying-glass"></i>

                </div>

                <h3>No documents found</h3>

                <p>
                    Try searching with another keyword.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        results
            .map(function(doc) {

                return createDocumentRow(doc);

            })
            .join("");

}


/* =====================================================
   DELETE DOCUMENT
===================================================== */

function deleteDocument(id) {

    const documentToDelete =
        documents.find(function(doc) {

            return doc.id === id;

        });


    if (!documentToDelete) {
        return;
    }


    const confirmed =
        confirm(
            `Remove "${documentToDelete.name}" from your locker?`
        );


    if (!confirmed) {
        return;
    }


    documents =
        documents.filter(function(doc) {

            return doc.id !== id;

        });


    localStorage.setItem(
        "vaultEduDocuments",
        JSON.stringify(documents)
    );


    updateDocumentUI();

    showToast(
        "Document removed from your locker."
    );

}


/* =====================================================
   VIEW DOCUMENT
===================================================== */

function viewDocument(id) {

    const doc =
        documents.find(function(item) {

            return item.id === id;

        });


    if (!doc) {
        return;
    }


    alert(
        "Document: " +
        doc.name +
        "\n\n" +

        "File: " +
        doc.fileName +
        "\n" +

        "Category: " +
        doc.category +
        "\n" +

        "Size: " +
        doc.size +
        "\n" +

        "Added: " +
        doc.date +
        "\n\n" +

        "Prototype note: In the full application, " +
        "this button would open the actual stored document."
    );

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    const confirmed =
        confirm(
            "Do you want to logout from your locker?"
        );


    if (!confirmed) {
        return;
    }


    document
        .getElementById("dashboardPage")
        .classList.remove("active");


    document
        .getElementById("welcomePage")
        .classList.add("active");


    showToast(
        "You have been logged out."
    );

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    const messageElement =
        document.getElementById(
            "toastMessage"
        );


    messageElement.textContent =
        message;


    toast.classList.add("show");


    setTimeout(function() {

        toast.classList.remove("show");

    }, 3000);

}


/* =====================================================
   HTML SECURITY
===================================================== */

function escapeHTML(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
===================================================== */

document
    .getElementById("uploadModal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                document.getElementById(
                    "uploadModal"
                )
            ) {

                closeUploadModal();

            }

        }
    );